import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import ResponsiveHeader from "../ResponsiveHeader.vue";
import type { ResponsiveHeaderProp } from "../../../../types/components";

// ─── ResizeObserver mock ────────────────────────────────────────────────────
// useResizeObserver (vueuse) only constructs `new ResizeObserver(callback)` and
// calls `.observe()` — it never invokes the callback itself (that's the native
// browser's job). This mock captures the callback so tests can trigger the
// geometry pass manually and deterministically, rather than relying on real
// layout (jsdom always reports zero-size rects, which is itself a valid,
// deterministic case exercised below).
let resizeObserverCallback: ResizeObserverCallback | null = null;

class MockResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    resizeObserverCallback = cb;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// runGeometryPass's internal chain is pure microtask/Promise-based (updateNavigationConfig
// resolves immediately; the only real waits are `await nextTick()`) — no real timers
// involved, so plain nextTick() cycles settle it. Do NOT use @vue/test-utils'
// flushPromises() here: it schedules its resolve via a real timer internally, which
// never fires under this repo's global vi.useFakeTimers() and hangs the test.
const triggerGeometryPass = async () => {
  resizeObserverCallback?.([] as unknown as ResizeObserverEntry[], {} as ResizeObserver);
  for (let i = 0; i < 8; i++) {
    await nextTick();
  }
};

const navLinks: ResponsiveHeaderProp = {
  firstNav: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about", iconName: "mdi:home" },
    {
      name: "Components",
      childLinksTitle: "UI Components",
      childLinks: [
        { name: "Buttons", path: "/forms/examples/buttons" },
        { name: "Tabs", path: "/ui/tabs" },
      ],
    },
  ],
  secondNav: [{ name: "Contact", path: "/contact" }],
};

describe("ResponsiveHeader", () => {
  beforeEach(() => {
    resizeObserverCallback = null;
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a plain NuxtLink for items with a path", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const link = wrapper.find('a[href="/"]');
    expect(link.exists()).toBe(true);
    expect(link.classes()).toContain("main-navigation-link");
  });

  it("renders a details/summary dropdown for items with childLinks", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const summary = wrapper.find(".main-navigation-details-summary");
    expect(summary.exists()).toBe(true);
    expect(summary.text()).toContain("UI Components");
    expect(wrapper.findAll(".main-navigation-sub-nav-link")).toHaveLength(2);
  });

  it("renders a decorator icon only for items with iconName", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const homeLink = wrapper.find('a[href="/"]');
    const aboutLink = wrapper.find('a[href="/about"]');
    expect(homeLink.find(".decorator-icon").exists()).toBe(false);
    expect(aboutLink.find(".decorator-icon").exists()).toBe(true);
  });

  it("marks the item matching the current route as active", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
      route: "/about",
    });
    const items = wrapper.findAll(".main-navigation-item");
    const activeItem = items.find((item) => item.find('a[href="/about"]').exists());
    expect(activeItem?.classes()).toContain("is-active");
  });

  it("marks a dropdown item active when one of its childLinks matches the current route", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
      route: "/ui/tabs",
    });
    const items = wrapper.findAll(".main-navigation-item");
    const activeItem = items.find((item) => item.find(".main-navigation-details-summary").exists());
    expect(activeItem?.classes()).toContain("is-active");
  });

  it("uses default overflow summary icons when not provided", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const icons = wrapper.findAll(".overflow-details-summary .icon");
    expect(icons[0]?.attributes("name") ?? icons[0]?.html()).toBeTruthy();
    expect(wrapper.html()).toContain("gravity-ui:ellipsis");
    expect(wrapper.html()).toContain("gravity-ui:bars");
  });

  it("uses custom overflow summary icons when provided", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: {
        responsiveNavLinks: navLinks,
        overflowDetailsSummaryIcons: { more: "mdi:dots-horizontal", burger: "mdi:menu" },
      },
    });
    expect(wrapper.html()).toContain("mdi:dots-horizontal");
    expect(wrapper.html()).toContain("mdi:menu");
  });

  it("does not render the secondaryNavigation slot when not provided", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.text()).not.toContain("Settings link");
  });

  it("renders the secondaryNavigation slot when provided", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
      slots: { secondaryNavigation: "<span>Settings link</span>" },
    });
    expect(wrapper.text()).toContain("Settings link");
  });

  it("applies styleClassPassthrough to the root element", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks, styleClassPassthrough: ["site-header-nav"] },
    });
    expect(wrapper.find(".navigation.site-header-nav").exists()).toBe(true);
  });

  it("toggles a dropdown's open attribute on summary click", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const details = wrapper.find(".main-navigation-details");
    const summary = wrapper.find(".main-navigation-details-summary");
    expect(details.attributes("open")).toBeUndefined();

    await summary.trigger("click");
    expect(details.attributes("open")).toBe("");

    await summary.trigger("click");
    expect(details.attributes("open")).toBeUndefined();
  });

  it("does not auto-open a dropdown on hover when allowExpandOnGesture is false", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks, allowExpandOnGesture: false },
    });
    const details = wrapper.find(".main-navigation-details");
    const summary = wrapper.find(".main-navigation-details-summary");

    await summary.trigger("mouseenter");
    expect(details.attributes("open")).toBeUndefined();
  });

  it("passes mainNavigationState through to NavigationItems in the overflow panel", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const overflowNav = wrapper.find(".overflow-details-nav");
    expect(overflowNav.exists()).toBe(true);
    expect(overflowNav.text()).toContain("Home");
    expect(overflowNav.text()).toContain("UI Components");
  });

  it("completes the geometry pass and marks all items visually-hidden under jsdom's zero-size layout", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    await triggerGeometryPass();

    // jsdom reports every rect as 0×0, so `rect.right + margin + gap < wrapperRect.right`
    // (0 + 0 + 12 < 0) is always false — every item correctly collapses into overflow.
    expect(wrapper.find(".navigation").classes()).toContain("geometry-ready");
    const items = wrapper.findAll(".main-navigation-item");
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => expect(item.classes()).toContain("visually-hidden"));
  });

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
