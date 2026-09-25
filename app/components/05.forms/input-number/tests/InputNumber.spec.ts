// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputNumber.vue";

const initialPropsData = {
  id: "test-number",
  name: "testName",
  min: 0,
  max: 100,
  modelValue: 50,
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

describe("InputNumber", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a native number input with the given min/max/step", async () => {
    wrapper = await wrapperFactory({ min: 10, max: 90, step: 5 });
    const input = wrapper.find("input");

    expect(input.attributes("type")).toBe("number");
    expect(input.attributes("min")).toBe("10");
    expect(input.attributes("max")).toBe("90");
    expect(input.attributes("step")).toBe("5");
  });

  it("defaults step to 1", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("step")).toBe("1");
  });

  it("binds v-model to the input value", async () => {
    wrapper = await wrapperFactory({ modelValue: 42 });
    expect(wrapper.find("input").element.value).toBe("42");
  });

  it("forwards placeholder", async () => {
    wrapper = await wrapperFactory({ placeholder: "Enter a quantity" });
    expect(wrapper.find("input").attributes("placeholder")).toBe("Enter a quantity");
  });

  it("forwards aria-describedby", async () => {
    wrapper = await wrapperFactory({ ariaDescribedby: "some-description-id" });
    expect(wrapper.find("input").attributes("aria-describedby")).toBe("some-description-id");
  });

  it("sets data-theme from the theme prop", async () => {
    wrapper = await wrapperFactory({ theme: "error" });
    expect(wrapper.find(".input-number-wrapper").attributes("data-theme")).toBe("error");
  });

  it("sets data-invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.find(".input-number-wrapper").attributes("data-invalid")).toBe("");
  });

  it("does not render the left/right slot wrappers when the slots are not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".slot.left-slot").exists()).toBe(false);
    expect(wrapper.find(".slot.right-slot").exists()).toBe(false);
    expect(wrapper.find(".input-number-wrapper").classes()).not.toContain("has-left-slot");
    expect(wrapper.find(".input-number-wrapper").classes()).not.toContain("has-right-slot");
  });

  it("renders the left/right slots when provided", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<button data-testid="left-slot">-</button>',
        right: '<button data-testid="right-slot">+</button>',
      }
    );

    expect(wrapper.find(".slot.left-slot [data-testid='left-slot']").exists()).toBe(true);
    expect(wrapper.find(".slot.right-slot [data-testid='right-slot']").exists()).toBe(true);
    expect(wrapper.find(".input-number-wrapper").classes()).toContain("has-left-slot");
    expect(wrapper.find(".input-number-wrapper").classes()).toContain("has-right-slot");
  });

  it("applies the weight class from the weight prop", async () => {
    wrapper = await wrapperFactory({ weight: "wght-700" });
    expect(wrapper.find("input").classes()).toContain("input-number--wght-700");
  });

  it("applies styleClassPassthrough to the input", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-number-class"] });
    expect(wrapper.find("input").classes()).toContain("custom-number-class");
  });

  it("sets required attribute when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });

  it("defaults inputVariant to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-number-wrapper").classes()).toContain("normal");
  });

  it("applies inputVariant as a class on the wrapper", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.find(".input-number-wrapper").classes()).toContain("underlined");
    expect(wrapper.find(".input-number-wrapper").classes()).not.toContain("normal");
  });
});
