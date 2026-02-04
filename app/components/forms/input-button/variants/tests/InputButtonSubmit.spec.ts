import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputButtonSubmit from "../InputButtonSubmit.vue";

// Mock useStyleClassPassthrough composable
vi.mock("#imports", () => ({
  useStyleClassPassthrough: vi.fn((classes) => ({
    elementClasses: { value: Array.isArray(classes) ? classes.join(" ") : classes || "" },
  })),
}));

describe("InputButtonSubmit", () => {
  let wrapper: ReturnType<typeof mountSuspended>;

  const createWrapper = async (props = {}) => {
    const defaultProps = {
      buttonText: "Submit Form",
      ...props,
    };

    wrapper = await mountSuspended(InputButtonSubmit, {
      props: defaultProps,
      global: {
        components: {
          InputButtonCore: {
            template: `
              <button
                :type="$attrs.type"
                :class="'input-button-core'"
                :data-testid="$attrs.dataTestid"
                :readonly="$attrs.readonly"
                :aria-disabled="$attrs.readonly"
              >
                <span class="btn-text">{{ $attrs.buttonText }}</span>
              </button>
            `,
            props: [
              "type",
              "buttonText",
              "dataTestid",
              "readonly",
              "theme",
              "size",
              "weight",
              "useEffect",
              "effect",
              "isPending",
              "styleClassPassthrough",
            ],
          },
        },
      },
    });

    return wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe("Component Structure", () => {
    it("renders as a submit button", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.attributes("type")).toBe("submit");
    });

    it("displays the button text correctly", async () => {
      await createWrapper({ buttonText: "Save Changes" });

      const buttonText = wrapper.find(".btn-text");
      expect(buttonText.exists()).toBe(true);
      expect(buttonText.text()).toBe("Save Changes");
    });

    it("has no icon slots by default", async () => {
      await createWrapper();

      // Should only contain button text, no icons
      const button = wrapper.find("button");
      expect(button.text()).toBe("Submit Form");
    });
  });

  describe("Props Handling", () => {
    it("passes all BaseButtonProps to InputButtonCore", async () => {
      await createWrapper({
        buttonText: "Custom Submit",
        theme: "primary",
        size: "large",
        weight: "wght-600",
        dataTestid: "submit-btn",
        readonly: true,
        useEffect: true,
        effect: "fancy",
        isPending: true,
      });

      const button = wrapper.find("button");
      expect(button.attributes("data-testid")).toBe("submit-btn");
      expect(button.attributes("readonly")).toBe("");
      expect(button.attributes("aria-disabled")).toBe("true");
      expect(button.text()).toBe("Custom Submit");
    });

    it("handles styleClassPassthrough prop", async () => {
      await createWrapper({
        styleClassPassthrough: "submit-style",
      });

      // Component should render successfully with style classes
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
    });

    it("handles array styleClassPassthrough prop", async () => {
      await createWrapper({
        styleClassPassthrough: ["submit-class", "form-button"],
      });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
    });
  });

  describe("Submit Button Behavior", () => {
    it("always uses submit type", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("submit");
    });

    it("handles readonly state correctly", async () => {
      await createWrapper({ readonly: true });

      const button = wrapper.find("button");
      expect(button.attributes("readonly")).toBe("");
      expect(button.attributes("aria-disabled")).toBe("true");
    });

    it("handles pending state during form submission", async () => {
      await createWrapper({ isPending: true });

      // Component should render without errors when form is submitting
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.attributes("type")).toBe("submit");
    });
  });

  describe("Form Integration", () => {
    it("works with different button texts for forms", async () => {
      const formTexts = ["Submit", "Save", "Send", "Create", "Update"];

      for (const text of formTexts) {
        const testWrapper = await mountSuspended(InputButtonSubmit, {
          props: { buttonText: text },
          global: {
            components: {
              InputButtonCore: {
                template: '<button type="submit"><span class="btn-text">{{ $attrs.buttonText }}</span></button>',
                props: ["buttonText", "type"],
              },
            },
          },
        });

        const button = testWrapper.find("button");
        expect(button.text()).toBe(text);
        expect(button.attributes("type")).toBe("submit");

        testWrapper.unmount();
      }
    });

    it("supports different themes appropriate for forms", async () => {
      await createWrapper({
        theme: "success",
        buttonText: "Save Form",
      });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.attributes("type")).toBe("submit");
    });
  });

  describe("Accessibility", () => {
    it("maintains proper button semantics for forms", async () => {
      await createWrapper({
        buttonText: "Submit Registration",
      });

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("submit");
      expect(button.text()).toBe("Submit Registration");
    });

    it("handles disabled state for form validation", async () => {
      await createWrapper({
        readonly: true,
        buttonText: "Submit (Disabled)",
      });

      const button = wrapper.find("button");
      expect(button.attributes("aria-disabled")).toBe("true");
      expect(button.attributes("readonly")).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty button text", async () => {
      await createWrapper({ buttonText: "" });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.attributes("type")).toBe("submit");
    });

    it("works with all effect types", async () => {
      const effects = ["fancy", "pulse"] as const;

      for (const effect of effects) {
        const testWrapper = await mountSuspended(InputButtonSubmit, {
          props: {
            buttonText: "Test",
            useEffect: true,
            effect,
          },
          global: {
            components: {
              InputButtonCore: {
                template: '<button type="submit">{{ $attrs.buttonText }}</button>',
                props: ["buttonText", "type", "useEffect", "effect"],
              },
            },
          },
        });

        const button = testWrapper.find("button");
        expect(button.attributes("type")).toBe("submit");

        testWrapper.unmount();
      }
    });
  });
});
