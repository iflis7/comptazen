import type { ComponentType } from "react";
import type { UseCaseSlug } from "@/lib/site-data";
import { MigrationDemo } from "./migration-demo";
import { InvoiceParserDemo } from "./invoice-parser-demo";
import { ReconciliationDemo } from "./reconciliation-demo";
import { ARAgingDemo } from "./ar-aging-demo";
import { TaxCalculatorDemo } from "./tax-calculator-demo";

const DEMOS: Record<UseCaseSlug, ComponentType> = {
  "migration-acomba-qbo": MigrationDemo,
  "invoice-ap-automation": InvoiceParserDemo,
  "bank-reconciliation-automation": ReconciliationDemo,
  "ar-collections-automation": ARAgingDemo,
  "quebec-gst-qst-compliance": TaxCalculatorDemo,
};

export function UseCaseDemo({ slug }: { slug: UseCaseSlug }) {
  const Demo = DEMOS[slug];
  return <Demo />;
}
