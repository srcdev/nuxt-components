import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import InputCopy from "../InputCopy.vue";

describe("InputCopy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders readonly input with value", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key-123",
        label: "Test key",
      },
    });

    const input = wrapper.find("input");
    expect(input.element.value).toBe("test-key-123");
    expect(input.element.readOnly).toBe(true);
  });

  it("displays description when provided", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        description: "This is your license key.",
      },
    });

    expect(wrapper.text()).toContain("This is your license key.");
  });

  it("does not display description when not provided", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        description: undefined,
      },
    });

    const description = wrapper.find(".input-copy__description");
    expect(description.exists()).toBe(false);
  });

  it("renders copy button with default text", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        buttonText: "Copy",
      },
    });

    const button = wrapper.find("button");
    expect(button.text()).toContain("Copy");
  });

  it("renders copy button with custom text", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        buttonText: "Copy to clipboard",
      },
    });

    const button = wrapper.find("button");
    expect(button.text()).toContain("Copy to clipboard");
  });

  it("disables button when isDisabled is true", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        isDisabled: true,
      },
    });

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
  });

  it("button is not disabled when isDisabled is false", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        isDisabled: false,
      },
    });

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeUndefined();
  });

  it("has proper aria-label on input from label prop", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        label: "License key",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-label")).toBe("License key");
  });

  it("has proper aria-label on input from ariaLabel prop (takes precedence)", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        label: "License key",
        ariaLabel: "Unique license identifier",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-label")).toBe("Unique license identifier");
  });

  it("has proper aria-label on button", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        label: "API token",
      },
    });

    const button = wrapper.find("button");
    expect(button.attributes("aria-label")).toContain("Copy");
    expect(button.attributes("aria-label")).toContain("API token");
  });

  it("has icon element in button", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
      },
    });

    const icon = wrapper.find(".input-copy__icon");
    expect(icon.exists()).toBe(true);
  });

  it("input wrapper contains both input and button", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
      },
    });

    const wrapper_el = wrapper.find(".input-copy__wrapper");
    expect(wrapper_el.exists()).toBe(true);

    const input = wrapper_el.find("input");
    const button = wrapper_el.find("button");

    expect(input.exists()).toBe(true);
    expect(button.exists()).toBe(true);
  });

  it("renders with correct component classes", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
      },
    });

    expect(wrapper.classes()).toContain("input-copy");
  });

  it("applies styleClassPassthrough classes", () => {
    const wrapper = mount(InputCopy, {
      props: {
        value: "test-key",
        styleClassPassthrough: ["custom-class", "another-class"],
      },
    });

    expect(wrapper.classes()).toContain("custom-class");
    expect(wrapper.classes()).toContain("another-class");
  });
});
