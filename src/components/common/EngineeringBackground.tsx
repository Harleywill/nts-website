"use client";

import { useEffect, useState } from "react";

/**
 * EngineeringBackground — site-wide "engineer's drawing" watermark.
 *
 * Drop-in replacement for the old crosshatch body background. Mounts once
 * in `app/layout.tsx`; renders as a fixed-position SVG layer behind all
 * page content. Composed of:
 *   - A large anchor dial bottom-right (compass + fan blades)
 *   - A small satellite dial top-left
 *   - A duct schematic with airflow arrows top-right
 *   - An AHU unit bottom-left
 *   - Two dimension lines
 *   - A drawing title block bottom-right corner
 *
 * Notes:
 *   - `position: fixed` — stays in viewport while content scrolls.
 *   - `z-index: -10` — guaranteed to sit behind everything.
 *   - `pointer-events: none` — never intercepts clicks.
 *   - `aria-hidden` — invisible to screen readers.
 *   - Drawing clutter (AHU, dimension lines, title block, satellite dial)
 *     auto-hides below 768px so mobile gets a clean composition.
 *   - Dark hero sections (e.g. with DuctWaves) cover this completely — no
 *     conflict; the watermark just shows on lighter sections of the page.
 *
 * Props let you tune density per page if needed, but defaults match the
 * "Maximal" design we settled on.
 */

interface EngineeringBackgroundProps {
  /** Master opacity 0–1. Default 1. Lower it on content-heavy pages. */
  opacity?: number;
  /** Hide secondary elements (AHU, dimension lines, title block). Default false. */
  minimal?: boolean;
}

