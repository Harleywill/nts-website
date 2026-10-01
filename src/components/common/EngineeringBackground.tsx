"use client";

import { useEffect, useState } from "react";

/**
 * EngineeringBackground — site-wide "engineer's drawing sheet" watermark.
 *
 * Mounts once in `app/layout.tsx`; renders as a fixed-position layer behind
 * all page content. Composed of:
 *   - A faint drawing grid that fades out towards the centre of the screen
 *   - A drawing-sheet frame inset from the viewport edge, with A–F / 1–8
 *     grid references, like a real A1 sheet
 *   - A tick-ring dial bottom-right
 *   - A supply duct run with airflow arrows top-right
 *   - An AHU with a slowly turning fan bottom-left
 *   - A title block sitting in the frame's bottom-right corner
 *
 * Notes:
 *   - `position: fixed`, `z-index: -10`, `pointer-events: none`, `aria-hidden`.
 *   - Line work stays at the edges; the centre (where text sits) stays clean.
 *   - Frame, AHU and title block hide below 768px for a clean mobile view.
 *   - The fan respects `prefers-reduced-motion`.
 *   - Dark hero sections (e.g. with DuctWaves) cover this completely.
 */

interface EngineeringBackgroundProps {
  /** Master opacity 0–1. Default 1. Lower it on content-heavy pages. */
  opacity?: number;
  /** Hide secondary elements (frame, AHU, title block). Default false. */
  minimal?: boolean;
}

const NAVY = "#1a2f6e";
const GREEN = "#4caf50";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const BASE_BG = "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f7fa 80%)";

