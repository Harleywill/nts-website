"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LiveStatsData } from "@/lib/live-stats";
import { SYNC_INTERVAL_HOURS } from "@/lib/live-stats-config";

type Period = "year" | "all";

const STATS = [
  // Equipment has no reliable "date added", so AC units only appear in the all-time view.
  { key: "acUnits", year: "", all: "AC units on our service records" },
  { key: "jobs", year: "Jobs completed in the last 12 months", all: "Jobs completed in total" },
  { key: "services", year: "Services carried out in the last 12 months", all: "Services carried out in total" },
  { key: "customers", year: "Sites served in the last 12 months", all: "Sites served in total" },
] as const;

export default function LiveStatsStrip({ data, variant = "strip" }: { data: LiveStatsData; variant?: "strip" | "hero" }) {
  const hero = variant === "hero";
  const reduceMotion = useReducedMotion();
  const [period, setPeriod] = useState<Period>(data.defaultPeriod);
  // Fixed time zone so the server and the browser render the identical string.
  const updated = new Date(data.updatedAt).toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London",
  });

  const fade = reduceMotion ? 0 : 0.4;
  const rise = reduceMotion ? 0 : 16;

  const controls = (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-1 ${hero ? "" : "justify-center"}`}>
      {/* The site CSS forces every <button> to colour:inherit !important, so the link colour lives on this wrapper. */}
      <div className="text-white transition-colors hover:text-brand-green-400 focus-within:text-brand-green-400">
        <button
          type="button"
          onClick={() => setPeriod((p) => (p === "year" ? "all" : "year"))}
          className="inline-flex min-h-[44px] items-center bg-transparent p-0 text-base/7 font-semibold shadow-none outline-none ring-0 [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none focus-visible:underline active:outline-none"
        >
          {period === "year" ? "View all time" : "View last 12 months"} <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <p aria-live="polite" className="text-sm text-gray-300">
        Showing {period === "year" ? "the last 12 months" : "all time"}
      </p>
    </div>
  );

  const tiles = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.dl
        key={period}
        initial={{ opacity: 0, y: rise }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: fade, ease: "easeOut" }}
        className={`grid gap-8 ${hero ? "" : "text-center"} ${
          period === "year" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {STATS.filter((s) => period === "all" || s.key !== "acUnits").map((s, i) => {
          const value = period === "year" ? data.stats[s.key].lastYear : data.stats[s.key].allTime;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: rise }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: fade + 0.2, delay: reduceMotion ? 0 : 0.08 * i, ease: "easeOut" }}
              className="flex flex-col-reverse gap-1"
            >
              <dt className="text-base/7 text-gray-300">{period === "year" ? s.year : s.all}</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white tabular-nums sm:text-5xl">
                {value.toLocaleString("en-GB")}
              </dd>
            </motion.div>
          );
        })}
      </motion.dl>
    </AnimatePresence>
  );

  const content = (
    <motion.div
      initial={{ opacity: 0, y: rise }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      {controls}
      {tiles}
      <p className={`text-xs text-gray-400 ${hero ? "" : "text-center"}`}>Figures from our job system, refreshed every {SYNC_INTERVAL_HOURS} hours. Last updated {updated}.</p>
    </motion.div>
  );

  if (hero) {
    return (
      <div aria-label="Live company figures" role="region" className="mt-16">
        {content}
      </div>
    );
  }

  return (
    <section aria-label="Live company figures" className="bg-[#1a2f6e] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14">{content}</div>
    </section>
  );
}
