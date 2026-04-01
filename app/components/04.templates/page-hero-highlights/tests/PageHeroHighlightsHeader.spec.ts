import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PageHeroHighlightsHeader from "../PageHeroHighlightsHeader.vue";

describe("PageHeroHighlightsHeader", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(PageHeroHighlightsHeader);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders start slot content", async () => {
    const wrapper = await mountSuspended(PageHeroHighlightsHeader, {
      slots: { start: "<h1 class='page-title'>Surplus needs</h1>" },
    });
    expect(wrapper.find(".phh-start .page-title").exists()).toBe(true);
    expect(wrapper.html()).toContain("Surplus needs");
  });

  it("renders end slot content when provided", async () => {
    const wrapper = await mountSuspended(PageHeroHighlightsHeader, {
      slots: {
        start: "<h1>Title</h1>",
        end: "<button class='cta'>Create new need</button>",
      },
    });
    expect(wrapper.find(".phh-end .cta").exists()).toBe(true);
  });

  it("does not render .phh-end when no end slot is provided", async () => {
    const wrapper = await mountSuspended(PageHeroHighlightsHeader, {
      slots: { start: "<h1>Title</h1>" },
    });
    expect(wrapper.find(".phh-end").exists()).toBe(false);
  });

  it("renders .phh-start as full width when no end slot is provided", async () => {
    const wrapper = await mountSuspended(PageHeroHighlightsHeader, {
      slots: { start: "<h1>Title</h1>" },
    });
    expect(wrapper.find(".phh-start").exists()).toBe(true);
    expect(wrapper.find(".phh-end").exists()).toBe(false);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(PageHeroHighlightsHeader, {
      props: { styleClassPassthrough: ["extra-class", "another-class"] },
    });
    expect(wrapper.find(".page-hero-highlights-header").classes()).toContain("extra-class");
    expect(wrapper.find(".page-hero-highlights-header").classes()).toContain("another-class");
  });
});
