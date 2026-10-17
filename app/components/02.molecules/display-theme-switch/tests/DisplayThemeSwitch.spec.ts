import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { nextTick, ref } from "vue";
import DisplayThemeSwitch from "../DisplayThemeSwitch.vue";

const { useSettingsStoreMock, setColourSchemeMock } = vi.hoisted(() => ({
  useSettingsStoreMock: vi.fn(),
  setColourSchemeMock: vi.fn(),
}));

mockNuxtImport("useSettingsStore", () => useSettingsStoreMock);

describe("DisplayThemeSwitch", () => {
  beforeEach(() => {
    setColourSchemeMock.mockClear();
    useSettingsStoreMock.mockReturnValue({
      colourScheme: ref("system"),
      setColourScheme: setColourSchemeMock,
    });
  });

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch);
    await nextTick();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders SegmentedControl with the colour-scheme-select class", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch);
    await nextTick();
    expect(wrapper.find(".colour-scheme-select").exists()).toBe(true);
    expect(wrapper.find(".segmented-control").exists()).toBe(true);
  });

  it("renders default option labels", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch);
    await nextTick();
    const labels = wrapper.findAll(".segmented-control-option .sr-only").map((el) => el.text());
    expect(labels).toEqual(["System", "Light", "Dark"]);
  });

  it("renders custom option labels via props", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch, {
      props: {
        systemLabel: "Auto",
        lightLabel: "Day",
        darkLabel: "Night",
      },
    });
    await nextTick();
    const labels = wrapper.findAll(".segmented-control-option .sr-only").map((el) => el.text());
    expect(labels).toEqual(["Auto", "Day", "Night"]);
  });

  it("applies custom option icons via props", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch, {
      props: {
        systemIcon: "custom:system",
        lightIcon: "custom:light",
        darkIcon: "custom:dark",
      },
    });
    await nextTick();
    const icons = wrapper.findAll(".segmented-control-option-icon").map((el) => el.html());
    expect(icons.some((html) => html.includes("custom:system") || html.includes("custom-system"))).toBe(true);
  });

  it("names the radiogroup with ariaLabel", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch);
    await nextTick();
    expect(wrapper.find('[role="radiogroup"]').attributes("aria-label")).toBe("Colour scheme");

    await wrapper.setProps({ ariaLabel: "Thème" });
    expect(wrapper.find('[role="radiogroup"]').attributes("aria-label")).toBe("Thème");
  });

  it("applies the small class via styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch, {
      props: { styleClassPassthrough: "small" },
    });
    await nextTick();
    expect(wrapper.find(".segmented-control").classes()).toContain("small");
  });

  it("calls setColourScheme when the selected option changes", async () => {
    const wrapper = await mountSuspended(DisplayThemeSwitch);
    await nextTick();

    const lightInput = wrapper.findAll("input.segmented-control-option-input")[1];
    await lightInput?.setValue(true);
    await nextTick();

    expect(setColourSchemeMock).toHaveBeenCalledWith("light");
  });
});
