import type { ComponentType } from "react";
import type { ServiceSlug } from "@/lib/site-data";
import { InvoiceAnimation } from "./invoice-animation";
import { ReconciliationAnimation } from "./reconciliation-animation";
import { ARAnimation } from "./ar-animation";
import { TaxAnimation } from "./tax-animation";

const ANIMATIONS: Record<ServiceSlug, ComponentType> = {
  "invoice-ap-automation": InvoiceAnimation,
  "bank-reconciliation-automation": ReconciliationAnimation,
  "ar-collections-automation": ARAnimation,
  "quebec-gst-qst-compliance": TaxAnimation,
};

export function ServiceAnimation({ slug }: { slug: ServiceSlug }) {
  const Animation = ANIMATIONS[slug];
  return <Animation />;
}
