import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import StepperList from "../StepperList.vue";

describe("StepperList", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 3 },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (ul, 3 items)", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { tag: "ul", itemCount: 3 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (ol, 5 items)", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { tag: "ol", itemCount: 5 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: {
        itemCount: 2,
        styleClassPassthrough: ["custom-class", "another-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with indicator slots", async () => {
    const wrapper = await mountSuspended(StepperList, {
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
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.element.tagName).toBe("UL");
  });

  it("renders as <ul> when tag='ul'", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { tag: "ul", itemCount: 1 },
    });
    expect(wrapper.element.tagName).toBe("UL");
  });

  it("renders as <ol> when tag='ol'", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { tag: "ol", itemCount: 1 },
    });
    expect(wrapper.element.tagName).toBe("OL");
  });

  // ─── Item count ──────────────────────────────────────────────────────────

  it("renders the correct number of <li> elements", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 4 },
    });
    expect(wrapper.findAll("li").length).toBe(4);
  });

  it("renders zero <li> elements when itemCount is 0", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 0 },
    });
    expect(wrapper.findAll("li").length).toBe(0);
  });

  // ─── Base classes ────────────────────────────────────────────────────────

  it("always has the indicator-list class", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.classes()).toContain("stepper-list");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, styleClassPassthrough: "my-class" },
    });
    expect(wrapper.classes()).toContain("my-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: {
        itemCount: 1,
        styleClassPassthrough: ["class-a", "class-b"],
      },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("renders cleanly with no styleClassPassthrough prop", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    // Only the base class should be present (and any passthrough-derived ones)
    expect(wrapper.classes()).toContain("stepper-list");
  });

  // ─── Slot: item-N ────────────────────────────────────────────────────────

  it("renders item slot content inside each <li>", async () => {
    const wrapper = await mountSuspended(StepperList, {
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
    const wrapper = await mountSuspended(StepperList, {
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
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
      slots: {
        "indicator-0": '<span class="indicator-icon">✓</span>',
      },
    });
    const firstItem = wrapper.findAll("li")[0];
    expect(firstItem?.find(".stepper-list__indicator-custom").exists()).toBe(true);
  });

  it("renders the counter wrapper when no indicator slot is provided", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 2 },
    });
    const items = wrapper.findAll("li");
    expect(items[0]?.find(".stepper-list__indicator-counter").exists()).toBe(true);
    expect(items[0]?.find(".stepper-list__indicator-custom").exists()).toBe(false);
  });

  it("renders indicator slot content inside the custom indicator wrapper", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
      slots: {
        "indicator-0": '<span class="indicator-icon">✓</span>',
      },
    });
    const indicator = wrapper.find(".stepper-list__indicator-custom");
    expect(indicator.find(".indicator-icon").exists()).toBe(true);
  });

  it("only items with indicator slots receive has-indicator; others do not", async () => {
    const wrapper = await mountSuspended(StepperList, {
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
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.classes()).toContain("has-connectors");
  });

  it("has has-connectors class when connected is true", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, connected: true },
    });
    expect(wrapper.classes()).toContain("has-connectors");
  });

  it("does not have has-connectors class when connected is false", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, connected: false },
    });
    expect(wrapper.classes()).not.toContain("has-connectors");
  });

  // ─── indicatorAlignment ───────────────────────────────────────────────────

  it("applies indicator-top class by default", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-top");
  });

  it("applies indicator-center class when indicatorAlignment is center", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, indicatorAlignment: "center" },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-center");
  });

  // ─── indicatorVariant ─────────────────────────────────────────────────────

  it("applies indicator-disc class by default", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1 },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-disc");
  });

  it("applies indicator-circle class when indicatorVariant is circle", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, indicatorVariant: "circle" },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-circle");
  });

  it("applies indicator-square class when indicatorVariant is square", async () => {
    const wrapper = await mountSuspended(StepperList, {
      props: { itemCount: 1, indicatorVariant: "square" },
    });
    expect(wrapper.find("li")?.classes()).toContain("indicator-square");
  });

  // ─── Combined props ───────────────────────────────────────────────────────

  it("renders correctly with all props and slots combined", async () => {
    const wrapper = await mountSuspended(StepperList, {
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
