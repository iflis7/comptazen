"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const GST_RATE = 0.05;
const QST_RATE = 0.09975;

function formatCurrency(val: number) {
  return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function TaxCalculatorDemo() {
  const t = useTranslations("UseCaseDemos.quebec-gst-qst-compliance");
  const [subtotalInput, setSubtotalInput] = useState("1240.00");

  const { gst, qst, total } = useMemo(() => {
    const subtotal = Number(subtotalInput.replace(/[^\d.-]/g, "")) || 0;
    // Both taxes apply to the subtotal independently — this is the actual
    // Revenu Québec calculation method, not GST compounded into QST.
    return {
      gst: subtotal * GST_RATE,
      qst: subtotal * QST_RATE,
      total: subtotal + subtotal * GST_RATE + subtotal * QST_RATE,
    };
  }, [subtotalInput]);

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <label
            htmlFor="tax-demo-subtotal"
            className="mb-2 block font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]"
          >
            {t("subtotalLabel")}
          </label>
          <div className="flex items-center border border-[var(--color-border)] bg-[var(--color-background)] focus-within:border-[var(--color-accent)]">
            <span className="pl-3 font-mono text-[15px] text-[var(--color-ink-faint)]">
              $
            </span>
            <input
              id="tax-demo-subtotal"
              value={subtotalInput}
              onChange={(e) => setSubtotalInput(e.target.value)}
              inputMode="decimal"
              className="w-full bg-transparent px-2 py-3 font-mono text-[15px] text-[var(--color-ink)] outline-none"
            />
          </div>
        </div>

        <div className="hidden font-mono text-2xl text-[var(--color-ink-faint)] sm:block">
          →
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-border-soft)] pt-4 sm:border-t-0 sm:pt-0">
          <Row label={t("gstLabel")} value={formatCurrency(gst)} />
          <Row label={t("qstLabel")} value={formatCurrency(qst)} />
          <Row
            label={t("totalLabel")}
            value={formatCurrency(total)}
            accent
          />
        </div>
      </div>

      <p className="mt-6 border-t border-[var(--color-border-soft)] pt-4 text-xs leading-relaxed text-[var(--color-ink-faint)]">
        {t("note")}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-faint)]">
        {label}
      </span>
      <span
        className={
          accent
            ? "font-mono text-[16px] text-[var(--color-accent)]"
            : "font-mono text-[13px] text-[var(--color-ink)]"
        }
      >
        {value}
      </span>
    </div>
  );
}
