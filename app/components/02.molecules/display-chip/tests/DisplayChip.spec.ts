import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayChip from "../DisplayChip.vue";

describe("DisplayChip", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default)", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (with label)", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", label: "5" } },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (with icon)", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", icon: "mdi:check" } },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (square + styleClassPassthrough)", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { shape: "square", status: "online", styleClassPassthrough: ["featured"] },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as <span> by default", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it("renders as <div> when tag='div'", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { tag: "div" } });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  // ─── Base class ───────────────────────────────────────────────────────────

  it("always has the display-chip class", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.classes()).toContain("display-chip");
  });

  // ─── Shape ────────────────────────────────────────────────────────────────

  it("sets data-shape='circle' by default", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.attributes("data-shape")).toBe("circle");
  });

  it("sets data-shape='square' when shape='square'", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { shape: "square" } });
    expect(wrapper.attributes("data-shape")).toBe("square");
  });

  it("does not put shape or status on the root as classes", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { shape: "square", status: "online" } });
    expect(wrapper.classes()).toEqual(["display-chip"]);
  });

  // ─── Status ───────────────────────────────────────────────────────────────

  it("sets data-status='offline' by default", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.attributes("data-status")).toBe("offline");
  });

  it.each(["online", "idle", "dnd"] as const)("sets data-status='%s' from the status prop", async (status) => {
    const wrapper = await mountSuspended(DisplayChip, { props: { status } });
    expect(wrapper.attributes("data-status")).toBe(status);
  });

  it("renders statusLabel as screen-reader text", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { status: "online", statusLabel: "Online" } });
    expect(wrapper.find(".sr-only").text()).toBe("Online");
  });

  it("renders no screen-reader text without statusLabel", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.find(".sr-only").exists()).toBe(false);
  });

  // ─── CSS custom properties ────────────────────────────────────────────────

  it("sets CSS custom properties from config", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: {
        config: { size: "16px", maskWidth: "3px", offset: "4px", angle: "45deg" },
      },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_chip-size")).toBe("16px");
    expect(style.getPropertyValue("--_chip-mask-width")).toBe("3px");
    expect(style.getPropertyValue("--_chip-offset")).toBe("4px");
    expect(style.getPropertyValue("--_chip-angle")).toBe("45deg");
  });

  it("falls back to the public tokens when no config is provided", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_chip-size")).toBe("var(--display-chip-size, 1.2rem)");
    expect(style.getPropertyValue("--_chip-mask-width")).toBe("var(--display-chip-mask-width, 0.4rem)");
    expect(style.getPropertyValue("--_chip-offset")).toBe("var(--display-chip-offset, 0rem)");
    expect(style.getPropertyValue("--_chip-angle")).toBe("var(--display-chip-angle, 90deg)");
  });

  it("falls back per field when config is partial", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { config: { label: "5", angle: "45deg" } } });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_chip-size")).toBe("var(--display-chip-size, 1.2rem)");
    expect(style.getPropertyValue("--_chip-angle")).toBe("45deg");
  });

  // ─── Label ────────────────────────────────────────────────────────────────

  it("does not render .display-chip-label when config has no label", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.find(".display-chip-label").exists()).toBe(false);
  });

  it("renders .display-chip-label when config.label is set", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", label: "5" } },
    });
    expect(wrapper.find(".display-chip-label").exists()).toBe(true);
    expect(wrapper.find(".display-chip-label").text()).toBe("5");
  });

  it.each([
    ["A", "1"],
    ["+2", "2"],
    ["DND", "3"],
    ["👨‍👩‍👧‍👦", "1"],
    ["999+", "3"],
  ])("sets data-length for label '%s'", async (label, expected) => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(DisplayChip, { props: { config: { label } } });
    expect(wrapper.find(".display-chip-label").attributes("data-length")).toBe(expected);
    warnSpy.mockRestore();
  });

  it("keeps a multi-codepoint emoji whole instead of splitting it", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(DisplayChip, { props: { config: { label: "👨‍👩‍👧‍👦" } } });
    expect(wrapper.find(".display-chip-label").text()).toBe("👨‍👩‍👧‍👦");
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("truncates by grapheme, not UTF-16 code unit", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(DisplayChip, { props: { config: { label: "🇬🇧🇺🇸🇫🇷🇩🇪" } } });
    expect(wrapper.find(".display-chip-label").text()).toBe("🇬🇧🇺🇸🇫🇷");
    warnSpy.mockRestore();
  });

  it("does not render a label for a whitespace-only label", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { config: { label: "   " } } });
    expect(wrapper.find(".display-chip-label").exists()).toBe(false);
  });

  it("renders an HTML-like label as text", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { config: { label: "<b>" } } });
    expect(wrapper.find(".display-chip-label b").exists()).toBe(false);
    expect(wrapper.find(".display-chip-label").text()).toBe("<b>");
  });

  it("updates the label when config changes after mount", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { config: { label: "1" } } });
    await wrapper.setProps({ config: { label: "42" } });
    expect(wrapper.find(".display-chip-label").text()).toBe("42");
    expect(wrapper.find(".display-chip-label").attributes("data-length")).toBe("2");
  });

  it("truncates label to 3 characters when label exceeds maximum length", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", label: "ABCD" } },
    });
    expect(wrapper.find(".display-chip-label").text()).toBe("ABC");
    warnSpy.mockRestore();
  });

  it("emits a console warning when label exceeds 3 characters", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", label: "ABCD" } },
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("exceeds maximum length of 3 characters"));
    warnSpy.mockRestore();
  });

  // ─── Icon ─────────────────────────────────────────────────────────────────

  it("does not render .display-chip-icon when config has no icon", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.find(".display-chip-icon").exists()).toBe(false);
  });

  it("renders .display-chip-icon when config.icon is set", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", icon: "mdi:check" } },
    });
    expect(wrapper.find(".display-chip-icon").exists()).toBe(true);
    expect(wrapper.find(".display-chip-icon").attributes("aria-hidden")).toBe("true");
  });

  // ─── Slot ─────────────────────────────────────────────────────────────────

  it("renders default slot content", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      slots: { default: "<div class='avatar'>SRC</div>" },
    });
    expect(wrapper.find(".avatar").exists()).toBe(true);
    expect(wrapper.find(".avatar").text()).toBe("SRC");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { styleClassPassthrough: "online" },
    });
    expect(wrapper.classes()).toContain("online");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { styleClassPassthrough: ["online", "featured"] },
    });
    expect(wrapper.classes()).toContain("online");
    expect(wrapper.classes()).toContain("featured");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { styleClassPassthrough: ["online"] },
    });
    expect(wrapper.classes()).toContain("online");
    await wrapper.setProps({ styleClassPassthrough: ["idle"] });
    expect(wrapper.classes()).not.toContain("online");
    expect(wrapper.classes()).toContain("idle");
  });
});
