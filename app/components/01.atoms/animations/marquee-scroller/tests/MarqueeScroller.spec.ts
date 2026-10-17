import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import MarqueeScroller from "../MarqueeScroller.vue";

const stubMatchMedia = (prefersReducedMotion: boolean) => {
  const query = { matches: prefersReducedMotion, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(query));
  return query;
};

// jsdom reports 0 for offsetWidth/scrollWidth — stub them per-element by class so
// updateRepeatCount() sees realistic container/content dimensions.
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");

const stubDimensions = ({ containerWidth, groupScrollWidth }: { containerWidth: number; groupScrollWidth: number }) => {
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return this.classList.contains("marquee-scroller") ? containerWidth : 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get() {
      return this.classList.contains("marquee-scroller-group") ? groupScrollWidth : 0;
    },
  });
};

const restoreDimensions = () => {
  if (originalOffsetWidth) Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
  if (originalScrollWidth) Object.defineProperty(HTMLElement.prototype, "scrollWidth", originalScrollWidth);
};

const marqueeData = [
  { id: 1, content: "logo-a" },
  { id: 2, content: "logo-b" },
];

const isPaused = (wrapper: VueWrapper) => wrapper.attributes("data-paused") !== undefined;
const control = (wrapper: VueWrapper) => wrapper.find(".marquee-scroller-control");

