import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  // English keeps bare paths ("/services"); French gets a "/fr" prefix
  // ("/fr/services"). Avoids changing already-shipped English URLs.
  localePrefix: "as-needed",
});
