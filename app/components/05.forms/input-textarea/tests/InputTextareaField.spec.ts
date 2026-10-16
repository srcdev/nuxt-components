// https://nuxt.com/docs/getting-started/testing#unit-testing
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextareaField.vue";

const initialPropsData = {
  name: "message",
  label: "Message",
  errorMessage: "",
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

describe("InputTextareaField", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders .input-textarea-field as the root", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.classes()).toContain("input-textarea-field");
  });

  it("renders the label text, linked to the textarea", async () => {
    wrapper = await wrapperFactory({ label: "Feedback" });
    const label = wrapper.find("label");

    expect(label.text()).toContain("Feedback");
    expect(label.attributes("for")).toBe(wrapper.find("textarea").attributes("id"));
  });

  it("does not leak label or error-message onto the control's wrapper", async () => {
    wrapper = await wrapperFactory({ label: "Feedback", errorMessage: "Oops" });
    const control = wrapper.find(".input-textarea-wrapper");

    expect(control.attributes("label")).toBeUndefined();
    expect(control.attributes("error-message")).toBeUndefined();
  });

  it("sets data-invalid on the root and links the error via aria-describedby", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "This field is required" });

    expect(wrapper.attributes("data-invalid")).toBe("");
    expect(wrapper.text()).toContain("This field is required");
    expect(wrapper.find("textarea").attributes("aria-describedby")).toMatch(/-error-message$/);
  });

  it("renders the descriptionText slot before the textarea by default", async () => {
    wrapper = await wrapperFactory({}, { descriptionText: () => "Please provide more detail" });
    const html = wrapper.html();

    expect(wrapper.text()).toContain("Please provide more detail");
    expect(html.indexOf("Please provide more detail")).toBeLessThan(html.indexOf("<textarea"));
  });

  it("renders the description after the textarea for the outlined variant", async () => {
    wrapper = await wrapperFactory({ inputVariant: "outlined" }, { descriptionText: () => "Hint text" });
    const html = wrapper.html();
    expect(html.indexOf("Hint text")).toBeGreaterThan(html.indexOf("<textarea"));
  });

  it("renders the left/right slots when provided", async () => {
    wrapper = await wrapperFactory(
      {},
      {
        left: '<span data-testid="left-slot">📝</span>',
        right: '<span data-testid="right-slot">✨</span>',
      }
    );

    expect(wrapper.find('[data-testid="left-slot"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="right-slot"]').exists()).toBe(true);
  });

  it("marks the field dirty once the value is non-empty", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.attributes("data-dirty")).toBeUndefined();

    await wrapper.setProps({ modelValue: "hello" });
    await nextTick();
    expect(wrapper.attributes("data-dirty")).toBe("");
  });

  it("sets data-input-variant on the root", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.attributes("data-input-variant")).toBe("underlined");
  });

  it("forwards readonly and autocomplete", async () => {
    wrapper = await wrapperFactory({ readonly: true, autocomplete: "off" });
    expect(wrapper.find("textarea").attributes("readonly")).toBeDefined();
    expect(wrapper.find("textarea").attributes("autocomplete")).toBe("off");
  });

  it("applies styleClassPassthrough to its root only and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: "custom-textarea" });
    expect(wrapper.classes()).toContain("custom-textarea");
    expect(wrapper.find("textarea").classes()).not.toContain("custom-textarea");

    await wrapper.setProps({ styleClassPassthrough: "other-textarea" });
    await nextTick();
    expect(wrapper.classes()).toContain("other-textarea");
    expect(wrapper.classes()).not.toContain("custom-textarea");
  });
});
