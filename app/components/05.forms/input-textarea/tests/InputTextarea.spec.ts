// https://nuxt.com/docs/getting-started/testing#unit-testing
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextarea.vue";

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

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
});

describe("InputTextarea", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a native textarea with the .input-textarea class", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("textarea.input-textarea").exists()).toBe(true);
  });

  it("binds v-model to the textarea value", async () => {
    wrapper = await wrapperFactory({ modelValue: "hello world" });
    expect(wrapper.find("textarea").element.value).toBe("hello world");

    await wrapper.find("textarea").setValue("line one\nline two");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["line one\nline two"]);
  });

  it("forwards placeholder", async () => {
    wrapper = await wrapperFactory({ placeholder: "Enter your message" });
    expect(wrapper.find("textarea").attributes("placeholder")).toBe("Enter your message");
  });

  it("forwards maxlength, defaulting to 255", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("textarea").attributes("maxlength")).toBe("255");

    await wrapper.setProps({ maxlength: 100 });
    expect(wrapper.find("textarea").attributes("maxlength")).toBe("100");
  });

  it("forwards readonly and autocomplete", async () => {
    wrapper = await wrapperFactory({ readonly: true, autocomplete: "street-address" });
    expect(wrapper.find("textarea").attributes("readonly")).toBeDefined();
    expect(wrapper.find("textarea").attributes("autocomplete")).toBe("street-address");
  });

  it("forwards aria-describedby, omitting it when empty", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("textarea").attributes("aria-describedby")).toBeUndefined();

    await wrapper.setProps({ ariaDescribedby: "some-description-id" });
    expect(wrapper.find("textarea").attributes("aria-describedby")).toBe("some-description-id");
  });

  it("sets data-theme and data-input-variant on the wrapper", async () => {
    wrapper = await wrapperFactory({ theme: "error", inputVariant: "underlined" });
    const root = wrapper.find(".input-textarea-wrapper");

    expect(root.attributes("data-theme")).toBe("error");
    expect(root.attributes("data-input-variant")).toBe("underlined");
  });

  it("defaults data-input-variant to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-textarea-wrapper").attributes("data-input-variant")).toBe("normal");
  });

  it("sets data-invalid and aria-invalid only when fieldHasError is true", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-textarea-wrapper").attributes("data-invalid")).toBeUndefined();
    expect(wrapper.find("textarea").attributes("aria-invalid")).toBeUndefined();

    await wrapper.setProps({ fieldHasError: true });
    expect(wrapper.find(".input-textarea-wrapper").attributes("data-invalid")).toBe("");
    expect(wrapper.find("textarea").attributes("aria-invalid")).toBe("true");
  });

  it("does not render the slot holders when the slots are not used", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-textarea-slot-left").exists()).toBe(false);
    expect(wrapper.find(".input-textarea-slot-right").exists()).toBe(false);
  });

  it("renders the left/right slots when provided", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<span data-testid="left-slot">📝</span>',
        right: '<span data-testid="right-slot">✨</span>',
      }
    );
    const root = wrapper.find(".input-textarea-wrapper");

    expect(wrapper.find(".input-textarea-slot-left [data-testid='left-slot']").exists()).toBe(true);
    expect(wrapper.find(".input-textarea-slot-right [data-testid='right-slot']").exists()).toBe(true);
    expect(root.attributes("data-has-left-slot")).toBe("");
    expect(root.attributes("data-has-right-slot")).toBe("");
  });

  it("applies styleClassPassthrough to the textarea and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-textarea-class"] });
    expect(wrapper.find("textarea").classes()).toContain("custom-textarea-class");

    await wrapper.setProps({ styleClassPassthrough: ["other-class"] });
    await nextTick();
    expect(wrapper.find("textarea").classes()).toContain("other-class");
    expect(wrapper.find("textarea").classes()).not.toContain("custom-textarea-class");
  });

  it("sets required attribute when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("textarea").attributes("required")).toBeDefined();
  });

  it("sets isActive on focus and blur, reflected as data-active", async () => {
    wrapper = await wrapperFactory({ isActive: false });
    const textarea = wrapper.find("textarea");

    await textarea.trigger("focusin");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([true]);

    await textarea.trigger("focusout");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([false]);

    await wrapper.setProps({ isActive: true, isDirty: true });
    expect(wrapper.find(".input-textarea-wrapper").attributes("data-active")).toBe("");
    expect(wrapper.find(".input-textarea-wrapper").attributes("data-dirty")).toBe("");
  });
});
