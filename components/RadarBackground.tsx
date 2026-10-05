"use client";
import { useEffect, useRef } from "react";

type Props = { color?: string; nodeCount?: number; speed?: number };

export default function RadarBackground({
  color = "16,185,129",
  nodeCount = 90,
  speed = 0.5,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const TAU = Math.PI * 2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, angle = 0, last = performance.now();
    let nodes: { x: number; y: number; a: number; glow: number }[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = w / 2, cy = h / 2, maxR = Math.hypot(cx, cy);
      nodes = Array.from({ length: nodeCount }, () => {
        const a = Math.random() * TAU;
        const r = Math.sqrt(Math.random()) * maxR;
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a, glow: reduce ? 0.5 : 0 };
      });
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const step = speed * dt;
      angle = (angle + step) % TAU;
      const cx = w / 2, cy = h / 2, maxR = Math.hypot(cx, cy);

      ctx.clearRect(0, 0, w, h);

      // rings + crosshair
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${color},0.07)`;
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxR / 5) * i, 0, TAU);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
      ctx.moveTo(0, cy); ctx.lineTo(w, cy);
      ctx.stroke();

      // sweep trail
      const slices = 28, trail = 0.9;
      for (let i = 0; i < slices; i++) {
        const a1 = angle - (trail / slices) * i;
        const a0 = a1 - trail / slices;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, a0, a1);
        ctx.closePath();
        ctx.fillStyle = `rgba(${color},${0.1 * (1 - i / slices)})`;
        ctx.fill();
      }
      // sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.strokeStyle = `rgba(${color},0.55)`;
      ctx.stroke();

      // nodes
      for (const n of nodes) {
        const d = (((angle - n.a) % TAU) + TAU) % TAU;
        if (!reduce && d <= step + 0.02) n.glow = 1;
        n.glow = Math.max(0, n.glow - dt * 0.35);
        const g = n.glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5 + g * 2.5, 0, TAU);
        ctx.fillStyle = `rgba(${color},${0.15 + g * 0.85})`;
        ctx.shadowColor = `rgba(${color},${g})`;
        ctx.shadowBlur = g * 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, nodeCount, speed]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0 }} aria-hidden />;
}