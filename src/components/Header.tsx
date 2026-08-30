import Link from "next/link";

// Site header: brand wordmark on the left, cart on the right.
// The cart is a non-navigating button for now — it becomes a live link/drawer
// in the cart step. A slim palette gradient underlines the whole bar.
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

        <button
          type="button"
          aria-label="Cart (coming soon)"
          title="Cart — coming soon"
          className="relative rounded-full p-2 text-ink transition-colors hover:bg-blush-soft"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
      </div>

      {/* Thin brand accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blush via-turquoise to-butter opacity-70" />
    </header>
  );
}
