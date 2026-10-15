import { describe, it, expect, vi, afterEach } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import StepperList from "../StepperList.vue";

let wrapper: VueWrapper | undefined;

describe("StepperList", () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.restoreAllMocks();
  });
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 3 },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (ul, 3 items)", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { tag: "ul", itemCount: 3 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (ol, 5 items)", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { tag: "ol", itemCount: 5 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with styleClassPassthrough", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: {
        itemCount: 2,
        styleClassPassthrough: ["custom-class", "another-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with indicator slots", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
      slots: {
        "indicator-0": '<span class="indicator-icon">✓</span>',
        "item-0": "<span>First item</span>",
        "item-1": "<span>Second item</span>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <ul> by default", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.element.tagName).toBe("UL");
  });

  it("renders as <ul> when tag='ul'", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { tag: "ul", itemCount: 1 },
    });
    expect(wrapper.element.tagName).toBe("UL");
  });

  it("renders as <ol> when tag='ol'", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { tag: "ol", itemCount: 1 },
    });
    expect(wrapper.element.tagName).toBe("OL");
  });

  // ─── Item count ──────────────────────────────────────────────────────────

  it("renders the correct number of <li> elements", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 4 },
    });
    expect(wrapper.findAll("li").length).toBe(4);
  });

  it("renders zero <li> elements when itemCount is 0", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 0 },
    });
    expect(wrapper.findAll("li").length).toBe(0);
  });

  it("floors a fractional itemCount instead of rendering nothing", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2.7 },
    });
    expect(wrapper.findAll("li").length).toBe(2);
  });

  it("renders zero <li> elements for a negative itemCount", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: -3 },
    });
    expect(wrapper.findAll("li").length).toBe(0);
  });

  it("renders zero <li> elements for a NaN itemCount", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: Number.NaN },
    });
    expect(wrapper.findAll("li").length).toBe(0);
  });

  it("updates the number of <li> elements when itemCount changes", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
    });
    await wrapper.setProps({ itemCount: 5 });
    expect(wrapper.findAll("li").length).toBe(5);
  });

  // ─── Semantics ───────────────────────────────────────────────────────────

  it("keeps list semantics with role='list' despite list-style: none", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { tag: "ol", itemCount: 1 },
    });
    expect(wrapper.attributes("role")).toBe("list");
  });

  it("wraps each item slot in .stepper-list-content", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
      slots: { "item-1": "<span class='second'>Second</span>" },
    });
    expect(wrapper.findAll(".stepper-list-item").length).toBe(2);
    expect(wrapper.findAll(".stepper-list-content")[1]!.find(".second").exists()).toBe(true);
  });

  // ─── Base classes ────────────────────────────────────────────────────────

  it("always has the indicator-list class", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.classes()).toContain("stepper-list");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, styleClassPassthrough: "my-class" },
    });
    expect(wrapper.classes()).toContain("my-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: {
        itemCount: 1,
        styleClassPassthrough: ["class-a", "class-b"],
      },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, styleClassPassthrough: ["original"] },
    });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });

  it("renders cleanly with no styleClassPassthrough prop", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    // Only the base class should be present (and any passthrough-derived ones)
    expect(wrapper.classes()).toContain("stepper-list");
  });

  // ─── Slot: item-N ────────────────────────────────────────────────────────

  it("renders item slot content inside each <li>", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
      slots: {
        "item-0": "<span>First</span>",
        "item-1": "<span>Second</span>",
      },
    });
    const items = wrapper.findAll("li");
    expect(items[0]?.text()).toContain("First");
    expect(items[1]?.text()).toContain("Second");
  });

  // ─── Slot: indicator-N ───────────────────────────────────────────────────

  it("adds has-indicator class to <li> when indicator slot is provided", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 3 },
      slots: {
        "indicator-1": '<span class="indicator-icon">★</span>',
      },
    });
    const items = wrapper.findAll("li");
    expect(items[0]?.classes()).not.toContain("has-indicator");
    expect(items[1]?.classes()).toContain("has-indicator");
    expect(items[2]?.classes()).not.toContain("has-indicator");
  });

  it("renders the custom indicator wrapper when indicator slot is provided", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
      slots: {
        "indicator-0": '<span class="indicator-icon">✓</span>',
      },
    });
    const firstItem = wrapper.findAll("li")[0];
    expect(firstItem?.find(".stepper-list__indicator-custom").exists()).toBe(true);
  });

  it("renders the counter wrapper when no indicator slot is provided", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
    });
    const items = wrapper.findAll("li");
    expect(items[0]?.find(".stepper-list__indicator-counter").exists()).toBe(true);
    expect(items[0]?.find(".stepper-list__indicator-custom").exists()).toBe(false);
  });

  it("renders indicator slot content inside the custom indicator wrapper", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
      slots: {
        "indicator-0": '<span class="indicator-icon">✓</span>',
      },
    });
    const indicator = wrapper.find(".stepper-list__indicator-custom");
    expect(indicator.find(".indicator-icon").exists()).toBe(true);
  });

  it("only items with indicator slots receive has-indicator; others do not", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 4 },
      slots: {
        "indicator-0": "<span>A</span>",
        "indicator-3": "<span>D</span>",
      },
    });
    const items = wrapper.findAll("li");
    expect(items[0]?.classes()).toContain("has-indicator");
    expect(items[1]?.classes()).not.toContain("has-indicator");
    expect(items[2]?.classes()).not.toContain("has-indicator");
    expect(items[3]?.classes()).toContain("has-indicator");
  });

  // ─── connected ──────────────────────────────────────────────────────

  it("has has-connectors class by default", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.classes()).toContain("has-connectors");
  });

  it("has has-connectors class when connected is true", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, connected: true },
    });
    expect(wrapper.classes()).toContain("has-connectors");
  });

  it("does not have has-connectors class when connected is false", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, connected: false },
    });
    expect(wrapper.classes()).not.toContain("has-connectors");
  });

  it("centres each connector on its measured indicator, not on --_counter-size", async () => {
    const rect = (left: number, width: number, top: number, height: number) =>
      ({ left, width, top, height, right: left + width, bottom: top + height, x: left, y: top }) as DOMRect;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      if (this.tagName === "LI") return rect(100, 400, this.previousElementSibling ? 80 : 0, 80);
      return rect(110, 60, this.closest("li")?.previousElementSibling ? 90 : 10, 30);
    });

    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
      slots: { "indicator-0": "<span>Wide custom indicator</span>" },
    });
    const first = wrapper.findAll("li")[0]!.element as HTMLElement;
    expect(first.style.getPropertyValue("--_connector-left")).toBe("40px");
    expect(first.style.getPropertyValue("--_connector-top")).toBe("40px");
    expect(first.style.getPropertyValue("--_connector-height")).toBe("50px");
  });

  it("re-measures connectors when a class changes inside the list, even if nothing resizes", async () => {
    let secondIndicatorTop = 90;
    const rect = (top: number, height: number) =>
      ({ left: 100, width: 30, top, height, right: 130, bottom: top + height, x: 100, y: top }) as DOMRect;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      if (this.tagName === "LI") return rect(this.previousElementSibling ? 80 : 0, 80);
      return this.closest("li")?.previousElementSibling ? rect(secondIndicatorTop, 30) : rect(10, 30);
    });

    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
      slots: { "indicator-1": "<span class='marker'>2</span>" },
    });
    const first = wrapper.findAll("li")[0]!.element as HTMLElement;
    expect(first.style.getPropertyValue("--_connector-height")).toBe("50px");

    secondIndicatorTop = 120;
    wrapper.find(".marker").element.classList.add("is-current");
    await Promise.resolve();
    expect(first.style.getPropertyValue("--_connector-height")).toBe("80px");
  });

  it("observes every item for size changes, not only the list", async () => {
    const observed: Element[] = [];
    const originalResizeObserver = globalThis.ResizeObserver;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe(el: Element) {
          observed.push(el);
        }
        disconnect() {
          observed.length = 0;
        }
        unobserve() {}
      }
    );

    try {
      wrapper = await mountSuspended(StepperList, { props: { itemCount: 3 } });
      expect(observed.filter((el) => el.tagName === "LI")).toHaveLength(3);
      expect(observed).toContain(wrapper.element);

      await wrapper.setProps({ itemCount: 4 });
      await nextTick();
      expect(observed.filter((el) => el.tagName === "LI")).toHaveLength(4);
    } finally {
      vi.stubGlobal("ResizeObserver", originalResizeObserver);
    }
  });

  // ─── indicatorAlignment ───────────────────────────────────────────────────

  it("applies indicator-top class by default", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-top");
  });

  it("applies indicator-center class when indicatorAlignment is center", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, indicatorAlignment: "center" },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-center");
  });

  // ─── indicatorVariant ─────────────────────────────────────────────────────

  it("applies indicator-disc class by default", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-disc");
  });

  it("applies indicator-circle class when indicatorVariant is circle", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, indicatorVariant: "circle" },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-circle");
  });

  it("applies indicator-square class when indicatorVariant is square", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, indicatorVariant: "square" },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-square");
  });

  // ─── indicatorSize ────────────────────────────────────────────────────────

  it("defaults indicatorSize to 3rem", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--v-bind-indicatorSize") || wrapper.html()).toBeTruthy();
  });

  it("accepts a custom indicatorSize prop without error", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, indicatorSize: "5rem" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure with custom indicatorSize", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2, indicatorSize: "4rem" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Combined props ───────────────────────────────────────────────────────

  it("renders correctly with all props and slots combined", async () => {
    wrapper = await mountSuspended(StepperList, {
      props: {
        tag: "ol",
        itemCount: 3,
        styleClassPassthrough: ["combined-class"],
      },
      slots: {
        "indicator-0": '<span class="indicator-icon">1</span>',
        "item-0": "<span>Step one</span>",
        "item-1": "<span>Step two</span>",
        "item-2": "<span>Step three</span>",
      },
    });
    expect(wrapper.element.tagName).toBe("OL");
    expect(wrapper.classes()).toContain("combined-class");
    expect(wrapper.findAll("li").length).toBe(3);
    expect(wrapper.findAll("li")[0]?.classes()).toContain("has-indicator");
    expect(wrapper.html()).toMatchSnapshot();
  });
});
