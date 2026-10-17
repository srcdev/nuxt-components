import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, ref } from "vue";
import SegmentedControl from "../SegmentedControl.vue";
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

const mounted: { unmount: () => void }[] = [];

const mountSwitch = async (props: Record<string, unknown> = {}) => {
  const wrapper = await mountSuspended(SegmentedControl, {
    props: {
      modelValue: "system",
      fieldData: buildOptions(),
      ...props,
    },
  });
  mounted.push(wrapper);
  return wrapper;
};

interface SegmentedControlInstance {
  selectedOptionIndex: number;
  markerIndex: number;
  optionCount: number;
}

const inputs = (wrapper: Awaited<ReturnType<typeof mountSwitch>>) => wrapper.findAll("input.segmented-control-option-input");
const optionLabels = (wrapper: Awaited<ReturnType<typeof mountSwitch>>) => wrapper.findAll("label.segmented-control-option");

describe("SegmentedControl", () => {
  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  it("mounts without error", async () => {
    const wrapper = await mountSwitch();
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.find(".segmented-control").exists()).toBe(true);
  });

  it("renders one radio per option with its value and the shared name", async () => {
    const wrapper = await mountSwitch({ name: "colour-scheme" });
    expect(inputs(wrapper)).toHaveLength(3);
    expect(inputs(wrapper).map((i) => (i.element as HTMLInputElement).value)).toEqual(["system", "light", "dark"]);
    inputs(wrapper).forEach((i) => {
      expect(i.attributes("type")).toBe("radio");
      expect(i.attributes("name")).toBe("colour-scheme");
    });
  });

  it("builds ids from useId, not from option data", async () => {
    const wrapper = await mountSwitch();
    const ids = inputs(wrapper).map((i) => i.attributes("id"));
    expect(ids).not.toContain("system");
    expect(new Set(ids).size).toBe(3);
    expect(optionLabels(wrapper).map((l) => l.attributes("for"))).toEqual(ids);
  });

  it("gives two instances separate radio groups and ids", async () => {
    const Host = defineComponent({
      components: { SegmentedControl },
      setup() {
        return { first: ref("system"), second: ref("dark"), options: ref(buildOptions()) };
      },
      template: `
        <div>
          <SegmentedControl v-model="first" v-model:field-data="options" />
          <SegmentedControl v-model="second" v-model:field-data="options" />
        </div>
      `,
    });
    const wrapper = await mountSuspended(Host);
    mounted.push(wrapper);
    const all = wrapper.findAll("input.segmented-control-option-input");
    const names = new Set(all.map((i) => i.attributes("name")));
    const ids = new Set(all.map((i) => i.attributes("id")));
    expect(names.size).toBe(2);
    expect(ids.size).toBe(6);
  });

  it("renders the label text for screen readers", async () => {
    const wrapper = await mountSwitch();
    expect(wrapper.findAll(".segmented-control-option .sr-only").map((s) => s.text())).toEqual([
      "System",
      "Light",
      "Dark",
    ]);
  });

  it("exposes the options as a radiogroup", async () => {
    const wrapper = await mountSwitch();
    const group = wrapper.find(".segmented-control-options");
    expect(group.attributes("role")).toBe("radiogroup");
    expect(group.attributes("aria-label")).toBeUndefined();
  });

  it("applies ariaLabel to the radiogroup", async () => {
    const wrapper = await mountSwitch({ ariaLabel: "Colour scheme" });
    expect(wrapper.find(".segmented-control-options").attributes("aria-label")).toBe("Colour scheme");
  });

  it("hides the decorative marker from assistive tech", async () => {
    const wrapper = await mountSwitch();
    expect(wrapper.find(".segmented-control-marker-layer").attributes("aria-hidden")).toBe("true");
  });

  it("checks the radio matching modelValue", async () => {
    const wrapper = await mountSwitch({ modelValue: "light" });
    const checked = inputs(wrapper).map((i) => (i.element as HTMLInputElement).checked);
    expect(checked).toEqual([false, true, false]);
  });

  it("emits update:modelValue when another option is chosen", async () => {
    const wrapper = await mountSwitch();
    await inputs(wrapper)[2]!.setValue(true);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["dark"]);
  });

  it("marks only the selected option with data-checked and exposes its value", async () => {
    const wrapper = await mountSwitch({ modelValue: "dark" });
    expect(optionLabels(wrapper).map((l) => l.attributes("data-checked"))).toEqual([undefined, undefined, ""]);
    expect(optionLabels(wrapper).map((l) => l.attributes("data-value"))).toEqual(["system", "light", "dark"]);

    await wrapper.setProps({ modelValue: "light" });
    expect(optionLabels(wrapper).map((l) => l.attributes("data-checked"))).toEqual([undefined, "", undefined]);
  });

  it("does not use collision-prone bare class names", async () => {
    const wrapper = await mountSwitch();
    for (const name of [".option-group", ".option-icon", ".option-input", ".selected-option-marker", ".active", ".show"]) {
      expect(wrapper.find(name).exists()).toBe(false);
    }
  });

  it("omits the icon when an option has none", async () => {
    const options = buildOptions();
    delete options.data[1]!.icon;
    const wrapper = await mountSwitch({ fieldData: options });
    expect(wrapper.findAll(".segmented-control-option-icon")).toHaveLength(2);
    expect(inputs(wrapper)).toHaveLength(3);
  });

  it("marks icons as decorative", async () => {
    const wrapper = await mountSwitch();
    wrapper.findAll(".segmented-control-option-icon").forEach((icon) => {
      expect(icon.attributes("aria-hidden")).toBe("true");
    });
  });

  it("tracks the selected index and hides the marker for an unknown value", async () => {
    const wrapper = await mountSwitch({ modelValue: "dark" });
    const vm = wrapper.vm as unknown as SegmentedControlInstance;
    const root = () => wrapper.find(".segmented-control");
    expect(vm.selectedOptionIndex).toBe(2);
    expect(vm.markerIndex).toBe(2);
    expect(root().attributes("data-has-selection")).toBe("");

    await wrapper.setProps({ modelValue: "unknown" });
    expect(vm.selectedOptionIndex).toBe(-1);
    expect(vm.markerIndex).toBe(0);
    expect(root().attributes("data-has-selection")).toBeUndefined();
  });

  it("sizes the grid from the option count, never below one column", async () => {
    const four = buildOptions();
    four.data.push({ id: "auto", name: "scheme", value: "auto", label: "Auto", icon: "radix-icons:gear" });
    const wrapper = await mountSwitch({ fieldData: four });
    expect((wrapper.vm as unknown as SegmentedControlInstance).optionCount).toBe(4);

    const empty = await mountSwitch({ fieldData: { data: [], total: 0, skip: 0, limit: 0 } });
    expect((empty.vm as unknown as SegmentedControlInstance).optionCount).toBe(1);
    expect(empty.findAll("input")).toHaveLength(0);
  });

  it("applies the theme as data-theme", async () => {
    const wrapper = await mountSwitch({ theme: "success" });
    expect(wrapper.find(".segmented-control").attributes("data-theme")).toBe("success");
  });

  it("applies styleClassPassthrough classes to the root and reacts to changes", async () => {
    const wrapper = await mountSwitch({ styleClassPassthrough: ["small", "extra"] });
    const root = () => wrapper.find(".segmented-control");
    expect(root().classes()).toContain("small");
    expect(root().classes()).toContain("extra");

    await wrapper.setProps({ styleClassPassthrough: ["other"] });
    expect(root().classes()).toContain("other");
    expect(root().classes()).not.toContain("small");
  });
});
