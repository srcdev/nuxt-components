// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { ref } from "vue";
import ComponentUnderTest from "../MultipleRadiobuttons.vue";
import tagsData from "./data/tags.json";

const initialPropsData = {
  dataTestid: "multiple-radio-buttons",
  id: "tags",
  name: "tags",
  legend: "Choose tags (as checkboxes)",
  required: true,
  label: "Check between 3 and 8 tags",
  placeholder: "eg. Type something here",
  isButton: true,
  errorMessage: "Please select between 3 and 8 tags",
  fieldHasError: false,
  fieldData: tagsData,
  size: "small",
  optionsLayout: "inline",
  styleClassPassthrough: ["testClass"],
  theme: "primary",
};

const initialSlots = {
  checkedIcon: () => ``,
  itemIcon: () => `<Icon name="material-symbols:add-2" class="icon" />`,
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

describe("MultipleRadioButtons Component", () => {
  it("Mounts", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper).toBeTruthy();
  });

  it("renders properly", async () => {
    wrapper = await wrapperFactory();
    const dataTestIdElem = wrapper.attributes("data-testid");
    expect(dataTestIdElem).toBe(initialPropsData.dataTestid);
    // The styleClassPassthrough is applied to the FormFieldset component, not the root
    expect(wrapper.find(".form-fieldset").classes()).toContain("testClass");
  });

  it("updates radio modelValue when items clicked", async () => {
    const modelValue = ref<string>("");
    const propsData = {
      modelValue,
    };
    wrapper = await wrapperFactory(propsData);

    /*
     * Test the first radio button
     **/
    const radiobuttonElements = wrapper.findAll('input[type="radio"]');
    const firstRadioButton = radiobuttonElements[0];
    expect(firstRadioButton).toBeDefined();
    expect(firstRadioButton!.attributes("aria-checked")).toBe("false");
    const firstRadioButtonTrueValue = firstRadioButton!.attributes("true-value");

    await firstRadioButton!.trigger("click");
    expect(firstRadioButton!.attributes("aria-checked")).toBe("true");
    expect(wrapper.vm.modelValue).toEqual(firstRadioButtonTrueValue);

    /*
     * Test the second radio button
     **/
    const secondRadioButton = radiobuttonElements[1];
    expect(secondRadioButton).toBeDefined();
    expect(secondRadioButton!.attributes("aria-checked")).toBe("false");
    const secondRadioButtonTrueValue = secondRadioButton!.attributes("true-value");

    await secondRadioButton!.trigger("click");
    expect(firstRadioButton!.attributes("aria-checked")).toBe("false");
    expect(secondRadioButton!.attributes("aria-checked")).toBe("true");
    expect(wrapper.vm.modelValue).toEqual(secondRadioButtonTrueValue);
  });
});