describe("MarqueeScroller", () => {
  let wrapper: VueWrapper | undefined;

  beforeEach(() => {
    stubMatchMedia(false);
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    restoreDimensions();
    vi.restoreAllMocks();
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders after mount (displayComponent flips true in onMounted)", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.find(".marquee-scroller").exists()).toBe(true);
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    wrapper = await mountSuspended(MarqueeScroller, {
      props: {
        animationRuntime: "20s",
        reverse: true,
        marqueeData,
        itemConfig: { width: "80px", height: "80px", gap: "24px" },
        ariaLabel: "Client logos",
        ariaDescription: "Custom instructions",
        showControls: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── marqueeData / slots ─────────────────────────────────────────────────

  it("renders each marqueeData item twice (main track + duplicate for looping)", async () => {
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { marqueeData },
      slots: {
        "1": "<span class='logo-a'>A</span>",
        "2": "<span class='logo-b'>B</span>",
      },
    });
    expect(wrapper.findAll(".logo-a")).toHaveLength(2);
    expect(wrapper.findAll(".logo-b")).toHaveLength(2);
  });

  it("renders no items when marqueeData is empty", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.findAll(".marquee-scroller-item")).toHaveLength(0);
  });

  it("makes the duplicate group inert and aria-hidden so its copies can't be focused", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { marqueeData } });
    const groups = wrapper.findAll(".marquee-scroller-group");
    expect(groups[0]!.attributes("inert")).toBeUndefined();
    expect(groups[1]!.attributes("inert")).toBeDefined();
    expect(groups[1]!.attributes("aria-hidden")).toBe("true");
  });

  it("uses only component-prefixed structural class names", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { marqueeData, showControls: true } });
    for (const generic of [".item", ".control-btn", ".marquee-track", ".marquee-group"]) {
      expect(wrapper.find(generic).exists()).toBe(false);
    }
  });

  // ─── reverse ─────────────────────────────────────────────────────────────

  it("does not set data-reverse by default", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.attributes("data-reverse")).toBeUndefined();
  });

  it("sets data-reverse when reverse is true, with no bare state classes", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { reverse: true } });
    expect(wrapper.attributes("data-reverse")).toBe("");
    expect(wrapper.classes()).not.toContain("reverse");
  });

  // ─── Accessibility attributes ────────────────────────────────────────────

  it("defaults aria-label to 'Scrolling content'", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.attributes("aria-label")).toBe("Scrolling content");
  });

  it("uses a custom ariaLabel when provided", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { ariaLabel: "Client logos" } });
    expect(wrapper.attributes("aria-label")).toBe("Client logos");
  });

  it("uses default screen-reader instructions when ariaDescription is not set", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.find(".marquee-scroller-description").text()).toContain("Use spacebar to pause or play");
  });

  it("uses a custom ariaDescription when provided", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { ariaDescription: "Custom instructions" } });
    expect(wrapper.find(".marquee-scroller-description").text()).toBe("Custom instructions");
  });

  it("sets aria-live to off and hides the moving track while playing", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.attributes("aria-live")).toBe("off");
    expect(wrapper.find(".marquee-scroller-track").attributes("aria-hidden")).toBe("true");
  });

  it("exposes the track (no aria-hidden attribute) once paused", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("keydown", { key: " " });
    expect(wrapper.find(".marquee-scroller-track").attributes("aria-hidden")).toBeUndefined();
  });

  // ─── Controls ────────────────────────────────────────────────────────────

  it("does not render the control button by default", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    expect(control(wrapper).exists()).toBe(false);
  });

  it("renders the control as an InputButton when showControls is true", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    expect(control(wrapper).exists()).toBe(true);
    expect(control(wrapper).classes()).toContain("input-button");
    expect(control(wrapper).attributes("type")).toBe("button");
  });

  it("toggles paused state and aria-live when the control button is clicked", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    await control(wrapper).trigger("click");
    expect(isPaused(wrapper)).toBe(true);
    expect(wrapper.attributes("aria-live")).toBe("polite");
    expect(control(wrapper).find(".input-button-text").text()).toBe("Play animation");
  });

  it("does not auto-pause when focus lands on the control button, so one click pauses", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    await control(wrapper).trigger("focusin");
    expect(isPaused(wrapper)).toBe(false);
    await control(wrapper).trigger("click");
    expect(isPaused(wrapper)).toBe(true);
  });

  // ─── Control button icon / label customisation ──────────────────────────

  it("renders the default pause icon while playing", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    expect(control(wrapper).html()).toContain("mdi:pause");
  });

  it("renders the default play icon once paused", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    await control(wrapper).trigger("click");
    expect(control(wrapper).html()).toContain("mdi:play");
  });

  it("renders a custom playIcon/pauseIcon", async () => {
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true, playIcon: "mdi:play-circle", pauseIcon: "mdi:pause-circle" },
    });
    expect(control(wrapper).html()).toContain("mdi:pause-circle");
    await control(wrapper).trigger("click");
    expect(control(wrapper).html()).toContain("mdi:play-circle");
  });

  it("uses custom playLabel/pauseLabel as the control button's accessible text", async () => {
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true, playLabel: "Reproduire", pauseLabel: "Suspendre" },
    });
    expect(control(wrapper).find(".input-button-text").text()).toBe("Suspendre");
    await control(wrapper).trigger("click");
    expect(control(wrapper).find(".input-button-text").text()).toBe("Reproduire");
  });

  it("replaces the toggle icon via the toggle-icon slot", async () => {
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
      slots: { "toggle-icon": "<span class='custom-icon'>custom</span>" },
    });
    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });

  it("passes isPaused to the toggle-icon slot", async () => {
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
      slots: { "toggle-icon": "<template #toggle-icon=\"{ isPaused }\"><span class='state'>{{ isPaused }}</span></template>" },
    });
    expect(wrapper.find(".state").text()).toBe("false");
    await control(wrapper).trigger("click");
    expect(wrapper.find(".state").text()).toBe("true");
  });

  // ─── Keyboard interaction ────────────────────────────────────────────────

  it("toggles pause on spacebar keydown on the region", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("keydown", { key: " " });
    expect(isPaused(wrapper)).toBe(true);
    await wrapper.trigger("keydown", { key: " " });
    expect(isPaused(wrapper)).toBe(false);
  });

  it("ignores spacebar bubbling from inside the region (the control button handles its own)", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    await control(wrapper).trigger("keydown", { key: " " });
    expect(isPaused(wrapper)).toBe(false);
  });

  it("does not react to arrow keys (no manual-stepping behaviour is implemented)", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("keydown", { key: "ArrowLeft" });
    await wrapper.trigger("keydown", { key: "ArrowRight" });
    expect(isPaused(wrapper)).toBe(false);
  });

  // ─── Focus ───────────────────────────────────────────────────────────────

  it("pauses when focus enters the region", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("focusin");
    expect(isPaused(wrapper)).toBe(true);
  });

  it("pauses on focus even when respectReducedMotion is false", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { respectReducedMotion: false } });
    await wrapper.trigger("focusin");
    expect(isPaused(wrapper)).toBe(true);
  });

  it("pauses and exposes the track when focus lands on content inside an item", async () => {
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { marqueeData },
      slots: { "1": "<a class='logo-link' href='#a'>A</a>", "2": "<span>B</span>" },
    });
    await wrapper.find(".logo-link").trigger("focusin");
    expect(isPaused(wrapper)).toBe(true);
    expect(wrapper.find(".marquee-scroller-track").attributes("aria-hidden")).toBeUndefined();
  });

  it("resumes when focus leaves the region if focus caused the pause", async () => {
    wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("focusin");
    await wrapper.trigger("focusout", { relatedTarget: null });
    expect(isPaused(wrapper)).toBe(false);
  });

  it("stays paused while focus moves between elements inside the region", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    await wrapper.trigger("focusin");
    await wrapper.trigger("focusout", { relatedTarget: control(wrapper).element });
    expect(isPaused(wrapper)).toBe(true);
  });

  it("keeps a pause the user chose after focus leaves", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { showControls: true } });
    await control(wrapper).trigger("click");
    await control(wrapper).trigger("focusout", { relatedTarget: null });
    expect(isPaused(wrapper)).toBe(true);
  });

  // ─── Reduced motion ──────────────────────────────────────────────────────

  it("auto-pauses and sets data-reduced-motion when the user prefers reduced motion", async () => {
    stubMatchMedia(true);
    wrapper = await mountSuspended(MarqueeScroller);
    expect(isPaused(wrapper)).toBe(true);
    expect(wrapper.attributes("data-reduced-motion")).toBe("");
  });

  it("stays paused after focus leaves when the user prefers reduced motion", async () => {
    stubMatchMedia(true);
    wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("focusin");
    await wrapper.trigger("focusout", { relatedTarget: null });
    expect(isPaused(wrapper)).toBe(true);
  });

  it("does not check matchMedia when respectReducedMotion is false", async () => {
    const matchMediaSpy = vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    vi.stubGlobal("matchMedia", matchMediaSpy);
    wrapper = await mountSuspended(MarqueeScroller, { props: { respectReducedMotion: false } });
    expect(matchMediaSpy).not.toHaveBeenCalled();
  });

  it("removes its reduced-motion listener on unmount", async () => {
    const query = stubMatchMedia(false);
    wrapper = await mountSuspended(MarqueeScroller);
    const handler = query.addEventListener.mock.calls[0]![1];
    wrapper.unmount();
    wrapper = undefined;
    expect(query.removeEventListener).toHaveBeenCalledWith("change", handler);
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies styleClassPassthrough to the root and updates on change", async () => {
    wrapper = await mountSuspended(MarqueeScroller, { props: { styleClassPassthrough: ["one"] } });
    expect(wrapper.classes()).toContain("one");
    await wrapper.setProps({ styleClassPassthrough: "two three" });
    await nextTick();
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["marquee-scroller", "two", "three"]));
    expect(wrapper.classes()).not.toContain("one");
  });

  // ─── Repeating marqueeData to fill a wide container ─────────────────────

  it("repeats marqueeData enough times so one group's width covers a wide container", async () => {
    stubDimensions({ containerWidth: 500, groupScrollWidth: 100 });
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { marqueeData },
      slots: { "1": "<span class='logo-a'></span>", "2": "<span class='logo-b'></span>" },
    });
    await nextTick();
    await nextTick();
    // needs ceil(500/100) = 5 copies of the 2-item data per group
    expect(wrapper.findAll(".logo-a")).toHaveLength(10);
    expect(wrapper.findAll(".logo-b")).toHaveLength(10);
  });

  it("does not add extra copies when a single copy already covers the container", async () => {
    stubDimensions({ containerWidth: 50, groupScrollWidth: 200 });
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { marqueeData },
      slots: { "1": "<span class='logo-a'></span>", "2": "<span class='logo-b'></span>" },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.findAll(".logo-a")).toHaveLength(2);
    expect(wrapper.findAll(".logo-b")).toHaveLength(2);
  });

  it("caps the repeat count at 50 copies for tiny items in a huge container", async () => {
    stubDimensions({ containerWidth: 100000, groupScrollWidth: 2 });
    wrapper = await mountSuspended(MarqueeScroller, {
      props: { marqueeData },
      slots: { "1": "<span class='logo-a'></span>", "2": "<span class='logo-b'></span>" },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.findAll(".logo-a")).toHaveLength(100);
  });
});
