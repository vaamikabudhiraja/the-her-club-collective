import Link from "next/link";

// Site footer: brand line, positioning, nav, and a copyright row. A soft mint
// wash and the brand gradient keep it playful but calm.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-mint-soft/60">
      {/* Brand accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-blush via-turquoise to-butter" />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-md flex-col gap-3">
            <p className="font-display text-2xl text-ink">Her Club Collective</p>
            <p className="text-sm leading-relaxed text-muted">
              Jewellery that just gets you — carefully chosen, tarnish-free, and
              made to last. Everyone’s invited.
            </p>
          </div>

          <nav className="flex gap-8 text-sm">
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
                Explore
              </p>
              <Link href="/" className="text-ink transition-colors hover:text-blush">
                Shop
              </Link>
              <Link
                href="/about"
                className="text-ink transition-colors hover:text-blush"
              >
                About
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line/70 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Her Club Collective. All rights reserved.</p>
          <p>Come find your piece 💛</p>
        </div>
      </div>
    </footer>
  );
}
