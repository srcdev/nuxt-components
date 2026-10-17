import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, nextTick } from "vue";
import AlertMask from "../AlertMask.vue";
import type { AlertMaskConfig } from "~/types/components";

interface AlertMaskInstance {
  cfg: {
    backgroundColour: string | undefined;
    borderColour: string | undefined;
    radiusLeft: number;
    radiusRight: number;
    borderLeft: number;
    borderTop: number;
    borderRight: number;
    borderBottom: number;
  };
  contentWidth: number;
  contentHeight: number;
  measured: boolean;
  svgWidth: number;
  svgHeight: number;
  outerPath: string;
  innerPath: string;
}

// Vitest 4: a mock's implementation must be a regular function (not an arrow function) to stay
// constructible via `new`.
const mockResizeObserver = vi.fn(function () {
  return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
});
vi.stubGlobal("ResizeObserver", mockResizeObserver);

const mounted: { unmount: () => void }[] = [];

const mountMask = async (options: Parameters<typeof mountSuspended<typeof AlertMask>>[1] = {}) => {
  const wrapper = await mountSuspended(AlertMask, options);
  mounted.push(wrapper);
  return wrapper;
};

const vmOf = (wrapper: Awaited<ReturnType<typeof mountMask>>) => wrapper.vm as unknown as AlertMaskInstance;

const setContentSize = async (vm: AlertMaskInstance, width: number, height: number) => {
  vm.contentWidth = width;
  vm.contentHeight = height;
  vm.measured = true;
  await nextTick();
};

