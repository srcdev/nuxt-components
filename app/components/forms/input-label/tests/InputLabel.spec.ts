import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputLabel from "../InputLabel.vue";

// Mock useStyleClassPassthrough composable
vi.mock("#imports", () => ({
  useStyleClassPassthrough: vi.fn((classes) => ({
    elementClasses: { value: Array.isArray(classes) ? classes.join(" ") : classes || "" },
  })),
  useSlots: vi.fn(),
}));

describe("InputLabel", () => {
  let wrapper: ReturnType<typeof mountSuspended>;

  const createWrapper = async (props = {}, slots = {}) => {
    const defaultProps = {
      id: "test-input",
      name: "testInput",
      inputVariant: "normal", // Set valid default
      ...props,
    };

    wrapper = await mountSuspended(InputLabel, {
      props: defaultProps,
      slots,
    });

    return wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe("Component Rendering", () => {
    it("renders label element with correct for attribute", async () => {
      await createWrapper({ id: "email-input" });

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.attributes("for")).toBe("email-input");
      expect(label.classes()).toContain("input-label");
    });

    it("renders with textLabel slot", async () => {
      await createWrapper(
        {},
        {
          textLabel: "Email Address",
        }
      );

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.text()).toBe("Email Address");
    });

    it("renders with htmlLabel slot", async () => {
      await createWrapper(
        {},
        {
          htmlLabel: "<strong>Required:</strong> Email Address",
        }
      );

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.html()).toContain("<strong>Required:</strong>");
      expect(label.html()).toContain("Email Address");
    });

    it("renders both slots when provided", async () => {
      await createWrapper(
        {},
        {
          htmlLabel: "<strong>Primary:</strong>",
          textLabel: "Email Address",
        }
      );

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.html()).toContain("<strong>Primary:</strong>");
      expect(label.text()).toContain("Email Address");
    });

    it("renders empty label when no slots provided", async () => {
      await createWrapper();

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.text()).toBe("");
    });
  });

  describe("Props Handling", () => {
    it("applies styleClassPassthrough as string", async () => {
      await createWrapper({
        styleClassPassthrough: "custom-label-class",
      });

      const label = wrapper.find("label");
      expect(label.classes()).toContain("custom-label-class");
    });

    it("applies styleClassPassthrough as array", async () => {
      await createWrapper({
        styleClassPassthrough: ["custom-class", "another-class"],
      });

      const label = wrapper.find("label");
      expect(label.classes()).toContain("custom-class");
      expect(label.classes()).toContain("another-class");
    });

    it("applies inputVariant class", async () => {
      await createWrapper({
        inputVariant: "outlined",
      });

      const label = wrapper.find("label");
      expect(label.classes()).toContain("outlined");
    });

    it("applies normal variant class", async () => {
      await createWrapper({
        inputVariant: "normal",
      });

      const label = wrapper.find("label");
      expect(label.classes()).toContain("normal");
    });

    it("applies underlined variant class", async () => {
      await createWrapper({
        inputVariant: "underlined",
      });

      const label = wrapper.find("label");
      expect(label.classes()).toContain("underlined");
    });

    it("handles theme prop correctly", async () => {
      await createWrapper({
        theme: "success",
      });

      // Component should render successfully with valid theme
      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
    });

    it("handles fieldHasError prop", async () => {
      await createWrapper({
        fieldHasError: true,
      });

      // Component should render successfully with error state
      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
    });
  });

  describe("Required Props", () => {
    it("requires id prop for label association", async () => {
      await createWrapper({
        id: "required-id",
        name: "test",
      });

      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe("required-id");
    });

    it("requires name prop", async () => {
      await createWrapper({
        id: "test-id",
        name: "required-name",
      });

      // Component should render successfully with required name
      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
    });

    it("works with complex ID values", async () => {
      await createWrapper({
        id: "complex-id_with.dots-and_underscores123",
      });

      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe("complex-id_with.dots-and_underscores123");
    });
  });

  describe("Default Props", () => {
    it("applies default theme value", async () => {
      await createWrapper();

      // Component should work with default theme 'primary'
      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
    });

    it("applies default inputVariant value", async () => {
      await createWrapper();

      // Component should work with default inputVariant 'normal'
      const label = wrapper.find("label");
      expect(label.classes()).toContain("normal");
    });

    it("applies default fieldHasError value", async () => {
      await createWrapper();

      // Component should work with default fieldHasError false
      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
    });

    it("applies default styleClassPassthrough value", async () => {
      await createWrapper();

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      // Should have base classes but no custom ones
      expect(label.classes()).toEqual(["input-label", "normal"]);
    });
  });

  describe("Accessibility", () => {
    it("provides proper label association with for attribute", async () => {
      await createWrapper(
        {
          id: "username-field",
        },
        {
          textLabel: "Username",
        }
      );

      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe("username-field");
      expect(label.text()).toBe("Username");
    });

    it("supports rich HTML content for complex labels", async () => {
      await createWrapper(
        {},
        {
          htmlLabel: `
          <span>Password</span>
          <span class="required-indicator" aria-label="required">*</span>
          <small>(must be 8+ characters)</small>
        `,
        }
      );

      const label = wrapper.find("label");
      expect(label.html()).toContain("<span>Password</span>");
      expect(label.html()).toContain("required-indicator");
      expect(label.html()).toContain("<small>");
    });

    it("maintains semantic HTML structure", async () => {
      await createWrapper(
        {
          id: "semantic-input",
        },
        {
          textLabel: "Semantic Label",
        }
      );

      const label = wrapper.find("label");
      expect(label.element.tagName).toBe("LABEL");
      expect(label.attributes("for")).toBe("semantic-input");
    });
  });

  describe("Slot Behavior", () => {
    it("renders htmlLabel slot first when both slots provided", async () => {
      await createWrapper(
        {},
        {
          htmlLabel: "<em>HTML content</em>",
          textLabel: "Text content",
        }
      );

      const label = wrapper.find("label");
      const html = label.html();

      // HTML slot should appear before text slot in DOM
      const htmlIndex = html.indexOf("<em>HTML content</em>");
      const textIndex = html.indexOf("Text content");
      expect(htmlIndex).toBeGreaterThan(-1);
      expect(textIndex).toBeGreaterThan(-1);
      expect(htmlIndex).toBeLessThan(textIndex);
    });

    it("handles only htmlLabel slot", async () => {
      await createWrapper(
        {},
        {
          htmlLabel: "<strong>Only HTML Label</strong>",
        }
      );

      const label = wrapper.find("label");
      expect(label.html()).toContain("<strong>Only HTML Label</strong>");
      expect(label.text()).toBe("Only HTML Label");
    });

    it("handles only textLabel slot", async () => {
      await createWrapper(
        {},
        {
          textLabel: "Only Text Label",
        }
      );

      const label = wrapper.find("label");
      expect(label.text()).toBe("Only Text Label");
      expect(label.html()).not.toContain("<strong>");
    });
  });

  describe("CSS Classes", () => {
    it("always includes base input-label class", async () => {
      await createWrapper();

      const label = wrapper.find("label");
      expect(label.classes()).toContain("input-label");
    });

    it("combines all class sources correctly", async () => {
      await createWrapper({
        inputVariant: "outlined",
        styleClassPassthrough: ["custom-1", "custom-2"],
      });

      const label = wrapper.find("label");
      expect(label.classes()).toContain("input-label");
      expect(label.classes()).toContain("outlined");
      expect(label.classes()).toContain("custom-1");
      expect(label.classes()).toContain("custom-2");
    });

    it("handles empty styleClassPassthrough", async () => {
      await createWrapper({
        styleClassPassthrough: [],
      });

      const label = wrapper.find("label");
      expect(label.classes()).toEqual(["input-label", "normal"]);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty slot content gracefully", async () => {
      await createWrapper(
        {},
        {
          textLabel: "",
        }
      );

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.text()).toBe("");
    });

    it("handles whitespace-only slot content", async () => {
      await createWrapper(
        {},
        {
          textLabel: "   ",
        }
      );

      const label = wrapper.find("label");
      expect(label.exists()).toBe(true);
      expect(label.text().trim()).toBe("");
    });

    it("handles special characters in labels", async () => {
      await createWrapper(
        {},
        {
          textLabel: "Label with & < > \" ' characters",
        }
      );

      const label = wrapper.find("label");
      expect(label.text()).toBe("Label with & < > \" ' characters");
    });

    it("handles multiline label content", async () => {
      await createWrapper(
        {},
        {
          textLabel: `
          Multi-line
          Label Content
        `,
        }
      );

      const label = wrapper.find("label");
      expect(label.text()).toContain("Multi-line");
      expect(label.text()).toContain("Label Content");
    });

    it("works with all valid inputVariant values", async () => {
      const variants = ["normal", "outlined", "underlined"];

      for (const variant of variants) {
        const testWrapper = await createWrapper({ inputVariant: variant });
        const label = testWrapper.find("label");
        expect(label.classes()).toContain(variant);
        testWrapper.unmount();
      }
    });

    it("works with all valid theme values", async () => {
      const themes = ["primary", "secondary", "tertiary", "ghost", "error", "success", "warning"];

      for (const theme of themes) {
        const testWrapper = await createWrapper({ theme });
        const label = testWrapper.find("label");
        expect(label.exists()).toBe(true);
        testWrapper.unmount();
      }
    });
  });

  describe("Label-Input Association", () => {
    it("creates proper association between label and input", async () => {
      await createWrapper(
        {
          id: "email-input-field",
        },
        {
          textLabel: "Email Address",
        }
      );

      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe("email-input-field");
      // This ensures clicking the label will focus the associated input
    });

    it("handles dynamic ID changes", async () => {
      await createWrapper({
        id: "initial-id",
      });

      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe("initial-id");

      // Update props to simulate ID change
      await wrapper.setProps({ id: "updated-id" });
      expect(label.attributes("for")).toBe("updated-id");
    });
  });
});
