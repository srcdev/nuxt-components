import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import TabNavigation from "../TabNavigation.vue";
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

// useResizeObserver (from @vueuse/core) requires ResizeObserver
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", mockResizeObserver);
  // ⚠️ Do NOT call vi.unstubAllGlobals() in afterEach —
  // it removes global stubs from vitest.setup.ts ($fetch, etc.)
});

const defaultNavItemData: NavItemData = {
  main: [
    { text: "Home", href: "/" },
    { text: "About", href: "/about" },
    { text: "Contact", href: "/contact" },
  ],
};

describe("TabNavigation", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a nav element as root", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("nav");
  });

  it("has aria-label on the nav", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.attributes("aria-label")).toBe("Site navigation");
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── isLoaded ──────────────────────────────────────────────────────────────

  it("applies is-loaded class after mounting", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    await nextTick();
    expect(wrapper.classes()).toContain("is-loaded");
  });

  // ─── Nav list ──────────────────────────────────────────────────────────────

  it("renders the nav list when not collapsed", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.find(".tab-nav-list").exists()).toBe(true);
  });

  it("renders the correct number of nav items", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    const items = wrapper.findAll(".tab-nav-list li:not(.nav-indicator-li)");
    expect(items.length).toBe(3);
  });

  it("renders item text correctly", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    const links = wrapper.findAll(".tab-nav-link");
    expect(links[0]!.text()).toContain("Home");
    expect(links[1]!.text()).toContain("About");
    expect(links[2]!.text()).toContain("Contact");
  });

  it("renders item href correctly", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    const links = wrapper.findAll(".tab-nav-link");
    expect(links[0]!.attributes("href")).toBe("/");
    expect(links[1]!.attributes("href")).toBe("/about");
    expect(links[2]!.attributes("href")).toBe("/contact");
  });

  it("applies cssName as class on the li element", async () => {
    const navItemData: NavItemData = {
      main: [{ text: "Home", href: "/", cssName: "is-active" }],
    };
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData },
    });
    expect(wrapper.find(".tab-nav-list li").classes()).toContain("is-active");
  });

  it("renders an icon when iconName is provided", async () => {
    const navItemData: NavItemData = {
      main: [{ text: "Home", href: "/", iconName: "heroicons:home" }],
    };
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData },
    });
    const firstItem = wrapper.find(".tab-nav-list li:not(.nav-indicator-li)");
    expect(firstItem.find("[aria-hidden='true']").exists()).toBe(true);
  });

  it("does not render an icon when iconName is not provided", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    const firstLink = wrapper.find(".tab-nav-link");
    expect(firstLink.find("[aria-hidden='true']").exists()).toBe(false);
  });

  it("renders external links with the correct href", async () => {
    const navItemData: NavItemData = {
      main: [{ text: "External", href: "https://example.com", isExternal: true }],
    };
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData },
    });
    expect(wrapper.find(".tab-nav-link").attributes("href")).toBe("https://example.com");
  });

  it("renders two indicator elements inside the nav list", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    const indicators = wrapper.findAll(".tab-nav-list .nav-indicator-li");
    expect(indicators.length).toBe(2);
    expect(wrapper.find(".nav__hovered").exists()).toBe(true);
    expect(wrapper.find(".nav__active-indicator").exists()).toBe(true);
  });

  // ─── Alignment variants ────────────────────────────────────────────────────

  it("applies tab-navigation--left class by default", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.classes()).toContain("tab-navigation--left");
  });

  it("applies tab-navigation--center class when navAlign is center", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData, navAlign: "center" },
    });
    expect(wrapper.classes()).toContain("tab-navigation--center");
  });

  it("applies tab-navigation--right class when navAlign is right", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData, navAlign: "right" },
    });
    expect(wrapper.classes()).toContain("tab-navigation--right");
  });

  // ─── styleClassPassthrough ─────────────────────────────────────────────────

  it("applies styleClassPassthrough classes to the nav element", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: {
        navItemData: defaultNavItemData,
        styleClassPassthrough: ["custom-nav", "theme-dark"],
      },
    });
    expect(wrapper.classes()).toContain("custom-nav");
    expect(wrapper.classes()).toContain("theme-dark");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: {
        navItemData: defaultNavItemData,
        styleClassPassthrough: ["initial-class"],
      },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    await nextTick();

    expect(wrapper.classes()).toContain("updated-class");
    expect(wrapper.classes()).not.toContain("initial-class");
  });

  // ─── Non-collapsed state (default in JSDOM — dimensions are all 0) ─────────

  it("does not show the burger button when not collapsed", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.find(".tab-nav-burger").exists()).toBe(false);
  });

  it("does not show the nav panel when not collapsed", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.find(".tab-nav-panel").exists()).toBe(false);
  });

  it("does not have is-collapsed class when not collapsed", async () => {
    const wrapper = await mountSuspended(TabNavigation, {
      props: { navItemData: defaultNavItemData },
    });
    expect(wrapper.classes()).not.toContain("is-collapsed");
  });

  // ─── Collapsed state ───────────────────────────────────────────────────────
  // isCollapsed is driven by DOM layout measurements (scrollWidth > clientWidth).
  // In JSDOM both values are 0 so we cannot trigger collapse via resize.
  // Instead we force the state directly through the component's setup context.

  describe("when collapsed", () => {
    interface TabNavSetup {
      isCollapsed: boolean;
      isMenuOpen: boolean;
    }

    async function mountCollapsed() {
      const wrapper = await mountSuspended(TabNavigation, {
        props: { navItemData: defaultNavItemData },
      });
      const setup = (wrapper.vm as unknown as { $: { setupState: TabNavSetup } }).$.setupState;
      setup.isCollapsed = true;
      await nextTick();
      return { wrapper, setup };
    }

    it("applies is-collapsed class", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.classes()).toContain("is-collapsed");
    });

    it("hides the horizontal nav list", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.find(".tab-nav-list").exists()).toBe(false);
    });

    it("shows the burger button", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.find(".tab-nav-burger").exists()).toBe(true);
    });

    it("shows the nav panel", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.find(".tab-nav-panel").exists()).toBe(true);
    });

    it("burger button has aria-expanded false when menu is closed", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.find(".tab-nav-burger").attributes("aria-expanded")).toBe("false");
    });

    it("panel does not have is-open class when menu is closed", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.find(".tab-nav-panel").classes()).not.toContain("is-open");
    });

    it("renders panel links matching main nav items", async () => {
      const { wrapper } = await mountCollapsed();
      const panelLinks = wrapper.findAll(".tab-nav-panel-link");
      expect(panelLinks.length).toBe(3);
      expect(panelLinks[0]!.text()).toContain("Home");
      expect(panelLinks[1]!.text()).toContain("About");
      expect(panelLinks[2]!.text()).toContain("Contact");
    });

    it("toggles isMenuOpen on burger click", async () => {
      const { wrapper, setup } = await mountCollapsed();
      expect(setup.isMenuOpen).toBe(false);
      await wrapper.find(".tab-nav-burger").trigger("click");
      expect(setup.isMenuOpen).toBe(true);
      await wrapper.find(".tab-nav-burger").trigger("click");
      expect(setup.isMenuOpen).toBe(false);
    });

    it("applies menu-open class when menu is open", async () => {
      const { wrapper } = await mountCollapsed();
      await wrapper.find(".tab-nav-burger").trigger("click");
      await nextTick();
      expect(wrapper.classes()).toContain("menu-open");
    });

    it("burger has aria-expanded true when menu is open", async () => {
      const { wrapper } = await mountCollapsed();
      await wrapper.find(".tab-nav-burger").trigger("click");
      await nextTick();
      expect(wrapper.find(".tab-nav-burger").attributes("aria-expanded")).toBe("true");
    });

    it("panel has is-open class when menu is open", async () => {
      const { wrapper } = await mountCollapsed();
      await wrapper.find(".tab-nav-burger").trigger("click");
      await nextTick();
      expect(wrapper.find(".tab-nav-panel").classes()).toContain("is-open");
    });

    it("panel is inert when menu is closed", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.find(".tab-nav-panel").attributes("inert")).toBeDefined();
    });

    it("panel is not inert when menu is open", async () => {
      const { wrapper } = await mountCollapsed();
      await wrapper.find(".tab-nav-burger").trigger("click");
      await nextTick();
      expect(wrapper.find(".tab-nav-panel").attributes("inert")).toBeUndefined();
    });

    it("panel has aria-controls pointing to tab-nav-panel", async () => {
      const { wrapper } = await mountCollapsed();
      expect(wrapper.find(".tab-nav-burger").attributes("aria-controls")).toBe("tab-nav-panel");
    });
  });
});
