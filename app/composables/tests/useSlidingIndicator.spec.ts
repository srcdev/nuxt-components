import { describe, it, expect, afterEach, vi } from "vitest";
import { ref } from "vue";
import useSlidingIndicator from "../useSlidingIndicator";

const box = (props: Partial<Record<"offsetLeft" | "offsetTop" | "offsetWidth" | "offsetHeight", number>>) => {
  const element = document.createElement("div");
  Object.entries(props).forEach(([key, value]) => Object.defineProperty(element, key, { value }));
  return element;
};

const container = (width = 500, height = 300) => {
  const element = document.createElement("div");
  Object.defineProperty(element, "clientWidth", { value: width });
  Object.defineProperty(element, "clientHeight", { value: height });
  return element;
};

const vars = (element: HTMLElement, name: string) => ({
  start: element.style.getPropertyValue(`--_${name}-start`),
  end: element.style.getPropertyValue(`--_${name}-end`),
  duration: element.style.getPropertyValue(`--_${name}-duration`),
  startDelay: element.style.getPropertyValue(`--_${name}-start-delay`),
  endDelay: element.style.getPropertyValue(`--_${name}-end-delay`),
});

const originalMatchMedia = window.matchMedia;

const stubReducedMotion = (matches: boolean) => {
  window.matchMedia = vi.fn(() => ({ matches }) as MediaQueryList);
};

afterEach(() => {
  vi.restoreAllMocks();
  window.matchMedia = originalMatchMedia;
});

describe("useSlidingIndicator", () => {
  it("snaps the first placement and writes the edges as insets", () => {
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 200 });

    const ms = place("active", box({ offsetLeft: 100, offsetWidth: 50 }), true);

    expect(ms).toBe(0);
    expect(vars(track, "active")).toEqual({ start: "100px", end: "350px", duration: "0ms", startDelay: "0ms", endDelay: "0ms" });
  });

  it("moving forward sends the end edge first and delays the start edge", () => {
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 200 });

    place("active", box({ offsetLeft: 0, offsetWidth: 100 }), true);
    const ms = place("active", box({ offsetLeft: 300, offsetWidth: 100 }), true);

    expect(ms).toBe(200);
    expect(vars(track, "active")).toEqual({ start: "300px", end: "100px", duration: "200ms", startDelay: "200ms", endDelay: "0ms" });
  });

  it("moving backward sends the start edge first and delays the end edge", () => {
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 200 });

    place("active", box({ offsetLeft: 300, offsetWidth: 100 }), true);
    place("active", box({ offsetLeft: 100, offsetWidth: 100 }), true);

    expect(vars(track, "active")).toMatchObject({ startDelay: "0ms", endDelay: "200ms" });
  });

  it("snaps when animate is false", () => {
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 200 });

    place("active", box({ offsetLeft: 0, offsetWidth: 100 }), true);
    expect(place("active", box({ offsetLeft: 300, offsetWidth: 100 }), false)).toBe(0);
    expect(vars(track, "active")).toMatchObject({ duration: "0ms", startDelay: "0ms" });
  });

  it("snaps under prefers-reduced-motion", () => {
    stubReducedMotion(true);
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 200 });

    place("active", box({ offsetLeft: 0, offsetWidth: 100 }), true);
    expect(place("active", box({ offsetLeft: 300, offsetWidth: 100 }), true)).toBe(0);
    expect(vars(track, "active").duration).toBe("0ms");
  });

  it("animates when reduced motion is not requested", () => {
    stubReducedMotion(false);
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 150 });

    place("active", box({ offsetLeft: 0, offsetWidth: 100 }), true);
    expect(place("active", box({ offsetLeft: 300, offsetWidth: 100 }), true)).toBe(150);
  });

  it("measures along the y axis", () => {
    const track = container(500, 300);
    const { place } = useSlidingIndicator(ref(track), { axis: "y", duration: 200 });

    place("active", box({ offsetTop: 40, offsetHeight: 60 }), false);

    expect(vars(track, "active")).toMatchObject({ start: "40px", end: "200px" });
  });

  it("tracks each named indicator separately", () => {
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 200 });

    place("active", box({ offsetLeft: 0, offsetWidth: 100 }), true);
    place("hover", box({ offsetLeft: 200, offsetWidth: 100 }), true);

    expect(vars(track, "hover").duration).toBe("0ms");
    expect(vars(track, "active").start).toBe("0px");
  });

  it("snaps again after reset", () => {
    const track = container();
    const { place, reset } = useSlidingIndicator(ref(track), { duration: 200 });

    place("hover", box({ offsetLeft: 0, offsetWidth: 100 }), true);
    reset("hover");

    expect(place("hover", box({ offsetLeft: 300, offsetWidth: 100 }), true)).toBe(0);
  });

  it("treats a negative or invalid duration as 0", () => {
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: Number.NaN });

    place("active", box({ offsetLeft: 0, offsetWidth: 100 }), true);
    expect(place("active", box({ offsetLeft: 300, offsetWidth: 100 }), true)).toBe(0);
  });

  it("returns null and writes nothing without a container or target", () => {
    const track = container();
    const { place } = useSlidingIndicator(ref(track), { duration: 200 });

    expect(place("active", null, true)).toBeNull();
    expect(useSlidingIndicator(ref(null), { duration: 200 }).place("active", box({}), true)).toBeNull();
    expect(track.style.getPropertyValue("--_active-start")).toBe("");
  });
});
