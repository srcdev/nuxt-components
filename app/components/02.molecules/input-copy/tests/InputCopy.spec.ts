import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import InputCopy from "../InputCopy.vue";

let wrapper: VueWrapper | undefined;
let writeText: ReturnType<typeof vi.fn>;

async function mountCopy(props: Record<string, unknown> = {}) {
  wrapper = await mountSuspended(InputCopy, { props: { value: "test-key-123", ...props } });
  return wrapper;
}

async function clickCopy(w: VueWrapper) {
  await w.find("button").trigger("click");
  await nextTick();
  await nextTick();
}

describe("InputCopy", () => {
  beforeEach(() => {
    writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders a readonly input with the value", async () => {
      const w = await mountCopy();
      const input = w.find("input").element as HTMLInputElement;
      expect(input.value).toBe("test-key-123");
      expect(input.readOnly).toBe(true);
    });

    it("renders the root class and styleClassPassthrough classes", async () => {
      const w = await mountCopy({ styleClassPassthrough: ["custom-class", "another-class"] });
      expect(w.classes()).toContain("input-copy");
      expect(w.classes()).toContain("custom-class");
      expect(w.classes()).toContain("another-class");
    });

    it("updates passthrough classes when the prop changes", async () => {
      const w = await mountCopy({ styleClassPassthrough: ["first"] });
      await w.setProps({ styleClassPassthrough: ["second"] });
      expect(w.classes()).toContain("second");
      expect(w.classes()).not.toContain("first");
    });

    it("renders the copy button as an inline InputButton", async () => {
      const w = await mountCopy();
      const button = w.find("button");
      expect(button.classes()).toContain("input-button");
      expect(button.classes()).toContain("inline");
      expect(button.classes()).toContain("input-copy__button");
      expect(button.attributes("type")).toBe("button");
    });

    it("renders default and custom button text", async () => {
      const w = await mountCopy();
      expect(w.find("button").text()).toContain("Copy");
      await w.setProps({ buttonText: "Copy to clipboard" });
      expect(w.find("button").text()).toContain("Copy to clipboard");
    });

    it("renders the description only when provided", async () => {
      const w = await mountCopy();
      expect(w.find(".input-copy__description").exists()).toBe(false);
      await w.setProps({ description: "This is your license key." });
      expect(w.find(".input-copy__description").text()).toBe("This is your license key.");
    });

    it("renders the icon in the button", async () => {
      const w = await mountCopy();
      expect(w.find("button .input-copy__icon").exists()).toBe(true);
    });
  });

  describe("id and name", () => {
    it("auto-generates an id and mirrors it as the name", async () => {
      const w = await mountCopy();
      const input = w.find("input");
      expect(input.attributes("id")).toBeTruthy();
      expect(input.attributes("name")).toBe(input.attributes("id"));
    });

    it("uses the provided id, and name over the id", async () => {
      const w = await mountCopy({ id: "license-key-input" });
      expect(w.find("input").attributes("id")).toBe("license-key-input");
      expect(w.find("input").attributes("name")).toBe("license-key-input");
      await w.setProps({ name: "licenseKey" });
      expect(w.find("input").attributes("name")).toBe("licenseKey");
    });
  });

  describe("accessibility", () => {
    it("labels the input from label, with ariaLabel taking precedence", async () => {
      const w = await mountCopy({ label: "License key" });
      expect(w.find("input").attributes("aria-label")).toBe("License key");
      await w.setProps({ ariaLabel: "Unique license identifier" });
      expect(w.find("input").attributes("aria-label")).toBe("Unique license identifier");
    });

    it("builds a default button aria-label from the label", async () => {
      const w = await mountCopy({ label: "API token" });
      expect(w.find("button").attributes("aria-label")).toBe("Copy API token to clipboard");
    });

    it("uses buttonAriaLabel when provided", async () => {
      const w = await mountCopy({ label: "API token", buttonAriaLabel: "API-Token kopieren" });
      expect(w.find("button").attributes("aria-label")).toBe("API-Token kopieren");
    });

    it("links the description to the input with aria-describedby", async () => {
      const w = await mountCopy({ id: "key", description: "Keep it safe." });
      expect(w.find("input").attributes("aria-describedby")).toBe("key-description");
      expect(w.find("#key-description").text()).toBe("Keep it safe.");
    });

    it("has no aria-describedby without a description", async () => {
      const w = await mountCopy();
      expect(w.find("input").attributes("aria-describedby")).toBeUndefined();
    });

    it("has an empty status region until a copy succeeds", async () => {
      const w = await mountCopy();
      expect(w.find("[role='status']").text()).toBe("");
    });
  });

  describe("disabled", () => {
    it("disables the button when isDisabled is true", async () => {
      const w = await mountCopy({ isDisabled: true });
      expect(w.find("button").attributes("disabled")).toBeDefined();
    });

    it("leaves the button enabled by default", async () => {
      const w = await mountCopy();
      expect(w.find("button").attributes("disabled")).toBeUndefined();
    });
  });

  describe("copying", () => {
    it("writes the value to the clipboard and emits copy and copied", async () => {
      const w = await mountCopy();
      await clickCopy(w);
      expect(writeText).toHaveBeenCalledWith("test-key-123");
      expect(w.emitted("copy")).toEqual([["test-key-123"]]);
      expect(w.emitted("copied")).toEqual([["test-key-123"]]);
    });

    it("shows copiedText, announces it and adds the copied class", async () => {
      const w = await mountCopy({ copiedText: "Kopiert!" });
      await clickCopy(w);
      expect(w.find("button").text()).toContain("Kopiert!");
      expect(w.find("[role='status']").text()).toBe("Kopiert!");
      expect(w.classes()).toContain("input-copy-copied");
    });

    it("keeps the button focusable but aria-disabled while copied, ignoring repeat clicks", async () => {
      const w = await mountCopy();
      await clickCopy(w);
      const button = w.find("button");
      expect(button.attributes("disabled")).toBeUndefined();
      expect(button.attributes("aria-disabled")).toBe("true");
      await clickCopy(w);
      expect(writeText).toHaveBeenCalledOnce();
    });

    it("resets after copiedDuration", async () => {
      const w = await mountCopy({ copiedDuration: 1000 });
      await clickCopy(w);
      vi.advanceTimersByTime(999);
      await nextTick();
      expect(w.classes()).toContain("input-copy-copied");
      vi.advanceTimersByTime(1);
      await nextTick();
      expect(w.classes()).not.toContain("input-copy-copied");
      expect(w.find("button").text()).toContain("Copy");
      expect(w.find("button").attributes("aria-disabled")).toBe("false");
    });

    it("logs and stays in the resting state when the clipboard write fails", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      writeText.mockImplementation(() => Promise.reject(new Error("denied")));
      const w = await mountCopy();
      await clickCopy(w);
      expect(errorSpy).toHaveBeenCalled();
      expect(w.emitted("copied")).toBeUndefined();
      expect(w.classes()).not.toContain("input-copy-copied");
    });
  });
});
