import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LayoutGrid from "../LayoutGrid.vue";

describe("LayoutGrid", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 2 },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (div, 2 items)", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 2 },
      slots: {
        "item-0": "<p>First</p>",
        "item-1": "<p>Second</p>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (section with label)", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { tag: "section", label: "Feature grid", itemCount: 3 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 2, styleClassPassthrough: ["custom-class", "another-class"] },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountSuspended(LayoutGrid, { props: { itemCount: 1 } });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders as <section> when tag='section'", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { tag: "section", itemCount: 1 },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  // ─── Base class ──────────────────────────────────────────────────────────

  it("always has the layout-grid class", async () => {
    const wrapper = await mountSuspended(LayoutGrid, { props: { itemCount: 1 } });
    expect(wrapper.classes()).toContain("layout-grid");
  });

  // ─── Inner div ───────────────────────────────────────────────────────────

  it("renders a .layout-grid__inner div", async () => {
    const wrapper = await mountSuspended(LayoutGrid, { props: { itemCount: 1 } });
    expect(wrapper.find(".layout-grid__inner").exists()).toBe(true);
  });

  // ─── Accessibility ───────────────────────────────────────────────────────

  it("renders sr-only label and aria-labelledby when tag is section", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { tag: "section", label: "Card grid", itemCount: 2 },
    });
    const srOnly = wrapper.find(".sr-only");
    expect(srOnly.exists()).toBe(true);
    expect(srOnly.text()).toBe("Card grid");
    expect(wrapper.attributes("aria-labelledby")).toBeTruthy();
  });

  it("does not render sr-only label or aria-labelledby when tag is div", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { tag: "div", label: "Ignored", itemCount: 2 },
    });
    expect(wrapper.find(".sr-only").exists()).toBe(false);
    expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
  });

  // ─── Dynamic slots ───────────────────────────────────────────────────────

  it("renders slot content for each item inside the inner div", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 3 },
      slots: {
        "item-0": "<span>Alpha</span>",
        "item-1": "<span>Beta</span>",
        "item-2": "<span>Gamma</span>",
      },
    });
    const inner = wrapper.find(".layout-grid__inner");
    expect(inner.text()).toContain("Alpha");
    expect(inner.text()).toContain("Beta");
    expect(inner.text()).toContain("Gamma");
  });

  it("renders no slot content when itemCount is 0", async () => {
    const wrapper = await mountSuspended(LayoutGrid, { props: { itemCount: 0 } });
    expect(wrapper.find(".layout-grid__inner").text().trim()).toBe("");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 1, styleClassPassthrough: "my-class" },
    });
    expect(wrapper.classes()).toContain("my-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 1, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  // ─── columns prop ─────────────────────────────────────────────────────────

  it("accepts columns as a number (count mode) without error", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 3, columns: 3 },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("accepts columns as a CSS string (width mode) without error", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 4, columns: "200px" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("accepts columns as a rem string without error", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 4, columns: "15rem" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Other prop acceptance ────────────────────────────────────────────────

  it("accepts gap prop without error", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 2, gap: "2rem" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("accepts singleColBelow as a CSS string without error", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 2, singleColBelow: "600px" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("accepts singleColBelow with rem unit without error", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: { itemCount: 2, singleColBelow: "40rem" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Combined ────────────────────────────────────────────────────────────

  it("renders correctly with all props and slots combined", async () => {
    const wrapper = await mountSuspended(LayoutGrid, {
      props: {
        tag: "section",
        label: "Services",
        itemCount: 3,
        columns: 3,
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
    expect(wrapper.find(".layout-grid__inner").exists()).toBe(true);
    expect(wrapper.text()).toContain("One");
    expect(wrapper.html()).toMatchSnapshot();
  });
});
