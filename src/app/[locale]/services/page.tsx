import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ServiceAnimation } from "@/components/service-animations";
import { LAUNCH_PRICING_ACTIVE, SERVICE_SLUGS } from "@/lib/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ServicesPage");
  const tServices = await getTranslations("Services");

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
          {LAUNCH_PRICING_ACTIVE ? t("intro") : t("introEnded")}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col">
          {SERVICE_SLUGS.map((slug, i) => {
            const note = tServices(`${slug}.note`);
            const hasMarketPrice = tServices(`${slug}.marketPrice`) !== "—";
            const heroPrice =
              LAUNCH_PRICING_ACTIVE || !hasMarketPrice
                ? tServices(`${slug}.introPrice`)
                : tServices(`${slug}.marketPrice`);
            return (
              <article
                key={slug}
                id={slug}
                className="scroll-mt-24 border-t border-[var(--color-border)] py-12 first:pt-0"
              >
                <span className="font-mono text-xs tracking-[0.1em] text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display mt-3 text-2xl font-medium text-[var(--color-ink)] sm:text-3xl">
                  {tServices(`${slug}.name`)}
                </h2>

                <div className="mt-6">
                  <ServiceAnimation slug={slug} />
                </div>

                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
                      {t("problemLabel")}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {tServices(`${slug}.problem`)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
                      {t("buildLabel")}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {tServices(`${slug}.build`)}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-faint)]">
                    {t("outcomeLabel")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {tServices(`${slug}.outcome`)}
                  </p>
                </div>

                {note && (
                  <p className="mt-6 border-l-2 border-[var(--color-accent)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {note}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-start gap-10 border-t border-[var(--color-border-soft)] pt-6 text-sm">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-faint)]">
                      {t("timelineLabel")}
                    </p>
                    <p className="mt-1.5 font-medium text-[var(--color-ink)]">
                      {tServices(`${slug}.timeline`)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-faint)]">
                      {LAUNCH_PRICING_ACTIVE
                        ? t("priceLabel")
                        : t("priceLabelEnded")}
                    </p>
                    <p className="mt-1.5 font-mono font-semibold text-[var(--color-accent)]">
                      {heroPrice}
                    </p>
                    {LAUNCH_PRICING_ACTIVE && hasMarketPrice && (
                      <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                        {t("marketPriceNote", {
                          marketPrice: tServices(`${slug}.marketPrice`),
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bundle pricing */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <h2 className="font-display text-2xl font-medium text-[var(--color-ink)] sm:text-3xl">
            {t("bundleTitle")}
          </h2>
          <p className="mt-4 text-[var(--color-ink-muted)]">
            {t("bundleIntro")}{" "}
            <span className="font-mono text-[var(--color-accent)]">
              {t("bundlePrice")}
            </span>{" "}
            {t("bundleSuffix")}
          </p>
        </div>
      </section>

      {/* Also available */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h2 className="font-display text-xl font-medium text-[var(--color-ink)]">
          {t("alsoAvailableTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {t("alsoAvailableBody")}
        </p>
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
