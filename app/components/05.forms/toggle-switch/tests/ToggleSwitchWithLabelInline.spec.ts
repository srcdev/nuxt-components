// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../ToggleSwitchWithLabelInline.vue";

const initialPropsData = {
  name: "notifications",
  label: "Enable notifications",
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

describe("ToggleSwitchWithLabelInline", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the label text", async () => {
    wrapper = await wrapperFactory({ label: "Dark mode" });
    expect(wrapper.text()).toContain("Dark mode");
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

  it("defaults labelWeight to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-switch-label").classes()).toContain("body-normal");
  });

  it("maps labelWeight to the matching body-* class", async () => {
    wrapper = await wrapperFactory({ labelWeight: "bold" });
    expect(wrapper.find(".input-switch-label").classes()).toContain("body-normal-bold");
  });

  it("applies styleClassPassthrough to the root element", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-toggle-inline"] });
    expect(wrapper.find(".toggle-switch-with-label-inline").classes()).toContain("custom-toggle-inline");
  });

  it("forwards round to ToggleSwitchCore without leaking it as a DOM attribute", async () => {
    wrapper = await wrapperFactory({ round: false });
    const core = wrapper.findComponent({ name: "ToggleSwitchCore" });
    expect(core.props("round")).toBe(false);
    expect(wrapper.find(".toggle-switch-core").attributes("round")).toBeUndefined();
  });
});
