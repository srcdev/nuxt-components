import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, nextTick, ref } from "vue";
import { useAnchoredPopover } from "../useAnchoredPopover";

type Support = { popover: boolean; anchor: boolean };

const setSupport = ({ popover, anchor }: Support) => {
  Object.defineProperty(HTMLElement.prototype, "showPopover", {
    value: popover ? vi.fn() : undefined,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(HTMLElement.prototype, "hidePopover", {
    value: popover ? vi.fn() : undefined,
    writable: true,
    configurable: true,
  });
  // happy-dom's CSS.supports can't be spied on, so swap the whole global and restore it in afterEach.
  Object.defineProperty(globalThis, "CSS", { value: { supports: () => anchor }, writable: true, configurable: true });
};

const originalCSS = globalThis.CSS;

const setViewport = (width: number, height: number) => {
  Object.defineProperty(document.documentElement, "clientWidth", { value: width, configurable: true });
  Object.defineProperty(document.documentElement, "clientHeight", { value: height, configurable: true });
};

const mountHost = (align: "start" | "end" = "start") => {
  const onOpen = vi.fn();
  const mounted = mountSuspended(
    defineComponent({
      setup() {
        const rootRef = ref<HTMLElement | null>(null);
        const triggerRef = ref<HTMLElement | null>(null);
        const popoverRef = ref<HTMLElement | null>(null);
        return { rootRef, triggerRef, popoverRef, ...useAnchoredPopover({ rootRef, triggerRef, popoverRef, align, onOpen }) };
      },
      render() {
        return h("div", [
          h("div", { ref: "rootRef", class: "root" }, [
            h("button", { ref: "triggerRef", class: "trigger", onClick: this.handleTriggerClick }),
            h("div", { ref: "popoverRef", class: "popover" }),
          ]),
          h("button", { class: "outside" }),
        ]);
      },
    }),
    { attachTo: document.body }
  );
  return { mounted, onOpen };
};

const mockTriggerRect = (wrapper: Awaited<ReturnType<typeof mountHost>["mounted"]>, rect: Partial<DOMRect>) => {
  const trigger = wrapper.find(".trigger").element as HTMLElement;
  vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0, ...rect } as DOMRect);
};

const mockPopoverHeight = (wrapper: Awaited<ReturnType<typeof mountHost>["mounted"]>, height: number) => {
  Object.defineProperty(wrapper.find(".popover").element, "offsetHeight", { value: height, configurable: true });
};

