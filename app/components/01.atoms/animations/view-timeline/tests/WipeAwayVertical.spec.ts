import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import WipeAwayVertical from "../WipeAwayVertical.vue";

describe("WipeAwayVertical", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubGlobal(
      "CSS",
      { supports: vi.fn(() => true) }
    );
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

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

  // ─── Trailing buffer ─────────────────────────────────────────────────────

  it("renders a trailing buffer spacer after the last scrolling section", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    expect(wrapper.find(".trailing-buffer").exists()).toBe(true);
  });

  it("marks the trailing buffer as aria-hidden", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    expect(wrapper.find(".trailing-buffer").attributes("aria-hidden")).toBe("true");
  });

  // ─── Slots ───────────────────────────────────────────────────────────────

  it("renders one sticky-item and one scrolling-section per itemCount", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 3 } });
    expect(wrapper.findAll(".sticky-item")).toHaveLength(3);
    expect(wrapper.findAll(".scrolling-section")).toHaveLength(3);
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

  it("renders named scrollingItem-{key} slot content", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, {
      props: { itemCount: 2 },
      slots: {
        "scrollingItem-0": "<p class='scroll-0'>First</p>",
        "scrollingItem-1": "<p class='scroll-1'>Second</p>",
      },
    });
    expect(wrapper.find(".scroll-0").exists()).toBe(true);
    expect(wrapper.find(".scroll-1").exists()).toBe(true);
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

  // ─── Scroll handling ─────────────────────────────────────────────────────

  it("attaches a scroll listener on mount when animation-timeline is supported", async () => {
    await mountSuspended(WipeAwayVertical, { props: { itemCount: 2 } });
    expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("attaches the fallback scroll listener when animation-timeline is unsupported", async () => {
    vi.stubGlobal("CSS", { supports: vi.fn(() => false) });
    await mountSuspended(WipeAwayVertical, { props: { itemCount: 2 } });
    expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("removes its scroll listener on unmount", async () => {
    const wrapper = await mountSuspended(WipeAwayVertical, { props: { itemCount: 2 } });
    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
