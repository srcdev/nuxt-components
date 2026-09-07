import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ClippedPanel from "../ClippedPanel.vue";

describe("ClippedPanel", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ClippedPanel);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(ClippedPanel);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a <div> by default", async () => {
    const wrapper = await mountSuspended(ClippedPanel);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the given tag", async () => {
    const wrapper = await mountSuspended(ClippedPanel, { props: { tag: "section" } });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("defaults to the square variant class", async () => {
    const wrapper = await mountSuspended(ClippedPanel);
    expect(wrapper.classes()).toContain("clipped-panel");
    expect(wrapper.classes()).toContain("square");
  });

  it("applies the rectangle variant class", async () => {
    const wrapper = await mountSuspended(ClippedPanel, { props: { variant: "rectangle" } });
    expect(wrapper.classes()).toContain("rectangle");
  });

  it("applies the circle-cutout variant class", async () => {
    const wrapper = await mountSuspended(ClippedPanel, { props: { variant: "circle-cutout" } });
    expect(wrapper.classes()).toContain("circle-cutout");
  });

  it("renders slot content", async () => {
    const wrapper = await mountSuspended(ClippedPanel, {
      slots: { default: "<p class='slot-child'>Hello</p>" },
    });
    expect(wrapper.find(".slot-child").exists()).toBe(true);
    expect(wrapper.find(".slot-child").text()).toBe("Hello");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(ClippedPanel, {
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ClippedPanel, {
      props: { styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });
});
