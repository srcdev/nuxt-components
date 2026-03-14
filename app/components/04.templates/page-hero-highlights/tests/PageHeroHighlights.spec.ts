import { describe, it, expect } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PageHeroHighlights from "../PageHeroHighlights.vue";

describe("PageHeroHighlights", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: {
        header: "<h1>Page Title</h1>",
        highlights: "<div class='highlight'>Highlight 1</div>",
        content: "<p>Content</p>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights);
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("renders with the correct tag when tag prop is provided", async () => {
    for (const tag of ["section", "main"] as const) {
      const wrapper = await mountSuspended(PageHeroHighlights, {
        props: { tag },
      });
      expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
    }
  });

  it("renders header slot content", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: { header: "<h1 class='page-title'>Dashboard</h1>" },
    });
    expect(wrapper.find(".page-title").exists()).toBe(true);
    expect(wrapper.html()).toContain("Dashboard");
  });

  it("renders highlights slot content", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: {
        highlights: [
          "<div class='highlight-card'>Card 1</div>",
          "<div class='highlight-card'>Card 2</div>",
        ].join(""),
      },
    });
    expect(wrapper.findAll(".highlight-card").length).toBe(2);
  });

  it("renders content slot content", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: { content: "<p class='body-text'>Page body</p>" },
    });
    expect(wrapper.find(".body-text").exists()).toBe(true);
    expect(wrapper.html()).toContain("Page body");
  });

  it("content slot is rendered inside .content-slot", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: { content: "<p class='body-text'>Page body</p>" },
    });
    expect(wrapper.find(".content-slot .body-text").exists()).toBe(true);
  });

  it("header slot is rendered inside .header-slot", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: { header: "<h1 class='page-title'>Dashboard</h1>" },
    });
    expect(wrapper.find(".header-slot .page-title").exists()).toBe(true);
  });

  it("adds aria-labelledby when tag is section", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { tag: "section" },
    });
    expect(wrapper.find(".page-hero-highlights").attributes("aria-labelledby")).toBeTruthy();
  });

  it("adds aria-labelledby when tag is main", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { tag: "main" },
    });
    expect(wrapper.find(".page-hero-highlights").attributes("aria-labelledby")).toBeTruthy();
  });

  it("does not add aria-labelledby when tag is div", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { tag: "div" },
    });
    expect(wrapper.find(".page-hero-highlights").attributes("aria-labelledby")).toBeUndefined();
  });

  it("exposes headingId via header scoped slot and aria-labelledby matches", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { tag: "section" },
      slots: {
        header: (props: Record<string, unknown>) =>
          h("h1", { id: props.headingId, class: "page-title" }, "Dashboard"),
      },
    });
    const labelledBy = wrapper.find(".page-hero-highlights").attributes("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(wrapper.find(".page-title").attributes("id")).toBe(labelledBy);
  });

  it("applies flexible-widths class by default", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights);
    expect(wrapper.find(".highlights-row").classes()).toContain("flexible-widths");
    expect(wrapper.find(".highlights-row").classes()).not.toContain("equal-widths");
  });

  it("applies equal-widths class when highlightsEqualWidths is true", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { highlightsEqualWidths: true },
    });
    expect(wrapper.find(".highlights-row").classes()).toContain("equal-widths");
    expect(wrapper.find(".highlights-row").classes()).not.toContain("flexible-widths");
  });

  it("applies justify-start class by default", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights);
    expect(wrapper.find(".highlights-row").classes()).toContain("justify-start");
  });

  it("applies the correct justify class for each highlightsJustify value", async () => {
    const values = ["start", "center", "end", "space-between", "space-around"] as const;
    for (const value of values) {
      const wrapper = await mountSuspended(PageHeroHighlights, {
        props: { highlightsJustify: value },
      });
      expect(wrapper.find(".highlights-row").classes()).toContain(`justify-${value}`);
    }
  });

  it("does not apply highlight-title-baseline class by default", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights);
    expect(wrapper.find(".page-hero-highlights").classes()).not.toContain("highlight-title-baseline");
  });

  it("applies highlight-title-baseline class when highlightTitleBaseline is true", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { highlightTitleBaseline: true },
    });
    expect(wrapper.find(".page-hero-highlights").classes()).toContain("highlight-title-baseline");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { styleClassPassthrough: ["extra-class", "another-class"] },
    });
    const el = wrapper.find(".page-hero-highlights");
    expect(el.classes()).toContain("extra-class");
    expect(el.classes()).toContain("another-class");
  });

  describe("gridColumns", () => {
    interface ComponentInstance {
      gridColumns: string;
    }

    it("defaults to fixed 16px gutters with no maxWidth", async () => {
      const wrapper = await mountSuspended(PageHeroHighlights);
      const vm = wrapper.vm as unknown as ComponentInstance;
      expect(vm.gridColumns).toBe("16px 1fr 16px");
    });

    it("returns centered max-width columns when maxWidth is set and contentAlign is center", async () => {
      const wrapper = await mountSuspended(PageHeroHighlights, {
        props: { maxWidth: "1064px", contentAlign: "center" },
      });
      const vm = wrapper.vm as unknown as ComponentInstance;
      expect(vm.gridColumns).toBe("max(16px, (100% - 1064px) / 2) 1fr max(16px, (100% - 1064px) / 2)");
    });

    it("returns start-aligned columns when maxWidth is set and contentAlign is start", async () => {
      const wrapper = await mountSuspended(PageHeroHighlights, {
        props: { maxWidth: "1064px", contentAlign: "start" },
      });
      const vm = wrapper.vm as unknown as ComponentInstance;
      expect(vm.gridColumns).toBe("16px minmax(0, 1064px) 1fr");
    });

    it("ignores contentAlign when maxWidth is not set", async () => {
      const wrapper = await mountSuspended(PageHeroHighlights, {
        props: { contentAlign: "start" },
      });
      const vm = wrapper.vm as unknown as ComponentInstance;
      expect(vm.gridColumns).toBe("16px 1fr 16px");
    });
  });
});
