import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import SiteNavigation from "../SiteNavigation.vue";
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

// Capture the ResizeObserver callback so tests can trigger resize events
let capturedResizeCallback: (entries: ResizeObserverEntry[]) => void = () => {};
const mockResizeObserver = vi.fn((callback: (entries: ResizeObserverEntry[]) => void) => {
  capturedResizeCallback = callback;
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});
vi.stubGlobal("ResizeObserver", mockResizeObserver);

const defaultNavItemData: NavItemData = {
  main: [
    { text: "Home", href: "/" },
    { text: "Services", href: "/services" },
    { text: "Contact", href: "/contact" },
  ],
};

const createWrapper = async (props: Record<string, unknown> = {}) => {
  return mountSuspended(SiteNavigation, {
    props: { navItemData: defaultNavItemData, ...props },
  });
};

/**
 * Force the component into a collapsed state by faking element dimensions and
 * firing the captured ResizeObserver callback.
 */
const triggerCollapse = async (wrapper: Awaited<ReturnType<typeof createWrapper>>) => {
  const navListEl = wrapper.find(".site-nav-list").element as HTMLElement;
  // Make the list appear wider than its container
  Object.defineProperty(navListEl, "scrollWidth", { value: 1000, configurable: true });
  // Fire the ResizeObserver callback — this calls checkOverflow() in the component
  capturedResizeCallback([]);
  await nextTick();
};

describe("SiteNavigation", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("default (expanded)", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("align center", async () => {
      wrapper = await createWrapper({ align: "center" });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("align right", async () => {
      wrapper = await createWrapper({ align: "right" });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // -------------------------
  // Rendering
  // -------------------------
  describe("Rendering", () => {
    it("mounts without error", async () => {
      wrapper = await createWrapper();
      expect(wrapper.vm).toBeTruthy();
    });

    it("renders a nav element as root", async () => {
      wrapper = await createWrapper();
      expect(wrapper.element.tagName.toLowerCase()).toBe("nav");
    });

    it("renders the nav list by default (not collapsed)", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".site-nav-list").exists()).toBe(true);
    });

    it("does not render the burger button when not collapsed", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".site-nav-burger").exists()).toBe(false);
    });

    it("does not render the panel when not collapsed", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".site-nav-panel").exists()).toBe(false);
    });

    it("renders the correct number of nav items", async () => {
      wrapper = await createWrapper();
      const items = wrapper.findAll(".site-nav-list li");
      expect(items.length).toBe(3);
    });

    it("renders item text correctly", async () => {
      wrapper = await createWrapper();
      const links = wrapper.findAll(".site-nav-link");
      expect(links[0]!.text()).toContain("Home");
      expect(links[1]!.text()).toContain("Services");
      expect(links[2]!.text()).toContain("Contact");
    });

    it("renders item href correctly", async () => {
      wrapper = await createWrapper();
      const links = wrapper.findAll(".site-nav-link");
      expect(links[0]!.attributes("href")).toBe("/");
      expect(links[1]!.attributes("href")).toBe("/services");
    });

    it("applies cssName as a class on the li element", async () => {
      const navItemData: NavItemData = {
        main: [{ text: "Home", href: "/", cssName: "home-link" }],
      };
      wrapper = await createWrapper({ navItemData });
      expect(wrapper.find(".site-nav-list li").classes()).toContain("home-link");
    });
  });

  // -------------------------
  // Props
  // -------------------------
  describe("Props", () => {
    it("applies default align class", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".site-navigation").classes()).toContain("site-navigation--left");
    });

    it("applies center align class", async () => {
      wrapper = await createWrapper({ align: "center" });
      expect(wrapper.find(".site-navigation").classes()).toContain("site-navigation--center");
    });

    it("applies right align class", async () => {
      wrapper = await createWrapper({ align: "right" });
      expect(wrapper.find(".site-navigation").classes()).toContain("site-navigation--right");
    });

    it("applies styleClassPassthrough classes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["custom-class", "another-class"] });
      expect(wrapper.find(".site-navigation").classes()).toContain("custom-class");
      expect(wrapper.find(".site-navigation").classes()).toContain("another-class");
    });

    it("updates classes when styleClassPassthrough prop changes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["initial-class"] });
      expect(wrapper.find(".site-navigation").classes()).toContain("initial-class");

      await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
      await nextTick();

      expect(wrapper.find(".site-navigation").classes()).toContain("updated-class");
      expect(wrapper.find(".site-navigation").classes()).not.toContain("initial-class");
    });
  });

  // -------------------------
  // Accessibility
  // -------------------------
  describe("Accessibility", () => {
    it("has aria-label on the nav element", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".site-navigation").attributes("aria-label")).toBe("Site navigation");
    });

    it("has is-loaded class after mount", async () => {
      wrapper = await createWrapper();
      await nextTick();
      expect(wrapper.find(".site-navigation").classes()).toContain("is-loaded");
    });
  });

  // -------------------------
  // Collapsed state
  // -------------------------
  describe("Collapsed state", () => {
    it("adds is-collapsed class when nav list overflows container", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      expect(wrapper.find(".site-navigation").classes()).toContain("is-collapsed");
    });

    it("shows burger button when collapsed", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      expect(wrapper.find(".site-nav-burger").exists()).toBe(true);
    });

    it("hides nav list when collapsed", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      expect(wrapper.find(".site-nav-list").exists()).toBe(false);
    });

    it("shows panel element when collapsed", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      expect(wrapper.find(".site-nav-panel").exists()).toBe(true);
    });

    it("panel renders correct items in collapsed state", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      const links = wrapper.findAll(".site-nav-panel-link");
      expect(links.length).toBe(3);
      expect(links[0]!.text()).toContain("Home");
    });

    it("burger aria-controls points to the panel", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      expect(wrapper.find(".site-nav-burger").attributes("aria-controls")).toBe("site-nav-panel");
    });

    it("burger aria-expanded is false when menu is closed", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      expect(wrapper.find(".site-nav-burger").attributes("aria-expanded")).toBe("false");
    });

    it("panel does not have is-open class when menu is closed", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      expect(wrapper.find(".site-nav-panel").classes()).not.toContain("is-open");
    });
  });

  // -------------------------
  // Reactivity — burger menu open/close
  // -------------------------
  describe("Reactivity", () => {
    it("clicking burger opens the menu", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      await wrapper.find(".site-nav-burger").trigger("click");
      await nextTick();
      expect(wrapper.find(".site-nav-panel").classes()).toContain("is-open");
      expect(wrapper.find(".site-nav-burger").classes()).toContain("is-open");
      expect(wrapper.find(".site-navigation").classes()).toContain("menu-open");
    });

    it("burger aria-expanded is true when menu is open", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      await wrapper.find(".site-nav-burger").trigger("click");
      await nextTick();
      expect(wrapper.find(".site-nav-burger").attributes("aria-expanded")).toBe("true");
    });

    it("clicking burger again closes the menu", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      await wrapper.find(".site-nav-burger").trigger("click");
      await nextTick();
      await wrapper.find(".site-nav-burger").trigger("click");
      await nextTick();
      expect(wrapper.find(".site-nav-panel").classes()).not.toContain("is-open");
    });

    it("clicking a panel link closes the menu", async () => {
      wrapper = await createWrapper();
      await triggerCollapse(wrapper);
      await wrapper.find(".site-nav-burger").trigger("click");
      await nextTick();
      await wrapper.find(".site-nav-panel-link").trigger("click");
      await nextTick();
      expect(wrapper.find(".site-nav-panel").classes()).not.toContain("is-open");
    });
  });
});
