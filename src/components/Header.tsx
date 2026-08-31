import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";

// Site header: elegant wordmark, understated nav, cart. A single gold hairline
// underlines the bar for a quiet, considered accent.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display whitespace-nowrap text-xl tracking-tight text-ink transition-opacity hover:opacity-70 sm:text-2xl"
        >
          Her Club Collective
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="flex items-center gap-6 text-sm sm:gap-8">
            <Link
              href="/"
              className="text-ink transition-colors hover:text-burgundy"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-ink transition-colors hover:text-burgundy"
            >
              About
            </Link>
          </nav>
          <CartButton />
        </div>
      </div>

      {/* Thin gold hairline accent */}
      <div className="h-px w-full bg-gold/40" />
    </header>
  );
}
