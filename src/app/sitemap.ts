import type { MetadataRoute } from "next";
import { SITE_PATHS, localizedUrl, type SiteLocale } from "@/lib/seo";

// Lives at the app root (not inside [locale]) — sitemap.xml is a single,
// locale-agnostic file that lists both the English and French version of
// every page, paired via `alternates.languages` so Google reads them as
// translations of one another rather than as unrelated URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  const locales: SiteLocale[] = ["en", "fr"];

  return SITE_PATHS.flatMap((path) => {
    const languages = {
      en: localizedUrl(path, "en"),
      fr: localizedUrl(path, "fr"),
    };

    return locales.map((locale) => ({
      url: localizedUrl(path, locale),
      alternates: { languages },
    }));
  });
}
