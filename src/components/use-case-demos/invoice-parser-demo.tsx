"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

// A genuinely functional (if simplified) invoice-field extractor — pure
// regex, no backend, no canned output. Editing the text below re-runs the
// same parser on every keystroke, so breaking a field's label really does
// make it disappear on the right.
function parseInvoice(text: string) {
  const vendor = text.match(/(?:vendor|fournisseur)\s*:\s*(.+)/i)?.[1]?.trim();
  const invoiceNumber = text
    .match(/(?:invoice|facture)\s*#?\s*:\s*([^\n]+)/i)?.[1]
    ?.trim();
  const date = text.match(/^date\s*:\s*(.+)$/im)?.[1]?.trim();
  const total = text
    .match(/total\s*:?\s*\$?\s*([\d\s]+[.,]\d{2}\s*\$?(?:\s*CAD)?)/i)?.[1]
    ?.trim();

  return { vendor, invoiceNumber, date, total };
}

export function InvoiceParserDemo() {
  const t = useTranslations("UseCaseDemos.invoice-ap-automation");
  const sampleText = t("sampleText");
  const [text, setText] = useState(sampleText);
  const parsed = useMemo(() => parseInvoice(text), [text]);

  const fields: Array<[string, string | undefined]> = [
    [t("vendorLabel"), parsed.vendor],
    [t("invoiceNumberLabel"), parsed.invoiceNumber],
    [t("dateLabel"), parsed.date],
    [t("totalLabel"), parsed.total],
  ];

  return (
    <div className="grid gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:grid-cols-2 sm:p-6">
      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="invoice-demo-textarea"
            className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]"
          >
            {t("textareaLabel")}
          </label>
          <button
            type="button"
            onClick={() => setText(sampleText)}
            className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] hover:underline"
          >
            {t("resetButton")}
          </button>
        </div>
        <textarea
          id="invoice-demo-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          spellCheck={false}
          className="w-full flex-1 resize-none border border-[var(--color-border)] bg-[var(--color-background)] p-3 font-mono text-[12px] leading-relaxed text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="flex flex-col justify-center gap-4 border-t border-[var(--color-border-soft)] pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-faint)]">
              {label}
            </p>
            <p
              className={
                value
                  ? "mt-1 font-mono text-[15px] text-[var(--color-accent)]"
                  : "mt-1 font-mono text-[13px] italic text-[var(--color-ink-faint)]"
              }
            >
              {value || t("notDetected")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
