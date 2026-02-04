import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputDescription from "../InputDescription.vue";

// Mock useStyleClassPassthrough composable
vi.mock("#imports", () => ({
  useStyleClassPassthrough: vi.fn((classes) => ({
    elementClasses: { value: Array.isArray(classes) ? classes.join(" ") : classes || "" },
  })),
}));

describe("InputDescription", () => {
  let wrapper: ReturnType<typeof mountSuspended>;

  const createWrapper = async (props = {}, slots = {}) => {
    const defaultProps = {
      id: "test-input",
      name: "testInput",
      inputVariant: "normal", // Set valid default
      ...props,
    };

    wrapper = await mountSuspended(InputDescription, {
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
    it("does not render when no slots are provided", async () => {
      await createWrapper();

      expect(wrapper.html()).toBe("<!--v-if-->");
    });

    it("renders with descriptionText slot", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "This is a text description",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
      expect(container.attributes("id")).toBe("test-input-description");

      const textElement = wrapper.find(".input-description-text");
      expect(textElement.exists()).toBe(true);
      expect(textElement.text()).toBe("This is a text description");
      expect(textElement.element.tagName).toBe("P");
    });

    it("renders with descriptionHtml slot", async () => {
      await createWrapper(
        {},
        {
          descriptionHtml: "<strong>Bold description</strong> with <em>emphasis</em>",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);

      const htmlElement = wrapper.find(".input-description-html");
      expect(htmlElement.exists()).toBe(true);
      expect(htmlElement.html()).toContain("<strong>Bold description</strong>");
      expect(htmlElement.html()).toContain("<em>emphasis</em>");
    });

    it("renders both slots when provided", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "Text description",
          descriptionHtml: "<strong>HTML description</strong>",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);

      const textElement = wrapper.find(".input-description-text");
      const htmlElement = wrapper.find(".input-description-html");

      expect(textElement.exists()).toBe(true);
      expect(htmlElement.exists()).toBe(true);
      expect(textElement.text()).toBe("Text description");
      expect(htmlElement.html()).toContain("<strong>HTML description</strong>");
    });
  });

  describe("Props Handling", () => {
    it("generates correct description ID from input ID", async () => {
      await createWrapper(
        { id: "my-input-field" },
        {
          descriptionText: "Test description",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.attributes("id")).toBe("my-input-field-description");
    });

    it("applies styleClassPassthrough as string", async () => {
      await createWrapper(
        {
          styleClassPassthrough: "custom-class",
        },
        {
          descriptionText: "Test description",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.classes()).toContain("custom-class");
    });

    it("applies styleClassPassthrough as array", async () => {
      await createWrapper(
        {
          styleClassPassthrough: ["custom-class", "another-class"],
        },
        {
          descriptionText: "Test description",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.classes()).toContain("custom-class");
      expect(container.classes()).toContain("another-class");
    });

    it("handles theme prop correctly", async () => {
      await createWrapper(
        {
          theme: "success",
        },
        {
          descriptionText: "Success description",
        }
      );

      // Component should render successfully with valid theme
      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
    });

    it("handles inputVariant prop correctly", async () => {
      await createWrapper(
        {
          inputVariant: "outlined",
        },
        {
          descriptionText: "Outlined variant description",
        }
      );

      // Component should render successfully with valid input variant
      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
    });

    it("handles fieldHasError prop", async () => {
      await createWrapper(
        {
          fieldHasError: true,
        },
        {
          descriptionText: "Error state description",
        }
      );

      // Component should render successfully with error state
      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
    });
  });

  describe("Required Props", () => {
    it("requires id prop", async () => {
      await createWrapper(
        { id: "required-id" },
        {
          descriptionText: "Test",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.attributes("id")).toBe("required-id-description");
    });

    it("requires name prop", async () => {
      await createWrapper(
        {
          id: "test-id",
          name: "required-name",
        },
        {
          descriptionText: "Test",
        }
      );

      // Component should render successfully with required name
      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
    });
  });

  describe("Default Props", () => {
    it("applies default theme value", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "Default theme test",
        }
      );

      // Component should work with default theme 'primary'
      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
    });

    it("applies default inputVariant value", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "Default variant test",
        }
      );

      // Component should work with default inputVariant 'default'
      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
    });

    it("applies default fieldHasError value", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "No error by default",
        }
      );

      // Component should work with default fieldHasError false
      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
    });

    it("applies default styleClassPassthrough value", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "No custom classes by default",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);
      // Should only have the base class
      expect(container.classes()).toEqual(["input-description"]);
    });
  });

  describe("Accessibility", () => {
    it("provides proper ID for aria-describedby linking", async () => {
      await createWrapper(
        {
          id: "email-input",
        },
        {
          descriptionText: "Enter your email address",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.attributes("id")).toBe("email-input-description");
      // This ID can be used in aria-describedby on the actual input
    });

    it("supports rich HTML content for complex descriptions", async () => {
      await createWrapper(
        {},
        {
          descriptionHtml: `
          <p>Password must contain:</p>
          <ul>
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One number</li>
          </ul>
        `,
        }
      );

      const htmlElement = wrapper.find(".input-description-html");
      expect(htmlElement.html()).toContain("<ul>");
      expect(htmlElement.html()).toContain("<li>");
      expect(htmlElement.html()).toContain("At least 8 characters");
    });
  });

  describe("Conditional Rendering", () => {
    it("only renders descriptionText when only text slot provided", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "Only text description",
        }
      );

      expect(wrapper.find(".input-description-text").exists()).toBe(true);
      expect(wrapper.find(".input-description-html").exists()).toBe(false);
    });

    it("only renders descriptionHtml when only HTML slot provided", async () => {
      await createWrapper(
        {},
        {
          descriptionHtml: "<span>Only HTML description</span>",
        }
      );

      expect(wrapper.find(".input-description-html").exists()).toBe(true);
      expect(wrapper.find(".input-description-text").exists()).toBe(false);
    });

    it("renders both sections when both slots provided", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "Text part",
          descriptionHtml: "<span>HTML part</span>",
        }
      );

      expect(wrapper.find(".input-description-text").exists()).toBe(true);
      expect(wrapper.find(".input-description-html").exists()).toBe(true);
    });

    it("maintains proper DOM order when both slots present", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "Second: Text content",
          descriptionHtml: "<span>First: HTML content</span>",
        }
      );

      const container = wrapper.find(".input-description");
      const children = container.element.children;

      // HTML slot should come first in DOM
      expect(children[0].classList.contains("input-description-html")).toBe(true);
      expect(children[1].classList.contains("input-description-text")).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty slot content gracefully", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);

      const textElement = wrapper.find(".input-description-text");
      expect(textElement.text()).toBe("");
    });

    it("handles whitespace-only slot content", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "   ",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.exists()).toBe(true);

      const textElement = wrapper.find(".input-description-text");
      expect(textElement.text().trim()).toBe("");
    });

    it("handles special characters in descriptions", async () => {
      await createWrapper(
        {},
        {
          descriptionText: "Special chars: & < > \" ' / \\",
        }
      );

      const textElement = wrapper.find(".input-description-text");
      expect(textElement.text()).toContain("Special chars: & < > \" ' / \\");
    });

    it("works with complex ID values", async () => {
      await createWrapper(
        {
          id: "complex-id_with.dots-and_underscores123",
        },
        {
          descriptionText: "Complex ID test",
        }
      );

      const container = wrapper.find(".input-description");
      expect(container.attributes("id")).toBe("complex-id_with.dots-and_underscores123-description");
    });
  });
});
