import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact — Her Club Collective",
  description: "Get in touch with Her Club Collective.",
};

// Minimal contact page so the nav link is live. Full contact content /
// form comes in the landing-pages step.
export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-28">
      <Reveal>
        <p className="eyebrow text-gold">Contact</p>
        <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">
          Get in touch
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted">
          Questions about a piece, an order, or a collaboration? We’d love to
          hear from you.
        </p>
      </Reveal>

      <Reveal delay={220}>
        <a
          href="mailto:hello@herclubcollective.shop"
          className="btn btn-primary mt-9"
        >
          Email us
        </a>
      </Reveal>
    </section>
  );
}
