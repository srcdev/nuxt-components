import { describe, it, expect } from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import ComponentUnderTest from "../InputError.vue";

const initialPropsData = {
  errorMessage: "Hello World",
  showError: true,
  id: "testId",
  styleClassPassthrough: ["testClass"],
  isDetached: true,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    props: mockPropsData,
  });
};

describe("InputError", () => {
  it("renders the root with id, testid, error theme and passthrough classes", async () => {
    wrapper = await wrapperFactory();
    const root = wrapper.find(".input-error-message");

    expect(root.attributes("id")).toBe("testId");
    expect(root.attributes("data-testid")).toBe("inputError");
    expect(root.attributes("data-theme")).toBe("error");
    expect(root.classes()).toContain("testClass");
  });

  it("marks itself visible and exposed to assistive tech when showError is true", async () => {
    wrapper = await wrapperFactory();
    const root = wrapper.find(".input-error-message");

    expect(root.attributes("data-visible")).toBe("");
    expect(root.attributes("aria-hidden")).toBeUndefined();
  });

  it("is hidden and aria-hidden when showError is false", async () => {
    wrapper = await wrapperFactory({ showError: false });
    const root = wrapper.find(".input-error-message");

    expect(root.attributes("data-visible")).toBeUndefined();
    expect(root.attributes("aria-hidden")).toBe("true");
  });

  it("reflects isDetached as data-detached", async () => {
    wrapper = await wrapperFactory({ isDetached: true });
    expect(wrapper.find(".input-error-message").attributes("data-detached")).toBe("");

    await wrapper.setProps({ isDetached: false });
    expect(wrapper.find(".input-error-message").attributes("data-detached")).toBeUndefined();
  });

  it("reflects inputVariant as data-input-variant, defaulting to normal", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".input-error-message").attributes("data-input-variant")).toBe("normal");

    await wrapper.setProps({ inputVariant: "underlined" });
    expect(wrapper.find(".input-error-message").attributes("data-input-variant")).toBe("underlined");
  });

  it("does not use collision-prone bare modifier classes", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    const classes = wrapper.find(".input-error-message").classes();

    expect(classes).not.toContain("show");
    expect(classes).not.toContain("detached");
    expect(classes).not.toContain("underlined");
    expect(wrapper.find(".inner").exists()).toBe(false);
    expect(wrapper.find(".message").exists()).toBe(false);
  });

  it("displays a single error message", async () => {
    wrapper = await wrapperFactory();

    expect(wrapper.find(".input-error-message-list").exists()).toBe(false);
    expect(wrapper.find(".input-error-message-single").text()).toBe("Hello World");
  });

  it("displays an array of error messages as a list", async () => {
    wrapper = await wrapperFactory({ errorMessage: ["Hello World", "Hello World 2"] });
    const items = wrapper.findAll(".input-error-message-list-item");

    expect(wrapper.find(".input-error-message-single").exists()).toBe(false);
    expect(items).toHaveLength(2);
    expect(items[0]!.text()).toBe("Hello World");
    expect(items[1]!.text()).toBe("Hello World 2");
  });

  it("renders a decorative icon that can be overridden", async () => {
    wrapper = await wrapperFactory();
    const icon = wrapper.find(".input-error-message-icon");

    expect(icon.exists()).toBe(true);
    expect(icon.attributes("aria-hidden")).toBe("true");
    expect(icon.html()).toContain("circle-backslash");

    await wrapper.setProps({ icon: "radix-icons:exclamation-triangle" });
    expect(wrapper.find(".input-error-message-icon").html()).toContain("exclamation-triangle");
  });

  it("updates passthrough classes when the prop changes", async () => {
    wrapper = await wrapperFactory();

    await wrapper.setProps({ styleClassPassthrough: ["otherClass"] });
    await nextTick();

    const classes = wrapper.find(".input-error-message").classes();
    expect(classes).toContain("otherClass");
    expect(classes).not.toContain("testClass");
  });
});
