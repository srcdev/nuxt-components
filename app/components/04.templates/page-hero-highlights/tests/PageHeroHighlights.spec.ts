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

  it("content slot is rendered inside .content-inner", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: { content: "<p class='body-text'>Page body</p>" },
    });
    expect(wrapper.find(".content-inner .body-text").exists()).toBe(true);
  });

  it("header slot is rendered inside .header-inner", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      slots: { header: "<h1 class='page-title'>Dashboard</h1>" },
    });
    expect(wrapper.find(".header-inner .page-title").exists()).toBe(true);
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

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(PageHeroHighlights, {
      props: { styleClassPassthrough: ["extra-class", "another-class"] },
    });
    const el = wrapper.find(".page-hero-highlights");
    expect(el.classes()).toContain("extra-class");
    expect(el.classes()).toContain("another-class");
  });
});
