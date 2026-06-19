import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AlertContent from "../AlertContent.vue";

describe("AlertContent", () => {
  // ─── Mount ────────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" } });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders the root element with class alert-content", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" } });
    expect(wrapper.find(".alert-content").exists()).toBe(true);
  });

  // ─── Icon ─────────────────────────────────────────────────────────────────

  it("renders the icon region", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" } });
    expect(wrapper.find("[data-test-id='alert-icon']").exists()).toBe(true);
  });

  it("replaces the icon via the #icon slot", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info" },
      slots: { icon: '<span class="custom-icon">★</span>' },
    });
    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });

  // ─── Title slot ───────────────────────────────────────────────────────────

  it("renders the title element when the #title slot is provided", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info" },
      slots: { title: "Important notice" },
    });
    expect(wrapper.find("[data-test-id='alert-title']").exists()).toBe(true);
    expect(wrapper.find("[data-test-id='alert-title']").text()).toContain("Important notice");
  });

  it("does not render the title element when the #title slot is not provided", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" } });
    expect(wrapper.find("[data-test-id='alert-title']").exists()).toBe(false);
  });

  // ─── Content slot ─────────────────────────────────────────────────────────

  it("renders the content element when the #content slot is provided", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info" },
      slots: { content: "More detail here." },
    });
    expect(wrapper.find("[data-test-id='alert-content']").exists()).toBe(true);
    expect(wrapper.find("[data-test-id='alert-content']").text()).toContain("More detail here.");
  });

  it("does not render the content element when the #content slot is not provided", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" } });
    expect(wrapper.find("[data-test-id='alert-content']").exists()).toBe(false);
  });

  // ─── contentId ────────────────────────────────────────────────────────────

  it("sets id on the body element when contentId is provided", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", contentId: "toast-message-abc" },
    });
    expect(wrapper.find(".alert-content-body").attributes("id")).toBe("toast-message-abc");
  });

  it("omits id on the body element when contentId is not provided", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" } });
    expect(wrapper.find(".alert-content-body").attributes("id")).toBeUndefined();
  });

  // ─── ariaLive ─────────────────────────────────────────────────────────────

  it("sets aria-live on the body element when ariaLive is provided", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", ariaLive: "polite" },
    });
    expect(wrapper.find(".alert-content-body").attributes("aria-live")).toBe("polite");
  });

  it("omits aria-live when ariaLive is not provided", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" } });
    expect(wrapper.find(".alert-content-body").attributes("aria-live")).toBeUndefined();
  });

  // ─── Dismiss button ───────────────────────────────────────────────────────

  it("does not render the dismiss button when dismissible is false", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info", dismissible: false } });
    expect(wrapper.find("[data-test-id='alert-dismiss']").exists()).toBe(false);
  });

  it("renders the dismiss button when dismissible is true", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info", dismissible: true } });
    expect(wrapper.find("[data-test-id='alert-dismiss']").exists()).toBe(true);
  });

  it("emits the dismiss event when the dismiss button is clicked", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info", dismissible: true } });
    await wrapper.find("[data-test-id='alert-dismiss']").trigger("click");
    expect(wrapper.emitted("dismiss")).toBeTruthy();
  });

  it("replaces the dismiss icon via the #dismissIcon slot", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", dismissible: true },
      slots: { dismissIcon: '<span class="custom-close">×</span>' },
    });
    expect(wrapper.find(".custom-close").exists()).toBe(true);
  });

  it("replaces the dismiss sr-only label via the #dismissLabel slot", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", dismissible: true },
      slots: { dismissLabel: "Close this prompt" },
    });
    expect(wrapper.find(".sr-only").text()).toBe("Close this prompt");
  });

  it("uses 'Close' as the default dismiss label", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", dismissible: true },
    });
    expect(wrapper.find(".sr-only").text()).toBe("Close");
  });
});
