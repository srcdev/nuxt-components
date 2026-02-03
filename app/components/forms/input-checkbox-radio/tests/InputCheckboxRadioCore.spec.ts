// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { ref } from "vue";
import ComponentUnderTest from "../InputCheckboxRadioCore.vue";

const initialPropsData = {
  type: "checkbox" as const,
  id: "test-checkbox",
  name: "testName",
  required: false,
  size: "medium",
  theme: "primary",
  fieldHasError: false,
  styleClassPassthrough: ["testClass"],
  trueValue: "checked",
  falseValue: "unchecked",
  ariaDescribedby: "test-description",
  displayAsDisc: false,
  multipleOptions: false,
  isButton: false,
};

const initialSlots = {
  checkedIcon: () => `<span class="custom-icon">✓</span>`,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slotsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };
  const mockSlotsData = { ...initialSlots, ...slotsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
    slots: mockSlotsData,
  });
};

describe("InputCheckboxRadioCore Component", () => {
  describe("Basic Rendering", () => {
    it("mounts properly", async () => {
      wrapper = await wrapperFactory();
      expect(wrapper).toBeTruthy();
    });

    it("renders with correct structure and attributes", async () => {
      wrapper = await wrapperFactory();

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.exists()).toBe(true);
      expect(wrapperDiv.attributes("data-theme")).toBe("primary");
      expect(wrapperDiv.attributes("data-size")).toBe("medium");

      const input = wrapper.find("input");
      expect(input.exists()).toBe(true);
      expect(input.attributes("type")).toBe("checkbox");
      expect(input.attributes("id")).toBe("test-checkbox");
      expect(input.attributes("name")).toBe("testName");
    });

    it("applies style class passthrough correctly", async () => {
      wrapper = await wrapperFactory();
      expect(wrapper.find(".input-checkbox-radio-wrapper").classes()).toContain("testClass");
    });
  });

  describe("Checkbox Type Behavior", () => {
    it("renders checkbox with default check icon", async () => {
      wrapper = await wrapperFactory({ type: "checkbox" });

      const iconSlot = wrapper.find(".input-checked-icon-slot");
      expect(iconSlot.exists()).toBe(true);

      // The icon slot should contain some content (icon will be rendered)
      expect(iconSlot.html()).toBeTruthy();
      expect(iconSlot.html().length).toBeGreaterThan(0);
    });

    it("renders checkbox with custom checked icon slot", async () => {
      wrapper = await wrapperFactory(
        { type: "checkbox" },
        { checkedIcon: () => `<span class="custom-check">✓</span>` }
      );

      const iconSlot = wrapper.find(".input-checked-icon-slot");
      expect(iconSlot.exists()).toBe(true);
      expect(iconSlot.html()).toContain("custom-check");
    });

    it("handles checkbox model value with single value", async () => {
      const modelValue = ref("unchecked");
      wrapper = await wrapperFactory({
        type: "checkbox",
        trueValue: "checked",
        falseValue: "unchecked",
      });

      // Set the model value via the component
      await wrapper.setProps({ modelValue: modelValue.value });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("false");

      // Simulate checking the checkbox by changing modelValue
      modelValue.value = "checked";
      await wrapper.setProps({ modelValue: modelValue.value });

      expect(input.attributes("aria-checked")).toBe("true");
    });

    it("handles checkbox model value with array value", async () => {
      const modelValue = ref<string[]>([]);
      wrapper = await wrapperFactory({
        type: "checkbox",
        trueValue: "option1",
        multipleOptions: true,
      });

      await wrapper.setProps({ modelValue: modelValue.value });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("false");

      // Simulate checking the checkbox by updating modelValue
      modelValue.value = ["option1"];
      await wrapper.setProps({ modelValue: modelValue.value });

      expect(input.attributes("aria-checked")).toBe("true");
    });
  });

  describe("Radio Type Behavior", () => {
    it("renders radio with default circle icon", async () => {
      wrapper = await wrapperFactory({ type: "radio" });

      const iconSlot = wrapper.find(".input-checked-icon-slot");
      expect(iconSlot.exists()).toBe(true);

      // The icon slot should contain some content (icon will be rendered)
      expect(iconSlot.html()).toBeTruthy();
      expect(iconSlot.html().length).toBeGreaterThan(0);
    });

    it("applies radio-specific CSS classes", async () => {
      wrapper = await wrapperFactory({ type: "radio" });

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.classes()).toContain("radio");
    });

    it("handles radio model value correctly", async () => {
      const modelValue = ref("");
      wrapper = await wrapperFactory({
        type: "radio",
        trueValue: "option1",
      });

      await wrapper.setProps({ modelValue: modelValue.value });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("false");

      // Simulate selecting the radio by updating modelValue
      modelValue.value = "option1";
      await wrapper.setProps({ modelValue: modelValue.value });

      expect(input.attributes("aria-checked")).toBe("true");
    });
  });

  describe("Button Style", () => {
    it("applies button classes when isButton is true", async () => {
      wrapper = await wrapperFactory({ isButton: true });

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.classes()).toContain("button");

      const input = wrapper.find("input");
      expect(input.classes()).toContain("is-button");
    });

    it("applies disc display when displayAsDisc is true", async () => {
      wrapper = await wrapperFactory({
        isButton: true,
        displayAsDisc: true,
      });

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.classes()).toContain("display-as-disc");
    });
  });

  describe("Error States", () => {
    it("applies error theme when fieldHasError is true", async () => {
      wrapper = await wrapperFactory({
        fieldHasError: true,
        theme: "primary",
      });

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.attributes("data-theme")).toBe("error");
      expect(wrapperDiv.classes()).toContain("error");
    });

    it("sets aria-invalid when fieldHasError is true", async () => {
      wrapper = await wrapperFactory({ fieldHasError: true });

      const input = wrapper.find("input");
      expect(input.attributes("aria-invalid")).toBe("true");
    });
  });

  describe("Accessibility", () => {
    it("sets correct ARIA attributes", async () => {
      wrapper = await wrapperFactory({
        ariaDescribedby: "description-id",
        required: true,
      });

      const input = wrapper.find("input");
      expect(input.attributes("aria-describedby")).toBe("description-id");
      expect(input.attributes("required")).toBeDefined();
    });

    it("sets aria-checked to true when checked", async () => {
      wrapper = await wrapperFactory({
        trueValue: "checked",
      });

      // Set modelValue to the trueValue to make it checked
      await wrapper.setProps({ modelValue: "checked" });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("true");
    });

    it("sets aria-checked to false when not checked", async () => {
      wrapper = await wrapperFactory({
        trueValue: "checked",
        falseValue: "unchecked",
      });

      // Set modelValue to the falseValue to make it unchecked
      await wrapper.setProps({ modelValue: "unchecked" });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("false");
    });

    it("does not require when multipleOptions is true", async () => {
      wrapper = await wrapperFactory({
        required: true,
        multipleOptions: true,
      });

      const input = wrapper.find("input");
      expect(input.attributes("required")).toBeUndefined();
    });
  });

  describe("Size Variants", () => {
    it("applies size classes correctly", async () => {
      wrapper = await wrapperFactory({ size: "large" });

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.classes()).toContain("large");
      expect(wrapperDiv.attributes("data-size")).toBe("large");

      const input = wrapper.find("input");
      expect(input.classes()).toContain("large");
    });
  });

  describe("Theme Variants", () => {
    it("applies theme correctly when no error", async () => {
      wrapper = await wrapperFactory({ theme: "secondary" });

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.attributes("data-theme")).toBe("secondary");
    });

    it("overrides theme with error when fieldHasError is true", async () => {
      wrapper = await wrapperFactory({
        theme: "secondary",
        fieldHasError: true,
      });

      const wrapperDiv = wrapper.find(".input-checkbox-radio-wrapper");
      expect(wrapperDiv.attributes("data-theme")).toBe("error");
    });
  });

  describe("Value Handling", () => {
    it("handles string true/false values", async () => {
      const modelValue = ref("no");
      wrapper = await wrapperFactory({
        modelValue,
        trueValue: "yes",
        falseValue: "no",
      });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("false");
      expect(input.attributes("true-value")).toBe("yes");
      expect(input.attributes("false-value")).toBe("no");
    });

    it("handles numeric true/false values", async () => {
      const modelValue = ref(0);
      wrapper = await wrapperFactory({
        modelValue,
        trueValue: 1,
        falseValue: 0,
      });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("false");
      expect(input.attributes("true-value")).toBe("1");
      expect(input.attributes("false-value")).toBe("0");
    });

    it("handles boolean true/false values", async () => {
      const modelValue = ref(false);
      wrapper = await wrapperFactory({
        modelValue,
        trueValue: true,
        falseValue: false,
      });

      const input = wrapper.find("input");
      expect(input.attributes("aria-checked")).toBe("false");
    });
  });
});
