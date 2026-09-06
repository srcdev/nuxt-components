export type AnalyticsProvider = "google-analytics";

interface AnalyticsProviderImpl {
  trackEvent: (name: string, params?: Record<string, string | number | boolean>) => void;
}

// Registered once regardless of how many times useAnalytics() is called across the app —
// unlike trackEvent, a router listener must not be set up per call-site, or every route change
// would fire once per component that ever called useAnalytics(). Guarded to client-only so this
// module-scope flag can't get "used up" by a server render before any client code runs.
let pageViewTrackingRegistered = false;

function useGoogleAnalyticsProvider(): AnalyticsProviderImpl | null {
  const config = useRuntimeConfig();
  const id = config.public.analytics?.googleAnalytics?.id;

  if (!id) {
    console.warn("[useAnalytics] public.analytics.googleAnalytics.id is not configured");
    return null;
  }

  const { status, trigger } = useCookieConsent();

  const { proxy, consent } = useScriptGoogleAnalytics({
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
  // GA4 excludes from standard reporting — a real bug found via a live hit's gcs=G100/pscdl=denied
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

  if (import.meta.client && !pageViewTrackingRegistered) {
    pageViewTrackingRegistered = true;
    const router = useRouter();
    let hasNavigated = false;
    router.afterEach((to) => {
      if (!hasNavigated) {
        // The initial load's page_view is already sent by gtag('config', id) inside
        // useScriptGoogleAnalytics' own clientInit — only subsequent client-side
        // navigations (which don't otherwise fire page_view anywhere in this app or
        // @nuxt/scripts' GA registry) need an explicit one here.
        hasNavigated = true;
        return;
      }
      if (status.value !== "granted") return;
      proxy.gtag("event", "page_view", {
        page_path: to.fullPath,
        page_title: document.title,
      });
    });
  }

  return {
    trackEvent: (name, params) => {
      if (status.value !== "granted") return;
      proxy.gtag("event", name, params);
    },
  };
}

// Call from anywhere — the layout, for one-time setup (script load, consent wiring, page-view
// tracking), or any page/component, to fire an event. Safe/cheap to call repeatedly: the
// underlying script instance is a registry singleton keyed by measurement ID (@nuxt/scripts
// dedupes by id), so this never re-runs clientInit or duplicates the consent watcher.
export function useAnalytics() {
  const config = useRuntimeConfig();
  const provider = config.public.analytics?.provider as AnalyticsProvider | undefined;

  const impl = provider === "google-analytics" ? useGoogleAnalyticsProvider() : null;

  return {
    trackEvent: (name: string, params?: Record<string, string | number | boolean>) => {
      impl?.trackEvent(name, params);
    },
  };
}
