import { getLiveStats } from "@/lib/live-stats";
import LiveStatsStrip from "./LiveStatsStrip";

// Hidden until the first BigChange sync has run, so visitors never see zeros.
export default async function LiveStats() {
  const data = await getLiveStats();
  if (!data) return null;
  return <LiveStatsStrip data={data} />;
}
