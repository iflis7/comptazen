"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

// Submissions go to a Zoho Catalyst serverless function, which creates a
// Lead in Zoho CRM through a Catalyst Connection — see
// zoho-catalyst/functions/contact_lead/index.js for the backend. Set this
// to the real deployed function URL (shown in the Catalyst console once
// you deploy) via NEXT_PUBLIC_CONTACT_FUNCTION_URL — configure it in
// Vercel's project env vars, same place RESEND_API_KEY used to live.
const CONTACT_FUNCTION_URL = process.env.NEXT_PUBLIC_CONTACT_FUNCTION_URL ?? "";

// Real users take at least this long to fill out the form — anything
// faster is almost certainly a bot that skipped rendering entirely.
const MIN_SUBMIT_MS = 1500;

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [consent, setConsent] = useState(false);
  // Captured once, on mount — used as a bot-timing trap: a submission
  // faster than a human could plausibly fill the form is rejected. Set
  // in an effect rather than as the useRef initializer, since Date.now()
  // is impure and must not run during render.
  const renderedAtRef = useRef(0);
  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const business = String(formData.get("business") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const pain = String(formData.get("pain") ?? "").trim();
    // Honeypot — left blank by real visitors, since it's hidden from view.
    const website = String(formData.get("website") ?? "").trim();

    if (website) {
      // Pretend success so the bot doesn't learn to skip this field —
      // nothing is actually sent anywhere.
      setSubmitted(true);
      return;
    }

    if (!renderedAtRef.current || Date.now() - renderedAtRef.current < MIN_SUBMIT_MS) {
      setError(true);
      return;
    }

    if (!name || !business || !email || !pain || !consent) {
      setError(true);
      return;
    }

    if (!CONTACT_FUNCTION_URL) {
      // Not configured in this environment yet (missing
      // NEXT_PUBLIC_CONTACT_FUNCTION_URL) — fail loudly instead of
      // pretending to send something nowhere.
      console.error("Contact form: NEXT_PUBLIC_CONTACT_FUNCTION_URL is not set");
      setError(true);
      return;
    }

    setSending(true);

    try {
      const res = await fetch(CONTACT_FUNCTION_URL, {
        method: "POST",
        // Deliberately text/plain, not application/json: Catalyst's API
        // Gateway doesn't forward the browser's CORS preflight (OPTIONS)
        // through to the Advanced I/O function correctly, so
        // application/json (which forces a preflight) never gets past
        // it. text/plain is a CORS-safelisted content type, so the
        // browser skips the preflight and sends this POST directly — the
        // body is still JSON underneath, the function parses it as such
        // (see contact_lead/index.js).
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name,
          business,
          email,
          pain,
          website,
          renderedAt: renderedAtRef.current,
          consent,
          // Maps to a custom CRM field via EXTRA_LEAD_FIELDS in
          // contact_lead/index.js — add more keys the same way for future
          // fields (create the CRM field, add one mapping line in the
          // function, send it from here).
          source: "ComptaZen Website — Contact Form",
        }),
      });
      if (!res.ok) throw new Error("submit_failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent)]"
        >
          <Check className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={2.5} />
        </motion.div>
        <p className="font-display text-xl font-medium text-[var(--color-ink)]">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-[var(--color-ink-muted)]">
          {t("successBody")}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setConsent(false);
          }}
          className="mt-6 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-muted)] underline decoration-[var(--color-border)] underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
        >
          {t("sendAnother").toUpperCase()}
        </button>
      </motion.div>
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
        disabled={sending || !consent}
        className="mt-2 w-fit"
      >
        {sending ? t("sending") : t("submit")}
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
