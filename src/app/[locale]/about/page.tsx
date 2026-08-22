import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("AboutPage");

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-16 sm:pt-24">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-accent)]">
          {t("kicker")}
        </p>
        <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          {t("h1")}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
          {t("founderBio")}
        </p>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-faint)]">
            {t("approachLabel")}
          </span>
          <h2 className="font-display mt-3 text-2xl font-medium text-[var(--color-ink)] sm:text-3xl">
            {t("approachTitle")}
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--color-ink-muted)]">
            {t("approachBody")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--color-ink-faint)]">
          {t("headedLabel")}
        </span>
        <h2 className="font-display mt-3 text-2xl font-medium text-[var(--color-ink)] sm:text-3xl">
          {t("headedTitle")}
        </h2>
        <p className="mt-4 leading-relaxed text-[var(--color-ink-muted)]">
          {t("headedBody")}
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
