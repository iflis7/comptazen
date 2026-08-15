// Structural data only — slugs, ordering, and translation keys. The actual
// copy for all of this lives in messages/en.json and messages/fr.json (see
// the matching namespaces below) so it can be translated per locale.

// Single switch for the "launch pricing" promotion on /services.
//
// true  (now):   each service card shows the introPrice as the big hero
//                number, with the marketPrice as a small "later" note under
//                it, and the page intro paragraph explains the launch-rate
//                pitch. ServicesPage.priceLabel / ServicesPage.intro are used.
// false (later): each card shows the marketPrice as the hero number instead,
//                no "later" note, and a plain non-promo intro paragraph.
//                ServicesPage.priceLabelEnded / ServicesPage.introEnded are
//                used instead. introPrice/marketPrice data in messages/*.json
//                does not need to change either way — flip this one flag.
export const LAUNCH_PRICING_ACTIVE = false;

export const NAV_LINKS = [
  { href: "/services", key: "services" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/use-cases", key: "useCases" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

// Keys into the "Services" namespace in messages/*.json — also used as the
// URL slug (#invoice-ap-automation) and the /services page anchor id.
export const SERVICE_SLUGS = [
  "invoice-ap-automation",
  "bank-reconciliation-automation",
  "ar-collections-automation",
  "quebec-gst-qst-compliance",
  "custom-special-projects",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// The 4 core services that get a live interactive demo on /use-cases.
// "custom-special-projects" is deliberately excluded — its whole pitch is
// undefined scope, so a canned demo would undercut it.
export const USE_CASE_SLUGS = [
  "invoice-ap-automation",
  "bank-reconciliation-automation",
  "ar-collections-automation",
  "quebec-gst-qst-compliance",
] as const;

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

// Keys into the "SelfHosted" namespace.
export const SELF_HOSTED_KEYS = ["data", "cost", "fit", "audit"] as const;

// Keys into the "Process" namespace.
export const PROCESS_KEYS = ["01", "02", "03", "04"] as const;
