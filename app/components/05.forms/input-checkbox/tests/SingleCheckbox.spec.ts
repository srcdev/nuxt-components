import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../SingleCheckbox.vue";

const initialPropsData = {
  name: "terms",
  legend: "Terms and conditions",
  label: "I agree to the terms",
  errorMessage: "You must agree to the terms",
  fieldHasError: false,
  modelValue: false as string | number | boolean,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slotsData = {}) =>
  mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: { ...initialPropsData, ...propsData },
    slots: slotsData,
  });

describe("SingleCheckbox Component", () => {
  it("Mounts", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper).toBeTruthy();
  });

  it("defaults data-testid to single-checkbox", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.attributes("data-testid")).toBe("single-checkbox");
  });

  it("applies styleClassPassthrough to the fieldset, not the error message", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["testClass"] });
    const fieldset = wrapper.find(".form-fieldset");
    expect(fieldset.classes()).toContain("single-checkbox-fieldset");
    expect(fieldset.classes()).toContain("testClass");
    expect(wrapper.find(".input-error-message").classes()).not.toContain("testClass");
  });

  it("renders the legend and label", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("legend").text()).toBe(initialPropsData.legend);
    expect(wrapper.text()).toContain(initialPropsData.label);
  });

  it("renders labelContent slot in place of the label prop", async () => {
    wrapper = await wrapperFactory({}, { labelContent: () => "Custom label content" });
    expect(wrapper.text()).toContain("Custom label content");
  });

  it("renders a single checkbox", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.findAll('input[type="checkbox"]').length).toBe(1);
  });

  it("puts native required on the checkbox when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find('input[type="checkbox"]').attributes("required")).toBeDefined();
  });

  it("toggles the model between trueValue and falseValue", async () => {
    wrapper = await wrapperFactory({
      "onUpdate:modelValue": (value: boolean) => wrapper.setProps({ modelValue: value }),
    });
    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);
    expect(wrapper.props("modelValue")).toBe(true);
    expect(checkbox.attributes("aria-checked")).toBe("true");

    await checkbox.setValue(false);
    expect(wrapper.props("modelValue")).toBe(false);
    expect(checkbox.attributes("aria-checked")).toBe("false");
  });

  it("emits custom trueValue and falseValue", async () => {
    wrapper = await wrapperFactory({
      modelValue: "no",
      trueValue: "yes",
      falseValue: "no",
      "onUpdate:modelValue": (value: string) => wrapper.setProps({ modelValue: value }),
    });
    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);
    expect(wrapper.props("modelValue")).toBe("yes");

    await checkbox.setValue(false);
    expect(wrapper.props("modelValue")).toBe("no");
  });

  it("shows the error message and marks the fieldset invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    const error = wrapper.find(".input-error-message");
    expect(error.classes()).toContain("show");
    expect(error.text()).toContain(initialPropsData.errorMessage);
    expect(wrapper.find(".form-fieldset").attributes("aria-invalid")).toBe("true");
  });

  it("points the checkbox's aria-describedby at the error message when in error", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    const errorId = wrapper.find(".input-error-message").attributes("id");
    expect(errorId).toBeTruthy();
    expect(wrapper.find('input[type="checkbox"]').attributes("aria-describedby")).toContain(errorId);
  });

  it("hides the error message when fieldHasError is false", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-error-message").classes()).not.toContain("show");
  });
});
