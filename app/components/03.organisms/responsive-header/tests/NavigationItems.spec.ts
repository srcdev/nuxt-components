import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import NavigationItems from "../NavigationItems.vue";
import type { ResponsiveHeaderState } from "../../../../types/components";

// NavigationItems renders the *complement* of what's visible in ResponsiveHeader's
// top bar: an item shows here only when its `config.visible` is false there. Mixing
// visible/hidden items (rather than the all-hidden case ResponsiveHeader's own tests
// exercise under jsdom's zero-size layout) verifies that complement logic directly.
const mainNavigationState: ResponsiveHeaderState = {
  hasSecondNav: true,
  navListVisibility: { firstNav: false, secondNav: true },
  clonedNavLinks: {
    firstNav: [
      { name: "Home", path: "/", config: { left: 0, right: 0, width: 0, visible: true } },
      { name: "About", path: "/about", config: { left: 0, right: 0, width: 0, visible: false } },
      {
        name: "Components",
        childLinksTitle: "UI Components",
        childLinks: [
          { name: "Buttons", path: "/forms/examples/buttons" },
          { name: "Tabs", path: "/ui/tabs" },
        ],
        config: { left: 0, right: 0, width: 0, visible: false },
      },
    ],
    secondNav: [{ name: "Contact", path: "/contact", config: { left: 0, right: 0, width: 0, visible: true } }],
  },
};

describe("NavigationItems", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("only shows the group whose navListVisibility flag is false", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    const lists = wrapper.findAll(".overflow-navigation-list");
    // firstNav (navListVisibility: false) is shown; secondNav (true) is not.
    expect(lists[0]?.classes()).toContain("visible");
    expect(lists[1]?.classes()).not.toContain("visible");
  });

  it("only marks items with config.visible === false as visible in the overflow list", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    const items = wrapper.findAll('[data-group-key="firstNav"].overflow-navigation-item');
    // Home (visible: true in main nav) should NOT be flagged visible here.
    const homeItem = items.find((item) => item.text().includes("Home"));
    expect(homeItem?.classes()).not.toContain("visible");
    // About (visible: false in main nav) should be flagged visible here.
    const aboutItem = items.find((item) => item.text().includes("About"));
    expect(aboutItem?.classes()).toContain("visible");
  });

  it("renders a plain link for items with a path", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    const link = wrapper.find('a[href="/about"].overflow-navigation-link');
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe("About");
  });

  it("renders an ExpandingPanel dropdown for items with childLinks", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    expect(wrapper.find(".overflow-navigation-details").exists()).toBe(true);
    expect(wrapper.text()).toContain("UI Components");
    const subLinks = wrapper.findAll(".overflow-navigation-sub-nav-link");
    expect(subLinks).toHaveLength(2);
    expect(subLinks[0]?.text()).toBe("Buttons");
    expect(subLinks[1]?.text()).toBe("Tabs");
  });

  it("marks the item matching the current route as active", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
      route: "/about",
    });
    const items = wrapper.findAll(".overflow-navigation-item");
    const activeItem = items.find((item) => item.find('a[href="/about"]').exists());
    expect(activeItem?.classes()).toContain("is-active");
  });

  it("marks a dropdown item active when one of its childLinks matches the current route", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
      route: "/ui/tabs",
    });
    const dropdownItem = wrapper.find(".overflow-navigation-details").element.closest(".overflow-navigation-item");
    expect(dropdownItem?.className).toContain("is-active");
  });

  it("sets is-hovered on a plain item on mouseenter", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    const item = wrapper.find('[data-group-key="firstNav"][data-local-index="1"]');
    await item.trigger("mouseenter");
    expect(item.classes()).toContain("is-hovered");
  });

  it("clears is-hovered on wrapper mouseleave", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    const item = wrapper.find('[data-group-key="firstNav"][data-local-index="1"]');
    await item.trigger("mouseenter");
    expect(item.classes()).toContain("is-hovered");

    await wrapper.find(".overflow-navigation-wrapper").trigger("mouseleave");
    expect(item.classes()).not.toContain("is-hovered");
  });

  it("applies styleClassPassthrough to the root element", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState, styleClassPassthrough: ["overflow-nav-scope"] },
    });
    expect(wrapper.find(".overflow-navigation-wrapper.overflow-nav-scope").exists()).toBe(true);
  });

  it("falls back to an empty state without throwing when mainNavigationState is omitted", async () => {
    const wrapper = await mountSuspended(NavigationItems);
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.findAll(".overflow-navigation-item")).toHaveLength(0);
  });

  it("toggles a dropdown panel open on summary click", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    const details = wrapper.find(".expanding-panel-classic-details");
    expect(details.attributes("open")).toBeUndefined();

    await wrapper.find(".expanding-panel-classic-summary").trigger("click");
    await nextTick();
    expect(details.attributes("open")).toBe("");
  });

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(NavigationItems, {
      props: { mainNavigationState },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
