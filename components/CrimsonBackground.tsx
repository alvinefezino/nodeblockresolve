'use client';

import { useEffect, useRef } from 'react';

export type BackgroundMode = 'globe' | 'flow' | 'embers' | 'warp';

interface CrimsonBackgroundProps {
  /** Which animation to render. Defaults to the 3D globe. */
  mode?: BackgroundMode;
}

type Vec3 = [number, number, number];
interface Particle { x: number; y: number; l: number }
interface Ember { x: number; y: number; v: number; s: number; p: number }
interface Star { x: number; y: number; z: number }

/** Reads a hex color from a CSS variable on :root, falling back if it is missing or not hex. */
function readColor(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw) ? raw : fallback;
}

/** "#e11d48" -> "225,29,72" so it can be dropped into rgba(...) strings. */
function toRgb(hex: string): string {
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export default function CrimsonBackground({ mode = 'globe' }: CrimsonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Colors come from globals.css (--background, --accent, --accent-soft)
    const bgHex = readColor('--background', '#120609');
    const BG = toRgb(bgHex);
    const R = toRgb(readColor('--accent', '#e11d48'));
    const P = toRgb(readColor('--accent-soft', '#fb7185'));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    let T = 0;
    let raf = 0;
    let pts: Vec3[] = [];
    let parts: Particle[] = [];
    let em: Ember[] = [];
    let stars: Star[] = [];

    const mkE = (randomY: boolean): Ember => ({
      x: Math.random() * W,
      y: randomY ? Math.random() * H : H + 10,
      v: 0.3 + Math.random() * 0.9,
      s: 1 + Math.random() * 2.2,
      p: Math.random() * 6,
    });

    const mkS = (randomZ: boolean): Star => ({
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: randomZ ? Math.random() * W : W,
    });

    const init = () => {
      pts = [];
      const n = 140;
      for (let i = 0; i < n; i++) {
        const y = 1 - (2 * (i + 0.5)) / n;
        const r = Math.sqrt(1 - y * y);
        const a = i * 2.399963;
        pts.push([Math.cos(a) * r, y, Math.sin(a) * r]);
      }
      parts = [];
      for (let i = 0; i < 700; i++) {
        parts.push({ x: Math.random() * W, y: Math.random() * H, l: Math.random() * 200 });
      }
      em = [];
      for (let i = 0; i < 90; i++) em.push(mkE(true));
      stars = [];
      for (let i = 0; i < 260; i++) stars.push(mkS(true));
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, W, H);
    };

    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const globe = () => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const R0 = Math.min(W, H) * 0.38;
      const a = T * 0.004;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const tilt = 0.35;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);

      const pr: Vec3[] = pts.map((p) => {
        const X = p[0] * ca + p[2] * sa;
        const Z = -p[0] * sa + p[2] * ca;
        const Y = p[1] * ct - Z * st;
        const Z2 = p[1] * st + Z * ct;
        return [cx + X * R0, cy + Y * R0, Z2];
      });

      ctx.lineWidth = 1;
      const maxD = R0 * 0.32 * (R0 * 0.32);
      for (let i = 0; i < pr.length; i++) {
        for (let j = i + 1; j < pr.length; j++) {
          const dx = pr[i][0] - pr[j][0];
          const dy = pr[i][1] - pr[j][1];
          if (dx * dx + dy * dy < maxD) {
            const al = 0.05 + 0.22 * ((pr[i][2] + pr[j][2] + 2) / 4);
            ctx.strokeStyle = `rgba(${R},${al})`;
            ctx.beginPath();
            ctx.moveTo(pr[i][0], pr[i][1]);
            ctx.lineTo(pr[j][0], pr[j][1]);
            ctx.stroke();
          }
        }
      }
      pr.forEach((p) => {
        const d = (p[2] + 1) / 2;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1 + d * 2.4, 0, 6.283);
        ctx.fillStyle = `rgba(${P},${0.2 + d * 0.8})`;
        ctx.fill();
      });
    };

    const flow = () => {
      ctx.fillStyle = `rgba(${BG},.07)`;
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1;
      parts.forEach((p) => {
        const a = Math.sin(p.x * 0.0035 + T * 0.002) * 2 + Math.cos(p.y * 0.004 - T * 0.0015) * 2;
        const nx = p.x + Math.cos(a) * 1.6;
        const ny = p.y + Math.sin(a) * 1.6;
        ctx.strokeStyle = `rgba(${R},.55)`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        p.l--;
        if (p.l < 0 || nx < 0 || nx > W || ny < 0 || ny > H) {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
          p.l = 100 + Math.random() * 200;
        }
      });
    };

    const embers = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < em.length; i++) {
        const e = em[i];
        e.y -= e.v;
        e.x += Math.sin(T * 0.02 + e.p) * 0.4;
        const f = 0.5 + 0.5 * Math.sin(T * 0.05 + e.p);
        const al = Math.min(1, ((H - e.y) / H) * 1.6 + 0.2) * (0.35 + f * 0.65);
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.s * 5);
        g.addColorStop(0, `rgba(${P},${al})`);
        g.addColorStop(0.35, `rgba(${R},${al * 0.5})`);
        g.addColorStop(1, `rgba(${R},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.s * 5, 0, 6.283);
        ctx.fill();
        if (e.y < -10) em[i] = mkE(false);
      }
    };

    const warp = () => {
      ctx.fillStyle = `rgba(${BG},.35)`;
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const pz = s.z;
        s.z -= 6;
        if (s.z <= 1) {
          stars[i] = mkS(false);
          continue;
        }
        const k = W * 0.5;
        const sx = cx + (s.x / s.z) * k;
        const sy = cy + (s.y / s.z) * k;
        const px = cx + (s.x / pz) * k;
        const py = cy + (s.y / pz) * k;
        const al = 1 - s.z / W;
        if (sx < 0 || sx > W || sy < 0 || sy > H) {
          stars[i] = mkS(false);
          continue;
        }
        ctx.strokeStyle = `rgba(${P},${0.25 + al * 0.75})`;
        ctx.lineWidth = 0.6 + al * 1.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
    };

    const draw = { globe, flow, embers, warp }[mode];

    const tick = () => {
      T++;
      draw();
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', size);
    size();
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
    };
  }, [mode]);

  return (
    <div className="aurora-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}