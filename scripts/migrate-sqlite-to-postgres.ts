/**
 * One-off: copy every row from the old SQLite database into Postgres.
 *
 *   SQLITE_URL="file:/abs/path/to/dev.db" DATABASE_URL="postgresql://..." \
 *     npx tsx scripts/migrate-sqlite-to-postgres.ts [--wipe]
 *
 * - Reads with a frozen Prisma client generated from prisma/sqlite-source.prisma
 *   (so DateTime/Boolean/enum values are decoded exactly as the app saw them),
 *   writes with the normal Postgres client. IDs are kept.
 * - Refuses to run if the Postgres tables already hold rows (pass --wipe to
 *   empty them first - only ever for a rehearsal database).
 * - Afterwards it resets every auto-increment counter and then compares every
 *   row, field by field, between the two databases. Exits non-zero on any
 *   difference.
 */
import { PrismaClient as PgClient } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient: SqliteClient } = require("../.sqlite-client");

// Parents before children so foreign keys are satisfied.
const MODELS: { model: string; table: string; serialId: boolean }[] = [
  { model: "user", table: "User", serialId: true },
  { model: "project", table: "Project", serialId: true },
  { model: "projectImage", table: "ProjectImage", serialId: true },
  { model: "testimonial", table: "Testimonial", serialId: true },
  { model: "newsItem", table: "NewsItem", serialId: true },
  { model: "newsImage", table: "NewsImage", serialId: true },
  { model: "contactSubmission", table: "ContactSubmission", serialId: true },
  { model: "siteSettings", table: "SiteSettings", serialId: true },
  { model: "liveStat", table: "LiveStat", serialId: false },
  { model: "job", table: "Job", serialId: false },
  { model: "googleReview", table: "GoogleReview", serialId: true },
  { model: "galleryImage", table: "GalleryImage", serialId: true },
  { model: "heroImage", table: "HeroImage", serialId: true },
  { model: "accreditation", table: "Accreditation", serialId: true },
  { model: "dailyStats", table: "DailyStats", serialId: true },
  { model: "application", table: "Application", serialId: false },
  { model: "liveStatSync", table: "LiveStatSync", serialId: false },
];

const wipe = process.argv.includes("--wipe");
const src: any = new SqliteClient({ datasourceUrl: process.env.SQLITE_URL });
const dst: any = new PgClient();

// JSON-stable form of a row: Dates -> ISO strings, keys sorted.
function norm(row: any) {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(row).sort()) {
    const v = row[k];
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return JSON.stringify(out);
}

async function main() {
  if (!process.env.SQLITE_URL || !process.env.DATABASE_URL) throw new Error("set SQLITE_URL and DATABASE_URL");
  if (!process.env.DATABASE_URL.startsWith("postgres")) throw new Error("DATABASE_URL is not a postgres URL");

  // 1. Guard: destination must be empty.
  const existing: Record<string, number> = {};
  for (const { model, table } of MODELS) existing[table] = await dst[model].count();
  const nonEmpty = Object.entries(existing).filter(([, n]) => n > 0);
  if (nonEmpty.length && !wipe) {
    throw new Error(`Postgres already has data (${nonEmpty.map(([t, n]) => `${t}=${n}`).join(", ")}). Refusing. Use --wipe only on a rehearsal DB.`);
  }
  if (nonEmpty.length && wipe) {
    console.log("--wipe: emptying Postgres tables first");
    await dst.$executeRawUnsafe(`TRUNCATE ${MODELS.map((m) => `"${m.table}"`).join(", ")} RESTART IDENTITY CASCADE`);
  }

  // 2. Copy.
  const copied: Record<string, number> = {};
  await dst.$transaction(
    async (tx: any) => {
      for (const { model, table } of MODELS) {
        const rows = await src[model].findMany();
        if (rows.length) await tx[model].createMany({ data: rows });
        copied[table] = rows.length;
        console.log(`copied ${table}: ${rows.length}`);
      }
    },
    { timeout: 120000 }
  );

  // 3. Reset auto-increment counters so new rows don't collide with copied IDs.
  for (const { table, serialId } of MODELS) {
    if (!serialId) continue;
    await dst.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1), (SELECT MAX(id) FROM "${table}") IS NOT NULL)`
    );
  }
  console.log("sequences reset");

  // 4. Verify every row, field by field.
  let bad = 0;
  for (const { model, table } of MODELS) {
    const a: any[] = await src[model].findMany();
    const b: any[] = await dst[model].findMany();
    if (a.length !== b.length) {
      console.error(`MISMATCH ${table}: sqlite ${a.length} rows vs postgres ${b.length}`);
      bad++;
      continue;
    }
    const sa = a.map(norm).sort();
    const sb = b.map(norm).sort();
    const diffs = sa.filter((x, i) => x !== sb[i]).length;
    if (diffs) {
      console.error(`MISMATCH ${table}: ${diffs} row(s) differ`);
      bad++;
    } else {
      console.log(`verified ${table}: ${a.length} row(s) identical`);
    }
  }
  if (bad) throw new Error(`${bad} table(s) failed verification`);
  console.log("ALL TABLES VERIFIED");
}

main()
  .catch((e) => {
    console.error("FAILED:", e.message || e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await src.$disconnect();
    await dst.$disconnect();
  });
