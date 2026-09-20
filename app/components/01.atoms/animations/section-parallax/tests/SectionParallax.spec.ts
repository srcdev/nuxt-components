import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SectionParallax from "../SectionParallax.vue";

const backgroundImage = "/images/eucalyptus-lavender-and-oil.jpg";

describe("SectionParallax", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default)", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (with slot content)", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage },
      slots: { default: "<p class='overlay-text'>A quiet moment.</p>" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it.each(["div", "section", "article", "aside"] as const)("renders as <%s> when tag='%s'", async (tag) => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage, tag },
    });
    expect(wrapper.element.tagName).toBe(tag.toUpperCase());
  });

  // ─── Base class ───────────────────────────────────────────────────────────

  it("always has the section-parallax class", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage },
    });
    expect(wrapper.classes()).toContain("section-parallax");
  });

  // ─── Slot ─────────────────────────────────────────────────────────────────

  it("renders default slot content when provided", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage },
      slots: { default: "<p class='overlay-text'>A quiet moment.</p>" },
    });
    expect(wrapper.find(".overlay-text").exists()).toBe(true);
  });

  it("renders no visible inner content when no slot is provided", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage },
    });
    expect(wrapper.element.children.length).toBe(0);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage, styleClassPassthrough: "featured" },
    });
    expect(wrapper.classes()).toContain("featured");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage, styleClassPassthrough: ["featured", "highlighted"] },
    });
    expect(wrapper.classes()).toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(SectionParallax, {
      props: { backgroundImage, styleClassPassthrough: ["featured"] },
    });
    expect(wrapper.classes()).toContain("featured");
    await wrapper.setProps({ styleClassPassthrough: ["highlighted"] });
    expect(wrapper.classes()).not.toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });
});
