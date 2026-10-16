// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputNumberField.vue";

const initialPropsData = {
  name: "testName",
  label: "Test label",
  min: 0,
  max: 100,
  errorMessage: "",
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

describe("InputNumberField", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the label text", async () => {
    wrapper = await wrapperFactory({ label: "Quantity" });
    expect(wrapper.text()).toContain("Quantity");
  });

  it("renders a number input", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
  });

  it("forwards placeholder to the input", async () => {
    wrapper = await wrapperFactory({ placeholder: "Enter a quantity" });
    expect(wrapper.find("input").attributes("placeholder")).toBe("Enter a quantity");
  });

  it("sets data-invalid, not a bare error class, when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.find(".input-number-field").attributes("data-invalid")).toBe("");
    expect(wrapper.find(".input-number-field").classes()).not.toContain("error");
  });

  it("does not render step buttons when the left/right slots are not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.findAllComponents({ name: "InputButton" })).toHaveLength(0);
  });

  it("renders step buttons with default labels when the left/right slots are used", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<span data-testid="left-icon">-</span>',
        right: '<span data-testid="right-icon">+</span>',
      }
    );

    expect(wrapper.text()).toContain("Step down");
    expect(wrapper.text()).toContain("Step up");
  });

  it("overrides step button labels via stepDownLabel/stepUpLabel props", async () => {
    wrapper = await wrapperFactory(
      { stepDownLabel: "Decrease", stepUpLabel: "Increase" },
      {
        left: '<span>-</span>',
        right: '<span>+</span>',
      }
    );

    expect(wrapper.text()).toContain("Decrease");
    expect(wrapper.text()).toContain("Increase");
  });

  it("increments the model value when the step-up button is clicked", async () => {
    wrapper = await wrapperFactory({ modelValue: 50, step: 5 }, { right: '<span>+</span>' });

    const buttons = wrapper.findAll("button");
    const stepUpButton = buttons.find(
      (btn) => btn.text().includes("+") || btn.attributes("aria-label")?.includes("Step up")
    );
    await stepUpButton?.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([55]);
  });

  it("decrements the model value when the step-down button is clicked", async () => {
    wrapper = await wrapperFactory({ modelValue: 50, step: 5 }, { left: '<span>-</span>' });

    const buttons = wrapper.findAll("button");
    const stepDownButton = buttons.find(
      (btn) => btn.text().includes("-") || btn.attributes("aria-label")?.includes("Step down")
    );
    await stepDownButton?.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([45]);
  });

  it("does not step below min", async () => {
    wrapper = await wrapperFactory({ modelValue: 0, min: 0, step: 5 }, { left: '<span>-</span>' });

    const buttons = wrapper.findAll("button");
    const stepDownButton = buttons.find((btn) => btn.text().includes("-"));
    await stepDownButton?.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("does not step above max", async () => {
    wrapper = await wrapperFactory({ modelValue: 100, max: 100, step: 5 }, { right: '<span>+</span>' });

    const buttons = wrapper.findAll("button");
    const stepUpButton = buttons.find((btn) => btn.text().includes("+"));
    await stepUpButton?.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("renders the error message when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "This field is required" });
    expect(wrapper.text()).toContain("This field is required");
  });

  it("applies styleClassPassthrough to the root only, not the inner input", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: "custom-number" });
    expect(wrapper.find(".input-number-field").classes()).toContain("custom-number");
    expect(wrapper.find("input").classes()).not.toContain("custom-number");
  });

  it("forwards inputVariant to the wrapper, InputLabel, and InputNumber", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.find(".input-number-field").attributes("data-input-variant")).toBe("underlined");
    expect(wrapper.find(".input-number-wrapper").attributes("data-input-variant")).toBe("underlined");
    expect(wrapper.find(".input-error-message").attributes("data-input-variant")).toBe("underlined");
  });

  describe("step buttons", () => {
    const stepSlots = { left: "<span>-</span>", right: "<span>+</span>" };
    const stepDown = () => wrapper.findAll("button").find((button) => button.text().includes("-"))!;
    const stepUp = () => wrapper.findAll("button").find((button) => button.text().includes("+"))!;

    it("rounds away floating-point drift on fractional steps", async () => {
      wrapper = await wrapperFactory({ modelValue: 0.2, min: 0, max: 1, step: 0.1 }, stepSlots);
      await stepUp().trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([0.3]);
    });

    it("clamps to max when a step would overshoot it", async () => {
      wrapper = await wrapperFactory({ modelValue: 8, min: 0, max: 10, step: 5 }, stepSlots);
      await stepUp().trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([10]);
    });

    it("clamps to min when a step would undershoot it", async () => {
      wrapper = await wrapperFactory({ modelValue: 2, min: 0, max: 10, step: 5 }, stepSlots);
      await stepDown().trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([0]);
    });

    it("brings a typed out-of-range value back into range", async () => {
      wrapper = await wrapperFactory({ modelValue: 500, min: 0, max: 100 }, stepSlots);
      await stepDown().trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([100]);
    });

    it("starts from 0, clamped into range, when the field is empty", async () => {
      wrapper = await wrapperFactory({ modelValue: "", min: 5, max: 10 }, stepSlots);
      await stepUp().trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([5]);
    });

    it("treats a negative or zero step as its size, or 1", async () => {
      wrapper = await wrapperFactory({ modelValue: 5, min: 0, max: 10, step: -2 }, stepSlots);
      await stepUp().trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([7]);

      wrapper.unmount();
      wrapper = await wrapperFactory({ modelValue: 5, min: 0, max: 10, step: 0 }, stepSlots);
      await stepUp().trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([6]);
    });
  });
});
