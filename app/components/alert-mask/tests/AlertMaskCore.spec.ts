import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AlertMaskCore from "../AlertMaskCore.vue";
import type { AlertMaskConfig } from "../../../types/components/alert-mask-core.d";

// Type interface for AlertMaskCore component instance
interface AlertMaskCoreInstance {
  cfg: {
    backgroundColour: string;
    borderColour: string;
    radiusLeft: number;
    radiusRight: number;
    borderLeft: number;
    borderTop: number;
    borderRight: number;
    borderBottom: number;
  };
  alertContentRef: HTMLElement | null;
  svgWidth: number;
  svgHeight: number;
  outerPath: string;
  innerPath: string;
}

// Mock ResizeObserver
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", mockResizeObserver);

describe("AlertMaskCore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(AlertMaskCore);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders base structure correctly", async () => {
    const wrapper = await mountSuspended(AlertMaskCore);

    expect(wrapper.find(".alert-mask-core").exists()).toBe(true);
    expect(wrapper.find(".alert-mask-decorator").exists()).toBe(true);
    expect(wrapper.find(".alert-mask-content").exists()).toBe(true);
    expect(wrapper.find(".alert-mask-content-slot").exists()).toBe(true);
  });

  it("renders default slot content", async () => {
    const wrapper = await mountSuspended(AlertMaskCore, {
      slots: {
        default: "<p>Test alert content</p>",
      },
    });

    expect(wrapper.find(".alert-mask-content-slot p").text()).toBe("Test alert content");
  });

  it("applies style class passthrough correctly", async () => {
    const wrapper = await mountSuspended(AlertMaskCore, {
      props: {
        styleClassPassthrough: ["custom-class", "another-class"],
      },
    });

    const alertMask = wrapper.find(".alert-mask-core");
    expect(alertMask.classes()).toContain("custom-class");
    expect(alertMask.classes()).toContain("another-class");
  });

  it("applies style class passthrough as string", async () => {
    const wrapper = await mountSuspended(AlertMaskCore, {
      props: {
        styleClassPassthrough: "single-class",
      },
    });

    const alertMask = wrapper.find(".alert-mask-core");
    expect(alertMask.classes()).toContain("single-class");
  });

  it("uses default configuration when no config provided", async () => {
    const wrapper = await mountSuspended(AlertMaskCore);

    // Check that computed config uses defaults
    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;
    expect(vm.cfg.backgroundColour).toBe("rgba(0,0,0,0.25)");
    expect(vm.cfg.borderColour).toBe("var(--orange-8)");
    expect(vm.cfg.radiusLeft).toBe(12);
    expect(vm.cfg.radiusRight).toBe(12);
    expect(vm.cfg.borderLeft).toBe(8);
    expect(vm.cfg.borderTop).toBe(8);
    expect(vm.cfg.borderRight).toBe(8);
    expect(vm.cfg.borderBottom).toBe(8);
  });

  it("applies custom configuration correctly", async () => {
    const config: AlertMaskConfig = {
      backgroundColour: "rgba(255,0,0,0.5)",
      borderColour: "#ff0000",
      radiusLeft: 20,
      radiusRight: 15,
      borderLeft: 12,
      borderTop: 10,
      borderRight: 8,
      borderBottom: 6,
    };

    const wrapper = await mountSuspended(AlertMaskCore, {
      props: { config },
    });

    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;
    expect(vm.cfg.backgroundColour).toBe("rgba(255,0,0,0.5)");
    expect(vm.cfg.borderColour).toBe("#ff0000");
    expect(vm.cfg.radiusLeft).toBe(20);
    expect(vm.cfg.radiusRight).toBe(15);
    expect(vm.cfg.borderLeft).toBe(12);
    expect(vm.cfg.borderTop).toBe(10);
    expect(vm.cfg.borderRight).toBe(8);
    expect(vm.cfg.borderBottom).toBe(6);
  });

  it("applies partial configuration with defaults", async () => {
    const config: AlertMaskConfig = {
      backgroundColour: "blue",
      radiusLeft: 25,
    };

    const wrapper = await mountSuspended(AlertMaskCore, {
      props: { config },
    });

    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;
    expect(vm.cfg.backgroundColour).toBe("blue");
    expect(vm.cfg.radiusLeft).toBe(25);
    // Check defaults are maintained for other values
    expect(vm.cfg.borderColour).toBe("var(--orange-8)");
    expect(vm.cfg.radiusRight).toBe(12);
  });

  it("sets up template ref for content element", async () => {
    const wrapper = await mountSuspended(AlertMaskCore, {
      slots: {
        default: "<div>Content</div>",
      },
    });

    await nextTick();
    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;
    expect(vm.alertContentRef).toBeTruthy();
  });

  it("creates SVG with proper structure", async () => {
    const wrapper = await mountSuspended(AlertMaskCore);

    const svg = wrapper.find(".alert-mask-decorator");
    expect(svg.element.tagName).toBe("svg");

    // Check for defs and mask
    expect(wrapper.find("defs").exists()).toBe(true);
    expect(wrapper.find("mask#borderMask").exists()).toBe(true);

    // Check for paths
    const paths = wrapper.findAll("path");
    expect(paths.length).toBe(4); // 2 in mask, 2 visible paths
  });

  it("applies CSS custom properties for content positioning", async () => {
    const config: AlertMaskConfig = {
      borderLeft: 15,
      borderTop: 20,
      borderRight: 25,
      borderBottom: 30,
    };

    const wrapper = await mountSuspended(AlertMaskCore, {
      props: { config },
    });

    const contentEl = wrapper.find(".alert-mask-content");
    const style = (contentEl.element as HTMLElement).style;

    expect(style.getPropertyValue("--insetInlineStart")).toBe("15px");
    expect(style.getPropertyValue("--insetBlockStart")).toBe("20px");
    expect(style.getPropertyValue("--insetInlineEnd")).toBe("25px");
    expect(style.getPropertyValue("--insetBlockEnd")).toBe("30px");
  });

  it("handles zero border values correctly", async () => {
    const config: AlertMaskConfig = {
      borderLeft: 0,
      borderTop: 0,
      borderRight: 0,
      borderBottom: 0,
    };

    const wrapper = await mountSuspended(AlertMaskCore, {
      props: { config },
    });

    const contentEl = wrapper.find(".alert-mask-content");
    const style = (contentEl.element as HTMLElement).style;

    expect(style.getPropertyValue("--insetInlineStart")).toBe("0px");
    expect(style.getPropertyValue("--insetBlockStart")).toBe("0px");
    expect(style.getPropertyValue("--insetInlineEnd")).toBe("0px");
    expect(style.getPropertyValue("--insetBlockEnd")).toBe("0px");
  });

  it("sets up ResizeObserver on mount", async () => {
    await mountSuspended(AlertMaskCore, {
      slots: {
        default: "<div>Content to observe</div>",
      },
    });

    // ResizeObserver should be instantiated
    expect(mockResizeObserver).toHaveBeenCalled();
  });

  it("generates SVG paths when dimensions are available", async () => {
    const wrapper = await mountSuspended(AlertMaskCore);
    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;

    // Set dimensions
    vm.svgWidth = 200;
    vm.svgHeight = 100;

    await nextTick();

    // Check that paths are generated (not empty)
    expect(vm.outerPath).toBeTruthy();
    expect(vm.innerPath).toBeTruthy();
    expect(vm.outerPath.length).toBeGreaterThan(0);
    expect(vm.innerPath.length).toBeGreaterThan(0);
  });

  it("returns empty paths when dimensions are zero", async () => {
    const wrapper = await mountSuspended(AlertMaskCore);
    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;

    // Explicitly set dimensions to zero to test the condition
    vm.svgWidth = 0;
    vm.svgHeight = 0;

    await nextTick();

    expect(vm.outerPath).toBe("");
    expect(vm.innerPath).toBe("");
  });

  it("updates SVG height CSS custom property", async () => {
    const wrapper = await mountSuspended(AlertMaskCore);
    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;

    vm.svgHeight = 150;
    await nextTick();

    const svg = wrapper.find(".alert-mask-decorator");
    const style = (svg.element as HTMLElement).style;
    expect(style.getPropertyValue("--alertHeight")).toBe("150px");
  });

  it("handles empty configuration object", async () => {
    const wrapper = await mountSuspended(AlertMaskCore, {
      props: {
        config: {},
      },
    });

    // Should use all defaults when empty config provided
    const vm = wrapper.vm as unknown as AlertMaskCoreInstance;
    expect(vm.cfg.backgroundColour).toBe("rgba(0,0,0,0.25)");
    expect(vm.cfg.borderColour).toBe("var(--orange-8)");
  });

  it("maintains reactivity with config changes", async () => {
    const wrapper = await mountSuspended(AlertMaskCore, {
      props: {
        config: { backgroundColour: "red" },
      },
    });

    let vm = wrapper.vm as unknown as AlertMaskCoreInstance;
    expect(vm.cfg.backgroundColour).toBe("red");

    // Update props
    await wrapper.setProps({
      config: { backgroundColour: "blue" },
    });

    vm = wrapper.vm as unknown as AlertMaskCoreInstance;
    expect(vm.cfg.backgroundColour).toBe("blue");
  });
});
