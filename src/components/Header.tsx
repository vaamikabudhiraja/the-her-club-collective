import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import { SiteNav } from "@/components/SiteNav";

// Site header: elegant wordmark, browse nav (desktop dropdown + mobile menu),
// and the cart. A single gold hairline underlines the bar.
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

        <div className="flex items-center gap-3 sm:gap-6">
          <SiteNav />
          <CartButton />
        </div>
      </div>

      {/* Thin gold hairline accent */}
      <div className="h-px w-full bg-gold/40" />
    </header>
  );
}
