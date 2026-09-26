import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import FormField from "../FormField.vue";

describe("FormField", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(FormField);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders default slot content inside the inner wrapper", async () => {
    const wrapper = await mountSuspended(FormField, {
      slots: { default: () => "Field content" },
    });
    expect(wrapper.find(".form-field .form-field-inner").text()).toBe("Field content");
  });

  it("defaults to narrow width with a gutter and no error state", async () => {
    const wrapper = await mountSuspended(FormField);
    const root = wrapper.find(".form-field");
    expect(root.attributes("data-width")).toBe("narrow");
    expect(root.attributes("data-has-gutter")).toBe("");
    expect(root.attributes("data-invalid")).toBeUndefined();
  });

  it.each(["narrow", "medium", "wide"] as const)("reflects width=%s on data-width", async (width) => {
    const wrapper = await mountSuspended(FormField, { props: { width } });
    expect(wrapper.find(".form-field").attributes("data-width")).toBe(width);
  });

  it("does not use bare width/gutter modifier classes", async () => {
    const wrapper = await mountSuspended(FormField, { props: { width: "wide" } });
    const classes = wrapper.find(".form-field").classes();
    expect(classes).not.toContain("wide");
    expect(classes).not.toContain("has-gutter");
  });

  it("removes data-has-gutter when hasGutter is false", async () => {
    const wrapper = await mountSuspended(FormField, { props: { hasGutter: false } });
    expect(wrapper.find(".form-field").attributes("data-has-gutter")).toBeUndefined();
  });

  it("sets data-invalid when fieldHasError is true", async () => {
    const wrapper = await mountSuspended(FormField, { props: { fieldHasError: true } });
    expect(wrapper.find(".form-field").attributes("data-invalid")).toBe("");
  });

  it("reacts to prop changes", async () => {
    const wrapper = await mountSuspended(FormField);
    await wrapper.setProps({ width: "medium", hasGutter: false, fieldHasError: true });
    const root = wrapper.find(".form-field");
    expect(root.attributes("data-width")).toBe("medium");
    expect(root.attributes("data-has-gutter")).toBeUndefined();
    expect(root.attributes("data-invalid")).toBe("");
  });

  it("applies styleClassPassthrough as a string", async () => {
    const wrapper = await mountSuspended(FormField, { props: { styleClassPassthrough: "extra-a extra-b" } });
    const classes = wrapper.find(".form-field").classes();
    expect(classes).toContain("extra-a");
    expect(classes).toContain("extra-b");
  });

  it("applies styleClassPassthrough as an array and updates on change", async () => {
    const wrapper = await mountSuspended(FormField, { props: { styleClassPassthrough: ["one"] } });
    expect(wrapper.find(".form-field").classes()).toContain("one");

    await wrapper.setProps({ styleClassPassthrough: ["two"] });
    await nextTick();
    const classes = wrapper.find(".form-field").classes();
    expect(classes).toContain("two");
    expect(classes).not.toContain("one");
  });
});
