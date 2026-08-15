"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";

const BANK_ROWS = ["412.68", "8,240.00", "1,318.90", "2,150.00"];
const BOOKS_ROWS = ["412.68", "8,240.00", "1,402.35", "2,150.00"];
// Row 2 (index 2) is a real mismatch — the one genuine exception that
// should get flagged for a human instead of auto-matched.
const EXCEPTION_INDEX = 2;

export function ReconciliationAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations(
    "ServiceAnimations.bank-reconciliation-automation"
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".recon-row");
      const lines = gsap.utils.toArray<HTMLElement>(".recon-line");
      const flags = gsap.utils.toArray<HTMLElement>(".recon-flag");

      gsap.set(rows, { opacity: 0, y: 6 });
      gsap.set(lines, { width: "0%" });
      gsap.set(flags, { opacity: 0, scale: 0.5 });

      if (reduce) {
        gsap.set(rows, { opacity: 1, y: 0 });
        gsap.set(lines, { width: "100%" });
        gsap.set(flags, { opacity: 1, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "restart none none reverse",
        },
        defaults: { ease: "power2.out" },
      });

      tl.to(rows, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 })
        .to(
          lines,
          { width: "100%", duration: 0.3, stagger: 0.12, ease: "power2.inOut" },
          "-=0.15"
        )
        .to(flags, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.6)" }, "-=0.25");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex h-[184px] w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 sm:px-6"
      aria-hidden="true"
    >
      <div className="flex flex-1 flex-col gap-2">
        <span className="font-mono text-[8px] tracking-[0.14em] text-[var(--color-ink-faint)]">
          {t("bank")}
        </span>
        {BANK_ROWS.map((amount, i) => (
          <span
            key={i}
            className="recon-row font-mono text-[11px] text-[var(--color-ink-muted)]"
          >
            {amount}
          </span>
        ))}
      </div>

      <div className="flex w-14 flex-shrink-0 flex-col gap-2 pt-[18px] sm:w-16">
        {BANK_ROWS.map((_, i) => (
          <div key={i} className="flex h-[19px] items-center justify-center">
            {i === EXCEPTION_INDEX ? (
              <span className="recon-flag whitespace-nowrap font-mono text-[9px] text-[var(--color-accent)]">
                ▲ {t("exception")}
              </span>
            ) : (
              <div className="recon-line h-px bg-[var(--color-accent)]" />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-end gap-2">
        <span className="font-mono text-[8px] tracking-[0.14em] text-[var(--color-ink-faint)]">
          {t("books")}
        </span>
        {BOOKS_ROWS.map((amount, i) => (
          <span
            key={i}
            className={`recon-row font-mono text-[11px] ${
              i === EXCEPTION_INDEX
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-ink-muted)]"
            }`}
          >
            {amount}
          </span>
        ))}
      </div>
    </div>
  );
}
