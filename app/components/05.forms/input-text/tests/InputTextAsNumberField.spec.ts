// https://nuxt.com/docs/getting-started/testing#unit-testing
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextAsNumberField.vue";

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

const stepButtons = () => {
  const [stepDown, stepUp] = wrapper.findAll("button");
  return { stepDown: stepDown!, stepUp: stepUp! };
};

const lastEmitted = () => wrapper.emitted("update:modelValue")?.at(-1);

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
});

describe("InputTextAsNumberField", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders .input-text-as-number-field as the root", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.classes()).toContain("input-text-as-number-field");
  });

  it("uses the default step button text", async () => {
    wrapper = await wrapperFactory();

    expect(stepButtons().stepDown.text()).toContain("Step down");
    expect(stepButtons().stepUp.text()).toContain("Step up");
  });

  it("uses custom stepDownText/stepUpText when provided", async () => {
    wrapper = await wrapperFactory({ stepDownText: "Diminuer", stepUpText: "Augmenter" });

    expect(stepButtons().stepDown.text()).toContain("Diminuer");
    expect(stepButtons().stepUp.text()).toContain("Augmenter");
  });

  it("increments the value when the step-up button is clicked", async () => {
    wrapper = await wrapperFactory({ modelValue: 5 });
    await stepButtons().stepUp.trigger("click");
    expect(lastEmitted()).toEqual([6]);
  });

  it("rounds fractional steps instead of drifting", async () => {
    wrapper = await wrapperFactory({ modelValue: 0.2, max: 1, step: 0.1 });
    await stepButtons().stepUp.trigger("click");
    expect(lastEmitted()).toEqual([0.3]);
  });

  it("clamps to max instead of overshooting", async () => {
    wrapper = await wrapperFactory({ modelValue: 8, step: 5 });
    await stepButtons().stepUp.trigger("click");
    expect(lastEmitted()).toEqual([10]);
  });

  it("pulls a typed out-of-range value back into range", async () => {
    wrapper = await wrapperFactory({ modelValue: 50 });
    await stepButtons().stepDown.trigger("click");
    expect(lastEmitted()).toEqual([10]);
  });

  it("starts from 0, clamped, when the field is empty", async () => {
    wrapper = await wrapperFactory({ modelValue: undefined, min: 3 });
    await stepButtons().stepUp.trigger("click");
    expect(lastEmitted()).toEqual([3]);
  });

  it("makes the step buttons read-only at and beyond the limits", async () => {
    wrapper = await wrapperFactory({ modelValue: 12 });
    expect(stepButtons().stepUp.attributes("readonly")).toBeDefined();

    await wrapper.setProps({ modelValue: 0 });
    expect(stepButtons().stepDown.attributes("readonly")).toBeDefined();
  });

  it("parses typed text into a number and empties to undefined", async () => {
    wrapper = await wrapperFactory({ modelValue: 1 });
    const input = wrapper.find("input");

    await input.setValue("7");
    expect(lastEmitted()).toEqual([7]);

    await input.setValue("");
    expect(lastEmitted()).toEqual([undefined]);
  });

  it("picks inputmode from min and step", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("inputmode")).toBe("numeric");

    await wrapper.setProps({ step: 0.5 });
    expect(wrapper.find("input").attributes("inputmode")).toBe("decimal");

    await wrapper.setProps({ min: -5 });
    expect(wrapper.find("input").attributes("inputmode")).toBe("text");
  });

  it("applies styleClassPassthrough to its root only and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-number-class"] });
    expect(wrapper.classes()).toContain("custom-number-class");
    expect(wrapper.find("input").classes()).not.toContain("custom-number-class");

    await wrapper.setProps({ styleClassPassthrough: ["other-class"] });
    await nextTick();
    expect(wrapper.classes()).toContain("other-class");
  });
});
