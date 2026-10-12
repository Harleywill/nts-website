// Pulls completed-job totals from BigChange and stores them for the homepage.
//
//   npx tsx scripts/sync-bigchange-stats.ts            # real run, writes to the DB
//   npx tsx scripts/sync-bigchange-stats.ts --dry-run  # prints totals, writes nothing
//
// Needs in the environment (server .env, never committed):
//   BIGCHANGE_CLIENT_ID, BIGCHANGE_CLIENT_SECRET   (a READ-ONLY API key)
//   BIGCHANGE_CUSTOMER_ID                          (defaults to 998)
import { PrismaClient } from "@prisma/client";
import { AC_CATEGORY_NAMES, COMPLETED_STATUSES, EXCLUDED_JOB_TYPES, SERVICE_JOB_TYPES } from "../src/lib/live-stats-config";

// Load the site .env when run by hand or from cron (Node 20.12+).
try { (process as any).loadEnvFile(".env"); } catch {}

const BASE = "https://api.bigchange.com";
const CUSTOMER_ID = process.env.BIGCHANGE_CUSTOMER_ID || "998";
const DRY_RUN = process.argv.includes("--dry-run");
const PAGE_SIZE = 1000;
const PAUSE_MS = 250;

const prisma = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const lower = (list: string[]) => new Set(list.map((s) => s.trim().toLowerCase()));
const acCategories = lower(AC_CATEGORY_NAMES);
const excludedTypes = lower(EXCLUDED_JOB_TYPES);
const serviceTypes = lower(SERVICE_JOB_TYPES);

