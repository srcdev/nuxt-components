import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SiteHeader from "../SiteHeader.vue";
import type { ResponsiveHeaderProp } from "../../../../types/components";

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
    "styleClassPassthrough",
  ],
  template: `<div class="responsive-header-stub"><slot name="secondaryNavigation"></slot></div>`,
};

describe("SiteHeader", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the branding slot inside SkipLinks' homeLink slot", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      slots: { branding: "<a href='/' class='brand-link'>Brand</a>" },
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.find(".home-link .brand-link").exists()).toBe(true);
  });

  it("does not render the secondaryNavigation slot when not provided", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.text()).not.toContain("Extra nav");
  });

  it("forwards the secondaryNavigation slot through to ResponsiveHeader", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      slots: { secondaryNavigation: "<span>Extra nav</span>" },
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.text()).toContain("Extra nav");
  });

  it("forwards responsiveNavLinks and other nav props to ResponsiveHeader", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      props: {
        responsiveNavLinks: navLinks,
        gapBetweenFirstAndSecondNav: 24,
        collapseAtMainNavIntersection: true,
        allowExpandOnGesture: false,
        navStyleClassPassthrough: ["site-header-nav"],
      },
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    const responsiveHeader = wrapper.findComponent(responsiveHeaderStub);
    expect(responsiveHeader.props("responsiveNavLinks")).toEqual(navLinks);
    expect(responsiveHeader.props("gapBetweenFirstAndSecondNav")).toBe(24);
    expect(responsiveHeader.props("collapseAtMainNavIntersection")).toBe(true);
    expect(responsiveHeader.props("allowExpandOnGesture")).toBe(false);
    expect(responsiveHeader.props("styleClassPassthrough")).toEqual(["site-header-nav"]);
  });

  it("passes pageRowVariant through to the root PageRow", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      props: { pageRowVariant: "full" },
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.find(".page-row.full").exists()).toBe(true);
  });

  it("defaults pageRowVariant to content", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.find(".page-row.content").exists()).toBe(true);
  });

  it("applies styleClassPassthrough to the root PageRow", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      props: { styleClassPassthrough: ["header"] },
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.find(".page-row.header").exists()).toBe(true);
  });

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(SiteHeader, {
      global: { stubs: { ResponsiveHeader: responsiveHeaderStub } },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
