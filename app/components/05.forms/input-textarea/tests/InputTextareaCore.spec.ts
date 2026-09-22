// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextareaCore.vue";

const initialPropsData = {
  id: "test-textarea",
  name: "testName",
  modelValue: "",
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slots = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
    slots,
  });
};

describe("InputTextareaCore", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a native textarea", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("binds v-model to the textarea value", async () => {
    wrapper = await wrapperFactory({ modelValue: "hello world" });
    expect(wrapper.find("textarea").element.value).toBe("hello world");
  });

  it("forwards placeholder", async () => {
    wrapper = await wrapperFactory({ placeholder: "Enter your message" });
    expect(wrapper.find("textarea").attributes("placeholder")).toBe("Enter your message");
  });

  it("forwards maxlength, defaulting to 255", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("textarea").attributes("maxlength")).toBe("255");

    wrapper = await wrapperFactory({ maxlength: 100 });
    expect(wrapper.find("textarea").attributes("maxlength")).toBe("100");
  });

  it("forwards aria-describedby", async () => {
    wrapper = await wrapperFactory({ ariaDescribedby: "some-description-id" });
    expect(wrapper.find("textarea").attributes("aria-describedby")).toBe("some-description-id");
  });

  it("sets data-theme from the theme prop", async () => {
    wrapper = await wrapperFactory({ theme: "error" });
    expect(wrapper.find(".input-textarea-wrapper").attributes("data-theme")).toBe("error");
  });

  it("sets data-invalid and aria-invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.find(".input-textarea-wrapper").attributes("data-invalid")).toBe("");
    expect(wrapper.find("textarea").attributes("aria-invalid")).toBe("true");
  });

  it("defaults inputVariant to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-textarea-wrapper").classes()).toContain("normal");
  });

  it("applies inputVariant as a class on the wrapper", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.find(".input-textarea-wrapper").classes()).toContain("underlined");
  });

  it("does not render the left/right slot wrappers when the slots are not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".slot.left-slot").exists()).toBe(false);
    expect(wrapper.find(".slot.right-slot").exists()).toBe(false);
  });

  it("renders the left/right slots when provided", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<span data-testid="left-slot">📝</span>',
        right: '<span data-testid="right-slot">✨</span>',
      }
    );

    expect(wrapper.find(".slot.left-slot [data-testid='left-slot']").exists()).toBe(true);
    expect(wrapper.find(".slot.right-slot [data-testid='right-slot']").exists()).toBe(true);
    expect(wrapper.find(".input-textarea-wrapper").classes()).toContain("has-left-slot");
    expect(wrapper.find(".input-textarea-wrapper").classes()).toContain("has-right-slot");
  });

  it("applies styleClassPassthrough to the textarea", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-textarea-class"] });
    expect(wrapper.find("textarea").classes()).toContain("custom-textarea-class");
  });

  it("sets required attribute when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("textarea").attributes("required")).toBeDefined();
  });

  it("sets isActive true on focus and false on blur", async () => {
    wrapper = await wrapperFactory();
    const textarea = wrapper.find("textarea");

    await textarea.trigger("focusin");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([true]);

    await textarea.trigger("focusout");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([false]);
  });
});
