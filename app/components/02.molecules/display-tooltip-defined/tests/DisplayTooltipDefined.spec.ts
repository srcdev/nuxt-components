import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayTooltipDefined from "../DisplayTooltipDefined.vue";
import type { TooltipContentText } from "~/types/components";

const contentText: TooltipContentText = {
  tooltipTitle: { tag: "h4", text: "Title" },
  tooltipContent: { tag: "p", text: "Body copy" },
  tooltipAction: { tag: "span", text: "Learn more" },
};

describe("DisplayTooltipDefined", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined, { props: { contentText, tooltipId: "fixed" } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders the title, body, and action from contentText", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined, { props: { contentText } });
    expect(wrapper.find(".tooltip-title").text()).toBe("Title");
    expect(wrapper.find(".tooltip-body").text()).toBe("Body copy");
    expect(wrapper.find(".tooltip-action").text()).toBe("Learn more");
  });

  it("renders each contentText field with its given tag", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined, { props: { contentText } });
    expect(wrapper.find(".tooltip-title").element.tagName.toLowerCase()).toBe("h4");
    expect(wrapper.find(".tooltip-body").element.tagName.toLowerCase()).toBe("p");
    expect(wrapper.find(".tooltip-action").element.tagName.toLowerCase()).toBe("span");
  });

  it("omits a field when not present in contentText", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined, {
      props: { contentText: { tooltipTitle: { tag: "h4", text: "Only a title" } } },
    });
    expect(wrapper.find(".tooltip-title").exists()).toBe(true);
    expect(wrapper.find(".tooltip-body").exists()).toBe(false);
    expect(wrapper.find(".tooltip-action").exists()).toBe(false);
  });

  it("renders a close button wired to the tooltip id", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined, { props: { tooltipId: "my-tip" } });
    const closeButton = wrapper.find(".display-tooltip-close-button");
    expect(closeButton.attributes("popovertarget")).toBe("nuxt-tooltip-my-tip");
    expect(closeButton.attributes("popovertargetaction")).toBe("hide");
  });

  it("renders the triggerContent slot", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined, {
      slots: { triggerContent: "<span class='slot-trigger'>?</span>" },
    });
    expect(wrapper.find(".slot-trigger").text()).toBe("?");
  });

  it("applies styleClassPassthrough classes to the underlying DisplayTooltip", async () => {
    const wrapper = await mountSuspended(DisplayTooltipDefined, {
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  describe("without the Popover API", () => {
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "showPopover", { value: undefined, writable: true, configurable: true });
    });

    afterEach(() => {
      delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
    });

    it("closes from the close button", async () => {
      const wrapper = await mountSuspended(DisplayTooltipDefined, { props: { contentText } });
      await wrapper.find(".display-tooltip-trigger-button").trigger("click");
      expect(wrapper.find(".display-tooltip-popover").classes()).toContain("display-tooltip-popover-open");

      await wrapper.find(".display-tooltip-close-button").trigger("click");
      expect(wrapper.find(".display-tooltip-popover").classes()).not.toContain("display-tooltip-popover-open");
    });
  });
});
