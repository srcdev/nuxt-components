import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputCheckboxRadioButton from "../InputCheckboxRadioButton.vue";

const defaultProps = {
  id: "service-balayage",
  type: "checkbox" as const,
  name: "services",
  label: "Balayage",
  trueValue: "balayage",
  modelValue: [] as string[],
  multipleOptions: true,
};

const createWrapper = (props = {}, slots = {}) =>
  mountSuspended(InputCheckboxRadioButton, {
    attachTo: document.body,
    props: { ...defaultProps, ...props },
    slots,
  });

describe("InputCheckboxRadioButton", () => {
  it("renders a label linked to the inner control by id", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find("label.input-checkbox-radio-button").attributes("for")).toBe("service-balayage");
    expect(wrapper.find("input").attributes("id")).toBe("service-balayage");
  });

  it("renders the label prop, or the labelContent slot in its place", async () => {
    const plain = await createWrapper();
    expect(plain.find(".input-checkbox-radio-button-label").text()).toBe("Balayage");

    const rich = await createWrapper({}, { labelContent: `<em>Balayage</em> (from £80)` });
    expect(rich.find(".input-checkbox-radio-button-label em").exists()).toBe(true);
  });

  it("renders state as data attributes, not bare classes", async () => {
    const wrapper = await createWrapper({
      isPill: true,
      direction: "row-reverse",
      optionsLayout: "inline",
      fieldHasError: true,
    });
    const root = wrapper.find(".input-checkbox-radio-button");

    expect(root.classes()).toEqual(["input-checkbox-radio-button"]);
    expect(root.attributes("data-pill")).toBe("");
    expect(root.attributes("data-direction")).toBe("row-reverse");
    expect(root.attributes("data-options-layout")).toBe("inline");
    expect(root.attributes("data-invalid")).toBe("");
  });

  it("updates data-direction when the prop changes", async () => {
    const wrapper = await createWrapper();
    expect(wrapper.find(".input-checkbox-radio-button").attributes("data-direction")).toBe("row");

    await wrapper.setProps({ direction: "row-reverse" });
    expect(wrapper.find(".input-checkbox-radio-button").attributes("data-direction")).toBe("row-reverse");
  });

  it("marks the inner control as a button", async () => {
    const wrapper = await createWrapper({ displayAsDisc: true, inputVariant: "underlined" });
    const control = wrapper.find(".input-checkbox-radio");

    expect(control.attributes("data-button")).toBe("");
    expect(control.attributes("data-display-as-disc")).toBe("");
    expect(control.attributes("data-input-variant")).toBe("underlined");
  });

  it("renders a hidden decorator icon, replaceable by prop or slot", async () => {
    const byDefault = await createWrapper();
    const icon = byDefault.find(".input-checkbox-radio-button-icon .icon");
    expect(icon.exists()).toBe(true);
    expect(icon.attributes("aria-hidden")).toBe("true");

    const bySlot = await createWrapper({}, { itemIcon: `<span class="custom-icon">+</span>` });
    expect(bySlot.find(".input-checkbox-radio-button-icon .custom-icon").exists()).toBe(true);
  });

  it("toggles its value in the group model", async () => {
    const wrapper = await createWrapper({ modelValue: ["cut"] });

    await wrapper.find("input").setValue(true);
    expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual([["cut", "balayage"]]);
  });
});
