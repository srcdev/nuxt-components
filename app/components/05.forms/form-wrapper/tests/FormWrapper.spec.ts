import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import FormWrapper from "../FormWrapper.vue";

describe("FormWrapper", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(FormWrapper);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders default slot content", async () => {
    const wrapper = await mountSuspended(FormWrapper, {
      slots: { default: () => "Form goes here" },
    });
    expect(wrapper.find(".form-wrapper").text()).toBe("Form goes here");
  });

  it("defaults to narrow width", async () => {
    const wrapper = await mountSuspended(FormWrapper);
    expect(wrapper.find(".form-wrapper").attributes("data-width")).toBe("narrow");
  });

  it.each(["narrow", "medium", "wide"] as const)("reflects width=%s on data-width", async (width) => {
    const wrapper = await mountSuspended(FormWrapper, { props: { width } });
    expect(wrapper.find(".form-wrapper").attributes("data-width")).toBe(width);
  });

  it("does not use a bare width modifier class", async () => {
    const wrapper = await mountSuspended(FormWrapper, { props: { width: "medium" } });
    expect(wrapper.find(".form-wrapper").classes()).not.toContain("medium");
  });

  it("updates data-width when the prop changes", async () => {
    const wrapper = await mountSuspended(FormWrapper);
    await wrapper.setProps({ width: "wide" });
    expect(wrapper.find(".form-wrapper").attributes("data-width")).toBe("wide");
  });

  it("applies styleClassPassthrough as a string", async () => {
    const wrapper = await mountSuspended(FormWrapper, { props: { styleClassPassthrough: "extra-a extra-b" } });
    const classes = wrapper.find(".form-wrapper").classes();
    expect(classes).toContain("extra-a");
    expect(classes).toContain("extra-b");
  });

  it("applies styleClassPassthrough as an array and updates on change", async () => {
    const wrapper = await mountSuspended(FormWrapper, { props: { styleClassPassthrough: ["one"] } });
    expect(wrapper.find(".form-wrapper").classes()).toContain("one");

    await wrapper.setProps({ styleClassPassthrough: ["two"] });
    await nextTick();
    const classes = wrapper.find(".form-wrapper").classes();
    expect(classes).toContain("two");
    expect(classes).not.toContain("one");
  });
});
