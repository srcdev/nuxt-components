import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { OptionsLayout, IFormMultipleOptions } from "~/types/forms/types.forms";
import MultipleRadiobuttons from "../MultipleRadiobuttons.vue";
import tagsData from "./data/tags.json";

const defaultProps = {
  modelValue: "",
  name: "tags",
  legend: "Choose a tag",
  errorMessage: "Please choose a tag",
  fieldData: tagsData as IFormMultipleOptions,
};

const createWrapper = (props = {}, slots = {}) =>
  mountSuspended(MultipleRadiobuttons, {
    attachTo: document.body,
    props: { ...defaultProps, ...props },
    slots,
  });

describe("MultipleRadiobuttons", () => {
  describe("rendering", () => {
    it("renders a radiogroup fieldset with the legend", async () => {
      const wrapper = await createWrapper();
      const fieldset = wrapper.find("fieldset");

      expect(fieldset.attributes("role")).toBe("radiogroup");
      expect(fieldset.text()).toContain("Choose a tag");
      expect(wrapper.attributes("data-testid")).toBe("multiple-radio-buttons");
    });

    it("renders one radio per data item", async () => {
      const wrapper = await createWrapper();

      expect(wrapper.findAll('input[type="radio"]')).toHaveLength(tagsData.data.length);
    });

    it("gives every radio the group name so they form one native group", async () => {
      const wrapper = await createWrapper({ name: "cuisine" });
      const names = wrapper.findAll('input[type="radio"]').map((radio) => radio.attributes("name"));

      expect(new Set(names)).toEqual(new Set(["cuisine"]));
    });

    it.each([false, true])("labels every radio with its item label (isButton: %s)", async (isButton) => {
      const wrapper = await createWrapper({ isButton });
      const radios = wrapper.findAll('input[type="radio"]');

      radios.forEach((radio, index) => {
        const label = wrapper.find(`label[for="${radio.attributes("id")}"]`);
        expect(label.text()).toContain(tagsData.data[index]!.label);
      });
    });

    it("applies styleClassPassthrough to the fieldset alongside its fixed class", async () => {
      const wrapper = await createWrapper({ styleClassPassthrough: ["custom-class"] });
      const classes = wrapper.find(".form-fieldset").classes();

      expect(classes).toContain("multiple-radiobuttons-fieldset");
      expect(classes).toContain("custom-class");
    });

    it("does not leak removed props as fieldset attributes", async () => {
      const wrapper = await createWrapper();
      const fieldset = wrapper.find("fieldset");

      expect(fieldset.attributes("placeholder")).toBeUndefined();
      expect(fieldset.attributes("equal-cols")).toBeUndefined();
    });
  });

  describe("options layout", () => {
    it("defaults to equal-widths", async () => {
      const wrapper = await createWrapper();

      expect(wrapper.find(".multiple-radiobuttons-items").attributes("data-options-layout")).toBe("equal-widths");
    });

    it.each(["inline", "block", "equal-widths"] as OptionsLayout[])(
      "renders data-options-layout=%s without a bare layout class",
      async (optionsLayout) => {
        const wrapper = await createWrapper({ optionsLayout });
        const items = wrapper.find(".multiple-radiobuttons-items");

        expect(items.attributes("data-options-layout")).toBe(optionsLayout);
        expect(items.classes()).toEqual(["multiple-radiobuttons-items"]);
      }
    );
  });

  describe("selection", () => {
    it.each([false, true])("keeps a single selection (isButton: %s)", async (isButton) => {
      const wrapper = await createWrapper({ isButton });
      const radios = wrapper.findAll('input[type="radio"]');

      await radios[0]!.trigger("click");
      expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual([tagsData.data[0]!.value]);

      await wrapper.setProps({ modelValue: tagsData.data[0]!.value });
      await radios[1]!.trigger("click");
      expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual([tagsData.data[1]!.value]);

      await wrapper.setProps({ modelValue: tagsData.data[1]!.value });
      expect((radios[0]!.element as HTMLInputElement).checked).toBe(false);
      expect((radios[1]!.element as HTMLInputElement).checked).toBe(true);
    });

    it("marks every radio required when required", async () => {
      const wrapper = await createWrapper({ required: true });

      for (const radio of wrapper.findAll('input[type="radio"]')) {
        expect(radio.attributes("required")).toBeDefined();
      }
    });
  });

  describe("description and error", () => {
    it("links the description through aria-describedby", async () => {
      const wrapper = await createWrapper({}, { descriptionText: "Pick the closest match" });
      const descriptionId = wrapper.find(".input-description").attributes("id");

      expect(descriptionId).toBeTruthy();
      expect(wrapper.find('input[type="radio"]').attributes("aria-describedby")).toContain(descriptionId);
    });

    it("renders no description element without a description slot", async () => {
      const wrapper = await createWrapper();

      expect(wrapper.find(".input-description").exists()).toBe(false);
    });

    it("shows the error message and links it when the field has an error", async () => {
      const wrapper = await createWrapper({ fieldHasError: true });
      const radio = wrapper.find('input[type="radio"]');

      expect(wrapper.text()).toContain("Please choose a tag");
      expect(radio.attributes("aria-describedby")).toContain("error");
    });
  });
});
