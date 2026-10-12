"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * A QR code image presented as a frosted sky-blue panel with camera-viewfinder corners. On entering
 * view the code opens from its centre and the corners slide in; a soft scan line then sweeps it every
 * few seconds (paused on hover, off for reduced motion).
 *
 * The image is shown as supplied (it carries its own quiet zone and centre mark), so the code people
 * scan here is exactly the one printed elsewhere.
 */
export function ScanQR({
  src, alt, label, sub, title, href, hrefLabel = "Open", download, size = 156, layout = "stack",
}: {
  src: string; alt: string; label: string; sub?: string; title?: string;
  /** The same destination, for people already on a computer */
  href?: string; hrefLabel?: string;
  /** File name for "Save QR" */
  download: string;
  size?: number;
  /** stack: code above text · row: code beside text · auto: row on small screens, stack from lg up */
  layout?: "stack" | "row" | "auto";
}) {
  const [inView, setInView] = useState(false);
  const figRef = useRef<HTMLElement>(null);

  // Play the reveal when the card scrolls into view (with a fallback so it never stays hidden)
  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    const t = setTimeout(() => setInView(true), 2500);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

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
          <img src={src} alt={alt} width={size} height={size} decoding="async" className="block h-full w-full" />
          <span className="qr-scan" aria-hidden="true" />
        </div>
      </div>
      <figcaption className="min-w-0">
        {title && <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">{title}</span>}
        <span className={`block font-display text-[1.02rem] font-semibold leading-snug text-white ${title ? "mt-1.5" : ""}`}>{label}</span>
        {sub && <span className="mt-0.5 block font-mono text-xs text-on-dark-muted">{sub}</span>}
        <span className={`mt-3 flex flex-wrap gap-1.5 ${actionsAlign}`}>
          {href && (
            <a href={href} target="_blank" rel="noopener" className="qr-action">
              <Icon name="file" size={14} /> {hrefLabel}
            </a>
          )}
          <a href={src} download={download} className="qr-action">
            <Icon name="download" size={14} /> Save QR
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
