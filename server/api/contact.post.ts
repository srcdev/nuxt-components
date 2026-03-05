import { createError } from "h3";

// Shape of the validated form body sent from the page
interface ContactFormBody {
  fullName: string;
  telNumber: string;
  emailAddress: string;
  services: string[];
  comments?: string;
}

// Shape of Resend's error response so we can surface a useful message
interface ResendErrorResponse {
  name: string;
  message: string;
  statusCode: number;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactFormBody>(event);

  // runtimeConfig values are server-only — never exposed to the browser.
  // Set via environment variables (see .env.example).
  const { resendApiKey, contactEmailTo, contactEmailFrom } = useRuntimeConfig(event);

  if (!resendApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Email service not configured — set NUXT_RESEND_API_KEY",
    });
  }

  // Build a simple HTML email body
  const html = `
    <h2>New enquiry from ${body.fullName}</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;">
      <tr><td><strong>Name</strong></td><td>${body.fullName}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${body.telNumber}</td></tr>
      <tr><td><strong>Email</strong></td><td><a href="mailto:${body.emailAddress}">${body.emailAddress}</a></td></tr>
      <tr><td><strong>Services</strong></td><td>${body.services.join(", ")}</td></tr>
      ${body.comments ? `<tr><td><strong>Comments</strong></td><td>${body.comments}</td></tr>` : ""}
    </table>
  `;

  try {
    // Resend REST API — no extra package needed, just an authenticated POST.
    // Docs: https://resend.com/docs/api-reference/emails/send-email
    await $fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        // API key loaded from server-side runtimeConfig, never in client bundle
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        // "from" must be a verified sending domain in your Resend account.
        // During development use Resend's shared sandbox: onboarding@resend.dev
        // (only delivers to the email address registered on your Resend account)
        from: contactEmailFrom || "Enquiries <onboarding@resend.dev>",

        // The inbox this email lands in — set via NUXT_CONTACT_EMAIL_TO
        to: contactEmailTo,

        // Lets you reply directly to the enquirer from your email client
        reply_to: body.emailAddress,

        subject: `New enquiry from ${body.fullName}`,
        html,
      },
    });
  } catch (err) {
    const resendError = err as { data?: ResendErrorResponse };

    // Surface the Resend error message in development; keep it vague in production
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to send email",
      message: resendError.data?.message ?? "Unknown error from Resend",
    });
  }

  return { success: true };
});
