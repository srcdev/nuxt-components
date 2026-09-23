// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../ToggleSwitchWithLabel.vue";

const initialPropsData = {
  name: "notifications",
  label: "Enable notifications",
  errorMessage: "",
  modelValue: false,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slots = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
    slots,
  });
};

describe("ToggleSwitchWithLabel", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the label text", async () => {
    wrapper = await wrapperFactory({ label: "Enable dark mode" });
    expect(wrapper.text()).toContain("Enable dark mode");
  });

  it("renders a checkbox input", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
  });

  it("associates the label with the checkbox via matching for/id", async () => {
    wrapper = await wrapperFactory();
    const inputId = wrapper.find("input[type='checkbox']").attributes("id");
    expect(wrapper.find("label").attributes("for")).toBe(inputId);
  });

  it("renders the error message when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "You must accept" });
    expect(wrapper.text()).toContain("You must accept");
  });

  it("renders the description slot", async () => {
    wrapper = await wrapperFactory({}, { description: () => "Turn this on to receive notifications" });
    expect(wrapper.text()).toContain("Turn this on to receive notifications");
  });

  it("forwards required to the underlying input", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });

  it("applies the error theme to ToggleSwitchCore when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, theme: "default" });
    expect(wrapper.find(".toggle-switch-core").attributes("data-theme")).toBe("error");
  });

  it("applies styleClassPassthrough to the root element", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-toggle"] });
    expect(wrapper.find(".toggle-switch-with-label").classes()).toContain("custom-toggle");
  });

  it("forwards round to ToggleSwitchCore without leaking it as a DOM attribute", async () => {
    wrapper = await wrapperFactory({ round: false });
    const core = wrapper.findComponent({ name: "ToggleSwitchCore" });
    expect(core.props("round")).toBe(false);
    expect(wrapper.find(".toggle-switch-core").attributes("round")).toBeUndefined();
  });
});
