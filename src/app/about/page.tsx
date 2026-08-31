import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — Her Club Collective",
  description:
    "The story behind Her Club Collective. Carefully chosen, tarnish free, made to last.",
};

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft, warm wash — subtle, in keeping with the quiet-luxury look. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-soft blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow text-gold">Our story</p>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="font-display mt-5 text-3xl leading-snug text-ink sm:text-4xl">
            Hi, I’m so glad you’re here.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex flex-col gap-7 text-lg leading-relaxed text-ink/85">
            <p>
              I started Her Club Collective for a pretty simple reason. I love
              jewellery. Not in a fussy way, just that the right piece makes me
              feel like me. And I got tired of the other option.
            </p>

            <p>
              You know the one. The gorgeous €12 necklace from Bershka or
              wherever, that looks perfect for exactly one week, until you forget
              to take it off in the shower and it’s suddenly green, tarnished,
              done. We’ve all got a little graveyard of those in a drawer
              somewhere.
            </p>

            <p>
              So I wanted to build something different. Not fast, not throwaway,
              but pieces you choose slowly and actually keep. Tarnish free, made
              to last, the kind of thing you reach for every day and it just
              stays. Whether that’s a tiny everyday piece, something for a night
              out, or a bit of fun, it should feel like you, and it should still
              feel like you in a year.
            </p>

            <p>
              I’m building this carefully, one piece at a time. Everyone’s
              welcome here. No type, no rules. That’s the whole point of a
              collective.
            </p>

            <p className="text-ink">
              So have a look around. I hope you find something that feels like
              yours.
            </p>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <Link href="/shop" className="btn btn-primary mt-12">
            Shop the collection
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
