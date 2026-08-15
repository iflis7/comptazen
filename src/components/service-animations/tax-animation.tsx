"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";

// Deliberately reuses the homepage's scatter → order gesture at a smaller
// scale for the document stack — this is the one service closest in spirit
// to the homepage's own reconciliation story.
export function TaxAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("ServiceAnimations.quebec-gst-qst-compliance");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".tax-line");
      const docs = gsap.utils.toArray<HTMLElement>(".tax-doc");
      const check = root.querySelector<HTMLElement>(".tax-doc-check");
      if (docs.length < 3 || !check) return;

      // docs[0] and docs[1] are the back sheets (painted first, settle
      // with a slight offset so their edges peek out); docs[2] is the
      // front sheet with the checkmark, painted last so it's always on
      // top of the pile regardless of the others' offset.
      gsap.set(lines, { opacity: 0, y: 4 });
      gsap.set(docs[0], { x: 14, y: -10, rotate: -6, opacity: 0.7 });
      gsap.set(docs[1], { x: -16, y: 8, rotate: 8, opacity: 0.7 });
      gsap.set(docs[2], { x: 0, y: 0, rotate: 0 });
      gsap.set(check, { opacity: 0 });

      if (reduce) {
        gsap.set(lines, { opacity: 1, y: 0 });
        gsap.set(docs[0], { x: 2, y: -3, rotate: 0, opacity: 1 });
        gsap.set(docs[1], { x: -2, y: 3, rotate: 0, opacity: 1 });
        gsap.set(check, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "restart none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(lines, { opacity: 1, y: 0, duration: 0.3, stagger: 0.16 })
        .to(
          docs[0],
          { x: 2, y: -3, rotate: 0, opacity: 1, duration: 0.45 },
          "-=0.2"
        )
        .to(
          docs[1],
          { x: -2, y: 3, rotate: 0, opacity: 1, duration: 0.45 },
          "-=0.35"
        )
        .to(check, { opacity: 1, duration: 0.3 }, "-=0.1");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex h-[184px] w-full items-center border border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-hidden="true"
    >
      <div className="flex flex-1 flex-col gap-2 px-4 sm:px-6">
        <div className="tax-line flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)] sm:text-[10.5px]">
          <span>{t("subtotal")}</span>
          <span>1,240.00</span>
        </div>
        <div className="tax-line flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)] sm:text-[10.5px]">
          <span>{t("gst")}</span>
          <span>62.00</span>
        </div>
        <div className="tax-line flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)] sm:text-[10.5px]">
          <span>{t("qst")}</span>
          <span>123.69</span>
        </div>
        <div className="tax-line mt-0.5 flex justify-between border-t border-[var(--color-border-soft)] pt-2 font-mono text-[11px] text-[var(--color-ink)] sm:text-[11.5px]">
          <span>{t("total")}</span>
          <span>1,425.69</span>
        </div>
      </div>
      <div className="w-px flex-shrink-0 self-stretch bg-[var(--color-border-soft)]" />
      <div className="relative h-full w-24 flex-shrink-0 sm:w-[130px]">
        <div className="tax-doc absolute left-1/2 top-1/2 h-[82px] w-16 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-border)] bg-[var(--color-background)]" />
        <div className="tax-doc absolute left-1/2 top-1/2 h-[82px] w-16 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-border)] bg-[var(--color-background)]" />
        <div className="tax-doc absolute left-1/2 top-1/2 h-[82px] w-16 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-border)] bg-[var(--color-background)]">
          <span className="tax-doc-check absolute right-1.5 top-1.5 font-mono text-[8px] text-[var(--color-accent)]">
            ✓ {t("archived")}
          </span>
        </div>
      </div>
    </div>
  );
}
