import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";

// Site header: brand wordmark on the left, live cart button on the right.
// A slim palette gradient underlines the whole bar.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serif text-2xl tracking-wide text-ink transition-opacity hover:opacity-70"
        >
          Her Club Collective
        </Link>

        <div className="flex items-center gap-5 sm:gap-7">
          <nav className="flex items-center gap-5 text-sm sm:gap-7">
            <Link
              href="/"
              className="text-ink transition-colors hover:text-turquoise"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-ink transition-colors hover:text-turquoise"
            >
              About
            </Link>
          </nav>
          <CartButton />
        </div>
      </div>

      {/* Thin brand accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blush via-turquoise to-butter opacity-70" />
    </header>
  );
}
