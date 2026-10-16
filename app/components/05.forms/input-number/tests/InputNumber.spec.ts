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

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
});
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
    expect(wrapper.find(".input-number-slot-left").exists()).toBe(false);
    expect(wrapper.find(".input-number-slot-right").exists()).toBe(false);
    expect(wrapper.find(".input-number-wrapper").attributes("data-has-left-slot")).toBeUndefined();
    expect(wrapper.find(".input-number-wrapper").attributes("data-has-right-slot")).toBeUndefined();
  });

  it("renders the left/right slots when provided", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<button data-testid="left-slot">-</button>',
        right: '<button data-testid="right-slot">+</button>',
      }
    );

    expect(wrapper.find(".input-number-slot-left [data-testid='left-slot']").exists()).toBe(true);
    expect(wrapper.find(".input-number-slot-right [data-testid='right-slot']").exists()).toBe(true);
    expect(wrapper.find(".input-number-wrapper").attributes("data-has-left-slot")).toBe("");
    expect(wrapper.find(".input-number-wrapper").attributes("data-has-right-slot")).toBe("");
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

  it("defaults data-input-variant to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-number-wrapper").attributes("data-input-variant")).toBe("normal");
  });

  it("renders inputVariant as data-input-variant, not a bare class", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    const root = wrapper.find(".input-number-wrapper");
    expect(root.attributes("data-input-variant")).toBe("underlined");
    expect(root.classes()).not.toContain("underlined");
  });

  it("doesn't set a pattern, which number inputs ignore", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("pattern")).toBeUndefined();
  });

  it("picks inputmode from min and step", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("inputmode")).toBe("numeric");

    await wrapper.setProps({ step: 0.5 });
    expect(wrapper.find("input").attributes("inputmode")).toBe("decimal");

    await wrapper.setProps({ min: -10 });
    expect(wrapper.find("input").attributes("inputmode")).toBeUndefined();
  });

  it("caps the minimum width for very long min and max values", async () => {
    wrapper = await wrapperFactory({ min: -999999999999, max: 999999999999999, step: 0.0001 });
    const vm = wrapper.vm as unknown as { minLength: string };
    expect(vm.minLength).toBe("12em");
  });

  it("updates passthrough classes when the prop changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["first"] });
    await wrapper.setProps({ styleClassPassthrough: ["second"] });
    const classes = wrapper.find("input").classes();
    expect(classes).toContain("second");
    expect(classes).not.toContain("first");
  });
});
