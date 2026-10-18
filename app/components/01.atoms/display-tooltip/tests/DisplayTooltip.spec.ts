import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayTooltip from "../DisplayTooltip.vue";

const mounted: { unmount: () => void }[] = [];

const mountTooltip = async (options: Parameters<typeof mountSuspended<typeof DisplayTooltip>>[1] = {}) => {
  const wrapper = await mountSuspended(DisplayTooltip, options);
  mounted.push(wrapper);
  return wrapper;
};

describe("DisplayTooltip", () => {
  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  it("mounts without error", async () => {
    const wrapper = await mountTooltip();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountTooltip({ props: { tooltipId: "fixed-id" } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("generates a tooltip id when none is provided", async () => {
    const wrapper = await mountTooltip();
    const button = wrapper.find(".display-tooltip-trigger-button");
    expect(button.attributes("popovertarget")).toMatch(/^nuxt-tooltip-/);
  });

  it("uses the given tooltipId", async () => {
    const wrapper = await mountTooltip({ props: { tooltipId: "my-tooltip" } });
    const button = wrapper.find(".display-tooltip-trigger-button");
    expect(button.attributes("popovertarget")).toBe("my-tooltip");
    expect(wrapper.find(".display-tooltip-popover").attributes("id")).toBe("my-tooltip");
  });

  it("does not render triggerContent slot content when unused", async () => {
    const wrapper = await mountTooltip();
    expect(wrapper.find(".slot-trigger").exists()).toBe(false);
  });

  it("renders the triggerContent slot", async () => {
    const wrapper = await mountTooltip({
      slots: { triggerContent: "<span class='slot-trigger'>Label</span>" },
    });
    expect(wrapper.find(".slot-trigger").text()).toBe("Label");
  });

  it("renders the tooltipContent slot", async () => {
    const wrapper = await mountTooltip({
      slots: { tooltipContent: "<p class='slot-content'>Helpful info</p>" },
    });
    expect(wrapper.find(".display-tooltip-popover .slot-content").text()).toBe("Helpful info");
  });

  it("hides the trigger from view, the tab order and the accessibility tree when hideTrigger is true", async () => {
    const wrapper = await mountTooltip({ props: { hideTrigger: true } });
    const button = wrapper.find(".display-tooltip-trigger-button");
    expect(button.attributes("data-hidden")).toBeDefined();
    expect(button.attributes("tabindex")).toBe("-1");
    expect(button.attributes("aria-hidden")).toBe("true");
  });

  it("leaves the trigger visible and focusable by default", async () => {
    const wrapper = await mountTooltip();
    const button = wrapper.find(".display-tooltip-trigger-button");
    expect(button.attributes("data-hidden")).toBeUndefined();
    expect(button.attributes("tabindex")).toBeUndefined();
    expect(button.attributes("aria-hidden")).toBeUndefined();
  });

  it("renders the trigger as type=\"button\" so it never submits a surrounding form", async () => {
    const wrapper = await mountTooltip();
    expect(wrapper.find(".display-tooltip-trigger-button").attributes("type")).toBe("button");
  });

  it("uses the triggerIcon prop for the trigger icon", async () => {
    const wrapper = await mountTooltip({ props: { triggerIcon: "lucide:info" } });
    expect(wrapper.find(".display-tooltip-trigger-icon").classes().join(" ")).toContain("lucide:info");
  });

  it("uses triggerAriaLabel for the trigger's accessible name", async () => {
    const wrapper = await mountTooltip({ props: { triggerAriaLabel: "Plus d'informations" } });
    expect(wrapper.find(".display-tooltip-trigger-button").attributes("aria-label")).toBe("Plus d'informations");
  });

  it("keeps the generated id stable and follows tooltipId changes", async () => {
    const wrapper = await mountTooltip();
    const button = wrapper.find(".display-tooltip-trigger-button");
    const generated = button.attributes("popovertarget");

    await wrapper.setProps({ tooltipId: "custom" });
    expect(button.attributes("popovertarget")).toBe("custom");
    expect(wrapper.find(".display-tooltip-popover").attributes("id")).toBe("custom");

    await wrapper.setProps({ tooltipId: "" });
    expect(button.attributes("popovertarget")).toBe(generated);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountTooltip({
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountTooltip({
      props: { styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });

  describe("without the Popover API", () => {
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "showPopover", { value: undefined, writable: true, configurable: true });
    });

    afterEach(() => {
      delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
    });

    it("opens and closes from the trigger", async () => {
      const wrapper = await mountTooltip();
      const trigger = wrapper.find(".display-tooltip-trigger-button");
      const popover = wrapper.find(".display-tooltip-popover");

      await trigger.trigger("click");
      expect(popover.classes()).toContain("display-tooltip-popover-open");
      expect(trigger.attributes("aria-expanded")).toBe("true");

      await trigger.trigger("click");
      expect(popover.classes()).not.toContain("display-tooltip-popover-open");
      expect(trigger.attributes("aria-expanded")).toBe("false");
    });

    it("passes a close function to the tooltipContent slot", async () => {
      const wrapper = await mountTooltip({
        slots: {
          tooltipContent: `<template #tooltipContent="{ close }"><button class="custom-close" @click="close">Done</button></template>`,
        },
      });
      await wrapper.find(".display-tooltip-trigger-button").trigger("click");
      await wrapper.find(".custom-close").trigger("click");
      expect(wrapper.find(".display-tooltip-popover").classes()).not.toContain("display-tooltip-popover-open");
    });
  });
});
