// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../ToggleSwitchCore.vue";

const initialPropsData = {
  id: "test-toggle",
  name: "testName",
  modelValue: false,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
  });
};

describe("ToggleSwitchCore", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("binds v-model to the checkbox checked state", async () => {
    wrapper = await wrapperFactory({ modelValue: true });
    const input = wrapper.find<HTMLInputElement>("input[type='checkbox']");
    expect(input.element.checked).toBe(true);
  });

  it("toggles modelValue when the wrapper is clicked", async () => {
    wrapper = await wrapperFactory({ modelValue: false });
    await wrapper.find(".toggle-switch-wrapper").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([true]);
  });

  it("toggles between custom trueValue/falseValue", async () => {
    wrapper = await wrapperFactory({ modelValue: "off", trueValue: "on", falseValue: "off" });
    await wrapper.find(".toggle-switch-wrapper").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["on"]);
  });

  it("sets required attribute when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });

  it("does not set required attribute by default", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("required")).toBeUndefined();
  });

  it("sets data-theme from the theme prop", async () => {
    wrapper = await wrapperFactory({ theme: "success" });
    expect(wrapper.find(".toggle-switch-core").attributes("data-theme")).toBe("success");
  });

  it("sets data-theme to error and aria-invalid when fieldHasError is true, overriding theme", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, theme: "success" });
    expect(wrapper.find(".toggle-switch-core").attributes("data-theme")).toBe("error");
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });

  it("applies styleClassPassthrough to the root element", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-toggle-class"] });
    expect(wrapper.find(".toggle-switch-core").classes()).toContain("custom-toggle-class");
  });

  it("renders default icons when no icon slots are provided", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".toggle-switch-wrapper").classes()).toContain("use-default-icons");
  });

  it("renders custom icon slot content instead of the default icon", async () => {
    wrapper = await mountSuspended(ComponentUnderTest, {
      attachTo: document.body,
      props: initialPropsData,
      slots: {
        iconOn: () => "ON",
        iconOff: () => "OFF",
      },
    });
    expect(wrapper.find(".toggle-switch-wrapper").classes()).not.toContain("use-default-icons");
    expect(wrapper.find(".icon-on").text()).toBe("ON");
    expect(wrapper.find(".icon-off").text()).toBe("OFF");
  });

  it("consumes round as a declared prop instead of leaking it as a DOM attribute", async () => {
    wrapper = await wrapperFactory({ round: false });
    expect(wrapper.props("round")).toBe(false);
    expect(wrapper.attributes("round")).toBeUndefined();
  });

  it("defaults round to true", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.props("round")).toBe(true);
  });
});
