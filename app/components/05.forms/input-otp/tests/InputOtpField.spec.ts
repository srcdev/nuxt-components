import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputOtpField.vue";

const wrapperFactory = (props: Record<string, unknown> = {}, slots = {}) =>
  mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: { name: "code", label: "Verification code", modelValue: "", ...props },
    slots,
  });

describe("InputOtpField", () => {
  it("mounts without error", async () => {
    const wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("names the group with the label as a fieldset legend", async () => {
    const wrapper = await wrapperFactory();
    expect(wrapper.find("fieldset.input-otp-field").exists()).toBe(true);
    expect(wrapper.find("legend").text()).toBe("Verification code");
  });

  it("renders the boxes and a hidden input carrying the code", async () => {
    const wrapper = await wrapperFactory({ length: 4, modelValue: "0042" });
    expect(wrapper.findAll(".input-otp-box")).toHaveLength(4);
    const hidden = wrapper.find<HTMLInputElement>('input[type="hidden"]');
    expect(hidden.attributes("name")).toBe("code");
    expect(hidden.element.value).toBe("0042");
  });

  it("links the error message to every box when there is an error", async () => {
    const wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "That code has expired" });
    expect(wrapper.text()).toContain("That code has expired");
    expect(wrapper.find("fieldset").attributes("data-invalid")).toBe("");

    const errorId = wrapper.find(".input-error-message").attributes("id");
    wrapper.findAll(".input-otp-box").forEach((box) => {
      expect(box.attributes("aria-describedby")).toBe(errorId);
      expect(box.attributes("aria-invalid")).toBe("true");
    });
  });

  it("links the description when a description slot is used", async () => {
    const wrapper = await wrapperFactory({}, { descriptionText: "We sent it to your email" });
    expect(wrapper.text()).toContain("We sent it to your email");
    const describedBy = wrapper.find(".input-otp-box").attributes("aria-describedby");
    expect(describedBy).toMatch(/-description$/);
  });

  it("forwards digitLabel to the box labels", async () => {
    const wrapper = await wrapperFactory({ length: 2, digitLabel: "Chiffre {index} sur {length}" });
    expect(wrapper.findAll("label")[0]!.text()).toBe("Chiffre 1 sur 2");
  });

  it("re-emits complete from the control", async () => {
    const wrapper = await wrapperFactory({ length: 2, modelValue: "1" });
    const box = wrapper.findAll<HTMLInputElement>(".input-otp-box")[1]!;
    box.element.value = "2";
    await box.trigger("input");
    await nextTick();
    expect(wrapper.emitted("complete")).toEqual([["12"]]);
  });

  it("focuses the first box on mount when autofocus is set", async () => {
    const wrapper = await wrapperFactory({ autofocus: true });
    await nextTick();
    expect(document.activeElement).toBe(wrapper.find(".input-otp-box").element);
  });

  it("applies passthrough classes to the fieldset", async () => {
    const wrapper = await wrapperFactory({ styleClassPassthrough: ["extra"] });
    expect(wrapper.find("fieldset").classes()).toContain("extra");
  });
});
