import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ContactSection from "./ContactSection.vue";

describe("ContactSection", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      props: { styleClassPassthrough: ["custom-class", "another-class"] },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with form slot", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { form: '<form><input type="text" /></form>' },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("renders with the correct tag when tag prop is provided", async () => {
    for (const tag of ["section", "article", "main"] as const) {
      const wrapper = await mountSuspended(ContactSection, { props: { tag } });
      expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
    }
  });

  // ─── Base classes ────────────────────────────────────────────────────────

  it("always has the contact-section class", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.classes()).toContain("contact-section");
  });

  // ─── Structure ───────────────────────────────────────────────────────────

  it("renders contact-section-inner wrapper", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.find(".contact-section-inner").exists()).toBe(true);
  });

  it("renders contact-section-info wrapper", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.find(".contact-section-info").exists()).toBe(true);
  });

  it("renders contact-section-form wrapper", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.find(".contact-section-form").exists()).toBe(true);
  });

  // ─── Default slot content ─────────────────────────────────────────────────

  it("renders default content for item-0 slot", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.html()).toContain("Default slot content for item 1");
  });

  it("renders default content for item-1 slot", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.html()).toContain("Default slot content for item 2");
  });

  it("renders default content for item-2 slot", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.html()).toContain("Default slot content for item 3");
  });

  // ─── Item slots ───────────────────────────────────────────────────────────

  it("renders custom item-0 slot content", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { "item-0": "<span>Custom item 1</span>" },
    });
    expect(wrapper.html()).toContain("Custom item 1");
    expect(wrapper.html()).not.toContain("Default slot content for item 1");
  });

  it("renders custom item-1 slot content", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { "item-1": "<span>Custom item 2</span>" },
    });
    expect(wrapper.html()).toContain("Custom item 2");
    expect(wrapper.html()).not.toContain("Default slot content for item 2");
  });

  it("renders custom item-2 slot content", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { "item-2": "<span>Custom item 3</span>" },
    });
    expect(wrapper.html()).toContain("Custom item 3");
    expect(wrapper.html()).not.toContain("Default slot content for item 3");
  });

  // ─── Indicator slots ──────────────────────────────────────────────────────

  it("renders indicator-0 slot content", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { "indicator-0": '<span class="icon-0">★</span>' },
    });
    expect(wrapper.find(".icon-0").exists()).toBe(true);
  });

  it("renders indicator-1 slot content", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { "indicator-1": '<span class="icon-1">★</span>' },
    });
    expect(wrapper.find(".icon-1").exists()).toBe(true);
  });

  it("renders indicator-2 slot content", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { "indicator-2": '<span class="icon-2">★</span>' },
    });
    expect(wrapper.find(".icon-2").exists()).toBe(true);
  });

  // ─── Form slot ────────────────────────────────────────────────────────────

  it("renders form slot content inside contact-section-form", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      slots: { form: '<form class="test-form"><button>Submit</button></form>' },
    });
    const formWrapper = wrapper.find(".contact-section-form");
    expect(formWrapper.find(".test-form").exists()).toBe(true);
    expect(formWrapper.html()).toContain("Submit");
  });

  it("renders contact-section-form as empty when no form slot provided", async () => {
    const wrapper = await mountSuspended(ContactSection);
    const formWrapper = wrapper.find(".contact-section-form");
    expect(formWrapper.find("form").exists()).toBe(false);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      props: { styleClassPassthrough: "my-class" },
    });
    expect(wrapper.classes()).toContain("my-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("renders cleanly with no styleClassPassthrough prop", async () => {
    const wrapper = await mountSuspended(ContactSection);
    expect(wrapper.classes()).toContain("contact-section");
  });

  // ─── Combined ─────────────────────────────────────────────────────────────

  it("renders correctly with all props and slots combined", async () => {
    const wrapper = await mountSuspended(ContactSection, {
      props: { tag: "section", styleClassPassthrough: ["combined-class"] },
      slots: {
        "indicator-0": '<span class="icon">✓</span>',
        "item-0": "<span>Step one</span>",
        "item-1": "<span>Step two</span>",
        "item-2": "<span>Step three</span>",
        form: '<form class="contact-form"><button>Send</button></form>',
      },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("section");
    expect(wrapper.classes()).toContain("combined-class");
    expect(wrapper.html()).toContain("Step one");
    expect(wrapper.find(".contact-form").exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
