// https://nuxt.com/docs/getting-started/testing#unit-testing
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputText.vue";

const initialPropsData = {
  id: "test-input",
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

const beforeInput = (data: string | null) => new InputEvent("beforeinput", { data, cancelable: true, inputType: "insertText" });

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
});

describe("InputText", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the native input with the .input-text class", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input.input-text").exists()).toBe(true);
  });

  it("binds v-model to the input value", async () => {
    wrapper = await wrapperFactory({ modelValue: "hello" });
    expect((wrapper.find("input").element as HTMLInputElement).value).toBe("hello");

    await wrapper.find("input").setValue("changed");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["changed"]);
  });

  it("does not set min/max attributes when not provided", async () => {
    wrapper = await wrapperFactory();
    const input = wrapper.find("input");

    expect(input.attributes("min")).toBeUndefined();
    expect(input.attributes("max")).toBeUndefined();
  });

  it("passes through a string min/max (e.g. for type=date)", async () => {
    wrapper = await wrapperFactory({ type: "date", min: "2026-01-01", max: "2026-12-31" });
    const input = wrapper.find("input");

    expect(input.attributes("type")).toBe("date");
    expect(input.attributes("min")).toBe("2026-01-01");
    expect(input.attributes("max")).toBe("2026-12-31");
  });

  it("passes through a numeric min/max (e.g. for type=number)", async () => {
    wrapper = await wrapperFactory({ type: "number", min: 0, max: 100 });
    const input = wrapper.find("input");

    expect(input.attributes("min")).toBe("0");
    expect(input.attributes("max")).toBe("100");
  });

  it("forwards readonly and autocomplete to the input", async () => {
    wrapper = await wrapperFactory({ readonly: true, autocomplete: "email" });
    const input = wrapper.find("input");

    expect(input.attributes("readonly")).toBeDefined();
    expect(input.attributes("autocomplete")).toBe("email");
    expect(wrapper.find(".input-text-wrapper").attributes("data-readonly")).toBe("");
  });

  it("omits readonly, autocomplete and aria-describedby by default", async () => {
    wrapper = await wrapperFactory();
    const input = wrapper.find("input");

    expect(input.attributes("readonly")).toBeUndefined();
    expect(input.attributes("autocomplete")).toBeUndefined();
    expect(input.attributes("aria-describedby")).toBeUndefined();
  });

  it("sets data-input-variant, data-theme and data-invalid on the wrapper", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined", theme: "warning", fieldHasError: true });
    const root = wrapper.find(".input-text-wrapper");

    expect(root.attributes("data-input-variant")).toBe("underlined");
    expect(root.attributes("data-theme")).toBe("warning");
    expect(root.attributes("data-invalid")).toBe("");
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });

  it("renders slot holders and data-has-*-slot only for filled slots", async () => {
    wrapper = await wrapperFactory({}, { left: () => "L" });
    const root = wrapper.find(".input-text-wrapper");

    expect(wrapper.find(".input-text-slot-left").text()).toBe("L");
    expect(wrapper.find(".input-text-slot-right").exists()).toBe(false);
    expect(root.attributes("data-has-left-slot")).toBe("");
    expect(root.attributes("data-has-right-slot")).toBeUndefined();
  });

  it("sets isActive on focus and blur, reflected as data-active", async () => {
    wrapper = await wrapperFactory({ isActive: false });
    const input = wrapper.find("input");

    await input.trigger("focusin");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([true]);

    await input.trigger("focusout");
    expect(wrapper.emitted("update:isActive")?.at(-1)).toEqual([false]);

    await wrapper.setProps({ isActive: true, isDirty: true });
    const root = wrapper.find(".input-text-wrapper");
    expect(root.attributes("data-active")).toBe("");
    expect(root.attributes("data-dirty")).toBe("");
  });

  it("blocks non-digit typing for inputmode numeric", async () => {
    wrapper = await wrapperFactory({ inputmode: "numeric" });
    const input = wrapper.find("input").element;

    const letter = beforeInput("a");
    input.dispatchEvent(letter);
    expect(letter.defaultPrevented).toBe(true);

    const digit = beforeInput("7");
    input.dispatchEvent(digit);
    expect(digit.defaultPrevented).toBe(false);

    const deletion = beforeInput(null);
    input.dispatchEvent(deletion);
    expect(deletion.defaultPrevented).toBe(false);

    expect(wrapper.find("input").attributes("pattern")).toBe("[0-9]+");
  });

  it("does not filter typing for other inputmodes", async () => {
    wrapper = await wrapperFactory({ inputmode: "text" });
    const letter = beforeInput("a");
    wrapper.find("input").element.dispatchEvent(letter);

    expect(letter.defaultPrevented).toBe(false);
    expect(wrapper.find("input").attributes("pattern")).toBeUndefined();
  });

  it("applies styleClassPassthrough to the input and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["first-class"] });
    expect(wrapper.find("input").classes()).toContain("first-class");

    await wrapper.setProps({ styleClassPassthrough: ["second-class"] });
    await nextTick();
    expect(wrapper.find("input").classes()).toContain("second-class");
    expect(wrapper.find("input").classes()).not.toContain("first-class");
  });
});
