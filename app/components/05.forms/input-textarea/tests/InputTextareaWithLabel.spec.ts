// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextareaWithLabel.vue";

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

describe("InputTextareaWithLabel", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the label text", async () => {
    wrapper = await wrapperFactory({ label: "Feedback" });
    expect(wrapper.text()).toContain("Feedback");
  });

  it("renders a native textarea", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("does not leak a label attribute onto InputTextareaCore's wrapper", async () => {
    // Regression test: InputTextareaCore has no `label` prop (matches InputTextCore), so passing
    // it down would fall through as a meaningless raw `label` HTML attribute on the wrapper div.
    wrapper = await wrapperFactory({ label: "Feedback" });
    expect(wrapper.find(".input-textarea-wrapper").attributes("label")).toBeUndefined();
  });

  it("sets data-invalid and the error class when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.find(".input-textarea-with-label").attributes("data-invalid")).toBe("");
  });

  it("renders the error message when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "This field is required" });
    expect(wrapper.text()).toContain("This field is required");
  });

  it("renders the descriptionText slot", async () => {
    wrapper = await wrapperFactory(
      {},
      { descriptionText: () => "Please provide more detail" }
    );
    expect(wrapper.text()).toContain("Please provide more detail");
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

  it("sets isDirty true once the value becomes non-empty", async () => {
    wrapper = await wrapperFactory({ modelValue: "hello" });
    const vm = wrapper.vm as unknown as { isDirty: boolean };
    expect(vm.isDirty).toBe(true);
  });

  it("applies inputVariant as a class on the wrapper", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.find(".input-textarea-with-label").classes()).toContain("underlined");
  });

  it("applies styleClassPassthrough", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: "custom-textarea" });
    expect(wrapper.find(".input-textarea-with-label").classes()).toContain("custom-textarea");
  });
});
