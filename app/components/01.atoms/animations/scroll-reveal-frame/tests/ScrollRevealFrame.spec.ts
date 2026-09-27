import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ScrollRevealFrame from "../ScrollRevealFrame.vue";

const styleOf = (el: Element) => (el as HTMLElement).style;

describe("ScrollRevealFrame", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: {
        frameHeight: "400px",
        parallaxOffset: "20rem",
        radius: "1.6rem",
        styleClassPassthrough: ["custom-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ────────────────────────────────────────────────────────

  it("renders a <figure> as the root element", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    expect(wrapper.element.tagName).toBe("FIGURE");
  });

  it("always has the scroll-reveal-frame class", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    expect(wrapper.classes()).toContain("scroll-reveal-frame");
  });

  // ─── Inner content wrapper ───────────────────────────────────────────────

  it("renders a .scroll-reveal-frame-content child element", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    expect(wrapper.find(".scroll-reveal-frame-content").exists()).toBe(true);
  });

  // ─── Slot ────────────────────────────────────────────────────────────────

  it("renders slot content inside .scroll-reveal-frame-content", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      slots: { default: "<p class='slot-child'>Hello</p>" },
    });
    const content = wrapper.find(".scroll-reveal-frame-content");
    expect(content.find(".slot-child").exists()).toBe(true);
    expect(content.find(".slot-child").text()).toBe("Hello");
  });

  it("renders multiple slot children inside .scroll-reveal-frame-content", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      slots: { default: "<div class='child-a'></div><div class='child-b'></div>" },
    });
    const content = wrapper.find(".scroll-reveal-frame-content");
    expect(content.find(".child-a").exists()).toBe(true);
    expect(content.find(".child-b").exists()).toBe(true);
  });

  // ─── CSS custom properties ───────────────────────────────────────────────

  it("sets no inline tokens by default, so CSS overrides and defaults apply", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    const style = styleOf(wrapper.element);
    expect(style.getPropertyValue("--scroll-reveal-frame-height")).toBe("");
    expect(style.getPropertyValue("--scroll-reveal-frame-parallax-offset")).toBe("");
    expect(style.getPropertyValue("--scroll-reveal-frame-radius")).toBe("");
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("reflects frameHeight prop in --scroll-reveal-frame-height", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { frameHeight: "80vh" },
    });
    expect(styleOf(wrapper.element).getPropertyValue("--scroll-reveal-frame-height")).toBe("80vh");
  });

  it("reflects parallaxOffset prop in --scroll-reveal-frame-parallax-offset", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { parallaxOffset: "48rem" },
    });
    expect(styleOf(wrapper.element).getPropertyValue("--scroll-reveal-frame-parallax-offset")).toBe("48rem");
  });

  it("reflects radius prop in --scroll-reveal-frame-radius", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { radius: "2.4rem" },
    });
    expect(styleOf(wrapper.element).getPropertyValue("--scroll-reveal-frame-radius")).toBe("2.4rem");
  });

  it("only sets the tokens whose props were passed", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { radius: "1rem" },
    });
    const style = styleOf(wrapper.element);
    expect(style.getPropertyValue("--scroll-reveal-frame-radius")).toBe("1rem");
    expect(style.getPropertyValue("--scroll-reveal-frame-height")).toBe("");
  });

  it("removes the inline token when the prop is cleared", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { frameHeight: "400px" },
    });
    await wrapper.setProps({ frameHeight: undefined });
    expect(styleOf(wrapper.element).getPropertyValue("--scroll-reveal-frame-height")).toBe("");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { styleClassPassthrough: "hero-frame" },
    });
    expect(wrapper.classes()).toContain("hero-frame");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { styleClassPassthrough: ["hero-frame", "mbe-32"] },
    });
    expect(wrapper.classes()).toContain("hero-frame");
    expect(wrapper.classes()).toContain("mbe-32");
  });

  it("does not apply styleClassPassthrough to .scroll-reveal-frame-content", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { styleClassPassthrough: "hero-frame" },
    });
    expect(wrapper.find(".scroll-reveal-frame-content").classes()).not.toContain("hero-frame");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
