// Structural data only — slugs, ordering, and translation keys. The actual
// copy for all of this lives in messages/en.json and messages/fr.json (see
// the matching namespaces below) so it can be translated per locale.

export const NAV_LINKS = [
  { href: "/services", key: "services" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/use-cases", key: "useCases" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

// Keys into the "Layers" namespace in messages/*.json — also used as the
// URL slug (#work, #automation, #judgment, #support-custom) and the
// /services page anchor id. This is the offer itself: one method — embed
// and do the job, automate what's repeatable, add an AI judgment layer,
// support what ships — as four independently sellable layers.
export const LAYER_SLUGS = [
  "work",
  "automation",
  "judgment",
  "support-custom",
] as const;

export type LayerSlug = (typeof LAYER_SLUGS)[number];

// Keys into the "Services" namespace — the four concrete automation demos
// (invoice/AP, bank reconciliation, AR/collections, Quebec GST/QST). These
// live under the Automation layer conceptually, but aren't priced or sold
// as standalone entries anymore — they're the live, interactive proof
// shown on /use-cases, linking back to the Automation layer on /services.
export const SERVICE_SLUGS = [
  "invoice-ap-automation",
  "bank-reconciliation-automation",
  "ar-collections-automation",
  "quebec-gst-qst-compliance",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// The services that get a live interactive demo on /use-cases — currently
// all of them.
export const USE_CASE_SLUGS = SERVICE_SLUGS;

export type UseCaseSlug = ServiceSlug;

// Keys into the "SelfHosted" namespace.
export const SELF_HOSTED_KEYS = ["data", "cost", "fit", "audit"] as const;

// Keys into the "Process" namespace.
export const PROCESS_KEYS = ["01", "02", "03", "04"] as const;
