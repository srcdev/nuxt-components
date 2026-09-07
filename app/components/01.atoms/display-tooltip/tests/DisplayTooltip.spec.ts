import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayTooltip from "../DisplayTooltip.vue";

describe("DisplayTooltip", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayTooltip);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(DisplayTooltip, { props: { tooltipId: "fixed-id" } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("generates a tooltip id when none is provided", async () => {
    const wrapper = await mountSuspended(DisplayTooltip);
    const button = wrapper.find(".display-tooltip-trigger-button");
    expect(button.attributes("popovertarget")).toMatch(/^nuxt-tooltip-/);
  });

  it("uses the given tooltipId", async () => {
    const wrapper = await mountSuspended(DisplayTooltip, { props: { tooltipId: "my-tooltip" } });
    const button = wrapper.find(".display-tooltip-trigger-button");
    expect(button.attributes("popovertarget")).toBe("my-tooltip");
    expect(wrapper.find(".display-tooltip-popover").attributes("id")).toBe("my-tooltip");
  });

  it("does not render triggerContent slot content when unused", async () => {
    const wrapper = await mountSuspended(DisplayTooltip);
    expect(wrapper.find(".slot-trigger").exists()).toBe(false);
  });

  it("renders the triggerContent slot", async () => {
    const wrapper = await mountSuspended(DisplayTooltip, {
      slots: { triggerContent: "<span class='slot-trigger'>Label</span>" },
    });
    expect(wrapper.find(".slot-trigger").text()).toBe("Label");
  });

  it("renders the tooltipContent slot", async () => {
    const wrapper = await mountSuspended(DisplayTooltip, {
      slots: { tooltipContent: "<p class='slot-content'>Helpful info</p>" },
    });
    expect(wrapper.find(".display-tooltip-popover .slot-content").text()).toBe("Helpful info");
  });

  it("applies the hide class to the trigger button when hideTrigger is true", async () => {
    const wrapper = await mountSuspended(DisplayTooltip, { props: { hideTrigger: true } });
    expect(wrapper.find(".display-tooltip-trigger-button").classes()).toContain("hide");
  });

  it("does not apply the hide class by default", async () => {
    const wrapper = await mountSuspended(DisplayTooltip);
    expect(wrapper.find(".display-tooltip-trigger-button").classes()).not.toContain("hide");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(DisplayTooltip, {
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DisplayTooltip, {
      props: { styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });
});
