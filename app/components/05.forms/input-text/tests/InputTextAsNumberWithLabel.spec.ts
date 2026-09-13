// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../variants/InputTextAsNumberWithLabel.vue";

const initialPropsData = {
  name: "quantity",
  label: "Quantity",
  errorMessage: "",
  min: 0,
  max: 10,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
    slots: {
      left: () => "−",
      right: () => "+",
    },
  });
};

describe("InputTextAsNumberWithLabel", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("uses the default step button text", async () => {
    wrapper = await wrapperFactory();

    const [stepDown, stepUp] = wrapper.findAll("button");
    expect(stepDown?.text()).toContain("Step down");
    expect(stepUp?.text()).toContain("Step up");
  });

  it("uses custom stepDownText/stepUpText when provided", async () => {
    wrapper = await wrapperFactory({
      stepDownText: "Diminuer",
      stepUpText: "Augmenter",
    });

    const [stepDown, stepUp] = wrapper.findAll("button");
    expect(stepDown?.text()).toContain("Diminuer");
    expect(stepUp?.text()).toContain("Augmenter");
  });

  it("increments the value when the step-up button is clicked", async () => {
    wrapper = await wrapperFactory({ modelValue: 5 });

    const [, stepUp] = wrapper.findAll("button");
    await stepUp?.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([6]);
  });
});
