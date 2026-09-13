import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import MasonryGrid from "../MasonryGrid.vue";

describe("MasonryGrid", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(MasonryGrid);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders as div by default", async () => {
    const wrapper = await mountSuspended(MasonryGrid);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders a different tag when provided", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { tag: "section" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("renders slot content", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      slots: {
        "item-1": "<div>Item 1</div>",
      },
    });
    expect(wrapper.text()).toContain("Item 1");
  });

  it("renders each provided slot as its own masonry-grid-item", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      slots: {
        "item-1": "<div>Item 1</div>",
        "item-2": "<div>Item 2</div>",
        "item-3": "<div>Item 3</div>",
      },
    });
    const items = wrapper.findAll(".masonry-grid-item");
    expect(items).toHaveLength(3);
    expect(items[0]!.text()).toBe("Item 1");
    expect(items[1]!.text()).toBe("Item 2");
    expect(items[2]!.text()).toBe("Item 3");
  });

  it("renders no items when no slots are provided", async () => {
    const wrapper = await mountSuspended(MasonryGrid);
    expect(wrapper.findAll(".masonry-grid-item")).toHaveLength(0);
  });

  it("applies itemMinWidth and gap as inline CSS custom properties", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { itemMinWidth: 250, gap: 2, unit: "em" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_item-min-width")).toBe("250px");
    expect(style.getPropertyValue("--_masonry-grid-gap")).toBe("2em");
  });

  it("applies styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });
});
