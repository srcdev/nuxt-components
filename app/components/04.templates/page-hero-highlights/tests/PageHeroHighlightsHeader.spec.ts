import { describe, it, expect, vi, afterEach } from "vitest";
import { defineComponent } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PageHeroHighlightsHeader from "../PageHeroHighlightsHeader.vue";

const mounted: { unmount: () => void }[] = [];

const mountTracked = (async (...args: Parameters<typeof mountSuspended>) => {
  const wrapper = await mountSuspended(...args);
  mounted.push(wrapper);
  return wrapper;
}) as typeof mountSuspended;

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("PageHeroHighlightsHeader", () => {
  it("mounts without error", async () => {
    const wrapper = await mountTracked(PageHeroHighlightsHeader);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders start slot content", async () => {
    const wrapper = await mountTracked(PageHeroHighlightsHeader, {
      slots: { start: "<h1 class='page-title'>Surplus needs</h1>" },
    });
    expect(wrapper.find(".page-hero-highlights-header-start .page-title").exists()).toBe(true);
    expect(wrapper.html()).toContain("Surplus needs");
  });

  it("renders end slot content when provided", async () => {
    const wrapper = await mountTracked(PageHeroHighlightsHeader, {
      slots: {
        start: "<h1>Title</h1>",
        end: "<button class='cta'>Create new need</button>",
      },
    });
    expect(wrapper.find(".page-hero-highlights-header-end .cta").exists()).toBe(true);
  });

  it("does not render .page-hero-highlights-header-end when no end slot is provided", async () => {
    const wrapper = await mountTracked(PageHeroHighlightsHeader, {
      slots: { start: "<h1>Title</h1>" },
    });
    expect(wrapper.find(".page-hero-highlights-header-end").exists()).toBe(false);
  });

  it("renders .page-hero-highlights-header-start as full width when no end slot is provided", async () => {
    const wrapper = await mountTracked(PageHeroHighlightsHeader, {
      slots: { start: "<h1>Title</h1>" },
    });
    expect(wrapper.find(".page-hero-highlights-header-start").exists()).toBe(true);
    expect(wrapper.find(".page-hero-highlights-header-end").exists()).toBe(false);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountTracked(PageHeroHighlightsHeader, {
      props: { styleClassPassthrough: ["extra-class", "another-class"] },
    });
    expect(wrapper.find(".page-hero-highlights-header").classes()).toContain("extra-class");
    expect(wrapper.find(".page-hero-highlights-header").classes()).toContain("another-class");
  });
});

describe("PageHeroHighlightsHeader end slot toggled after mount", () => {
  it("adds and removes .page-hero-highlights-header-end with a v-if'd end slot", async () => {
    const Host = defineComponent({
      components: { PageHeroHighlightsHeader },
      props: { showEnd: { type: Boolean, default: false } },
      template: `
        <PageHeroHighlightsHeader>
          <template #start><h1>Title</h1></template>
          <template v-if="showEnd" #end><button class="cta">Go</button></template>
        </PageHeroHighlightsHeader>
      `,
    });
    const wrapper = await mountTracked(Host);
    expect(wrapper.find(".page-hero-highlights-header-end").exists()).toBe(false);
    await wrapper.setProps({ showEnd: true });
    expect(wrapper.find(".page-hero-highlights-header-end .cta").exists()).toBe(true);
    await wrapper.setProps({ showEnd: false });
    expect(wrapper.find(".page-hero-highlights-header-end").exists()).toBe(false);
  });
});
