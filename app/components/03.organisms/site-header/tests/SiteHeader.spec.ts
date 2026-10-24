import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SiteHeader from "../SiteHeader.vue";
import type { ResponsiveHeaderProp } from "~/types/components";

const navLinks: ResponsiveHeaderProp = {
  firstNav: [{ name: "Home", path: "/" }],
};

const responsiveHeaderStub = {
  name: "ResponsiveHeader",
  props: [
    "responsiveNavLinks",
    "gapBetweenFirstAndSecondNav",
    "overflowDetailsSummaryIcons",
    "collapseBreakpoint",
    "collapseAtMainNavIntersection",
    "allowExpandOnGesture",
    "panelVariant",
    "anchorScrollOffset",
    "styleClassPassthrough",
  ],
  template: `<div class="responsive-header-stub"><slot name="secondaryNavigation"></slot></div>`,
};

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountHeader = async (options: { props?: Record<string, unknown>; slots?: Record<string, string> } = {}) => {
  const wrapper = await mountSuspended(SiteHeader, {
    ...options,
    global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("SiteHeader", () => {
  it("mounts without error", async () => {
    const wrapper = await mountHeader();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the branding slot inside SkipLinks' homeLink slot", async () => {
    const wrapper = await mountHeader({
      slots: { branding: "<a href='/' class='brand-link'>Brand</a>" },
    });
    expect(wrapper.find(".skip-links__home .brand-link").exists()).toBe(true);
  });

  it("does not render the secondaryNavigation slot when not provided", async () => {
    const wrapper = await mountHeader();
    expect(wrapper.text()).not.toContain("Extra nav");
  });

  it("forwards the secondaryNavigation slot through to ResponsiveHeader", async () => {
    const wrapper = await mountHeader({
      slots: { secondaryNavigation: "<span>Extra nav</span>" },
    });
    expect(wrapper.text()).toContain("Extra nav");
  });

  it("forwards responsiveNavLinks and other nav props to ResponsiveHeader", async () => {
    const wrapper = await mountHeader({
      props: {
        responsiveNavLinks: navLinks,
        gapBetweenFirstAndSecondNav: 24,
        collapseAtMainNavIntersection: true,
        allowExpandOnGesture: false,
        panelVariant: "modern",
        anchorScrollOffset: 64,
        navStyleClassPassthrough: ["site-header-nav"],
      },
    });
    const responsiveHeader = wrapper.findComponent(responsiveHeaderStub);
    expect(responsiveHeader.props("responsiveNavLinks")).toEqual(navLinks);
    expect(responsiveHeader.props("gapBetweenFirstAndSecondNav")).toBe(24);
    expect(responsiveHeader.props("collapseAtMainNavIntersection")).toBe(true);
    expect(responsiveHeader.props("allowExpandOnGesture")).toBe(false);
    expect(responsiveHeader.props("panelVariant")).toBe("modern");
    expect(responsiveHeader.props("anchorScrollOffset")).toBe(64);
    expect(responsiveHeader.props("styleClassPassthrough")).toEqual(["site-header-nav"]);
  });

  it("passes pageRowVariant through to the root PageRow", async () => {
    const wrapper = await mountHeader({
      props: { pageRowVariant: "full" },
    });
    expect(wrapper.find(".page-row[data-variant=\"full\"]").exists()).toBe(true);
  });

  it("defaults pageRowVariant to content", async () => {
    const wrapper = await mountHeader();
    expect(wrapper.find(".page-row[data-variant=\"content\"]").exists()).toBe(true);
  });

  it("applies styleClassPassthrough to the root PageRow", async () => {
    const wrapper = await mountHeader({
      props: { styleClassPassthrough: ["header"] },
    });
    expect(wrapper.find(".page-row.header").exists()).toBe(true);
  });

  it("puts the sticky hook on the outer row, not the inner header", async () => {
    const wrapper = await mountHeader({ props: { styleClassPassthrough: ["header"] } });
    expect(wrapper.classes()).toContain("site-header-row");
    expect(wrapper.classes()).toContain("header");
    expect(wrapper.find("header.site-header").classes()).not.toContain("site-header-row");
  });

  it("labels the branding nav landmark, defaulting to Home navigation", async () => {
    const fallback = await mountHeader();
    expect(fallback.find("nav.site-header-home-nav").attributes("aria-label")).toBe("Home navigation");

    const custom = await mountHeader({ props: { homeNavAriaLabel: "Startseite" } });
    expect(custom.find("nav.site-header-home-nav").attributes("aria-label")).toBe("Startseite");
  });

  it("renders the brand alone when there are no nav links", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: {} },
      slots: { branding: "<a href='/' class='brand-link'>Brand</a>" },
    });
    expect(wrapper.find(".brand-link").exists()).toBe(true);
    expect(wrapper.findComponent(responsiveHeaderStub).props("responsiveNavLinks")).toEqual({});
  });

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountHeader();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
