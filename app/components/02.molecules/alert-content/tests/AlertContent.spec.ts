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

  // ─── showIcon / actions (added 2026-09-27) ──────────────────────────────────

  it("omits the icon region when showIcon is false", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info", showIcon: false } });
    expect(wrapper.find("[data-test-id='alert-icon']").exists()).toBe(false);
  });

  it("renders the #actions slot in its own row, outside the live/described body", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", contentId: "msg-1", ariaLive: "polite" },
      slots: { content: "Body", actions: '<button type="button" class="act">Do it</button>' },
    });
    const actions = wrapper.find("[data-test-id='alert-actions']");
    expect(actions.exists()).toBe(true);
    expect(actions.find(".act").exists()).toBe(true);
    expect(wrapper.find(".alert-content-body").find(".act").exists()).toBe(false);
  });

  it("does not render the actions row without the #actions slot", async () => {
    const wrapper = await mountSuspended(AlertContent, { props: { theme: "info" }, slots: { content: "Body" } });
    expect(wrapper.find("[data-test-id='alert-actions']").exists()).toBe(false);
  });

  // ─── styleClassPassthrough / hostile text (added 2026-10-08) ────────────────

  it("applies styleClassPassthrough classes to the root", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", styleClassPassthrough: ["site-notice", "is-wide"] },
    });
    expect(wrapper.find(".alert-content").classes()).toEqual(expect.arrayContaining(["site-notice", "is-wide"]));
  });

  it("updates root classes when styleClassPassthrough changes", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info", styleClassPassthrough: "first-class" },
    });
    await wrapper.setProps({ styleClassPassthrough: "second-class" });
    const classes = wrapper.find(".alert-content").classes();
    expect(classes).toContain("second-class");
    expect(classes).not.toContain("first-class");
  });

  it("renders HTML-like slot text as text, not markup", async () => {
    const wrapper = await mountSuspended(
      {
        components: { AlertContent },
        setup: () => ({ text: "<img src=x onerror=alert(1)>" }),
        template: `<AlertContent theme="info"><template #content>{{ text }}</template></AlertContent>`,
      },
      {}
    );
    const content = wrapper.find("[data-test-id='alert-content']");
    expect(content.find("img").exists()).toBe(false);
    expect(content.text()).toBe("<img src=x onerror=alert(1)>");
  });

  it("uses component-prefixed classes for the title and text", async () => {
    const wrapper = await mountSuspended(AlertContent, {
      props: { theme: "info" },
      slots: { title: "T", content: "C" },
    });
    expect(wrapper.find(".alert-content-title").exists()).toBe(true);
    expect(wrapper.find(".alert-content-text").exists()).toBe(true);
  });
});
