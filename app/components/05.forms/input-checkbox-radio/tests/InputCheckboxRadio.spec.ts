import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputCheckboxRadio from "../InputCheckboxRadio.vue";

const defaultProps = {
  type: "checkbox" as const,
  id: "test-checkbox",
  name: "testName",
  trueValue: "checked",
  falseValue: "unchecked",
  modelValue: "unchecked",
};

const createWrapper = (props = {}, slots = {}) =>
  mountSuspended(InputCheckboxRadio, {
    attachTo: document.body,
    props: { ...defaultProps, ...props },
    slots,
  });

const inputOf = (wrapper: Awaited<ReturnType<typeof createWrapper>>) => wrapper.find("input").element as HTMLInputElement;

describe("InputCheckboxRadio", () => {
  describe("rendering", () => {
    it("renders the native input with id, name and type", async () => {
      const wrapper = await createWrapper();
      const input = wrapper.find("input");

      expect(input.attributes("type")).toBe("checkbox");
      expect(input.attributes("id")).toBe("test-checkbox");
      expect(input.attributes("name")).toBe("testName");
      expect(input.classes()).toEqual(["input-checkbox-radio-input"]);
    });

    it("renders state as data attributes, not bare classes", async () => {
      const wrapper = await createWrapper({ type: "radio", inputVariant: "underlined", theme: "success" });
      const root = wrapper.find(".input-checkbox-radio");

      expect(root.classes()).toEqual(["input-checkbox-radio"]);
      expect(root.attributes("data-type")).toBe("radio");
      expect(root.attributes("data-input-variant")).toBe("underlined");
      expect(root.attributes("data-theme")).toBe("success");
      expect(root.attributes("data-button")).toBeUndefined();
      expect(root.attributes("data-display-as-disc")).toBeUndefined();
      expect(root.attributes("data-invalid")).toBeUndefined();
    });

    it("renders data-button and data-display-as-disc when set", async () => {
      const wrapper = await createWrapper({ isButton: true, displayAsDisc: true });
      const root = wrapper.find(".input-checkbox-radio");

      expect(root.attributes("data-button")).toBe("");
      expect(root.attributes("data-display-as-disc")).toBe("");
    });

    it("applies and updates styleClassPassthrough", async () => {
      const wrapper = await createWrapper({ styleClassPassthrough: "first" });
      expect(wrapper.find(".input-checkbox-radio").classes()).toContain("first");

      await wrapper.setProps({ styleClassPassthrough: "second" });
      const classes = wrapper.find(".input-checkbox-radio").classes();
      expect(classes).toContain("second");
      expect(classes).not.toContain("first");
    });
  });

  describe("icons", () => {
    it("renders a default icon in the icon slot", async () => {
      const wrapper = await createWrapper();

      expect(wrapper.find(".input-checkbox-radio-icon-slot .input-checkbox-radio-icon").exists()).toBe(true);
    });

    it("replaces the default icon with the checkedIcon slot", async () => {
      const wrapper = await createWrapper({}, { checkedIcon: `<span class="custom-check">✓</span>` });
      const slot = wrapper.find(".input-checkbox-radio-icon-slot");

      expect(slot.find(".custom-check").exists()).toBe(true);
      expect(slot.find(".input-checkbox-radio-icon").exists()).toBe(false);
    });
  });

  describe("checked state", () => {
    it("reflects a single checkbox value", async () => {
      const wrapper = await createWrapper({ modelValue: "unchecked" });
      expect(inputOf(wrapper).checked).toBe(false);

      await wrapper.setProps({ modelValue: "checked" });
      expect(inputOf(wrapper).checked).toBe(true);
    });

    it("reflects membership of an array model", async () => {
      const wrapper = await createWrapper({ trueValue: "option1", multipleOptions: true, modelValue: [] });
      expect(inputOf(wrapper).checked).toBe(false);

      await wrapper.setProps({ modelValue: ["option1"] });
      expect(inputOf(wrapper).checked).toBe(true);
    });

    it("reflects a radio value", async () => {
      const wrapper = await createWrapper({ type: "radio", trueValue: "option1", modelValue: "" });
      expect(inputOf(wrapper).checked).toBe(false);

      await wrapper.setProps({ modelValue: "option1" });
      expect(inputOf(wrapper).checked).toBe(true);
    });

    it("emits the true and false values when toggled", async () => {
      const wrapper = await createWrapper({ modelValue: "unchecked" });
      const input = wrapper.find("input");

      await input.setValue(true);
      expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["checked"]);

      await input.setValue(false);
      expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["unchecked"]);
    });

    it("toggles its value in an array model", async () => {
      const wrapper = await createWrapper({ trueValue: "b", multipleOptions: true, modelValue: ["a"] });

      await wrapper.find("input").setValue(true);
      expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual([["a", "b"]]);
    });

    it("uses the radio model handler after type switches from checkbox to radio", async () => {
      const wrapper = await createWrapper({ modelValue: ["other"], multipleOptions: true, trueValue: "picked" });
      await wrapper.setProps({ type: "radio", modelValue: "" });

      const input = wrapper.find("input");
      expect(input.attributes("type")).toBe("radio");

      inputOf(wrapper).checked = true;
      await input.trigger("change");

      expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["picked"]);
    });
  });

  describe("accessibility", () => {
    it("does not set aria-checked on the native input", async () => {
      const wrapper = await createWrapper({ modelValue: "checked" });

      expect(wrapper.find("input").attributes("aria-checked")).toBeUndefined();
    });

    it("sets aria-describedby only when given", async () => {
      const without = await createWrapper();
      expect(without.find("input").attributes("aria-describedby")).toBeUndefined();

      const withId = await createWrapper({ ariaDescribedby: "description-id" });
      expect(withId.find("input").attributes("aria-describedby")).toBe("description-id");
    });

    it("sets aria-invalid and data-invalid when the field has an error", async () => {
      const wrapper = await createWrapper({ fieldHasError: true });

      expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
      expect(wrapper.find(".input-checkbox-radio").attributes("data-invalid")).toBe("");
    });

    it("sets native required", async () => {
      const wrapper = await createWrapper({ required: true });

      expect(wrapper.find("input").attributes("required")).toBeDefined();
    });

    it("drops native required in a multiple-options group", async () => {
      const wrapper = await createWrapper({ required: true, multipleOptions: true, modelValue: [] });

      expect(wrapper.find("input").attributes("required")).toBeUndefined();
    });
  });
});
