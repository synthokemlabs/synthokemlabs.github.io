"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Click-to-load Google Map: no third-party requests or cookies until the visitor asks for the map. */
export function MapFacade({ src, title, directions }: { src: string; title: string; directions: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-primary-dark ring-1 ring-border sm:aspect-[16/9]">
      {loaded ? (
        <iframe src={src} title={title} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/world-dots.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-[3.2] object-cover opacity-30" style={{ objectPosition: "71% 46%" }} />
          <div className="relative flex flex-col items-center gap-4 px-6 text-center text-white">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-primary-ink"><Icon name="pin" size={24} /></span>
            <p className="max-w-xs text-sm text-on-dark-muted">Loading the map connects to Google Maps, which may set cookies.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setLoaded(true)} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-primary-ink hover:bg-primary-tint">Show interactive map</button>
              <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 hover:ring-white">Get directions <Icon name="external" size={15} /></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