const numbersIn = (path: string) => (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe("AlertMask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  it("renders the root, decorator and content structure", async () => {
    const wrapper = await mountMask();
    expect(wrapper.find(".alert-mask").exists()).toBe(true);
    expect(wrapper.find(".alert-mask-decorator").exists()).toBe(true);
    expect(wrapper.find(".alert-mask-border").exists()).toBe(true);
    expect(wrapper.find(".alert-mask-background").exists()).toBe(true);
    expect(wrapper.find(".alert-mask-content-slot").exists()).toBe(true);
  });

  it("renders default slot content", async () => {
    const wrapper = await mountMask({ slots: { default: "<p class='test-content'>Alert</p>" } });
    expect(wrapper.find(".test-content").text()).toBe("Alert");
  });

  it("applies passthrough classes and reacts to changes", async () => {
    const wrapper = await mountMask({ props: { styleClassPassthrough: ["one", "two"] } });
    const root = () => wrapper.find(".alert-mask");
    expect(root().classes()).toEqual(expect.arrayContaining(["one", "two"]));

    await wrapper.setProps({ styleClassPassthrough: "three" });
    expect(root().classes()).toContain("three");
    expect(root().classes()).not.toContain("one");
  });

  it("uses default geometry and leaves colours to CSS tokens when no config is given", async () => {
    const vm = vmOf(await mountMask());
    expect(vm.cfg).toEqual({
      backgroundColour: undefined,
      borderColour: undefined,
      radiusLeft: 12,
      radiusRight: 12,
      borderLeft: 8,
      borderTop: 8,
      borderRight: 8,
      borderBottom: 8,
    });
  });

  it("applies a full custom config", async () => {
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
    const vm = vmOf(await mountMask({ props: { config } }));
    expect(vm.cfg).toEqual(config);
  });

  it("sanitises negative and non-finite sizes", async () => {
    const vm = vmOf(
      await mountMask({
        props: { config: { borderLeft: -10, borderTop: Number.NaN, radiusLeft: -4, radiusRight: Infinity } },
      })
    );
    expect(vm.cfg.borderLeft).toBe(0);
    expect(vm.cfg.borderTop).toBe(8);
    expect(vm.cfg.radiusLeft).toBe(0);
    expect(vm.cfg.radiusRight).toBe(12);
  });

  it("only sets fill styles for colours given in config", async () => {
    const plain = await mountMask();
    expect(plain.find(".alert-mask-border").attributes("style")).toBeUndefined();
    expect(plain.find(".alert-mask-background").attributes("style")).toBeUndefined();

    const custom = await mountMask({
      props: { config: { borderColour: "var(--my-border)", backgroundColour: "var(--my-bg)" } },
    });
    expect((custom.find(".alert-mask-border").element as unknown as SVGElement).style.fill).toBe("var(--my-border)");
    expect((custom.find(".alert-mask-background").element as unknown as SVGElement).style.fill).toBe("var(--my-bg)");
  });

  it("gives each instance its own mask id", async () => {
    const Host = defineComponent({
      components: { AlertMask },
      template: "<div><AlertMask>One</AlertMask><AlertMask>Two</AlertMask></div>",
    });
    const wrapper = await mountSuspended(Host);
    mounted.push(wrapper);
    const ids = wrapper.findAll("mask").map((mask) => mask.attributes("id"));
    expect(new Set(ids).size).toBe(2);
    expect(wrapper.findAll(".alert-mask-border")[0]!.attributes("mask")).toBe(`url(#${ids[0]})`);
  });

  it("hides the decorative SVG from assistive technology", async () => {
    const wrapper = await mountMask();
    expect(wrapper.find(".alert-mask-decorator").attributes("aria-hidden")).toBe("true");
  });

  it("insets the content by the configured borders", async () => {
    const wrapper = await mountMask({
      props: { config: { borderLeft: 15, borderTop: 20, borderRight: 25, borderBottom: 30 } },
    });
    const style = (wrapper.find(".alert-mask-content").element as HTMLElement).style;
    expect(style.getPropertyValue("--_inset-left")).toBe("15px");
    expect(style.getPropertyValue("--_inset-top")).toBe("20px");
    expect(style.getPropertyValue("--_inset-right")).toBe("25px");
    expect(style.getPropertyValue("--_inset-bottom")).toBe("30px");
  });

  it("insets the content by the default borders when config omits them", async () => {
    const style = ((await mountMask()).find(".alert-mask-content").element as HTMLElement).style;
    expect(style.getPropertyValue("--_inset-left")).toBe("8px");
    expect(style.getPropertyValue("--_inset-bottom")).toBe("8px");
  });

  it("observes the content and disconnects on unmount", async () => {
    const wrapper = await mountMask({ slots: { default: "<div>Content</div>" } });
    expect(mockResizeObserver).toHaveBeenCalled();
    const observer = mockResizeObserver.mock.results.at(-1)?.value as { disconnect: ReturnType<typeof vi.fn> };
    wrapper.unmount();
    mounted.splice(mounted.indexOf(wrapper), 1);
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("draws nothing until the content is measured", async () => {
    const vm = vmOf(await mountMask());
    vm.measured = false;
    await nextTick();
    expect(vm.svgWidth).toBe(0);
    expect(vm.outerPath).toBe("");
    expect(vm.innerPath).toBe("");
  });

  it("sizes the SVG from the content plus the borders", async () => {
    const wrapper = await mountMask();
    const vm = vmOf(wrapper);
    await setContentSize(vm, 200, 100);
    expect(vm.svgWidth).toBe(216);
    expect(vm.svgHeight).toBe(116);
    expect((wrapper.find(".alert-mask-decorator").element as HTMLElement).style.getPropertyValue("--_height")).toBe(
      "116px"
    );
    expect(vm.outerPath).not.toBe("");
    expect(vm.innerPath).not.toBe("");
  });

  it("recomputes the size when the border config changes without a content resize", async () => {
    const wrapper = await mountMask();
    const vm = vmOf(wrapper);
    await setContentSize(vm, 200, 100);

    await wrapper.setProps({ config: { borderTop: 30, borderBottom: 30 } });
    expect(vm.svgHeight).toBe(160);
  });

  it("clamps radii larger than the box so the path stays inside it", async () => {
    const wrapper = await mountMask({ props: { config: { radiusLeft: 500, radiusRight: 500 } } });
    const vm = vmOf(wrapper);
    await setContentSize(vm, 200, 40);

    const outer = numbersIn(vm.outerPath);
    expect(Math.min(...outer)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...outer)).toBeLessThanOrEqual(216);
    const inner = numbersIn(vm.innerPath);
    expect(Math.min(...inner)).toBeGreaterThanOrEqual(0);
  });

  it("drops the inner cut-out when the borders fill the whole box", async () => {
    const wrapper = await mountMask({ props: { config: { borderLeft: 100, borderRight: 100 } } });
    const vm = vmOf(wrapper);
    await setContentSize(vm, 0, 40);
    expect(vm.outerPath).not.toBe("");
    expect(vm.innerPath).toBe("");
  });
});
