// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../ToggleSwitchWithLabel.vue";
import { defineComponent, nextTick, ref } from "vue";

const initialPropsData = {
  name: "notifications",
  label: "Enable notifications",
  errorMessage: "",
  modelValue: false,
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

describe("ToggleSwitchWithLabel", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the label text", async () => {
    wrapper = await wrapperFactory({ label: "Enable dark mode" });
    expect(wrapper.text()).toContain("Enable dark mode");
  });

  it("renders a checkbox input", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
  });

  it("associates the label with the checkbox via matching for/id", async () => {
    wrapper = await wrapperFactory();
    const inputId = wrapper.find("input[type='checkbox']").attributes("id");
    expect(wrapper.find("label").attributes("for")).toBe(inputId);
  });

  it("renders the error message when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "You must accept" });
    expect(wrapper.text()).toContain("You must accept");
  });

  it("renders descriptionText through InputDescription", async () => {
    wrapper = await wrapperFactory({}, { descriptionText: () => "Turn this on to receive notifications" });
    const description = wrapper.find(".input-description.toggle-switch-description");
    expect(description.exists()).toBe(true);
    expect(description.find(".input-description-text").text()).toBe("Turn this on to receive notifications");
  });

  it("renders descriptionHtml through InputDescription", async () => {
    wrapper = await wrapperFactory({}, { descriptionHtml: () => "Rich description" });
    expect(wrapper.find(".toggle-switch-description .input-description-html").text()).toBe("Rich description");
  });

  it("renders no description element without a description slot", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-description").exists()).toBe(false);
  });

  it("no longer renders the removed description slot", async () => {
    wrapper = await wrapperFactory({}, { description: () => "Old slot content" });
    expect(wrapper.text()).not.toContain("Old slot content");
  });

  it("forwards required to the underlying input", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });

  it("applies the error theme to ToggleSwitchCore when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, theme: "default" });
    expect(wrapper.find(".toggle-switch-core").attributes("data-theme")).toBe("error");
  });

  it("applies styleClassPassthrough to the root element", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-toggle"] });
    expect(wrapper.find(".toggle-switch-with-label").classes()).toContain("custom-toggle");
  });

  it("forwards round to ToggleSwitchCore without leaking it as a DOM attribute", async () => {
    wrapper = await wrapperFactory({ round: false });
    const core = wrapper.findComponent({ name: "ToggleSwitchCore" });
    expect(core.props("round")).toBe(false);
    expect(wrapper.find(".toggle-switch-core").attributes("round")).toBeUndefined();
  });

  it("points aria-describedby at the description once it appears after mount", async () => {
    const Host = defineComponent({
      components: { ComponentUnderTest },
      setup() {
        return { modelValue: ref(false), showDescription: ref(false) };
      },
      template: `
        <ComponentUnderTest v-model="modelValue" name="notifications" label="Enable notifications" error-message="">
          <template v-if="showDescription" #descriptionText>Sends at most one email a week.</template>
        </ComponentUnderTest>
      `,
    });
    const host = await mountSuspended(Host);
    const input = () => host.find("input[type='checkbox']");
    expect(input().attributes("aria-describedby")).toBeFalsy();
    (host.vm as unknown as { showDescription: boolean }).showDescription = true;
    await nextTick();
    expect(input().attributes("aria-describedby")).toMatch(/-description$/);
  });

  it("points aria-describedby at the error message when the field has an error", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "Required" });
    expect(wrapper.find("input[type='checkbox']").attributes("aria-describedby")).toMatch(/-error-message$/);
  });

  it("points aria-describedby at both the description and the error when both are present", async () => {
    wrapper = await wrapperFactory(
      { fieldHasError: true, errorMessage: "Required" },
      { descriptionText: () => "Sends at most one email a week." }
    );
    const describedBy = wrapper.find("input[type='checkbox']").attributes("aria-describedby") ?? "";
    const ids = describedBy.split(" ");
    expect(ids).toHaveLength(2);
    expect(ids[0]).toMatch(/-description$/);
    expect(ids[1]).toMatch(/-error-message$/);
    expect(wrapper.find(`[id="${ids[0]}"]`).exists()).toBe(true);
  });
});
