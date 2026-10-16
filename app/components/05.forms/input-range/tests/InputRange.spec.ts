// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputRange.vue";

const initialPropsData = {
  id: "test-range",
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

describe("InputRange", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a native range input with the given min/max/step", async () => {
    wrapper = await wrapperFactory({ min: 10, max: 90, step: 5 });
    const input = wrapper.find("input");

    expect(input.attributes("type")).toBe("range");
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

  it("forwards aria-describedby", async () => {
    wrapper = await wrapperFactory({ ariaDescribedby: "some-description-id" });
    expect(wrapper.find("input").attributes("aria-describedby")).toBe("some-description-id");
  });

  it("sets data-theme from the theme prop", async () => {
    wrapper = await wrapperFactory({ theme: "error" });
    expect(wrapper.find(".input-range-wrapper").attributes("data-theme")).toBe("error");
  });

  it("does not render the left/right slot wrappers when the slots are not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-range-slot-left").exists()).toBe(false);
    expect(wrapper.find(".input-range-slot-right").exists()).toBe(false);
  });

  it("renders the left/right slots when provided", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<button data-testid="left-slot">-</button>',
        right: '<button data-testid="right-slot">+</button>',
      }
    );

    expect(wrapper.find(".input-range-slot-left [data-testid='left-slot']").exists()).toBe(true);
    expect(wrapper.find(".input-range-slot-right [data-testid='right-slot']").exists()).toBe(true);
  });

  it("renders the markers slot and sets data-has-markers on the wrapper", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        markers: '<div class="input-range-markers" data-testid="markers"></div>',
      }
    );

    expect(wrapper.find('[data-testid="markers"]').exists()).toBe(true);
    expect(wrapper.find(".input-range-wrapper").attributes("data-has-markers")).toBe("");
  });

  it("does not set data-has-markers when the markers slot is not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-range-wrapper").attributes("data-has-markers")).toBeUndefined();
  });

  it("links a generated datalist id through the datalistId slot prop", async () => {
    wrapper = await wrapperFactory(
      { name: "price" },
      { datalist: `<template #datalist="{ datalistId }"><datalist :id="datalistId"></datalist></template>` }
    );
    const list = wrapper.find("input").attributes("list");

    expect(list).toBeTruthy();
    expect(list).not.toBe("price-datalist");
    expect(wrapper.find("datalist").attributes("id")).toBe(list);
  });

  it("omits the list attribute when the datalist slot is not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("list")).toBeUndefined();
  });

  it("marks the wrapper and input invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.find(".input-range-wrapper").attributes("data-invalid")).toBe("");
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });

  it("updates passthrough classes when the prop changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["first"] });
    await wrapper.setProps({ styleClassPassthrough: ["second"] });
    const classes = wrapper.find("input").classes();

    expect(classes).toContain("second");
    expect(classes).not.toContain("first");
  });

  it("applies the weight class from the weight prop", async () => {
    wrapper = await wrapperFactory({ weight: "wght-700" });
    expect(wrapper.find("input").classes()).toContain("input-range--wght-700");
  });

  it("applies styleClassPassthrough to the input", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-range-class"] });
    expect(wrapper.find("input").classes()).toContain("custom-range-class");
  });

  it("sets required attribute when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });
});
