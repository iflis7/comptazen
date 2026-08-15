import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ContactPage");

  return (
    <section className="mx-auto max-w-2xl px-6 pb-24 pt-16 sm:pt-24">
      <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-accent)]">
        {t("kicker")}
      </p>
      <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
        {t("h1")}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
        {t("intro")}
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>
    </section>
  );
}
