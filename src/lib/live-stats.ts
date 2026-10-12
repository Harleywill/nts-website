import { prisma } from "@/lib/db";
import { STAT_KEYS, StatKey, SYNC_INTERVAL_HOURS } from "@/lib/live-stats-config";

export type LiveStatsData = {
  defaultPeriod: "year" | "all";
  updatedAt: string;
  stats: Record<StatKey, { lastYear: number; allTime: number }>;
};

// Returns null until the first sync has written all four numbers, so the
// homepage hides the strip rather than showing zeros.
export async function getLiveStats(): Promise<LiveStatsData | null> {
  try {
    const [rows, settings] = await Promise.all([
      prisma.liveStat.findMany(),
      prisma.siteSettings.findFirst(),
    ]);
    if (settings && settings.liveStatsEnabled === false) return null;
    if (!STAT_KEYS.every((k) => rows.some((r) => r.key === k))) return null;

    const stats = {} as LiveStatsData["stats"];
    for (const k of STAT_KEYS) {
      const row = rows.find((r) => r.key === k)!;
      stats[k] = { lastYear: row.lastYear, allTime: row.allTime };
    }
    const updatedAt = rows.reduce((latest, r) => (r.updatedAt > latest ? r.updatedAt : latest), rows[0].updatedAt);
    return {
      defaultPeriod: settings?.liveStatsDefaultPeriod === "all" ? "all" : "year",
      updatedAt: updatedAt.toISOString(),
      stats,
    };
  } catch (error) {
    console.error("getLiveStats failed:", error);
    return null;
  }
}

export type LiveStatsSyncStatus = {
  lastRunAt: string | null;
  lastSuccessAt: string | null;
  ok: boolean | null;
  message: string;
  stale: boolean;
};

// "Stale" = no successful sync for 4 sync intervals (24 hours at the 6-hourly schedule).
export async function getLiveStatsSyncStatus(): Promise<LiveStatsSyncStatus> {
  const row = await prisma.liveStatSync.findUnique({ where: { id: 1 } });
  if (!row) return { lastRunAt: null, lastSuccessAt: null, ok: null, message: "The sync has not run yet.", stale: true };
  const staleAfterMs = SYNC_INTERVAL_HOURS * 4 * 60 * 60 * 1000;
  const stale = !row.lastSuccessAt || Date.now() - row.lastSuccessAt.getTime() > staleAfterMs;
  return {
    lastRunAt: row.lastRunAt.toISOString(),
    lastSuccessAt: row.lastSuccessAt ? row.lastSuccessAt.toISOString() : null,
    ok: row.ok,
    message: row.message,
    stale,
  };
}
