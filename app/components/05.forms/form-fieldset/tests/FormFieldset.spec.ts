import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import FormFieldset from "../FormFieldset.vue";

const baseProps = { id: "interests", name: "interests" };

describe("FormFieldset", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(FormFieldset, { props: baseProps });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a fieldset with id, name and data-testid", async () => {
    const wrapper = await mountSuspended(FormFieldset, {
      props: { ...baseProps, dataTestid: "fieldset-test" },
    });
    const fieldset = wrapper.find("fieldset.form-fieldset");
    expect(fieldset.exists()).toBe(true);
    expect(fieldset.attributes("id")).toBe("interests");
    expect(fieldset.attributes("name")).toBe("interests");
    expect(fieldset.attributes("data-testid")).toBe("fieldset-test");
  });

  it("renders the content slot", async () => {
    const wrapper = await mountSuspended(FormFieldset, {
      props: baseProps,
      slots: { content: () => "Controls here" },
    });
    expect(wrapper.find(".form-fieldset-content").text()).toBe("Controls here");
  });

  describe("legend", () => {
    it("renders the legend prop", async () => {
      const wrapper = await mountSuspended(FormFieldset, { props: { ...baseProps, legend: "Interests" } });
      expect(wrapper.find("legend.form-fieldset-legend").text()).toBe("Interests");
    });

    it("omits the legend when neither prop nor slot is given", async () => {
      const wrapper = await mountSuspended(FormFieldset, { props: baseProps });
      expect(wrapper.find("legend").exists()).toBe(false);
    });

    it("renders the legend slot even without a legend prop", async () => {
      const wrapper = await mountSuspended(FormFieldset, {
        props: baseProps,
        slots: { legend: () => "Slotted legend" },
      });
      expect(wrapper.find("legend").text()).toBe("Slotted legend");
    });
  });

  describe("group role", () => {
    it("uses the native group role by default, with no aria-required", async () => {
      const wrapper = await mountSuspended(FormFieldset, { props: { ...baseProps, required: true } });
      const fieldset = wrapper.find("fieldset");
      expect(fieldset.attributes("role")).toBeUndefined();
      expect(fieldset.attributes("aria-required")).toBeUndefined();
    });

    it("sets role=radiogroup when groupRole is radiogroup", async () => {
      const wrapper = await mountSuspended(FormFieldset, { props: { ...baseProps, groupRole: "radiogroup" } });
      const fieldset = wrapper.find("fieldset");
      expect(fieldset.attributes("role")).toBe("radiogroup");
      expect(fieldset.attributes("aria-required")).toBeUndefined();
    });

    it("sets aria-required on a required radiogroup", async () => {
      const wrapper = await mountSuspended(FormFieldset, {
        props: { ...baseProps, groupRole: "radiogroup", required: true },
      });
      expect(wrapper.find("fieldset").attributes("aria-required")).toBe("true");
    });
  });

  describe("error state", () => {
    it("sets aria-invalid from fieldHasError", async () => {
      const wrapper = await mountSuspended(FormFieldset, { props: { ...baseProps, fieldHasError: true } });
      expect(wrapper.find("fieldset").attributes("aria-invalid")).toBe("true");
    });

    it("does not add a bare error class", async () => {
      const wrapper = await mountSuspended(FormFieldset, { props: { ...baseProps, fieldHasError: true } });
      expect(wrapper.find("fieldset").classes()).not.toContain("error");
    });
  });

  describe("styleClassPassthrough", () => {
    it("applies string classes", async () => {
      const wrapper = await mountSuspended(FormFieldset, {
        props: { ...baseProps, styleClassPassthrough: "one two" },
      });
      const classes = wrapper.find("fieldset").classes();
      expect(classes).toContain("one");
      expect(classes).toContain("two");
    });

    it("applies array classes and updates on change", async () => {
      const wrapper = await mountSuspended(FormFieldset, {
        props: { ...baseProps, styleClassPassthrough: ["one"] },
      });
      expect(wrapper.find("fieldset").classes()).toContain("one");

      await wrapper.setProps({ styleClassPassthrough: ["two"] });
      await nextTick();
      const classes = wrapper.find("fieldset").classes();
      expect(classes).toContain("two");
      expect(classes).not.toContain("one");
    });
  });
});
