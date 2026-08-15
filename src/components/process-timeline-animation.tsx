"use client";

import { Fragment, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import { PROCESS_KEYS } from "@/lib/site-data";

const TRAVEL_DURATION = 0.6; // time spent moving between two nodes
const HOLD_DURATION = 1; // time spent resting on a lit node before moving on

// A vertical rail running down the left edge of the four engagement
// steps — the token travels discovery → proposal → build → handoff in
// lockstep with the numbered list itself (rather than living in its own
// horizontal panel above it) and settles on "running," a callback to the
// homepage hero's own "built once, running on your terms."
export function ProcessTimelineAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("ProcessAnimation");
  const tProcess = useTranslations("Process");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const dot = root.querySelector<HTMLElement>(".pr-dot");
      const nodes = gsap.utils.toArray<HTMLElement>(".pr-node");
      const status = root.querySelector<HTMLElement>(".pr-status");
      if (!dot || !status || nodes.length === 0) return;

      // Node vertical centers are measured rather than assumed — step
      // copy wraps to different line counts in French vs. English (and
      // at narrow widths), so the rail has to match whatever the real
      // rendered row heights turn out to be.
      const rootTop = root.getBoundingClientRect().top;
      const positions = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top + r.height / 2 - rootTop;
      });
      const start = positions[0];
      const end = positions[positions.length - 1];

      gsap.set(dot, { top: start });
      gsap.set(nodes, { backgroundColor: "transparent" });
      gsap.set(status, { opacity: 0, y: 4 });

      if (reduce) {
        gsap.set(dot, { top: end });
        gsap.set(nodes, { backgroundColor: "var(--color-accent)" });
        gsap.set(status, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          toggleActions: "restart none none reverse",
        },
        delay: 0.3,
      });

      // Move node-to-node rather than in one continuous sweep: light the
      // first node immediately, hold, then travel/light/hold through the
      // rest — a visible beat at each step instead of a blur past it.
      tl.to(nodes[0], {
        backgroundColor: "var(--color-accent)",
        duration: 0.15,
        ease: "back.out(3)",
      });
      tl.to(dot, { duration: HOLD_DURATION });

      for (let i = 1; i < positions.length; i++) {
        tl.to(dot, {
          top: positions[i],
          duration: TRAVEL_DURATION,
          ease: "power1.inOut",
        });
        tl.to(
          nodes[i],
          {
            backgroundColor: "var(--color-accent)",
            duration: 0.15,
            ease: "back.out(3)",
          },
          "-=0.1"
        );
        tl.to(dot, { duration: HOLD_DURATION });
      }

      tl.to(status, { opacity: 1, y: 0, duration: 0.3 });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <span
        className="pr-dot absolute left-[9px] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]"
        aria-hidden="true"
      />

      <div className="grid grid-cols-[18px_1fr] gap-x-6">
        {PROCESS_KEYS.map((key, i) => (
          <Fragment key={key}>
            <div
              className="relative flex flex-col items-center"
              aria-hidden="true"
            >
              <span className="pr-node mt-2 h-2 w-2 shrink-0 border border-[var(--color-accent)]" />
              {i < PROCESS_KEYS.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-[var(--color-border)]" />
              )}
            </div>

            <div
              className={
                i === 0
                  ? "flex gap-6 pb-8"
                  : "flex gap-6 border-t border-[var(--color-border)] py-8"
              }
            >
              <span className="font-mono shrink-0 text-2xl text-[var(--color-accent)]">
                {key}
              </span>
              <div>
                <h2 className="font-display text-xl font-medium text-[var(--color-ink)]">
                  {tProcess(`${key}.title`)}
                </h2>
                <p className="mt-2 leading-relaxed text-[var(--color-ink-muted)]">
                  {tProcess(`${key}.description`)}
                </p>
                {i === PROCESS_KEYS.length - 1 && (
                  <span className="pr-status mt-4 inline-block font-mono text-[11px] tracking-[0.1em] text-[var(--color-accent)]">
                    {t("status")}
                  </span>
                )}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
