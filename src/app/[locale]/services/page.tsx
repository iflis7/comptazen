import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LayersTimeline } from "@/components/layers-timeline";
import { buildAlternates, type SiteLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/services", locale as SiteLocale),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ServicesPage");

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-accent)]">
          {t("kicker")}
        </p>
        <h1 className="font-display mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          {t("h1")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
          {t("intro")}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <LayersTimeline />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 text-center">
        <Button
          asChild
          size="lg"
          className="h-auto w-full whitespace-normal px-8 py-3.5 text-center sm:h-13 sm:w-auto sm:whitespace-nowrap sm:py-0"
        >
          <Link href="/contact">{t("cta")}</Link>
        </Button>
      </section>
    </>
  );
}
