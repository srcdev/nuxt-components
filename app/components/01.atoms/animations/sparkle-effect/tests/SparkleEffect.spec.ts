import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SparkleEffect from "../SparkleEffect.vue";

type Wrapper = Awaited<ReturnType<typeof mountSuspended<typeof SparkleEffect>>>;

const sparkStyle = (el: Element) => (el as HTMLElement).style;

describe("SparkleEffect", () => {
  let wrapper: Wrapper | undefined;

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  // ─── Mount and root ───────────────────────────────────────────────────────

  it("mounts without error", async () => {
    wrapper = await mountSuspended(SparkleEffect);
    expect(wrapper!.vm).toBeTruthy();
  });

  it("renders as <span> by default with the sparkle-effect class", async () => {
    wrapper = await mountSuspended(SparkleEffect);
    expect(wrapper!.element.tagName).toBe("SPAN");
    expect(wrapper!.classes()).toContain("sparkle-effect");
  });

  it("renders as <div> when tag='div'", async () => {
    wrapper = await mountSuspended(SparkleEffect, { props: { tag: "div" } });
    expect(wrapper!.element.tagName).toBe("DIV");
  });

  // ─── Slot ─────────────────────────────────────────────────────────────────

  it("renders the slotted content unchanged", async () => {
    wrapper = await mountSuspended(SparkleEffect, {
      slots: { default: "<button type='button' class='slotted'>Whimsy</button>" },
    });
    const button = wrapper!.find(".slotted");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Whimsy");
    expect(button.attributes("type")).toBe("button");
  });

  // ─── Sparks: count ────────────────────────────────────────────────────────

  it("renders five sparks by default", async () => {
    wrapper = await mountSuspended(SparkleEffect);
    expect(wrapper!.findAll(".sparkle-effect-spark")).toHaveLength(5);
  });

  it.each([
    [1, 1],
    [7, 7],
    [12, 12],
    [99, 12],
    [0, 1],
    [-3, 1],
    [2.5, 2],
    [Number.NaN, 5],
    [Number.POSITIVE_INFINITY, 5],
  ])("renders count=%s as %s sparks", async (count, expected) => {
    wrapper = await mountSuspended(SparkleEffect, { props: { count } });
    expect(wrapper!.findAll(".sparkle-effect-spark")).toHaveLength(expected);
  });

  it("updates the spark count when the count prop changes", async () => {
    wrapper = await mountSuspended(SparkleEffect, { props: { count: 3 } });
    await wrapper!.setProps({ count: 8 });
    expect(wrapper!.findAll(".sparkle-effect-spark")).toHaveLength(8);
  });

  // ─── Sparks: presets ──────────────────────────────────────────────────────

  it("gives the first five sparks the tuned presets", async () => {
    wrapper = await mountSuspended(SparkleEffect);
    const sparks = wrapper!.findAll(".sparkle-effect-spark");
    const offsets = sparks.map((s) => sparkStyle(s.element).getPropertyValue("--_sparkle-effect-spark-offset"));
    const colours = sparks.map((s) => sparkStyle(s.element).getPropertyValue("--_sparkle-effect-spark-colour"));
    expect(offsets).toEqual(["80%", "60%", "70%", "75%", "70%"]);
    expect(colours[1]).toBe("oklch(from var(--_sparkle-effect-colour) 80% c calc(h + 50))");
    expect(colours[2]).toBe("oklch(from var(--_sparkle-effect-colour) 70% c calc(h + 20))");
    expect(colours[4]).toContain("calc(h + -200)");
    expect(sparkStyle(sparks[3]!.element).getPropertyValue("--_sparkle-effect-spark-translate")).toBe("-2rem 5rem");
  });

  it("nudges hue and offset and mirrors drift for sparks past the fifth", async () => {
    wrapper = await mountSuspended(SparkleEffect, { props: { count: 6 } });
    const sixth = sparkStyle(wrapper!.findAll(".sparkle-effect-spark")[5]!.element);
    expect(sixth.getPropertyValue("--_sparkle-effect-spark-colour")).toContain("calc(h + 35)");
    expect(sixth.getPropertyValue("--_sparkle-effect-spark-offset")).toBe("93%");
    expect(sixth.getPropertyValue("--_sparkle-effect-spark-translate")).toBe("0rem -3rem");
  });

  // ─── Radius ───────────────────────────────────────────────────────────────

  it("sets --sparkle-effect-radius inline when radius is given", async () => {
    wrapper = await mountSuspended(SparkleEffect, { props: { radius: "1.2rem" } });
    expect((wrapper!.element as HTMLElement).style.getPropertyValue("--sparkle-effect-radius")).toBe("1.2rem");
  });

  it("leaves the radius token unset by default so an ancestor value applies", async () => {
    wrapper = await mountSuspended(SparkleEffect);
    expect((wrapper!.element as HTMLElement).style.getPropertyValue("--sparkle-effect-radius")).toBe("");
  });

  // ─── Continuous ───────────────────────────────────────────────────────────

  it("is one-shot by default (no data-continuous)", async () => {
    wrapper = await mountSuspended(SparkleEffect);
    expect(wrapper!.attributes("data-continuous")).toBeUndefined();
  });

  it("sets data-continuous when continuous is on, and clears it when turned off", async () => {
    wrapper = await mountSuspended(SparkleEffect, { props: { continuous: true } });
    expect(wrapper!.attributes("data-continuous")).toBe("");
    await wrapper!.setProps({ continuous: false });
    expect(wrapper!.attributes("data-continuous")).toBeUndefined();
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  it("hides the sparks from assistive tech and keeps them out of the tab order", async () => {
    wrapper = await mountSuspended(SparkleEffect);
    const sparks = wrapper!.find(".sparkle-effect-sparks");
    expect(sparks.attributes("aria-hidden")).toBe("true");
    expect(wrapper!.findAll("[tabindex]")).toHaveLength(0);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies styleClassPassthrough classes", async () => {
    wrapper = await mountSuspended(SparkleEffect, {
      props: { styleClassPassthrough: ["promo", "featured"] },
    });
    expect(wrapper!.classes()).toContain("promo");
    expect(wrapper!.classes()).toContain("featured");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    wrapper = await mountSuspended(SparkleEffect, {
      props: { styleClassPassthrough: ["promo"] },
    });
    await wrapper!.setProps({ styleClassPassthrough: ["featured"] });
    expect(wrapper!.classes()).not.toContain("promo");
    expect(wrapper!.classes()).toContain("featured");
  });
});
