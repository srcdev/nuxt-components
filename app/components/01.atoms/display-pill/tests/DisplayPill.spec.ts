import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayPill from "../DisplayPill.vue";
import { defineComponent, nextTick, ref } from "vue";

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

  it("renders label text inside .display-pill-label", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Active" },
    });
    expect(wrapper.find(".display-pill-label").text()).toBe("Active");
  });

  it("renders default slot inside .display-pill-label when no label prop is set", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      slots: { default: "<strong class='custom'>Custom</strong>" },
    });
    expect(wrapper.find(".display-pill-label .custom").exists()).toBe(true);
  });

  it("treats a whitespace-only label as no label and falls back to the default slot", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "   " },
      slots: { default: "<strong class='custom'>Custom</strong>" },
    });
    expect(wrapper.find(".display-pill-label .custom").exists()).toBe(true);
  });

  it.each(["", "   "])("renders no label element for label=%j with no default slot", async (label) => {
    const wrapper = await mountSuspended(DisplayPill, { props: { label } });
    expect(wrapper.find(".display-pill-label").exists()).toBe(false);
  });

  it("renders a label with HTML-like text as text, not markup", async () => {
    const wrapper = await mountSuspended(DisplayPill, { props: { label: "<b>bold</b>" } });
    expect(wrapper.find(".display-pill-label").text()).toBe("<b>bold</b>");
    expect(wrapper.find("b").exists()).toBe(false);
  });

  it("does not render default slot when label prop is set", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Active" },
      slots: { default: "<strong class='custom'>Custom</strong>" },
    });
    expect(wrapper.find(".display-pill-label").exists()).toBe(true);
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

  it("sets data-size='md' by default", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.attributes("data-size")).toBe("md");
  });

  it.each(["sm", "md", "lg"] as const)("sets data-size='%s' when size='%s'", async (size) => {
    const wrapper = await mountSuspended(DisplayPill, { props: { size } });
    expect(wrapper.attributes("data-size")).toBe(size);
    expect(wrapper.classes()).not.toContain(size);
  });

  // ─── Variant ──────────────────────────────────────────────────────────────

  it("sets data-variant='default' by default", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.attributes("data-variant")).toBe("default");
  });

  it.each(["default", "primary", "success", "warning", "danger", "neutral"] as const)(
    "sets data-variant='%s' when variant='%s'",
    async (variant) => {
      const wrapper = await mountSuspended(DisplayPill, { props: { variant } });
      expect(wrapper.attributes("data-variant")).toBe(variant);
      expect(wrapper.classes()).not.toContain(variant);
    }
  );

  // ─── Reversed ─────────────────────────────────────────────────────────────

  it("does not set data-reversed by default", async () => {
    const wrapper = await mountSuspended(DisplayPill);
    expect(wrapper.attributes("data-reversed")).toBeUndefined();
  });

  it("sets data-reversed when reversed=true", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { reversed: true },
    });
    expect(wrapper.attributes("data-reversed")).toBeDefined();
    expect(wrapper.classes()).not.toContain("is-reversed");
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

  // ─── Migration 2026-09-27 ──────────────────────────────────────────────────

  it("wraps icon slot content in .display-pill-icon", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Status" },
      slots: { icon: "<span class='dot'>●</span>" },
    });
    expect(wrapper.find(".display-pill-icon .dot").exists()).toBe(true);
  });

  it("does not render the icon wrapper without an icon slot", async () => {
    const wrapper = await mountSuspended(DisplayPill, { props: { label: "Status" } });
    expect(wrapper.find(".display-pill-icon").exists()).toBe(false);
  });

  it("gives a button pill type=button so it can't submit a form", async () => {
    const wrapper = await mountSuspended(DisplayPill, { props: { tag: "button", label: "Filter" } });
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("does not set type on non-button pills", async () => {
    const wrapper = await mountSuspended(DisplayPill, { props: { tag: "a", label: "Link" } });
    expect(wrapper.attributes("type")).toBeUndefined();
  });

  it("passes href through to an anchor pill", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { tag: "a", label: "Link" },
      attrs: { href: "/tags/new" },
    });
    expect(wrapper.attributes("href")).toBe("/tags/new");
  });

  // ─── Icon position (drives icon-side padding) ─────────────────────────────

  it("sets no data-icon-position without an icon", async () => {
    const wrapper = await mountSuspended(DisplayPill, { props: { label: "Status" } });
    expect(wrapper.attributes("data-icon-position")).toBeUndefined();
  });

  it("sets data-icon-position='start' for an icon before the label", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Status" },
      slots: { icon: "<span>●</span>" },
    });
    expect(wrapper.attributes("data-icon-position")).toBe("start");
  });

  it("sets data-icon-position='end' when reversed", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Status", reversed: true },
      slots: { icon: "<span>●</span>" },
    });
    expect(wrapper.attributes("data-icon-position")).toBe("end");
  });

  it("sets data-icon-position='only' for an icon with no label or text", async () => {
    const wrapper = await mountSuspended(DisplayPill, { slots: { icon: "<span>●</span>" } });
    expect(wrapper.attributes("data-icon-position")).toBe("only");
  });

  it("sets data-icon-position='only' when the label is whitespace", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "  " },
      slots: { icon: "<span>●</span>" },
    });
    expect(wrapper.attributes("data-icon-position")).toBe("only");
  });

  it("treats default slot text as a label for icon position", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      slots: { icon: "<span>●</span>", default: "Pro plan" },
    });
    expect(wrapper.attributes("data-icon-position")).toBe("start");
  });

  it("updates data-icon-position when reversed changes", async () => {
    const wrapper = await mountSuspended(DisplayPill, {
      props: { label: "Status" },
      slots: { icon: "<span>●</span>" },
    });
    await wrapper.setProps({ reversed: true });
    expect(wrapper.attributes("data-icon-position")).toBe("end");
  });

  it("drops data-icon-position when the icon slot is removed after mount", async () => {
    const Host = defineComponent({
      components: { DisplayPill },
      setup() {
        const showIcon = ref(true);
        return { showIcon };
      },
      template: `
        <DisplayPill label="Status">
          <template v-if="showIcon" #icon><span>●</span></template>
        </DisplayPill>
      `,
    });
    const wrapper = await mountSuspended(Host);
    const pill = () => wrapper.find(".display-pill");
    expect(pill().attributes("data-icon-position")).toBe("start");
    (wrapper.vm as unknown as { showIcon: boolean }).showIcon = false;
    await nextTick();
    expect(pill().attributes("data-icon-position")).toBeUndefined();
    expect(pill().find(".display-pill-icon").exists()).toBe(false);
  });
});
