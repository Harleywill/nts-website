"use client";

import { useEffect, useRef } from "react";

export interface DuctWavesProps {
  /** Number of stacked wave bands. Default: 6 */
  bands?: number;
  /** Primary color (hex). Default: NTS green */
  primaryColor?: string;
  /** Secondary color (hex). Default: light blue */
  secondaryColor?: string;
  /** Overall opacity multiplier 0-1. Default: 1 */
  opacity?: number;
  /** Animation speed multiplier. Default: 1 */
  speed?: number;
  /** Show travelling pulse dots. Default: true */
  showPulses?: boolean;
  /** Extra className passed to the canvas */
  className?: string;
  /** Extra inline style merged onto the canvas */
  style?: React.CSSProperties;
}

/**
 * DuctWaves — animated air-flow background for hero sections.
 *
 * Layered sine waves with travelling pulse dots, evoking airflow
 * through ventilation ducts. Designed to sit behind dark-gradient
 * hero sections (e.g. NTS gray-900 → gray-800 hero).
 *
 * Behavior:
 * - Canvas-based, GPU-accelerated, ~1-2% CPU at 60fps.
 * - Auto-pauses when the tab is hidden.
 * - Respects `prefers-reduced-motion`: renders a static still frame.
 * - Auto-resizes via ResizeObserver — drop it in any sized container.
 *
 * Usage:
 *   <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 ...">
 *     <div className="absolute inset-0 -z-10 overflow-hidden">
 *       <DuctWaves />
 *     </div>
 *     <h1>Your hero copy</h1>
 *   </section>
 */
export default function DuctWaves({
  bands = 6,
  primaryColor = "#4caf50",
  secondaryColor = "#64b5f6",
  opacity = 1,
  speed = 1,
  showPulses = true,
  className,
  style,
}: DuctWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    let raf = 0;
    let t = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    // Convert hex (#rrggbb) → {r,g,b}; tolerant of #rgb shorthand too.
    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      const m = hex.replace("#", "");
      const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
      return {
        r: parseInt(full.slice(0, 2), 16) || 0,
        g: parseInt(full.slice(2, 4), 16) || 0,
        b: parseInt(full.slice(4, 6), 16) || 0,
      };
    };
    const primary = hexToRgb(primaryColor);
    const secondary = hexToRgb(secondaryColor);
    const rgba = (c: { r: number; g: number; b: number }, a: number) =>
      `rgba(${c.r},${c.g},${c.b},${a * opacity})`;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      const bandH = h / bands;
      const ampMain = 22;
      const ampSlow = 38;

      for (let b = 0; b < bands; b++) {
        const yMid = bandH * b + bandH / 2;
        const phase = t * 0.0018 - b * 0.6;
        const isEven = b % 2 === 0;

        // Wave outline
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y =
            yMid +
            Math.sin(x * 0.006 + phase) * ampMain +
            Math.sin(x * 0.0017 - phase * 0.4) * ampSlow * 0.4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isEven ? rgba(primary, 0.45) : rgba(secondary, 0.35);
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Soft gradient fill below each wave
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y =
            yMid +
            Math.sin(x * 0.006 + phase) * ampMain +
            Math.sin(x * 0.0017 - phase * 0.4) * ampSlow * 0.4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, yMid + bandH * 0.4);
        ctx.lineTo(0, yMid + bandH * 0.4);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, yMid - 30, 0, yMid + bandH * 0.4);
        if (isEven) {
          grad.addColorStop(0, rgba(primary, 0.1));
          grad.addColorStop(1, rgba(primary, 0));
        } else {
          grad.addColorStop(0, rgba(secondary, 0.08));
          grad.addColorStop(1, rgba(secondary, 0));
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Travelling pulse dot — suggests airflow direction
        if (showPulses && !prefersReduced) {
          const dotX = ((t * 0.18 + b * 90) % (w + 60)) - 30;
          const dotY =
            yMid +
            Math.sin(dotX * 0.006 + phase) * ampMain +
            Math.sin(dotX * 0.0017 - phase * 0.4) * ampSlow * 0.4;
          ctx.fillStyle = isEven
            ? `rgba(180,255,200,${0.9 * opacity})`
            : `rgba(180,220,255,${0.9 * opacity})`;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReduced) {
        t += 16 * speed;
        raf = requestAnimationFrame(draw);
      }
    };

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause when tab hidden — saves CPU
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!prefersReduced) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [bands, primaryColor, secondaryColor, opacity, speed, showPulses]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
