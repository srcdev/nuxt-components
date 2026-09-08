import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import MarqueeScroller from "../MarqueeScroller.vue";

const stubMatchMedia = (prefersReducedMotion: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: prefersReducedMotion,
      addEventListener: vi.fn(),
    })
  );
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
      return this.classList.contains("marquee-group") ? groupScrollWidth : 0;
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

describe("MarqueeScroller", () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  afterEach(() => {
    restoreDimensions();
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders after mount (displayComponent flips true in onMounted)", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.find(".marquee-scroller").exists()).toBe(true);
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
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
    const wrapper = await mountSuspended(MarqueeScroller, {
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
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.findAll(".item")).toHaveLength(0);
  });

  // ─── reverse ─────────────────────────────────────────────────────────────

  it("does not apply the reverse class by default", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.classes()).not.toContain("reverse");
  });

  it("applies the reverse class when reverse is true", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { reverse: true },
    });
    expect(wrapper.classes()).toContain("reverse");
  });

  // ─── Accessibility attributes ────────────────────────────────────────────

  it("defaults aria-label to 'Scrolling content'", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.attributes("aria-label")).toBe("Scrolling content");
  });

  it("uses a custom ariaLabel when provided", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { ariaLabel: "Client logos" },
    });
    expect(wrapper.attributes("aria-label")).toBe("Client logos");
  });

  it("uses default screen-reader instructions when ariaDescription is not set", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.find(".sr-only").text()).toContain("Use spacebar to pause or play");
  });

  it("uses a custom ariaDescription when provided", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { ariaDescription: "Custom instructions" },
    });
    expect(wrapper.find(".sr-only").text()).toBe("Custom instructions");
  });

  it("sets aria-live to off while playing", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.attributes("aria-live")).toBe("off");
  });

  // ─── Controls ────────────────────────────────────────────────────────────

  it("does not render the control button by default", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.find(".control-btn").exists()).toBe(false);
  });

  it("renders the control button when showControls is true", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
    });
    expect(wrapper.find(".control-btn").exists()).toBe(true);
  });

  it("toggles paused state and aria-live when the control button is clicked", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
    });
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.classes()).toContain("paused");
    expect(wrapper.attributes("aria-live")).toBe("polite");
    expect(wrapper.find(".control-btn").attributes("aria-label")).toBe("Play animation");
  });

  // ─── Control button icon / label customisation ──────────────────────────

  it("renders the default play icon while playing", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
    });
    expect(wrapper.find(".control-btn").html()).toContain("mdi:pause");
  });

  it("renders the default play icon once paused", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
    });
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.find(".control-btn").html()).toContain("mdi:play");
  });

  it("renders a custom playIcon/pauseIcon", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true, playIcon: "mdi:play-circle", pauseIcon: "mdi:pause-circle" },
    });
    expect(wrapper.find(".control-btn").html()).toContain("mdi:pause-circle");
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.find(".control-btn").html()).toContain("mdi:play-circle");
  });

  it("uses custom playLabel/pauseLabel for the control button's aria-label", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true, playLabel: "Reproduire", pauseLabel: "Suspendre" },
    });
    expect(wrapper.find(".control-btn").attributes("aria-label")).toBe("Suspendre");
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.find(".control-btn").attributes("aria-label")).toBe("Reproduire");
  });

  it("replaces the toggle icon via the toggle-icon slot", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
      slots: { "toggle-icon": "<span class='custom-icon'>custom</span>" },
    });
    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });

  it("passes isPaused to the toggle-icon slot", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { showControls: true },
      slots: { "toggle-icon": "<template #toggle-icon=\"{ isPaused }\"><span class='state'>{{ isPaused }}</span></template>" },
    });
    expect(wrapper.find(".state").text()).toBe("false");
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.find(".state").text()).toBe("true");
  });

  // ─── Keyboard interaction ────────────────────────────────────────────────

  it("toggles pause on spacebar keydown", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("keydown", { key: " " });
    expect(wrapper.classes()).toContain("paused");
    await wrapper.trigger("keydown", { key: " " });
    expect(wrapper.classes()).not.toContain("paused");
  });

  it("does not react to arrow keys (no manual-stepping behaviour is implemented)", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("keydown", { key: "ArrowLeft" });
    await wrapper.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.classes()).not.toContain("paused");
  });

  // ─── Focus / blur ────────────────────────────────────────────────────────

  it("pauses on focus when respectReducedMotion is true (default)", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("focus");
    expect(wrapper.classes()).toContain("paused");
  });

  it("resumes on blur when the user does not prefer reduced motion", async () => {
    const wrapper = await mountSuspended(MarqueeScroller);
    await wrapper.trigger("focus");
    await wrapper.trigger("blur");
    expect(wrapper.classes()).not.toContain("paused");
  });

  it("does not pause on focus when respectReducedMotion is false", async () => {
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { respectReducedMotion: false },
    });
    await wrapper.trigger("focus");
    expect(wrapper.classes()).not.toContain("paused");
  });

  // ─── Reduced motion ──────────────────────────────────────────────────────

  it("auto-pauses and applies reduced-motion class when the user prefers reduced motion", async () => {
    stubMatchMedia(true);
    const wrapper = await mountSuspended(MarqueeScroller);
    expect(wrapper.classes()).toContain("paused");
    expect(wrapper.classes()).toContain("reduced-motion");
  });

  it("does not check matchMedia when respectReducedMotion is false", async () => {
    stubMatchMedia(false);
    const matchMediaSpy = vi.fn(() => ({ matches: false, addEventListener: vi.fn() }));
    vi.stubGlobal("matchMedia", matchMediaSpy);
    await mountSuspended(MarqueeScroller, {
      props: { respectReducedMotion: false },
    });
    expect(matchMediaSpy).not.toHaveBeenCalled();
  });

  // ─── Repeating marqueeData to fill a wide container ─────────────────────

  it("repeats marqueeData enough times so one group's width covers a wide container", async () => {
    stubDimensions({ containerWidth: 500, groupScrollWidth: 100 });
    const wrapper = await mountSuspended(MarqueeScroller, {
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
    const wrapper = await mountSuspended(MarqueeScroller, {
      props: { marqueeData },
      slots: { "1": "<span class='logo-a'></span>", "2": "<span class='logo-b'></span>" },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.findAll(".logo-a")).toHaveLength(2);
    expect(wrapper.findAll(".logo-b")).toHaveLength(2);
  });
});
