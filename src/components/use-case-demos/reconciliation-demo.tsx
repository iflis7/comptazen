"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const INITIAL_BANK = ["412.68", "8,240.00", "1,318.90", "2,150.00"];
const INITIAL_BOOKS = ["412.68", "8,240.00", "1,402.35", "2,150.00"];

function toNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
}

// A real (if small-scale) greedy matcher: each bank line looks for an
// unused books line within a cent of it, by value — not by row position.
// Retype a books amount to match a *different* bank row and the pairing
// really does move.
function reconcile(bank: string[], books: string[]) {
  const bookValues = books.map(toNumber);
  const usedBookIndexes = new Set<number>();

  const bankResults = bank.map((raw) => {
    const value = toNumber(raw);
    if (value === null) return { matched: false, matchIndex: -1 };
    const idx = bookValues.findIndex(
      (b, i) => !usedBookIndexes.has(i) && b !== null && Math.abs(b - value) < 0.005
    );
    if (idx !== -1) {
      usedBookIndexes.add(idx);
      return { matched: true, matchIndex: idx };
    }
    return { matched: false, matchIndex: -1 };
  });

  const unmatchedBookIndexes = books
    .map((_, i) => i)
    .filter((i) => !usedBookIndexes.has(i) && bookValues[i] !== null);

  return { bankResults, unmatchedBookIndexes };
}

export function ReconciliationDemo() {
  const t = useTranslations("UseCaseDemos.bank-reconciliation-automation");
  const [bank, setBank] = useState<string[]>(INITIAL_BANK);
  const [books, setBooks] = useState<string[]>(INITIAL_BOOKS);

  const { bankResults, unmatchedBookIndexes } = useMemo(
    () => reconcile(bank, books),
    [bank, books]
  );

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
            {t("bankHeader")}
          </p>
          <div className="flex flex-col gap-2">
            {bank.map((amount, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={amount}
                  onChange={(e) => {
                    const next = [...bank];
                    next[i] = e.target.value;
                    setBank(next);
                  }}
                  className="w-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-[13px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]"
                />
                <span
                  className={
                    bankResults[i].matched
                      ? "shrink-0 font-mono text-[9px] tracking-[0.08em] text-[var(--color-accent)]"
                      : "shrink-0 font-mono text-[9px] tracking-[0.08em] text-[var(--color-ink-faint)]"
                  }
                >
                  {bankResults[i].matched ? `✓ ${t("matched")}` : `▲ ${t("exception")}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
            {t("booksHeader")}
          </p>
          <div className="flex flex-col gap-2">
            {books.map((amount, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={amount}
                  onChange={(e) => {
                    const next = [...books];
                    next[i] = e.target.value;
                    setBooks(next);
                  }}
                  className="w-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-[13px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]"
                />
                {unmatchedBookIndexes.includes(i) && (
                  <span className="shrink-0 whitespace-nowrap font-mono text-[9px] tracking-[0.08em] text-[var(--color-ink-faint)]">
                    ▲ {t("unmatchedInBooks")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
