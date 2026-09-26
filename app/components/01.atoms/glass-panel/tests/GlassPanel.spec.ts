import { describe, it, expect } from "vitest";
import { h, nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import GlassPanel from "../GlassPanel.vue";

describe("GlassPanel", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(GlassPanel);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a div with the glass-panel class by default", async () => {
    const wrapper = await mountSuspended(GlassPanel);
    const root = wrapper.find(".glass-panel");
    expect(root.element.tagName).toBe("DIV");
    expect(root.attributes("aria-labelledby")).toBeUndefined();
  });

  it("renders default slot content", async () => {
    const wrapper = await mountSuspended(GlassPanel, {
      slots: { default: () => "Panel content" },
    });
    expect(wrapper.find(".glass-panel").text()).toBe("Panel content");
  });

  it.each(["main", "header", "footer"] as const)("renders <%s> without aria-labelledby", async (tag) => {
    const wrapper = await mountSuspended(GlassPanel, { props: { tag } });
    const root = wrapper.find(".glass-panel");
    expect(root.element.tagName).toBe(tag.toUpperCase());
    expect(root.attributes("aria-labelledby")).toBeUndefined();
  });

  it.each(["section", "article"] as const)(
    "labels a <%s> from the heading bound to the heading-id slot prop",
    async (tag) => {
      const wrapper = await mountSuspended(GlassPanel, {
        props: { tag },
        slots: {
          default: ({ headingId }: { headingId: string }) => h("h2", { id: headingId }, "Booking"),
        },
      });
      const root = wrapper.find(".glass-panel");
      const heading = wrapper.find("h2");
      expect(root.element.tagName).toBe(tag.toUpperCase());
      expect(heading.attributes("id")).toBeTruthy();
      expect(root.attributes("aria-labelledby")).toBe(heading.attributes("id"));
    }
  );

  it("applies styleClassPassthrough and updates on change", async () => {
    const wrapper = await mountSuspended(GlassPanel, { props: { styleClassPassthrough: ["one"] } });
    expect(wrapper.find(".glass-panel").classes()).toContain("one");

    await wrapper.setProps({ styleClassPassthrough: "two three" });
    await nextTick();
    const classes = wrapper.find(".glass-panel").classes();
    expect(classes).toContain("two");
    expect(classes).toContain("three");
    expect(classes).not.toContain("one");
  });
});
