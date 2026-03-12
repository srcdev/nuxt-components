import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayCard from "../DisplayCard.vue";

describe("DisplayCard", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayCard);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default)", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      slots: {
        header: "<h2>Title</h2>",
        body: "<p>Content</p>",
        footer: "<p>Footer</p>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (article, subtle, dividers)", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: { tag: "article", variant: "subtle", hasDividers: true },
      slots: {
        header: "<h2>Title</h2>",
        body: "<p>Content</p>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: { styleClassPassthrough: ["featured-card"] },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountSuspended(DisplayCard);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it.each([
    ["section", "SECTION"],
    ["article", "ARTICLE"],
    ["aside", "ASIDE"],
    ["main", "MAIN"],
    ["nav", "NAV"],
  ] as const)("renders as <%s> when tag='%s'", async (tag, expected) => {
    const wrapper = await mountSuspended(DisplayCard, { props: { tag } });
    expect(wrapper.element.tagName).toBe(expected);
  });

  // ─── Base class ──────────────────────────────────────────────────────────

  it("always has the display-card class", async () => {
    const wrapper = await mountSuspended(DisplayCard);
    expect(wrapper.classes()).toContain("display-card");
  });

  // ─── Variant ─────────────────────────────────────────────────────────────

  it("applies solid class by default", async () => {
    const wrapper = await mountSuspended(DisplayCard);
    expect(wrapper.classes()).toContain("solid");
  });

  it.each(["solid", "subtle", "soft", "outline"] as const)(
    "applies %s variant class",
    async (variant) => {
      const wrapper = await mountSuspended(DisplayCard, { props: { variant } });
      expect(wrapper.classes()).toContain(variant);
    }
  );

  // ─── hasDividers ─────────────────────────────────────────────────────────

  it("does not have has-dividers class by default", async () => {
    const wrapper = await mountSuspended(DisplayCard);
    expect(wrapper.classes()).not.toContain("has-dividers");
  });

  it("applies has-dividers class when hasDividers=true", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: { hasDividers: true },
    });
    expect(wrapper.classes()).toContain("has-dividers");
  });

  // ─── noOutline ───────────────────────────────────────────────────────────

  it("does not have no-outline class by default", async () => {
    const wrapper = await mountSuspended(DisplayCard);
    expect(wrapper.classes()).not.toContain("no-outline");
  });

  it("applies no-outline class when noOutline=true", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: { noOutline: true },
    });
    expect(wrapper.classes()).toContain("no-outline");
  });

  // ─── Dynamic slots ───────────────────────────────────────────────────────

  it("renders a .card-row wrapper for each slot", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      slots: {
        header: "<h2>Header</h2>",
        body: "<p>Body</p>",
        footer: "<p>Footer</p>",
      },
    });
    expect(wrapper.findAll(".card-row")).toHaveLength(3);
  });

  it("applies card-row-{name} class derived from the slot name", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      slots: {
        header: "<h2>Header</h2>",
        media: "<img src='x.jpg' alt='' />",
        footer: "<p>Footer</p>",
      },
    });
    expect(wrapper.find(".card-row-header").exists()).toBe(true);
    expect(wrapper.find(".card-row-media").exists()).toBe(true);
    expect(wrapper.find(".card-row-footer").exists()).toBe(true);
  });

  it("renders slot content inside the correct card-row", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      slots: {
        header: "<h2>My Title</h2>",
        body: "<p>My Body</p>",
      },
    });
    expect(wrapper.find(".card-row-header").text()).toBe("My Title");
    expect(wrapper.find(".card-row-body").text()).toBe("My Body");
  });

  it("renders no card-row elements when no slots are provided", async () => {
    const wrapper = await mountSuspended(DisplayCard);
    expect(wrapper.findAll(".card-row")).toHaveLength(0);
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: { styleClassPassthrough: "featured-card" },
    });
    expect(wrapper.classes()).toContain("featured-card");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: { styleClassPassthrough: ["featured-card", "highlight"] },
    });
    expect(wrapper.classes()).toContain("featured-card");
    expect(wrapper.classes()).toContain("highlight");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: { styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });

  // ─── Combined ────────────────────────────────────────────────────────────

  it("renders correctly with all props and slots combined", async () => {
    const wrapper = await mountSuspended(DisplayCard, {
      props: {
        tag: "article",
        variant: "soft",
        hasDividers: true,
        noOutline: true,
        styleClassPassthrough: ["featured-card"],
      },
      slots: {
        header: "<h2>Title</h2>",
        media: "<img src='x.jpg' alt='' />",
        body: "<p>Content</p>",
        footer: "<p>Footer</p>",
      },
    });
    expect(wrapper.element.tagName).toBe("ARTICLE");
    expect(wrapper.classes()).toContain("soft");
    expect(wrapper.classes()).toContain("has-dividers");
    expect(wrapper.classes()).toContain("no-outline");
    expect(wrapper.classes()).toContain("featured-card");
    expect(wrapper.findAll(".card-row")).toHaveLength(4);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
