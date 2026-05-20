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
      props: { shape: "square", styleClassPassthrough: ["online"] },
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

  it("always has the display-chip-core class", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.classes()).toContain("display-chip-core");
  });

  // ─── Shape ────────────────────────────────────────────────────────────────

  it("applies circle class by default", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.classes()).toContain("circle");
  });

  it("applies square class when shape='square'", async () => {
    const wrapper = await mountSuspended(DisplayChip, { props: { shape: "square" } });
    expect(wrapper.classes()).toContain("square");
    expect(wrapper.classes()).not.toContain("circle");
  });

  // ─── CSS custom properties ────────────────────────────────────────────────

  it("sets CSS custom properties from config", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: {
        config: { size: "16px", maskWidth: "3px", offset: "4px", angle: "45deg" },
      },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--chip-size")).toBe("16px");
    expect(style.getPropertyValue("--chip-mask-width")).toBe("3px");
    expect(style.getPropertyValue("--chip-offset")).toBe("4px");
    expect(style.getPropertyValue("--chip-angle")).toBe("45deg");
  });

  it("sets default CSS custom properties when no config is provided", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--chip-size")).toBe("12px");
    expect(style.getPropertyValue("--chip-mask-width")).toBe("4px");
    expect(style.getPropertyValue("--chip-offset")).toBe("0px");
    expect(style.getPropertyValue("--chip-angle")).toBe("90deg");
  });

  // ─── Label ────────────────────────────────────────────────────────────────

  it("does not render .chip-label when config has no label", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.find(".chip-label").exists()).toBe(false);
  });

  it("renders .chip-label when config.label is set", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", label: "5" } },
    });
    expect(wrapper.find(".chip-label").exists()).toBe(true);
    expect(wrapper.find(".chip-label").text()).toBe("5");
  });

  it.each([
    ["A", "length-1"],
    ["+2", "length-2"],
    ["DND", "length-3"],
  ])("applies length class for label '%s'", async (label, expectedClass) => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", label } },
    });
    expect(wrapper.find(".chip-label").classes()).toContain(expectedClass);
  });

  it("truncates label to 3 characters when label exceeds maximum length", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", label: "ABCD" } },
    });
    expect(wrapper.find(".chip-label").text()).toBe("ABC");
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

  it("does not render .chip-icon when config has no icon", async () => {
    const wrapper = await mountSuspended(DisplayChip);
    expect(wrapper.find(".chip-icon").exists()).toBe(false);
  });

  it("renders .chip-icon when config.icon is set", async () => {
    const wrapper = await mountSuspended(DisplayChip, {
      props: { config: { size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg", icon: "mdi:check" } },
    });
    expect(wrapper.find(".chip-icon").exists()).toBe(true);
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
