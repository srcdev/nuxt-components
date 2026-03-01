import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AccordianCore from "../AccordianCore.vue";
import type { ComponentPublicInstance } from "vue";

interface AccordianCoreInstance extends ComponentPublicInstance {
  animationDurationStr: string;
  name: string | undefined;
  itemCount: number;
  animationDuration: number;
  styleClassPassthrough: string | string[];
}

describe("AccordianCore", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 3 },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 2 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 3,
        name: "snapshot-accordian",
        animationDuration: 500,
        styleClassPassthrough: ["extra-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with populated slots", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 2 },
      slots: {
        "accordian-0-summary": "<span>Summary 0</span>",
        "accordian-0-icon": "<span>Icon 0</span>",
        "accordian-0-content": "<span>Content 0</span>",
        "accordian-1-summary": "<span>Summary 1</span>",
        "accordian-1-icon": "<span>Icon 1</span>",
        "accordian-1-content": "<span>Content 1</span>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correctly with zero items", async () => {
    const wrapper = await mountSuspended(AccordianCore);
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders the root .display-accordian element", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 1 },
    });
    expect(wrapper.find(".display-accordian").exists()).toBe(true);
  });

  // ─── Item count ───────────────────────────────────────────────────────────

  it("renders the correct number of ExpandingPanel components", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 4 },
    });
    expect(wrapper.findAll(".expanding-panel")).toHaveLength(4);
  });

  it("renders no ExpandingPanel components when itemCount is 0", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 0 },
    });
    expect(wrapper.findAllComponents({ name: "ExpandingPanel" })).toHaveLength(0);
  });

  it("renders no ExpandingPanel components when itemCount is omitted", async () => {
    const wrapper = await mountSuspended(AccordianCore);
    expect(wrapper.findAllComponents({ name: "ExpandingPanel" })).toHaveLength(0);
  });

  // ─── Props forwarded to ExpandingPanel ───────────────────────────────────

  it("forwards animationDuration to every ExpandingPanel", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 3, animationDuration: 500 },
    });
    wrapper.findAllComponents({ name: "ExpandingPanel" }).forEach((panel) => {
      expect(panel.props("animationDuration")).toBe(500);
    });
  });

  it("forwards name to every ExpandingPanel", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 2, name: "test-accordian" },
    });
    wrapper.findAllComponents({ name: "ExpandingPanel" }).forEach((panel) => {
      expect(panel.props("name")).toBe("test-accordian");
    });
  });

  it("passes accordian-item styleClassPassthrough to every ExpandingPanel", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 2 },
    });
    wrapper.findAllComponents({ name: "ExpandingPanel" }).forEach((panel) => {
      expect(panel.props("styleClassPassthrough")).toEqual(["accordian-item"]);
    });
  });

  // ─── Default prop values ──────────────────────────────────────────────────

  it("defaults animationDuration to 300 on ExpandingPanel when not provided", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 1 },
    });
    const panel = wrapper.findComponent({ name: "ExpandingPanel" });
    expect(panel.props("animationDuration")).toBe(300);
  });

  it("uses correct default prop values on the component instance", async () => {
    const wrapper = await mountSuspended(AccordianCore);
    const vm = wrapper.vm as AccordianCoreInstance;
    expect(vm.name).toBeUndefined();
    expect(vm.itemCount).toBe(0);
    expect(vm.animationDuration).toBe(300);
    expect(vm.styleClassPassthrough).toEqual([]);
  });

  // ─── Computed ─────────────────────────────────────────────────────────────

  it("computes animationDurationStr as '<value>ms'", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 1, animationDuration: 750 },
    });
    const vm = wrapper.vm as AccordianCoreInstance;
    expect(vm.animationDurationStr).toBe("750ms");
  });

  it("computes animationDurationStr using the default duration", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 1 },
    });
    const vm = wrapper.vm as AccordianCoreInstance;
    expect(vm.animationDurationStr).toBe("300ms");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a styleClassPassthrough array to the root element", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 1,
        styleClassPassthrough: ["custom-class", "another-class"],
      },
    });
    const root = wrapper.find(".display-accordian");
    expect(root.classes()).toContain("custom-class");
    expect(root.classes()).toContain("another-class");
  });

  it("applies a single styleClassPassthrough string to the root element", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 1, styleClassPassthrough: "single-class" },
    });
    expect(wrapper.find(".display-accordian").classes()).toContain("single-class");
  });

  // ─── Slots ────────────────────────────────────────────────────────────────

  it("renders summary, icon, and content slot content for each item", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 2 },
      slots: {
        "accordian-0-summary": '<div data-testid="summary-0">Summary 0</div>',
        "accordian-0-icon": '<div data-testid="icon-0">Icon 0</div>',
        "accordian-0-content": '<div data-testid="content-0">Content 0</div>',
        "accordian-1-summary": '<div data-testid="summary-1">Summary 1</div>',
        "accordian-1-icon": '<div data-testid="icon-1">Icon 1</div>',
        "accordian-1-content": '<div data-testid="content-1">Content 1</div>',
      },
    });

    for (let i = 0; i < 2; i++) {
      expect(wrapper.find(`[data-testid="summary-${i}"]`).text()).toBe(`Summary ${i}`);
      expect(wrapper.find(`[data-testid="icon-${i}"]`).text()).toBe(`Icon ${i}`);
      expect(wrapper.find(`[data-testid="content-${i}"]`).text()).toBe(`Content ${i}`);
    }
  });

  it("renders slot content in the correct panel (slots are not mixed up)", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: { itemCount: 3 },
      slots: {
        "accordian-0-summary": "<span>Alpha</span>",
        "accordian-1-summary": "<span>Beta</span>",
        "accordian-2-summary": "<span>Gamma</span>",
      },
    });
    const panels = wrapper.findAllComponents({ name: "ExpandingPanel" });
    expect(panels[0]?.text()).toContain("Alpha");
    expect(panels[1]?.text()).toContain("Beta");
    expect(panels[2]?.text()).toContain("Gamma");
  });
});
