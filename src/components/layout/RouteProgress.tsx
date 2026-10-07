"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Thin progress line at the top of the window while a page is loading,
 * so a click always gets immediate feedback even on a slow connection.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const anim = useRef<Animation | null>(null);
  const running = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = ref.current!;
    const start = () => {
      running.current = true;
      anim.current?.cancel();
      el.style.opacity = "1";
      anim.current = el.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(0.72)" }], { duration: 1400, easing: "cubic-bezier(0.1, 0.65, 0.2, 1)", fill: "forwards" });
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => { if (running.current) finish(); }, 8000); // never hang
    };
    // Capture phase: Next's <Link> cancels the native event before it would bubble here
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || /\.[a-z0-9]{2,4}$/i.test(url.pathname)) return;
      if (url.pathname === window.location.pathname) return; // same page: hash or query change
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); clearTimeout(timeout.current); };
  }, []);

  function finish() {
    const el = ref.current;
    if (!el || !running.current) return;
    running.current = false;
    clearTimeout(timeout.current);
    const from = anim.current ? getComputedStyle(el).transform : "scaleX(0)";
    anim.current?.cancel();
    anim.current = el.animate([{ transform: from === "none" ? "scaleX(0)" : from, opacity: 1 }, { transform: "scaleX(1)", opacity: 1, offset: 0.55 }, { transform: "scaleX(1)", opacity: 0 }], { duration: 520, easing: "ease-out", fill: "forwards" });
  }

  useEffect(() => { finish(); }, [pathname]);

  return <div ref={ref} aria-hidden="true" className="route-bar opacity-0" style={{ transform: "scaleX(0)" }} />;
}
