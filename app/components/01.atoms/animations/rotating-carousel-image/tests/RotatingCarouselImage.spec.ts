import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import RotatingCarouselImage from "../RotatingCarouselImage.vue";

const stubMatchMedia = (prefersReducedMotion: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: prefersReducedMotion,
      addEventListener: vi.fn(),
    })
  );
};

const carouselData = [
  { src: "/a.jpg", alt: "A" },
  { src: "/b.jpg", alt: "B" },
];

describe("RotatingCarouselImage", () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: {
        data: carouselData,
        tag: "section",
        rotateX: 10,
        perspective: 1200,
        translateZ: 1200,
        pauseOnHover: true,
        useParallaxEffect: false,
        showControls: true,
        ariaLabel: "Custom carousel",
        ariaDescription: "Custom instructions",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── data / rendering ────────────────────────────────────────────────────

  it("renders one .item per data entry", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { data: carouselData, useParallaxEffect: false },
    });
    expect(wrapper.findAll(".item")).toHaveLength(2);
  });

  it("renders no items when data is empty", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.findAll(".item")).toHaveLength(0);
  });

  it("renders the given tag", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { tag: "section", useParallaxEffect: false },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  // ─── Accessibility attributes ────────────────────────────────────────────

  it("defaults aria-label", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.attributes("aria-label")).toBe("Rotating image carousel");
  });

  it("uses a custom ariaLabel when provided", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { ariaLabel: "Client photos", useParallaxEffect: false },
    });
    expect(wrapper.attributes("aria-label")).toBe("Client photos");
  });

  it("uses default screen-reader instructions when ariaDescription is not set", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.find(".sr-only").text()).toContain("Use spacebar to pause or play");
  });

  it("uses a custom ariaDescription when provided", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { ariaDescription: "Custom instructions", useParallaxEffect: false },
    });
    expect(wrapper.find(".sr-only").text()).toBe("Custom instructions");
  });

  // ─── Controls ────────────────────────────────────────────────────────────

  it("does not render the control button by default", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.find(".control-btn").exists()).toBe(false);
  });

  it("renders the control button when showControls is true", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { showControls: true, useParallaxEffect: false },
    });
    expect(wrapper.find(".control-btn").exists()).toBe(true);
  });

  it("toggles paused state when the control button is clicked", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { showControls: true, useParallaxEffect: false },
    });
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.classes()).toContain("paused");
    expect(wrapper.find(".control-btn").attributes("aria-label")).toBe("Play rotation");
  });

  it("renders a custom playIcon/pauseIcon", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { showControls: true, useParallaxEffect: false, playIcon: "mdi:play-circle", pauseIcon: "mdi:pause-circle" },
    });
    expect(wrapper.find(".control-btn").html()).toContain("mdi:pause-circle");
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.find(".control-btn").html()).toContain("mdi:play-circle");
  });

  it("uses custom playLabel/pauseLabel for the control button's aria-label", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { showControls: true, useParallaxEffect: false, playLabel: "Reproduire", pauseLabel: "Suspendre" },
    });
    expect(wrapper.find(".control-btn").attributes("aria-label")).toBe("Suspendre");
    await wrapper.find(".control-btn").trigger("click");
    expect(wrapper.find(".control-btn").attributes("aria-label")).toBe("Reproduire");
  });

  it("replaces the toggle icon via the toggle-icon slot", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { showControls: true, useParallaxEffect: false },
      slots: { "toggle-icon": "<span class='custom-icon'>custom</span>" },
    });
    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });

  // ─── Keyboard interaction ────────────────────────────────────────────────

  it("toggles pause on spacebar keydown", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    await wrapper.trigger("keydown", { key: " " });
    expect(wrapper.classes()).toContain("paused");
    await wrapper.trigger("keydown", { key: " " });
    expect(wrapper.classes()).not.toContain("paused");
  });

  // ─── Focus / blur ────────────────────────────────────────────────────────

  it("pauses on focus", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    await wrapper.trigger("focus");
    expect(wrapper.classes()).toContain("paused");
  });

  it("resumes on blur when the user does not prefer reduced motion", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    await wrapper.trigger("focus");
    await wrapper.trigger("blur");
    expect(wrapper.classes()).not.toContain("paused");
  });

  // ─── pauseOnHover ────────────────────────────────────────────────────────

  it("does not apply the hover-pauses class by default", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.classes()).not.toContain("hover-pauses");
  });

  it("applies the hover-pauses class when pauseOnHover is true", async () => {
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { pauseOnHover: true, useParallaxEffect: false },
    });
    expect(wrapper.classes()).toContain("hover-pauses");
  });

  // ─── Reduced motion ──────────────────────────────────────────────────────

  it("auto-pauses and applies reduced-motion class when the user prefers reduced motion", async () => {
    stubMatchMedia(true);
    const wrapper = await mountSuspended(RotatingCarouselImage, {
      props: { useParallaxEffect: false },
    });
    expect(wrapper.classes()).toContain("paused");
    expect(wrapper.classes()).toContain("reduced-motion");
  });

  it("does not check matchMedia when respectReducedMotion is false", async () => {
    stubMatchMedia(false);
    const matchMediaSpy = vi.fn(() => ({ matches: false, addEventListener: vi.fn() }));
    vi.stubGlobal("matchMedia", matchMediaSpy);
    await mountSuspended(RotatingCarouselImage, {
      props: { respectReducedMotion: false, useParallaxEffect: false },
    });
    expect(matchMediaSpy).not.toHaveBeenCalled();
  });
});
