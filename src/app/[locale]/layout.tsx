import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { buildAlternates, localizedUrl, type SiteLocale } from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  weight: ["300", "400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/", locale as SiteLocale),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const tMeta = await getTranslations({ locale, namespace: "Home.meta" });

  // Organization structured data — kept deliberately minimal and honest:
  // only facts that are actually true today (name, url, contact, founder,
  // service area). No fabricated address, phone, or review data.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "ComptaZen",
    url: localizedUrl("/", locale as SiteLocale),
    description: tMeta("description"),
    email: "info@comptazen.digital",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Québec, Canada",
    },
    founder: {
      "@type": "Person",
      name: "Hafid Saadi",
    },
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[var(--color-background)] antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
