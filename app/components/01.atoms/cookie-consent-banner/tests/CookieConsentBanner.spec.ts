import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import CookieConsentBanner from "../CookieConsentBanner.vue";

const { useAppConfigMock } = vi.hoisted(() => ({
  useAppConfigMock: vi.fn(() => ({ srcdev: undefined as Record<string, unknown> | undefined, icon: {} as object })),
}));

const statusRef = ref<"unset" | "granted" | "denied">("unset");
const acceptAllSpy = vi.fn(() => {
  statusRef.value = "granted";
});
const rejectAllSpy = vi.fn(() => {
  statusRef.value = "denied";
});

mockNuxtImport("useAppConfig", () => useAppConfigMock);
mockNuxtImport("useCookieConsent", () => () => ({
  status: statusRef,
  acceptAll: acceptAllSpy,
  rejectAll: rejectAllSpy,
}));

function banner() {
  return document.querySelector(".privacy-notice-banner");
}

function acceptButton() {
  return document.querySelector("[data-test-id='privacy-notice-banner-accept']") as HTMLElement;
}

function rejectButton() {
  return document.querySelector("[data-test-id='privacy-notice-banner-reject']") as HTMLElement;
}

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    statusRef.value = "unset";
    acceptAllSpy.mockClear();
    rejectAllSpy.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("mounts without error", async () => {
    const w = await mountSuspended(CookieConsentBanner);
    expect(w.vm).toBeTruthy();
  });

  it("renders the banner, teleported to body", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(banner()).not.toBeNull();
  });

  it("is visible (no closed class) while status is 'unset'", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(banner()!.classList).not.toContain("closed");
  });

  it("adds the closed class once status is no longer 'unset'", async () => {
    statusRef.value = "granted";
    await mountSuspended(CookieConsentBanner);
    expect(banner()!.classList).toContain("closed");
  });

  it("defaults to data-theme='info'", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(banner()!.getAttribute("data-theme")).toBe("info");
  });

  it("uses app.config theme when no prop is supplied", async () => {
    useAppConfigMock.mockReturnValue({ icon: {}, srcdev: { cookieConsentBanner: { theme: "success" } } });
    await mountSuspended(CookieConsentBanner);
    expect(banner()!.getAttribute("data-theme")).toBe("success");
  });

  it("explicit theme prop takes precedence over app.config", async () => {
    useAppConfigMock.mockReturnValue({ icon: {}, srcdev: { cookieConsentBanner: { theme: "warning" } } });
    await mountSuspended(CookieConsentBanner, { props: { theme: "error" } });
    expect(banner()!.getAttribute("data-theme")).toBe("error");
  });

  it("renders default message copy", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(banner()!.textContent).toContain("cookies");
  });

  it("renders message slot content", async () => {
    await mountSuspended(CookieConsentBanner, { slots: { message: "Custom cookie copy" } });
    expect(banner()!.textContent).toContain("Custom cookie copy");
  });

  it("renders acceptLabel/rejectLabel slot content", async () => {
    await mountSuspended(CookieConsentBanner, { slots: { acceptLabel: "Yes please", rejectLabel: "No thanks" } });
    expect(acceptButton().textContent).toContain("Yes please");
    expect(rejectButton().textContent).toContain("No thanks");
  });

  it("calls acceptAll() when the accept button is clicked", async () => {
    await mountSuspended(CookieConsentBanner);
    acceptButton().click();
    expect(acceptAllSpy).toHaveBeenCalledOnce();
  });

  it("calls rejectAll() when the reject button is clicked", async () => {
    await mountSuspended(CookieConsentBanner);
    rejectButton().click();
    expect(rejectAllSpy).toHaveBeenCalledOnce();
  });

  it("applies a styleClassPassthrough class to the root", async () => {
    await mountSuspended(CookieConsentBanner, { props: { styleClassPassthrough: "outlined" } });
    expect(banner()!.classList).toContain("outlined");
  });
});
