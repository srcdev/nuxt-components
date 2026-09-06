import type { CookieConsentStatus } from "~/types/components";

// Singleton, same pattern @nuxt/scripts itself documents for
// useScriptTriggerConsent (a single shared gate for the app's lifetime, not a
// fresh instance per call-site). This is what useAnalytics()'s
// `trigger` option is wired to.
//
// Built lazily on first call rather than at module scope — module-scope
// evaluation runs the instant this file is imported, which can happen before
// Nuxt's app/@nuxt/scripts context is ready in some environments (observed in
// Storybook), silently breaking the composable.
let consentTrigger: ReturnType<typeof useScriptTriggerConsent> | undefined;

export function useCookieConsent() {
  consentTrigger ??= useScriptTriggerConsent();
  const trigger = consentTrigger;

  // Persists the decision across visits. Read fresh on every call so this
  // stays request-safe during SSR (Nuxt dedupes useCookie() by key within a
  // request, so this is cheap to call repeatedly).
  const stored = useCookie<"granted" | "denied" | null>("privacy-notice-consent", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    default: () => null,
  });

  // Restore a prior "granted" decision into the trigger (e.g. after a full
  // page reload, where the in-memory trigger resets but the cookie doesn't).
  if (stored.value === "granted" && !trigger.consented.value) {
    trigger.accept();
  }

  const status = computed<CookieConsentStatus>(() => stored.value ?? "unset");

  const acceptAll = () => {
    stored.value = "granted";
    trigger.accept();
  };

  const rejectAll = () => {
    stored.value = "denied";
    trigger.revoke();
  };

  return {
    status,
    acceptAll,
    rejectAll,
    // Internal API: pass straight into useScriptGoogleAnalytics's
    // scriptOptions.trigger (see useAnalytics()). Not for consuming
    // app code to read/mutate directly — use status/acceptAll/rejectAll.
    trigger,
  };
}
