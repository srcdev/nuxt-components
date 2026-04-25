import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ScrollParallaxSection from "../ScrollParallaxSection.vue";

describe("ScrollParallaxSection", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the bg and content divs", async () => {
    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg" },
    });
    expect(wrapper.find(".scroll-parallax-section__bg").exists()).toBe(true);
    expect(wrapper.find(".scroll-parallax-section__content").exists()).toBe(true);
  });

  it("renders slot content inside __content", async () => {
    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg" },
      slots: { default: "<p>Hello</p>" },
    });
    expect(wrapper.find(".scroll-parallax-section__content p").text()).toBe("Hello");
  });

  it("renders as the given tag", async () => {
    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg", tag: "section" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("section");
  });

  it("defaults to div tag", async () => {
    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg", styleClassPassthrough: "my-custom-class" },
    });
    expect(wrapper.classes()).toContain("my-custom-class");
  });

  it("adds and removes scroll and resize listeners on mount/unmount", async () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg" },
    });

    expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function), { passive: true });

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("updates bg transform on scroll", async () => {
    const wrapper = await mountSuspended(ScrollParallaxSection, {
      props: { backgroundImage: "/img/bg.jpg", parallaxStrength: 0.3 },
    });

    const bg = wrapper.find(".scroll-parallax-section__bg").element as HTMLElement;

    Object.defineProperty(wrapper.element, "offsetTop", { value: 400, configurable: true });
    Object.defineProperty(wrapper.element, "offsetHeight", { value: 600, configurable: true });

    window.dispatchEvent(new Event("scroll"));
    await nextTick();

    expect(bg.style.transform).toMatch(/translate3d\(/);
  });
});
