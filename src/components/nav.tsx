"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS } from "@/lib/site-data";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
        >
          ComptaZen
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)] md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--color-ink)]"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          {/* Real EN/FR locale switch — swaps the /fr URL prefix while
              staying on the same page (see src/i18n). */}
          <div className="flex gap-px bg-[var(--color-border)] p-px font-mono text-[10px]">
            <Link
              href={pathname}
              locale="en"
              aria-label={t("switchToEnglish")}
              className={
                locale === "en"
                  ? "bg-[var(--color-accent)] px-2.5 py-1 text-[var(--color-background)]"
                  : "bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              }
            >
              EN
            </Link>
            <Link
              href={pathname}
              locale="fr"
              aria-label={t("switchToFrench")}
              className={
                locale === "fr"
                  ? "bg-[var(--color-accent)] px-2.5 py-1 text-[var(--color-background)]"
                  : "bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              }
            >
              FR
            </Link>
          </div>
          <ThemeToggle />
          <Link
            href="/contact"
            className="border-b border-[var(--color-accent)] pb-0.5 text-sm text-[var(--color-accent)] transition-opacity hover:opacity-80"
          >
            {t("bookCall")}
          </Link>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-[var(--color-ink)]"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("toggleMenu")}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border)] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hover:text-[var(--color-ink)]"
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="mt-2 flex gap-px bg-[var(--color-border)] p-px font-mono text-[10px] w-fit">
              <Link
                href={pathname}
                locale="en"
                aria-label={t("switchToEnglish")}
                className={
                  locale === "en"
                    ? "bg-[var(--color-accent)] px-2.5 py-1 text-[var(--color-background)]"
                    : "bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-ink-muted)]"
                }
              >
                EN
              </Link>
              <Link
                href={pathname}
                locale="fr"
                aria-label={t("switchToFrench")}
                className={
                  locale === "fr"
                    ? "bg-[var(--color-accent)] px-2.5 py-1 text-[var(--color-background)]"
                    : "bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-ink-muted)]"
                }
              >
                FR
              </Link>
            </div>
            <Button asChild size="sm" className="mt-2 w-fit">
              <Link href="/contact">{t("bookDiscoveryCall")}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
