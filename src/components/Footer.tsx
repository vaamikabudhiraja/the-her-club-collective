import Link from "next/link";

// Deep burgundy footer — the richest expression of the palette, grounding the
// warm-neutral pages with a moment of depth. Gold hairline, cream text.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-burgundy text-bone">
      {/* Gold hairline accent */}
      <div className="h-px w-full bg-gold/50" />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-md flex-col gap-3">
            <p className="font-display text-2xl">Her Club Collective</p>
            <p className="text-sm leading-relaxed text-bone/70">
              Modern fine jewellery — carefully chosen, tarnish-free, and made
              to last.
            </p>
          </div>

          <nav className="flex gap-16 text-sm">
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-gold">Explore</p>
              <Link href="/" className="text-bone/85 transition-colors hover:text-gold">
                Shop
              </Link>
              <Link
                href="/about"
                className="text-bone/85 transition-colors hover:text-gold"
              >
                About
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-bone/15 pt-6 text-xs text-bone/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Her Club Collective. All rights reserved.</p>
          <p>Come find your piece.</p>
        </div>
      </div>
    </footer>
  );
}
