import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick, ref } from "vue";
import { useContainerBreakpoints } from "../useContainerBreakpoints";

let resizeCallback: ResizeObserverCallback | null = null;

beforeEach(() => {
  resizeCallback = null;
  vi.stubGlobal(
    "ResizeObserver",
    // Vitest 4: a mock's implementation must be a regular function (not an
    // arrow function) to remain constructible via `new`.
    vi.fn(function (callback: ResizeObserverCallback) {
      resizeCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    })
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

function triggerResize(el: HTMLElement, width: number) {
  Object.defineProperty(el, "offsetWidth", { value: width, configurable: true });
  resizeCallback?.(
    [{ contentRect: { width, height: 0 } } as unknown as ResizeObserverEntry],
    {} as ResizeObserver
  );
}

// @vueuse/core's useElementSize reads the element's initial width in onMounted via
// `offsetWidth - computed padding/border`, ahead of any ResizeObserver callback. happy-dom's
// getComputedStyle() only resolves real "0px" values (rather than "") for padding/border on an
// element that's actually attached to the document — a detached `createElement` div keeps
// returning "", so parseFloat() turns the subtraction into NaN. Zero the box model AND attach
// the element so that initial-width read is a real, non-NaN value.
function createEl(): HTMLElement {
  const el = document.createElement("div");
  el.style.padding = "0px";
  el.style.border = "0px";
  document.body.appendChild(el);
  return el;
}

describe("useContainerBreakpoints", () => {
  it("defaults active to base when narrower than the smallest breakpoint", () => {
    const el = ref<HTMLElement | null>(createEl());
    const { active } = useContainerBreakpoints(undefined, el);
    expect(active.value).toBe("base");
  });

  it("updates active as the observed element's width crosses breakpoints", async () => {
    const el = ref<HTMLElement | null>(createEl());
    const { active } = useContainerBreakpoints(undefined, el);

    triggerResize(el.value as HTMLElement, 700);
    await nextTick();
    expect(active.value).toBe("sm");

    triggerResize(el.value as HTMLElement, 1300);
    await nextTick();
    expect(active.value).toBe("xl");
  });

  it("greaterOrEqual/smaller reflect the current width against a named breakpoint", async () => {
    const el = ref<HTMLElement | null>(createEl());
    const { greaterOrEqual, smaller } = useContainerBreakpoints(undefined, el);
    const isLg = greaterOrEqual("lg");
    const isSmallerThanMd = smaller("md");

    expect(isLg.value).toBe(false);
    expect(isSmallerThanMd.value).toBe(true);

    triggerResize(el.value as HTMLElement, 1100);
    await nextTick();
    expect(isLg.value).toBe(true);
    expect(isSmallerThanMd.value).toBe(false);
  });

  it("between returns true only within the [min, max) range", async () => {
    const el = ref<HTMLElement | null>(createEl());
    const { between } = useContainerBreakpoints(undefined, el);
    const isTablet = between("sm", "lg");

    triggerResize(el.value as HTMLElement, 800);
    await nextTick();
    expect(isTablet.value).toBe(true);

    triggerResize(el.value as HTMLElement, 1024);
    await nextTick();
    expect(isTablet.value).toBe(false);
  });

  it("supports a custom breakpoints map", async () => {
    const el = ref<HTMLElement | null>(createEl());
    const { active } = useContainerBreakpoints({ narrow: 400, wide: 900 }, el);

    triggerResize(el.value as HTMLElement, 500);
    await nextTick();
    expect(active.value).toBe("narrow");

    triggerResize(el.value as HTMLElement, 950);
    await nextTick();
    expect(active.value).toBe("wide");
  });
});
