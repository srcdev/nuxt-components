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

  const { trigger } = useCookieConsent();

  useScriptGoogleAnalytics({
    id,
    scriptOptions: { trigger },
    defaultConsent: {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    },
  });
};
