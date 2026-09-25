// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextAsNumberWithLabel.vue";

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

  it("forwards the input-text-as-number marker class down to InputTextCore's own input", async () => {
    // Regression test: the marker classes toggled via updateElementClasses() must reach the
    // inner <input> (not just the outer wrapper), or the scoped .input-text-core.input-text-as-number
    // CSS (compact fit-content width, centered text) silently never matches.
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").classes()).toContain("input-text-as-number");
  });

  it("still forwards a consumer-supplied styleClassPassthrough down to the input", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-number-class"] });
    expect(wrapper.find("input").classes()).toContain("custom-number-class");
    expect(wrapper.find("input").classes()).toContain("input-text-as-number");
  });
});
