import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

// useCookieConsent creates its useScriptTriggerConsent() gate once at module
// scope (mirrors @nuxt/scripts' own documented pattern), so both mocks must
// be in place before the module under test is first imported. vi.hoisted's
// factory runs before any import, so it can only hold vi.fn() spies — real
// Vue refs are built below, after imports, and captured by the mock
// factories' closures instead.
const { acceptSpy, revokeSpy } = vi.hoisted(() => ({
  acceptSpy: vi.fn(),
  revokeSpy: vi.fn(),
}));

const consentedRef = ref(false);
const cookieRef = ref<"granted" | "denied" | null>(null);

mockNuxtImport("useScriptTriggerConsent", () => () => ({
  consented: consentedRef,
  accept: () => {
    consentedRef.value = true;
    acceptSpy();
  },
  revoke: () => {
    consentedRef.value = false;
    revokeSpy();
  },
}));

mockNuxtImport("useCookie", () => () => cookieRef);

const { useCookieConsent } = await import("../useCookieConsent");

describe("useCookieConsent", () => {
  beforeEach(() => {
    cookieRef.value = null;
    consentedRef.value = false;
    acceptSpy.mockClear();
    revokeSpy.mockClear();
  });

  it("reports status='unset' when no cookie has been stored", () => {
    const { status } = useCookieConsent();
    expect(status.value).toBe("unset");
  });

  it("reports status='granted' when the cookie already says granted", () => {
    cookieRef.value = "granted";
    const { status } = useCookieConsent();
    expect(status.value).toBe("granted");
  });

  it("reports status='denied' when the cookie already says denied", () => {
    cookieRef.value = "denied";
    const { status } = useCookieConsent();
    expect(status.value).toBe("denied");
  });

  it("restores a prior granted decision into the trigger on init", () => {
    cookieRef.value = "granted";
    useCookieConsent();
    expect(acceptSpy).toHaveBeenCalled();
  });

  it("acceptAll() stores 'granted' and accepts the trigger", () => {
    const { acceptAll, status } = useCookieConsent();
    acceptAll();
    expect(cookieRef.value).toBe("granted");
    expect(status.value).toBe("granted");
    expect(acceptSpy).toHaveBeenCalled();
  });

  it("rejectAll() stores 'denied' and revokes the trigger", () => {
    const { rejectAll, status } = useCookieConsent();
    rejectAll();
    expect(cookieRef.value).toBe("denied");
    expect(status.value).toBe("denied");
    expect(revokeSpy).toHaveBeenCalled();
  });

  it("exposes the raw trigger for useGoogleAnalytics to consume", () => {
    const { trigger } = useCookieConsent();
    expect(trigger).toBeTruthy();
    expect(typeof trigger.accept).toBe("function");
  });
});
