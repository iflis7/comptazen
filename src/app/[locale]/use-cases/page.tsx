import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { UseCaseDemo } from "@/components/use-case-demos";
import { USE_CASE_SLUGS } from "@/lib/site-data";
import { buildAlternates, type SiteLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UseCasesPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/use-cases", locale as SiteLocale),
  };
}

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("UseCasesPage");
  const tServices = await getTranslations("Services");
  const tDemos = await getTranslations("UseCaseDemos");

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
        <div className="flex flex-col">
          {USE_CASE_SLUGS.map((slug, i) => (
            <article
              key={slug}
              id={slug}
              className="scroll-mt-24 border-t border-[var(--color-border)] py-12 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-xs tracking-[0.1em] text-[var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display mt-3 text-2xl font-medium text-[var(--color-ink)] sm:text-3xl">
                {tServices(`${slug}.name`)}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {tDemos(`${slug}.blurb`)}
              </p>

              <div className="mt-6">
                <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
                  {t("tryLabel")}
                </p>
                <UseCaseDemo slug={slug} />
              </div>

              <div className="mt-5">
                <Link
                  href="/services#automation"
                  className="font-mono text-xs tracking-[0.06em] text-[var(--color-accent)] hover:underline"
                >
                  {t("seePricingLink")}
                </Link>
              </div>
            </article>
          ))}
        </div>
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
