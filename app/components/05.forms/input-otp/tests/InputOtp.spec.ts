import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputOtp.vue";

const wrapperFactory = async (props: Record<string, unknown> = {}) => {
  const state = { value: (props.modelValue as string) ?? "" };
  const wrapper = await mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: {
      id: "code",
      modelValue: state.value,
      "onUpdate:modelValue": (value: string) => {
        state.value = value;
        wrapper.setProps({ modelValue: value });
      },
      ...props,
    },
  });
  return { wrapper, state };
};

const boxes = (wrapper: VueWrapper) => wrapper.findAll<HTMLInputElement>(".input-otp-box");

const typeInto = async (wrapper: VueWrapper, index: number, value: string) => {
  const box = boxes(wrapper)[index]!;
  box.element.value = value;
  await box.trigger("input");
  await nextTick();
};

const paste = async (wrapper: VueWrapper, index: number, text: string) => {
  const event = new Event("paste", { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, "clipboardData", { value: { getData: () => text } });
  boxes(wrapper)[index]!.element.dispatchEvent(event);
  await nextTick();
};

describe("InputOtp", () => {
  it("mounts without error", async () => {
    const { wrapper } = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders one box per length, defaulting to six", async () => {
    const { wrapper } = await wrapperFactory();
    expect(boxes(wrapper)).toHaveLength(6);

    await wrapper.setProps({ length: 4 });
    expect(boxes(wrapper)).toHaveLength(4);
  });

  it("clamps length between 1 and 12", async () => {
    const { wrapper } = await wrapperFactory({ length: 99 });
    expect(boxes(wrapper)).toHaveLength(12);

    await wrapper.setProps({ length: 0 });
    expect(boxes(wrapper)).toHaveLength(1);

    await wrapper.setProps({ length: -3 });
    expect(boxes(wrapper)).toHaveLength(1);
  });

  it("uses text inputs with a numeric keypad", async () => {
    const { wrapper } = await wrapperFactory();
    const box = boxes(wrapper)[0]!;
    expect(box.attributes("type")).toBe("text");
    expect(box.attributes("inputmode")).toBe("numeric");
  });

  it("rejects non-digit input", async () => {
    const { wrapper, state } = await wrapperFactory();
    await typeInto(wrapper, 0, "a");
    expect(state.value).toBe("");
    expect(boxes(wrapper)[0]!.element.value).toBe("");
  });

  it("advances focus to the next box after a digit", async () => {
    const { wrapper, state } = await wrapperFactory();
    await typeInto(wrapper, 0, "4");
    expect(state.value).toBe("4");
    expect(document.activeElement).toBe(boxes(wrapper)[1]!.element);
  });

  it("keeps a leading zero", async () => {
    const { wrapper, state } = await wrapperFactory();
    await typeInto(wrapper, 0, "0");
    await typeInto(wrapper, 1, "1");
    expect(state.value).toBe("01");

    await paste(wrapper, 0, "012345");
    expect(state.value).toBe("012345");
    expect(boxes(wrapper)[0]!.element.value).toBe("0");
  });

  it("replaces a digit when typing into a filled box", async () => {
    const { wrapper, state } = await wrapperFactory({ modelValue: "123" });
    await typeInto(wrapper, 1, "29");
    expect(state.value).toBe("193");

    await typeInto(wrapper, 0, "71");
    expect(state.value).toBe("793");
  });

  it("Backspace in an empty box clears the previous box and moves back", async () => {
    const { wrapper, state } = await wrapperFactory({ modelValue: "12" });
    await boxes(wrapper)[2]!.trigger("keydown", { key: "Backspace" });
    await nextTick();
    expect(state.value).toBe("1");
    expect(document.activeElement).toBe(boxes(wrapper)[1]!.element);
  });

  it("Backspace in a filled box only clears that box", async () => {
    const { wrapper, state } = await wrapperFactory({ modelValue: "12" });
    boxes(wrapper)[1]!.element.focus();
    await boxes(wrapper)[1]!.trigger("keydown", { key: "Backspace" });
    await typeInto(wrapper, 1, "");
    expect(state.value).toBe("1");
    expect(document.activeElement).toBe(boxes(wrapper)[1]!.element);
  });

  it("paste spreads digits, strips non-digits and truncates to length", async () => {
    const { wrapper, state } = await wrapperFactory();
    await paste(wrapper, 0, "12-34 56789");
    expect(state.value).toBe("123456");
    expect(document.activeElement).toBe(boxes(wrapper)[5]!.element);
  });

  it("a partial paste fills from the focused box", async () => {
    const { wrapper, state } = await wrapperFactory({ modelValue: "12" });
    await paste(wrapper, 2, "34");
    expect(state.value).toBe("1234");
    expect(document.activeElement).toBe(boxes(wrapper)[3]!.element);
  });

  it("a paste with no digits changes nothing", async () => {
    const { wrapper, state } = await wrapperFactory({ modelValue: "12" });
    await paste(wrapper, 0, "abc");
    expect(state.value).toBe("12");
  });

  it("spreads a multi-digit autofill in one box across the boxes", async () => {
    const { wrapper, state } = await wrapperFactory();
    expect(boxes(wrapper)[0]!.attributes("autocomplete")).toBe("one-time-code");
    expect(boxes(wrapper)[1]!.attributes("autocomplete")).toBe("off");

    await typeInto(wrapper, 0, "654321");
    expect(state.value).toBe("654321");
    expect(boxes(wrapper)[0]!.element.value).toBe("6");
  });

  it("Enter submits the parent form", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const requestSubmit = vi.spyOn(form, "requestSubmit").mockImplementation(() => {});

    const wrapper = await mountSuspended(ComponentUnderTest, {
      attachTo: form,
      props: { id: "code", modelValue: "" },
    });
    await wrapper.findAll(".input-otp-box")[0]!.trigger("keydown", { key: "Enter" });
    expect(requestSubmit).toHaveBeenCalledOnce();
    form.remove();
  });

  it("arrow keys, Home and End move between boxes", async () => {
    const { wrapper } = await wrapperFactory();
    const [first, second] = boxes(wrapper);

    await first!.trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(second!.element);

    await second!.trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(first!.element);

    await first!.trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(boxes(wrapper)[5]!.element);

    await boxes(wrapper)[5]!.trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(first!.element);
  });

  it("selects the digit on focus so typing replaces it", async () => {
    const { wrapper } = await wrapperFactory({ modelValue: "5" });
    const box = boxes(wrapper)[0]!.element;
    const select = vi.spyOn(box, "select");
    box.focus();
    expect(select).toHaveBeenCalled();
  });

  it("does not take focus on mount by default", async () => {
    const { wrapper } = await wrapperFactory();
    await nextTick();
    expect(document.activeElement).not.toBe(boxes(wrapper)[0]!.element);
  });

  it("focuses the first box on mount when autofocus is set", async () => {
    const { wrapper } = await wrapperFactory({ autofocus: true });
    await nextTick();
    expect(document.activeElement).toBe(boxes(wrapper)[0]!.element);
  });

  it("focuses the first box when an error appears", async () => {
    const { wrapper } = await wrapperFactory();
    await wrapper.setProps({ fieldHasError: true });
    await nextTick();
    expect(document.activeElement).toBe(boxes(wrapper)[0]!.element);
  });

  it("emits complete once every box is filled", async () => {
    const { wrapper } = await wrapperFactory({ length: 3, modelValue: "12" });
    expect(wrapper.emitted("complete")).toBeUndefined();

    await typeInto(wrapper, 2, "3");
    expect(wrapper.emitted("complete")).toEqual([["123"]]);
  });

  it("labels each box from digitLabel", async () => {
    const { wrapper } = await wrapperFactory({ length: 4, digitLabel: "Ziffer {index} von {length}" });
    const labels = wrapper.findAll("label");
    expect(labels[0]!.text()).toBe("Ziffer 1 von 4");
    expect(labels[0]!.attributes("for")).toBe("code-0");
    expect(labels[3]!.text()).toBe("Ziffer 4 von 4");
  });

  it("exposes a named group only when groupLabel is set", async () => {
    const { wrapper } = await wrapperFactory();
    expect(wrapper.find(".input-otp").attributes("role")).toBeUndefined();

    await wrapper.setProps({ groupLabel: "Verification code" });
    expect(wrapper.find(".input-otp").attributes("role")).toBe("group");
    expect(wrapper.find(".input-otp").attributes("aria-label")).toBe("Verification code");
  });

  it("marks every box invalid and described when there is an error", async () => {
    const { wrapper } = await wrapperFactory({ fieldHasError: true, ariaDescribedby: "code-error" });
    expect(wrapper.find(".input-otp").attributes("data-invalid")).toBe("");
    boxes(wrapper).forEach((box) => {
      expect(box.attributes("aria-invalid")).toBe("true");
      expect(box.attributes("aria-describedby")).toBe("code-error");
    });
  });

  it("holds the full code in a hidden input when name is set", async () => {
    const { wrapper } = await wrapperFactory({ modelValue: "0123" });
    expect(wrapper.find('input[type="hidden"]').exists()).toBe(false);

    await wrapper.setProps({ name: "code" });
    const hidden = wrapper.find<HTMLInputElement>('input[type="hidden"]');
    expect(hidden.attributes("name")).toBe("code");
    expect(hidden.element.value).toBe("0123");
  });

  it("ignores non-digits and overflow in the model value", async () => {
    const { wrapper } = await wrapperFactory({ length: 3, modelValue: "1a34567" });
    expect(boxes(wrapper).map((box) => box.element.value)).toEqual(["1", "", "3"]);
  });

  it("sets native required on every box when required", async () => {
    const { wrapper } = await wrapperFactory({ required: true, length: 2 });
    boxes(wrapper).forEach((box) => expect(box.attributes("required")).toBeDefined());
  });

  it("applies theme, variant and passthrough classes", async () => {
    const { wrapper } = await wrapperFactory({
      theme: "success",
      inputVariant: "underlined",
      styleClassPassthrough: ["extra"],
    });
    const root = wrapper.find(".input-otp");
    expect(root.attributes("data-theme")).toBe("success");
    expect(root.classes()).toEqual(expect.arrayContaining(["underlined", "extra"]));
  });
});
