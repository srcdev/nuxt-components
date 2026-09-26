import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputCheckboxRadioField from "../InputCheckboxRadioField.vue";

const defaultProps = {
  type: "checkbox" as const,
  name: "terms",
  label: "I agree to the terms",
  modelValue: false,
};

const createWrapper = (props = {}, slots = {}) =>
  mountSuspended(InputCheckboxRadioField, {
    attachTo: document.body,
    props: { ...defaultProps, ...props },
    slots,
  });

describe("InputCheckboxRadioField", () => {
  it("renders a label linked to the inner control", async () => {
    const wrapper = await createWrapper();
    const label = wrapper.find("label.input-checkbox-radio-field");
    const input = wrapper.find("input");

    expect(input.attributes("id")).toBeTruthy();
    expect(label.attributes("for")).toBe(input.attributes("id"));
    expect(label.attributes("id")).toBeUndefined();
  });

  it("renders the label prop as text", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find(".input-checkbox-radio-field-label").text()).toBe("I agree to the terms");
  });

  it("replaces the label text with the labelContent slot", async () => {
    const wrapper = await createWrapper({}, { labelContent: `<span class="rich">Rich <a href="#">terms</a></span>` });
    const label = wrapper.find(".input-checkbox-radio-field-label");

    expect(label.find(".rich").exists()).toBe(true);
    expect(label.text()).not.toContain("I agree to the terms");
  });

  it("renders data-invalid instead of an error class", async () => {
    const wrapper = await createWrapper({ fieldHasError: true });
    const root = wrapper.find(".input-checkbox-radio-field");

    expect(root.attributes("data-invalid")).toBe("");
    expect(root.classes()).toEqual(["input-checkbox-radio-field"]);
  });

  it("forwards props to the inner control", async () => {
    const wrapper = await createWrapper({
      type: "radio",
      inputVariant: "underlined",
      theme: "warning",
      required: true,
      ariaDescribedby: "help",
      trueValue: "yes",
      modelValue: "",
    });
    const control = wrapper.find(".input-checkbox-radio");
    const input = wrapper.find("input");

    expect(control.attributes("data-type")).toBe("radio");
    expect(control.attributes("data-input-variant")).toBe("underlined");
    expect(control.attributes("data-theme")).toBe("warning");
    expect(input.attributes("required")).toBeDefined();
    expect(input.attributes("aria-describedby")).toBe("help");
  });

  it("emits model updates from the inner control", async () => {
    const wrapper = await createWrapper();

    await wrapper.find("input").setValue(true);
    expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual([true]);
  });

  it("applies and updates styleClassPassthrough", async () => {
    const wrapper = await createWrapper({ styleClassPassthrough: "first" });
    await wrapper.setProps({ styleClassPassthrough: ["second"] });
    const classes = wrapper.find(".input-checkbox-radio-field").classes();

    expect(classes).toContain("second");
    expect(classes).not.toContain("first");
  });
});
