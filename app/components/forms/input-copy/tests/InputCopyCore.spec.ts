import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputCopyCore from "../InputCopyCore.vue";

const DEFAULT_PROPS = {
  id: "copy-input",
  value: "sk_live_abc123def456",
};

const createWrapper = async (props: Record<string, unknown> = {}) => {
  return mountSuspended(InputCopyCore, {
    props: { ...DEFAULT_PROPS, ...props },
  });
};

describe("InputCopyCore", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  describe("Snapshots", () => {
    it("default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("custom labels", async () => {
      wrapper = await createWrapper({ copyLabel: "Copy key", copiedLabel: "Key copied!" });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with styleClassPassthrough", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["my-copy-input"] });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // ─── Rendering ───────────────────────────────────────────────────────────

  describe("Rendering", () => {
    it("mounts without error", async () => {
      wrapper = await createWrapper();
      expect(wrapper.vm).toBeTruthy();
    });

    it("root element has input-copy-core class", async () => {
      wrapper = await createWrapper();
      expect(wrapper.classes()).toContain("input-copy-core");
    });

    it("root element has data-testid attribute", async () => {
      wrapper = await createWrapper();
      expect(wrapper.attributes("data-testid")).toBe("input-copy-core");
    });

    it("renders a readonly input", async () => {
      wrapper = await createWrapper();
      const input = wrapper.find(".input-copy-field");
      expect(input.exists()).toBe(true);
      expect(input.attributes("readonly")).toBeDefined();
    });

    it("input has aria-readonly set to true", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".input-copy-field").attributes("aria-readonly")).toBe("true");
    });

    it("input displays the value", async () => {
      wrapper = await createWrapper({ value: "my-license-key" });
      expect(wrapper.find(".input-copy-field").attributes("value")).toBe("my-license-key");
    });

    it("input has the correct id", async () => {
      wrapper = await createWrapper({ id: "my-input" });
      expect(wrapper.find(".input-copy-field").attributes("id")).toBe("my-input");
    });

    it("renders the copy button", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".input-copy-button").exists()).toBe(true);
    });

    it("copy button shows copyLabel by default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".input-copy-button").text()).toBe("Copy");
    });

    it("copy button shows custom copyLabel", async () => {
      wrapper = await createWrapper({ copyLabel: "Copy key" });
      expect(wrapper.find(".input-copy-button").text()).toBe("Copy key");
    });
  });

  // ─── Props ───────────────────────────────────────────────────────────────

  describe("Props", () => {
    it("styleClassPassthrough string is applied to root", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "my-class" });
      expect(wrapper.classes()).toContain("my-class");
    });

    it("styleClassPassthrough array is applied to root", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["class-a", "class-b"] });
      expect(wrapper.classes()).toContain("class-a");
      expect(wrapper.classes()).toContain("class-b");
    });

    it("updates classes when styleClassPassthrough prop changes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["original"] });
      expect(wrapper.classes()).toContain("original");
      await wrapper.setProps({ styleClassPassthrough: ["updated"] });
      expect(wrapper.classes()).not.toContain("original");
      expect(wrapper.classes()).toContain("updated");
    });
  });

  // ─── Copy behaviour ──────────────────────────────────────────────────────

  describe("Copy behaviour", () => {
    beforeEach(() => {
      vi.stubGlobal("navigator", {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    });

    it("calls navigator.clipboard.writeText with the value on click", async () => {
      wrapper = await createWrapper({ value: "test-key-123" });
      await wrapper.find(".input-copy-button").trigger("click");
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test-key-123");
    });

    it("adds copied class to root after clicking", async () => {
      wrapper = await createWrapper();
      await wrapper.find(".input-copy-button").trigger("click");
      await nextTick();
      expect(wrapper.classes()).toContain("copied");
    });

    it("button shows copiedLabel after clicking", async () => {
      wrapper = await createWrapper({ copiedLabel: "Done!" });
      await wrapper.find(".input-copy-button").trigger("click");
      await nextTick();
      expect(wrapper.find(".input-copy-button").text()).toBe("Done!");
    });

    it("button aria-label updates to copiedLabel after clicking", async () => {
      wrapper = await createWrapper({ copiedLabel: "Copied!" });
      await wrapper.find(".input-copy-button").trigger("click");
      await nextTick();
      expect(wrapper.find(".input-copy-button").attributes("aria-label")).toBe("Copied!");
    });

    it("emits copy event with value on successful copy", async () => {
      wrapper = await createWrapper({ value: "emit-test-key" });
      await wrapper.find(".input-copy-button").trigger("click");
      expect(wrapper.emitted("copy")).toBeTruthy();
      expect(wrapper.emitted("copy")?.[0]).toEqual(["emit-test-key"]);
    });

    it("removes copied class after feedbackDuration elapses", async () => {
      wrapper = await createWrapper({ feedbackDuration: 1000 });
      await wrapper.find(".input-copy-button").trigger("click");
      await nextTick();
      expect(wrapper.classes()).toContain("copied");
      await vi.advanceTimersByTimeAsync(1000);
      expect(wrapper.classes()).not.toContain("copied");
    });

    it("does not throw when clipboard is unavailable", async () => {
      vi.stubGlobal("navigator", {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error("Not allowed")),
        },
      });
      wrapper = await createWrapper();
      await expect(wrapper.find(".input-copy-button").trigger("click")).resolves.not.toThrow();
    });

    it("does not add copied class when clipboard fails", async () => {
      vi.stubGlobal("navigator", {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error("Not allowed")),
        },
      });
      wrapper = await createWrapper();
      await wrapper.find(".input-copy-button").trigger("click");
      await nextTick();
      expect(wrapper.classes()).not.toContain("copied");
    });
  });

  // ─── Accessibility ───────────────────────────────────────────────────────

  describe("Accessibility", () => {
    it("copy button has aria-label matching copyLabel by default", async () => {
      wrapper = await createWrapper({ copyLabel: "Copy" });
      expect(wrapper.find(".input-copy-button").attributes("aria-label")).toBe("Copy");
    });

    it("copy button type is button", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".input-copy-button").attributes("type")).toBe("button");
    });
  });
});
