import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import MasonryGrid from "../MasonryGrid.vue";

// useElementSize/useResizeObserver (from @vueuse/core) require ResizeObserver, which jsdom
// doesn't implement. Mock it and capture the callback so tests can simulate a real resize event —
// jsdom also never actually measures layout (offsetWidth/offsetHeight stay 0), so this is the only
// way to feed the component a non-zero measured width.
// Vitest 4: a mock's implementation must be a regular function (not an arrow function)
// to remain constructible via `new`.
let resizeCallback: ResizeObserverCallback | undefined;
const mockResizeObserver = vi.fn(function (callback: ResizeObserverCallback) {
  resizeCallback = callback;
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});

beforeEach(() => {
  resizeCallback = undefined;
  vi.stubGlobal("ResizeObserver", mockResizeObserver);
  // ⚠️ Do NOT call vi.unstubAllGlobals() in afterEach — it removes global stubs from
  // vitest.setup.ts ($fetch, etc.)
});

function simulateResizeTo(width: number) {
  resizeCallback?.(
    [{ contentBoxSize: [{ inlineSize: width, blockSize: 0 }], contentRect: { width } } as unknown as ResizeObserverEntry],
    {} as ResizeObserver
  );
}

function stubOffsetHeight(el: Element, height: number) {
  Object.defineProperty(el, "offsetHeight", { value: height, configurable: true });
}

describe("MasonryGrid", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(MasonryGrid);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders as div by default", async () => {
    const wrapper = await mountSuspended(MasonryGrid);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders a different tag when provided", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { tag: "section" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("renders slot content in natural authoring order", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      slots: {
        "item-1": "<div>Item 1</div>",
        "item-2": "<div>Item 2</div>",
      },
    });
    const items = wrapper.findAll(".masonry-grid-item");
    expect(items.map((item) => item.text())).toEqual(["Item 1", "Item 2"]);
  });

  it("renders no items when no slots are provided", async () => {
    const wrapper = await mountSuspended(MasonryGrid);
    expect(wrapper.findAll(".masonry-grid-item")).toHaveLength(0);
  });

  it("does not absolutely position items when only one column fits (single-column fallback)", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      slots: { "item-1": "<div>Item 1</div>", "item-2": "<div>Item 2</div>" },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.find(".masonry-grid-wrapper").classes()).not.toContain("multiple-cols");
    const item = wrapper.find(".masonry-grid-item").element as HTMLElement;
    expect(item.style.getPropertyValue("--_position")).toBe("");
  });

  it("packs items into whichever column is currently shortest", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      // itemMinWidth (300, default) + gap (12, default) = 312 -> floor(700/312) = 2 columns
      slots: {
        "item-1": "<div>Item 1</div>",
        "item-2": "<div>Item 2</div>",
        "item-3": "<div>Item 3</div>",
      },
    });
    const items = wrapper.findAll(".masonry-grid-item");
    stubOffsetHeight(items[0]!.element, 100);
    stubOffsetHeight(items[1]!.element, 50);
    stubOffsetHeight(items[2]!.element, 80);

    simulateResizeTo(700);
    await nextTick();
    await nextTick(); // updateGrid is itself wrapped in an extra nextTick()

    // col heights start [0, 0]. item-1 (h=100) -> shortest is col 0 -> col becomes 112.
    // item-2 (h=50) -> shortest is now col 1 (0 < 112) -> col becomes 62.
    // item-3 (h=80) -> shortest is still col 1 (62 < 112) -> placed below item-2.
    // itemWidth (stretch) = floor((700 - 1*12) / 2) = 344; column steps are itemWidth+gap = 356px.
    const el1 = items[0]!.element as HTMLElement;
    const el2 = items[1]!.element as HTMLElement;
    const el3 = items[2]!.element as HTMLElement;
    expect(el1.style.getPropertyValue("--_position-top")).toBe("0px");
    expect(el1.style.getPropertyValue("--_position-left")).toBe("0px");
    expect(el2.style.getPropertyValue("--_position-top")).toBe("0px");
    expect(el2.style.getPropertyValue("--_position-left")).toBe("356px");
    expect(el3.style.getPropertyValue("--_position-top")).toBe("62px");
    expect(el3.style.getPropertyValue("--_position-left")).toBe("356px");
  });

  it("uses a fixed item width when fixedWidth is set, ignoring stretch sizing", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { fixedWidth: true, itemMinWidth: 200 },
      slots: { "item-1": "<div>Item 1</div>", "item-2": "<div>Item 2</div>" },
    });
    simulateResizeTo(700); // (200 + 12) -> floor(700/212) = 3 columns
    await nextTick();
    await nextTick();
    const item = wrapper.find(".masonry-grid-item").element as HTMLElement;
    expect(item.style.getPropertyValue("--_element-width")).toBe("200px");
  });

  it("spaces fixed-width columns by exactly itemWidth + gap, and centers the block via justify", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { fixedWidth: true, itemMinWidth: 200, gap: 20, justify: "center" },
      slots: {
        "item-1": "<div>Item 1</div>",
        "item-2": "<div>Item 2</div>",
        "item-3": "<div>Item 3</div>",
      },
    });
    simulateResizeTo(700); // (200 + 20) -> floor(700/220) = 3 columns
    await nextTick();
    await nextTick();

    // 3 columns * 200px + 2 gaps * 20px = 640px total content width, centered in 700px
    // available -> 30px leftover on each side.
    const items = wrapper.findAll(".masonry-grid-item");
    const [el1, el2, el3] = items.map((item) => item.element as HTMLElement);
    expect(el1!.style.getPropertyValue("--_position-left")).toBe("30px");
    expect(el2!.style.getPropertyValue("--_position-left")).toBe("250px");
    expect(el3!.style.getPropertyValue("--_position-left")).toBe("470px");
  });

  it("applies styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(MasonryGrid, {
      props: { styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });
});
