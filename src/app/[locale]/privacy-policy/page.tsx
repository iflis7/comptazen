import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates, type SiteLocale } from "@/lib/seo";

type Section = { title: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/privacy-policy", locale as SiteLocale),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("PrivacyPolicy");
  const sections = t.raw("sections") as Section[];

  return (
    <section className="mx-auto max-w-2xl px-6 pb-24 pt-16 sm:pt-24">
      <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-accent)]">
        {t("kicker")}
      </p>
      <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
        {t("h1")}
      </h1>

      <div className="mt-12 flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-lg font-medium text-[var(--color-ink)]">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-16 border-t border-[var(--color-border-soft)] pt-6 font-mono text-xs tracking-[0.06em] text-[var(--color-ink-faint)]">
        {t("updated")}
      </p>
    </section>
  );
}
