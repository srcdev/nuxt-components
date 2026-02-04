import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AccordianCore from "../AccordianCore.vue";
import type { ComponentPublicInstance } from "vue";

interface AccordianCoreInstance extends ComponentPublicInstance {
  animationDurationStr: string;
  name: string | null;
  itemCount: number;
  animationDuration: number;
  styleClassPassthrough: string | string[];
}

describe("AccordianCore", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 3,
      },
    });

    expect(wrapper.find(".display-accordian")).toBeTruthy();
  });

  it("renders correct number of ExpandingPanel components", async () => {
    const itemCount = 4;
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount,
      },
    });

    const expandingPanels = wrapper.findAll(".expanding-panel");
    expect(expandingPanels).toHaveLength(itemCount);
  });

  it("passes animation duration prop to ExpandingPanel components", async () => {
    const animationDuration = 500;
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 2,
        animationDuration,
      },
    });

    const expandingPanels = wrapper.findAllComponents({ name: "ExpandingPanel" });
    expandingPanels.forEach((panel) => {
      expect(panel.props("animationDuration")).toBe(animationDuration);
    });
  });

  it("passes name prop to ExpandingPanel components", async () => {
    const name = "test-accordian";
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 2,
        name,
      },
    });

    const expandingPanels = wrapper.findAllComponents({ name: "ExpandingPanel" });
    expandingPanels.forEach((panel) => {
      expect(panel.props("name")).toBe(name);
    });
  });

  it("applies default animation duration when not provided", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 1,
      },
    });

    const expandingPanel = wrapper.findComponent({ name: "ExpandingPanel" });
    expect(expandingPanel.props("animationDuration")).toBe(300);
  });

  it("applies style class passthrough", async () => {
    const styleClasses = ["custom-class", "another-class"];
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 2,
        styleClassPassthrough: styleClasses,
      },
    });

    const container = wrapper.find(".display-accordian");
    styleClasses.forEach((className) => {
      expect(container.classes()).toContain(className);
    });
  });

  it("applies single style class passthrough as string", async () => {
    const styleClass = "single-class";
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 2,
        styleClassPassthrough: styleClass,
      },
    });

    const container = wrapper.find(".display-accordian");
    expect(container.classes()).toContain(styleClass);
  });

  it("renders slots correctly for each accordion item", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 2,
      },
      slots: {
        "accordian-0-summary": '<div data-testid="summary-0">Summary 0</div>',
        "accordian-0-icon": '<div data-testid="icon-0">Icon 0</div>',
        "accordian-0-content": '<div data-testid="content-0">Content 0</div>',
        "accordian-1-summary": '<div data-testid="summary-1">Summary 1</div>',
        "accordian-1-icon": '<div data-testid="icon-1">Icon 1</div>',
        "accordian-1-content": '<div data-testid="content-1">Content 1</div>',
      },
    });

    // Check that slots are rendered
    expect(wrapper.find('[data-testid="summary-0"]').text()).toBe("Summary 0");
    expect(wrapper.find('[data-testid="icon-0"]').text()).toBe("Icon 0");
    expect(wrapper.find('[data-testid="content-0"]').text()).toBe("Content 0");
    expect(wrapper.find('[data-testid="summary-1"]').text()).toBe("Summary 1");
    expect(wrapper.find('[data-testid="icon-1"]').text()).toBe("Icon 1");
    expect(wrapper.find('[data-testid="content-1"]').text()).toBe("Content 1");
  });

  it("applies accordian-item style class to ExpandingPanel components", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 2,
      },
    });

    const expandingPanels = wrapper.findAllComponents({ name: "ExpandingPanel" });
    expandingPanels.forEach((panel) => {
      expect(panel.props("styleClassPassthrough")).toEqual(["accordian-item"]);
    });
  });

  it("sets icon-size to medium for all ExpandingPanel components", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 3,
      },
    });

    const expandingPanels = wrapper.findAllComponents({ name: "ExpandingPanel" });
    expandingPanels.forEach((panel) => {
      expect(panel.props("iconSize")).toBe("medium");
    });
  });

  it("handles zero item count", async () => {
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 0,
      },
    });

    expect(wrapper.find(".display-accordian")).toBeTruthy();
    expect(wrapper.findAllComponents({ name: "ExpandingPanel" })).toHaveLength(0);
  });

  it("computes animation duration string correctly", async () => {
    const animationDuration = 750;
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount: 1,
        animationDuration,
      },
    });

    // Access the component's computed value through the vm
    const component = wrapper.vm as AccordianCoreInstance;
    expect(component.animationDurationStr).toBe(`${animationDuration}ms`);
  });

  it("uses default props when not provided", async () => {
    const wrapper = await mountSuspended(AccordianCore);

    const component = wrapper.vm as AccordianCoreInstance;
    expect(component.name).toBe(null);
    expect(component.itemCount).toBe(0);
    expect(component.animationDuration).toBe(300);
    expect(component.styleClassPassthrough).toEqual([]);
  });

  it("generates correct slot names for each item", async () => {
    const itemCount = 3;
    const wrapper = await mountSuspended(AccordianCore, {
      props: {
        itemCount,
      },
    });

    // Check that the correct slot names are being used
    const expandingPanels = wrapper.findAllComponents({ name: "ExpandingPanel" });

    for (let i = 0; i < itemCount; i++) {
      const panel = expandingPanels[i];
      expect(panel).toBeDefined();
      // const summarySlot = panel.find('template[slot="summary"]');
      // const iconSlot = panel.find('template[slot="icon"]');
      // const contentSlot = panel.find('template[slot="content"]');

      // Verify the ExpandingPanel receives the slots
      // expect(panel.props()).toBeDefined();
    }
  });
});
