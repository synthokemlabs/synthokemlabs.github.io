"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { LogoMark } from "./Logo";
import { Icon } from "./Icon";

const INK = "#0b2e4f";

/**
 * Scannable QR code for a page or file on this site, with the Synthokem mark at its centre.
 * The address is built from the page's own origin at runtime, so the code always points at the
 * domain the site is actually served from (no third-party redirect service in between).
 * Error correction "H" keeps it readable with the logo covering the centre.
 */
export function ScanQR({ path, label, fileName, size = 176 }: { path: string; label: string; fileName: string; size?: number }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const href = new URL(path, window.location.origin).href;
    setUrl(href);
    QRCode.toString(href, { type: "svg", errorCorrectionLevel: "H", margin: 0, color: { dark: INK, light: "#ffffff00" } })
      .then((s) => setSvg(s.replace("<svg ", `<svg role="presentation" focusable="false" width="100%" height="100%" `)))
      .catch(() => setSvg(null));
  }, [path]);

  // Print-ready PNG: QR at 1024px with the mark composited in the centre
  async function download() {
    const size = 1024, pad = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size + pad * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const qr = document.createElement("canvas");
    await QRCode.toCanvas(qr, url, { errorCorrectionLevel: "H", margin: 0, width: size, color: { dark: INK, light: "#ffffff" } });
    ctx.drawImage(qr, pad, pad);
    const tile = size * 0.22, cx = canvas.width / 2;
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

  return (
    <figure className="flex flex-col items-center">
      <div className="relative rounded-lg bg-white p-3 shadow-[0_18px_40px_-26px_rgb(10_45_80/0.6)] ring-1 ring-border" style={{ width: size + 24, height: size + 24 }}>
        {svg ? (
          <div role="img" aria-label={`QR code: ${label}`} className="h-full w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <div aria-hidden="true" className="grid h-full w-full place-items-center rounded bg-surface text-xs text-muted">QR code</div>
        )}
        {/* Synthokem mark on a white tile at the centre (covered modules are recovered by error correction) */}
        <span ref={markRef} aria-hidden="true" className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-white" style={{ width: size * 0.24, height: size * 0.24 }}>
          <LogoMark className="h-[72%] w-auto" />
        </span>
      </div>
      <figcaption className="mt-4 w-full text-center">
        <span className="block text-sm font-semibold text-primary-ink">{label}</span>
        {url && <span className="mt-1 block truncate font-mono text-[0.7rem] text-muted" title={url}>{url.replace(/^https?:\/\//, "")}</span>}
        <span className="mt-3 flex justify-center gap-2">
          <button type="button" onClick={download} disabled={!svg} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold text-primary ring-1 ring-inset ring-border-strong transition-colors hover:bg-primary hover:text-white hover:ring-primary disabled:opacity-50">
            <Icon name="download" size={15} /> Save QR
          </button>
          <button type="button" onClick={copy} disabled={!url} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold text-primary ring-1 ring-inset ring-border-strong transition-colors hover:bg-primary hover:text-white hover:ring-primary disabled:opacity-50">
            <Icon name={copied ? "check" : "copy"} size={15} /> {copied ? "Copied" : "Copy link"}
          </button>
          <span className="sr-only" role="status" aria-live="polite">{copied ? "Link copied" : ""}</span>
        </span>
      </figcaption>
    </figure>
  );
}
