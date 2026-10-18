import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayTooltipRich from "../DisplayTooltipRich.vue";
import type { TooltipContentText } from "~/types/components";

const contentText: TooltipContentText = {
  tooltipTitle: { tag: "h4", text: "Title" },
  tooltipContent: { tag: "p", text: "Body copy" },
  tooltipAction: { tag: "span", text: "Learn more" },
};

const mounted: { unmount: () => void }[] = [];

const mountDefined = async (options: Parameters<typeof mountSuspended<typeof DisplayTooltipRich>>[1] = {}) => {
  const wrapper = await mountSuspended(DisplayTooltipRich, options);
  mounted.push(wrapper);
  return wrapper;
};

describe("DisplayTooltipRich", () => {
  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  it("mounts without error", async () => {
    const wrapper = await mountDefined();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountDefined({ props: { contentText, tooltipId: "fixed" } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders the title, body, and action from contentText", async () => {
    const wrapper = await mountDefined({ props: { contentText } });
    expect(wrapper.find(".display-tooltip-rich-title").text()).toBe("Title");
    expect(wrapper.find(".display-tooltip-rich-body").text()).toBe("Body copy");
    expect(wrapper.find(".display-tooltip-rich-action").text()).toBe("Learn more");
  });

  it("renders each contentText field with its given tag", async () => {
    const wrapper = await mountDefined({ props: { contentText } });
    expect(wrapper.find(".display-tooltip-rich-title").element.tagName.toLowerCase()).toBe("h4");
    expect(wrapper.find(".display-tooltip-rich-body").element.tagName.toLowerCase()).toBe("p");
    expect(wrapper.find(".display-tooltip-rich-action").element.tagName.toLowerCase()).toBe("span");
  });

  it("omits a field when not present in contentText", async () => {
    const wrapper = await mountDefined({
      props: { contentText: { tooltipTitle: { tag: "h4", text: "Only a title" } } },
    });
    expect(wrapper.find(".display-tooltip-rich-title").exists()).toBe(true);
    expect(wrapper.find(".display-tooltip-rich-body").exists()).toBe(false);
    expect(wrapper.find(".display-tooltip-rich-action").exists()).toBe(false);
  });

  it("renders a close button wired to the tooltip id", async () => {
    const wrapper = await mountDefined({ props: { tooltipId: "my-tip" } });
    const closeButton = wrapper.find(".display-tooltip-close-button");
    expect(closeButton.attributes("popovertarget")).toBe("nuxt-tooltip-my-tip");
    expect(closeButton.attributes("popovertargetaction")).toBe("hide");
  });

  it("renders the close button as an inline InputButton of type button with localisable copy", async () => {
    const wrapper = await mountDefined({ props: { closeButtonText: "Fermer", closeButtonAriaLabel: "Fermer l'info-bulle" } });
    const closeButton = wrapper.find(".display-tooltip-close-button");
    expect(closeButton.element.tagName).toBe("BUTTON");
    expect(closeButton.classes()).toContain("input-button");
    expect(closeButton.attributes("type")).toBe("button");
    expect(closeButton.attributes("data-variant")).toBe("inline");
    expect(closeButton.text()).toBe("Fermer");
    expect(closeButton.attributes("aria-label")).toBe("Fermer l'info-bulle");
  });

  it("adds its own root class alongside DisplayTooltip's", async () => {
    const wrapper = await mountDefined();
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["display-tooltip", "display-tooltip-rich"]));
  });

  it("keeps its root class when styleClassPassthrough changes", async () => {
    const wrapper = await mountDefined({ props: { styleClassPassthrough: "first" } });
    await wrapper.setProps({ styleClassPassthrough: ["second"] });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["display-tooltip-rich", "second"]));
    expect(wrapper.classes()).not.toContain("first");
  });

  it("forwards triggerIcon and triggerAriaLabel to the trigger", async () => {
    const wrapper = await mountDefined({ props: { triggerIcon: "lucide:info", triggerAriaLabel: "Plus d'informations" } });
    const trigger = wrapper.find(".display-tooltip-trigger-button");
    expect(trigger.attributes("aria-label")).toBe("Plus d'informations");
    expect(trigger.find(".display-tooltip-trigger-icon").classes().join(" ")).toContain("lucide:info");
  });

  it("falls back to a default tag when a contentText tag is empty", async () => {
    const wrapper = await mountDefined({
      props: {
        contentText: {
          tooltipTitle: { tag: "", text: "T" },
          tooltipContent: { tag: "  ", text: "B" },
          tooltipAction: { tag: "", text: "A" },
        },
      },
    });
    expect(wrapper.find(".display-tooltip-rich-title").element.tagName).toBe("P");
    expect(wrapper.find(".display-tooltip-rich-body").element.tagName).toBe("P");
    expect(wrapper.find(".display-tooltip-rich-action").element.tagName).toBe("SPAN");
  });

  it("keeps the generated id stable and links the trigger, panel and close button", async () => {
    const wrapper = await mountDefined();
    const target = wrapper.find(".display-tooltip-trigger-button").attributes("popovertarget");
    expect(target).toMatch(/^nuxt-tooltip-/);
    expect(wrapper.find(".display-tooltip-popover").attributes("id")).toBe(target);
    expect(wrapper.find(".display-tooltip-close-button").attributes("popovertarget")).toBe(target);

    await wrapper.setProps({ tooltipId: "tip" });
    expect(wrapper.find(".display-tooltip-close-button").attributes("popovertarget")).toBe("nuxt-tooltip-tip");
    await wrapper.setProps({ tooltipId: "" });
    expect(wrapper.find(".display-tooltip-close-button").attributes("popovertarget")).toBe(target);
  });

  it("renders the triggerContent slot", async () => {
    const wrapper = await mountDefined({
      slots: { triggerContent: "<span class='slot-trigger'>?</span>" },
    });
    expect(wrapper.find(".slot-trigger").text()).toBe("?");
  });

  it("applies styleClassPassthrough classes to the underlying DisplayTooltip", async () => {
    const wrapper = await mountDefined({
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
      const wrapper = await mountDefined({ props: { contentText } });
      await wrapper.find(".display-tooltip-trigger-button").trigger("click");
      expect(wrapper.find(".display-tooltip-popover").classes()).toContain("display-tooltip-popover-open");

      await wrapper.find(".display-tooltip-close-button").trigger("click");
      expect(wrapper.find(".display-tooltip-popover").classes()).not.toContain("display-tooltip-popover-open");
    });
  });
});
