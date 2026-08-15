"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";

// The invoice token physically travels a track through capture → approve →
// sync — one continuous piece of motion instead of three stages lighting
// up independently in place. See the design mockup this was built from
// for the full rationale (comptazen-service-animations.html).
export function InvoiceAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("ServiceAnimations.invoice-ap-automation");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".ap-doc-line");
      const scan = root.querySelector<HTMLElement>(".ap-scan");
      const checks = gsap.utils.toArray<HTMLElement>(".ap-chk");
      const tile = root.querySelector<HTMLElement>(".ap-sync-tile");
      const status = root.querySelector<HTMLElement>(".ap-sync-status");
      const token = root.querySelector<HTMLElement>(".ap-token");
      const nodes = gsap.utils.toArray<HTMLElement>(".ap-node");
      if (!scan || !tile || !status || !token || nodes.length < 3) return;

      gsap.set(scan, { top: "0%" });
      gsap.set(checks, { opacity: 0, scale: 0.4 });
      gsap.set(status, { opacity: 0, y: 4 });
      gsap.set(token, { left: "0%", opacity: 0, scale: 0.5 });
      gsap.set(nodes, { backgroundColor: "var(--color-surface)" });

      if (reduce) {
        gsap.set(lines, { opacity: 1 });
        gsap.set(checks, { opacity: 1, scale: 1 });
        gsap.set(status, { opacity: 1, y: 0 });
        gsap.set(token, { left: "100%", opacity: 0 });
        gsap.set(nodes, { backgroundColor: "var(--color-accent)" });
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

      tl.to(token, { opacity: 1, scale: 1, duration: 0.2 }, 0)
        .to(
          nodes[0],
          { backgroundColor: "var(--color-accent)", duration: 0.15 },
          0
        )
        .to(scan, { top: "100%", duration: 0.7, ease: "power2.inOut" }, 0)
        .to(lines, { opacity: 1, duration: 0.25, stagger: 0.18 }, 0.05)
        .to(token, { left: "50%", duration: 0.55, ease: "power2.inOut" }, "+=0.15")
        .to(
          nodes[1],
          { backgroundColor: "var(--color-accent)", duration: 0.15 },
          "<"
        )
        .to(
          checks,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(2.4)",
            stagger: 0.15,
          },
          "-=0.1"
        )
        .to(token, { left: "100%", duration: 0.55, ease: "power2.inOut" }, "+=0.2")
        .to(
          nodes[2],
          { backgroundColor: "var(--color-accent)", duration: 0.15 },
          "<"
        )
        .to(tile, { scale: 1.07, duration: 0.18, yoyo: true, repeat: 1 }, "-=0.05")
        .to(token, { opacity: 0, duration: 0.25 }, "<")
        .to(status, { opacity: 1, y: 0, duration: 0.3 }, "-=0.05");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex h-[184px] flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-hidden="true"
    >
      <div className="px-4 pt-4 sm:px-8">
        <div className="relative h-px bg-[var(--color-border)]">
          <span className="ap-node absolute left-0 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 border border-[var(--color-border)] bg-[var(--color-surface)]" />
          <span className="ap-node absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 border border-[var(--color-border)] bg-[var(--color-surface)]" />
          <span className="ap-node absolute left-full top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 border border-[var(--color-border)] bg-[var(--color-surface)]" />
          <span className="ap-token absolute left-0 top-1/2 h-2 w-3.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
        </div>
        <div className="mt-2.5 flex justify-between font-mono text-[9px] tracking-[0.16em] text-[var(--color-ink-faint)]">
          <span>{t("stageCapture")}</span>
          <span>{t("stageApprove")}</span>
          <span>{t("stageSync")}</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex flex-1 items-center justify-center p-2 sm:p-3.5">
          <div className="relative h-[78px] w-[52px] overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] p-1.5 sm:w-[60px]">
            <div className="mb-1.5 font-mono text-[7px] tracking-[0.04em] text-[var(--color-ink-faint)]">
              {t("docId")}
            </div>
            <div className="ap-doc-line mb-1.5 h-[3px] w-4/5 bg-[var(--color-ink-muted)] opacity-[.22]" />
            <div className="ap-doc-line mb-1.5 h-[3px] w-[55%] bg-[var(--color-ink-muted)] opacity-[.22]" />
            <div className="ap-doc-line mb-1.5 h-[3px] w-[66%] bg-[var(--color-ink-muted)] opacity-[.22]" />
            <div className="ap-scan absolute inset-x-0 top-0 h-0.5 bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
          </div>
        </div>
        <div className="w-px flex-shrink-0 bg-[var(--color-border-soft)]" />
        <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-2 sm:p-3.5">
          <div className="flex w-full max-w-[100px] items-center justify-between font-mono text-[8px] tracking-[0.04em] text-[var(--color-ink-muted)] sm:text-[9px] sm:tracking-[0.06em]">
            <span>{t("roleManager")}</span>
            <span className="ap-chk flex h-[11px] w-[11px] shrink-0 items-center justify-center border border-[var(--color-border)] text-[8px] text-[var(--color-accent)]">
              ✓
            </span>
          </div>
          <div className="flex w-full max-w-[100px] items-center justify-between font-mono text-[8px] tracking-[0.04em] text-[var(--color-ink-muted)] sm:text-[9px] sm:tracking-[0.06em]">
            <span>{t("roleFinance")}</span>
            <span className="ap-chk flex h-[11px] w-[11px] shrink-0 items-center justify-center border border-[var(--color-border)] text-[8px] text-[var(--color-accent)]">
              ✓
            </span>
          </div>
        </div>
        <div className="w-px flex-shrink-0 bg-[var(--color-border-soft)]" />
        <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-2 sm:p-3.5">
          <div className="ap-sync-tile border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-2 text-center font-mono text-[8px] tracking-[0.06em] text-[var(--color-ink)] sm:px-3.5 sm:text-[9px] sm:tracking-[0.08em]">
            {t("syncTile")}
          </div>
          <div className="ap-sync-status text-center font-mono text-[7px] tracking-[0.08em] text-[var(--color-accent)] sm:text-[8px] sm:tracking-[0.12em]">
            {t("syncStatus")}
          </div>
        </div>
      </div>
    </div>
  );
}
