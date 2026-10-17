import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick, ref } from "vue";
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
  return document.querySelector(".cookie-consent-banner");
}

function acceptButton() {
  return document.querySelector("[data-test-id='cookie-consent-banner-accept']") as HTMLElement;
}

function rejectButton() {
  return document.querySelector("[data-test-id='cookie-consent-banner-reject']") as HTMLElement;
}

// Vue ignores events stamped at or before its listener's attach time; fake timers freeze both.
function click(button: HTMLElement) {
  vi.advanceTimersByTime(1);
  button.click();
}

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    statusRef.value = "unset";
    acceptAllSpy.mockClear();
    rejectAllSpy.mockClear();
    useAppConfigMock.mockReturnValue({ srcdev: undefined, icon: {} });
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

  it("is visible (no closed state class) while status is 'unset'", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(banner()!.classList).not.toContain("cookie-consent-banner-closed");
  });

  it("adds the cookie-consent-banner-closed class once status is no longer 'unset'", async () => {
    statusRef.value = "granted";
    await mountSuspended(CookieConsentBanner);
    expect(banner()!.classList).toContain("cookie-consent-banner-closed");
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

  it("renders default button labels", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(acceptButton().textContent).toContain("Accept");
    expect(rejectButton().textContent).toContain("Reject");
  });

  it("renders acceptLabel/rejectLabel props", async () => {
    await mountSuspended(CookieConsentBanner, { props: { acceptLabel: "Yes please", rejectLabel: "No thanks" } });
    expect(acceptButton().textContent).toContain("Yes please");
    expect(rejectButton().textContent).toContain("No thanks");
  });

  it("renders both buttons as inline InputButtons", async () => {
    await mountSuspended(CookieConsentBanner);
    for (const button of [acceptButton(), rejectButton()]) {
      expect(button.tagName).toBe("BUTTON");
      expect(button.getAttribute("type")).toBe("button");
      expect(button.classList).toContain("input-button");
      expect(button.dataset.variant).toBe("inline");
    }
  });

  it("calls acceptAll() when the accept button is clicked", async () => {
    await mountSuspended(CookieConsentBanner);
    click(acceptButton());
    expect(acceptAllSpy).toHaveBeenCalledOnce();
  });

  it("calls rejectAll() when the reject button is clicked", async () => {
    await mountSuspended(CookieConsentBanner);
    click(rejectButton());
    expect(rejectAllSpy).toHaveBeenCalledOnce();
  });

  it("applies a styleClassPassthrough class to the root", async () => {
    await mountSuspended(CookieConsentBanner, { props: { styleClassPassthrough: "outlined" } });
    expect(banner()!.classList).toContain("outlined");
  });

  it("names the region with the default aria-label", async () => {
    await mountSuspended(CookieConsentBanner);
    const region = document.querySelector(".cookie-consent-banner-inner")!;
    expect(region.getAttribute("role")).toBe("region");
    expect(region.getAttribute("aria-label")).toBe("Cookie consent");
  });

  it("applies a custom ariaLabel", async () => {
    await mountSuspended(CookieConsentBanner, { props: { ariaLabel: "Consentement aux cookies" } });
    expect(document.querySelector(".cookie-consent-banner-inner")!.getAttribute("aria-label")).toBe(
      "Consentement aux cookies"
    );
  });

  it("closes after a choice is made", async () => {
    await mountSuspended(CookieConsentBanner);
    click(rejectButton());
    await nextTick();
    expect(banner()!.classList).toContain("cookie-consent-banner-closed");
  });

  it("reopens if consent is reset to 'unset'", async () => {
    statusRef.value = "denied";
    await mountSuspended(CookieConsentBanner);
    statusRef.value = "unset";
    await nextTick();
    expect(banner()!.classList).not.toContain("cookie-consent-banner-closed");
  });

  it("updates classes when styleClassPassthrough changes", async () => {
    const w = await mountSuspended(CookieConsentBanner, { props: { styleClassPassthrough: ["one"] } });
    await w.setProps({ styleClassPassthrough: ["two"] });
    expect(banner()!.classList).toContain("two");
    expect(banner()!.classList).not.toContain("one");
  });

  // ─── Built on AlertContent (2026-09-27) ───────────────────────────────────

  it("renders inside AlertContent with the resolved theme", async () => {
    await mountSuspended(CookieConsentBanner, { props: { theme: "success" } });
    const alert = document.querySelector(".cookie-consent-banner-inner .alert-content");
    expect(alert).not.toBeNull();
    expect(alert!.getAttribute("data-theme")).toBe("success");
  });

  it("renders the default 'Cookies' title and the message in the alert body", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(document.querySelector("[data-test-id='alert-title']")!.textContent).toContain("Cookies");
    expect(document.querySelector("[data-test-id='alert-content']")!.textContent).toContain("cookies");
  });

  it("replaces the title via the #title slot", async () => {
    await mountSuspended(CookieConsentBanner, { slots: { title: "Your privacy" } });
    expect(document.querySelector("[data-test-id='alert-title']")!.textContent).toContain("Your privacy");
  });

  it("puts both buttons in the alert's actions row", async () => {
    await mountSuspended(CookieConsentBanner);
    const actions = document.querySelector("[data-test-id='alert-actions']")!;
    expect(actions.contains(acceptButton())).toBe(true);
    expect(actions.contains(rejectButton())).toBe(true);
  });

  it("shows the icon by default and hides it with showIcon=false", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(document.querySelector("[data-test-id='alert-icon']")).not.toBeNull();
    document.body.innerHTML = "";
    await mountSuspended(CookieConsentBanner, { props: { showIcon: false } });
    expect(document.querySelector("[data-test-id='alert-icon']")).toBeNull();
  });

  it("does not make the message an aria-live region", async () => {
    await mountSuspended(CookieConsentBanner);
    expect(document.querySelector(".alert-content-body")!.hasAttribute("aria-live")).toBe(false);
  });
});
