import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Real users take at least this long to fill out the form — anything
// faster is almost certainly a bot that skipped rendering entirely.
const MIN_SUBMIT_MS = 1500;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const business = typeof body.business === "string" ? body.business.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const pain = typeof body.pain === "string" ? body.pain.trim() : "";
  const consent = body.consent === true;
  // Honeypot — a field real users never see or fill; bots that blindly
  // fill every input in the form will populate it.
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const renderedAt = typeof body.renderedAt === "number" ? body.renderedAt : 0;

  if (website) {
    // Silently pretend success so the bot doesn't learn to skip this field.
    return NextResponse.json({ ok: true });
  }

  if (!renderedAt || Date.now() - renderedAt < MIN_SUBMIT_MS) {
    return NextResponse.json({ error: "too_fast" }, { status: 400 });
  }

  if (!name || !business || !email || !pain) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  // Consent to the privacy policy is required before we process (i.e. even
  // email) anything the visitor submitted — see /privacy-policy. This is
  // enforced server-side too, not just as a disabled button client-side.
  if (!consent) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error(
      "Contact form: missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL env vars",
    );
    return NextResponse.json({ error: "server_not_configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New lead: ${business} (${name})`,
      text: [
        `Name: ${name}`,
        `Business: ${business}`,
        `Email: ${email}`,
        "",
        "Pain point:",
        pain,
      ].join("\n"),
    });
    if (error) {
      console.error("Contact form: Resend returned an error", error);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact form: Resend send threw", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
