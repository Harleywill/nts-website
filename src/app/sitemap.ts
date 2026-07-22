import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ntslimited.org";

// Regenerate at most once per hour so new news/projects appear without a redeploy.
export const revalidate = 3600;

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/plumbing-heating", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/domestic-commercial-servicing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/air-conditioning", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/rpz-testing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/hull", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
  { path: "/news", priority: 0.7, changeFrequency: "weekly" },
  { path: "/case-studies/foredyke-school", priority: 0.7, changeFrequency: "monthly" },
  { path: "/testimonials", priority: 0.6, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const [projects, news] = await Promise.all([
      prisma.project.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.newsItem.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
      }),
    ]);

    for (const project of projects) {
      entries.push({
        url: `${siteUrl}/projects/${project.id}`,
        lastModified: project.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const item of news) {
      entries.push({
        url: `${siteUrl}/news/${item.id}`,
        lastModified: item.updatedAt,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch (error) {
    // If the DB is unavailable, still serve the static routes.
    console.error("Sitemap: failed to load dynamic routes:", error);
  }

  return entries;
}
