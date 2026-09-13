import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PopOver from "../PopOver.vue";

interface PopOverInstance {
  popoverId: string;
  anchorName: string;
  handleToggle: (event: Event) => void;
}

const createWrapper = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
  return mountSuspended(PopOver, { props, slots });
};

describe("PopOver", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  beforeEach(() => {
    // Popover API is not implemented in jsdom — define stubs so we can test
    Object.defineProperty(HTMLElement.prototype, "hidePopover", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["hidePopover"];
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
  });

  it("mounts without error", async () => {
    wrapper = await createWrapper();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    wrapper = await createWrapper(
      {},
      { trigger: "<span>Open</span>", content: "<p>Details</p>" }
    );
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("Trigger", () => {
    it("renders the trigger slot", async () => {
      wrapper = await createWrapper({}, { trigger: '<span class="slot-trigger">Open</span>' });
      expect(wrapper.find(".slot-trigger").text()).toBe("Open");
    });

    it("trigger button has type='button'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".pop-over-trigger").attributes("type")).toBe("button");
    });

    it("does not set aria-label on the trigger by default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".pop-over-trigger").attributes("aria-label")).toBeUndefined();
    });

    it("sets aria-label on the trigger when triggerAriaLabel is given", async () => {
      wrapper = await createWrapper({ triggerAriaLabel: "Show filters" });
      expect(wrapper.find(".pop-over-trigger").attributes("aria-label")).toBe("Show filters");
    });

    it("trigger button popovertarget matches the popover id", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as PopOverInstance;
      expect(wrapper.find(".pop-over-trigger").attributes("popovertarget")).toBe(vm.popoverId);
    });

    it("trigger button has popovertargetaction='toggle'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".pop-over-trigger").attributes("popovertargetaction")).toBe("toggle");
    });
  });

  describe("Popover panel", () => {
    it("renders the content slot", async () => {
      wrapper = await createWrapper({}, { content: '<p class="slot-content">Details</p>' });
      expect(wrapper.find(".pop-over-popover .slot-content").text()).toBe("Details");
    });

    it("has the popover attribute", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".pop-over-popover").attributes("popover")).toBeDefined();
    });

    it("does not set aria-label by default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".pop-over-popover").attributes("aria-label")).toBeUndefined();
    });

    it("sets aria-label when popoverAriaLabel is given", async () => {
      wrapper = await createWrapper({ popoverAriaLabel: "Filter options" });
      expect(wrapper.find(".pop-over-popover").attributes("aria-label")).toBe("Filter options");
    });

    it("sets data-placement on the root element", async () => {
      wrapper = await createWrapper({ placement: "top" });
      expect(wrapper.find(".pop-over").attributes("data-placement")).toBe("top");
    });

    it("defaults placement to right", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".pop-over").attributes("data-placement")).toBe("right");
    });
  });

  describe("Close button", () => {
    it("has a default aria-label", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".pop-over-close-button").attributes("aria-label")).toBe("Close");
    });

    it("uses a custom closeButtonAriaLabel", async () => {
      wrapper = await createWrapper({ closeButtonAriaLabel: "Dismiss" });
      expect(wrapper.find(".pop-over-close-button").attributes("aria-label")).toBe("Dismiss");
    });

    it("has popovertargetaction='hide' pointing at the popover", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as PopOverInstance;
      const closeButton = wrapper.find(".pop-over-close-button");
      expect(closeButton.attributes("popovertargetaction")).toBe("hide");
      expect(closeButton.attributes("popovertarget")).toBe(vm.popoverId);
    });
  });

  describe("handleToggle focus management", () => {
    it("focuses the close button when the popover opens", async () => {
      wrapper = await createWrapper();
      const closeButtonEl = wrapper.find(".pop-over-close-button").element as HTMLElement;
      const focusSpy = vi.spyOn(closeButtonEl, "focus");

      const vm = wrapper.vm as unknown as PopOverInstance;
      vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));

      expect(focusSpy).toHaveBeenCalledOnce();
    });

    it("does not move focus when the popover closes", async () => {
      wrapper = await createWrapper();
      const closeButtonEl = wrapper.find(".pop-over-close-button").element as HTMLElement;
      const focusSpy = vi.spyOn(closeButtonEl, "focus");

      const vm = wrapper.vm as unknown as PopOverInstance;
      vm.handleToggle(Object.assign(new Event("toggle"), { newState: "closed" }));

      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  describe("Anchor name", () => {
    it("sets a unique --_anchor-name on the root element style", async () => {
      wrapper = await createWrapper();
      const style = wrapper.find(".pop-over").attributes("style") ?? "";
      expect(style).toContain("--_anchor-name: --pop-over-anchor-");
    });
  });

  describe("styleClassPassthrough", () => {
    it("applies a string class to the root element", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "custom-pop-over" });
      expect(wrapper.find(".pop-over").classes()).toContain("custom-pop-over");
    });

    it("applies an array of classes to the root element", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["pop-over-a", "pop-over-b"] });
      expect(wrapper.find(".pop-over").classes()).toContain("pop-over-a");
      expect(wrapper.find(".pop-over").classes()).toContain("pop-over-b");
    });

    it("root element always has the 'pop-over' class", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "extra-class" });
      expect(wrapper.find(".pop-over").classes()).toContain("pop-over");
    });

    it("resets classes when styleClassPassthrough prop changes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "initial-class" });
      expect(wrapper.find(".pop-over").classes()).toContain("initial-class");

      await wrapper.setProps({ styleClassPassthrough: "updated-class" });
      expect(wrapper.find(".pop-over").classes()).not.toContain("initial-class");
      expect(wrapper.find(".pop-over").classes()).toContain("updated-class");
    });
  });
});
