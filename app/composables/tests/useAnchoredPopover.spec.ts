import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, nextTick, ref } from "vue";
import { useAnchoredPopover, type AnchoredPopoverSide } from "../useAnchoredPopover";

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

const mountHost = (side: AnchoredPopoverSide = "bottom") => {
  const onOpen = vi.fn();
  const mounted = mountSuspended(
    defineComponent({
      setup() {
        const rootRef = ref<HTMLElement | null>(null);
        const triggerRef = ref<HTMLElement | null>(null);
        const popoverRef = ref<HTMLElement | null>(null);
        return { rootRef, triggerRef, popoverRef, ...useAnchoredPopover({ rootRef, triggerRef, popoverRef, side, onOpen }) };
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

const mockPopoverSize = (wrapper: Awaited<ReturnType<typeof mountHost>["mounted"]>, width: number, height: number) => {
  const popover = wrapper.find(".popover").element;
  Object.defineProperty(popover, "offsetWidth", { value: width, configurable: true });
  Object.defineProperty(popover, "offsetHeight", { value: height, configurable: true });
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

    const openWith = async (side: AnchoredPopoverSide, rect: Partial<DOMRect>, size = { width: 100, height: 200 }) => {
      const wrapper = await mountHost(side).mounted;
      mockTriggerRect(wrapper, rect);
      mockPopoverSize(wrapper, size.width, size.height);
      wrapper.vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));
      return wrapper;
    };

    it("writes every trigger edge, plain and measured from the viewport's far edge", async () => {
      const wrapper = await mountHost().mounted;
      mockTriggerRect(wrapper, { top: 100, bottom: 140, left: 50, right: 250 });

      wrapper.vm.handleBeforeToggle(Object.assign(new Event("beforetoggle"), { newState: "open" }));
      expect(wrapper.vm.needsPositioning).toBe(true);
      expect(wrapper.vm.positionStyle).toEqual({
        "--_anchor-top": "100px",
        "--_anchor-bottom": "140px",
        "--_anchor-left": "50px",
        "--_anchor-right": "250px",
        "--_anchor-top-inverse": "700px",
        "--_anchor-bottom-inverse": "660px",
        "--_anchor-left-inverse": "950px",
        "--_anchor-right-inverse": "750px",
      });
    });

    it("ignores beforetoggle when closing", async () => {
      const wrapper = await mountHost().mounted;
      mockTriggerRect(wrapper, { top: 100, bottom: 140, left: 50, right: 250 });

      wrapper.vm.handleBeforeToggle(Object.assign(new Event("beforetoggle"), { newState: "closed" }));
      expect(wrapper.vm.positionStyle).toMatchObject({ "--_anchor-top": "0px" });
    });

    it.each([
      ["bottom", { top: 100, bottom: 140, left: 400, right: 450 }, "bottom"],
      ["bottom", { top: 700, bottom: 740, left: 400, right: 450 }, "top"],
      ["top", { top: 300, bottom: 340, left: 400, right: 450 }, "top"],
      ["top", { top: 100, bottom: 140, left: 400, right: 450 }, "bottom"],
      ["right", { top: 300, bottom: 340, left: 400, right: 450 }, "right"],
      ["right", { top: 300, bottom: 340, left: 850, right: 950 }, "left"],
      ["left", { top: 300, bottom: 340, left: 400, right: 450 }, "left"],
      ["left", { top: 300, bottom: 340, left: 50, right: 100 }, "right"],
    ] as const)("prefers %s and resolves to %s for %o", async (side, rect, expected) => {
      const wrapper = await openWith(side, rect);
      expect(wrapper.vm.popoverPlacement).toBe(expected);
    });

    it("keeps the preferred side when neither side has room", async () => {
      const wrapper = await openWith("bottom", { top: 100, bottom: 140, left: 50, right: 250 }, { width: 100, height: 900 });
      expect(wrapper.vm.popoverPlacement).toBe("bottom");
    });
  });
});
