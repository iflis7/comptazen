import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ProcessTimelineAnimation } from "@/components/process-timeline-animation";
import { buildAlternates, type SiteLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "HowItWorksPage.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/how-it-works", locale as SiteLocale),
  };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HowItWorksPage");

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-16 sm:pt-24">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-accent)]">
          {t("kicker")}
        </p>
        <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          {t("h1")}
        </h1>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <ProcessTimelineAnimation />

        <p className="mt-8 border-t border-[var(--color-border)] pt-8 leading-relaxed text-[var(--color-ink-muted)]">
          <span className="font-semibold text-[var(--color-ink)]">
            {t("afterLabel")}
          </span>{" "}
          {t("afterBody")}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <Button asChild size="lg">
          <Link href="/contact">{t("cta")}</Link>
        </Button>
      </section>
    </>
  );
}
