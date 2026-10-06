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

// Fake layout: the main nav ends at mainNavRight and each item is 100px wide, laid out in
// document order, so item n (0-based) ends at (n + 1) * 100.
const mockGeometry = (mainNavRight: number) =>
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    let right = 0;
    if (this.classList.contains("main-navigation")) right = mainNavRight;
    if (this.classList.contains("main-navigation-item")) {
      const items = Array.from(this.closest(".main-navigation")?.querySelectorAll(".main-navigation-item") ?? []);
      right = (items.indexOf(this) + 1) * 100;
    }
    return { left: 0, top: 0, bottom: 0, x: 0, y: 0, height: 0, right, width: right, toJSON: () => ({}) } as DOMRect;
  });

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

  it("does not close an open dropdown instantly when a sibling item is only briefly hovered in transit", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const details = wrapper.find(".main-navigation-details");
    await wrapper.find(".main-navigation-details-summary").trigger("click");
    expect(details.attributes("open")).toBe("");

    const siblingItem = wrapper.find('[data-group-key="firstNav"][data-local-index="0"]');
    await siblingItem.trigger("mouseenter");
    // Close is scheduled, not immediate — still open right after the hover.
    expect(details.attributes("open")).toBe("");
  });

  it("closes an open dropdown after the hover-intent delay once the cursor moved on", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const details = wrapper.find(".main-navigation-details");
    await wrapper.find(".main-navigation-details-summary").trigger("click");
    expect(details.attributes("open")).toBe("");

    const siblingItem = wrapper.find('[data-group-key="firstNav"][data-local-index="0"]');
    await siblingItem.trigger("mouseenter");
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(details.attributes("open")).toBeUndefined();
  });

  it("cancels the scheduled close when the sub-nav panel itself is reached", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const details = wrapper.find(".main-navigation-details");
    await wrapper.find(".main-navigation-details-summary").trigger("click");
    expect(details.attributes("open")).toBe("");

    const siblingItem = wrapper.find('[data-group-key="firstNav"][data-local-index="0"]');
    await siblingItem.trigger("mouseenter");
    await wrapper.find(".main-navigation-sub-nav").trigger("mouseenter");

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(details.attributes("open")).toBe("");
  });

  // A real mouse click moves focus to the clicked element before the click event
  // fires — so a click on a summary the mouse already hover-opened dispatches
  // BOTH a `focusin` (handleSummaryHover) and a `click` (handleSummaryAction) in
  // quick succession. vue-test-utils' `.trigger("click")` doesn't synthesize that
  // implicit focus side effect on its own, so these tests fire both events
  // explicitly to reproduce what a real click actually does.
  it("closes cleanly (no reopen) when clicking a summary the mouse had just hover-opened", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    const summary = wrapper.find(".main-navigation-details-summary");
    const details = wrapper.find(".main-navigation-details");

    await summary.trigger("mouseenter");
    expect(details.attributes("open")).toBe("");

    // Simulate the real browser sequence a click produces: focus moves first,
    // then the click event itself fires.
    await summary.trigger("focusin");
    await summary.trigger("click");

    expect(details.attributes("open")).toBeUndefined();
  });

  it("closes cleanly (no reopen) when clicking to close a dropdown switched-to via hovering away from another", async () => {
    const responsiveNavLinksTwoDropdowns: ResponsiveHeaderProp = {
      firstNav: [
        {
          name: "Components",
          childLinksTitle: "UI Components",
          childLinks: [{ name: "Buttons", path: "/forms/examples/buttons" }],
        },
        {
          name: "Layouts",
          childLinksTitle: "UI Layouts",
          childLinks: [{ name: "Page Row", path: "/ui/page-row" }],
        },
      ],
    };
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: responsiveNavLinksTwoDropdowns },
    });
    const summaries = wrapper.findAll(".main-navigation-details-summary");
    const detailsElements = wrapper.findAll(".main-navigation-details");

    await summaries[0]!.trigger("mouseenter");
    expect(detailsElements[0]!.attributes("open")).toBe("");

    // Hover away to the second dropdown — closes the first, opens the second.
    await summaries[1]!.trigger("mouseenter");
    expect(detailsElements[0]!.attributes("open")).toBeUndefined();
    expect(detailsElements[1]!.attributes("open")).toBe("");

    await summaries[1]!.trigger("focusin");
    await summaries[1]!.trigger("click");

    expect(detailsElements[1]!.attributes("open")).toBeUndefined();
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

  it("hides only the items that end past the main nav's right edge", async () => {
    const geometry = mockGeometry(250);
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    await triggerGeometryPass();

    expect(wrapper.find(".navigation").classes()).toContain("geometry-ready");
    const hidden = wrapper.findAll(".main-navigation-item").map((item) => item.classes().includes("visually-hidden"));
    expect(hidden).toEqual([false, false, true, true]);
    expect(wrapper.find(".overflow-details").classes()).not.toContain("visually-hidden");
    geometry.mockRestore();
  });

  it("keeps an item that ends exactly at the main nav's right edge, so a flush-right last item isn't always hidden", async () => {
    const geometry = mockGeometry(400);
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    await triggerGeometryPass();

    wrapper.findAll(".main-navigation-item").forEach((item) => expect(item.classes()).not.toContain("visually-hidden"));
    expect(wrapper.find(".overflow-details").classes()).toContain("visually-hidden");
    geometry.mockRestore();
  });

  it("gives the icon-only overflow button an accessible name", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.find(".overflow-details-summary").attributes("aria-label")).toBe("More navigation");
    await wrapper.setProps({ overflowButtonLabel: "Menü" });
    expect(wrapper.find(".overflow-details-summary").attributes("aria-label")).toBe("Menü");
  });

  it("builds the submenu aria-label from submenuAriaLabel", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks, submenuAriaLabel: "Untermenü {title}" },
    });
    expect(wrapper.find(".main-navigation-details-summary").attributes("aria-label")).toBe("Untermenü UI Components");
  });

  it("falls back to name for a dropdown with no childLinksTitle", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: { firstNav: [{ name: "Services", childLinks: [{ name: "A", path: "/a" }] }] } },
    });
    const summary = wrapper.find(".main-navigation-details-summary");
    expect(summary.text()).toBe("Services");
    expect(summary.attributes("aria-label")).toBe("Services submenu");
  });

  it("renders child links with duplicate names without key clashes", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: {
        responsiveNavLinks: {
          firstNav: [
            { name: "Dup", childLinksTitle: "Dup", childLinks: [{ name: "Same", path: "/a" }, { name: "Same", path: "/b" }] },
          ],
        },
      },
    });
    expect(wrapper.findAll(".main-navigation-sub-nav-link")).toHaveLength(2);
    expect(warn.mock.calls.some(([msg]) => String(msg).includes("Duplicate keys"))).toBe(false);
    warn.mockRestore();
  });

  it("shows the overflow button for any group key once an item is hidden", async () => {
    const geometry = mockGeometry(150);
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: { main: [{ name: "Home", path: "/" }, { name: "About", path: "/about" }] } },
    });
    await triggerGeometryPass();
    expect(wrapper.find(".overflow-details").classes()).not.toContain("visually-hidden");
    geometry.mockRestore();
  });

  it("keeps the overflow button hidden when there are no nav items", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: {} },
    });
    await triggerGeometryPass();
    expect(wrapper.find(".navigation").classes()).toContain("geometry-ready");
    expect(wrapper.find(".overflow-details").classes()).toContain("visually-hidden");
  });

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(ResponsiveHeader, {
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Same-page anchor links ─────────────────────────────────────────────

  describe("anchor links", () => {
    const anchorLinks: ResponsiveHeaderProp = {
      firstNav: [
        { name: "Home", path: "#home" },
        { name: "About", path: "#about" },
        { name: "Blog", path: "/blog" },
      ],
    };

    it("renders #anchor paths as plain links and route paths as NuxtLinks", async () => {
      const wrapper = await mountSuspended(ResponsiveHeader, { props: { responsiveNavLinks: anchorLinks } });
      const links = wrapper.findAll(".main-navigation-link");
      expect(links[0]!.attributes("href")).toBe("#home");
      expect(links[2]!.attributes("href")).toBe("/blog");
    });

    it("marks the first anchor item active on load", async () => {
      const wrapper = await mountSuspended(ResponsiveHeader, { props: { responsiveNavLinks: anchorLinks } });
      await nextTick();
      const items = wrapper.findAll(".main-navigation-item");
      expect(items[0]!.classes()).toContain("is-active");
      expect(items[1]!.classes()).not.toContain("is-active");
    });

    it("moves the active item to a clicked anchor and scrolls instead of jumping", async () => {
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
      const section = document.createElement("section");
      section.id = "about";
      section.scrollIntoView = vi.fn();
      document.body.appendChild(section);
      const wrapper = await mountSuspended(ResponsiveHeader, { props: { responsiveNavLinks: anchorLinks } });
      await wrapper.findAll(".main-navigation-link")[1]!.trigger("click");
      expect(section.scrollIntoView).toHaveBeenCalled();
      expect(wrapper.findAll(".main-navigation-item")[1]!.classes()).toContain("is-active");
      section.remove();
    });
  });
});
