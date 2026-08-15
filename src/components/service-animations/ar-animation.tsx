"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";

const NODE_POSITIONS = [6, 37, 68, 96]; // percent along the track
const OUTSTANDING_START = 8240;
const TRAVEL_DURATION = 0.6; // time spent moving between two nodes
const HOLD_DURATION = 1; // time spent resting on a lit node before moving on

export function ARAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const t = useTranslations("ServiceAnimations.ar-collections-automation");

  useEffect(() => {
    const root = rootRef.current;
    const counterEl = counterRef.current;
    if (!root || !counterEl) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const formatCurrency = (val: number) =>
      "$" +
      val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const ctx = gsap.context(() => {
      const dot = root.querySelector<HTMLElement>(".ar-dot");
      const nodes = gsap.utils.toArray<HTMLElement>(".ar-node");
      const paid = root.querySelector<HTMLElement>(".ar-paid");
      if (!dot || !paid || nodes.length < 4) return;

      gsap.set(dot, { left: `${NODE_POSITIONS[0]}%` });
      gsap.set(nodes, { backgroundColor: "transparent" });
      gsap.set(paid, { opacity: 0 });
      counterEl.textContent = formatCurrency(OUTSTANDING_START);

      if (reduce) {
        gsap.set(dot, { left: `${NODE_POSITIONS[3]}%` });
        gsap.set(nodes, { backgroundColor: "var(--color-accent)" });
        counterEl.textContent = formatCurrency(0);
        gsap.set(paid, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "restart none none reverse",
        },
        // Beat before the dot starts moving, so the initial state (the
        // schedule, the outstanding balance) actually registers before
        // motion draws the eye — it was starting instantly before.
        delay: 1.2,
      });

      // Move node-to-node rather than in one continuous sweep: light day 1
      // immediately, hold, then travel/light/hold through the rest — a
      // visible beat at each escalation step instead of a blur past it.
      tl.to(nodes[0], {
        backgroundColor: "var(--color-accent)",
        duration: 0.15,
        ease: "back.out(3)",
      });
      tl.to(dot, { duration: HOLD_DURATION });

      let lastArrival = 0;
      for (let i = 1; i < NODE_POSITIONS.length; i++) {
        tl.to(dot, {
          left: `${NODE_POSITIONS[i]}%`,
          duration: TRAVEL_DURATION,
          ease: "power1.inOut",
        });
        lastArrival = tl.duration();
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

      // The outstanding balance ticks down to $0 in step with the dot's
      // travel, landing on zero right as it reaches the final node.
      const counterObj = { val: OUTSTANDING_START };
      tl.to(
        counterObj,
        {
          val: 0,
          duration: lastArrival,
          ease: "power1.in",
          onUpdate: () => {
            counterEl.textContent = formatCurrency(counterObj.val);
          },
        },
        0
      );

      tl.to(paid, { opacity: 1, duration: 0.3 });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex h-[184px] w-full flex-col justify-center border border-[var(--color-border)] bg-[var(--color-surface)] px-6 sm:px-8"
      aria-hidden="true"
    >
      <div className="relative mx-1.5 h-px bg-[var(--color-border)]">
        {NODE_POSITIONS.map((pos, i) => (
          <span
            key={i}
            className="ar-node absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-accent)]"
            style={{ left: `${pos}%` }}
          />
        ))}
        {(["day1", "day7", "day14", "day30"] as const).map((key, i) => (
          <span
            key={key}
            className="absolute top-3.5 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.06em] text-[var(--color-ink-faint)]"
            style={{ left: `${NODE_POSITIONS[i]}%` }}
          >
            {t(key)}
          </span>
        ))}
        <span className="ar-dot absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
      </div>

      <div className="mt-9 flex items-baseline justify-between">
        <div>
          <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--color-ink-faint)]">
            {t("outstanding")}
          </span>
          <br />
          <span
            ref={counterRef}
            className="font-mono text-[15px] tabular-nums text-[var(--color-ink)]"
          />
        </div>
        <span className="ar-paid font-mono text-[11px] tracking-[0.1em] text-[var(--color-accent)]">
          ✓ {t("paid")}
        </span>
      </div>
    </div>
  );
}
