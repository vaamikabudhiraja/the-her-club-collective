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

        <CartButton />
      </div>

      {/* Thin brand accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blush via-turquoise to-butter opacity-70" />
    </header>
  );
}
