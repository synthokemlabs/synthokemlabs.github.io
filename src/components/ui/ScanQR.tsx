"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { LogoMark } from "./Logo";
import { Icon } from "./Icon";

/** Deep sky blue modules: on-brand, and 7.7:1 against white so phone cameras read it instantly. */
const INK = "#0c5591";

/**
 * Scannable QR code for a page or file on this site, presented as a frosted sky-blue panel with
 * camera-viewfinder corners. On entering view the code opens from its centre and the corners slide
 * in; a soft scan line then sweeps it every few seconds (paused on hover, off for reduced motion).
 *
 * The address is built from the page's own origin at runtime, so the code always points at the
 * domain the site is served from. Error correction "H" keeps it readable with the mark in the centre.
 */
export function ScanQR({
  path, label, sub, title, fileName, size = 156, layout = "stack",
}: {
  path: string; label: string; sub?: string; title?: string; fileName: string; size?: number;
  /** stack: code above text · row: code beside text · auto: row on small screens, stack from lg up */
  layout?: "stack" | "row" | "auto";
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [inView, setInView] = useState(false);
  const markRef = useRef<HTMLSpanElement>(null);
  const figRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const href = new URL(path, window.location.origin).href;
    setUrl(href);
    QRCode.toString(href, { type: "svg", errorCorrectionLevel: "H", margin: 0, color: { dark: INK, light: "#ffffff00" } })
      .then((s) => setSvg(s.replace("<svg ", `<svg role="presentation" focusable="false" width="100%" height="100%" shape-rendering="crispEdges" `)))
      .catch(() => setSvg(null));
  }, [path]);

  // Play the reveal when the card scrolls into view (with a fallback so it never stays hidden)
  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    const t = setTimeout(() => setInView(true), 2500);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  // Print-ready PNG: QR at 1024px with the mark composited in the centre
  async function download() {
    const px = 1024, pad = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = px + pad * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const qr = document.createElement("canvas");
    await QRCode.toCanvas(qr, url, { errorCorrectionLevel: "H", margin: 0, width: px, color: { dark: INK, light: "#ffffff" } });
    ctx.drawImage(qr, pad, pad);
    const tile = px * 0.22, cx = canvas.width / 2;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.roundRect(cx - tile / 2, cx - tile / 2, tile, tile, tile * 0.18); ctx.fill();
    const svgEl = markRef.current?.querySelector("svg");
    if (svgEl) {
      const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svgEl).replace(/var\(--brand-mark\)/g, "#3fa8ee"));
      const img = new Image();
      await new Promise((r) => { img.onload = r; img.onerror = r; img.src = src; });
      const h = tile * 0.72, w = h * (49 / 61);
      ctx.drawImage(img, cx - w / 2, cx - h / 2, w, h);
    }
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${fileName}.png`;
    a.click();
  }

  async function copy() {
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const shape =
    layout === "row" ? "flex-row items-center text-left"
    : layout === "auto" ? "flex-row items-center text-left lg:flex-col lg:items-center lg:text-center"
    : "flex-col items-center text-center";
  const actionsAlign = layout === "stack" ? "justify-center" : layout === "auto" ? "lg:justify-center" : "";

  return (
    <figure ref={figRef} className={`qr-card qr-glass group flex gap-5 rounded-xl p-4 sm:p-5 ${shape} ${inView ? "qr-in" : ""}`}>
      <div className="qr-frame shrink-0" style={{ width: size + 24, height: size + 24 }}>
        {/* Viewfinder corners */}
        <span className="qr-corners" aria-hidden="true">
          <span className="qr-corner qr-tl" /><span className="qr-corner qr-tr" /><span className="qr-corner qr-bl" /><span className="qr-corner qr-br" />
        </span>
        <div className="qr-tile">
          {svg ? (
            <div role="img" aria-label={`QR code: ${label}${sub ? `, ${sub}` : ""}`} className="h-full w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div aria-hidden="true" className="h-full w-full rounded bg-surface" />
          )}
          {/* Synthokem mark on a white tile at the centre (covered modules are recovered by error correction) */}
          <span ref={markRef} aria-hidden="true" className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-white" style={{ width: size * 0.24, height: size * 0.24 }}>
            <LogoMark className="h-[72%] w-auto" />
          </span>
          <span className="qr-scan" aria-hidden="true" />
        </div>
      </div>
      <figcaption className="min-w-0">
        {title && <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">{title}</span>}
        <span className={`block font-display text-[1.02rem] font-semibold leading-snug text-white ${title ? "mt-1.5" : ""}`}>{label}</span>
        {sub && <span className="mt-0.5 block font-mono text-xs text-on-dark-muted">{sub}</span>}
        <span className={`mt-3 flex flex-wrap gap-1.5 ${actionsAlign}`}>
          <button type="button" onClick={download} disabled={!svg} className="qr-action">
            <Icon name="download" size={14} /> Save QR
          </button>
          <button type="button" onClick={copy} disabled={!url} className="qr-action">
            <Icon name={copied ? "check" : "copy"} size={14} /> {copied ? "Copied" : "Copy link"}
          </button>
          <span className="sr-only" role="status" aria-live="polite">{copied ? "Link copied" : ""}</span>
        </span>
      </figcaption>
    </figure>
  );
}
