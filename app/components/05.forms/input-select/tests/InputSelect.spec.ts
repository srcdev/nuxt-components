// https://nuxt.com/docs/getting-started/testing#unit-testing
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputSelect.vue";

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

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
});

describe("InputSelect", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the native select with the .input-select class", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("select.input-select").exists()).toBe(true);
  });

  it("renders an option per fieldData item", async () => {
    wrapper = await wrapperFactory();
    const options = wrapper.findAll("option.input-select-option");
    expect(options.map((o) => o.text())).toEqual(["Red", "Blue"]);
  });

  it("binds v-model to the select value", async () => {
    wrapper = await wrapperFactory({ modelValue: "blue" });
    expect((wrapper.find("select").element as HTMLSelectElement).value).toBe("blue");
  });

  it("selects an option whose value is 0", async () => {
    wrapper = await wrapperFactory({
      placeholder: "Pick a number",
      modelValue: 0,
      fieldData: { ...initialFieldData, data: [{ id: "0", name: "zero", value: 0, label: "Zero" }] },
    });
    expect((wrapper.find("select").element as HTMLSelectElement).selectedOptions[0]?.textContent?.trim()).toBe("Zero");
  });

  it("renders a disabled placeholder option when placeholder is set", async () => {
    wrapper = await wrapperFactory({ placeholder: "Choose a colour", modelValue: "" });
    const placeholderOption = wrapper.find("option.input-select-option-placeholder");

    expect(placeholderOption.exists()).toBe(true);
    expect(placeholderOption.text()).toBe("Choose a colour");
    expect(placeholderOption.attributes("disabled")).toBeDefined();
    expect((placeholderOption.element as HTMLOptionElement).selected).toBe(true);
  });

  it("does not render a placeholder option when placeholder is unset", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("option.input-select-option-placeholder").exists()).toBe(false);
  });

  it("renders option labels as text, not markup", async () => {
    wrapper = await wrapperFactory({
      fieldData: { ...initialFieldData, data: [{ id: "1", name: "x", value: "x", label: "<b>bold</b>" }] },
    });
    expect(wrapper.find("option b").exists()).toBe(false);
    expect(wrapper.find("option").text()).toBe("<b>bold</b>");
  });

  it("sets required attribute when required is true", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("select").attributes("required")).toBeDefined();
  });

  it("does not set required attribute by default", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("select").attributes("required")).toBeUndefined();
  });

  it("forwards title, defaulting to the English copy", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("select").attributes("title")).toBe("Please select an option");

    await wrapper.setProps({ title: "Veuillez choisir" });
    expect(wrapper.find("select").attributes("title")).toBe("Veuillez choisir");
  });

  it("omits aria-describedby when empty and forwards it when set", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("select").attributes("aria-describedby")).toBeUndefined();

    await wrapper.setProps({ ariaDescribedby: "hint-id" });
    expect(wrapper.find("select").attributes("aria-describedby")).toBe("hint-id");
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

  it("omits data-invalid and aria-invalid by default", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-select-wrapper").attributes("data-invalid")).toBeUndefined();
    expect(wrapper.find("select").attributes("aria-invalid")).toBeUndefined();
  });

  it("defaults data-input-variant to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-select-wrapper").attributes("data-input-variant")).toBe("normal");
  });

  it("sets data-input-variant from inputVariant", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.find(".input-select-wrapper").attributes("data-input-variant")).toBe("underlined");
  });

  it("applies styleClassPassthrough to the select and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-select-class"] });
    expect(wrapper.find("select").classes()).toContain("custom-select-class");

    await wrapper.setProps({ styleClassPassthrough: ["other-class"] });
    await nextTick();
    expect(wrapper.find("select").classes()).toContain("other-class");
    expect(wrapper.find("select").classes()).not.toContain("custom-select-class");
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

  it("reflects isDirty and isActive as data attributes", async () => {
    wrapper = await wrapperFactory({ isDirty: true, isActive: true });
    const root = wrapper.find(".input-select-wrapper");
    expect(root.attributes("data-dirty")).toBe("");
    expect(root.attributes("data-active")).toBe("");
  });

  it("renders an icon for an option that has one, hidden from assistive tech", async () => {
    wrapper = await wrapperFactory({
      fieldData: {
        ...initialFieldData,
        data: [{ id: "1", name: "red", value: "red", label: "Red", icon: "mdi:circle" }],
      },
    });

    const icon = wrapper.find(".input-select-option-icon");
    expect(icon.exists()).toBe(true);
    expect(icon.attributes("aria-hidden")).toBe("true");
  });
});
