import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ContentDocs from "../ContentDocs.vue";

let resizeCallback: ResizeObserverCallback | null = null;

beforeEach(() => {
  resizeCallback = null;
  vi.stubGlobal(
    "ResizeObserver",
    vi.fn((callback: ResizeObserverCallback) => {
      resizeCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    })
  );
});

function triggerResize(el: HTMLElement, width: number) {
  Object.defineProperty(el, "offsetWidth", { value: width, configurable: true });
  resizeCallback?.(
    [{ contentRect: { width, height: 0 } } as unknown as ResizeObserverEntry],
    {} as ResizeObserver
  );
}

const navItems = [
  { label: "One", to: "/one" },
  { label: "Two", to: "/two" },
];
const pageNavItems = [{ label: "Overview", to: "/one#overview" }];

describe("ContentDocs", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ContentDocs);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── docsNav / docsPageNav visibility ──────────────────────────────────────

  it("does not render .docs-nav when docsNavItems is empty", async () => {
    const wrapper = await mountSuspended(ContentDocs);
    expect(wrapper.find(".docs-nav").exists()).toBe(false);
  });

  it("renders .docs-nav with a link per item when docsNavItems is provided", async () => {
    const wrapper = await mountSuspended(ContentDocs, { props: { docsNavItems: navItems } });
    const links = wrapper.find(".docs-nav").findAll("a");
    expect(links).toHaveLength(2);
    expect(links[0]?.text()).toBe("One");
    expect(links[0]?.attributes("href")).toBe("/one");
  });

  it("does not render .docs-page-nav when docsPageNavItems is empty", async () => {
    const wrapper = await mountSuspended(ContentDocs);
    expect(wrapper.find(".docs-page-nav").exists()).toBe(false);
  });

  it("renders .docs-page-nav with a link per item when docsPageNavItems is provided", async () => {
    const wrapper = await mountSuspended(ContentDocs, { props: { docsPageNavItems: pageNavItems } });
    const links = wrapper.find(".docs-page-nav").findAll("a");
    expect(links).toHaveLength(1);
    expect(links[0]?.text()).toBe("Overview");
  });

  it("renders the docsContent slot", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      slots: { docsContent: '<p data-testid="body">Body</p>' },
    });
    expect(wrapper.find('[data-testid="body"]').text()).toBe("Body");
  });

  it("places docsContent before docsNav and docsPageNav in DOM order, so a consumer's h1 is reachable before either nav panel's h3 heading (visual position is unaffected — grid-template-areas places all three, not source order)", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      props: { docsNavItems: navItems, docsPageNavItems: pageNavItems },
      slots: { docsContent: "<h1>Title</h1>" },
    });
    const inner = wrapper.find(".content-docs-inner").element;
    const children = [...inner.children].map((el) => el.className);
    expect(children).toEqual(["docs-content", "docs-nav", "docs-page-nav"]);
  });

  // ─── labels ─────────────────────────────────────────────────────────────

  it("defaults docsNavLabel to 'Navigation' and docsPageNavLabel to 'On this page'", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      props: { docsNavItems: navItems, docsPageNavItems: pageNavItems },
    });
    expect(wrapper.find(".docs-nav-heading").text()).toBe("Navigation");
    expect(wrapper.find(".docs-page-nav-heading").text()).toBe("On this page");
  });

  it("uses custom docsNavLabel / docsPageNavLabel when provided", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      props: {
        docsNavItems: navItems,
        docsPageNavItems: pageNavItems,
        docsNavLabel: "Sections",
        docsPageNavLabel: "Contents",
      },
    });
    expect(wrapper.find(".docs-nav-heading").text()).toBe("Sections");
    expect(wrapper.find(".docs-page-nav-heading").text()).toBe("Contents");
  });

  // ─── icons ──────────────────────────────────────────────────────────────

  it("renders an icon on a docsNav item when item.icon is set", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      props: { docsNavItems: [{ label: "One", to: "/one", icon: "lucide:home" }] },
    });
    expect(wrapper.find(".docs-nav-link-icon").exists()).toBe(true);
  });

  it("does not render an icon on a docsNav item when item.icon is omitted", async () => {
    const wrapper = await mountSuspended(ContentDocs, { props: { docsNavItems: navItems } });
    expect(wrapper.find(".docs-nav-link-icon").exists()).toBe(false);
  });

  it("renders an icon on a docsPageNav item when item.icon is set", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      props: { docsPageNavItems: [{ label: "Overview", to: "/one#overview", icon: "lucide:list" }] },
    });
    expect(wrapper.find(".docs-page-nav-link-icon").exists()).toBe(true);
  });

  // ─── active item ────────────────────────────────────────────────────────

  it("applies is-active and aria-current to the link matching activeNavItem", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      props: { docsNavItems: navItems, activeNavItem: "/two" },
    });
    const links = wrapper.find(".docs-nav").findAll("a");
    expect(links[0]?.classes()).not.toContain("is-active");
    expect(links[1]?.classes()).toContain("is-active");
    expect(links[1]?.attributes("aria-current")).toBe("page");
  });

  it("emits update:activeNavItem when a docsNav link is clicked", async () => {
    const wrapper = await mountSuspended(ContentDocs, { props: { docsNavItems: navItems } });
    await wrapper.find(".docs-nav").findAll("a")[1]?.trigger("click");
    expect(wrapper.emitted("update:activeNavItem")?.[0]).toEqual(["/two"]);
  });

  it("emits update:activePageNavItem when a docsPageNav link is clicked", async () => {
    const wrapper = await mountSuspended(ContentDocs, { props: { docsPageNavItems: pageNavItems } });
    await wrapper.find(".docs-page-nav").find("a").trigger("click");
    expect(wrapper.emitted("update:activePageNavItem")?.[0]).toEqual(["/one#overview"]);
  });

  // ─── closing on link click (mobile overlay behaviour) ─────────────────────

  it("closes the docsNav panel when a link inside it is clicked", async () => {
    const wrapper = await mountSuspended(ContentDocs, { props: { docsNavItems: navItems } });

    await wrapper.find(".docs-nav summary").trigger("click");
    expect(wrapper.find(".docs-nav details").attributes("open")).toBeDefined();

    await wrapper.find(".docs-nav").findAll("a")[0]?.trigger("click");
    expect(wrapper.find(".docs-nav details").attributes("open")).toBeUndefined();
  });

  it("closes the docsPageNav panel when a link inside it is clicked", async () => {
    const wrapper = await mountSuspended(ContentDocs, { props: { docsPageNavItems: pageNavItems } });

    await wrapper.find(".docs-page-nav summary").trigger("click");
    expect(wrapper.find(".docs-page-nav details").attributes("open")).toBeDefined();

    await wrapper.find(".docs-page-nav").find("a").trigger("click");
    expect(wrapper.find(".docs-page-nav details").attributes("open")).toBeUndefined();
  });

  // ─── container-width-driven forceOpened ────────────────────────────────────

  describe("breakpoint-driven forceOpened", () => {
    it("neither panel is forceOpened below 768px (mobile)", async () => {
      const wrapper = await mountSuspended(ContentDocs, {
        props: { docsNavItems: navItems, docsPageNavItems: pageNavItems },
      });
      triggerResize(wrapper.find(".content-docs").element as HTMLElement, 500);
      await nextTick();

      expect(wrapper.find(".docs-nav .icon-wrapper").exists()).toBe(true);
      expect(wrapper.find(".docs-page-nav .icon-wrapper").exists()).toBe(true);
    });

    it("only docsPageNav is forceOpened between 768px and 1023px (tablet)", async () => {
      const wrapper = await mountSuspended(ContentDocs, {
        props: { docsNavItems: navItems, docsPageNavItems: pageNavItems },
      });
      triggerResize(wrapper.find(".content-docs").element as HTMLElement, 900);
      await nextTick();

      expect(wrapper.find(".docs-nav .icon-wrapper").classes()).not.toContain("icon-wrapper--hidden");
      expect(wrapper.find(".docs-page-nav .icon-wrapper").classes()).toContain("icon-wrapper--hidden");
    });

    it("both panels are forceOpened at 1024px and above (desktop)", async () => {
      const wrapper = await mountSuspended(ContentDocs, {
        props: { docsNavItems: navItems, docsPageNavItems: pageNavItems },
      });
      triggerResize(wrapper.find(".content-docs").element as HTMLElement, 1200);
      await nextTick();

      expect(wrapper.find(".docs-nav .icon-wrapper").classes()).toContain("icon-wrapper--hidden");
      expect(wrapper.find(".docs-page-nav .icon-wrapper").classes()).toContain("icon-wrapper--hidden");
    });
  });

  // ─── native <details> name grouping ────────────────────────────────────────

  describe("panel name grouping", () => {
    it("shares one details name between docsNav and docsPageNav on mobile", async () => {
      const wrapper = await mountSuspended(ContentDocs, {
        props: { docsNavItems: navItems, docsPageNavItems: pageNavItems },
      });
      triggerResize(wrapper.find(".content-docs").element as HTMLElement, 500);
      await nextTick();

      const navName = wrapper.find(".docs-nav details").attributes("name");
      const pageNavName = wrapper.find(".docs-page-nav details").attributes("name");
      expect(navName).toBe(pageNavName);
    });

    it("uses distinct details names on desktop, where both must stay open simultaneously", async () => {
      const wrapper = await mountSuspended(ContentDocs, {
        props: { docsNavItems: navItems, docsPageNavItems: pageNavItems },
      });
      triggerResize(wrapper.find(".content-docs").element as HTMLElement, 1200);
      await nextTick();

      const navName = wrapper.find(".docs-nav details").attributes("name");
      const pageNavName = wrapper.find(".docs-page-nav details").attributes("name");
      expect(navName).not.toBe(pageNavName);
    });
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies styleClassPassthrough classes to the root element", async () => {
    const wrapper = await mountSuspended(ContentDocs, {
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.find(".content-docs").classes()).toContain("custom-class");
  });
});
