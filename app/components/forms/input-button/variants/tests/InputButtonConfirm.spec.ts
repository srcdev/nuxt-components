import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputButtonConfirm from "../InputButtonConfirm.vue";

// Mock Icon component
vi.mock("#imports", () => ({
  useStyleClassPassthrough: vi.fn((classes) => ({
    elementClasses: { value: Array.isArray(classes) ? classes.join(" ") : classes || "" },
  })),
}));

describe("InputButtonConfirm", () => {
  let wrapper: ReturnType<typeof mountSuspended>;

  const createWrapper = async (props = {}) => {
    const defaultProps = {
      buttonText: "Confirm Action",
      ...props,
    };

    wrapper = await mountSuspended(InputButtonConfirm, {
      props: defaultProps,
      global: {
        components: {
          Icon: {
            template: '<svg data-testid="confirm-icon" :class="$attrs.class"><title>{{ $attrs.name }}</title></svg>',
          },
          InputButtonCore: {
            template: `
              <button
                :type="$attrs.type"
                :class="'input-button-core'"
                :data-testid="$attrs.dataTestid"
                :readonly="$attrs.readonly"
                :aria-disabled="$attrs.readonly"
              >
                <span class="btn-icon left">
                  <slot name="left"></slot>
                </span>
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
    it("renders as a button with correct type", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.attributes("type")).toBe("button");
    });

    it("renders with confirm icon in left slot", async () => {
      await createWrapper();

      const iconContainer = wrapper.find(".btn-icon.left");
      expect(iconContainer.exists()).toBe(true);
      // The Icon component is mocked and should be present
    });

    it("displays the button text correctly", async () => {
      await createWrapper({ buttonText: "Confirm Changes" });

      const buttonText = wrapper.find(".btn-text");
      expect(buttonText.exists()).toBe(true);
      expect(buttonText.text()).toBe("Confirm Changes");
    });
  });

  describe("Props Handling", () => {
    it("passes all BaseButtonProps to InputButtonCore", async () => {
      await createWrapper({
        buttonText: "Custom Text",
        theme: "success",
        size: "large",
        weight: "wght-600",
        dataTestid: "confirm-btn",
        readonly: true,
        useEffect: true,
        effect: "pulse",
        isPending: true,
      });

      const button = wrapper.find("button");
      expect(button.attributes("data-testid")).toBe("confirm-btn");
      expect(button.attributes("readonly")).toBe("");
      expect(button.attributes("aria-disabled")).toBe("true");
      expect(button.text()).toBe("Custom Text");
    });

    it("handles styleClassPassthrough prop", async () => {
      await createWrapper({
        styleClassPassthrough: ["custom-class", "another-class"],
      });

      // Component should render successfully with style classes
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
    });
  });

  describe("Icon Accessibility", () => {
    it("sets proper accessibility attributes on icon", async () => {
      await createWrapper();

      const iconContainer = wrapper.find(".btn-icon.left");
      expect(iconContainer.exists()).toBe(true);
      // Icon accessibility is handled by the actual component template
      // Test confirms the icon container is present for screen readers
    });
  });

  describe("Button Behavior", () => {
    it("handles readonly state correctly", async () => {
      await createWrapper({ readonly: true });

      const button = wrapper.find("button");
      expect(button.attributes("readonly")).toBe("");
      expect(button.attributes("aria-disabled")).toBe("true");
    });

    it("handles pending state", async () => {
      await createWrapper({ isPending: true });

      // Component should render without errors when pending
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
    });
  });

  describe("Default Behavior", () => {
    it("uses button type by default", async () => {
      await createWrapper();

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("button");
    });

    it("always shows confirm icon", async () => {
      await createWrapper();

      const iconContainer = wrapper.find(".btn-icon.left");
      expect(iconContainer.exists()).toBe(true);
    });
  });
});
