import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — Her Club Collective",
  description:
    "Carefully chosen, tarnish-free jewellery made to last. Everyone's invited — that's the collective.",
};

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft decorative palette washes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-butter-soft blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-mint-soft blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-turquoise">
            About
          </p>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Jewellery that just gets you.
          </h1>
        </Reveal>

        <div className="mt-8 flex flex-col gap-6 text-lg leading-relaxed text-muted">
          <Reveal delay={150}>
            <p>
              The dainty everyday pieces you never take off. The bold ones that
              finish the fit. The funky little extras that make it yours. We’ve
              got range — because you do.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <p>
              Here’s our thing: we keep it selective. No endless scroll of stuff
              that tarnishes by Tuesday — just carefully chosen pieces,
              tarnish-free and made to actually last. The kind you’ll still be
              reaching for way past the trend cycle.
            </p>
          </Reveal>

          <Reveal delay={270}>
            <p className="text-ink">
              Everyone’s invited. No type, no dress code, no vibe check. That’s
              the collective. 💛
            </p>
          </Reveal>
        </div>

        <Reveal delay={330}>
          <Link
            href="/#products"
            className="mt-10 inline-flex items-center rounded-full bg-ink px-8 py-4 text-sm font-medium tracking-wide text-cream transition hover:bg-ink/90"
          >
            Come find your piece
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