async function getToken(): Promise<string> {
  const id = process.env.BIGCHANGE_CLIENT_ID;
  const secret = process.env.BIGCHANGE_CLIENT_SECRET;
  if (!id || !secret) throw new Error("BIGCHANGE_CLIENT_ID / BIGCHANGE_CLIENT_SECRET not set");
  const resp = await fetch(`${BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
  });
  if (!resp.ok) throw new Error(`token request failed: ${resp.status}`);
  const data: any = await resp.json();
  if (!data.access_token) throw new Error("token response had no access_token");
  return data.access_token;
}

async function api(token: string, path: string, attempt = 1): Promise<any> {
  const resp = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Customer-Id": CUSTOMER_ID },
  });
  if (resp.status === 429 && attempt <= 3) {
    await sleep(61_000);
    return api(token, path, attempt + 1);
  }
  if (!resp.ok) throw new Error(`GET ${path} -> ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  return resp.json();
}

// BigChange refuses a job list without a date range, so this walks half-year
// windows from STATS_SINCE to today and merges the results by job id.
const STATS_SINCE = new Date("2015-01-01T00:00:00Z");
const WINDOW_MONTHS = 6;

async function fetchAll(token: string, path: string): Promise<any[]> {
  const out: any[] = [];
  for (let page = 1; ; page++) {
    const resp = await api(token, `${path}?pageNumber=${page}&pageSize=${PAGE_SIZE}`);
    const items: any[] = resp.items || [];
    out.push(...items);
    if (items.length < PAGE_SIZE) break;
    await sleep(PAUSE_MS);
  }
  return out;
}

async function fetchCompletedJobs(token: string): Promise<any[]> {
  const byId = new Map<string, any>();
  const statuses = COMPLETED_STATUSES.map((s) => `status=${encodeURIComponent(s)}`).join("&");
  const now = new Date();
  for (let from = new Date(STATS_SINCE); from < now; ) {
    const to = new Date(from);
    to.setUTCMonth(to.getUTCMonth() + WINDOW_MONTHS);
    for (let page = 1; ; page++) {
      const resp = await api(
        token,
        `/v1/jobs?${statuses}&startAtFrom=${encodeURIComponent(from.toISOString())}` +
          `&startAtTo=${encodeURIComponent(to.toISOString())}&pageNumber=${page}&pageSize=${PAGE_SIZE}`
      );
      const items: any[] = resp.items || [];
      for (const j of items) byId.set(String(j.id), j);
      if (items.length < PAGE_SIZE) break;
      await sleep(PAUSE_MS);
    }
    console.log(`  ${from.toISOString().slice(0, 10)} -> ${to.toISOString().slice(0, 10)}: running total ${byId.size}`);
    from = to;
    await sleep(PAUSE_MS);
  }
  return [...byId.values()];
}

async function main() {
  console.log(`[live-stats] ${DRY_RUN ? "DRY RUN — " : ""}starting`);
  const token = await getToken();
  const allCompleted = await fetchCompletedJobs(token);
  const jobs = allCompleted.filter((j) => !excludedTypes.has(String(j.typeName || "").trim().toLowerCase()));
  console.log(`  ${allCompleted.length} completed, ${jobs.length} after leaving out internal job types`);
  if (allCompleted.length === 0) throw new Error("BigChange returned no completed jobs — refusing to overwrite stored numbers");

  const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const completedAt = (j: any) => new Date(j.actualEndAt || j.statusModifiedAt || j.plannedEndAt || 0).getTime();
  const inLastYear = (j: any) => completedAt(j) >= yearAgo;
  const typeOf = (j: any) => String(j.typeName || "").trim().toLowerCase();

  const services = jobs.filter((j) => serviceTypes.has(typeOf(j)));
  const customersAll = new Set(jobs.map((j) => j.contactId).filter(Boolean));
  const customersYear = new Set(jobs.filter(inLastYear).map((j) => j.contactId).filter(Boolean));

  // AC units: equipment records in AC product categories that are not sold.
  // The equipment "created" date isn't reliable (bulk imports), so this is a
  // single current figure rather than a per-period one.
  const categories = await fetchAll(token, "/v1/productCategories");
  const acCategoryIds = new Set(categories.filter((c) => acCategories.has(String(c.name).trim().toLowerCase())).map((c) => c.id));
  const products = await fetchAll(token, "/v1/stockDetails");
  const acProductIds = new Set(products.filter((p) => acCategoryIds.has(p.productCategoryId)).map((p) => p.id));
  const equipment = await fetchAll(token, "/v1/stockItems");
  const acUnits = equipment.filter((i) => i.isEquipment && !i.soldAt && acProductIds.has(i.stockDetailsId)).length;
  console.log(`  AC categories matched: ${acCategoryIds.size}/${AC_CATEGORY_NAMES.length}, AC units: ${acUnits}`);

  const typeTally = new Map<string, number>();
  for (const j of jobs) typeTally.set(String(j.typeName), (typeTally.get(String(j.typeName)) || 0) + 1);
  console.log("  completed jobs by type:", [...typeTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([t, n]) => `${t}=${n}`).join("; "));

  const result = {
    acUnits: { allTime: acUnits, lastYear: acUnits },
    jobs: { allTime: jobs.length, lastYear: jobs.filter(inLastYear).length },
    services: { allTime: services.length, lastYear: services.filter(inLastYear).length },
    customers: { allTime: customersAll.size, lastYear: customersYear.size },
  };
  console.log("[live-stats] totals:", JSON.stringify(result));

  if (DRY_RUN) return console.log("[live-stats] dry run — nothing written");

  for (const [key, v] of Object.entries(result)) {
    await prisma.liveStat.upsert({ where: { key }, update: v, create: { key, ...v } });
  }
  console.log("[live-stats] saved");
  const now = new Date();
  const message = `${jobs.length} completed jobs, ${acUnits} AC units`;
  await prisma.liveStatSync.upsert({
    where: { id: 1 },
    update: { lastRunAt: now, lastSuccessAt: now, ok: true, message },
    create: { id: 1, lastRunAt: now, lastSuccessAt: now, ok: true, message },
  });
}

async function recordFailure(message: string) {
  if (DRY_RUN) return;
  const text = message.slice(0, 300);
  await prisma.liveStatSync.upsert({
    where: { id: 1 },
    update: { lastRunAt: new Date(), ok: false, message: text },
    create: { id: 1, lastRunAt: new Date(), ok: false, message: text },
  }).catch(() => {});
}

main()
  .catch(async (err) => {
    console.error("[live-stats] FAILED — leaving the last good numbers in place:", err.message);
    await recordFailure(String(err.message || err));
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
