"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // NOTE: no backend wired yet. Replace this with a real submit handler
    // (an API route that emails/stores the lead, or a form service like
    // Formspree/Resend) before this goes live — right now it only
    // simulates success client-side.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    setSubmitted(true);
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
      <Button type="submit" size="lg" disabled={loading} className="mt-2 w-fit">
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