const NAVY = "#1a2f6e";
const GREEN = "#4caf50";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function EngineeringBackground({
  opacity = 1,
  minimal = false,
}: EngineeringBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f7fa 80%)",
          opacity,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="eng-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f7fa 80%)",
        opacity,
      }}
    >
      {/* Pinstripe undertone */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 6px, rgba(15,23,42,0.018) 6px, rgba(15,23,42,0.018) 7px)",
        }}
      />

      {/* BIG ANCHOR DIAL — bottom-right */}
      <svg
        viewBox="0 0 800 800"
        className="absolute"
        style={{
          right: "-280px",
          bottom: "-280px",
          width: "min(1100px, 95vw)",
          height: "min(1100px, 95vw)",
          opacity: 0.42,
        }}
      >
        <g fill="none" stroke={NAVY} strokeWidth="0.9">
          {[200, 280, 360, 400].map((r) => (
            <circle
              key={r}
              cx="400"
              cy="400"
              r={r}
              opacity={r === 400 ? 0.5 : 0.25}
            />
          ))}
          <circle cx="400" cy="400" r="40" stroke={GREEN} strokeWidth="1.4" opacity="0.6" />
          <circle cx="400" cy="400" r="6" fill={GREEN} stroke="none" opacity="0.7" />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 60;
            const major = i % 5 === 0;
            const r1 = major ? 360 : 380;
            return (
              <line
                key={i}
                x1={400 + Math.cos(a) * r1}
                y1={400 + Math.sin(a) * r1}
                x2={400 + Math.cos(a) * 400}
                y2={400 + Math.sin(a) * 400}
                strokeWidth={major ? 1.4 : 0.7}
                opacity={major ? 0.5 : 0.3}
              />
            );
          })}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const a = (deg * Math.PI) / 180 - Math.PI / 2;
            return (
              <text
                key={deg}
                x={400 + Math.cos(a) * 330}
                y={400 + Math.sin(a) * 330 + 4}
                textAnchor="middle"
                fill={NAVY}
                opacity="0.4"
                fontSize="14"
                fontFamily={MONO}
              >
                {deg}°
              </text>
            );
          })}
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 60} 400 400)`}>
              <path
                d="M 400 400 Q 450 340 490 320 Q 460 380 420 400 Z"
                fill="rgba(26,47,110,0.06)"
                stroke={NAVY}
                strokeOpacity="0.35"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* SATELLITE DIAL — top-left (desktop only) */}
      {!minimal && (
        <svg
          viewBox="0 0 400 400"
          className="eng-bg__hide-mobile absolute"
          style={{
            left: "-120px",
            top: "-120px",
            width: "300px",
            height: "300px",
            opacity: 0.32,
          }}
        >
          <g fill="none" stroke={NAVY} strokeWidth="0.8">
            <circle cx="200" cy="200" r="160" />
            <circle cx="200" cy="200" r="120" opacity="0.5" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 24;
              return (
                <line
                  key={i}
                  x1={200 + Math.cos(a) * 150}
                  y1={200 + Math.sin(a) * 150}
                  x2={200 + Math.cos(a) * 160}
                  y2={200 + Math.sin(a) * 160}
                />
              );
            })}
          </g>
        </svg>
      )}

      {/* DUCT ASSEMBLY — top-right */}
      <svg
        viewBox="0 0 700 320"
        className="eng-bg__hide-mobile absolute"
        style={{
          right: "0px",
          top: "40px",
          width: "min(640px, 50vw)",
          height: "min(290px, 23vw)",
          opacity: 0.4,
        }}
      >
        <defs>
          <marker
            id="eng-bg-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 Z" fill={GREEN} />
          </marker>
        </defs>
        <g fill="none" stroke={NAVY} strokeWidth="1">
          <rect x="0" y="80" width="500" height="48" />
          <rect x="160" y="0" width="60" height="80" />
          <path d="M 500 80 L 540 80 L 540 280 L 620 280 L 620 320 L 540 320 L 540 128 L 500 128" />
          <g strokeWidth="0.7">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={170} y1={12 + i * 12} x2={210} y2={12 + i * 12} />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={555 + i * 14} y1={290} x2={555 + i * 14} y2={310} />
            ))}
          </g>
          <g stroke={GREEN} strokeWidth="1.4">
            <path d="M 40 104 L 100 104" markerEnd="url(#eng-bg-arrow)" />
            <path d="M 200 104 L 260 104" markerEnd="url(#eng-bg-arrow)" />
            <path d="M 360 104 L 420 104" markerEnd="url(#eng-bg-arrow)" />
          </g>
          <g fill={NAVY} fontSize="11" fontFamily={MONO}>
            <text x="0" y="160">DN—125 supply</text>
            <text x="0" y="176">12 m³/min</text>
          </g>
        </g>
      </svg>

      {/* AHU UNIT — bottom-left (extras only) */}
      {!minimal && (
        <svg
          viewBox="0 0 480 180"
          className="eng-bg__hide-mobile absolute"
          style={{
            left: "60px",
            bottom: "120px",
            width: "480px",
            height: "180px",
            opacity: 0.36,
          }}
        >
          <g fill="none" stroke={NAVY} strokeWidth="1">
            <rect x="0" y="0" width="280" height="160" />
            <line x1="70" y1="0" x2="70" y2="160" />
            <line x1="140" y1="0" x2="140" y2="160" />
            <line x1="210" y1="0" x2="210" y2="160" />
            <circle cx="105" cy="80" r="32" />
            <g strokeWidth="0.8">
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i * Math.PI) / 3;
                return (
                  <line
                    key={i}
                    x1={105}
                    y1={80}
                    x2={105 + Math.cos(a) * 30}
                    y2={80 + Math.sin(a) * 30}
                  />
                );
              })}
            </g>
            <g strokeWidth="0.6">
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={i} x1={145 + i * 8} y1={10} x2={145 + i * 8} y2={150} />
              ))}
            </g>
            <g strokeWidth="0.6">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line key={i} x1={220} y1={20 + i * 20} x2={270} y2={20 + i * 20} />
              ))}
            </g>
            <rect x="280" y="60" width="180" height="40" />
            <g fill={NAVY} fontSize="10" fontFamily={MONO}>
              <text x="0" y="178">AHU—02 · Roof plant</text>
            </g>
          </g>
        </svg>
      )}

      {/* DIMENSION LINES — middle area (extras only) */}
      {!minimal && (
        <svg
          className="eng-bg__hide-mobile absolute"
          style={{ left: "12vw", top: "42vh", width: "30vw", height: "20px" }}
          viewBox="0 0 480 20"
          preserveAspectRatio="none"
        >
          <g stroke={NAVY} strokeWidth="0.6" opacity="0.3">
            <line x1="0" y1="10" x2="480" y2="10" />
            <line x1="0" y1="0" x2="0" y2="20" />
            <line x1="480" y1="0" x2="480" y2="20" />
          </g>
          <text
            x="240"
            y="6"
            fill={NAVY}
            fontSize="10"
            fontFamily={MONO}
            textAnchor="middle"
            opacity="0.4"
          >
            2400 mm
          </text>
        </svg>
      )}

      {/* TITLE BLOCK — bottom-right corner (extras only, desktop) */}
      {!minimal && (
        <svg
          className="eng-bg__hide-mobile absolute"
          style={{
            right: "24px",
            bottom: "24px",
            width: "240px",
            height: "100px",
            opacity: 0.42,
          }}
          viewBox="0 0 240 100"
        >
          <g fill="none" stroke={NAVY} strokeWidth="0.8">
            <rect x="0" y="0" width="240" height="100" />
            <line x1="0" y1="36" x2="240" y2="36" />
            <line x1="0" y1="68" x2="240" y2="68" />
            <line x1="120" y1="0" x2="120" y2="100" />
            <g fill={NAVY} fontSize="9" fontFamily={MONO}>
              <text x="6" y="20">NTS-LTD</text>
              <text x="126" y="20">SHEET 04 / 12</text>
              <text x="6" y="52">DWG: HVAC-PLAN</text>
              <text x="126" y="52">SCALE 1:50</text>
              <text x="6" y="84">REV. C</text>
            </g>
          </g>
        </svg>
      )}

      {/* Responsive: hide secondary elements on small screens */}
      <style jsx>{`
        @media (max-width: 768px) {
          .eng-bg :global(.eng-bg__hide-mobile) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
