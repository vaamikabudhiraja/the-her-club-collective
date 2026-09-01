"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

// Footer email signup. Posts to /api/subscribe. Styled for the deep footer
// (cream text on turquoise). Works on mobile (stacks on small screens).
export function NewsletterForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage("You’re in. Welcome to the club.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-sm text-bone ${className}`.trim()} aria-live="polite">
        {message}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-3 sm:flex-row ${className}`.trim()}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        autoComplete="email"
        className="w-full flex-1 rounded-md border border-bone/30 bg-transparent px-4 py-3 text-sm text-bone placeholder:text-bone/50 outline-none transition-colors focus:border-bone sm:min-w-0"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn shrink-0 bg-bone text-ink hover:bg-white disabled:opacity-70"
      >
        {status === "loading" ? "Joining…" : "Subscribe"}
      </button>

      {status === "error" && (
        <p className="text-xs text-bone/80 sm:w-full" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}
