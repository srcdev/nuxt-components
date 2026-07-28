import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick, ref } from "vue";
import { useContainerBreakpoints } from "../useContainerBreakpoints";

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

describe("useContainerBreakpoints", () => {
  it("defaults active to base when narrower than the smallest breakpoint", () => {
    const el = ref<HTMLElement | null>(document.createElement("div"));
    const { active } = useContainerBreakpoints(undefined, el);
    expect(active.value).toBe("base");
  });

  it("updates active as the observed element's width crosses breakpoints", async () => {
    const el = ref<HTMLElement | null>(document.createElement("div"));
    const { active } = useContainerBreakpoints(undefined, el);

    triggerResize(el.value as HTMLElement, 700);
    await nextTick();
    expect(active.value).toBe("sm");

    triggerResize(el.value as HTMLElement, 1300);
    await nextTick();
    expect(active.value).toBe("xl");
  });

  it("greaterOrEqual/smaller reflect the current width against a named breakpoint", async () => {
    const el = ref<HTMLElement | null>(document.createElement("div"));
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
    const el = ref<HTMLElement | null>(document.createElement("div"));
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
    const el = ref<HTMLElement | null>(document.createElement("div"));
    const { active } = useContainerBreakpoints({ narrow: 400, wide: 900 }, el);

    triggerResize(el.value as HTMLElement, 500);
    await nextTick();
    expect(active.value).toBe("narrow");

    triggerResize(el.value as HTMLElement, 950);
    await nextTick();
    expect(active.value).toBe("wide");
  });
});
