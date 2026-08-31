import { SOCIAL_LINKS, type SocialLink } from "@/lib/nav";

// Simple, tasteful social icons. Add/remove platforms in src/lib/nav.ts.
function Icon({ label }: { label: SocialLink["label"] }) {
  switch (label) {
    case "Instagram":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "TikTok":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14.5 3c.3 2.3 1.6 3.7 3.9 3.85V9.4c-1.35 0-2.5-.45-3.55-1.2v5.6a5.15 5.15 0 1 1-5.15-5.15c.28 0 .55.02.8.07v2.65a2.5 2.5 0 1 0 1.75 2.38V3h2.4z" />
        </svg>
      );
    case "Pinterest":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 0 0-3.65 19.3c-.09-.82-.17-2.08.03-2.98l1.2-5.1s-.31-.61-.31-1.52c0-1.42.83-2.48 1.85-2.48.87 0 1.3.66 1.3 1.44 0 .88-.56 2.2-.85 3.42-.24 1.02.52 1.86 1.53 1.86 1.83 0 3.24-1.94 3.24-4.73 0-2.47-1.78-4.2-4.31-4.2a4.47 4.47 0 0 0-4.66 4.48c0 .89.34 1.84.77 2.36a.31.31 0 0 1 .07.3l-.29 1.15c-.05.19-.15.23-.35.14-1.28-.6-2.08-2.46-2.08-3.96 0-3.23 2.35-6.19 6.76-6.19 3.55 0 6.31 2.53 6.31 5.91 0 3.53-2.22 6.37-5.31 6.37-1.04 0-2.01-.54-2.35-1.18l-.64 2.43c-.23.89-.85 2-1.27 2.68A10 10 0 1 0 12 2z" />
        </svg>
      );
  }
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-current/25 transition-colors duration-300 hover:text-gold"
        >
          <Icon label={s.label} />
        </a>
      ))}
    </div>
  );
}
