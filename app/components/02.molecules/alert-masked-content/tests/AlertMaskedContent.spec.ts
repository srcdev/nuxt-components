import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AlertMaskedContent from "../AlertMaskedContent.vue";

const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", mockResizeObserver);

describe("AlertMaskedContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Mount ────────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders the root element with class alert-masked-content", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    expect(wrapper.find(".alert-masked-content").exists()).toBe(true);
  });

  it("sets data-theme on the root element", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "success" } });
    expect(wrapper.find(".alert-masked-content").attributes("data-theme")).toBe("success");
  });

  // ─── AlertMaskCore ────────────────────────────────────────────────────────

  it("renders AlertMaskCore", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    expect(wrapper.find(".alert-mask-core").exists()).toBe(true);
  });

  it("renders AlertContentInner inside AlertMaskCore", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    expect(wrapper.find(".alert-mask-core .alert-content-inner").exists()).toBe(true);
  });

  // ─── Icon ─────────────────────────────────────────────────────────────────

  it("renders the icon region", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    expect(wrapper.find("[data-test-id='alert-icon']").exists()).toBe(true);
  });

  it("replaces the icon via the #icon slot", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, {
      props: { theme: "info" },
      slots: { icon: '<span class="custom-icon">★</span>' },
    });
    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });

  // ─── Title slot ───────────────────────────────────────────────────────────

  it("renders the title element when the #title slot is provided", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, {
      props: { theme: "info" },
      slots: { title: "Important notice" },
    });
    expect(wrapper.find("[data-test-id='alert-title']").text()).toContain("Important notice");
  });

  it("does not render the title element when the #title slot is not provided", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    expect(wrapper.find("[data-test-id='alert-title']").exists()).toBe(false);
  });

  // ─── Content slot ─────────────────────────────────────────────────────────

  it("renders the content element when the #content slot is provided", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, {
      props: { theme: "info" },
      slots: { content: "More detail here." },
    });
    expect(wrapper.find("[data-test-id='alert-content']").text()).toContain("More detail here.");
  });

  it("does not render the content element when the #content slot is not provided", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    expect(wrapper.find("[data-test-id='alert-content']").exists()).toBe(false);
  });

  // ─── contentId / ariaLive ─────────────────────────────────────────────────

  it("sets id on the body element when contentId is provided", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, {
      props: { theme: "info", contentId: "toast-message-xyz" },
    });
    expect(wrapper.find(".alert-content-body").attributes("id")).toBe("toast-message-xyz");
  });

  it("sets aria-live on the body element when ariaLive is provided", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, {
      props: { theme: "info", ariaLive: "assertive" },
    });
    expect(wrapper.find(".alert-content-body").attributes("aria-live")).toBe("assertive");
  });

  // ─── Dismiss button ───────────────────────────────────────────────────────

  it("does not render the dismiss button when dismissible is false", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info", dismissible: false } });
    expect(wrapper.find("[data-test-id='alert-dismiss']").exists()).toBe(false);
  });

  it("renders the dismiss button when dismissible is true", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info", dismissible: true } });
    expect(wrapper.find("[data-test-id='alert-dismiss']").exists()).toBe(true);
  });

  it("emits the dismiss event when the dismiss button is clicked", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info", dismissible: true } });
    await wrapper.find("[data-test-id='alert-dismiss']").trigger("click");
    expect(wrapper.emitted("dismiss")).toBeTruthy();
  });

  // ─── Default maskConfig ───────────────────────────────────────────────────

  it("passes the resolved maskConfig to AlertMaskCore", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, { props: { theme: "info" } });
    const contentEl = wrapper.find(".alert-mask-content");
    const style = (contentEl.element as HTMLElement).style;
    // Default borderLeft: 6 → --insetInlineStart: 6px
    expect(style.getPropertyValue("--insetInlineStart")).toBe("6px");
    expect(style.getPropertyValue("--insetBlockStart")).toBe("1px");
    expect(style.getPropertyValue("--insetInlineEnd")).toBe("1px");
    expect(style.getPropertyValue("--insetBlockEnd")).toBe("1px");
  });

  it("merges custom maskConfig over defaults", async () => {
    const wrapper = await mountSuspended(AlertMaskedContent, {
      props: { theme: "info", maskConfig: { borderLeft: 12 } },
    });
    const contentEl = wrapper.find(".alert-mask-content");
    const style = (contentEl.element as HTMLElement).style;
    expect(style.getPropertyValue("--insetInlineStart")).toBe("12px");
  });
});
