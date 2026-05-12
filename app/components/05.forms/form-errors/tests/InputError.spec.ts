// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputError.vue";

const initialPropsData = {
  dataTestid: "inputError",
  errorMessage: "Hello World",
  showError: true,
  id: "testId",
  styleClassPassthrough: ["testClass"],
  compact: false,
  isDetached: true,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    props: mockPropsData,
  });
};

describe("InputError Component", () => {
  it("renders properly", async () => {
    wrapper = await wrapperFactory();

    // Check the value of the data-testid attribute
    const dataTestIdValue = wrapper.attributes("data-testid");
    expect(dataTestIdValue).toBe("inputError");

    expect(wrapper.find("[data-testid]").classes()).toContain("testClass");
    expect(wrapper.find("[data-testid]").classes()).toContain("show");
  });

  it("is not displayed by default", async () => {
    const propData = {
      showError: false,
    };
    wrapper = await wrapperFactory(propData);

    expect(wrapper.find("[data-testid]").classes()).not.toContain("show");
  });

  it("is displays a single error message", async () => {
    const propData = {
      showError: true,
    };
    wrapper = await wrapperFactory(propData);

    expect(wrapper.find(".message-list").exists()).toBe(false);
    expect(wrapper.find(".message-single").text()).toContain("Hello World");
  });

  it("is displays a single error message", async () => {
    const propData = {
      errorMessage: ["Hello World", "Hello World 2"],
    };
    wrapper = await wrapperFactory(propData);

    expect(wrapper.find(".message-single").exists()).toBe(false);
    expect(wrapper.find(".message-list .message-list-item:first-child").text()).toEqual("Hello World");
    expect(wrapper.find(".message-list .message-list-item:last-child").text()).toEqual("Hello World 2");
  });
});
