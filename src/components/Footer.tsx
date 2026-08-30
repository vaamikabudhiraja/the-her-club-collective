// Site footer: brand line, the two-sided positioning, and a copyright row.
// Kept airy and neutral, with a soft mint wash so it reads as "premium calm".
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-mint-soft/50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-4">
          <p className="font-serif text-xl text-ink">Her Club Collective</p>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Jewellery for every version of you — from dainty everyday pieces to
            going-out sparkle.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Her Club Collective. All rights reserved.</p>
          <p>Made with love.</p>
        </div>
      </div>
    </footer>
  );
}
