import { prisma } from "@/lib/db";
import { STAT_KEYS, StatKey } from "@/lib/live-stats-config";

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
