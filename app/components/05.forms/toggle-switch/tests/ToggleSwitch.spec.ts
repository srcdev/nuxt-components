// https://nuxt.com/docs/getting-started/testing#unit-testing
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../ToggleSwitch.vue";

const initialPropsData = {
  id: "test-toggle",
  name: "testName",
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

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
});

describe("ToggleSwitch", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a checkbox input with the switch role", async () => {
    wrapper = await wrapperFactory();
    const input = wrapper.find("input.toggle-switch-input");

    expect(input.attributes("type")).toBe("checkbox");
    expect(input.attributes("role")).toBe("switch");
    expect(input.attributes("id")).toBe("toggle-switch-test-toggle");
  });

  it("binds v-model to the checkbox checked state and data-checked", async () => {
    wrapper = await wrapperFactory({ modelValue: true });

    expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(true);
    expect(wrapper.attributes("data-checked")).toBe("");

    await wrapper.setProps({ modelValue: false });
    expect(wrapper.attributes("data-checked")).toBeUndefined();
  });

  it("toggles modelValue when the track is clicked", async () => {
    wrapper = await wrapperFactory({ modelValue: false });
    await wrapper.find(".toggle-switch-track").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([true]);
  });

  it("toggles once, through v-model, when the input itself is clicked", async () => {
    wrapper = await wrapperFactory({ modelValue: false });
    await wrapper.find("input").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
  });

  it("toggles between custom trueValue/falseValue", async () => {
    wrapper = await wrapperFactory({ modelValue: "no", trueValue: "yes", falseValue: "no" });
    await wrapper.find(".toggle-switch-track").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["yes"]);
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
    expect(wrapper.attributes("data-theme")).toBe("success");
  });

  it("switches to the error theme and sets data-invalid and aria-invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, theme: "success" });

    expect(wrapper.attributes("data-theme")).toBe("error");
    expect(wrapper.attributes("data-invalid")).toBe("");
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });

  it("omits aria-invalid and aria-describedby by default", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("aria-invalid")).toBeUndefined();
    expect(wrapper.find("input").attributes("aria-describedby")).toBeUndefined();
  });

  it("hides the decorative track from assistive tech", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".toggle-switch-track").attributes("aria-hidden")).toBe("true");
  });

  it("applies styleClassPassthrough to the root element and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-toggle"] });
    expect(wrapper.classes()).toContain("custom-toggle");

    await wrapper.setProps({ styleClassPassthrough: ["other-toggle"] });
    await nextTick();
    expect(wrapper.classes()).toContain("other-toggle");
    expect(wrapper.classes()).not.toContain("custom-toggle");
  });

  it("renders default icons when no icon slots are provided", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.findAll(".toggle-switch-icon")).toHaveLength(2);
  });

  it("renders custom icon slot content instead of the default icon", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        iconOn: '<span data-testid="custom-on">on</span>',
        iconOff: '<span data-testid="custom-off">off</span>',
      }
    );

    expect(wrapper.find(".toggle-switch-icon-on [data-testid='custom-on']").exists()).toBe(true);
    expect(wrapper.find(".toggle-switch-icon-off [data-testid='custom-off']").exists()).toBe(true);
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
