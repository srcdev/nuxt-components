import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayBanner from "../DisplayBanner.vue";

describe("DisplayBanner", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayBanner);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(DisplayBanner);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a <div> by default", async () => {
    const wrapper = await mountSuspended(DisplayBanner);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the given tag", async () => {
    const wrapper = await mountSuspended(DisplayBanner, { props: { tag: "section" } });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("does not render a .canvas wrapper when the canvas slot is empty", async () => {
    const wrapper = await mountSuspended(DisplayBanner);
    expect(wrapper.find(".canvas").exists()).toBe(false);
  });

  it("does not render a .content wrapper when the content slot is empty", async () => {
    const wrapper = await mountSuspended(DisplayBanner);
    expect(wrapper.find(".content").exists()).toBe(false);
  });

  it("renders the canvas slot", async () => {
    const wrapper = await mountSuspended(DisplayBanner, {
      slots: { canvas: "<img class='slot-canvas' />" },
    });
    expect(wrapper.find(".canvas .slot-canvas").exists()).toBe(true);
  });

  it("renders the content slot", async () => {
    const wrapper = await mountSuspended(DisplayBanner, {
      slots: { content: "<p class='slot-content'>Hello</p>" },
    });
    expect(wrapper.find(".content .slot-content").text()).toBe("Hello");
  });

  it("renders both slots together", async () => {
    const wrapper = await mountSuspended(DisplayBanner, {
      slots: {
        canvas: "<img class='slot-canvas' />",
        content: "<p class='slot-content'>Hello</p>",
      },
    });
    expect(wrapper.find(".canvas .slot-canvas").exists()).toBe(true);
    expect(wrapper.find(".content .slot-content").exists()).toBe(true);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(DisplayBanner, {
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DisplayBanner, {
      props: { styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });
});