// Grid fades out towards the centre so body text sits on a clean surface.
const EDGE_MASK = "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 35%, #000 100%)";

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
        style={{ background: BASE_BG, opacity }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="eng-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: BASE_BG, opacity }}
    >
      {/* Drawing grid — 24px minor, 120px major, faded at the centre */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(26,47,110,0.05) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(26,47,110,0.05) 1px, transparent 1px)",
            "linear-gradient(rgba(26,47,110,0.025) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(26,47,110,0.025) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
          maskImage: EDGE_MASK,
          WebkitMaskImage: EDGE_MASK,
        }}
      />

      {/* SHEET FRAME — trim line, zone band with references, inner border */}
      {!minimal && (
        <div className="eng-bg__hide-mobile absolute" style={{ inset: "12px" }}>
          <div
            className="absolute inset-0"
            style={{ border: `1px solid rgba(26,47,110,0.12)` }}
          />
          <div
            className="absolute"
            style={{ inset: "18px", border: `1px solid rgba(26,47,110,0.22)` }}
          />

          {/* Column references 1–8, top and bottom */}
          {(["top", "bottom"] as const).map((edge) => (
            <div
              key={edge}
              className="absolute flex"
              style={{ left: "18px", right: "18px", [edge]: 0, height: "18px" }}
            >
              {COLS.map((c, i) => (
                <div
                  key={c}
                  className="flex-1 flex items-center justify-center"
                  style={{
                    borderLeft: i === 0 ? "none" : "1px solid rgba(26,47,110,0.14)",
                    color: NAVY,
                    opacity: 0.45,
                    fontFamily: MONO,
                    fontSize: "9px",
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          ))}

          {/* Row references A–F, left and right */}
          {(["left", "right"] as const).map((edge) => (
            <div
              key={edge}
              className="absolute flex flex-col"
              style={{ top: "18px", bottom: "18px", [edge]: 0, width: "18px" }}
            >
              {ROWS.map((r, i) => (
                <div
                  key={r}
                  className="flex-1 flex items-center justify-center"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid rgba(26,47,110,0.14)",
                    color: NAVY,
                    opacity: 0.45,
                    fontFamily: MONO,
                    fontSize: "9px",
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* DIAL — bottom-right, clean tick ring */}
      <svg
        viewBox="0 0 800 800"
        className="absolute"
        style={{
          right: "-300px",
          bottom: "-300px",
          width: "min(1000px, 95vw)",
          height: "min(1000px, 95vw)",
          opacity: 0.32,
        }}
      >
        <g fill="none" stroke={NAVY} strokeWidth="0.9">
          <circle cx="400" cy="400" r="400" opacity="0.5" />
          <circle cx="400" cy="400" r="300" opacity="0.25" />
          <circle cx="400" cy="400" r="200" opacity="0.18" />
          {Array.from({ length: 72 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 72;
            const major = i % 6 === 0;
            const r1 = major ? 362 : 384;
            return (
              <line
                key={i}
                x1={400 + Math.cos(a) * r1}
                y1={400 + Math.sin(a) * r1}
                x2={400 + Math.cos(a) * 400}
                y2={400 + Math.sin(a) * 400}
                strokeWidth={major ? 1.3 : 0.6}
                opacity={major ? 0.55 : 0.3}
              />
            );
          })}
          <line x1="380" y1="400" x2="420" y2="400" opacity="0.5" />
          <line x1="400" y1="380" x2="400" y2="420" opacity="0.5" />
          <circle cx="400" cy="400" r="5" fill={GREEN} stroke="none" opacity="0.6" />
        </g>
      </svg>

      {/* SUPPLY DUCT RUN — top-right, sits below the navbar */}
      <svg
        viewBox="0 0 700 300"
        className="eng-bg__hide-mobile absolute"
        style={{
          right: "40px",
          top: "110px",
          width: "min(560px, 42vw)",
          height: "min(240px, 18vw)",
          opacity: 0.38,
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
          {/* Main run with flanged joints */}
          <rect x="0" y="80" width="520" height="48" />
          {[130, 260, 390].map((x) => (
            <line key={x} x1={x} y1="74" x2={x} y2="134" strokeWidth="1.4" />
          ))}
          {/* Grille spigot */}
          <rect x="190" y="0" width="50" height="80" />
          <g strokeWidth="0.6">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={198} y1={12 + i * 12} x2={232} y2={12 + i * 12} />
            ))}
          </g>
          {/* Radiused bend down to a drop */}
          <path d="M 520 80 Q 580 80 580 140 L 580 300 M 520 128 Q 532 128 532 140 L 532 300" />
          <g stroke={GREEN} strokeWidth="1.4">
            <path d="M 30 104 L 90 104" markerEnd="url(#eng-bg-arrow)" />
            <path d="M 290 104 L 350 104" markerEnd="url(#eng-bg-arrow)" />
            <path d="M 556 200 L 556 260" markerEnd="url(#eng-bg-arrow)" />
          </g>
          <g fill={NAVY} stroke="none" fontSize="11" fontFamily={MONO}>
            <text x="0" y="156">SA duct 600×400</text>
            <text x="0" y="172">1.2 m³/s</text>
          </g>
        </g>
      </svg>

      {/* AHU — bottom-left, fan turns slowly */}
      {!minimal && (
        <svg
          viewBox="0 0 470 190"
          className="eng-bg__hide-mobile absolute"
          style={{
            left: "64px",
            bottom: "72px",
            width: "420px",
            height: "170px",
            opacity: 0.34,
          }}
        >
          <g fill="none" stroke={NAVY} strokeWidth="1">
            <rect x="0" y="0" width="280" height="160" />
            <line x1="70" y1="0" x2="70" y2="160" />
            <line x1="140" y1="0" x2="140" y2="160" />
            <line x1="210" y1="0" x2="210" y2="160" />
            {/* Filter section */}
            <g strokeWidth="0.6">
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={i} x1={8 + i * 8} y1={10} x2={8 + i * 8} y2={150} />
              ))}
            </g>
            {/* Fan section */}
            <circle cx="105" cy="80" r="30" />
            <g className="eng-bg__fan">
              {Array.from({ length: 5 }).map((_, i) => (
                <path
                  key={i}
                  transform={`rotate(${i * 72} 105 80)`}
                  d="M 105 80 Q 112 62 124 56 Q 118 72 107 80 Z"
                  fill="rgba(26,47,110,0.08)"
                  strokeWidth="0.8"
                />
              ))}
            </g>
            <circle cx="105" cy="80" r="3" fill={NAVY} stroke="none" />
            {/* Coil section */}
            <g strokeWidth="0.6">
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={i} x1={145 + i * 8} y1={10} x2={145 + i * 8} y2={150} />
              ))}
            </g>
            {/* Attenuator section */}
            <g strokeWidth="0.6">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line key={i} x1={220} y1={20 + i * 20} x2={270} y2={20 + i * 20} />
              ))}
            </g>
            <rect x="280" y="56" width="180" height="48" />
            <g fill={NAVY} stroke="none" fontSize="10" fontFamily={MONO}>
              <text x="0" y="182">AHU-02 · roof plant</text>
            </g>
          </g>
        </svg>
      )}

      {/* TITLE BLOCK — tucked into the frame's bottom-right corner */}
      {!minimal && (
        <svg
          className="eng-bg__hide-mobile absolute"
          style={{
            right: "31px",
            bottom: "31px",
            width: "240px",
            height: "90px",
            opacity: 0.5,
          }}
          viewBox="0 0 240 90"
        >
          <g fill="rgba(255,255,255,0.6)" stroke={NAVY} strokeWidth="0.8" strokeOpacity="0.6">
            <rect x="0.5" y="0.5" width="239" height="89" />
            <line x1="0" y1="30" x2="240" y2="30" />
            <line x1="0" y1="60" x2="240" y2="60" />
            <line x1="120" y1="30" x2="120" y2="90" />
          </g>
          <g fill={NAVY} fontSize="9" fontFamily={MONO}>
            <text x="8" y="19" fontSize="11" fontWeight="600">NTS LTD · HULL</text>
            <text x="8" y="49">DWG M-201</text>
            <text x="128" y="49">SCALE 1:50</text>
            <text x="8" y="79">MECH SERVICES</text>
            <text x="128" y="79">REV C</text>
          </g>
        </svg>
      )}

      <style jsx>{`
        .eng-bg :global(.eng-bg__fan) {
          transform-box: view-box;
          transform-origin: 105px 80px;
          animation: eng-bg-spin 40s linear infinite;
        }
        @keyframes eng-bg-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .eng-bg :global(.eng-bg__fan) {
            animation: none;
          }
        }
        @media (max-width: 768px) {
          .eng-bg :global(.eng-bg__hide-mobile) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
