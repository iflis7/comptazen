"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type AccountType = "asset" | "liability" | "equity";

type Row = {
  acombaCode: string;
  acombaLabel: string;
  qboLabel: string;
  type: AccountType;
  balance: number;
};

// A small, real trial balance — Assets ($21,390) = Liabilities + Equity
// ($21,390) — so the "ties out" state is genuinely earned, not scripted.
// Edit any balance and the identity breaks until it's corrected again,
// exactly like checking a real migrated trial balance before cutover.
const INITIAL_ROWS: Row[] = [
  {
    acombaCode: "1050",
    acombaLabel: "Caisse",
    qboLabel: "Chequing",
    type: "asset",
    balance: 8450,
  },
  {
    acombaCode: "1200",
    acombaLabel: "Comptes clients",
    qboLabel: "Accounts Receivable (A/R)",
    type: "asset",
    balance: 12300,
  },
  {
    acombaCode: "1450",
    acombaLabel: "Taxes à recevoir",
    qboLabel: "GST/QST Receivable",
    type: "asset",
    balance: 640,
  },
  {
    acombaCode: "2100",
    acombaLabel: "Comptes fournisseurs",
    qboLabel: "Accounts Payable (A/P)",
    type: "liability",
    balance: 5120,
  },
  {
    acombaCode: "2400",
    acombaLabel: "TPS/TVQ à payer",
    qboLabel: "GST/QST Payable",
    type: "liability",
    balance: 890,
  },
  {
    acombaCode: "3000",
    acombaLabel: "Bénéfices non répartis",
    qboLabel: "Retained Earnings",
    type: "equity",
    balance: 15380,
  },
];

function formatCurrency(val: number) {
  return (
    "$" +
    val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

const TYPE_LABEL: Record<AccountType, string> = {
  asset: "ASSET",
  liability: "LIABILITY",
  equity: "EQUITY",
};

export function MigrationDemo() {
  const t = useTranslations("UseCaseDemos.migration-acomba-qbo");
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);

  const { totalAssets, totalLiabEquity, delta, tiesOut } = useMemo(() => {
    let assets = 0;
    let liabEquity = 0;
    for (const row of rows) {
      if (row.type === "asset") assets += row.balance;
      else liabEquity += row.balance;
    }
    const d = assets - liabEquity;
    return {
      totalAssets: assets,
      totalLiabEquity: liabEquity,
      delta: d,
      tiesOut: Math.abs(d) < 0.005,
    };
  }, [rows]);

  function updateBalance(i: number, value: number) {
    const next = [...rows];
    next[i] = { ...next[i], balance: value };
    setRows(next);
  }

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="py-2 pr-3 text-left font-mono text-[9px] font-normal tracking-[0.1em] text-[var(--color-ink-faint)]">
                {t("acombaHeader")}
              </th>
              <th className="py-2 px-3 text-left font-mono text-[9px] font-normal tracking-[0.1em] text-[var(--color-ink-faint)]">
                {t("balanceHeader")}
              </th>
              <th
                aria-hidden="true"
                className="w-6 py-2 px-2 text-center font-mono text-[9px] font-normal text-[var(--color-ink-faint)]"
              />
              <th className="py-2 pl-3 text-left font-mono text-[9px] font-normal tracking-[0.1em] text-[var(--color-ink-faint)]">
                {t("qboHeader")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.acombaCode}
                className="border-b border-[var(--color-border-soft)]"
              >
                <td className="py-2.5 pr-3 font-mono text-[12px] whitespace-nowrap text-[var(--color-ink-muted)]">
                  <span className="text-[var(--color-ink-faint)]">
                    {row.acombaCode}
                  </span>{" "}
                  {row.acombaLabel}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center border border-[var(--color-border)] bg-[var(--color-background)] focus-within:border-[var(--color-accent)]">
                    <span className="pl-2 font-mono text-[12px] text-[var(--color-ink-faint)]">
                      $
                    </span>
                    <input
                      type="number"
                      value={row.balance}
                      onChange={(e) =>
                        updateBalance(i, Number(e.target.value) || 0)
                      }
                      className="w-24 bg-transparent px-2 py-1.5 font-mono text-[12px] text-[var(--color-ink)] outline-none"
                    />
                  </div>
                </td>
                <td
                  aria-hidden="true"
                  className="px-2 text-center font-mono text-[13px] text-[var(--color-ink-faint)]"
                >
                  →
                </td>
                <td className="py-2.5 pl-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[12px] text-[var(--color-ink)]">
                      {row.qboLabel}
                    </span>
                    <span className="shrink-0 font-mono text-[8px] tracking-[0.1em] text-[var(--color-accent)]">
                      {TYPE_LABEL[row.type]}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--color-border-soft)] pt-4">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-faint)]">
              {t("totalAssets")}
            </p>
            <p className="mt-1 font-mono text-[15px] text-[var(--color-ink)]">
              {formatCurrency(totalAssets)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-faint)]">
              {t("totalLiabEquity")}
            </p>
            <p className="mt-1 font-mono text-[15px] text-[var(--color-ink)]">
              {formatCurrency(totalLiabEquity)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-faint)]">
            {t("trialBalance")}
          </p>
          <p
            className={
              tiesOut
                ? "mt-1 font-mono text-[13px] text-[var(--color-accent)]"
                : "mt-1 font-mono text-[13px] text-[var(--color-ink-faint)]"
            }
          >
            {tiesOut
              ? `✓ ${t("tiesOut")}`
              : `▲ ${t("offBy")} ${formatCurrency(Math.abs(delta))}`}
          </p>
        </div>
      </div>
    </div>
  );
}
