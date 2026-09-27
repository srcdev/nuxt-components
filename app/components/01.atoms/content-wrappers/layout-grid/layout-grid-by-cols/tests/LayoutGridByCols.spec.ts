import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LayoutGridByCols from "../LayoutGridByCols.vue";

describe("LayoutGridByCols", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (div, 2 items)", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      slots: {
        "item-0": "<p>First</p>",
        "item-1": "<p>Second</p>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (section with label)", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { tag: "section", label: "Feature grid" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { styleClassPassthrough: ["custom-class", "another-class"] },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders as <section> when tag='section'", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { tag: "section" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  // ─── Base class ──────────────────────────────────────────────────────────

  it("always has the layout-grid-by-cols class", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols);
    expect(wrapper.classes()).toContain("layout-grid-by-cols");
  });

  // ─── Inner div ───────────────────────────────────────────────────────────

  it("renders a .layout-grid-by-cols-inner div", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols);
    expect(wrapper.find(".layout-grid-by-cols-inner").exists()).toBe(true);
  });

  // ─── Accessibility ───────────────────────────────────────────────────────

  it("renders sr-only label and aria-labelledby when tag is section", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { tag: "section", label: "Card grid" },
    });
    const srOnly = wrapper.find(".sr-only");
    expect(srOnly.exists()).toBe(true);
    expect(srOnly.text()).toBe("Card grid");
    expect(wrapper.attributes("aria-labelledby")).toBeTruthy();
  });

  it("does not render sr-only label or aria-labelledby when tag is div", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { tag: "div", label: "Ignored" },
    });
    expect(wrapper.find(".sr-only").exists()).toBe(false);
    expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
  });

  // ─── Dynamic slots ───────────────────────────────────────────────────────

  it("renders slot content for each item inside the inner div", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      slots: {
        "item-0": "<span>Alpha</span>",
        "item-1": "<span>Beta</span>",
        "item-2": "<span>Gamma</span>",
      },
    });
    const inner = wrapper.find(".layout-grid-by-cols-inner");
    expect(inner.text()).toContain("Alpha");
    expect(inner.text()).toContain("Beta");
    expect(inner.text()).toContain("Gamma");
  });

  it("renders no slot content when no slots are provided", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols);
    expect(wrapper.find(".layout-grid-by-cols-inner").text().trim()).toBe("");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { styleClassPassthrough: "my-class" },
    });
    expect(wrapper.classes()).toContain("my-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  // ─── Token props ──────────────────────────────────────────────────────────

  const inlineToken = (wrapper: { element: Element }, name: string) =>
    (wrapper.element as HTMLElement).style.getPropertyValue(name);

  it("writes no inline style when no layout props are passed", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("writes columnCount to --layout-grid-by-cols-column-count", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { columnCount: 3 },
    });
    expect(inlineToken(wrapper, "--layout-grid-by-cols-column-count")).toBe("3");
  });

  it("clamps columnCount to a minimum of 2", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { columnCount: 1 as unknown as 2 },
    });
    expect(inlineToken(wrapper, "--layout-grid-by-cols-column-count")).toBe("2");
  });

  it("writes gap to --layout-grid-by-cols-gap", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { gap: "2rem" },
    });
    expect(inlineToken(wrapper, "--layout-grid-by-cols-gap")).toBe("2rem");
  });

  it("writes singleColBelow to --layout-grid-by-cols-single-col-below", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { singleColBelow: "600px" },
    });
    expect(inlineToken(wrapper, "--layout-grid-by-cols-single-col-below")).toBe("600px");
  });

  it("updates the inline token when a prop changes", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { columnCount: 3 },
    });
    await wrapper.setProps({ columnCount: 4 });
    expect(inlineToken(wrapper, "--layout-grid-by-cols-column-count")).toBe("4");
    await wrapper.setProps({ columnCount: undefined });
    expect(inlineToken(wrapper, "--layout-grid-by-cols-column-count")).toBe("");
  });

  it("does not render placeholder text or aria-labelledby for a section without a label", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: { tag: "section" },
    });
    expect(wrapper.find(".sr-only").exists()).toBe(false);
    expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
    expect(wrapper.text()).not.toContain("label is required");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  // ─── Combined ────────────────────────────────────────────────────────────

  it("renders correctly with all props and slots combined", async () => {
    const wrapper = await mountSuspended(LayoutGridByCols, {
      props: {
        tag: "section",
        label: "Services",
        columnCount: 3,
        gap: "2rem",
        singleColBelow: "768px",
        styleClassPassthrough: ["services-grid"],
      },
      slots: {
        "item-0": "<p>One</p>",
        "item-1": "<p>Two</p>",
        "item-2": "<p>Three</p>",
      },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.classes()).toContain("services-grid");
    expect(wrapper.find(".layout-grid-by-cols-inner").exists()).toBe(true);
    expect(wrapper.text()).toContain("One");
    expect(wrapper.html()).toMatchSnapshot();
  });
});
