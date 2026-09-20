import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import GlowingBorder from "../GlowingBorder.vue";

describe("GlowingBorder", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(GlowingBorder);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default)", async () => {
    const wrapper = await mountSuspended(GlowingBorder, {
      slots: { default: "Content" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountSuspended(GlowingBorder);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it.each(["div", "p", "span", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"] as const)(
    "renders as <%s> when tag='%s'",
    async (tag) => {
      const wrapper = await mountSuspended(GlowingBorder, { props: { tag } });
      expect(wrapper.element.tagName).toBe(tag.toUpperCase());
    }
  );

  // ─── Base class ───────────────────────────────────────────────────────────

  it("always has the glowing-border class", async () => {
    const wrapper = await mountSuspended(GlowingBorder);
    expect(wrapper.classes()).toContain("glowing-border");
  });

  // ─── Slot ─────────────────────────────────────────────────────────────────

  it("renders default slot content", async () => {
    const wrapper = await mountSuspended(GlowingBorder, {
      slots: { default: "<p class='custom'>Custom</p>" },
    });
    expect(wrapper.find(".custom").exists()).toBe(true);
  });

  // ─── Variant ──────────────────────────────────────────────────────────────

  it("applies subtle variant class by default", async () => {
    const wrapper = await mountSuspended(GlowingBorder);
    expect(wrapper.classes()).toContain("subtle");
  });

  it.each(["subtle", "vivid", "silver", "steel", "green"] as const)(
    "applies %s variant class when variant='%s'",
    async (variant) => {
      const wrapper = await mountSuspended(GlowingBorder, { props: { variant } });
      expect(wrapper.classes()).toContain(variant);
    }
  );

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(GlowingBorder, {
      props: { styleClassPassthrough: "featured" },
    });
    expect(wrapper.classes()).toContain("featured");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(GlowingBorder, {
      props: { styleClassPassthrough: ["featured", "highlighted"] },
    });
    expect(wrapper.classes()).toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(GlowingBorder, {
      props: { styleClassPassthrough: ["featured"] },
    });
    expect(wrapper.classes()).toContain("featured");
    await wrapper.setProps({ styleClassPassthrough: ["highlighted"] });
    expect(wrapper.classes()).not.toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });
});
