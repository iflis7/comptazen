// Centralizes the canonical site origin and the EN/FR URL pairing so
// every page's canonical/hreflang metadata, the sitemap, and robots.txt
// all stay in sync with the routing config in src/i18n/routing.ts
// (English at bare paths, French under /fr — see routing.ts's
// `localePrefix: "as-needed"`).

export const SITE_URL = "https://www.comptazen.digital";

// Every crawlable, locale-neutral path in the site. Single source of
// truth for the sitemap and for hreflang pairing — add a path here once
// and every page picks up the correct alternates automatically.
export const SITE_PATHS = [
  "/",
  "/services",
  "/how-it-works",
  "/use-cases",
  "/about",
  "/contact",
  "/privacy-policy",
] as const;

export type SitePath = (typeof SITE_PATHS)[number];
export type SiteLocale = "en" | "fr";

function localizedPath(path: SitePath, locale: SiteLocale): string {
  if (locale === "en") return path;
  return path === "/" ? "/fr" : `/fr${path}`;
}

export function localizedUrl(path: SitePath, locale: SiteLocale): string {
  return `${SITE_URL}${localizedPath(path, locale)}`;
}

/**
 * Next.js Metadata `alternates` for a given page: a self-referencing
 * canonical plus hreflang links to every locale variant (and
 * x-default, pointed at English per routing.ts's `defaultLocale`).
 * Pass the locale-neutral path this page represents (e.g. "/services")
 * and the locale currently being rendered.
 */
export function buildAlternates(path: SitePath, locale: SiteLocale) {
  return {
    canonical: localizedUrl(path, locale),
    languages: {
      en: localizedUrl(path, "en"),
      fr: localizedUrl(path, "fr"),
      "x-default": localizedUrl(path, "en"),
    },
  };
}
