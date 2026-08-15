import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LedgerAnimation } from "@/components/ledger-animation";
import {
  SERVICE_SLUGS,
  PROCESS_KEYS,
  SELF_HOSTED_KEYS,
} from "@/lib/site-data";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tServices = await getTranslations("Services");
  const tSelfHosted = await getTranslations("SelfHosted");
  const tProcess = await getTranslations("Process");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 sm:pt-28">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-accent)]">
          {t("kicker")}
        </p>
        <h1 className="font-display mt-8 max-w-4xl text-[2.6rem] font-semibold leading-[0.98] tracking-tight text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
          {t("h1")}
        </h1>
        <div className="mt-10 grid gap-8 border-b border-[var(--color-border)] pb-14 sm:grid-cols-[1fr_320px] sm:items-end sm:gap-14">
          <p className="max-w-xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
            {t("sub")}
          </p>
          <div className="flex flex-col items-start gap-3">
            <Button asChild size="lg">
              <Link href="/contact">{t("ctaPrimary")}</Link>
            </Button>
            <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-faint)]">
              {t("ctaNote")}
            </span>
          </div>
        </div>
      </section>

      {/* Ledger animation */}
      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <LedgerAnimation />
      </section>

      {/* The problem, stated plainly */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <p className="text-xl leading-relaxed text-[var(--color-ink)] sm:text-2xl">
            {t("problem")}
            <span className="text-[var(--color-accent)]"> {t("problemHighlight")}</span>
          </p>
        </div>
      </section>

      {/* 01 — What we fix */}
      <section>
        <div className="mx-auto flex max-w-6xl items-baseline justify-between px-6 pb-2 pt-16 sm:pt-20">
          <h2 className="font-display text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
            {t("servicesTitle")}
          </h2>
          <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-faint)]">
            {t("servicesLabel")}
          </span>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          {SERVICE_SLUGS.map((slug, i) => (
            <div
              key={slug}
              className="grid grid-cols-1 gap-4 border-t border-[var(--color-border-soft)] py-7 sm:grid-cols-[48px_1fr_auto] sm:items-start sm:gap-8"
            >
              <span className="font-mono text-xs text-[var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-medium text-[var(--color-ink)]">
                  {tServices(`${slug}.name`)}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {tServices(`${slug}.build`)}
                </p>
              </div>
              <Link
                href={`/services#${slug}`}
                className="font-mono text-xs tracking-[0.06em] text-[var(--color-accent)] hover:underline sm:self-center sm:whitespace-nowrap"
              >
                {t("seeHowItWorks")}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 02 — Why self-hosted */}
      <section className="mt-20 border-t border-[var(--color-border)] sm:mt-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-16 sm:py-20">
          <div>
            <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-faint)]">
              {t("selfHostedLabel")}
            </span>
            <h2 className="font-display mt-5 text-3xl font-medium leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {t("selfHostedTitle")}
            </h2>
          </div>
          <div className="flex flex-col">
            {SELF_HOSTED_KEYS.map((key) => (
              <div
                key={key}
                className="grid grid-cols-[88px_1fr] gap-5 border-b border-[var(--color-border-soft)] py-4"
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-accent)]">
                  {tSelfHosted(`${key}.label`).toUpperCase()}
                </span>
                <span className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {tSelfHosted(`${key}.text`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — How it works */}
      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-faint)]">
            {t("processLabel")}
          </span>
          <div className="mt-10 grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
            {PROCESS_KEYS.map((key) => (
              <div key={key} className="bg-[var(--color-surface)] p-7">
                <div className="font-mono text-xs text-[var(--color-accent)]">
                  {key}
                </div>
                <h3 className="font-display mt-5 text-lg font-medium text-[var(--color-ink)]">
                  {tProcess(`${key}.title`)}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                  {tProcess(`${key}.description`)}
                </p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-12">
            <Link href="/contact">{t("bookYourCall")}</Link>
          </Button>
        </div>
      </section>

      {/* 04 — Why ComptaZen, honestly */}
      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-16 sm:py-20">
          <div>
            <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-faint)]">
              {t("whyLabel")}
            </span>
            <h2 className="font-display mt-5 text-3xl font-medium leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {t("whyTitle")}
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            {t("whyBody")}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-20 sm:flex-row sm:items-end sm:py-24">
          <div>
            <h2 className="font-display max-w-lg text-3xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {t("finalCtaTitle")}
            </h2>
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              {t("finalCtaSub")}
            </p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/contact">{t("finalCtaTitle")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
