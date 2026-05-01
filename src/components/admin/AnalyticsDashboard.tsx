"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  realTimeUsers: number;
  pageViews: {
    today: number;
    sevenDay: number;
    trend: Array<{ date: string; views: number }>;
  };
  topPages: Array<{
    page: string;
    views: number;
    percent: number;
  }>;
  trafficSources: Array<{
    source: string;
    users: number;
    sessions: number;
    percent: number;
  }>;
  sessionMetrics: {
    avgDuration: number;
    bounceRate: number;
    totalSessions: number;
  };
  lastUpdated: string;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analytics", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
        </div>
        <div className="flex justify-center py-8">
          <div className="text-gray-600">Loading analytics data...</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="mt-1 text-sm text-gray-600">
            Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Real-time Users */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Real-time Visitors</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{data.realTimeUsers}</p>
          <p className="mt-2 text-xs text-gray-500">Currently on site</p>
        </div>

        {/* Page Views Today */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Page Views (Today)</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{data.pageViews.today}</p>
          <p className="mt-2 text-xs text-gray-500">Pages viewed</p>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Sessions (7 days)</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">{data.sessionMetrics.totalSessions}</p>
          <p className="mt-2 text-xs text-gray-500">Total sessions</p>
        </div>

        {/* Bounce Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 font-medium">Bounce Rate</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">
            {data.sessionMetrics.bounceRate.toFixed(1)}%
          </p>
          <p className="mt-2 text-xs text-gray-500">7-day average</p>
        </div>
      </div>

      {/* Page Views Trend Chart (simple bar representation) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Traffic Trend</h3>
        <div className="flex items-end gap-2 h-48">
          {data.pageViews.trend.map((day, index) => {
            const maxViews = Math.max(...data.pageViews.trend.map((d) => d.views), 1);
            const height = (day.views / maxViews) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${day.views} views`}
                />
                <p className="text-xs text-gray-600">{day.date}</p>
                <p className="text-xs font-medium text-gray-900">{day.views}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Pages and Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages (7 days)</h3>
          <div className="space-y-4">
            {data.topPages.map((page, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-700">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2"
                        style={{ width: `${page.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{page.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources (7 days)</h3>
          <div className="space-y-4">
            {data.trafficSources.map((source, index) => {
              const colors = ["bg-blue-100", "bg-purple-100", "bg-pink-100", "bg-yellow-100", "bg-red-100"];
              const textColors = ["text-blue-700", "text-purple-700", "text-pink-700", "text-yellow-700", "text-red-700"];
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 ${colors[index % 5]} rounded-full flex items-center justify-center`}>
                    <span className={`text-sm font-semibold ${textColors[index % 5]}`}>
                      {source.source[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{source.source}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2"
                          style={{ width: `${source.percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{source.users} users</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Session Duration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Average Session Duration</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Math.round(data.sessionMetrics.avgDuration)}s
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Page Views (7 days)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.pageViews.sevenDay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
