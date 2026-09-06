import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AnimatedSvgText from "../AnimatedSvgText.vue";

describe("AnimatedSvgText", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(AnimatedSvgText);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(AnimatedSvgText, {
      slots: { text: '<svg viewBox="0 0 100 100"><path d="M0 0 L100 100" /></svg>' },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ────────────────────────────────────────────────────────

  it("renders a div with the animated-svg-text class", async () => {
    const wrapper = await mountSuspended(AnimatedSvgText);
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("animated-svg-text");
  });

  // ─── Slot ────────────────────────────────────────────────────────────────

  it("renders the text slot content", async () => {
    const wrapper = await mountSuspended(AnimatedSvgText, {
      slots: { text: '<svg data-testid="my-svg"><path d="M0 0" /></svg>' },
    });
    expect(wrapper.find('[data-testid="my-svg"]').exists()).toBe(true);
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    const wrapper = await mountSuspended(AnimatedSvgText, {
      props: { styleClassPassthrough: "hero-svg-text" },
    });
    expect(wrapper.classes()).toContain("hero-svg-text");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(AnimatedSvgText, {
      props: { styleClassPassthrough: ["hero-svg-text", "mbe-32"] },
    });
    expect(wrapper.classes()).toContain("hero-svg-text");
    expect(wrapper.classes()).toContain("mbe-32");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(AnimatedSvgText, {
      props: { styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
