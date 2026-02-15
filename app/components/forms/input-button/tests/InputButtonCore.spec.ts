import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputButtonCore from "../InputButtonCore.vue";

interface InputButtonCoreInstance {
  hasLeftSlot: boolean;
  hasRightSlot: boolean;
  hasIconOnlySlot: boolean;
  showFancyEffect: boolean;
  buttonClasses: string[];
  elementClasses: string;
}

// Mock useStyleClassPassthrough composable
vi.mock("#imports", () => ({
  useStyleClassPassthrough: vi.fn((classes) => ({
    elementClasses: { value: Array.isArray(classes) ? classes.join(" ") : classes || "" },
  })),
}));

describe.skip("InputButtonCore", () => {
  let wrapper: ReturnType<typeof mountSuspended>;
  let component: InputButtonCoreInstance;

  const createWrapper = async (props = {}) => {
    const defaultProps = {
      buttonText: "Click me",
      ...props,
    };

    wrapper = await mountSuspended(InputButtonCore, {
      props: defaultProps,
      slots: {
        // Default slots can be overridden by individual tests
      },
    });

    component = wrapper.vm as unknown as InputButtonCoreInstance;
    return wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe.skip("Component Rendering", () => {
    it("renders as a button element with correct structure", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.classes()).toContain("input-button-core");

      const buttonText = button.find(".button-text");
      expect(buttonText.exists()).toBe(true);
      expect(buttonText.text()).toBe("Click me");
    });

    it("renders with required accessibility attributes", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("button");
      expect(button.attributes("aria-disabled")).toBe("false");
    });

    it("renders with custom data-testid when provided", async () => {
      await createWrapper({ dataTestid: "custom-button" });

      const button = wrapper.find("button");
      expect(button.attributes("data-testid")).toBe("custom-button");
    });

    it("does not render data-testid when not provided", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.attributes("data-testid")).toBeUndefined();
    });
  });

  describe.skip("Props Handling", () => {
    it("handles type prop correctly", async () => {
      await createWrapper({ type: "submit" });

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("submit");
      expect(button.classes()).toContain("btn-submit");
    });

    it("handles readonly prop correctly", async () => {
      await createWrapper({ readonly: true });

      const button = wrapper.find("button");
      expect(button.attributes("readonly")).toBe("");
      expect(button.attributes("aria-disabled")).toBe("true");
    });

    it("applies theme data attribute", async () => {
      await createWrapper({ theme: "secondary" });

      const button = wrapper.find("button");
      expect(button.attributes("data-theme")).toBe("secondary");
    });

    it("applies size data attribute", async () => {
      await createWrapper({ size: "large" });

      const button = wrapper.find("button");
      expect(button.attributes("data-size")).toBe("large");
    });

    it("applies weight class to button text", async () => {
      await createWrapper({ weight: "wght-600" });

      const buttonText = wrapper.find(".button-text");
      expect(buttonText.classes()).toContain("wght-600");
    });

    it("handles styleClassPassthrough prop", async () => {
      await createWrapper({
        styleClassPassthrough: "custom-class another-class",
      });

      expect(component.elementClasses).toBe("custom-class another-class");
    });

    it("handles array styleClassPassthrough prop", async () => {
      await createWrapper({
        styleClassPassthrough: ["custom-class", "another-class"],
      });

      expect(component.elementClasses).toBe("custom-class another-class");
    });
  });

  describe.skip("Default Props", () => {
    it("applies correct default values", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("button");
      expect(button.attributes("data-theme")).toBe("primary");
      expect(button.attributes("data-size")).toBe("default");
      expect(button.attributes("readonly")).toBeUndefined();

      const buttonText = wrapper.find(".button-text");
      expect(buttonText.classes()).toContain("wght-400");
    });
  });

  describe.skip("Slots", () => {
    it("renders left slot when provided", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          buttonText: "Click me",
        },
        slots: {
          left: '<span data-testid="left-icon">←</span>',
        },
      });

      const leftIcon = wrapper.find(".btn-icon.left");
      expect(leftIcon.exists()).toBe(true);
      expect(leftIcon.find('[data-testid="left-icon"]').exists()).toBe(true);
    });

    it("renders right slot when provided", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          buttonText: "Click me",
        },
        slots: {
          right: '<span data-testid="right-icon">→</span>',
        },
      });

      const rightIcon = wrapper.find(".btn-icon.right");
      expect(rightIcon.exists()).toBe(true);
      expect(rightIcon.find('[data-testid="right-icon"]').exists()).toBe(true);
    });

    it("renders iconOnly slot when provided", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          buttonText: "Click me",
        },
        slots: {
          iconOnly: '<span data-testid="icon-only">⚡</span>',
        },
      });

      const iconOnly = wrapper.find(".btn-icon.icon-only");
      expect(iconOnly.exists()).toBe(true);
      expect(iconOnly.find('[data-testid="icon-only"]').exists()).toBe(true);

      const button = wrapper.find("button");
      expect(button.classes()).toContain("icon-only");
    });

    it("hides button text for screen readers when iconOnly slot is used", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          buttonText: "Click me",
        },
        slots: {
          iconOnly: '<span data-testid="icon-only">⚡</span>',
        },
      });

      const buttonText = wrapper.find(".button-text");
      expect(buttonText.classes()).toContain("sr-only");
    });

    it("does not render left/right slots when iconOnly slot is present", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          buttonText: "Click me",
        },
        slots: {
          left: '<span data-testid="left-icon">←</span>',
          right: '<span data-testid="right-icon">→</span>',
          iconOnly: '<span data-testid="icon-only">⚡</span>',
        },
      });

      expect(wrapper.find(".btn-icon.left").exists()).toBe(false);
      expect(wrapper.find(".btn-icon.right").exists()).toBe(false);
      expect(wrapper.find(".btn-icon.icon-only").exists()).toBe(true);
    });

    it("renders multiple slots correctly when iconOnly is not present", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          buttonText: "Click me",
        },
        slots: {
          left: '<span data-testid="left-icon">←</span>',
          right: '<span data-testid="right-icon">→</span>',
        },
      });

      const leftIcon = wrapper.find(".btn-icon.left");
      const rightIcon = wrapper.find(".btn-icon.right");

      expect(leftIcon.exists()).toBe(true);
      expect(rightIcon.exists()).toBe(true);
      expect(wrapper.find(".btn-icon.icon-only").exists()).toBe(false);
    });
  });

  describe.skip("Effects", () => {
    it("renders fancy effect when useEffect is true and effect is fancy", async () => {
      await createWrapper({
        useEffect: true,
        effect: "fancy",
      });

      const fancyEffect = wrapper.find(".fancy");
      expect(fancyEffect.exists()).toBe(true);
    });

    it("does not render fancy effect when useEffect is false", async () => {
      await createWrapper({
        useEffect: false,
        effect: "fancy",
      });

      const fancyEffect = wrapper.find(".fancy");
      expect(fancyEffect.exists()).toBe(false);
    });

    it("does not render fancy effect when effect is not fancy", async () => {
      await createWrapper({
        useEffect: true,
        effect: "pulse",
      });

      const fancyEffect = wrapper.find(".fancy");
      expect(fancyEffect.exists()).toBe(false);

      const button = wrapper.find("button");
      expect(button.classes()).toContain("pulse");
    });

    it("applies effect class when useEffect is true and effect is not fancy", async () => {
      await createWrapper({
        useEffect: true,
        effect: "pulse",
      });

      const button = wrapper.find("button");
      expect(button.classes()).toContain("pulse");
    });

    it("does not apply effect class when useEffect is false", async () => {
      await createWrapper({
        useEffect: false,
        effect: "pulse",
      });

      const button = wrapper.find("button");
      expect(button.classes()).not.toContain("pulse");
    });
  });

  describe.skip("Computed Properties", () => {
    it("correctly computes hasLeftSlot", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: { buttonText: "Test" },
        slots: { left: "<span>Left</span>" },
      });

      component = wrapper.vm as unknown as InputButtonCoreInstance;
      expect(component.hasLeftSlot).toBe(true);
    });

    it("correctly computes hasRightSlot", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: { buttonText: "Test" },
        slots: { right: "<span>Right</span>" },
      });

      component = wrapper.vm as unknown as InputButtonCoreInstance;
      expect(component.hasRightSlot).toBe(true);
    });

    it("correctly computes hasIconOnlySlot", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: { buttonText: "Test" },
        slots: { iconOnly: "<span>Icon</span>" },
      });

      component = wrapper.vm as unknown as InputButtonCoreInstance;
      expect(component.hasIconOnlySlot).toBe(true);
    });

    it("correctly computes showFancyEffect", async () => {
      await createWrapper({
        useEffect: true,
        effect: "fancy",
      });

      expect(component.showFancyEffect).toBe(true);
    });

    it("correctly computes buttonClasses with all combinations", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          variant: "primary",
          buttonText: "Test",
          hasPendingEffect: true,
          isPending: true,
          styleClassPassthrough: "custom-class",
        },
        slots: { iconOnly: "<span>Icon</span>" },
      });

      component = wrapper.vm as unknown as InputButtonCoreInstance;
      const expectedClasses = ["input-button-core", "primary", "pending-effect", "is-pending", "icon-only"];

      expect(component.buttonClasses).toEqual(expectedClasses);
    });
  });

  describe.skip("Button States", () => {
    it("handles pending state correctly", async () => {
      await createWrapper({ isPending: true });

      // Component should render normally but with pending prop
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
    });

    it("maintains button text visibility for regular buttons", async () => {
      await createWrapper();

      const buttonText = wrapper.find(".button-text");
      expect(buttonText.classes()).not.toContain("sr-only");
      expect(buttonText.text()).toBe("Click me");
    });
  });

  describe.skip("Accessibility", () => {
    it("provides proper accessibility for screen readers with iconOnly", async () => {
      wrapper = await mountSuspended(InputButtonCore, {
        props: {
          buttonText: "Save document",
        },
        slots: {
          iconOnly: '<span data-testid="save-icon">💾</span>',
        },
      });

      const buttonText = wrapper.find(".button-text");
      expect(buttonText.text()).toBe("Save document");
      expect(buttonText.classes()).toContain("sr-only");

      const button = wrapper.find("button");
      expect(button.attributes("aria-disabled")).toBe("false");
    });

    it("sets aria-disabled correctly for readonly buttons", async () => {
      await createWrapper({ readonly: true });

      const button = wrapper.find("button");
      expect(button.attributes("aria-disabled")).toBe("true");
      expect(button.attributes("readonly")).toBe("");
    });

    it("maintains proper button semantics", async () => {
      await createWrapper({
        type: "submit",
        buttonText: "Submit Form",
      });

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("submit");
      expect(button.text()).toContain("Submit Form");
    });
  });

  describe.skip("Edge Cases", () => {
    it("handles empty buttonText gracefully", async () => {
      await createWrapper({ buttonText: "" });

      const buttonText = wrapper.find(".button-text");
      expect(buttonText.exists()).toBe(true);
      expect(buttonText.text()).toBe("");
    });

    it("handles undefined effect gracefully", async () => {
      // When effect is undefined, it defaults to 'fancy' in the showFancyEffect computed
      await createWrapper({
        useEffect: false, // Set to false so fancy effect won't show
        effect: undefined as "fancy" | "pulse" | undefined,
      });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(wrapper.find(".fancy").exists()).toBe(false);
    });

    it("handles all button types correctly", async () => {
      const types = ["button", "submit", "reset"] as const;

      for (const type of types) {
        const testWrapper = await mountSuspended(InputButtonCore, {
          props: {
            buttonText: "Test",
            type,
          },
        });

        const button = testWrapper.find("button");
        expect(button.attributes("type")).toBe(type);

        testWrapper.unmount();
      }
    });

    it("handles complex slot combinations", async () => {
      // Test that iconOnly takes precedence over left/right slots
      wrapper = await mountSuspended(InputButtonCore, {
        props: { buttonText: "Test" },
        slots: {
          left: "<span>Should not render</span>",
          right: "<span>Should not render</span>",
          iconOnly: '<span data-testid="icon">Icon</span>',
        },
      });

      expect(wrapper.find(".btn-icon.left").exists()).toBe(false);
      expect(wrapper.find(".btn-icon.right").exists()).toBe(false);
      expect(wrapper.find(".btn-icon.icon-only").exists()).toBe(true);
      expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
    });
  });
});
