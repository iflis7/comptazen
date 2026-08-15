import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/site-data";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
            ComptaZen
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {t("tagline")}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--color-ink)]">
              {tNav(link.key)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl border-t border-[var(--color-border-soft)] px-6 py-6 font-mono text-[11px] tracking-[0.06em] text-[var(--color-ink-faint)]">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
