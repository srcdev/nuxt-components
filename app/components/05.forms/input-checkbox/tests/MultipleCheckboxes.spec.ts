// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { FormUiTheme, OptionsLayout } from "~/types/forms/types.forms";
import ComponentUnderTest from "../MultipleCheckboxes.vue";
import tagsData from "./data/tags.json";

const initialPropsData = {
  dataTestid: "multiple-checkboxes",
  name: "tags",
  legend: "Choose tags (as checkboxes)",
  required: true,
  isButton: true,
  errorMessage: "Please select between 3 and 8 tags",
  fieldHasError: false,
  modelValue: [] as string[],
  fieldData: tagsData,
  optionsLayout: "inline" as OptionsLayout,
  styleClassPassthrough: ["testClass"],
  theme: "default" as FormUiTheme,
};

const initialSlots = {
  checkedIcon: () => ``,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slotsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };
  const mockSlotsData = { ...initialSlots, ...slotsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
    slots: mockSlotsData,
  });
};

describe("MultipleCheckboxes Component", () => {
  it("Mounts", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper).toBeTruthy();
  });

  it("renders the data-testid and applies styleClassPassthrough to the fieldset", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.attributes("data-testid")).toBe(initialPropsData.dataTestid);
    const fieldset = wrapper.find(".form-fieldset");
    expect(fieldset.classes()).toContain("multiple-checkboxes-fieldset");
    expect(fieldset.classes()).toContain("testClass");
  });

  it("renders the legend", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("legend").text()).toBe(initialPropsData.legend);
  });

  it("renders one checkbox per fieldData item", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.findAll('input[type="checkbox"]').length).toBe(tagsData.data.length);
  });

  it("uses the button presentation when isButton is true", async () => {
    wrapper = await wrapperFactory({ isButton: true });
    expect(wrapper.findAll(".input-checkbox-radio-options-button").length).toBe(tagsData.data.length);
  });

  it("uses the labelled presentation when isButton is false", async () => {
    wrapper = await wrapperFactory({ isButton: false });
    expect(wrapper.find(".input-checkbox-radio-options-button").exists()).toBe(false);
    expect(wrapper.findAll(".input-checkbox-radio-with-label").length).toBe(tagsData.data.length);
  });

  it("applies optionsLayout as a class on the items container", async () => {
    wrapper = await wrapperFactory({ optionsLayout: "block" as OptionsLayout });
    expect(wrapper.find(".multiple-checkboxes-items").classes()).toContain("block");
  });

  it("does not put native required on each checkbox in the group", async () => {
    wrapper = await wrapperFactory({ required: true, isButton: false });
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      expect(checkbox.attributes("required")).toBeUndefined();
    });
  });

  it("gives each checkbox an id derived from name and value", async () => {
    wrapper = await wrapperFactory();
    const first = wrapper.find('input[type="checkbox"]');
    expect(first.attributes("id")).toBe(`tags-${tagsData.data[0]!.value}`);
  });

  it("adds each clicked value to the model", async () => {
    wrapper = await wrapperFactory({
      "onUpdate:modelValue": (value: string[]) => wrapper.setProps({ modelValue: value }),
    });
    const checkboxes = wrapper.findAll('input[type="checkbox"]');

    await checkboxes[0]!.setValue(true);
    expect(wrapper.props("modelValue")).toEqual([tagsData.data[0]!.value]);
    expect(checkboxes[0]!.attributes("aria-checked")).toBe("true");

    await checkboxes[1]!.setValue(true);
    expect(wrapper.props("modelValue")).toEqual([tagsData.data[0]!.value, tagsData.data[1]!.value]);
    expect(checkboxes[1]!.attributes("aria-checked")).toBe("true");
  });

  it("removes a value from the model when unchecked", async () => {
    wrapper = await wrapperFactory({
      modelValue: [tagsData.data[0]!.value],
      "onUpdate:modelValue": (value: string[]) => wrapper.setProps({ modelValue: value }),
    });
    const first = wrapper.find('input[type="checkbox"]');
    expect(first.attributes("aria-checked")).toBe("true");

    await first.setValue(false);
    expect(wrapper.props("modelValue")).toEqual([]);
  });

  it("shows the error message and marks the fieldset invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    const error = wrapper.find(".input-error-message");
    expect(error.classes()).toContain("show");
    expect(error.text()).toContain(initialPropsData.errorMessage);
    expect(wrapper.find(".form-fieldset").attributes("aria-invalid")).toBe("true");
  });

  it("points each checkbox's aria-describedby at the error message when in error", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, isButton: false });
    const errorId = wrapper.find(".input-error-message").attributes("id");
    expect(errorId).toBeTruthy();
    expect(wrapper.find('input[type="checkbox"]').attributes("aria-describedby")).toContain(errorId);
  });

  it("hides the error message when fieldHasError is false", async () => {
    wrapper = await wrapperFactory({ fieldHasError: false });
    expect(wrapper.find(".input-error-message").classes()).not.toContain("show");
  });
});
