import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DataGrid from "../DataGrid.vue";

describe("DataGrid", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DataGrid);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(DataGrid);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props and slots set)", async () => {
    const wrapper = await mountSuspended(DataGrid, {
      props: {
        tag: "section",
        styleClassPassthrough: ["custom-class"],
      },
      slots: {
        "item-1": "<div>Item 1</div>",
        "item-2": "<div>Item 2</div>",
        "item-3": "<div>Item 3</div>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ────────────────────────────────────────────────────────

  it("renders a <div> as the root element by default", async () => {
    const wrapper = await mountSuspended(DataGrid);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("always has the data-grid class", async () => {
    const wrapper = await mountSuspended(DataGrid);
    expect(wrapper.classes()).toContain("data-grid");
  });

  // ─── Tag prop ────────────────────────────────────────────────────────────

  it("renders a <section> when tag is section", async () => {
    const wrapper = await mountSuspended(DataGrid, { props: { tag: "section" } });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("renders an <article> when tag is article", async () => {
    const wrapper = await mountSuspended(DataGrid, { props: { tag: "article" } });
    expect(wrapper.element.tagName).toBe("ARTICLE");
  });

  it("renders a <main> when tag is main", async () => {
    const wrapper = await mountSuspended(DataGrid, { props: { tag: "main" } });
    expect(wrapper.element.tagName).toBe("MAIN");
  });

  // ─── Aria ─────────────────────────────────────────────────────────────────

  it("does not set aria-labelledby when tag is div", async () => {
    const wrapper = await mountSuspended(DataGrid, { props: { tag: "div" } });
    expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
  });

  it("sets aria-labelledby when tag is section", async () => {
    const wrapper = await mountSuspended(DataGrid, { props: { tag: "section" } });
    expect(wrapper.attributes("aria-labelledby")).toBeTruthy();
  });

  it("sets aria-labelledby when tag is article", async () => {
    const wrapper = await mountSuspended(DataGrid, { props: { tag: "article" } });
    expect(wrapper.attributes("aria-labelledby")).toBeTruthy();
  });

  it("sets aria-labelledby when tag is main", async () => {
    const wrapper = await mountSuspended(DataGrid, { props: { tag: "main" } });
    expect(wrapper.attributes("aria-labelledby")).toBeTruthy();
  });

  // ─── Slots ───────────────────────────────────────────────────────────────

  it("renders a named slot", async () => {
    const wrapper = await mountSuspended(DataGrid, {
      slots: { "item-1": "<div class='card'>Card 1</div>" },
    });
    expect(wrapper.find(".card").exists()).toBe(true);
    expect(wrapper.find(".card").text()).toBe("Card 1");
  });

  it("renders multiple named slots", async () => {
    const wrapper = await mountSuspended(DataGrid, {
      slots: {
        "item-1": "<div class='card-1'>Card 1</div>",
        "item-2": "<div class='card-2'>Card 2</div>",
        "item-3": "<div class='card-3'>Card 3</div>",
      },
    });
    expect(wrapper.find(".card-1").exists()).toBe(true);
    expect(wrapper.find(".card-2").exists()).toBe(true);
    expect(wrapper.find(".card-3").exists()).toBe(true);
  });

  it("renders no slot content when no slots are provided", async () => {
    const wrapper = await mountSuspended(DataGrid);
    expect(wrapper.text()).toBe("");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    const wrapper = await mountSuspended(DataGrid, {
      props: { styleClassPassthrough: "my-grid" },
    });
    expect(wrapper.classes()).toContain("my-grid");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DataGrid, {
      props: { styleClassPassthrough: ["my-grid", "mbe-32"] },
    });
    expect(wrapper.classes()).toContain("my-grid");
    expect(wrapper.classes()).toContain("mbe-32");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DataGrid, {
      props: { styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
