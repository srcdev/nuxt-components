import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import HeaderBlock from "../HeaderBlock.vue";

describe("HeaderBlock", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      slots: { default: "Hello World" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      slots: { default: "Default heading" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      props: { tagLevel: 3, classLevel: 5, id: "section-heading", styleClassPassthrough: ["custom-class"] },
      slots: { default: "Custom heading" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── tagLevel / classLevel ───────────────────────────────────────────────

  it("defaults to an h1 with the page-heading-1 class", async () => {
    const wrapper = await mountSuspended(HeaderBlock, { slots: { default: "Title" } });
    expect(wrapper.element.tagName).toBe("H1");
    expect(wrapper.classes()).toContain("page-heading-1");
  });

  it("renders the tag matching tagLevel", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      props: { tagLevel: 4 },
      slots: { default: "Title" },
    });
    expect(wrapper.element.tagName).toBe("H4");
  });

  it("applies the page-heading class matching classLevel, independent of tagLevel", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      props: { tagLevel: 2, classLevel: 6 },
      slots: { default: "Title" },
    });
    expect(wrapper.element.tagName).toBe("H2");
    expect(wrapper.classes()).toContain("page-heading-6");
    expect(wrapper.classes()).not.toContain("page-heading-2");
  });

  it("accepts tagLevel/classLevel as numeric strings", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      props: { tagLevel: "5", classLevel: "2" },
      slots: { default: "Title" },
    });
    expect(wrapper.element.tagName).toBe("H5");
    expect(wrapper.classes()).toContain("page-heading-2");
  });

  it("clamps an out-of-range tagLevel to 1", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      // @ts-expect-error deliberately invalid at the type level to test the runtime clamp
      props: { tagLevel: 9 },
      slots: { default: "Title" },
    });
    expect(wrapper.element.tagName).toBe("H1");
  });

  it("clamps an out-of-range classLevel to 1", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      // @ts-expect-error deliberately invalid at the type level to test the runtime clamp
      props: { classLevel: 0 },
      slots: { default: "Title" },
    });
    expect(wrapper.classes()).toContain("page-heading-1");
  });

  // ─── Slot content ────────────────────────────────────────────────────────

  it("renders slot content", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      slots: { default: "<span class='highlight'>Big</span> idea" },
    });
    expect(wrapper.find(".highlight").exists()).toBe(true);
    expect(wrapper.text()).toContain("idea");
  });

  // ─── id ──────────────────────────────────────────────────────────────────

  it("does not render an id attribute by default", async () => {
    const wrapper = await mountSuspended(HeaderBlock, { slots: { default: "Title" } });
    expect(wrapper.attributes("id")).toBeUndefined();
  });

  it("renders a given id, for pairing with a wrapping section's aria-labelledby", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      props: { id: "section-heading" },
      slots: { default: "Title" },
    });
    expect(wrapper.attributes("id")).toBe("section-heading");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(HeaderBlock, {
      props: { styleClassPassthrough: "hero-title" },
      slots: { default: "Title" },
    });
    expect(wrapper.classes()).toContain("hero-title");
  });
});
