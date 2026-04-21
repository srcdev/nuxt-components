import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ScrollRevealFrame from "../ScrollRevealFrame.vue";

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

  it("always has the reveal-frame class", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    expect(wrapper.classes()).toContain("reveal-frame");
  });

  // ─── Inner content wrapper ───────────────────────────────────────────────

  it("renders a .reveal-content child element", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    expect(wrapper.find(".reveal-content").exists()).toBe(true);
  });

  // ─── Slot ────────────────────────────────────────────────────────────────

  it("renders slot content inside .reveal-content", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      slots: { default: "<p class='slot-child'>Hello</p>" },
    });
    const content = wrapper.find(".reveal-content");
    expect(content.find(".slot-child").exists()).toBe(true);
    expect(content.find(".slot-child").text()).toBe("Hello");
  });

  it("renders multiple slot children inside .reveal-content", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      slots: { default: "<div class='child-a'></div><div class='child-b'></div>" },
    });
    const content = wrapper.find(".reveal-content");
    expect(content.find(".child-a").exists()).toBe(true);
    expect(content.find(".child-b").exists()).toBe(true);
  });

  // ─── CSS custom properties ───────────────────────────────────────────────

  it("sets --_frame-height to 540px by default", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_frame-height")).toBe("540px");
  });

  it("sets --_parallax-offset to 36rem by default", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_parallax-offset")).toBe("36rem");
  });

  it("sets --_radius to 0px by default", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame);
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_radius")).toBe("0px");
  });

  it("reflects frameHeight prop in --_frame-height", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { frameHeight: "80vh" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_frame-height")).toBe("80vh");
  });

  it("reflects parallaxOffset prop in --_parallax-offset", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { parallaxOffset: "48rem" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_parallax-offset")).toBe("48rem");
  });

  it("reflects radius prop in --_radius", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { radius: "2.4rem" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_radius")).toBe("2.4rem");
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

  it("does not apply styleClassPassthrough to .reveal-content", async () => {
    const wrapper = await mountSuspended(ScrollRevealFrame, {
      props: { styleClassPassthrough: "hero-frame" },
    });
    expect(wrapper.find(".reveal-content").classes()).not.toContain("hero-frame");
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
