"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const ROWS = [
  {
    n: "001",
    date: "2026-07-02",
    desc: "Hydro-Québec — facture",
    account: "6110 · Utilités",
    amount: "412.68",
  },
  {
    n: "002",
    date: "2026-07-02",
    desc: "Dépôt client 4412",
    account: "1200 · Clients",
    amount: "8,240.00",
  },
  {
    n: "003",
    date: "2026-07-03",
    desc: "Fournitures Bureau Plus",
    account: "6250 · Bureau",
    amount: "96.44",
  },
  {
    n: "004",
    date: "2026-07-05",
    desc: "TPS/TVQ — juin",
    account: "2310 · Taxes",
    amount: "1,318.90",
  },
  {
    n: "005",
    date: "2026-07-06",
    desc: "Virement Interac",
    account: "1010 · Banque",
    amount: "2,150.00",
  },
  {
    n: "006",
    date: "2026-07-08",
    desc: "Amortissement équipement",
    account: "7400 · Amort.",
    amount: "305.00",
  },
];

export function LedgerAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".ledger-row");
      const rules = gsap.utils.toArray<HTMLElement>(".ledger-rule");
      const total = container.querySelector<HTMLElement>(".ledger-total");
      const check = container.querySelector<HTMLElement>(".ledger-check");
      if (!total || !check) return;

      gsap.set(rows, {
        opacity: 0.3,
        x: () => gsap.utils.random(-56, 56),
        y: () => gsap.utils.random(-16, 16),
        rotate: () => gsap.utils.random(-4, 4),
      });
      gsap.set(rules, { scaleY: 0 });
      gsap.set(total, { opacity: 0 });
      gsap.set(check, { opacity: 0, scale: 0.5 });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
        // Loop the reveal instead of playing once and going static: hold
        // at "reconciled" for a couple seconds, then snap back to the
        // scattered starting state and replay.
        repeat: -1,
        repeatDelay: 2,
      });

      tl.to(rows, {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.6,
        stagger: 0.06,
      })
        .to(rules, { scaleY: 1, duration: 0.4, stagger: 0.05 }, "-=0.35")
        .to(total, { opacity: 1, duration: 0.3 }, "-=0.1")
        .to(
          check,
          { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.6)" },
          "-=0.05"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-hidden="true"
    >
      <div
        className="ledger-rule absolute top-0 bottom-0 hidden w-px origin-top bg-[var(--color-border-soft)] sm:block"
        style={{ left: "172px" }}
      />
      <div
        className="ledger-rule absolute top-0 bottom-0 hidden w-px origin-top bg-[var(--color-border-soft)] sm:block"
        style={{ right: "160px" }}
      />

      {/* header row */}
      <div className="grid grid-cols-[32px_1fr_88px] gap-3 border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-mono text-[9px] tracking-[0.16em] text-[var(--color-ink-faint)] sm:grid-cols-[40px_88px_1fr_128px_100px_20px] sm:gap-4 sm:px-6">
        <span>#</span>
        <span className="hidden sm:block">DATE</span>
        <span>DESCRIPTION</span>
        <span className="hidden sm:block">COMPTE</span>
        <span className="text-right">MONTANT</span>
        <span className="hidden sm:block" />
      </div>

      {ROWS.map((row) => (
        <div
          key={row.n}
          className="ledger-row grid grid-cols-[32px_1fr_88px] items-center gap-3 border-b border-[var(--color-border-soft)] px-4 py-3 text-[13px] text-[var(--color-ink)] sm:grid-cols-[40px_88px_1fr_128px_100px_20px] sm:gap-4 sm:px-6"
        >
          <span className="font-mono text-[var(--color-ink-faint)]">
            {row.n}
          </span>
          <span className="hidden font-mono text-[var(--color-ink-muted)] sm:block">
            {row.date}
          </span>
          <span className="truncate">{row.desc}</span>
          <span className="hidden font-mono text-[var(--color-ink-muted)] sm:block">
            {row.account}
          </span>
          <span className="text-right font-mono tabular-nums">
            {row.amount}
          </span>
          <span className="hidden h-1.5 w-1.5 justify-self-end bg-[var(--color-accent)] sm:block" />
        </div>
      ))}

      <div className="ledger-total grid grid-cols-[32px_1fr_88px] items-center gap-3 bg-[var(--color-background)] px-4 py-4 sm:grid-cols-[40px_88px_1fr_128px_100px_20px] sm:gap-4 sm:px-6">
        <span className="hidden sm:block" />
        <span className="hidden sm:block" />
        <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-accent)]">
          RÉCONCILIÉ
        </span>
        <span className="hidden font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)] sm:block">
          6 / 6 APPARIÉS
        </span>
        <span className="text-right font-mono text-[15px] tabular-nums text-[var(--color-ink)]">
          12,523.02
        </span>
        <span className="ledger-check flex h-[18px] w-[18px] items-center justify-center justify-self-end bg-[var(--color-accent)] text-[10px] text-[var(--color-background)]">
          ✓
        </span>
      </div>
    </div>
  );
}
