# useWhatsApp Composable

## Overview

`useWhatsApp` opens a pre-filled WhatsApp conversation in a new tab via the `wa.me` deep-link API. It formats an array of labelled fields into a bold-label WhatsApp message and requires a phone number configured in runtime config.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useWhatsApp.ts`). Consuming apps get it via Nuxt's layer auto-import — **do not create a local copy** in the consuming app.

## Prerequisites

- `NUXT_PUBLIC_WHATSAPP_NUMBER` env var set to the recipient number in international format, no `+` or spaces (e.g. `447700900000`).

## Setup in the consuming app

### 1. Runtime config

Add `whatsappNumber` to `runtimeConfig.public` in the consuming app's `nuxt.config.ts`. It must be in `public` — **not** the private root block — because `openWhatsApp` runs client-side and private keys are server-only.

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    whatsappNumber: "", // NUXT_PUBLIC_WHATSAPP_NUMBER
  },
},
```

Env var name follows Nuxt convention: `NUXT_PUBLIC_` prefix + SCREAMING_SNAKE of the key path. Set `NUXT_PUBLIC_WHATSAPP_NUMBER` in `.env` locally and in your hosting provider's environment variables (e.g. Vercel) for production.

### 2. No import needed

`useWhatsApp` is auto-imported by Nuxt from the layer. Use it directly in `<script setup>` or any composable without an explicit import.

## Composable reference

Source lives at `app/composables/useWhatsApp.ts` in the layer. Shown here for reference only — do not recreate it in the consuming app.

```ts
export const useWhatsApp = () => {
  const config = useRuntimeConfig(); // must be inside the function, not at module scope

  const openWhatsApp = (fields: { label: string; value: string }[]) => {
    const number = config.public.whatsappNumber;

    if (!number) {
      console.warn("[useWhatsApp] whatsappNumber is not configured");
      return;
    }

    const message = fields
      .filter((f) => f.value?.trim())
      .map((f) => `*${f.label}:* ${f.value}`)
      .join("\n");

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer"); // noopener prevents reverse tabnapping
  };

  return { openWhatsApp };
};
```

### Key rules

- **`useRuntimeConfig()` inside the function body** — never at module scope. Nuxt composables require an active context; module-scope calls run at import time, outside any context, and return empty values.
- **`noopener,noreferrer`** on `window.open` — prevents the opened WhatsApp page accessing `window.opener` (reverse tabnapping).
- **Guard for missing number** — avoids a silent `https://wa.me/?text=...` 404.

## Usage in a form

```ts
// 1. Destructure the composable
const { openWhatsApp } = useWhatsApp();

// 2. Build the payload from your form state
const buildWhatsAppPayload = () => [
  { label: "Name",     value: state.fullName },
  { label: "Phone",    value: state.telNumber },
  { label: "Email",    value: state.emailAddress },
  { label: "Services", value: state.services.join(", ") },
  { label: "Comments", value: state.comments ?? "" },
];

// 3. Call on successful form submission
const submitForm = async () => {
  zodFormControl.submitAttempted = true;
  if (!(await doZodValidate(state))) {
    scrollToFirstError();
    return;
  }
  zodFormControl.displayLoader = true;
  try {
    zodFormControl.submitSuccessful = true;
    openWhatsApp(buildWhatsAppPayload());
  } catch (error) {
    console.warn("Contact form submission failed", error);
  } finally {
    zodFormControl.displayLoader = false;
  }
};
```

## Message format

Fields with an empty/whitespace `value` are filtered out. Remaining fields render as:

```
*Name:* Jane Smith
*Phone:* 07700 900000
*Services:* Cut, Colour
```

## Notes

- `wa.me` opens the WhatsApp desktop app if installed, otherwise falls back to web.whatsapp.com.
- The phone number in `public` config is visible in the client bundle — acceptable for a public-facing WhatsApp business number.
- This is a client-side-only operation; no server route or API key is needed.
