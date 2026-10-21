import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import GridStack from "../GridStack.vue";

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountComponent = async (options: Parameters<typeof mountSuspended<typeof GridStack>>[1] = {}) => {
  const wrapper = await mountSuspended(GridStack, options);
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("GridStack", () => {
  it("mounts without error", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders as div by default", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders a different tag when provided", async () => {
    const wrapper = await mountComponent({
      props: { tag: "section" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("renders slot content", async () => {
    const wrapper = await mountComponent({
      slots: {
        "layer-1": "<div>Layer 1</div>",
      },
    });
    expect(wrapper.text()).toContain("Layer 1");
  });

  it("renders multiple slots as stacked layers", async () => {
    const wrapper = await mountComponent({
      slots: {
        "layer-1": "<div>Layer 1</div>",
        "layer-2": "<div>Layer 2</div>",
        "layer-3": "<div>Layer 3</div>",
      },
    });
    const layers = wrapper.findAll(".grid-stack__layer");
    expect(layers).toHaveLength(3);
    expect(layers[0]!.text()).toBe("Layer 1");
    expect(layers[1]!.text()).toBe("Layer 2");
    expect(layers[2]!.text()).toBe("Layer 3");
  });

  it("renders no layers when no slots are provided", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.findAll(".grid-stack__layer")).toHaveLength(0);
  });

  it("applies styleClassPassthrough", async () => {
    const wrapper = await mountComponent({
      props: { styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes", async () => {
    const wrapper = await mountComponent({
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountComponent({
      props: { styleClassPassthrough: ["original"] },
    });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });

  it("always has the grid-stack class", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.classes()).toContain("grid-stack");
  });

  it("passes a consumer aria-label through to the root", async () => {
    const wrapper = await mountComponent({
      props: { tag: "section" },
      attrs: { "aria-label": "Hero" },
    });
    expect(wrapper.attributes("aria-label")).toBe("Hero");
    expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
  });

  it("renders the base layer first so later slots paint on top", async () => {
    const wrapper = await mountComponent({
      slots: {
        "layer-1": "<div class='base'>Base</div>",
        "layer-2": "<div class='overlay'>Overlay</div>",
      },
    });
    const layers = wrapper.findAll(".grid-stack__layer");
    expect(layers[0]!.find(".base").exists()).toBe(true);
    expect(layers[1]!.find(".overlay").exists()).toBe(true);
  });
});
