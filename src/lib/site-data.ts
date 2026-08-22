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

// Keys into the (now orphaned, kept for reference) "Services" namespace —
// the four concrete automation demos (invoice/AP, bank reconciliation,
// AR/collections, Quebec GST/QST). These live under the Automation layer
// conceptually, but aren't priced or sold as standalone entries anymore.
export const SERVICE_SLUGS = [
  "invoice-ap-automation",
  "bank-reconciliation-automation",
  "ar-collections-automation",
  "quebec-gst-qst-compliance",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// /use-cases is a capability portfolio, not a 1:1 mirror of SERVICE_SLUGS —
// some demos prove a capability that isn't a priced /services SKU at all
// (the Acomba -> QBO migration is the first one). Copy for each entry
// lives in the "UseCases" namespace (name/description) plus
// "UseCaseDemos" (the interactive widget's own labels and sample data).
// Ordered as displayed: the migration demo leads — it's the hardest,
// most novel proof — followed by the four automation demos, which still
// genuinely tie back to the Automation layer on /services.
export const USE_CASE_SLUGS = [
  "migration-acomba-qbo",
  ...SERVICE_SLUGS,
] as const;

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

// Keys into the "SelfHosted" namespace.
export const SELF_HOSTED_KEYS = ["data", "cost", "fit", "audit"] as const;

// Keys into the "Process" namespace.
export const PROCESS_KEYS = ["01", "02", "03", "04"] as const;
