// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputRangeCore.vue";

const initialPropsData = {
  id: "test-range",
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

describe("InputRangeCore", () => {
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
    expect(wrapper.find(".slot.left").exists()).toBe(false);
    expect(wrapper.find(".slot.right").exists()).toBe(false);
  });

  it("renders the left/right slots when provided", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<button data-testid="left-slot">-</button>',
        right: '<button data-testid="right-slot">+</button>',
      }
    );

    expect(wrapper.find(".slot.left [data-testid='left-slot']").exists()).toBe(true);
    expect(wrapper.find(".slot.right [data-testid='right-slot']").exists()).toBe(true);
  });

  it("renders the markers slot and adds has-markers class to the input", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        markers: '<div class="input-range-markers" data-testid="markers"></div>',
      }
    );

    expect(wrapper.find('[data-testid="markers"]').exists()).toBe(true);
    expect(wrapper.find("input").classes()).toContain("has-markers");
  });

  it("does not add has-markers class when the markers slot is not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").classes()).not.toContain("has-markers");
  });

  it("sets the list attribute to `{name}-datalist` only when the datalist slot is used", async () => {
    wrapper = await wrapperFactory(
      { name: "price" },
      { datalist: '<datalist id="price-datalist"></datalist>' }
    );
    expect(wrapper.find("input").attributes("list")).toBe("price-datalist");
  });

  it("leaves the list attribute empty when the datalist slot is not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("list")).toBe("");
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
