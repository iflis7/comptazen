"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [consent, setConsent] = useState(false);
  // Captured once, on mount — used as a bot-timing trap (see the API
  // route): a submission faster than a human could plausibly fill the
  // form is rejected server-side. Set in an effect rather than as the
  // useRef initializer, since Date.now() is impure and must not run
  // during render.
  const renderedAtRef = useRef(0);
  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      business: formData.get("business"),
      email: formData.get("email"),
      pain: formData.get("pain"),
      // Honeypot — left blank by real visitors, since it's hidden from view.
      website: formData.get("website"),
      renderedAt: renderedAtRef.current,
      consent,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit_failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="font-display text-xl font-medium text-[var(--color-ink)]">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-[var(--color-ink-muted)]">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot field — hidden from sighted and screen-reader users alike
          (unlike Tailwind's sr-only, which stays screen-reader-accessible;
          a real visitor should never be able to find or fill this in). Bots
          that blindly fill every input on the page will populate it. */}
      <div
        style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} name="name" required />
        <Field label={t("businessName")} name="business" required />
      </div>
      <Field label={t("email")} name="email" type="email" required />
      <div>
        <label
          htmlFor="pain"
          className="mb-2 block font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-muted)]"
        >
          {t("painQuestion").toUpperCase()}
        </label>
        <textarea
          id="pain"
          name="pain"
          rows={4}
          required
          className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]"
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-[var(--color-ink-muted)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 shrink-0 border-[var(--color-border)] accent-[var(--color-accent)]"
        />
        <span>
          {t.rich("consent", {
            privacyLink: (chunks) => (
              <Link
                href="/privacy-policy"
                className="text-[var(--color-accent)] hover:underline"
                target="_blank"
              >
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-500">{t("errorBody")}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading || !consent}
        className="mt-2 w-fit"
      >
        {loading ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-muted)]"
      >
        {label.toUpperCase()}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]"
      />
    </div>
  );
}
