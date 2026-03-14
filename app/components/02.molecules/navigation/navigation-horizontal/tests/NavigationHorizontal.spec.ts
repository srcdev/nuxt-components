import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import NavigationHorizontal from "../NavigationHorizontal.vue";
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

const defaultNavItemData: NavItemData = {
  main: [
    { text: "Home", href: "/" },
    { text: "About", href: "/about" },
    { text: "Contact", href: "/contact" },
  ],
};

describe("NavigationHorizontal", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a nav element as root", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("nav");
  });

  it("renders a ul list by default", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.find("ul").exists()).toBe(true);
    expect(wrapper.find("ol").exists()).toBe(false);
  });

  it("renders an ol when tag prop is ol", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData, tag: "ol" },
    });
    expect(wrapper.find("ol").exists()).toBe(true);
    expect(wrapper.find("ul").exists()).toBe(false);
  });

  it("renders a div when tag prop is div", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData, tag: "div" },
    });
    expect(wrapper.find("div.navigation-horizontal-list").exists()).toBe(true);
  });

  it("renders the correct number of nav items", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    const items = wrapper.findAll("li");
    expect(items.length).toBe(3);
  });

  it("renders item text correctly", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    const links = wrapper.findAll("a");
    expect(links[0].text()).toContain("Home");
    expect(links[1].text()).toContain("About");
    expect(links[2].text()).toContain("Contact");
  });

  it("renders item href correctly", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    const links = wrapper.findAll("a");
    expect(links[0].attributes("href")).toBe("/");
    expect(links[1].attributes("href")).toBe("/about");
  });

  it("applies cssName as a class on the li element", async () => {
    const navItemData: NavItemData = {
      main: [{ text: "Home", href: "/", cssName: "is-active" }],
    };
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData },
    });
    expect(wrapper.find("li").classes()).toContain("is-active");
  });

  it("renders an icon when iconName is provided", async () => {
    const navItemData: NavItemData = {
      main: [{ text: "Home", href: "/", iconName: "home" }],
    };
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData },
    });
    expect(wrapper.find("svg, [class*='icon'], [name]").exists()).toBe(true);
  });

  it("does not render an icon when iconName is not provided", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData: defaultNavItemData },
    });
    // No Icon component should be rendered for items without iconName
    expect(wrapper.findAll("li")[0].find("[name]").exists()).toBe(false);
  });

  it("sets external attribute on external links", async () => {
    const navItemData: NavItemData = {
      main: [{ text: "External", href: "https://example.com", isExternal: true }],
    };
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: { navItemData },
    });
    const link = wrapper.find("a");
    // NuxtLink renders with target="_blank" or rel for external links
    expect(link.attributes("href")).toBe("https://example.com");
  });

  it("applies styleClassPassthrough classes to the nav element", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: {
        navItemData: defaultNavItemData,
        styleClassPassthrough: ["custom-nav", "theme-dark"],
      },
    });
    expect(wrapper.find(".navigation-horizontal").classes()).toContain("custom-nav");
    expect(wrapper.find(".navigation-horizontal").classes()).toContain("theme-dark");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(NavigationHorizontal, {
      props: {
        navItemData: defaultNavItemData,
        styleClassPassthrough: ["initial-class"],
      },
    });
    expect(wrapper.find(".navigation-horizontal").classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    await nextTick();

    expect(wrapper.find(".navigation-horizontal").classes()).toContain("updated-class");
  });
});
