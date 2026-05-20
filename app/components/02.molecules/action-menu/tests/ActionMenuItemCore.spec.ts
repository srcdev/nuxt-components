import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import ActionMenuItemCore from "../ActionMenuItemCore.vue";

// --- Helpers ---
const createWrapper = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
  return mountSuspended(ActionMenuItemCore, {
    props: { label: "Edit item", ...props },
    slots,
  });
};

describe("ActionMenuItemCore", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as never);
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("default button (no href)", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with icon slot", async () => {
      wrapper = await createWrapper({}, { icon: '<span data-testid="test-icon">⚡</span>' });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("as external link", async () => {
      wrapper = await createWrapper({ href: "https://example.com" });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("as internal link", async () => {
      wrapper = await createWrapper({ href: "/about" });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with styleClassPassthrough", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["custom-class", "another-class"] });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // -------------------------
  // Rendering — root element
  // -------------------------
  describe("Root element", () => {
    it("renders as <button> when no href is provided", async () => {
      wrapper = await createWrapper();
      expect(wrapper.element.tagName).toBe("BUTTON");
    });

    it("sets type='button' on the button element", async () => {
      wrapper = await createWrapper();
      expect(wrapper.attributes("type")).toBe("button");
    });

    it("renders as <a> when an external href is provided", async () => {
      wrapper = await createWrapper({ href: "https://example.com" });
      expect(wrapper.element.tagName).toBe("A");
      expect(wrapper.attributes("href")).toBe("https://example.com");
    });

    it("renders as NuxtLink (resolves to <a>) when an internal href is provided", async () => {
      wrapper = await createWrapper({ href: "/about" });
      // NuxtLink resolves to <a> in test environment
      expect(wrapper.element.tagName).toBe("A");
      expect(wrapper.attributes("href")).toBe("/about");
    });

    it("does not set type on link elements", async () => {
      wrapper = await createWrapper({ href: "https://example.com" });
      expect(wrapper.attributes("type")).toBeUndefined();
    });

    it("does not set href on button elements", async () => {
      wrapper = await createWrapper();
      expect(wrapper.attributes("href")).toBeUndefined();
    });

    it("has role='menuitem'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.attributes("role")).toBe("menuitem");
    });

    it("has class 'action-menu-item-core'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.classes()).toContain("action-menu-item-core");
    });
  });

  // -------------------------
  // Label
  // -------------------------
  describe("Label", () => {
    it("renders the label text", async () => {
      wrapper = await createWrapper({ label: "Delete record" });
      expect(wrapper.find(".action-menu-item-label").text()).toBe("Delete record");
    });
  });

  // -------------------------
  // Icon slot
  // -------------------------
  describe("Icon slot", () => {
    it("renders the icon slot when provided", async () => {
      wrapper = await createWrapper({}, { icon: '<span data-testid="test-icon">⚡</span>' });
      const iconWrapper = wrapper.find(".action-menu-item-icon");
      expect(iconWrapper.exists()).toBe(true);
      expect(iconWrapper.find('[data-testid="test-icon"]').exists()).toBe(true);
    });

    it("does not render icon wrapper when icon slot is absent", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-item-icon").exists()).toBe(false);
    });

    it("icon wrapper has aria-hidden='true'", async () => {
      wrapper = await createWrapper({}, { icon: '<span>⚡</span>' });
      expect(wrapper.find(".action-menu-item-icon").attributes("aria-hidden")).toBe("true");
    });
  });

  // -------------------------
  // Arrow
  // -------------------------
  describe("Arrow", () => {
    it("always renders the arrow element", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-item-arrow").exists()).toBe(true);
    });

    it("arrow element has aria-hidden='true'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-item-arrow").attributes("aria-hidden")).toBe("true");
    });
  });

  // -------------------------
  // Events
  // -------------------------
  describe("Events", () => {
    it("emits 'click' when the button is clicked", async () => {
      wrapper = await createWrapper();
      await wrapper.trigger("click");
      expect(wrapper.emitted("click")).toHaveLength(1);
    });

    it("emits 'click' with the MouseEvent as payload", async () => {
      wrapper = await createWrapper();
      await wrapper.trigger("click");
      const emitted = wrapper.emitted("click");
      expect(emitted![0]![0]).toBeInstanceOf(MouseEvent);
    });

    it("emits 'click' when rendered as a link", async () => {
      wrapper = await createWrapper({ href: "https://example.com" });
      await wrapper.trigger("click");
      expect(wrapper.emitted("click")).toHaveLength(1);
    });
  });

  // -------------------------
  // styleClassPassthrough
  // -------------------------
  describe("styleClassPassthrough", () => {
    it("applies a string class", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "my-custom-class" });
      expect(wrapper.classes()).toContain("my-custom-class");
    });

    it("applies an array of classes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["class-a", "class-b"] });
      expect(wrapper.classes()).toContain("class-a");
      expect(wrapper.classes()).toContain("class-b");
    });

    it("updates classes when styleClassPassthrough prop changes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "initial-class" });
      expect(wrapper.classes()).toContain("initial-class");

      await wrapper.setProps({ styleClassPassthrough: "updated-class" });
      await nextTick();
      expect(wrapper.classes()).toContain("updated-class");
    });
  });
});
