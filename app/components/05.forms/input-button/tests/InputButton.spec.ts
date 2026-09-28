// InputButton.test.ts
import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputButton from "../InputButton.vue";
import { defineComponent, nextTick, ref } from "vue";

// --- Types ---
interface InputButtonInstance {
  hasLeftSlot: () => boolean;
  hasRightSlot: () => boolean;
  hasIconOnlySlot: () => boolean;
  buttonClasses: () => unknown[];
}

// --- Helpers ---
const createWrapper = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
  return mountSuspended(InputButton, {
    props: { buttonText: "Click me", ...props },
    slots,
  });
};

describe("InputButton", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("primary (default)", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("secondary variant", async () => {
      wrapper = await createWrapper({ variant: "secondary" });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("tertiary variant", async () => {
      wrapper = await createWrapper({ variant: "tertiary" });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("pill", async () => {
      wrapper = await createWrapper({ isPill: true });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("pending state", async () => {
      wrapper = await createWrapper({ isPending: true, hasPendingEffect: true });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("readonly", async () => {
      wrapper = await createWrapper({ readonly: true });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with left and right slots", async () => {
      wrapper = await createWrapper(
        {},
        {
          left: '<span data-testid="left-icon">←</span>',
          right: '<span data-testid="right-icon">→</span>',
        }
      );
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("icon-only slot", async () => {
      wrapper = await createWrapper({}, { iconOnly: '<span data-testid="icon-only">⚡</span>' });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // -------------------------
  // Structure & Rendering
  // -------------------------
  describe("Rendering", () => {
    it("renders a button with correct base classes and testid", async () => {
      wrapper = await createWrapper();
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.classes()).toContain("input-button");
      expect(button.attributes("data-testid")).toBe("input-button");
    });

    it("renders button text", async () => {
      wrapper = await createWrapper({ buttonText: "Hello" });
      expect(wrapper.find(".button-text").text()).toBe("Hello");
    });

    it("handles empty buttonText gracefully", async () => {
      wrapper = await createWrapper({ buttonText: "" });
      const buttonText = wrapper.find(".button-text");
      expect(buttonText.exists()).toBe(true);
      expect(buttonText.text()).toBe("");
    });
  });

  // -------------------------
  // Props
  // -------------------------
  describe("Props", () => {
    it("applies variant class", async () => {
      for (const variant of ["primary", "secondary", "tertiary"] as const) {
        const w = await mountSuspended(InputButton, {
          props: { buttonText: "Test", variant },
        });
        expect(w.find("button").classes()).toContain(variant);
        w.unmount();
      }
    });

    it("applies pill class when isPill is true", async () => {
      wrapper = await createWrapper({ isPill: true });
      expect(wrapper.find("button").classes()).toContain("pill");
    });

    it("does not apply pill class by default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find("button").classes()).not.toContain("pill");
    });

    it("applies is-pending and pending-effect classes", async () => {
      wrapper = await createWrapper({ isPending: true, hasPendingEffect: true });
      const classes = wrapper.find("button").classes();
      expect(classes).toContain("is-pending");
      expect(classes).toContain("pending-effect");
    });

    it("applies correct type attribute", async () => {
      for (const type of ["button", "submit", "reset"] as const) {
        const w = await mountSuspended(InputButton, {
          props: { buttonText: "Test", type },
        });
        expect(w.find("button").attributes("type")).toBe(type);
        w.unmount();
      }
    });

    it("applies theme as data-theme attribute", async () => {
      wrapper = await createWrapper({ theme: "secondary" });
      expect(wrapper.find("button").attributes("data-theme")).toBe("secondary");
    });

    it("passes styleClassPassthrough to the button", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "custom-class" });
      expect(wrapper.find("button").classes()).toContain("custom-class");
    });

    it("passes array styleClassPassthrough to the button", async () => {
      wrapper = await createWrapper({
        styleClassPassthrough: ["custom-class", "another-class"],
      });
      const classes = wrapper.find("button").classes();
      expect(classes).toContain("custom-class");
      expect(classes).toContain("another-class");
    });
  });

  // -------------------------
  // Accessibility
  // -------------------------
  describe("Accessibility", () => {
    it("sets aria-disabled to false by default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find("button").attributes("aria-disabled")).toBe("false");
    });

    it("sets aria-disabled and readonly attr when readonly", async () => {
      wrapper = await createWrapper({ readonly: true });
      const button = wrapper.find("button");
      expect(button.attributes("aria-disabled")).toBe("true");
      expect(button.attributes("readonly")).toBeDefined();
    });

    it("keeps button text visible (not sr-only) by default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".button-text").classes()).not.toContain("sr-only");
    });

    it("makes button text sr-only with iconOnly slot, but keeps it in DOM for screen readers", async () => {
      wrapper = await createWrapper({ buttonText: "Save document" }, { iconOnly: "<span>💾</span>" });
      const buttonText = wrapper.find(".button-text");
      expect(buttonText.text()).toBe("Save document");
      expect(buttonText.classes()).toContain("sr-only");
    });
  });

  // -------------------------
  // Slots
  // -------------------------
  describe("Slots", () => {
    it("renders left slot", async () => {
      wrapper = await createWrapper({}, { left: '<span data-testid="left-icon">←</span>' });
      expect(wrapper.find(".btn-icon.left").exists()).toBe(true);
      expect(wrapper.find('[data-testid="left-icon"]').exists()).toBe(true);
    });

    it("renders right slot", async () => {
      wrapper = await createWrapper({}, { right: '<span data-testid="right-icon">→</span>' });
      expect(wrapper.find(".btn-icon.right").exists()).toBe(true);
      expect(wrapper.find('[data-testid="right-icon"]').exists()).toBe(true);
    });

    it("renders iconOnly slot and adds icon-only class to button", async () => {
      wrapper = await createWrapper({}, { iconOnly: '<span data-testid="icon-only">⚡</span>' });
      expect(wrapper.find(".btn-icon.icon-only").exists()).toBe(true);
      expect(wrapper.find("button").classes()).toContain("icon-only");
    });

    it("iconOnly suppresses left and right slots", async () => {
      wrapper = await createWrapper(
        {},
        {
          left: '<span data-testid="left">←</span>',
          right: '<span data-testid="right">→</span>',
          iconOnly: '<span data-testid="icon">⚡</span>',
        }
      );
      expect(wrapper.find(".btn-icon.left").exists()).toBe(false);
      expect(wrapper.find(".btn-icon.right").exists()).toBe(false);
      expect(wrapper.find(".btn-icon.icon-only").exists()).toBe(true);
    });

    it("renders left and right slots together when no iconOnly", async () => {
      wrapper = await createWrapper(
        {},
        {
          left: '<span data-testid="left">←</span>',
          right: '<span data-testid="right">→</span>',
        }
      );
      expect(wrapper.find(".btn-icon.left").exists()).toBe(true);
      expect(wrapper.find(".btn-icon.right").exists()).toBe(true);
      expect(wrapper.find(".btn-icon.icon-only").exists()).toBe(false);
    });
  });

  // -------------------------
  // Link rendering
  // -------------------------
  describe("Link rendering", () => {
    it("renders a plain anchor for a non-internal href", async () => {
      wrapper = await createWrapper({ href: "https://example.com" });
      const link = wrapper.find("a");
      expect(link.exists()).toBe(true);
      expect(link.attributes("href")).toBe("https://example.com");
    });

    it("renders a real anchor with the exact href for a '/'-prefixed href when external is true", async () => {
      // Regression test: InputButton used to always route a leading-"/" href through
      // NuxtLink (client-side router.push), which silently fails for non-page paths like a
      // Nitro server route ("/api/auth/github") since no Vue Router route matches it. The
      // `external` prop forces a real anchor so the browser makes an actual request instead.
      wrapper = await createWrapper({ href: "/api/auth/github", external: true });
      const link = wrapper.find("a");
      expect(link.exists()).toBe(true);
      expect(link.attributes("href")).toBe("/api/auth/github");
    });

    it("applies the is-link class for a link", async () => {
      wrapper = await createWrapper({ href: "/api/auth/github", external: true });
      expect(wrapper.find("a").classes()).toContain("is-link");
    });
  });

  // -------------------------
  // Computed (vm internals)
  // -------------------------
  describe("Computed properties", () => {
    it("hasLeftSlot is true when left slot provided without iconOnly", async () => {
      wrapper = await createWrapper({}, { left: "<span>L</span>" });
      expect((wrapper.vm as unknown as InputButtonInstance).hasLeftSlot()).toBe(true);
    });

    it("hasLeftSlot is false when iconOnly is also provided", async () => {
      wrapper = await createWrapper({}, { left: "<span>L</span>", iconOnly: "<span>I</span>" });
      expect((wrapper.vm as unknown as InputButtonInstance).hasLeftSlot()).toBe(false);
    });

    it("hasRightSlot is true when right slot provided without iconOnly", async () => {
      wrapper = await createWrapper({}, { right: "<span>R</span>" });
      expect((wrapper.vm as unknown as InputButtonInstance).hasRightSlot()).toBe(true);
    });

    it("hasIconOnlySlot is true when iconOnly slot provided", async () => {
      wrapper = await createWrapper({}, { iconOnly: "<span>I</span>" });
      expect((wrapper.vm as unknown as InputButtonInstance).hasIconOnlySlot()).toBe(true);
    });
  });
});

describe("InputButton slot toggling", () => {
  it("adds and removes the icon-only class when the iconOnly slot changes after mount", async () => {
    const Host = defineComponent({
      components: { InputButton },
      setup() {
        return { iconOnly: ref(false) };
      },
      template: `
        <InputButton button-text="Close">
          <template v-if="iconOnly" #iconOnly><span>×</span></template>
        </InputButton>
      `,
    });
    const wrapper = await mountSuspended(Host);
    const button = () => wrapper.find(".input-button");
    expect(button().classes()).not.toContain("icon-only");
    (wrapper.vm as unknown as { iconOnly: boolean }).iconOnly = true;
    await nextTick();
    expect(button().classes()).toContain("icon-only");
    expect(wrapper.find(".button-text").classes()).toContain("sr-only");
  });
});

describe("InputButton readonly and reactivity", () => {
  it("does not fire a consumer click handler while readonly (keyboard activation included)", async () => {
    const onClick = vi.fn();
    const wrapper = await mountSuspended(InputButton, {
      props: { buttonText: "Save", readonly: true },
      attrs: { onClick },
    });
    await wrapper.trigger("click");
    expect(onClick).not.toHaveBeenCalled();
    expect(wrapper.attributes("aria-disabled")).toBe("true");
  });

  it("fires the click handler when not readonly", async () => {
    const onClick = vi.fn();
    const wrapper = await mountSuspended(InputButton, {
      props: { buttonText: "Save" },
      attrs: { onClick },
    });
    await wrapper.trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountSuspended(InputButton, {
      props: { buttonText: "Save", styleClassPassthrough: ["original"] },
    });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
