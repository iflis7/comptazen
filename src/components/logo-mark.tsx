// The site's mark — an open ring (enso), echoing "Zen" and the dot/node
// motif used throughout the service animations. Same shape as the favicon
// (see src/app/icon.svg), but colored with the accent CSS variable instead
// of a fixed hex so it follows the light/dark theme when inlined in the DOM.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 42,14.68 A 20,20 0 1 1 25.16,13.21"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="42" cy="14.68" r="4.2" fill="var(--color-accent)" />
    </svg>
  );
}
