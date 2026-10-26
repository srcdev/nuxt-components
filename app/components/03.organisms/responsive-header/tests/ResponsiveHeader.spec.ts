import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, nextTick } from "vue";
import ResponsiveHeader from "../ResponsiveHeader.vue";
import type { ResponsiveHeaderProp } from "../../../../types/components";

type MountHeaderOptions = NonNullable<Parameters<typeof mountSuspended>[1]>;

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountHeader = async (options: MountHeaderOptions = {}) => {
  const wrapper = await mountSuspended(ResponsiveHeader, options);
  mounted.push(wrapper);
  return wrapper;
};

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
const rect = (left: number, width: number): DOMRect =>
  ({
    left,
    right: left + width,
    top: 0,
    bottom: 0,
    x: left,
    y: 0,
    height: 0,
    width,
    toJSON: () => ({}),
  }) as DOMRect;

const mockCollapseLayout = ({
  wrapperWidth,
  firstNavRight,
  secondaryLeft,
  mainNavRight,
}: {
  wrapperWidth: number;
  firstNavRight: number;
  secondaryLeft: number;
  mainNavRight: number;
}) =>
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    if (this.classList.contains("navigation")) return rect(0, wrapperWidth);
    if (this.classList.contains("secondary-navigation")) return rect(secondaryLeft, 40);
    if (this.classList.contains("main-navigation-list")) {
      const lists = Array.from(this.parentElement?.querySelectorAll(":scope > .main-navigation-list") ?? []);
      if (lists[0] === this) return rect(0, firstNavRight);
    }
    if (
      this.classList.contains("main-navigation") &&
      !this.classList.contains("main-navigation-item") &&
      !this.classList.contains("main-navigation-list")
    ) {
      return rect(0, mainNavRight);
    }
    if (this.classList.contains("main-navigation-item")) {
      const items = Array.from(this.closest(".main-navigation")?.querySelectorAll(".main-navigation-item") ?? []);
      const index = Math.max(items.indexOf(this), 0);
      return rect(index * 100, 100);
    }
    return rect(0, 0);
  });

