import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, nextTick, ref } from "vue";
import { useTooltipsGuide } from "../useTooltips";
import DisplayTooltipDefined from "~/components/02.molecules/display-tooltip-defined/DisplayTooltipDefined.vue";

const flush = async () => {
  for (let i = 0; i < 5; i++) await nextTick();
};

const mountGuide = () =>
  mountSuspended(
    defineComponent({
      setup() {
        const containerRef = ref<HTMLElement | null>(null);
        const guide = useTooltipsGuide(containerRef, { autoStart: false, startDelay: 0 });
        return { containerRef, guide };
      },
      render() {
        return h("div", { ref: "containerRef" }, [
          h(DisplayTooltipDefined, { tooltipId: "one", contentText: { tooltipTitle: { tag: "h4", text: "One" } } }),
          h(DisplayTooltipDefined, { tooltipId: "two", contentText: { tooltipTitle: { tag: "h4", text: "Two" } } }),
        ]);
      },
    }),
    { attachTo: document.body }
  );

describe("useTooltipsGuide without the Popover API", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "showPopover", { value: undefined, writable: true, configurable: true });
  });

  afterEach(() => {
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
    document.body.innerHTML = "";
  });

  it("steps through each tooltip as its close button is clicked", async () => {
    const wrapper = await mountGuide();
    const vm = wrapper.vm as unknown as { guide: ReturnType<typeof useTooltipsGuide> };
    const popovers = () => wrapper.findAll(".display-tooltip-popover");

    vm.guide.initializePopovers();
    void vm.guide.startGuide();
    await flush();
    expect(popovers()[0]!.classes()).toContain("display-tooltip-popover-open");

    await wrapper.findAll(".display-tooltip-close-button")[0]!.trigger("click");
    await flush();
    expect(popovers()[0]!.classes()).not.toContain("display-tooltip-popover-open");
    expect(popovers()[1]!.classes()).toContain("display-tooltip-popover-open");
    expect(vm.guide.currentTooltipIndex.value).toBe(1);
  });

  it("stopGuide closes the open tooltip without calling Popover API methods", async () => {
    const wrapper = await mountGuide();
    const vm = wrapper.vm as unknown as { guide: ReturnType<typeof useTooltipsGuide> };

    vm.guide.initializePopovers();
    void vm.guide.startGuide();
    await flush();

    expect(() => vm.guide.stopGuide()).not.toThrow();
    await flush();
    expect(wrapper.find(".display-tooltip-popover-open").exists()).toBe(false);
    expect(vm.guide.isGuideRunning.value).toBe(false);
  });
});