describe("useAnchoredPopover", () => {
  beforeEach(() => {
    setViewport(1000, 800);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["hidePopover"];
    delete (document.documentElement as unknown as Record<string, unknown>)["clientWidth"];
    delete (document.documentElement as unknown as Record<string, unknown>)["clientHeight"];
    Object.defineProperty(globalThis, "CSS", { value: originalCSS, writable: true, configurable: true });
    document.body.innerHTML = "";
  });

  describe("native Popover API and anchor positioning", () => {
    beforeEach(() => setSupport({ popover: true, anchor: true }));

    it("uses neither fallback", async () => {
      const wrapper = await mountHost().mounted;
      expect(wrapper.vm.usesFallbackPopover).toBe(false);
      expect(wrapper.vm.needsPositioning).toBe(false);
      expect(wrapper.vm.positionStyle).toBeUndefined();
      expect(wrapper.vm.popoverPlacement).toBeUndefined();
    });

    it("show and hide call the native methods", async () => {
      const wrapper = await mountHost().mounted;
      const popover = wrapper.find(".popover").element as HTMLElement;
      wrapper.vm.show();
      wrapper.vm.hide();
      expect(popover.showPopover).toHaveBeenCalledOnce();
      expect(popover.hidePopover).toHaveBeenCalledOnce();
    });

    it("trigger click is left to popovertarget", async () => {
      const wrapper = await mountHost().mounted;
      await wrapper.find(".trigger").trigger("click");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("tracks isOpen and calls onOpen from the toggle event", async () => {
      const { mounted, onOpen } = mountHost();
      const wrapper = await mounted;
      wrapper.vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));
      expect(wrapper.vm.isOpen).toBe(true);
      expect(onOpen).toHaveBeenCalledOnce();

      wrapper.vm.handleToggle(Object.assign(new Event("toggle"), { newState: "closed" }));
      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("without the Popover API", () => {
    beforeEach(() => setSupport({ popover: false, anchor: true }));

    it("detects the fallback on mount", async () => {
      const wrapper = await mountHost().mounted;
      expect(wrapper.vm.usesFallbackPopover).toBe(true);
    });

    it("toggles open and closed from the trigger, calling onOpen after render", async () => {
      const { mounted, onOpen } = mountHost();
      const wrapper = await mounted;

      await wrapper.find(".trigger").trigger("click");
      expect(wrapper.vm.isOpen).toBe(true);
      await nextTick();
      expect(onOpen).toHaveBeenCalledOnce();

      await wrapper.find(".trigger").trigger("click");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("closes on a pointerdown outside the root, not inside it", async () => {
      const wrapper = await mountHost().mounted;
      wrapper.vm.show();
      await nextTick();

      wrapper.find(".popover").element.dispatchEvent(new Event("pointerdown", { bubbles: true }));
      expect(wrapper.vm.isOpen).toBe(true);

      wrapper.find(".outside").element.dispatchEvent(new Event("pointerdown", { bubbles: true }));
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("closes on Escape and returns focus to the trigger", async () => {
      const wrapper = await mountHost().mounted;
      const focusSpy = vi.spyOn(wrapper.find(".trigger").element as HTMLElement, "focus");
      wrapper.vm.show();
      await nextTick();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(wrapper.vm.isOpen).toBe(false);
      expect(focusSpy).toHaveBeenCalledOnce();
    });

    it("stops listening once closed", async () => {
      const wrapper = await mountHost().mounted;
      const focusSpy = vi.spyOn(wrapper.find(".trigger").element as HTMLElement, "focus");
      wrapper.vm.show();
      await nextTick();
      wrapper.vm.hide();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  describe("without anchor positioning", () => {
    beforeEach(() => setSupport({ popover: true, anchor: false }));

    it("writes the trigger position below it, left-aligned", async () => {
      const wrapper = await mountHost("start").mounted;
      mockTriggerRect(wrapper, { top: 100, bottom: 140, left: 50, right: 250 });
      mockPopoverHeight(wrapper, 200);

      wrapper.vm.handleBeforeToggle(Object.assign(new Event("beforetoggle"), { newState: "open" }));
      expect(wrapper.vm.needsPositioning).toBe(true);
      expect(wrapper.vm.positionStyle).toEqual({
        "--_popover-top": "140px",
        "--_popover-bottom": "700px",
        "--_popover-left": "50px",
      });
      expect(wrapper.vm.popoverPlacement).toBe("below");
    });

    it("measures the right edge when end-aligned", async () => {
      const wrapper = await mountHost("end").mounted;
      mockTriggerRect(wrapper, { top: 100, bottom: 140, left: 50, right: 250 });

      wrapper.vm.handleBeforeToggle(Object.assign(new Event("beforetoggle"), { newState: "open" }));
      expect(wrapper.vm.positionStyle).toMatchObject({ "--_popover-right": "750px" });
      expect(wrapper.vm.positionStyle).not.toHaveProperty("--_popover-left");
    });

    it("flips above when there is no room below but room above", async () => {
      const wrapper = await mountHost().mounted;
      mockTriggerRect(wrapper, { top: 700, bottom: 740, left: 50, right: 250 });
      mockPopoverHeight(wrapper, 200);

      wrapper.vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));
      expect(wrapper.vm.popoverPlacement).toBe("above");
    });

    it("stays below when there is no room either side", async () => {
      const wrapper = await mountHost().mounted;
      mockTriggerRect(wrapper, { top: 100, bottom: 140, left: 50, right: 250 });
      mockPopoverHeight(wrapper, 900);

      wrapper.vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));
      expect(wrapper.vm.popoverPlacement).toBe("below");
    });

    it("ignores beforetoggle when closing", async () => {
      const wrapper = await mountHost().mounted;
      mockTriggerRect(wrapper, { top: 100, bottom: 140, left: 50, right: 250 });

      wrapper.vm.handleBeforeToggle(Object.assign(new Event("beforetoggle"), { newState: "closed" }));
      expect(wrapper.vm.positionStyle).toMatchObject({ "--_popover-top": "0px" });
    });
  });
});