const hiddenFlags = (wrapper: Awaited<ReturnType<typeof mountHeader>>) =>
  wrapper.findAll(".main-navigation-item").map((item) => item.classes().includes("visually-hidden"));

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

  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  it("mounts without error", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a plain NuxtLink for items with a path", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const link = wrapper.find('a[href="/"]');
    expect(link.exists()).toBe(true);
    expect(link.classes()).toContain("main-navigation-link");
  });

  it("renders a details/summary dropdown for items with childLinks", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const summary = wrapper.find(".main-navigation-details-summary");
    expect(summary.exists()).toBe(true);
    expect(summary.text()).toContain("UI Components");
    expect(wrapper.findAll(".main-navigation-sub-nav-link")).toHaveLength(2);
  });

  it("renders a decorator icon only for items with iconName", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const homeLink = wrapper.find('a[href="/"]');
    const aboutLink = wrapper.find('a[href="/about"]');
    expect(homeLink.find(".decorator-icon").exists()).toBe(false);
    expect(aboutLink.find(".decorator-icon").exists()).toBe(true);
  });

  it("marks the item matching the current route as active", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
      route: "/about",
    });
    const items = wrapper.findAll(".main-navigation-item");
    const activeItem = items.find((item) => item.find('a[href="/about"]').exists());
    expect(activeItem?.classes()).toContain("is-active");
  });

  it("marks a dropdown item active when one of its childLinks matches the current route", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
      route: "/ui/tabs",
    });
    const items = wrapper.findAll(".main-navigation-item");
    const activeItem = items.find((item) => item.find(".main-navigation-details-summary").exists());
    expect(activeItem?.classes()).toContain("is-active");
  });

  it("uses default overflow summary icons when not provided", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const icons = wrapper.findAll(".overflow-details-summary .icon");
    expect(icons[0]?.attributes("name") ?? icons[0]?.html()).toBeTruthy();
    expect(wrapper.html()).toContain("gravity-ui:ellipsis");
    expect(wrapper.html()).toContain("gravity-ui:bars");
  });

  it("uses custom overflow summary icons when provided", async () => {
    const wrapper = await mountHeader({
      props: {
        responsiveNavLinks: navLinks,
        overflowDetailsSummaryIcons: { more: "mdi:dots-horizontal", burger: "mdi:menu" },
      },
    });
    expect(wrapper.html()).toContain("mdi:dots-horizontal");
    expect(wrapper.html()).toContain("mdi:menu");
  });

  it("does not render the secondaryNavigation slot when not provided", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.text()).not.toContain("Settings link");
  });

  it("renders the secondaryNavigation slot when provided", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
      slots: { secondaryNavigation: "<span>Settings link</span>" },
    });
    expect(wrapper.text()).toContain("Settings link");
  });

  it("applies styleClassPassthrough to the root element", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks, styleClassPassthrough: ["site-header-nav"] },
    });
    expect(wrapper.find(".navigation.site-header-nav").exists()).toBe(true);
  });

  it("toggles a dropdown's open attribute on summary click", async () => {
    const wrapper = await mountHeader({
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
    const wrapper = await mountHeader({
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
    const wrapper = await mountHeader({
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
    const wrapper = await mountHeader({
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
    const wrapper = await mountHeader({
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
    const wrapper = await mountHeader({
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

  it("stays open when a real click focuses the summary before the click", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const summary = wrapper.find(".main-navigation-details-summary");
    const details = wrapper.find(".main-navigation-details");

    await summary.trigger("pointerdown");
    await summary.trigger("focusin");
    await summary.trigger("click", { detail: 1 });

    expect(details.attributes("open")).toBe("");
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(details.attributes("open")).toBe("");
  });

  it("keeps a dropdown open when focus moves into its summary", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const details = wrapper.find(".main-navigation-details");
    await wrapper.find(".main-navigation-details-summary").trigger("focusin");
    expect(details.attributes("open")).toBe("");

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(details.attributes("open")).toBe("");
  });

  it("does not toggle a dropdown on an unrelated key", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const details = wrapper.find(".main-navigation-details");
    await wrapper.find(".main-navigation-details-summary").trigger("keyup", { key: "ArrowDown" });
    expect(details.attributes("open")).toBeUndefined();
  });

  it("does not auto-open a dropdown on hover when allowExpandOnGesture is false", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks, allowExpandOnGesture: false },
    });
    const details = wrapper.find(".main-navigation-details");
    const summary = wrapper.find(".main-navigation-details-summary");

    await summary.trigger("mouseenter");
    expect(details.attributes("open")).toBeUndefined();
  });

  it("passes mainNavigationState through to NavigationItems in the overflow panel", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    const overflowNav = wrapper.find(".overflow-details-nav");
    expect(overflowNav.exists()).toBe(true);
    expect(overflowNav.text()).toContain("Home");
    expect(overflowNav.text()).toContain("UI Components");
  });

  it("hides only the items that end past the main nav's right edge", async () => {
    const geometry = mockGeometry(250);
    const wrapper = await mountHeader({
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
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    await triggerGeometryPass();

    wrapper.findAll(".main-navigation-item").forEach((item) => expect(item.classes()).not.toContain("visually-hidden"));
    expect(wrapper.find(".overflow-details").classes()).toContain("visually-hidden");
    geometry.mockRestore();
  });

  it("collapses every item when the wrapper is narrower than collapseBreakpoint", async () => {
    const geometry = mockCollapseLayout({
      wrapperWidth: 500,
      firstNavRight: 400,
      secondaryLeft: 460,
      mainNavRight: 900,
    });
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks, collapseBreakpoint: 800 },
    });
    await triggerGeometryPass();

    expect(hiddenFlags(wrapper)).toEqual([true, true, true, true]);
    expect(wrapper.find(".overflow-details").classes()).not.toContain("visually-hidden");
    geometry.mockRestore();
  });

  it("keeps per-item collapse when the wrapper is wider than collapseBreakpoint, even if the navs overlap", async () => {
    const geometry = mockCollapseLayout({
      wrapperWidth: 900,
      firstNavRight: 400,
      secondaryLeft: 100,
      mainNavRight: 900,
    });
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks, collapseBreakpoint: 800 },
    });
    await triggerGeometryPass();

    expect(hiddenFlags(wrapper)).toEqual([false, false, false, false]);
    geometry.mockRestore();
  });

  it("collapses when the secondary nav intersects the main nav and no pixel breakpoint is set", async () => {
    const geometry = mockCollapseLayout({
      wrapperWidth: 900,
      firstNavRight: 400,
      secondaryLeft: 100,
      mainNavRight: 900,
    });
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks, collapseAtMainNavIntersection: true },
    });
    await triggerGeometryPass();

    expect(hiddenFlags(wrapper)).toEqual([true, true, true, true]);
    geometry.mockRestore();
  });

  it("uses the first group for intersection collapse when it is not named firstNav", async () => {
    const geometry = mockCollapseLayout({
      wrapperWidth: 900,
      firstNavRight: 400,
      secondaryLeft: 100,
      mainNavRight: 900,
    });
    const wrapper = await mountHeader({
      props: {
        responsiveNavLinks: { main: navLinks.firstNav! },
        collapseAtMainNavIntersection: true,
      },
    });
    await triggerGeometryPass();

    expect(hiddenFlags(wrapper)).toEqual([true, true, true]);
    geometry.mockRestore();
  });

  // A single end-aligned group always ends exactly at the reserved gap (secondary left - 12).
  it("does not collapse a single end-aligned group that ends exactly at the gap", async () => {
    const geometry = mockCollapseLayout({
      wrapperWidth: 900,
      firstNavRight: 848,
      secondaryLeft: 860,
      mainNavRight: 848,
    });
    const wrapper = await mountHeader({
      props: {
        responsiveNavLinks: { main: navLinks.firstNav! },
        collapseAtMainNavIntersection: true,
      },
    });
    await triggerGeometryPass();

    expect(hiddenFlags(wrapper)).toEqual([false, false, false]);
    geometry.mockRestore();
  });

  it("does not collapse an end-aligned group when the secondary nav sits on a sub-pixel", async () => {
    const geometry = mockCollapseLayout({
      wrapperWidth: 900,
      firstNavRight: 848.5,
      secondaryLeft: 860.5,
      mainNavRight: 848,
    });
    const wrapper = await mountHeader({
      props: {
        responsiveNavLinks: { main: navLinks.firstNav! },
        collapseAtMainNavIntersection: true,
      },
    });
    await triggerGeometryPass();

    expect(hiddenFlags(wrapper)).toEqual([false, false, false]);
    geometry.mockRestore();
  });

  it("collapses a single group once it runs past the gap", async () => {
    const geometry = mockCollapseLayout({
      wrapperWidth: 900,
      firstNavRight: 849,
      secondaryLeft: 860,
      mainNavRight: 848,
    });
    const wrapper = await mountHeader({
      props: {
        responsiveNavLinks: { main: navLinks.firstNav! },
        collapseAtMainNavIntersection: true,
      },
    });
    await triggerGeometryPass();

    expect(hiddenFlags(wrapper)).toEqual([true, true, true]);
    geometry.mockRestore();
  });

  it("does not write measurement config into the consumer's nav data, and follows later link changes", async () => {
    const links: ResponsiveHeaderProp = { firstNav: [{ name: "Home", path: "/" }] };
    const geometry = mockGeometry(400);
    const wrapper = await mountHeader({ props: { responsiveNavLinks: links } });
    await triggerGeometryPass();
    expect(links.firstNav![0]).not.toHaveProperty("config");

    await wrapper.setProps({
      responsiveNavLinks: {
        firstNav: [
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
        ],
      },
    });
    await triggerGeometryPass();

    expect(wrapper.text()).toContain("News");
    expect(links.firstNav).toHaveLength(1);
    expect(links.firstNav![0]).not.toHaveProperty("config");
    geometry.mockRestore();
  });

  it("does not mark itself as a banner landmark", async () => {
    const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
    expect(wrapper.attributes("role")).toBeUndefined();
  });

  it("does not use the menu role for site navigation", async () => {
    const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(wrapper.find('[role="menuitem"]').exists()).toBe(false);
  });

  it("shares a details name within one header but not across headers", async () => {
    const twoDropdowns: ResponsiveHeaderProp = {
      firstNav: [
        { name: "Components", childLinksTitle: "Components", childLinks: [{ name: "Buttons", path: "/buttons" }] },
        { name: "Layouts", childLinksTitle: "Layouts", childLinks: [{ name: "Page row", path: "/page-row" }] },
      ],
    };
    const Host = defineComponent({
      setup: () => () => [
        h(ResponsiveHeader, { responsiveNavLinks: twoDropdowns }),
        h(ResponsiveHeader, { responsiveNavLinks: twoDropdowns }),
      ],
    });
    const wrapper = await mountSuspended(Host);
    mounted.push(wrapper);

    const headers = wrapper.findAll(".navigation");
    const mainNames = headers.map((header) =>
      header.findAll(".main-navigation-details").map((details) => details.attributes("name"))
    );
    expect(mainNames[0]?.[0]).toBeTruthy();
    expect(mainNames[0]?.[0]).toBe(mainNames[0]?.[1]);
    expect(mainNames[0]?.[0]).not.toBe(mainNames[1]?.[0]);
    expect(mainNames[0]?.[0]).not.toBe("navigation-group");

    const overflowNames = headers.map((header) => header.find(".overflow-details").attributes("name"));
    expect(overflowNames[0]).toBeTruthy();
    expect(overflowNames[0]).not.toBe(overflowNames[1]);
    expect(overflowNames[0]).not.toBe("overflow-group");
  });

  it("gives the icon-only overflow button an accessible name", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks },
    });
    expect(wrapper.find(".overflow-details-summary").attributes("aria-label")).toBe("More navigation");
    await wrapper.setProps({ overflowButtonLabel: "Menü" });
    expect(wrapper.find(".overflow-details-summary").attributes("aria-label")).toBe("Menü");
  });

  it("builds the submenu aria-label from submenuAriaLabel", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: navLinks, submenuAriaLabel: "Untermenü {title}" },
    });
    expect(wrapper.find(".main-navigation-details-summary").attributes("aria-label")).toBe("Untermenü UI Components");
  });

  it("falls back to name for a dropdown with no childLinksTitle", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: { firstNav: [{ name: "Services", childLinks: [{ name: "A", path: "/a" }] }] } },
    });
    const summary = wrapper.find(".main-navigation-details-summary");
    expect(summary.text()).toBe("Services");
    expect(summary.attributes("aria-label")).toBe("Services submenu");
  });

  it("renders child links with duplicate names without key clashes", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountHeader({
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
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: { main: [{ name: "Home", path: "/" }, { name: "About", path: "/about" }] } },
    });
    await triggerGeometryPass();
    expect(wrapper.find(".overflow-details").classes()).not.toContain("visually-hidden");
    geometry.mockRestore();
  });

  it("keeps the overflow button hidden when there are no nav items", async () => {
    const wrapper = await mountHeader({
      props: { responsiveNavLinks: {} },
    });
    await triggerGeometryPass();
    expect(wrapper.find(".navigation").classes()).toContain("geometry-ready");
    expect(wrapper.find(".overflow-details").classes()).toContain("visually-hidden");
  });

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountHeader({
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
      const wrapper = await mountHeader({ props: { responsiveNavLinks: anchorLinks } });
      const links = wrapper.findAll(".main-navigation-link");
      expect(links[0]!.attributes("href")).toBe("#home");
      expect(links[2]!.attributes("href")).toBe("/blog");
    });

    it("marks the first anchor item active on load", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: anchorLinks } });
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
      const wrapper = await mountHeader({ props: { responsiveNavLinks: anchorLinks } });
      await wrapper.findAll(".main-navigation-link")[1]!.trigger("click");
      expect(section.scrollIntoView).toHaveBeenCalled();
      expect(wrapper.findAll(".main-navigation-item")[1]!.classes()).toContain("is-active");
      section.remove();
    });
  });

  // Mirrors the right-align rule in the component CSS. Indicator divs follow the lists, so a
  // :last-child selector matched nothing for months without any test noticing.
  it("matches only the last group's last dropdown with the right-align selector", async () => {
    const wrapper = await mountHeader({
      props: {
        responsiveNavLinks: {
          ...navLinks,
          secondNav: [
            { name: "Contact", path: "/contact" },
            { name: "Help", childLinksTitle: "Help", childLinks: [{ name: "FAQs", path: "/help/faqs" }] },
          ],
        },
      },
    });
    const matched = wrapper.findAll(
      ".main-navigation-list:last-of-type > .main-navigation-item:last-child .main-navigation-sub-nav"
    );
    expect(matched).toHaveLength(1);
    expect(matched[0]!.text()).toContain("FAQs");
  });

  // ─── Closing menus on navigation ──────────────────────────────────────

  describe("closing menus on navigation", () => {
    it("closes the overflow menu when a route link inside it is clicked", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
      const overflow = wrapper.find<HTMLDetailsElement>(".overflow-details");
      overflow.element.open = true;

      await wrapper.find(".overflow-details-nav a.overflow-navigation-link").trigger("click");
      expect(overflow.element.open).toBe(false);
    });

    it("closes the overflow menu when a sub-nav link inside it is clicked", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
      const overflow = wrapper.find<HTMLDetailsElement>(".overflow-details");
      overflow.element.open = true;

      await wrapper.find(".overflow-details-nav a.overflow-navigation-sub-nav-link").trigger("click");
      expect(overflow.element.open).toBe(false);
    });

    it("closes a dropdown when one of its links is clicked", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
      const dropdown = wrapper.find<HTMLDetailsElement>(".main-navigation-details");
      dropdown.element.open = true;

      await wrapper.find(".main-navigation-sub-nav-link").trigger("click");
      expect(dropdown.element.open).toBe(false);
    });

    it("leaves the menus open when a click inside them isn't on a link", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
      const overflow = wrapper.find<HTMLDetailsElement>(".overflow-details");
      const dropdown = wrapper.find<HTMLDetailsElement>(".main-navigation-details");
      overflow.element.open = true;
      dropdown.element.open = true;

      await wrapper.find(".overflow-details-nav").trigger("click");
      await wrapper.find(".main-navigation-sub-nav").trigger("click");
      expect(overflow.element.open).toBe(true);
      expect(dropdown.element.open).toBe(true);
    });

    it("closes open menus when the route changes", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
      const overflow = wrapper.find<HTMLDetailsElement>(".overflow-details");
      const dropdown = wrapper.find<HTMLDetailsElement>(".main-navigation-details");
      overflow.element.open = true;
      dropdown.element.open = true;

      await wrapper.vm.$router.push("/contact");
      await nextTick();
      expect(overflow.element.open).toBe(false);
      expect(dropdown.element.open).toBe(false);
    });
  });

  // ─── Overflow open icon and backdrop ──────────────────────────────────

  describe("overflow open state", () => {
    // Set open and dispatch toggle directly: jsdom queues its own toggle event on a timer,
    // which this repo's global fake timers never run.
    const setOverflowOpen = async (wrapper: Awaited<ReturnType<typeof mountHeader>>, open: boolean) => {
      const overflow = wrapper.find<HTMLDetailsElement>(".overflow-details");
      overflow.element.open = open;
      overflow.element.dispatchEvent(new Event("toggle"));
      await nextTick();
    };

    it("renders no open icon unless one is given", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
      expect(wrapper.findAll(".overflow-details-summary .icon")).toHaveLength(2);
    });

    it("shows the open icon instead of the others while the menu is open", async () => {
      const wrapper = await mountHeader({
        props: {
          responsiveNavLinks: navLinks,
          overflowDetailsSummaryIcons: { more: "a:more", burger: "a:burger", open: "a:close" },
        },
      });
      const icons = wrapper.findAll(".overflow-details-summary .icon");
      expect(icons).toHaveLength(3);
      expect(icons[2]!.classes()).not.toContain("show");

      await setOverflowOpen(wrapper, true);
      expect(icons[0]!.classes()).not.toContain("show");
      expect(icons[1]!.classes()).not.toContain("show");
      expect(icons[2]!.classes()).toContain("show");

      await setOverflowOpen(wrapper, false);
      expect(icons[2]!.classes()).not.toContain("show");
    });

    it("renders no backdrop without overflowBackdrop", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks } });
      await setOverflowOpen(wrapper, true);
      expect(document.body.querySelector(".responsive-header-overflow-backdrop")).toBeNull();
    });

    it("renders the backdrop on body only while the menu is open", async () => {
      const wrapper = await mountHeader({ props: { responsiveNavLinks: navLinks, overflowBackdrop: true } });
      expect(document.body.querySelector(".responsive-header-overflow-backdrop")).toBeNull();

      await setOverflowOpen(wrapper, true);
      const backdrop = document.body.querySelector(".responsive-header-overflow-backdrop");
      expect(backdrop).not.toBeNull();
      expect(backdrop!.parentElement).toBe(document.body);
      expect(backdrop!.getAttribute("aria-hidden")).toBe("true");

      await setOverflowOpen(wrapper, false);
      expect(document.body.querySelector(".responsive-header-overflow-backdrop")).toBeNull();
    });

    it("closes the open menu once every item fits and the button hides", async () => {
      const geometry = mockCollapseLayout({
        wrapperWidth: 900,
        firstNavRight: 849,
        secondaryLeft: 860,
        mainNavRight: 848,
      });
      const wrapper = await mountHeader({
        props: {
          responsiveNavLinks: { main: navLinks.firstNav! },
          collapseAtMainNavIntersection: true,
          overflowBackdrop: true,
        },
      });
      await triggerGeometryPass();
      expect(hiddenFlags(wrapper)).toEqual([true, true, true]);
      await setOverflowOpen(wrapper, true);

      await wrapper.setProps({ collapseAtMainNavIntersection: false });
      await triggerGeometryPass();

      expect(hiddenFlags(wrapper)).toEqual([false, false, false]);
      expect(wrapper.find<HTMLDetailsElement>(".overflow-details").element.open).toBe(false);
      geometry.mockRestore();
    });
  });
});
