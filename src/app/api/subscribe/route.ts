import { NextResponse } from "next/server";

// Footer newsletter endpoint.
//
// To actually store signups, set SUBSCRIBE_WEBHOOK_URL in your environment to a
// webhook that adds the email to your list. Easiest options:
//   • Klaviyo (recommended for Shopify): create a Flow/endpoint, or use Zapier /
//     Make with a "Webhooks" trigger -> "Klaviyo: Subscribe Profile".
//   • Mailchimp / Shopify customer list: same idea via Zapier / Make / Shopify Flow.
// The email is POSTed as JSON: { email, source, ts }.
//
// With no webhook configured, the form still works for visitors (returns
// success) but nothing is stored — a server log notes each address so nothing
// is silently lost during setup.
export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? "").trim();
  } catch {
    // fall through to validation
  }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 }
    );
  }

  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "footer",
          ts: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Could not subscribe right now. Please try again." },
        { status: 502 }
      );
    }
  } else {
    console.warn(
      "[subscribe] No SUBSCRIBE_WEBHOOK_URL configured — email not stored:",
      email
    );
  }

  return NextResponse.json({ ok: true });
}
