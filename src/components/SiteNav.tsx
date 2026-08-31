"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { TYPE_LINKS, COLLECTION_LINKS, type NavLink } from "@/lib/nav";

// Lint-clean client-mount detection (false on server, true after hydration).
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function LinkColumn({
  title,
  links,
  onNavigate,
  size = "sm",
}: {
  title: string;
  links: NavLink[];
  onNavigate?: () => void;
  size?: "sm" | "lg";
}) {
  return (
    <div>
      <p className="eyebrow mb-3 text-gold">{title}</p>
      <ul className={size === "lg" ? "space-y-4" : "space-y-2.5"}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={`nav-link inline-block ${
                size === "lg" ? "font-display text-2xl" : "text-sm"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteNav() {
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useMounted();

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop nav ─────────────────────────────────────── */}
      <nav className="hidden items-center gap-8 md:flex">
        <div
          className="relative"
          onMouseEnter={() => setShopOpen(true)}
          onMouseLeave={() => setShopOpen(false)}
        >
          <button
            type="button"
            aria-expanded={shopOpen}
            onClick={() => setShopOpen((v) => !v)}
            className="nav-link inline-flex items-center gap-1.5 text-sm"
          >
            Shop
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`[transition:transform_0.3s_var(--ease-out)] ${
                shopOpen ? "rotate-180" : ""
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown (pt-4 bridges the gap so hover stays intact) */}
          <div
            className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 [transition:opacity_0.28s_var(--ease-out),transform_0.28s_var(--ease-out)] ${
              shopOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-1 opacity-0"
            }`}
          >
            <div className="grid min-w-[380px] grid-cols-2 gap-10 rounded-xl border border-line bg-surface p-7 shadow-[0_30px_60px_-30px_rgba(36,31,27,0.4)]">
              <LinkColumn
                title="By type"
                links={TYPE_LINKS}
                onNavigate={() => setShopOpen(false)}
              />
              <LinkColumn
                title="Collections"
                links={COLLECTION_LINKS}
                onNavigate={() => setShopOpen(false)}
              />
            </div>
          </div>
        </div>

        <Link href="/about" className="nav-link text-sm">
          About
        </Link>
      </nav>

      {/* ── Mobile trigger ──────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="rounded-full p-2 text-ink transition-colors duration-300 hover:bg-surface md:hidden"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* ── Mobile menu overlay ───────────────────────────────
          Portaled to <body> so it escapes the header's backdrop-filter
          containing block (which would otherwise trap position:fixed). */}
      {mounted &&
        createPortal(
          <div
            aria-hidden={!mobileOpen}
            className={`fixed inset-0 z-[60] md:hidden ${
              mobileOpen ? "" : "pointer-events-none"
            }`}
          >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink/30 [transition:opacity_0.35s_var(--ease-out)] ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-bone [transition:transform_0.4s_var(--ease-out)] ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <span className="eyebrow text-gold">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-1.5 text-muted transition-colors duration-300 hover:bg-surface hover:text-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-10 overflow-y-auto px-6 py-8">
            <LinkColumn
              title="By type"
              links={TYPE_LINKS}
              size="lg"
              onNavigate={() => setMobileOpen(false)}
            />
            <LinkColumn
              title="Collections"
              links={COLLECTION_LINKS}
              size="lg"
              onNavigate={() => setMobileOpen(false)}
            />
            <div className="border-t border-line pt-6">
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="nav-link font-display text-2xl"
              >
                About
              </Link>
            </div>
          </div>
        </div>
          </div>,
          document.body
        )}
    </>
  );
}
