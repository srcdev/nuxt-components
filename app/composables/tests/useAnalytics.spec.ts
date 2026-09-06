import { describe, it, expect, beforeEach, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

// useAnalytics's page-view tracking is registered once via a module-scope flag (see
// useAnalytics.ts) — vi.resetModules() + a fresh dynamic import per test gives each test its
// own clean flag state, matching a real fresh page load. useRouter() itself is NOT mocked —
// Nuxt's own test-app bootstrap (and other internal plugins) depend on a real router instance,
// so router.afterEach is spied on directly on the real router per test instead.
const { updateSpy, gtagSpy, useScriptGoogleAnalyticsMock, useRuntimeConfigMock } = vi.hoisted(() => ({
  updateSpy: vi.fn(),
  gtagSpy: vi.fn(),
  useScriptGoogleAnalyticsMock: vi.fn(() => ({
    proxy: { gtag: gtagSpy },
    consent: { update: updateSpy, default: vi.fn() },
  })),
  useRuntimeConfigMock: vi.fn(() => ({
    public: { analytics: { provider: "google-analytics", googleAnalytics: { id: "" } } },
    app: { baseURL: "/" },
  })),
}));

const statusRef = ref<"unset" | "granted" | "denied">("unset");
const trigger = { consented: ref(false), accept: vi.fn(), revoke: vi.fn() };

const defaultRuntimeConfig = () => ({
  public: { analytics: { provider: "google-analytics" as const, googleAnalytics: { id: "" } } },
  app: { baseURL: "/" },
});

mockNuxtImport("useRuntimeConfig", () => useRuntimeConfigMock);
mockNuxtImport("useScriptGoogleAnalytics", () => useScriptGoogleAnalyticsMock);
mockNuxtImport("useCookieConsent", () => () => ({ status: statusRef, trigger }));

async function importFresh() {
  vi.resetModules();
  return (await import("../useAnalytics")).useAnalytics;
}

function configuredWith(id: string) {
  useRuntimeConfigMock.mockReturnValue({
    public: { analytics: { provider: "google-analytics" as const, googleAnalytics: { id } } },
    app: { baseURL: "/" },
  });
}

describe("useAnalytics", () => {
  beforeEach(() => {
    statusRef.value = "unset";
    trigger.accept.mockClear();
    trigger.revoke.mockClear();
    updateSpy.mockClear();
    gtagSpy.mockClear();
    useScriptGoogleAnalyticsMock.mockClear();
    useRuntimeConfigMock.mockReturnValue(defaultRuntimeConfig());
  });

  it("warns and does nothing when googleAnalytics.id is unconfigured", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const useAnalytics = await importFresh();
    useAnalytics();
    expect(warnSpy).toHaveBeenCalledWith("[useAnalytics] public.analytics.googleAnalytics.id is not configured");
    expect(useScriptGoogleAnalyticsMock).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("does nothing when provider is not 'google-analytics'", async () => {
    useRuntimeConfigMock.mockReturnValue({
      public: { analytics: { provider: "other-provider", googleAnalytics: { id: "G-TEST123" } } },
      app: { baseURL: "/" },
    });
    const useAnalytics = await importFresh();
    const { trackEvent } = useAnalytics();
    trackEvent("test_event");
    expect(useScriptGoogleAnalyticsMock).not.toHaveBeenCalled();
    expect(gtagSpy).not.toHaveBeenCalled();
  });

  it("calls useScriptGoogleAnalytics with the configured id and defaultConsent denied", async () => {
    configuredWith("G-TEST123");
    const useAnalytics = await importFresh();
    useAnalytics();
    expect(useScriptGoogleAnalyticsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "G-TEST123",
        defaultConsent: {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
        },
      })
    );
  });

  it("does not call consent.update() while status is 'unset'", async () => {
    configuredWith("G-TEST123");
    const useAnalytics = await importFresh();
    useAnalytics();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls consent.update() with all signals granted once status becomes 'granted'", async () => {
    configuredWith("G-TEST123");
    const useAnalytics = await importFresh();
    useAnalytics();
    statusRef.value = "granted";
    await nextTick();
    expect(updateSpy).toHaveBeenCalledWith({
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  });

  it("trackEvent() does nothing while status is not 'granted'", async () => {
    configuredWith("G-TEST123");
    const useAnalytics = await importFresh();
    const { trackEvent } = useAnalytics();
    trackEvent("select_plan", { plan_tier: "basic" });
    expect(gtagSpy).not.toHaveBeenCalledWith("event", "select_plan", expect.anything());
  });

  it("trackEvent() calls proxy.gtag('event', name, params) once status is 'granted'", async () => {
    configuredWith("G-TEST123");
    const useAnalytics = await importFresh();
    const { trackEvent } = useAnalytics();
    statusRef.value = "granted";
    await nextTick();
    trackEvent("select_plan", { plan_tier: "basic" });
    expect(gtagSpy).toHaveBeenCalledWith("event", "select_plan", { plan_tier: "basic" });
  });

  it("registers a single router.afterEach listener no matter how many times useAnalytics() is called", async () => {
    configuredWith("G-TEST123");
    const router = useRouter();
    const afterEachSpy = vi.spyOn(router, "afterEach");
    const useAnalytics = await importFresh();
    useAnalytics();
    useAnalytics(); // e.g. called again from a second component
    expect(afterEachSpy).toHaveBeenCalledTimes(1);
    afterEachSpy.mockRestore();
  });

  it("skips the first navigation (already covered by gtag('config')'s own page_view) and fires page_view on subsequent navigations once granted", async () => {
    configuredWith("G-TEST123");
    const router = useRouter();
    const afterEachSpy = vi.spyOn(router, "afterEach");
    const useAnalytics = await importFresh();
    useAnalytics();
    statusRef.value = "granted";
    await nextTick();

    const afterEachCallback = afterEachSpy.mock.calls[0]![0] as (to: { fullPath: string }) => void;
    afterEachCallback({ fullPath: "/first" });
    expect(gtagSpy).not.toHaveBeenCalledWith("event", "page_view", expect.anything());

    afterEachCallback({ fullPath: "/second" });
    expect(gtagSpy).toHaveBeenCalledWith("event", "page_view", { page_path: "/second", page_title: document.title });
    afterEachSpy.mockRestore();
  });

  it("does not fire page_view on navigation while consent is not granted", async () => {
    configuredWith("G-TEST123");
    const router = useRouter();
    const afterEachSpy = vi.spyOn(router, "afterEach");
    const useAnalytics = await importFresh();
    useAnalytics();

    const afterEachCallback = afterEachSpy.mock.calls[0]![0] as (to: { fullPath: string }) => void;
    afterEachCallback({ fullPath: "/first" }); // consumed as the "initial" navigation
    afterEachCallback({ fullPath: "/second" });
    expect(gtagSpy).not.toHaveBeenCalledWith("event", "page_view", expect.anything());
    afterEachSpy.mockRestore();
  });
});
