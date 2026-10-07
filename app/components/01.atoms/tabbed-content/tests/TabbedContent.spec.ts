import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, nextTick, ref } from "vue";
import TabbedContent from "../TabbedContent.vue";

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

const TRIGGER = ".tabbed-content-trigger";
const PANEL = ".tabbed-content-panel";

describe("TabbedContent", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders one trigger and one panel per itemCount", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    expect(wrapper.findAll(TRIGGER)).toHaveLength(3);
    expect(wrapper.findAll(PANEL)).toHaveLength(3);
  });

  it("applies the axis class and styleClassPassthrough to the root", async () => {
    const wrapper = await mountSuspended(TabbedContent, {
      props: { itemCount: 3, axis: "y", styleClassPassthrough: ["my-tabs"] },
      slots,
    });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["tabbed-content", "axis-y", "my-tabs"]));
  });

  // ─── Accessibility structure ─────────────────────────────────────────────

  it("renders a tablist with the default aria-label", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const tablist = wrapper.find("[role='tablist']");
    expect(tablist.exists()).toBe(true);
    expect(tablist.attributes("aria-label")).toBe("Tabs");
  });

  it("uses a custom ariaLabel when provided", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, ariaLabel: "Settings" }, slots });
    expect(wrapper.find("[role='tablist']").attributes("aria-label")).toBe("Settings");
  });

  it("sets aria-orientation from the axis", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    expect(wrapper.find("[role='tablist']").attributes("aria-orientation")).toBe("horizontal");
    await wrapper.setProps({ axis: "y" });
    expect(wrapper.find("[role='tablist']").attributes("aria-orientation")).toBe("vertical");
  });

  it("owns the tabs directly, with no list items in between", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const tablist = wrapper.find("[role='tablist']").element;
    expect(tablist.querySelectorAll("li")).toHaveLength(0);
    expect(tablist.querySelectorAll(":scope > [role='tab']")).toHaveLength(3);
  });

  it("hides the decorative indicators from assistive tech", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    ["hover", "active", "underline", "underline-hover"].forEach((name) => {
      expect(wrapper.find(`.tabbed-content-indicator-${name}`).attributes("aria-hidden")).toBe("true");
    });
  });

  it("renders each trigger as a type=button with role=tab", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    wrapper.findAll(TRIGGER).forEach((trigger) => {
      expect(trigger.attributes("type")).toBe("button");
      expect(trigger.attributes("role")).toBe("tab");
    });
  });

  it("links each trigger and panel both ways (aria-controls / aria-labelledby)", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);
    const panels = wrapper.findAll(PANEL);
    panels.forEach((panel, index) => {
      expect(panel.attributes("role")).toBe("tabpanel");
      expect(panel.attributes("aria-labelledby")).toBe(triggers[index]!.attributes("id"));
      expect(triggers[index]!.attributes("aria-controls")).toBe(panel.attributes("id"));
    });
  });

  it("gives each instance its own ids", async () => {
    const Host = defineComponent({
      components: { TabbedContent },
      template: `
        <div>
          <TabbedContent :item-count="2"><template #tab-0-trigger>A</template><template #tab-1-trigger>B</template></TabbedContent>
          <TabbedContent :item-count="2"><template #tab-0-trigger>A</template><template #tab-1-trigger>B</template></TabbedContent>
        </div>
      `,
    });
    const wrapper = await mountSuspended(Host);
    // Per instance: two triggers, two panels and the More menu.
    const ids = wrapper.findAll("[id]").map((el) => el.attributes("id"));
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
  });

  // ─── Active tab state ────────────────────────────────────────────────────

  it("marks the first tab active and only its panel visible on mount", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);
    const panels = wrapper.findAll(PANEL);

    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
    expect(triggers[0]!.attributes("tabindex")).toBe("0");
    expect(triggers[1]!.attributes("aria-selected")).toBe("false");
    expect(triggers[1]!.attributes("tabindex")).toBe("-1");

    expect(panels[0]!.attributes("hidden")).toBeUndefined();
    expect(panels[1]!.attributes("hidden")).toBeDefined();
    expect(panels[2]!.attributes("hidden")).toBeDefined();
  });

  it("activates a tab on click and updates aria-selected, tabindex, and panel visibility", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);
    const panels = wrapper.findAll(PANEL);

    await triggers[1]!.trigger("click");

    expect(triggers[0]!.attributes("aria-selected")).toBe("false");
    expect(triggers[0]!.attributes("tabindex")).toBe("-1");
    expect(triggers[1]!.attributes("aria-selected")).toBe("true");
    expect(triggers[1]!.attributes("tabindex")).toBe("0");

    expect(panels[0]!.attributes("hidden")).toBeDefined();
    expect(panels[1]!.attributes("hidden")).toBeUndefined();
  });

  it("activates the tab when the click lands on an element inside the trigger", async () => {
    const wrapper = await mountSuspended(TabbedContent, {
      props: { itemCount: 2 },
      slots: { "tab-0-trigger": "One", "tab-1-trigger": "<span class='inner'>Two</span>" },
    });

    await wrapper.find(".inner").trigger("click");

    expect(wrapper.findAll(TRIGGER)[1]!.attributes("aria-selected")).toBe("true");
    expect(wrapper.findAll(PANEL)[1]!.attributes("hidden")).toBeUndefined();
    expect(wrapper.findAll(PANEL)[0]!.attributes("hidden")).toBeDefined();
  });

  // ─── itemCount edge cases ────────────────────────────────────────────────

  it.each([0, -2, Number.NaN])("renders no tabs for itemCount %s", async (itemCount) => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount } });
    expect(wrapper.findAll(TRIGGER)).toHaveLength(0);
    expect(wrapper.findAll(PANEL)).toHaveLength(0);
  });

  it("rounds a fractional itemCount down", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 2.7 }, slots });
    expect(wrapper.findAll(TRIGGER)).toHaveLength(2);
  });

  it("picks up tabs added after mount", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 2 }, slots: fiveSlots });
    await wrapper.setProps({ itemCount: 4 });
    await nextTick();

    const triggers = wrapper.findAll(TRIGGER);
    expect(triggers).toHaveLength(4);
    expect(triggers[3]!.attributes("tabindex")).toBe("-1");

    await triggers[0]!.trigger("keydown", { key: "End" });
    expect(triggers[3]!.attributes("aria-selected")).toBe("true");
    expect(wrapper.findAll(PANEL)[3]!.attributes("hidden")).toBeUndefined();
  });

  it("falls back to the first tab when the active tab is removed", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    await wrapper.findAll(TRIGGER)[2]!.trigger("click");

    await wrapper.setProps({ itemCount: 2 });
    await nextTick();

    const triggers = wrapper.findAll(TRIGGER);
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
    expect(triggers[0]!.attributes("tabindex")).toBe("0");
    expect(wrapper.findAll(PANEL)[0]!.attributes("hidden")).toBeUndefined();
  });

  it("keeps the active tab when tabs are added after it", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots: fiveSlots });
    await wrapper.findAll(TRIGGER)[1]!.trigger("click");

    await wrapper.setProps({ itemCount: 5 });
    await nextTick();

    expect(wrapper.findAll(TRIGGER)[1]!.attributes("aria-selected")).toBe("true");
  });

  // ─── Keyboard navigation ─────────────────────────────────────────────────

  it("moves focus and activates the next tab on ArrowRight (axis x)", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[0]!.trigger("keydown", { key: "ArrowRight" });

    expect(triggers[1]!.attributes("aria-selected")).toBe("true");
    expect(triggers[1]!.attributes("tabindex")).toBe("0");
  });

  it("wraps to the first tab on ArrowRight from the last tab", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[2]!.trigger("click");
    await triggers[2]!.trigger("keydown", { key: "ArrowRight" });

    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });

  it("moves focus to the previous tab on ArrowLeft (axis x)", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[1]!.trigger("click");
    await triggers[1]!.trigger("keydown", { key: "ArrowLeft" });

    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });

  it("uses ArrowUp/ArrowDown instead of ArrowLeft/ArrowRight when axis is y", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, axis: "y" }, slots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");

    await triggers[0]!.trigger("keydown", { key: "ArrowDown" });
    expect(triggers[1]!.attributes("aria-selected")).toBe("true");
  });

  it("switches arrow keys when axis changes after mount", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    await wrapper.setProps({ axis: "y" });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");

    await triggers[0]!.trigger("keydown", { key: "ArrowDown" });
    expect(triggers[1]!.attributes("aria-selected")).toBe("true");
  });

  it("jumps to the last tab on End and the first tab on Home", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[0]!.trigger("keydown", { key: "End" });
    expect(triggers[2]!.attributes("aria-selected")).toBe("true");

    await triggers[2]!.trigger("keydown", { key: "Home" });
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });

  // ─── trackHover / trackActive / trackIndicator ──────────────────────────

  it("renders all four indicators by default", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    expect(wrapper.find(".tabbed-content-indicator-hover").exists()).toBe(true);
    expect(wrapper.find(".tabbed-content-indicator-active").exists()).toBe(true);
    expect(wrapper.find(".tabbed-content-indicator-underline").exists()).toBe(true);
    expect(wrapper.find(".tabbed-content-indicator-underline-hover").exists()).toBe(true);
  });

  it.each([
    { trackHover: false, trackIndicator: true },
    { trackHover: true, trackIndicator: false },
  ])("omits the hover underline unless both trackHover and trackIndicator are on (%o)", async (flags) => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, ...flags }, slots });
    expect(wrapper.find(".tabbed-content-indicator-underline-hover").exists()).toBe(false);
  });

  it("omits the hover indicator when trackHover is false", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, trackHover: false }, slots });
    expect(wrapper.find(".tabbed-content-indicator-hover").exists()).toBe(false);
  });

  it("omits the active indicator when trackActive is false", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, trackActive: false }, slots });
    expect(wrapper.find(".tabbed-content-indicator-active").exists()).toBe(false);
  });

  it("omits the underline indicator when trackIndicator is false", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, trackIndicator: false }, slots });
    expect(wrapper.find(".tabbed-content-indicator-underline").exists()).toBe(false);
  });

  it("adds and removes indicators when the track props change after mount", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, trackActive: false }, slots });
    await wrapper.setProps({ trackActive: true, trackHover: false });
    expect(wrapper.find(".tabbed-content-indicator-active").exists()).toBe(true);
    expect(wrapper.find(".tabbed-content-indicator-hover").exists()).toBe(false);
  });

  it("stops tracking hover when trackHover turns off after mount", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    await wrapper.setProps({ trackHover: false });
    const bar = wrapper.find(".tabbed-content-bar").element as HTMLElement;
    const before = bar.style.getPropertyValue("--_hovered-duration");

    await wrapper.findAll(TRIGGER)[2]!.trigger("mouseenter");

    expect(bar.style.getPropertyValue("--_hovered-duration")).toBe(before);
  });

  // ─── Indicator movement ──────────────────────────────────────────────────
  // jsdom has no layout: tabs are mocked 100px wide side by side in a 500px bar.

  describe("indicator edges", () => {
    const mockRow = () => {
      vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (this: HTMLElement) {
        return this.hasAttribute("data-nav-item") ? Number(this.dataset.tabIndex) * 100 : 0;
      });
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
        return this.hasAttribute("data-nav-item") ? 100 : 0;
      });
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
        return this.classList.contains("tabbed-content-bar") ? 500 : 0;
      });
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const edges = (bar: HTMLElement, kind: "active" | "hovered") => ({
      start: bar.style.getPropertyValue(`--_${kind}-start`),
      end: bar.style.getPropertyValue(`--_${kind}-end`),
      startDelay: bar.style.getPropertyValue(`--_${kind}-start-delay`),
      endDelay: bar.style.getPropertyValue(`--_${kind}-end-delay`),
      duration: bar.style.getPropertyValue(`--_${kind}-duration`),
    });

    it("snaps both indicators onto the first tab on mount", async () => {
      mockRow();
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      const bar = wrapper.find(".tabbed-content-bar").element as HTMLElement;
      expect(edges(bar, "active")).toEqual({ start: "0px", end: "400px", startDelay: "0ms", endDelay: "0ms", duration: "0ms" });
      expect(edges(bar, "hovered")).toMatchObject({ start: "0px", end: "400px", duration: "0ms" });
    });

    it("moving right sends the end edge first and delays the start edge (regression: n to n+x jitter)", async () => {
      mockRow();
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      const bar = wrapper.find(".tabbed-content-bar").element as HTMLElement;
      const triggers = wrapper.findAll(TRIGGER);

      await triggers[1]!.trigger("click");
      await triggers[3]!.trigger("click");

      expect(edges(bar, "active")).toEqual({
        start: "300px",
        end: "100px",
        startDelay: "200ms",
        endDelay: "0ms",
        duration: "200ms",
      });
    });

    it("moving left sends the start edge first and delays the end edge", async () => {
      mockRow();
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      const bar = wrapper.find(".tabbed-content-bar").element as HTMLElement;
      const triggers = wrapper.findAll(TRIGGER);

      await triggers[4]!.trigger("click");
      await triggers[2]!.trigger("click");

      expect(edges(bar, "active")).toMatchObject({ start: "200px", end: "200px", startDelay: "0ms", endDelay: "200ms" });
    });

    it("only ever moves the hover edges forward when sweeping right", async () => {
      mockRow();
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      const bar = wrapper.find(".tabbed-content-bar").element as HTMLElement;
      const triggers = wrapper.findAll(TRIGGER);
      const seen: { start: number; end: number }[] = [];

      for (const index of [1, 2, 3, 4]) {
        await triggers[index]!.trigger("mouseenter");
        const { start, end } = edges(bar, "hovered");
        seen.push({ start: parseFloat(start), end: parseFloat(end) });
      }

      // Start insets only grow and end insets only shrink: neither edge ever heads back left.
      seen.slice(1).forEach((step, index) => {
        expect(step.start).toBeGreaterThan(seen[index]!.start);
        expect(step.end).toBeLessThan(seen[index]!.end);
      });
      expect(edges(bar, "hovered").startDelay).toBe("200ms");
    });

    it("resets the hover indicator onto the active tab on mouseleave", async () => {
      mockRow();
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      const bar = wrapper.find(".tabbed-content-bar");

      await wrapper.findAll(TRIGGER)[3]!.trigger("mouseenter");
      await bar.trigger("mouseleave");

      expect(edges(bar.element as HTMLElement, "hovered")).toMatchObject({ start: "0px", end: "400px" });
    });

    it("keeps hover and active timing separate", async () => {
      mockRow();
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      const bar = wrapper.find(".tabbed-content-bar").element as HTMLElement;
      const triggers = wrapper.findAll(TRIGGER);

      await triggers[3]!.trigger("click");
      await triggers[1]!.trigger("mouseenter");

      expect(edges(bar, "active")).toMatchObject({ startDelay: "200ms", endDelay: "0ms" });
      expect(edges(bar, "hovered")).toMatchObject({ startDelay: "200ms", endDelay: "0ms" });
    });
  });

  it("gives a tab the active text colour only while the active highlight covers it", async () => {
    // Tabs sit 100px apart; the active highlight box is moved by hand to simulate its slide.
    let highlight = { left: 90, right: 210 };
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const el = this as HTMLElement;
      if (el.hasAttribute("data-active-indicator")) return { ...highlight, top: 0, bottom: 40 } as DOMRect;
      if (el.hasAttribute("data-nav-item")) {
        const left = Number(el.dataset.tabIndex) * 100;
        return { left, right: left + 100, top: 0, bottom: 40 } as DOMRect;
      }
      return { left: 0, right: 0, top: 0, bottom: 0 } as DOMRect;
    });
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);
    const underActive = () => triggers.map((trigger) => trigger.attributes("data-under-active") !== undefined);

    // Mid-slide from tab 0 to tab 2: only the passed-over tab 1 is covered; the selected tab 2 isn't yet.
    await triggers[2]!.trigger("click");
    expect(triggers[2]!.attributes("aria-selected")).toBe("true");
    expect(underActive()).toEqual([false, true, false]);

    // The highlight arrives on tab 2.
    highlight = { left: 200, right: 300 };
    vi.advanceTimersByTime(16);
    expect(underActive()).toEqual([false, false, true]);
    vi.restoreAllMocks();
  });

  it("keeps checking coverage after a refresh lands mid-move (regression: stale label colours)", async () => {
    let highlight = { left: 90, right: 210 };
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const el = this as HTMLElement;
      if (el.hasAttribute("data-active-indicator")) return { ...highlight, top: 0, bottom: 40 } as DOMRect;
      if (el.hasAttribute("data-nav-item")) {
        const left = Number(el.dataset.tabIndex) * 100;
        return { left, right: left + 100, top: 0, bottom: 40 } as DOMRect;
      }
      return { left: 0, right: 0, top: 0, bottom: 0 } as DOMRect;
    });
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    const triggers = wrapper.findAll(TRIGGER);
    const underActive = () => triggers.map((trigger) => trigger.attributes("data-under-active") !== undefined);

    await triggers[2]!.trigger("click");
    // A refresh mid-move (here from a prop change; in a browser, the More button resizing).
    await wrapper.setProps({ trackHover: false });
    await nextTick();

    highlight = { left: 200, right: 300 };
    vi.advanceTimersByTime(16);
    expect(underActive()).toEqual([false, false, true]);
    vi.restoreAllMocks();
  });

  it("leaves text colour to aria-selected when there is no active highlight", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, trackActive: false }, slots });
    expect(wrapper.classes()).not.toContain("tracks-active");
    expect(wrapper.findAll("[data-under-active]")).toHaveLength(0);
  });

  it("uses the current transitionDuration for indicator moves", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3 }, slots });
    await wrapper.setProps({ transitionDuration: 450 });
    const tabsList = wrapper.find(".tabbed-content-bar").element as HTMLElement;

    await wrapper.findAll(TRIGGER)[1]!.trigger("click");

    expect(tabsList.style.getPropertyValue("--_active-duration")).toBe("450ms");
  });

  it("clamps a negative transitionDuration to 0ms", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 3, transitionDuration: -100 }, slots });
    const tabsList = wrapper.find(".tabbed-content-bar").element as HTMLElement;

    await wrapper.findAll(TRIGGER)[1]!.trigger("click");

    expect(tabsList.style.getPropertyValue("--_active-duration")).toBe("0ms");
  });

  // ─── Regression: more than 3 tabs ────────────────────────────────────────
  // The original hand-rolled version of this component had an indicator-positioning issue
  // that only showed up with itemCount > 3 — these lock in correct behaviour at 5.

  it("activates a distant tab (index 0 -> index 4) directly via click", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[4]!.trigger("click");

    expect(triggers[0]!.attributes("aria-selected")).toBe("false");
    expect(triggers[4]!.attributes("aria-selected")).toBe("true");
    expect(triggers[4]!.attributes("tabindex")).toBe("0");
    expect(wrapper.findAll(PANEL)[4]!.attributes("hidden")).toBeUndefined();
  });

  it("does not recolour tabs spanned by a distant activation jump (regression: intermediate labels going invisible)", async () => {
    // A removed "transitioning" class used to force every spanned tab to the active text colour
    // for the whole transition, before the sliding indicator had reached it. Spanned tabs should
    // only ever carry their own aria-selected/hover state.
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[4]!.trigger("click");

    [1, 2, 3].forEach((index) => {
      expect(triggers[index]!.attributes("aria-selected")).toBe("false");
      expect(triggers[index]!.classes()).not.toContain("transitioning");
    });
  });

  it("wraps correctly with End then ArrowRight across 5 tabs", async () => {
    const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
    const triggers = wrapper.findAll(TRIGGER);

    await triggers[0]!.trigger("keydown", { key: "End" });
    expect(triggers[4]!.attributes("aria-selected")).toBe("true");

    await triggers[4]!.trigger("keydown", { key: "ArrowRight" });
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
  });

  // ─── Overflow menu ───────────────────────────────────────────────────────
  // jsdom has no layout, so widths are mocked: bar 300px, each tab 100px, the More button 50px.

  describe("overflow menu", () => {
    const mockLayout = (barWidth: number) => {
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
        return this.classList.contains("tabbed-content-bar") ? barWidth : 0;
      });
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
        if (this.hasAttribute("data-nav-item")) return 100;
        if (this.hasAttribute("data-more-trigger")) return 50;
        return 0;
      });
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const hiddenIndexes = (wrapper: { findAll: (selector: string) => { attributes: (name: string) => string | undefined }[] }) =>
      wrapper
        .findAll(TRIGGER)
        .map((trigger, index: number) => (trigger.attributes("hidden") !== undefined ? index : -1))
        .filter((index: number) => index !== -1);

    it("collapses the tabs that don't fit into the More menu", async () => {
      mockLayout(300);
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();

      expect(hiddenIndexes(wrapper)).toEqual([2, 3, 4]);
      expect(wrapper.find(".tabbed-content-more").classes()).not.toContain("is-idle");
      expect(wrapper.findAll(".tabbed-content-more-item").map((item) => item.text())).toEqual([
        "Tab Three",
        "Tab Four",
        "Tab Five",
      ]);
    });

    it("keeps the More button idle and out of the tab order when everything fits", async () => {
      mockLayout(1000);
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();

      expect(hiddenIndexes(wrapper)).toEqual([]);
      expect(wrapper.find(".tabbed-content-more").classes()).toContain("is-idle");
      expect(wrapper.find(".tabbed-content-more-trigger").attributes("tabindex")).toBe("-1");
    });

    it("gives the More button an accessible name and menu semantics", async () => {
      mockLayout(300);
      const wrapper = await mountSuspended(TabbedContent, {
        props: { itemCount: 5, moreLabel: "Weitere Tabs" },
        slots: fiveSlots,
      });
      const trigger = wrapper.find(".tabbed-content-more-trigger");
      expect(trigger.attributes("aria-label")).toBeUndefined();
      expect(trigger.find(".tabbed-content-visually-hidden").text()).toBe("Weitere Tabs");
      expect(trigger.attributes("aria-haspopup")).toBe("menu");
      expect(wrapper.find("[role='menu']").attributes("aria-label")).toBe("Weitere Tabs");
      expect(wrapper.find("[role='tablist']").element.contains(trigger.element)).toBe(false);
    });

    it("activates a collapsed tab from the menu and marks the More button active", async () => {
      mockLayout(300);
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();

      await wrapper.findAll(".tabbed-content-more-item")[1]!.trigger("click");

      expect(wrapper.findAll(TRIGGER)[3]!.attributes("aria-selected")).toBe("true");
      expect(wrapper.findAll(PANEL)[3]!.attributes("hidden")).toBeUndefined();
      expect(wrapper.find(".tabbed-content-more-trigger").classes()).toContain("is-active");
      expect(wrapper.findAll(".tabbed-content-more-item")[1]!.attributes("aria-checked")).toBe("true");
    });

    it("shows the collapsed active tab's label on the More button, with the visible text inside its name", async () => {
      mockLayout(300);
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();
      const trigger = () => wrapper.find(".tabbed-content-more-trigger");
      expect(trigger().find(".tabbed-content-more-label").exists()).toBe(false);

      await wrapper.findAll(".tabbed-content-more-item")[1]!.trigger("click");

      expect(trigger().find(".tabbed-content-more-label").text()).toBe("Tab Four");
      expect(trigger().text()).toBe("Tab Four, More tabs");
      expect(trigger().find(".tabbed-content-more-icon").exists()).toBe(false);

      await wrapper.findAll(TRIGGER)[0]!.trigger("click");
      expect(trigger().find(".tabbed-content-more-label").exists()).toBe(false);
      expect(trigger().find(".tabbed-content-more-icon").exists()).toBe(true);
    });

    it("moves the preceding tab into the menu when the More button grows to show the active label", async () => {
      const observerCallbacks: (() => void)[] = [];
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            observerCallbacks.push(callback);
          }
          observe = vi.fn();
          unobserve = vi.fn();
          disconnect = vi.fn();
        }
      );
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
        return this.classList.contains("tabbed-content-bar") ? 300 : 0;
      });
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
        if (this.hasAttribute("data-nav-item")) return 100;
        if (this.hasAttribute("data-more-trigger")) return this.classList.contains("is-active") ? 150 : 50;
        return 0;
      });
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();
      expect(hiddenIndexes(wrapper)).toEqual([2, 3, 4]);

      await wrapper.findAll(".tabbed-content-more-item")[1]!.trigger("click");
      await nextTick();
      observerCallbacks.forEach((callback) => callback());
      await nextTick();

      expect(hiddenIndexes(wrapper)).toEqual([1, 2, 3, 4]);

      await wrapper.findAll(TRIGGER)[0]!.trigger("click");
      await nextTick();
      observerCallbacks.forEach((callback) => callback());
      await nextTick();

      expect(hiddenIndexes(wrapper)).toEqual([2, 3, 4]);
    });

    it("keeps the tablist reachable by Tab when the active tab is collapsed", async () => {
      mockLayout(300);
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();

      await wrapper.findAll(".tabbed-content-more-item")[2]!.trigger("click");

      const triggers = wrapper.findAll(TRIGGER);
      expect(triggers[0]!.attributes("tabindex")).toBe("0");
      expect(triggers[4]!.attributes("tabindex")).toBe("-1");
    });

    it("skips collapsed tabs with the arrow keys", async () => {
      mockLayout(300);
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();
      const triggers = wrapper.findAll(TRIGGER);

      await triggers[1]!.trigger("click");
      await triggers[1]!.trigger("keydown", { key: "ArrowRight" });

      expect(triggers[0]!.attributes("aria-selected")).toBe("true");
    });

    it("moves the indicators onto the More button's new box when it resizes", async () => {
      const observerCallbacks: (() => void)[] = [];
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            observerCallbacks.push(callback);
          }
          observe = vi.fn();
          unobserve = vi.fn();
          disconnect = vi.fn();
        }
      );
      let moreLeft = 250;
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
        return this.classList.contains("tabbed-content-bar") ? 300 : 0;
      });
      vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (this: HTMLElement) {
        if (this.hasAttribute("data-nav-item")) return Number(this.dataset.tabIndex) * 100;
        return this.hasAttribute("data-more-trigger") ? moreLeft : 0;
      });
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
        if (this.hasAttribute("data-nav-item")) return 100;
        return this.hasAttribute("data-more-trigger") ? 300 - moreLeft : 0;
      });
      const wrapper = await mountSuspended(TabbedContent, { props: { itemCount: 5 }, slots: fiveSlots });
      await nextTick();
      const bar = wrapper.find(".tabbed-content-bar").element as HTMLElement;

      await wrapper.findAll(".tabbed-content-more-item")[0]!.trigger("click");
      expect(bar.style.getPropertyValue("--_active-start")).toBe("250px");

      // The button grows leftwards to show the active label, without changing which tabs fit.
      moreLeft = 220;
      observerCallbacks.forEach((callback) => callback());

      expect(bar.style.getPropertyValue("--_active-start")).toBe("220px");
      expect(bar.style.getPropertyValue("--_active-end")).toBe("0px");
    });

    it("never collapses tabs with overflowMode scroll or on axis y", async () => {
      mockLayout(300);
      const scroll = await mountSuspended(TabbedContent, {
        props: { itemCount: 5, overflowMode: "scroll" },
        slots: fiveSlots,
      });
      const vertical = await mountSuspended(TabbedContent, { props: { itemCount: 5, axis: "y" }, slots: fiveSlots });
      await nextTick();

      [scroll, vertical].forEach((wrapper) => {
        expect(hiddenIndexes(wrapper)).toEqual([]);
        expect(wrapper.find(".tabbed-content-more").exists()).toBe(false);
      });
    });
  });

  // ─── Reactivity in a host ────────────────────────────────────────────────

  it("follows a host's reactive itemCount", async () => {
    const count = ref(1);
    const Host = defineComponent({
      components: { TabbedContent },
      setup() {
        return { count };
      },
      template: `
        <TabbedContent :item-count="count">
          <template #tab-0-trigger>One</template>
          <template #tab-1-trigger>Two</template>
          <template #tab-2-trigger>Three</template>
        </TabbedContent>
      `,
    });
    const wrapper = await mountSuspended(Host);
    count.value = 3;
    await nextTick();
    await nextTick();

    const triggers = wrapper.findAll(TRIGGER);
    expect(triggers).toHaveLength(3);
    expect(triggers[0]!.attributes("aria-selected")).toBe("true");
    expect(triggers[2]!.attributes("tabindex")).toBe("-1");
  });
});
