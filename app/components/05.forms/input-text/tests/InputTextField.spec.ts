// https://nuxt.com/docs/getting-started/testing#unit-testing
import { defineComponent, nextTick, ref } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextField.vue";

const initialPropsData = {
  type: "text" as const,
  name: "testName",
  label: "Test label",
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

describe("InputTextField", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders .input-text-field as the root", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.classes()).toContain("input-text-field");
  });

  it("renders the label text, linked to the input", async () => {
    wrapper = await wrapperFactory({ label: "Email address" });
    const label = wrapper.find("label");

    expect(label.text()).toContain("Email address");
    expect(label.attributes("for")).toBe(wrapper.find("input").attributes("id"));
  });

  it("does not leak label or error-message onto the control as attributes", async () => {
    wrapper = await wrapperFactory({ errorMessage: "Oops" });
    const control = wrapper.find(".input-text-wrapper");

    expect(control.attributes("label")).toBeUndefined();
    expect(control.attributes("error-message")).toBeUndefined();
  });

  it("forwards min/max through to the input (e.g. for type=date)", async () => {
    wrapper = await wrapperFactory({ type: "date", min: "2026-01-01", max: "2026-12-31" });
    const input = wrapper.find("input");

    expect(input.attributes("type")).toBe("date");
    expect(input.attributes("min")).toBe("2026-01-01");
    expect(input.attributes("max")).toBe("2026-12-31");
  });

  it("forwards readonly and autocomplete to the input", async () => {
    wrapper = await wrapperFactory({ readonly: true, autocomplete: "email" });
    expect(wrapper.find("input").attributes("readonly")).toBeDefined();
    expect(wrapper.find("input").attributes("autocomplete")).toBe("email");
  });

  it("sets data-invalid on the root and links the error via aria-describedby", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "Please enter an email" });

    expect(wrapper.attributes("data-invalid")).toBe("");
    expect(wrapper.text()).toContain("Please enter an email");
    expect(wrapper.find("input").attributes("aria-describedby")).toMatch(/-error-message$/);
  });

  it("marks the field dirty once it has a value", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.attributes("data-dirty")).toBeUndefined();

    await wrapper.setProps({ modelValue: "x" });
    await nextTick();
    expect(wrapper.attributes("data-dirty")).toBe("");
  });

  it("renders the description after the input for the outlined variant", async () => {
    wrapper = await wrapperFactory({ inputVariant: "outlined" }, { descriptionText: () => "Hint text" });
    const html = wrapper.html();
    expect(html.indexOf("Hint text")).toBeGreaterThan(html.indexOf("<input"));
  });

  it("applies styleClassPassthrough to its root only and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: "first-class" });
    expect(wrapper.classes()).toContain("first-class");
    expect(wrapper.find("input").classes()).not.toContain("first-class");

    await wrapper.setProps({ styleClassPassthrough: "second-class" });
    await nextTick();
    expect(wrapper.classes()).toContain("second-class");
    expect(wrapper.classes()).not.toContain("first-class");
  });

  it("points aria-describedby at the description once it appears after mount", async () => {
    const Host = defineComponent({
      components: { ComponentUnderTest },
      setup() {
        return { modelValue: ref(""), showDescription: ref(false) };
      },
      template: `
        <ComponentUnderTest v-model="modelValue" type="text" name="email" label="Email" error-message="">
          <template v-if="showDescription" #descriptionText>We never share it.</template>
        </ComponentUnderTest>
      `,
    });
    const host = await mountSuspended(Host);
    const input = () => host.find("input");
    expect(input().attributes("aria-describedby")).toBeFalsy();
    (host.vm as unknown as { showDescription: boolean }).showDescription = true;
    await nextTick();
    expect(input().attributes("aria-describedby")).toMatch(/-description$/);
    (host.vm as unknown as { showDescription: boolean }).showDescription = false;
    await nextTick();
    expect(input().attributes("aria-describedby")).toBeFalsy();
    host.unmount();
  });
});
