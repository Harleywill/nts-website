import { NextRequest, NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { verifyToken } from "@/lib/auth";

// Initialize GA4 client
function getAnalyticsClient() {
  const keyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}";
  const credentials = JSON.parse(keyString);

  return new BetaAnalyticsDataClient({
    credentials: credentials,
  });
}

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      return NextResponse.json(
        { error: "GA4 Property ID not configured" },
        { status: 500 }
      );
    }

    const analyticsClient = getAnalyticsClient();

    // Fetch real-time users
    const realtimeResponse = await analyticsClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    const realTimeUsers = parseInt(
      realtimeResponse[0].totals?.[0]?.metricValues?.[0]?.value || "0"
    );

    // Fetch page views for today and 7-day trend
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const pageViewsResponse = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: today.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        },
      ],
      metrics: [{ name: "screenPageViews" }],
    });

    const todayPageViews = parseInt(
      pageViewsResponse[0].totals?.[0]?.metricValues?.[0]?.value || "0"
    );

    // Fetch 7-day page views
    const sevenDayResponse = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: sevenDaysAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        },
      ],
      metrics: [{ name: "screenPageViews" }],
    });

    const sevenDayPageViews = parseInt(
      sevenDayResponse[0].totals?.[0]?.metricValues?.[0]?.value || "0"
    );

    // Fetch top pages
    const topPagesResponse = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: sevenDaysAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        },
      ],
      metrics: [{ name: "screenPageViews" }],
      dimensions: [{ name: "pagePath" }],
      orderBys: [
        {
          metric: { metricName: "screenPageViews" },
          desc: true,
        },
      ],
      limit: 5,
    });

    const topPages = topPagesResponse[0].rows?.map((row) => ({
      page: row.dimensionValues?.[0]?.value || "Unknown",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
    })) || [];

    const totalTopPageViews = topPages.reduce((sum, page) => sum + page.views, 0);
    const topPagesWithPercent = topPages.map((page) => ({
      ...page,
      percent:
        totalTopPageViews > 0
          ? Math.round((page.views / totalTopPageViews) * 100)
          : 0,
    }));

    // Fetch traffic sources
    const trafficSourcesResponse = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: sevenDaysAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        },
      ],
      metrics: [{ name: "sessions" }, { name: "users" }],
      dimensions: [{ name: "sessionSource" }],
      orderBys: [
        {
          metric: { metricName: "sessions" },
          desc: true,
        },
      ],
    });

    const trafficSources = trafficSourcesResponse[0].rows?.map((row) => ({
      source: row.dimensionValues?.[0]?.value || "Direct",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0"),
    })) || [];

    const totalUsers = trafficSources.reduce((sum, source) => sum + source.users, 0);
    const trafficSourcesWithPercent = trafficSources.map((source) => ({
      ...source,
      percent:
        totalUsers > 0 ? Math.round((source.users / totalUsers) * 100) : 0,
    }));

    // Fetch session metrics
    const metricsResponse = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: sevenDaysAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        },
      ],
      metrics: [
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "sessions" },
      ],
    });

    const sessionMetrics = {
      avgDuration: parseFloat(
        metricsResponse[0].totals?.[0]?.metricValues?.[0]?.value || "0"
      ),
      bounceRate: parseFloat(
        metricsResponse[0].totals?.[0]?.metricValues?.[1]?.value || "0"
      ),
      totalSessions: parseInt(
        metricsResponse[0].totals?.[0]?.metricValues?.[2]?.value || "0"
      ),
    };

    // Fetch 7-day trend
    const trendResponse = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: sevenDaysAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        },
      ],
      metrics: [{ name: "screenPageViews" }],
      dimensions: [{ name: "date" }],
      orderBys: [
        {
          dimension: { dimensionName: "date" },
          desc: false,
        },
      ],
    });

    const trend = trendResponse[0].rows?.map((row) => {
      const dateStr = row.dimensionValues?.[0]?.value || "";
      const formattedDate = dateStr
        ? `${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`
        : "";
      return {
        date: formattedDate,
        views: parseInt(row.metricValues?.[0]?.value || "0"),
      };
    }) || [];

    return NextResponse.json({
      realTimeUsers,
      pageViews: {
        today: todayPageViews,
        sevenDay: sevenDayPageViews,
        trend,
      },
      topPages: topPagesWithPercent,
      trafficSources: trafficSourcesWithPercent,
      sessionMetrics,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
