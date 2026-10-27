import { describe, it, expect, vi, afterEach } from "vitest";
import { nextTick, defineComponent, ref, h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import PaginationNav from "../PaginationNav.vue";

let wrapper: VueWrapper | undefined;

// Captures the latest observer callback so the auto-layout test can fire a resize.
let observerCallback: () => void = () => {};
vi.stubGlobal(
  "ResizeObserver",
  class {
    constructor(callback: () => void) {
      observerCallback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  vi.restoreAllMocks();
});

const pageNumbers = (w: VueWrapper) => w.findAll(".pagination-nav-page").map((item) => Number(item.text()));
const control = (w: VueWrapper, name: string) => w.find(`[data-control="${name}"]`);
const current = (w: VueWrapper) => w.find('.pagination-nav-page[aria-current="page"]');

// v-model host, so clicks round-trip through update:page like a real consumer.
const mountHost = async (props: Record<string, unknown> = {}, startPage = 1) => {
  const page = ref(startPage);
  const Host = defineComponent({
    setup: () => () =>
      h(PaginationNav, {
        total: 20,
        ...props,
        page: page.value,
        "onUpdate:page": (value: number) => (page.value = value),
      }),
  });
  wrapper = await mountSuspended(Host, { attachTo: document.body });
  return { page, wrapper };
};

describe("PaginationNav", () => {
  it("mounts without error", async () => {
    wrapper = await mountSuspended(PaginationNav, { props: { total: 5 } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 10 } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure in link mode with edges and a marker", async () => {
    wrapper = await mountSuspended(PaginationNav, {
      props: { total: 20, page: 1, showEdges: true, marker: "underline", pageHref: (page: number) => `#page-${page}` },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("window", () => {
    it("shows boundaries, siblings and an ellipsis for each hidden run", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 10 } });
      expect(pageNumbers(wrapper)).toEqual([1, 9, 10, 11, 20]);
      expect(wrapper.findAll(".pagination-nav-ellipsis")).toHaveLength(2);
    });

    it("keeps the same number of slots on every page", async () => {
      const { page } = await mountHost();
      for (let value = 1; value <= 20; value++) {
        page.value = value;
        await nextTick();
        expect(wrapper!.findAll(".pagination-nav-item")).toHaveLength(7);
      }
    });

    it("honours siblings and boundaries", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 10, siblings: 2, boundaries: 2 } });
      expect(pageNumbers(wrapper)).toEqual([1, 2, 8, 9, 10, 11, 12, 19, 20]);
    });

    it("hides ellipses from assistive technology", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 10 } });
      const hidden = wrapper.findAll('.pagination-nav-item[aria-hidden="true"]');
      expect(hidden).toHaveLength(2);
      hidden.forEach((item) => expect(item.find(".pagination-nav-ellipsis").exists()).toBe(true));
    });

    it("renders a custom ellipsis slot", async () => {
      wrapper = await mountSuspended(PaginationNav, {
        props: { total: 20, page: 10 },
        slots: { ellipsis: () => "~" },
      });
      expect(wrapper.find(".pagination-nav-ellipsis").text()).toBe("~");
    });
  });

  describe("current page", () => {
    it("marks the current page with aria-current", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 4 } });
      expect(current(wrapper).text()).toBe("4");
      expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1);
    });

    it("clamps an out-of-range or fractional page for display", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 99 } });
      expect(current(wrapper).text()).toBe("20");
      await wrapper.setProps({ page: 3.8 });
      expect(current(wrapper).text()).toBe("3");
      await wrapper.setProps({ page: -2 });
      expect(current(wrapper).text()).toBe("1");
    });
  });

  describe("button mode", () => {
    it("emits update:page when a page is clicked", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 1 } });
      await wrapper.findAll(".pagination-nav-page")[2]!.trigger("click");
      expect(wrapper.emitted("update:page")).toEqual([[3]]);
    });

    it("emits the previous page from Previous", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 10 } });
      await control(wrapper, "previous").trigger("click");
      expect(wrapper.emitted("update:page")).toEqual([[9]]);
    });

    it("emits the next page from Next", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 10 } });
      await control(wrapper, "next").trigger("click");
      expect(wrapper.emitted("update:page")).toEqual([[11]]);
    });

    it("does not emit when the current page is clicked", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 3 } });
      await current(wrapper).trigger("click");
      expect(wrapper.emitted("update:page")).toBeUndefined();
    });

    it("still handles modified clicks, since there is no link to open elsewhere", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 3 } });
      await control(wrapper, "next").trigger("click", { shiftKey: true });
      expect(wrapper.emitted("update:page")).toEqual([[4]]);
    });

    it("renders buttons without href", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5 } });
      expect(wrapper.findAll("a")).toHaveLength(0);
      expect(wrapper.findAll("button.pagination-nav-page")).toHaveLength(5);
    });
  });

  describe("link mode", () => {
    const pageHref = (page: number) => `/blog?page=${page}`;

    it("renders each page as a link to pageHref(page)", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, page: 2, pageHref } });
      const links = wrapper.findAll("a.pagination-nav-page");
      expect(links.map((link) => link.attributes("href"))).toEqual([1, 2, 3, 4, 5].map(pageHref));
    });

    it("points Previous and Next at the neighbouring pages", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, page: 3, pageHref } });
      expect(control(wrapper, "previous").attributes("href")).toBe("/blog?page=2");
      expect(control(wrapper, "next").attributes("href")).toBe("/blog?page=4");
    });

    it("still updates the model when a link is clicked", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, page: 3, pageHref } });
      await wrapper.findAll(".pagination-nav-page")[4]!.trigger("click");
      expect(wrapper.emitted("update:page")).toEqual([[5]]);
    });

    it("ignores modified clicks so the link can open elsewhere", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, page: 3, pageHref } });
      await control(wrapper, "next").trigger("click", { ctrlKey: true });
      await control(wrapper, "next").trigger("click", { metaKey: true });
      await control(wrapper, "next").trigger("click", { shiftKey: true });
      expect(wrapper.emitted("update:page")).toBeUndefined();
    });
  });

  describe("boundaries", () => {
    it("disables Previous and First on the first page", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, page: 1, showEdges: true } });
      for (const name of ["previous", "first"]) {
        expect(control(wrapper, name).attributes("aria-disabled")).toBe("true");
      }
      expect(control(wrapper, "next").attributes("aria-disabled")).toBeUndefined();
      await control(wrapper, "previous").trigger("click");
      await control(wrapper, "first").trigger("click");
      expect(wrapper.emitted("update:page")).toBeUndefined();
    });

    it("disables Next and Last on the last page", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, page: 5, showEdges: true } });
      for (const name of ["next", "last"]) {
        expect(control(wrapper, name).attributes("aria-disabled")).toBe("true");
      }
      await control(wrapper, "next").trigger("click");
      expect(wrapper.emitted("update:page")).toBeUndefined();
    });

    it("keeps disabled controls focusable and drops their href in link mode", async () => {
      wrapper = await mountSuspended(PaginationNav, {
        props: { total: 5, page: 1, pageHref: (page: number) => `/p/${page}` },
      });
      const previous = control(wrapper, "previous");
      expect(previous.element.tagName).toBe("BUTTON");
      expect(previous.attributes("href")).toBeUndefined();
      expect(previous.attributes("disabled")).toBeUndefined();
    });
  });

  describe("edges and visibility", () => {
    it("adds First and Last with showEdges", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, page: 10 } });
      expect(control(wrapper, "first").exists()).toBe(false);
      await wrapper.setProps({ showEdges: true });
      await control(wrapper, "first").trigger("click");
      await control(wrapper, "last").trigger("click");
      expect(wrapper.emitted("update:page")).toEqual([[1], [20]]);
    });

    it("renders nothing when total is below one", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 0 } });
      expect(wrapper.find("nav").exists()).toBe(false);
    });

    it("hides a single page only with hideWhenSinglePage", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 1 } });
      expect(wrapper.find("nav").exists()).toBe(true);
      await wrapper.setProps({ hideWhenSinglePage: true });
      expect(wrapper.find("nav").exists()).toBe(false);
    });
  });

  describe("accessibility and labels", () => {
    it("is a labelled nav landmark with a role=list", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5 } });
      expect(wrapper.find("nav").attributes("aria-label")).toBe("Pagination");
      expect(wrapper.find("ul").attributes("role")).toBe("list");
    });

    it("names every control from the default labels", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, page: 2, showEdges: true } });
      expect(control(wrapper, "previous").text()).toBe("Previous page");
      expect(control(wrapper, "next").text()).toBe("Next page");
      expect(control(wrapper, "first").text()).toBe("First page");
      expect(control(wrapper, "last").text()).toBe("Last page");
      expect(current(wrapper).attributes("aria-label")).toBe("Page 2");
    });

    it("renders custom labels with their placeholders filled", async () => {
      wrapper = await mountSuspended(PaginationNav, {
        props: {
          total: 9,
          page: 3,
          ariaLabel: "Seiten",
          previousLabel: "Zurück",
          nextLabel: "Weiter",
          pageLabel: "Seite {page}",
          summaryLabel: "Seite {page} von {total}",
        },
      });
      expect(wrapper.find("nav").attributes("aria-label")).toBe("Seiten");
      expect(control(wrapper, "previous").text()).toBe("Zurück");
      expect(control(wrapper, "next").text()).toBe("Weiter");
      expect(current(wrapper).attributes("aria-label")).toBe("Seite 3");
      expect(wrapper.find(".pagination-nav-summary").text()).toBe("Seite 3 von 9");
    });

    it("falls back to the default label when one is blank", async () => {
      wrapper = await mountSuspended(PaginationNav, {
        props: { total: 5, ariaLabel: " ", previousLabel: "", pageLabel: "" },
      });
      expect(wrapper.find("nav").attributes("aria-label")).toBe("Pagination");
      expect(control(wrapper, "previous").text()).toBe("Previous page");
      expect(current(wrapper).attributes("aria-label")).toBe("Page 1");
    });

    it("puts the passthrough class on the root only", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, styleClassPassthrough: "custom" } });
      expect(wrapper.findAll(".custom")).toHaveLength(1);
      expect(wrapper.classes()).toContain("custom");
    });

    it("keeps aria-current off the arrows when the route matches their links", async () => {
      // vue-router's exact-active check ignores the query, so on /blog?page=3 every /blog?page=n link sets
      // aria-current itself. This repo's pages-less test router never does, so stand in for vue-router's
      // RouterLink: aria-current on its own anchor, which fall-through attributes can override.
      const VueRouterLink = defineComponent({
        props: { to: { type: String, required: true } },
        setup:
          (props, { slots }) =>
          () =>
            h("a", { href: props.to, "aria-current": "page", class: "router-link-exact-active" }, slots.default?.()),
      });
      wrapper = await mountSuspended(PaginationNav, {
        props: { total: 5, page: 3, showEdges: true, pageHref: (page: number) => `/blog?page=${page}` },
        global: { stubs: { RouterLink: VueRouterLink } },
      });
      expect(control(wrapper, "next").classes()).toContain("router-link-exact-active");
      for (const name of ["first", "previous", "next", "last"]) {
        expect(control(wrapper, name).attributes("aria-current")).toBeUndefined();
      }
      expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1);
    });
  });

  describe("focus", () => {
    it("moves focus to the new current page after a page is chosen", async () => {
      await mountHost({}, 4);
      const target = wrapper!.findAll(".pagination-nav-page").find((item) => item.text() === "5")!;
      (target.element as HTMLElement).focus();
      await target.trigger("click");
      await nextTick();
      await nextTick();
      expect(document.activeElement?.textContent?.trim()).toBe("5");
      expect(document.activeElement?.getAttribute("aria-current")).toBe("page");
    });

    it("keeps focus inside the control when Next becomes disabled in link mode", async () => {
      await mountHost({ total: 3, pageHref: (page: number) => `#page-${page}` }, 2);
      const next = control(wrapper!, "next");
      (next.element as HTMLElement).focus();
      await next.trigger("click");
      await nextTick();
      await nextTick();
      expect(document.activeElement?.getAttribute("data-control")).toBe("next");
    });

    it("does not move focus when the control did not have it", async () => {
      await mountHost({}, 4);
      const outside = document.createElement("button");
      document.body.appendChild(outside);
      outside.focus();
      await wrapper!.findAll(".pagination-nav-page")[4]!.trigger("click");
      await nextTick();
      await nextTick();
      expect(document.activeElement).toBe(outside);
      outside.remove();
    });
  });

  describe("marker", () => {
    it("renders no marker by default", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20 } });
      expect(wrapper.find(".pagination-nav-marker").exists()).toBe(false);
      expect(wrapper.attributes("data-marker")).toBe("none");
    });

    it("places the marker on the current page's slot", async () => {
      const { page } = await mountHost({ marker: "background" });
      for (const value of [1, 3, 5, 10, 17, 20]) {
        page.value = value;
        await nextTick();
        const slots = wrapper!.findAll(".pagination-nav-item");
        const index = slots.findIndex((slot) => slot.find('[aria-current="page"]').exists());
        const marker = wrapper!.find(".pagination-nav-marker").element as HTMLElement;
        expect(marker.style.getPropertyValue("--_pagination-nav-marker-index")).toBe(String(index));
      }
    });

    it("sets the marker variant and slot count for the CSS", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, marker: "underline" } });
      expect(wrapper.attributes("data-marker")).toBe("underline");
      const pages = wrapper.find(".pagination-nav-pages").element as HTMLElement;
      expect(pages.style.getPropertyValue("--_pagination-nav-count")).toBe("7");
      expect(wrapper.find(".pagination-nav-marker-layer").attributes("aria-hidden")).toBe("true");
    });
  });

  describe("layout", () => {
    it("is compact when forced", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, layout: "compact" } });
      expect(wrapper.attributes("data-compact")).toBe("");
      expect(wrapper.find(".pagination-nav-summary").text()).toBe("Page 1 of 20");
    });

    it("switches to compact when the full row does not fit, and back when it does", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20 } });
      const root = wrapper.element as HTMLElement;
      const row = wrapper.find(".pagination-nav-row").element as HTMLElement;
      let available = 300;
      Object.defineProperty(root, "clientWidth", { configurable: true, get: () => available });
      Object.defineProperty(row, "scrollWidth", { configurable: true, get: () => 400 });

      observerCallback();
      await nextTick();
      expect(wrapper.attributes("data-compact")).toBe("");

      available = 500;
      observerCallback();
      await nextTick();
      expect(wrapper.attributes("data-compact")).toBeUndefined();
    });

    // Stubs the root's available width and the full row's natural width for measure().
    const stubWidths = (w: VueWrapper, sizes: { available: number; needed: number; padding?: number }) => {
      const root = w.element as HTMLElement;
      const row = w.find(".pagination-nav-row").element as HTMLElement;
      Object.defineProperty(root, "clientWidth", { configurable: true, get: () => sizes.available });
      Object.defineProperty(row, "scrollWidth", { configurable: true, get: () => sizes.needed });
      if (sizes.padding) {
        const padding = `${sizes.padding}px`;
        vi.spyOn(window, "getComputedStyle").mockReturnValue({
          paddingLeft: padding,
          paddingRight: padding,
        } as CSSStyleDeclaration);
      }
    };

    it("never compacts with layout full, even when the row overflows", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, layout: "full" } });
      stubWidths(wrapper, { available: 100, needed: 400 });
      observerCallback();
      await nextTick();
      expect(wrapper.attributes("data-compact")).toBeUndefined();
    });

    it("counts the root's padding against the available width", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20 } });
      stubWidths(wrapper, { available: 420, needed: 400, padding: 20 });
      observerCallback();
      await nextTick();
      expect(wrapper.attributes("data-compact")).toBe("");
    });

    it("re-measures the full row when its shape changes", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20 } });
      const sizes = { available: 300, needed: 400 };
      stubWidths(wrapper, sizes);
      observerCallback();
      await nextTick();
      expect(wrapper.attributes("data-compact")).toBe("");

      sizes.needed = 200;
      await wrapper.setProps({ total: 5 });
      await nextTick();
      await nextTick();
      expect(wrapper.attributes("data-compact")).toBeUndefined();
    });

    it("announces the compact summary politely", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 20, layout: "compact" } });
      const summary = wrapper.find(".pagination-nav-summary");
      expect(summary.attributes("aria-live")).toBe("polite");
      expect(summary.attributes("aria-atomic")).toBe("true");
    });
  });

  describe("styleClassPassthrough", () => {
    it("applies classes and reacts to changes", async () => {
      wrapper = await mountSuspended(PaginationNav, { props: { total: 5, styleClassPassthrough: ["a", "b"] } });
      expect(wrapper.classes()).toEqual(expect.arrayContaining(["pagination-nav", "a", "b"]));
      await wrapper.setProps({ styleClassPassthrough: "c" });
      expect(wrapper.classes()).toContain("c");
      expect(wrapper.classes()).not.toContain("a");
    });
  });
});
