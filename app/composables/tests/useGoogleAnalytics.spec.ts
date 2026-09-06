import { describe, it, expect, beforeEach, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { useRuntimeConfigMock, updateSpy, useScriptGoogleAnalyticsMock } = vi.hoisted(() => ({
  useRuntimeConfigMock: vi.fn(() => ({ public: { googleAnalytics: { id: "" } }, app: { baseURL: "/" } })),
  updateSpy: vi.fn(),
  useScriptGoogleAnalyticsMock: vi.fn(() => ({ consent: { update: updateSpy, default: vi.fn() } })),
}));

const statusRef = ref<"unset" | "granted" | "denied">("unset");
const trigger = { consented: ref(false), accept: vi.fn(), revoke: vi.fn() };

mockNuxtImport("useRuntimeConfig", () => useRuntimeConfigMock);
mockNuxtImport("useScriptGoogleAnalytics", () => useScriptGoogleAnalyticsMock);
mockNuxtImport("useCookieConsent", () => () => ({ status: statusRef, trigger }));

const { useGoogleAnalytics } = await import("../useGoogleAnalytics");

describe("useGoogleAnalytics", () => {
  beforeEach(() => {
    statusRef.value = "unset";
    updateSpy.mockClear();
    useScriptGoogleAnalyticsMock.mockClear();
    useRuntimeConfigMock.mockReturnValue({ public: { googleAnalytics: { id: "" } }, app: { baseURL: "/" } });
  });

  it("warns and does nothing when googleAnalytics.id is unconfigured", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    useGoogleAnalytics();
    expect(warnSpy).toHaveBeenCalledWith("[useGoogleAnalytics] public.googleAnalytics.id is not configured");
    expect(useScriptGoogleAnalyticsMock).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("calls useScriptGoogleAnalytics with the configured id and defaultConsent denied", () => {
    useRuntimeConfigMock.mockReturnValue({ public: { googleAnalytics: { id: "G-TEST123" } }, app: { baseURL: "/" } });
    useGoogleAnalytics();
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

  it("does not call consent.update() while status is 'unset'", () => {
    useRuntimeConfigMock.mockReturnValue({ public: { googleAnalytics: { id: "G-TEST123" } }, app: { baseURL: "/" } });
    useGoogleAnalytics();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls consent.update() with all signals granted once status becomes 'granted'", async () => {
    useRuntimeConfigMock.mockReturnValue({ public: { googleAnalytics: { id: "G-TEST123" } }, app: { baseURL: "/" } });
    useGoogleAnalytics();
    statusRef.value = "granted";
    await nextTick();
    expect(updateSpy).toHaveBeenCalledWith({
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  });

  it("calls consent.update() with all signals denied when status becomes 'denied'", async () => {
    useRuntimeConfigMock.mockReturnValue({ public: { googleAnalytics: { id: "G-TEST123" } }, app: { baseURL: "/" } });
    useGoogleAnalytics();
    statusRef.value = "denied";
    await nextTick();
    expect(updateSpy).toHaveBeenCalledWith({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  });

  it("immediately reports consent.update() for a returning visitor already granted", () => {
    useRuntimeConfigMock.mockReturnValue({ public: { googleAnalytics: { id: "G-TEST123" } }, app: { baseURL: "/" } });
    statusRef.value = "granted";
    useGoogleAnalytics();
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ analytics_storage: "granted" }));
  });
});
