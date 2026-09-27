import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import TripleToggleSwitch from "../TripleToggleSwitch.vue";
import type { IFormMultipleOptions } from "~/types/forms/types.forms";

const buildOptions = (): IFormMultipleOptions => ({
  data: [
    { id: "system", name: "scheme", value: "system", label: "System", icon: "radix-icons:gear" },
    { id: "light", name: "scheme", value: "light", label: "Light", icon: "radix-icons:sun" },
    { id: "dark", name: "scheme", value: "dark", label: "Dark", icon: "radix-icons:moon" },
  ],
  total: 3,
  skip: 0,
  limit: 3,
});

const mountSwitch = (props: Record<string, unknown> = {}) =>
  mountSuspended(TripleToggleSwitch, {
    props: {
      modelValue: "system",
      fieldData: buildOptions(),
      ...props,
    },
  });

interface TripleToggleSwitchInstance {
  selectedOptionIndex: number;
}

describe("TripleToggleSwitch", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSwitch();
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.find(".triple-toggle-switch").exists()).toBe(true);
  });

  it("renders one radio per option with matching id, value and shared name", async () => {
    const wrapper = await mountSwitch({ name: "colour-scheme" });
    const inputs = wrapper.findAll("input.option-input");
    expect(inputs).toHaveLength(3);
    expect(inputs.map((i) => i.attributes("id"))).toEqual(["system", "light", "dark"]);
    expect(inputs.map((i) => (i.element as HTMLInputElement).value)).toEqual(["system", "light", "dark"]);
    inputs.forEach((i) => {
      expect(i.attributes("type")).toBe("radio");
      expect(i.attributes("name")).toBe("colour-scheme");
    });
  });

  it("uses the default name when none is passed", async () => {
    const wrapper = await mountSwitch();
    expect(wrapper.find("input.option-input").attributes("name")).toBe("triple-toggle-switch");
  });

  it("links each label to its radio and renders the label text for screen readers", async () => {
    const wrapper = await mountSwitch();
    const labels = wrapper.findAll("label.option-group");
    expect(labels.map((l) => l.attributes("for"))).toEqual(["system", "light", "dark"]);
    expect(wrapper.findAll(".option-group .sr-only").map((s) => s.text())).toEqual(["System", "Light", "Dark"]);
  });

  it("exposes the options as a radiogroup", async () => {
    const wrapper = await mountSwitch();
    const group = wrapper.find(".option-group-wrapper");
    expect(group.attributes("role")).toBe("radiogroup");
    expect(group.attributes("aria-label")).toBeUndefined();
  });

  it("applies ariaLabel to the radiogroup", async () => {
    const wrapper = await mountSwitch({ ariaLabel: "Colour scheme" });
    expect(wrapper.find(".option-group-wrapper").attributes("aria-label")).toBe("Colour scheme");
  });

  it("checks the radio matching modelValue", async () => {
    const wrapper = await mountSwitch({ modelValue: "light" });
    const checked = wrapper.findAll("input.option-input").map((i) => (i.element as HTMLInputElement).checked);
    expect(checked).toEqual([false, true, false]);
  });

  it("emits update:modelValue when another option is chosen", async () => {
    const wrapper = await mountSwitch();
    await wrapper.findAll("input.option-input")[2]!.setValue(true);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["dark"]);
  });

  it("marks only the selected option's icon as active", async () => {
    const wrapper = await mountSwitch({ modelValue: "dark" });
    const icons = wrapper.findAll(".option-icon");
    expect(icons).toHaveLength(3);
    expect(icons.map((i) => i.classes().includes("active"))).toEqual([false, false, true]);
    expect(icons[0]!.classes()).toContain("system");
  });

  it("updates the active icon when modelValue changes", async () => {
    const wrapper = await mountSwitch();
    await wrapper.setProps({ modelValue: "light" });
    const icons = wrapper.findAll(".option-icon");
    expect(icons[1]!.classes()).toContain("active");
    expect(icons[0]!.classes()).not.toContain("active");
  });

  it("omits the icon when an option has none", async () => {
    const options = buildOptions();
    delete options.data[1]!.icon;
    const wrapper = await mountSwitch({ fieldData: options });
    expect(wrapper.findAll(".option-icon")).toHaveLength(2);
  });

  it("computes the selected option index, falling back to 0 for an unknown value", async () => {
    const wrapper = await mountSwitch({ modelValue: "dark" });
    const vm = wrapper.vm as unknown as TripleToggleSwitchInstance;
    expect(vm.selectedOptionIndex).toBe(2);
    await wrapper.setProps({ modelValue: "unknown" });
    expect(vm.selectedOptionIndex).toBe(0);
  });

  it("shows the marker only after the mount delay", async () => {
    const wrapper = await mountSwitch();
    const marker = wrapper.find(".selected-option-marker");
    expect(marker.classes()).not.toContain("show");
    vi.advanceTimersByTime(300);
    await nextTick();
    await nextTick();
    expect(wrapper.find(".selected-option-marker").classes()).toContain("show");
  });

  it("applies the theme as data-theme", async () => {
    const wrapper = await mountSwitch({ theme: "success" });
    expect(wrapper.find(".triple-toggle-switch").attributes("data-theme")).toBe("success");
  });

  it("applies styleClassPassthrough classes to the root", async () => {
    const wrapper = await mountSwitch({ styleClassPassthrough: ["small", "extra"] });
    const root = wrapper.find(".triple-toggle-switch");
    expect(root.classes()).toContain("small");
    expect(root.classes()).toContain("extra");
  });
});
