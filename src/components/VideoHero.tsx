"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// Full-bleed video hero (Cartier-style): looping, muted, autoplaying video
// behind an overlaid headline + CTAs, with a soft scrim for legibility.
// Respects reduced-motion: if the viewer prefers reduced motion we don't
// autoplay — the video holds on its first frame as a still image instead.
export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      // play() can reject on some browsers until interaction; ignore quietly.
      v.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden bg-burgundy sm:h-[84vh]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Scrim — bottom-weighted so overlaid text stays readable. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/25 via-ink/10 to-ink/50"
      />

      {/* Overlaid content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-bone">
        <p className="eyebrow text-bone/80">Modern fine jewellery</p>
        <h1 className="font-display mt-5 max-w-2xl text-5xl leading-[1.05] drop-shadow-sm sm:text-6xl">
          Jewellery that just gets you.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-bone/90 sm:text-lg">
          Carefully chosen, tarnish-free, and made to last.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <Link
            href="/shop"
            className="btn bg-bone text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] hover:bg-white"
          >
            Shop the collection
          </Link>
          <Link
            href="/about"
            className="text-sm text-bone underline decoration-gold underline-offset-4 [transition:color_0.3s_var(--ease-out)] hover:text-gold"
          >
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}
