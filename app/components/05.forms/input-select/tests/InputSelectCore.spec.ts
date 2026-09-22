// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputSelectCore.vue";

const initialFieldData = {
  data: [
    { id: "1", name: "red", value: "red", label: "Red" },
    { id: "2", name: "blue", value: "blue", label: "Blue" },
  ],
  total: 2,
  skip: 0,
  limit: 10,
};

const initialPropsData = {
  id: "test-select",
  name: "testName",
  modelValue: "red",
  fieldData: initialFieldData,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
  });
};

describe("InputSelectCore", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders an option per fieldData item", async () => {
    wrapper = await wrapperFactory();
    const options = wrapper.findAll("option");
    expect(options.map((o) => o.text())).toEqual(["Red", "Blue"]);
  });

  it("binds v-model to the select value", async () => {
    wrapper = await wrapperFactory({ modelValue: "blue" });
    expect(wrapper.find("select").element.value).toBe("blue");
  });

  it("renders a disabled placeholder option when placeholder is set", async () => {
    wrapper = await wrapperFactory({ placeholder: "Choose a colour", modelValue: "" });
    const placeholderOption = wrapper.find("option.placeholder");

    expect(placeholderOption.exists()).toBe(true);
    expect(placeholderOption.text()).toBe("Choose a colour");
    expect(placeholderOption.attributes("disabled")).toBeDefined();
  });

  it("does not render a placeholder option when placeholder is unset", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("option.placeholder").exists()).toBe(false);
  });

  it("sets required attribute when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("select").attributes("required")).toBeDefined();
  });

  it("does not set required attribute by default", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("select").attributes("required")).toBeUndefined();
  });

  it("sets data-theme from the theme prop", async () => {
    wrapper = await wrapperFactory({ theme: "error" });
    expect(wrapper.find(".input-select-wrapper").attributes("data-theme")).toBe("error");
  });

  it("sets data-invalid and aria-invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.find(".input-select-wrapper").attributes("data-invalid")).toBe("");
    expect(wrapper.find("select").attributes("aria-invalid")).toBe("true");
  });

  it("defaults inputVariant to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-select-wrapper").classes()).toContain("normal");
  });

  it("applies inputVariant as a class on the wrapper", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.find(".input-select-wrapper").classes()).toContain("underlined");
  });

  it("applies styleClassPassthrough to the select", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-select-class"] });
    expect(wrapper.find("select").classes()).toContain("custom-select-class");
  });

  it("sets isActive true on focus and false on blur", async () => {
    wrapper = await wrapperFactory();
    const select = wrapper.find("select");

    await select.trigger("focusin");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([true]);

    await select.trigger("focusout");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([false]);
  });

  it("sets isDirty true when the value changes", async () => {
    wrapper = await wrapperFactory();
    await wrapper.find("select").trigger("change");
    expect(wrapper.emitted("update:isDirty")?.at(-1)).toEqual([true]);
  });

  it("renders an icon for an option that has one, hidden from assistive tech", async () => {
    wrapper = await wrapperFactory({
      fieldData: {
        ...initialFieldData,
        data: [{ id: "1", name: "red", value: "red", label: "Red", icon: "mdi:circle" }],
      },
    });

    const icon = wrapper.find(".input-select-core-option-decorator-icon");
    expect(icon.exists()).toBe(true);
    expect(icon.attributes("aria-hidden")).toBe("true");
  });
});
