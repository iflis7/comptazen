"use client";

import { Fragment, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import { LAYER_SLUGS, type LayerSlug } from "@/lib/site-data";

const TRAVEL_DURATION = 0.8;
const HOLD_DURATION = 0.6;

// Layers with a two-part price (Judgment: Standard / Sovereign) get a
// small ledger-style two-line split instead of one crowded string.
const SPLIT_PRICE: Partial<Record<LayerSlug, boolean>> = {
  judgment: true,
};

// Visual weight varies by layer instead of every card looking identical:
// Automation is the core fixed-price build (biggest number), Work and
// Support read lighter/utility (hourly, ongoing), Judgment sits between.
const PRICE_SCALE: Record<LayerSlug, string> = {
  work: "text-lg sm:text-xl",
  automation: "text-2xl sm:text-3xl",
  judgment: "text-base sm:text-lg",
  "support-custom": "text-lg sm:text-xl",
};

export function LayersTimeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("ServicesPage");
  const tLayers = useTranslations("Layers");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const dot = root.querySelector<HTMLElement>(".lt-dot");
      const nodes = gsap.utils.toArray<HTMLElement>(".lt-node");
      const cards = gsap.utils.toArray<HTMLElement>(".lt-card");
      if (!dot || nodes.length === 0) return;

      // Node centers are measured (not assumed) — card height varies a lot
      // by locale and content, so the rail has to match real layout.
      const rootTop = root.getBoundingClientRect().top;
      const positions = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top + r.height / 2 - rootTop;
      });
      const start = positions[0];
      const end = positions[positions.length - 1];

      gsap.set(dot, { top: start });
      gsap.set(nodes, { backgroundColor: "transparent" });
      gsap.set(cards, { opacity: 0.35, y: 12 });

      if (reduce) {
        gsap.set(dot, { top: end });
        gsap.set(nodes, { backgroundColor: "var(--color-accent)" });
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // A scrub timeline maps its whole internal sequence to scroll
      // progress through the rail — the dot travels, each node lights,
      // and its card resolves into focus in lockstep with reading it,
      // rather than a one-shot reveal that's already finished by the
      // time the visitor actually reaches layer three or four.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 65%",
          end: "bottom 75%",
          scrub: 0.6,
        },
      });

      tl.to(nodes[0], { backgroundColor: "var(--color-accent)", duration: 0.2 })
        .to(cards[0], { opacity: 1, y: 0, duration: 0.3 }, "<")
        .to(dot, { duration: HOLD_DURATION });

      for (let i = 1; i < positions.length; i++) {
        tl.to(dot, {
          top: positions[i],
          duration: TRAVEL_DURATION,
          ease: "none",
        });
        tl.to(
          nodes[i],
          { backgroundColor: "var(--color-accent)", duration: 0.2 },
          "-=0.15"
        );
        tl.to(cards[i], { opacity: 1, y: 0, duration: 0.3 }, "<");
        tl.to(dot, { duration: HOLD_DURATION });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <span
        className="lt-dot absolute left-[9px] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)] sm:block"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-[18px_1fr]">
        {LAYER_SLUGS.map((slug, i) => (
          <Fragment key={slug}>
            <div
              className="relative hidden flex-col items-center sm:flex"
              aria-hidden="true"
            >
              <span className="lt-node mt-2 h-2 w-2 shrink-0 border border-[var(--color-accent)]" />
              {i < LAYER_SLUGS.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-[var(--color-border)]" />
              )}
            </div>

            <article
              id={slug}
              className={
                "lt-card scroll-mt-24 py-12" +
                (i === 0
                  ? " sm:pt-0"
                  : " border-t border-[var(--color-border)] sm:border-t-0")
              }
            >
              <span className="font-mono text-xs tracking-[0.1em] text-[var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display mt-3 text-2xl font-medium text-[var(--color-ink)] sm:text-3xl">
                {tLayers(`${slug}.name`)}
              </h2>

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
                    {t("problemLabel")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {tLayers(`${slug}.problem`)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
                    {tLayers(`${slug}.buildLabel`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {tLayers(`${slug}.build`)}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
                  {t("outcomeLabel")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {tLayers(`${slug}.outcome`)}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--color-border-soft)] bg-[var(--color-surface)] px-5 py-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-faint)]">
                    {t("timelineLabel")}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-[var(--color-ink)]">
                    {tLayers(`${slug}.timeline`)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-faint)]">
                    {t("priceLabel")}
                  </p>
                  {SPLIT_PRICE[slug] ? (
                    <div className="mt-1.5 space-y-0.5">
                      {tLayers(`${slug}.price`)
                        .split(" · ")
                        .map((part) => (
                          <p
                            key={part}
                            className="font-mono font-semibold tabular-nums text-[var(--color-accent)]"
                          >
                            {part}
                          </p>
                        ))}
                    </div>
                  ) : (
                    <p
                      className={
                        "mt-1.5 font-mono font-semibold tabular-nums text-[var(--color-accent)] " +
                        PRICE_SCALE[slug]
                      }
                    >
                      {tLayers(`${slug}.price`)}
                    </p>
                  )}
                </div>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
