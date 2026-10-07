"use client";

import { useEffect, useRef } from "react";

export interface Model3D { atoms: [number, number, number, string][]; bonds: [number, number, number][] }

const COLOR: Record<string, string> = {
  C: "#5b7a8c", H: "#e8eef2", O: "#ef5a3c", N: "#3fa8ee", S: "#f2c14e", Cl: "#3dd68c", F: "#4fd1c5",
  P: "#f59e0b", Na: "#a78bfa", K: "#a78bfa", Ca: "#a78bfa",
};
const COLOR_LIGHT: Record<string, string> = { ...COLOR, C: "#24343d", H: "#cfd9df" };
const RADIUS: Record<string, number> = { H: 0.24, C: 0.4, N: 0.4, O: 0.4, F: 0.36, S: 0.52, Cl: 0.5, P: 0.5, Na: 0.6, K: 0.66, Ca: 0.62 };

/**
 * Dependency-free 3D ball-and-stick renderer (Canvas 2D with perspective projection and depth sorting).
 * Auto-rotates, can be dragged, pauses off-screen, and renders a still frame under reduced motion.
 */
export function Molecule3D({
  model, theme = "dark", className = "", label, hydrogens = true, speed = 1, glow = true, interactive = true, variant = "ball", follow = false,
}: { model: Model3D; theme?: "dark" | "light"; className?: string; label: string; hydrogens?: boolean; speed?: number; glow?: boolean; interactive?: boolean; variant?: "ball" | "line"; follow?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const palette = theme === "dark" ? COLOR : COLOR_LIGHT;

    // Prepare geometry: optionally drop hydrogens, centre on centroid, normalise size
    const keep = model.atoms.map((a) => hydrogens || a[3] !== "H");
    const idx: number[] = [];
    model.atoms.forEach((_, i) => { if (keep[i]) idx.push(i); });
    const remap = new Map(idx.map((o, n) => [o, n]));
    const atoms = idx.map((i) => model.atoms[i]);
    const bonds = model.bonds.filter(([a, b]) => keep[a] && keep[b]).map(([a, b, o]) => [remap.get(a)!, remap.get(b)!, o] as const);
    const c = atoms.reduce((s, a) => [s[0] + a[0], s[1] + a[1], s[2] + a[2]], [0, 0, 0]).map((v) => v / atoms.length);
    const pts = atoms.map((a) => [a[0] - c[0], a[1] - c[1], a[2] - c[2]]);
    const extent = Math.max(...pts.map((p) => Math.hypot(p[0], p[1], p[2]))) || 1;

    let rx = -0.35, ry = 0.6, vx = 0, vy = 0.0045 * speed;
    // Optional "follow": the model leans gently toward the pointer (eased), on top of its own rotation
    let tiltX = 0, tiltY = 0, tiltTX = 0, tiltTY = 0;
    const canFollow = follow && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let dragging = false, lastX = 0, lastY = 0, raf = 0, visible = true, w = 0, h = 0, dpr = 1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      draw();
    };

    function draw() {
      if (!ctx || !w) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const scale = (Math.min(w, h) * (variant === "line" ? 0.46 : 0.42)) / extent;
      const ax = rx + tiltX, ay = ry + tiltY;
      const cosX = Math.cos(ax), sinX = Math.sin(ax), cosY = Math.cos(ay), sinY = Math.sin(ay);
      const D = extent * 4;
      const proj = pts.map(([x, y, z]) => {
        const x1 = x * cosY + z * sinY, z1 = -x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX, z2 = y * sinX + z1 * cosX;
        const f = D / (D - z2);
        return { x: w / 2 + x1 * scale * f, y: h / 2 - y2 * scale * f, z: z2, f };
      });
      type Item = { z: number; kind: 0 | 1; i: number };
      const items: Item[] = [];
      bonds.forEach((_, i) => items.push({ z: (proj[bonds[i][0]].z + proj[bonds[i][1]].z) / 2 - 0.01, kind: 0, i }));
      proj.forEach((p, i) => items.push({ z: p.z, kind: 1, i }));
      items.sort((a, b) => a.z - b.z);

      for (const it of items) {
        const depth = 0.55 + 0.45 * ((it.z / extent + 1) / 2); // 0.55 far → 1 near
        if (variant === "line") {
          const fade = 0.4 + 0.6 * ((it.z / extent + 1) / 2);
          if (it.kind === 0) {
            const [a, b, order] = bonds[it.i];
            const pa = proj[a], pb = proj[b];
            const dx = pb.x - pa.x, dy = pb.y - pa.y, len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len, ny = dx / len;
            const offsets = order === 2 ? [-2.2, 2.2] : order === 3 ? [-3.4, 0, 3.4] : [0];
            ctx.globalAlpha = fade;
            ctx.strokeStyle = theme === "dark" ? "#e6f0fa" : "#0b1a2a";
            ctx.lineWidth = (order > 1 ? 1.5 : 2) * ((pa.f + pb.f) / 2);
            ctx.lineCap = "round";
            for (const o of offsets) { ctx.beginPath(); ctx.moveTo(pa.x + nx * o, pa.y + ny * o); ctx.lineTo(pb.x + nx * o, pb.y + ny * o); ctx.stroke(); }
          } else {
            const p = proj[it.i];
            const el = atoms[it.i][3];
            const hetero = el !== "C" && el !== "H";
            const r = (hetero ? 5.2 : 2.6) * p.f;
            ctx.globalAlpha = fade;
            ctx.fillStyle = hetero ? (palette[el] ?? "#94a3b8") : theme === "dark" ? "#e6f0fa" : "#0b1a2a";
            ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
          }
          continue;
        }
        if (it.kind === 0) {
          const [a, b, order] = bonds[it.i];
          const pa = proj[a], pb = proj[b];
          const lw = Math.max(1.2, scale * 0.09 * ((pa.f + pb.f) / 2));
          const dx = pb.x - pa.x, dy = pb.y - pa.y, len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len, ny = dx / len;
          const offsets = order === 2 ? [-1, 1] : order === 3 ? [-1.6, 0, 1.6] : [0];
          ctx.globalAlpha = depth;
          ctx.strokeStyle = theme === "dark" ? "rgba(169,191,203,0.75)" : "rgba(36,52,61,0.55)";
          ctx.lineWidth = order > 1 ? lw * 0.55 : lw;
          ctx.lineCap = "round";
          for (const o of offsets) {
            const ox = nx * o * lw * 0.75, oy = ny * o * lw * 0.75;
            ctx.beginPath(); ctx.moveTo(pa.x + ox, pa.y + oy); ctx.lineTo(pb.x + ox, pb.y + oy); ctx.stroke();
          }
        } else {
          const p = proj[it.i];
          const el = atoms[it.i][3];
          const r = (RADIUS[el] ?? 0.45) * scale * 0.62 * p.f;
          const col = palette[el] ?? "#94a3b8";
          ctx.globalAlpha = depth;
          if (glow && theme === "dark" && el !== "C" && el !== "H") { ctx.shadowColor = col; ctx.shadowBlur = r * 1.6; } else { ctx.shadowBlur = 0; }
          const g = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.1, p.x, p.y, r);
          g.addColorStop(0, "#ffffff");
          g.addColorStop(0.25, col);
          g.addColorStop(1, shade(col, theme === "dark" ? -0.55 : -0.35));
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;
    }

    const loop = () => {
      if (!dragging) { ry += vy; rx += vx; vx *= 0.95; if (Math.abs(vy) > 0.0045 * speed * 1.02) vy *= 0.97; }
      if (canFollow) { tiltX += (tiltTX - tiltX) * 0.045; tiltY += (tiltTY - tiltY) * 0.045; }
      draw();
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const down = (e: PointerEvent) => { if (!interactive) return; dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (canFollow) { tiltTY = (e.clientX / window.innerWidth - 0.5) * 0.9; tiltTX = (e.clientY / window.innerHeight - 0.5) * 0.6; }
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
      ry += dx * 0.01; rx += dy * 0.01; vy = dx * 0.002 || vy; vx = dy * 0.002;
      if (reduce) draw();
    };
    const up = () => { dragging = false; if (Math.abs(vy) < 0.002) vy = 0.0045 * speed * Math.sign(vy || 1); };
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    resize();
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
    };
  }, [model, theme, hydrogens, speed, glow, interactive, variant, follow]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`block h-full w-full touch-none select-none ${interactive ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
    />
  );
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `rgb(${r},${g},${b})`;
}
