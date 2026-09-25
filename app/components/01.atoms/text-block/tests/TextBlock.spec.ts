import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import TextBlock from "../TextBlock.vue";

describe("TextBlock", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(TextBlock, { slots: { default: "Content" } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(TextBlock, { slots: { default: "<p>Lead copy</p>" } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("defaults to a div with the text-block class", async () => {
    const wrapper = await mountSuspended(TextBlock);
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("text-block");
  });

  it.each(["section", "article", "main"] as const)("renders a <%s> when tag is set", async (tag) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(TextBlock, { props: { tag } });
    expect(wrapper.element.tagName).toBe(tag.toUpperCase());
    warn.mockRestore();
  });

  it("renders slot content", async () => {
    const wrapper = await mountSuspended(TextBlock, { slots: { default: "<p class='lead'>Hello</p>" } });
    expect(wrapper.find(".lead").text()).toBe("Hello");
  });

  describe("aria-labelledby", () => {
    it("is not set on a div", async () => {
      const wrapper = await mountSuspended(TextBlock);
      expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
    });

    it("is not set on main (a single main landmark needs no name)", async () => {
      const wrapper = await mountSuspended(TextBlock, { props: { tag: "main" } });
      expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
    });

    it.each(["section", "article"] as const)("points a <%s> at the heading bound via the heading-id slot prop", async (tag) => {
      const wrapper = await mountSuspended(TextBlock, {
        props: { tag },
        slots: {
          default: `<template #default="{ headingId }"><h2 :id="headingId">Title</h2></template>`,
        },
      });
      const labelledby = wrapper.attributes("aria-labelledby");
      expect(labelledby).toBeTruthy();
      expect(wrapper.find("h2").attributes("id")).toBe(labelledby);
    });
  });

  describe("styleClassPassthrough", () => {
    it("applies passthrough classes", async () => {
      const wrapper = await mountSuspended(TextBlock, { props: { styleClassPassthrough: ["page-lead", "mbe-20"] } });
      expect(wrapper.classes()).toEqual(expect.arrayContaining(["text-block", "page-lead", "mbe-20"]));
    });

    it("accepts a single string", async () => {
      const wrapper = await mountSuspended(TextBlock, { props: { styleClassPassthrough: "page-lead" } });
      expect(wrapper.classes()).toContain("page-lead");
    });

    it("updates classes when the prop changes", async () => {
      const wrapper = await mountSuspended(TextBlock, { props: { styleClassPassthrough: ["first"] } });
      await wrapper.setProps({ styleClassPassthrough: ["second"] });
      await nextTick();
      expect(wrapper.classes()).toContain("second");
      expect(wrapper.classes()).not.toContain("first");
    });
  });
});
