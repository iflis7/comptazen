"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";

// An abstract animation for the catch-all "Custom & Special Projects"
// service — there's no fixed process to depict here, so instead of a
// scroll-triggered sequence that settles on an end state (like the other
// four), this one pulses continuously: a beacon rather than a pipeline,
// deliberately never "finishing," since the whole point is that scope
// isn't defined yet.
export function SpecialAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("ServiceAnimations.custom-special-projects");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const core = root.querySelector<HTMLElement>(".sp-core");
      const rings = gsap.utils.toArray<HTMLElement>(".sp-ring");
      if (!core || rings.length === 0) return;

      gsap.set(core, { scale: 1 });
      gsap.set(rings, { scale: 0.4, opacity: 0 });

      if (reduce) {
        gsap.set(rings, { scale: 1.4, opacity: 0.2 });
        return;
      }

      gsap.to(core, {
        scale: 1.2,
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      rings.forEach((ring, i) => {
        gsap.fromTo(
          ring,
          { scale: 0.4, opacity: 0.5 },
          {
            scale: 2.4,
            opacity: 0,
            duration: 2.6,
            ease: "power1.out",
            repeat: -1,
            delay: i * 0.9,
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex h-[184px] w-full flex-col items-center justify-center overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-hidden="true"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="sp-ring absolute h-16 w-16 rounded-full border border-[var(--color-accent)]" />
        <span className="sp-ring absolute h-16 w-16 rounded-full border border-[var(--color-accent)]" />
        <span className="sp-core relative h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
      </div>
      <span className="mt-6 font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
        {t("label")}
      </span>
    </div>
  );
}
