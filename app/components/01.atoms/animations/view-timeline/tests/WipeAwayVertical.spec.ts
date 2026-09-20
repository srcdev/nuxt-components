import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import WipeAwayVertical from "../WipeAwayVertical.vue";

describe("WipeAwayVertical", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Root element ────────────────────────────────────────────────────────

  it("renders a <div> as the root element by default", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 2 } });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the tag prop as the root element", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, {
      props: { itemCount: 2, tag: "section" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("always has the wipe-away-vertical class", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 2 } });
    expect(wrapper.classes()).toContain("wipe-away-vertical");
  });

  // ─── Slots ───────────────────────────────────────────────────────────────

  it("renders one sticky-item per itemCount but one fewer scrolling-section (the last item has no wipe of its own)", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    expect(wrapper.findAll(".sticky-item")).toHaveLength(3);
    expect(wrapper.findAll(".scrolling-section")).toHaveLength(2);
  });

  it("assigns each scrolling-section its own grid-row after the leading buffer", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    const sections = wrapper.findAll(".scrolling-section");
    expect((sections[0]!.element as HTMLElement).style.gridRow).toBe("2");
    expect((sections[1]!.element as HTMLElement).style.gridRow).toBe("3");
  });

  it("renders a leading buffer spacer before the first scrolling section", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    expect(wrapper.find(".leading-buffer").exists()).toBe(true);
    expect(wrapper.find(".leading-buffer").attributes("aria-hidden")).toBe("true");
  });

  it("renders a trailing buffer spacer after the last scrolling section", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    expect(wrapper.find(".trailing-buffer").exists()).toBe(true);
    expect(wrapper.find(".trailing-buffer").attributes("aria-hidden")).toBe("true");
    expect((wrapper.find(".trailing-buffer").element as HTMLElement).style.gridRow).toBe("4");
  });

  it("renders named stickyItem-{key} slot content", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, {
      props: { itemCount: 2 },
      slots: {
        "stickyItem-0": "<p class='sticky-0'>First</p>",
        "stickyItem-1": "<p class='sticky-1'>Second</p>",
      },
    });
    expect(wrapper.find(".sticky-0").exists()).toBe(true);
    expect(wrapper.find(".sticky-1").exists()).toBe(true);
  });

  it("renders named scrollingItem-{key} slot content for all but the last item", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, {
      props: { itemCount: 3 },
      slots: {
        "scrollingItem-0": "<p class='scroll-0'>First</p>",
        "scrollingItem-1": "<p class='scroll-1'>Second</p>",
        "scrollingItem-2": "<p class='scroll-2'>Third</p>",
      },
    });
    expect(wrapper.find(".scroll-0").exists()).toBe(true);
    expect(wrapper.find(".scroll-1").exists()).toBe(true);
    expect(wrapper.find(".scroll-2").exists()).toBe(false);
  });

  // ─── Per-item styles ─────────────────────────────────────────────────────

  it("assigns descending z-index across sticky items", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    const items = wrapper.findAll(".sticky-item");
    expect((items[0]!.element as HTMLElement).style.zIndex).toBe("3");
    expect((items[1]!.element as HTMLElement).style.zIndex).toBe("2");
    expect((items[2]!.element as HTMLElement).style.zIndex).toBe("1");
  });

  // Note: `animation-timeline` and `timeline-scope` are experimental CSS
  // properties that jsdom's CSSOM silently drops when set via style bindings
  // (they never appear in the serialized style attribute), so they can't be
  // asserted on directly in this test environment.

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, {
      props: { itemCount: 2, styleClassPassthrough: "custom-timeline" },
    });
    expect(wrapper.classes()).toContain("custom-timeline");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, {
      props: { itemCount: 2, styleClassPassthrough: ["a-class", "b-class"] },
    });
    expect(wrapper.classes()).toContain("a-class");
    expect(wrapper.classes()).toContain("b-class");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, {
      props: { itemCount: 2, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
