// Call once from the consuming app's layout/app.vue. Loading is gated behind
// useCookieConsent() — the gtag.js script only actually fetches once the
// visitor accepts, and Google Consent Mode v2's default state starts denied
// so no analytics cookie is set before that.
export const useGoogleAnalytics = () => {
  const config = useRuntimeConfig();
  const id = config.public.googleAnalytics?.id;

  if (!id) {
    console.warn("[useGoogleAnalytics] public.googleAnalytics.id is not configured");
    return;
  }

  const { status, trigger } = useCookieConsent();

  const { consent } = useScriptGoogleAnalytics({
    id,
    scriptOptions: { trigger },
    defaultConsent: {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    },
  });

  // `trigger` above only gates whether gtag.js *loads* — it does not itself flip the Consent
  // Mode v2 signals gtag.js reports alongside every hit. Without this, hits fire successfully
  // (visible in Network) but stay tagged with defaultConsent's "denied" state forever, which
  // GA4 excludes from standard reporting — confirmed via a real hit's gcs=G100/pscdl=denied
  // query params still showing after accepting, 2026-09-06. `consent.update()` is the separate
  // API that actually reports the visitor's decision back to gtag.js; `immediate: true` also
  // covers a returning visitor whose cookie already says "granted" on this page load.
  watch(
    status,
    (value) => {
      if (value === "unset" || !consent) return;
      const granted = value === "granted";
      consent.update({
        ad_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
      });
    },
    { immediate: true }
  );
};
