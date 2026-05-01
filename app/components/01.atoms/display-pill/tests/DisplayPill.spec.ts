import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayPill from "../DisplayPill.vue";

describe("DisplayPill", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default)", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Status" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (with icon slot)", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Status", variant: "success", size: "lg" },
      slots: { icon: "<span class='icon'>✓</span>" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (reversed)", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Status", reversed: true },
      slots: { icon: "<span class='icon'>✓</span>" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as <span> by default", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it.each(["span", "div", "button", "a"] as const)("renders as <%s> when tag='%s'", async (tag) => {
    const wrapper = await mountSuspended(DisplayPill, { props: { tag } });
    expect(wrapper.element.tagName).toBe(tag.toUpperCase());
  });

  // ─── Base class ───────────────────────────────────────────────────────────

  it("always has the display-pill class", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.classes()).toContain("display-pill");
  });

  // ─── Label ────────────────────────────────────────────────────────────────

  it("renders label text inside .pill-label", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Active" },
    });
    expect(wrapper.find(".pill-label").text()).toBe("Active");
  });

  it("renders default slot when no label prop is set", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      slots: { default: "<strong class='custom'>Custom</strong>" },
    });
    expect(wrapper.find(".custom").exists()).toBe(true);
    expect(wrapper.find(".pill-label").exists()).toBe(false);
  });

  it("does not render default slot when label prop is set", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Active" },
      slots: { default: "<strong class='custom'>Custom</strong>" },
    });
    expect(wrapper.find(".pill-label").exists()).toBe(true);
    expect(wrapper.find(".custom").exists()).toBe(false);
  });

  // ─── Icon slot ────────────────────────────────────────────────────────────

  it("renders icon slot content", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      slots: { icon: "<span class='test-icon'>★</span>" },
    });
    expect(wrapper.find(".test-icon").exists()).toBe(true);
  });

  // ─── Size ─────────────────────────────────────────────────────────────────

  it("applies md size class by default", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.classes()).toContain("md");
  });

  it.each(["sm", "md", "lg"] as const)("applies %s size class when size='%s'", async (size) => {
    const wrapper = await mountSuspended(DisplayPill, { props: { size } });
    expect(wrapper.classes()).toContain(size);
  });

  // ─── Variant ──────────────────────────────────────────────────────────────

  it("applies default variant class by default", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.classes()).toContain("default");
  });

  it.each(["default", "primary", "success", "warning", "danger", "neutral"] as const)(
    "applies %s variant class when variant='%s'",
    async (variant) => {
      const wrapper = await mountSuspended(DisplayPill, { props: { variant } });
      expect(wrapper.classes()).toContain(variant);
    }
  );

  // ─── Reversed ─────────────────────────────────────────────────────────────

  it("does not apply is-reversed class by default", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.classes()).not.toContain("is-reversed");
  });

  it("applies is-reversed class when reversed=true", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { reversed: true },
    });
    expect(wrapper.classes()).toContain("is-reversed");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { styleClassPassthrough: "featured" },
    });
    expect(wrapper.classes()).toContain("featured");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { styleClassPassthrough: ["featured", "highlighted"] },
    });
    expect(wrapper.classes()).toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { styleClassPassthrough: ["featured"] },
    });
    expect(wrapper.classes()).toContain("featured");
    await wrapper.setProps({ styleClassPassthrough: ["highlighted"] });
    expect(wrapper.classes()).not.toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });
});
