import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import UiBlockDecorated from "../UiBlockDecorated.vue";

describe("UiBlockDecorated", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a <div> by default", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the given tag", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, { props: { tag: "section" } });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("applies no strength classes by default", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated);
    expect(wrapper.classes()).toEqual(["ui-block-decorated"]);
  });

  it("applies the border strength class", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, { props: { borderStrength: 3 } });
    expect(wrapper.classes()).toContain("ui-block-decorated-border-3");
  });

  it("applies the shadow strength class", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, { props: { shadowStrength: 5 } });
    expect(wrapper.classes()).toContain("ui-block-decorated-shadow-5");
  });

  it("applies the inner shadow strength class", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, { props: { innerShadowStrength: 2 } });
    expect(wrapper.classes()).toContain("ui-block-decorated-inner-shadow-2");
  });

  it("combines all three strength classes together", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, {
      props: { borderStrength: 1, shadowStrength: 2, innerShadowStrength: 3 },
    });
    expect(wrapper.classes()).toContain("ui-block-decorated-border-1");
    expect(wrapper.classes()).toContain("ui-block-decorated-shadow-2");
    expect(wrapper.classes()).toContain("ui-block-decorated-inner-shadow-3");
  });

  it("renders slot content", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, {
      slots: { default: "<p class='slot-child'>Hello</p>" },
    });
    expect(wrapper.find(".slot-child").exists()).toBe(true);
    expect(wrapper.find(".slot-child").text()).toBe("Hello");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, {
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(UiBlockDecorated, {
      props: { styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });
});
