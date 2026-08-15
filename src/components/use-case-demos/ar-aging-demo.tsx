"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type Row = { client: string; daysOverdue: number; amount: number };

const STAGE_BANDS = [
  { max: 0, key: "stageCurrent" },
  { max: 6, key: "stageDay1" },
  { max: 13, key: "stageDay7" },
  { max: 29, key: "stageDay14" },
  { max: Infinity, key: "stageDay30" },
] as const;

function stageFor(daysOverdue: number) {
  return STAGE_BANDS.find((band) => daysOverdue <= band.max) ?? STAGE_BANDS[0];
}

function formatCurrency(val: number) {
  return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ARAgingDemo() {
  const t = useTranslations("UseCaseDemos.ar-collections-automation");

  const initialRows: Row[] = [
    { client: t("client1"), daysOverdue: -3, amount: 1200 },
    { client: t("client2"), daysOverdue: 4, amount: 850 },
    { client: t("client3"), daysOverdue: 10, amount: 3200 },
    { client: t("client4"), daysOverdue: 22, amount: 640 },
    { client: t("client5"), daysOverdue: 41, amount: 8240 },
  ];

  const [rows, setRows] = useState<Row[]>(initialRows);

  const { totalOutstanding, totalFinalNotice } = useMemo(() => {
    let total = 0;
    let finalNotice = 0;
    for (const row of rows) {
      total += row.amount;
      if (row.daysOverdue >= 30) finalNotice += row.amount;
    }
    return { totalOutstanding: total, totalFinalNotice: finalNotice };
  }, [rows]);

  function updateRow(i: number, patch: Partial<Row>) {
    const next = [...rows];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="py-2 pr-3 text-left font-mono text-[9px] font-normal tracking-[0.1em] text-[var(--color-ink-faint)]">
                {t("clientHeader")}
              </th>
              <th className="py-2 px-3 text-left font-mono text-[9px] font-normal tracking-[0.1em] text-[var(--color-ink-faint)]">
                {t("daysHeader")}
              </th>
              <th className="py-2 px-3 text-left font-mono text-[9px] font-normal tracking-[0.1em] text-[var(--color-ink-faint)]">
                {t("amountHeader")}
              </th>
              <th className="py-2 pl-3 text-left font-mono text-[9px] font-normal tracking-[0.1em] text-[var(--color-ink-faint)]">
                {t("stageHeader")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const stage = stageFor(row.daysOverdue);
              return (
                <tr key={i} className="border-b border-[var(--color-border-soft)]">
                  <td className="py-2 pr-3 font-mono text-[12px] text-[var(--color-ink-muted)]">
                    {row.client}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={row.daysOverdue}
                      onChange={(e) =>
                        updateRow(i, { daysOverdue: Number(e.target.value) || 0 })
                      }
                      className="w-20 border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 font-mono text-[12px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={row.amount}
                      onChange={(e) =>
                        updateRow(i, { amount: Number(e.target.value) || 0 })
                      }
                      className="w-24 border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 font-mono text-[12px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]"
                    />
                  </td>
                  <td className="py-2 pl-3 font-mono text-[11px] whitespace-nowrap text-[var(--color-accent)]">
                    {t(stage.key)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-10 border-t border-[var(--color-border-soft)] pt-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-faint)]">
            {t("totalOutstanding")}
          </p>
          <p className="mt-1 font-mono text-[15px] text-[var(--color-ink)]">
            {formatCurrency(totalOutstanding)}
          </p>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-faint)]">
            {t("totalFinalNotice")}
          </p>
          <p className="mt-1 font-mono text-[15px] text-[var(--color-accent)]">
            {formatCurrency(totalFinalNotice)}
          </p>
        </div>
      </div>
    </div>
  );
}
