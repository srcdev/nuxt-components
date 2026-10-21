import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AutoGrid from "../AutoGrid.vue";

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountComponent = async (options: Parameters<typeof mountSuspended<typeof AutoGrid>>[1] = {}) => {
  const wrapper = await mountSuspended(AutoGrid, options);
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("AutoGrid", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props and slots set)", async () => {
    const wrapper = await mountComponent({
      props: {
        tag: "section",
        isResponsive: true,
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
    const wrapper = await mountComponent();
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("always has the auto-grid class", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.classes()).toContain("auto-grid");
  });

  // ─── Tag prop ────────────────────────────────────────────────────────────

  it("renders a <section> when tag is section", async () => {
    const wrapper = await mountComponent({ props: { tag: "section" } });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("renders an <article> when tag is article", async () => {
    const wrapper = await mountComponent({ props: { tag: "article" } });
    expect(wrapper.element.tagName).toBe("ARTICLE");
  });

  it("renders a <main> when tag is main", async () => {
    const wrapper = await mountComponent({ props: { tag: "main" } });
    expect(wrapper.element.tagName).toBe("MAIN");
  });

  // ─── Aria ─────────────────────────────────────────────────────────────────

  // AutoGrid has no heading of its own, so it never auto-generates an
  // aria-labelledby regardless of tag — doing so would always be a broken
  // ARIA reference, since there is no way for a consumer to bind a heading
  // to it. Pass an explicit aria-label if a landmark tag needs a name.
  it.each(["div", "section", "article", "main"] as const)(
    "does not set aria-labelledby when tag is %s",
    async (tag) => {
      const wrapper = await mountComponent({ props: { tag } });
      expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
    }
  );

  it("passes a consumer aria-label through to the root", async () => {
    const wrapper = await mountComponent({
      props: { tag: "section" },
      attrs: { "aria-label": "Practice stats" },
    });
    expect(wrapper.attributes("aria-label")).toBe("Practice stats");
  });

  // ─── isResponsive ────────────────────────────────────────────────────────

  it("does not have data-responsive by default", async () => {
    const wrapper = await mountComponent();
    expect(wrapper.attributes("data-responsive")).toBeUndefined();
  });

  it("adds data-responsive when isResponsive is true", async () => {
    const wrapper = await mountComponent({ props: { isResponsive: true } });
    expect(wrapper.attributes("data-responsive")).toBe("");
  });

  it("removes data-responsive when isResponsive changes to false", async () => {
    const wrapper = await mountComponent({ props: { isResponsive: true } });
    expect(wrapper.attributes("data-responsive")).toBe("");
    await wrapper.setProps({ isResponsive: false });
    expect(wrapper.attributes("data-responsive")).toBeUndefined();
  });

  // ─── Slots ───────────────────────────────────────────────────────────────

  it("renders a named slot", async () => {
    const wrapper = await mountComponent({
      slots: { "item-1": "<div class='card'>Card 1</div>" },
    });
    expect(wrapper.find(".card").exists()).toBe(true);
    expect(wrapper.find(".card").text()).toBe("Card 1");
  });

  it("renders multiple named slots", async () => {
    const wrapper = await mountComponent({
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
    const wrapper = await mountComponent();
    expect(wrapper.text()).toBe("");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    const wrapper = await mountComponent({
      props: { styleClassPassthrough: "my-grid" },
    });
    expect(wrapper.classes()).toContain("my-grid");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountComponent({
      props: { styleClassPassthrough: ["my-grid", "mbe-32"] },
    });
    expect(wrapper.classes()).toContain("my-grid");
    expect(wrapper.classes()).toContain("mbe-32");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountComponent({
      props: { styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
