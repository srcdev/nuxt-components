import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TabsCore from "../TabsCore.vue";

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const slots = {
  "tab-0-trigger": "Tab One",
  "tab-0-content": "<p class='panel-0'>Content one</p>",
  "tab-1-trigger": "Tab Two",
  "tab-1-content": "<p class='panel-1'>Content two</p>",
  "tab-2-trigger": "Tab Three",
  "tab-2-content": "<p class='panel-2'>Content three</p>",
};

const fiveSlots = {
  ...slots,
  "tab-3-trigger": "Tab Four",
  "tab-3-content": "<p class='panel-3'>Content four</p>",
  "tab-4-trigger": "Tab Five",
  "tab-4-content": "<p class='panel-4'>Content five</p>",
};

describe("TabsCore", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders one trigger and one panel per itemCount", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    expect(wrapper.findAll(".tabs-list-item")).toHaveLength(3);
    expect(wrapper.findAll(".tab-content")).toHaveLength(3);
  });

  // ─── Accessibility structure ─────────────────────────────────────────────

  it("renders a tablist with the default aria-label", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const tablist = wrapper.find("[role='tablist']");
    expect(tablist.exists()).toBe(true);
    expect(tablist.attributes("aria-label")).toBe("Tabs");
  });

  it("uses a custom ariaLabel when provided", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3, ariaLabel: "Settings" }, slots });
    expect(wrapper.find("[role='tablist']").attributes("aria-label")).toBe("Settings");
  });

  it("renders each trigger as a type=button with role=tab", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");
    triggers.forEach((trigger) => {
      expect(trigger.attributes("type")).toBe("button");
      expect(trigger.attributes("role")).toBe("tab");
    });
  });

  it("renders each panel as role=tabpanel labelled by its trigger", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const panels = wrapper.findAll(".tab-content");
    panels.forEach((panel, index) => {
      expect(panel.attributes("role")).toBe("tabpanel");
      expect(panel.attributes("aria-labelledby")).toBe(`tab-${index}-trigger`);
    });
  });

  // ─── Active tab state ────────────────────────────────────────────────────

  it("marks the first tab active and its panel visible/unhidden on mount", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");
    const panels = wrapper.findAll(".tab-content");

    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
    expect(triggers[0]!.attributes("tabindex")).toBe("0");
    expect(triggers[1]!.attributes("aria-selected")).toBe("false");
    expect(triggers[1]!.attributes("tabindex")).toBe("-1");

    expect(panels[0]!.attributes("aria-hidden")).toBe("false");
    expect((panels[0]!.element as HTMLElement).style.display).toBe("block");
    expect(panels[1]!.attributes("aria-hidden")).toBe("true");
    expect((panels[1]!.element as HTMLElement).style.display).toBe("none");
  });

  it("activates a tab on click and updates aria-selected, tabindex, and panel visibility", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");
    const panels = wrapper.findAll(".tab-content");

    await triggers[1]!.trigger("click");

    expect(triggers[0]!.attributes("aria-selected")).toBe("false");
    expect(triggers[0]!.attributes("tabindex")).toBe("-1");
    expect(triggers[1]!.attributes("aria-selected")).toBe("true");
    expect(triggers[1]!.attributes("tabindex")).toBe("0");

    expect(panels[0]!.attributes("aria-hidden")).toBe("true");
    expect(panels[1]!.attributes("aria-hidden")).toBe("false");
    expect((panels[1]!.element as HTMLElement).style.display).toBe("block");
  });

  // ─── Keyboard navigation ─────────────────────────────────────────────────

  it("moves focus and activates the next tab on ArrowRight (axis x)", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[0]!.trigger("keydown", { key: "ArrowRight" });

    expect(triggers[1]!.attributes("aria-selected")).toBe("true");
    expect(triggers[1]!.attributes("tabindex")).toBe("0");
  });

  it("wraps to the first tab on ArrowRight from the last tab", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[2]!.trigger("click");
    await triggers[2]!.trigger("keydown", { key: "ArrowRight" });

    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });

  it("moves focus to the previous tab on ArrowLeft (axis x)", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[1]!.trigger("click");
    await triggers[1]!.trigger("keydown", { key: "ArrowLeft" });

    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });

  it("uses ArrowUp/ArrowDown instead of ArrowLeft/ArrowRight when axis is y", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3, axis: "y" }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");

    await triggers[0]!.trigger("keydown", { key: "ArrowDown" });
    expect(triggers[1]!.attributes("aria-selected")).toBe("true");
  });

  it("jumps to the last tab on End and the first tab on Home", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[0]!.trigger("keydown", { key: "End" });
    expect(triggers[2]!.attributes("aria-selected")).toBe("true");

    await triggers[2]!.trigger("keydown", { key: "Home" });
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });

  // ─── trackHover / trackActive / trackIndicator ──────────────────────────

  it("renders all three indicator decorators by default", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    expect(wrapper.find(".nav__hovered").exists()).toBe(true);
    expect(wrapper.find(".nav__active").exists()).toBe(true);
    expect(wrapper.find(".nav__active-indicator").exists()).toBe(true);
  });

  it("omits the hover decorator when trackHover is false", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3, trackHover: false }, slots });
    expect(wrapper.find(".nav__hovered").exists()).toBe(false);
  });

  it("omits the active decorator when trackActive is false", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3, trackActive: false }, slots });
    expect(wrapper.find(".nav__active").exists()).toBe(false);
  });

  it("omits the underline indicator when trackIndicator is false", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3, trackIndicator: false }, slots });
    expect(wrapper.find(".nav__active-indicator").exists()).toBe(false);
  });

  // ─── Hover indicator movement ────────────────────────────────────────────

  it("moves the hover indicator position on mouseenter", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const tabsList = wrapper.find(".tabs-list").element as HTMLElement;
    const triggers = wrapper.findAll(".tabs-list-item");

    expect(tabsList.style.getPropertyValue("--_width-hovered")).toBe("");

    await triggers[1]!.trigger("mouseenter");

    expect(tabsList.style.getPropertyValue("--_width-hovered")).not.toBe("");
  });

  it("resets the hover indicator to the active tab on mouseleave", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const tabsList = wrapper.find(".tabs-list");
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[1]!.trigger("mouseenter");
    await tabsList.trigger("mouseleave");

    // Should not throw, and the hover indicator settles back onto the active (first) tab.
    expect((tabsList.element as HTMLElement).style.getPropertyValue("--_x-hovered")).toBe("0px");
  });

  it("clears a pending settle timeout when hovering a second tab before the first settles", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(".tabs-list-item");
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    await triggers[1]!.trigger("mouseenter");
    await triggers[2]!.trigger("mouseenter");

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  // ─── Regression: more than 3 tabs ────────────────────────────────────────
  // The original hand-rolled version of this component had an indicator-positioning issue
  // that only showed up with itemCount > 3 — these lock in correct behaviour at 5.

  it("activates a distant tab (index 0 -> index 4) directly via click", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 5 }, slots: fiveSlots });
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[4]!.trigger("click");

    expect(triggers[0]!.attributes("aria-selected")).toBe("false");
    expect(triggers[4]!.attributes("aria-selected")).toBe("true");
    expect(triggers[4]!.attributes("tabindex")).toBe("0");
    expect(wrapper.findAll(".tab-content")[4]!.attributes("aria-hidden")).toBe("false");
  });

  it("does not recolour tabs spanned by a distant activation jump (regression: intermediate labels going invisible)", async () => {
    // The old implementation force-applied a "transitioning" class to every tab spanned by a
    // jump, forcing it to the active-indicator's text colour for the whole transition — even
    // though the sliding indicator only visually reaches each spanned tab partway through, and
    // for a forward jump doesn't reach the middle tabs until late in the transition. That made
    // intermediate labels flash a colour matching neither their own background nor (yet) the
    // indicator's, going invisible. Spanned tabs should only ever carry aria-selected/hover
    // state of their own — never a class forcing them to look active.
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 5 }, slots: fiveSlots });
    const triggers = wrapper.findAll(".tabs-list-item");

    // Active tab starts at index 0, so activating index 4 spans every tab in between.
    await triggers[4]!.trigger("click");

    [1, 2, 3].forEach((index) => {
      expect(triggers[index]!.attributes("aria-selected")).toBe("false");
      expect(triggers[index]!.classes()).not.toContain("transitioning");
    });
  });

  it("wraps correctly with End then ArrowRight across 5 tabs", async () => {
    const wrapper = await mountSuspended(TabsCore, { props: { itemCount: 5 }, slots: fiveSlots });
    const triggers = wrapper.findAll(".tabs-list-item");

    await triggers[0]!.trigger("keydown", { key: "End" });
    expect(triggers[4]!.attributes("aria-selected")).toBe("true");

    await triggers[4]!.trigger("keydown", { key: "ArrowRight" });
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });
});
