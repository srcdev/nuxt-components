import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import DisplayPrompt from "../DisplayPrompt.vue";

const { useAppConfigMock } = vi.hoisted(() => ({
  // icon: {} is required — @nuxt/icon reads useAppConfig().icon.collections internally.
  useAppConfigMock: vi.fn(() => ({ srcdev: undefined as Record<string, unknown> | undefined, icon: {} as object })),
}));

mockNuxtImport("useAppConfig", () => useAppConfigMock);

function root(wrapper: Awaited<ReturnType<typeof mountSuspended<typeof DisplayPrompt>>>) {
  return wrapper.find(".display-prompt-core");
}

function wrapper(w: Awaited<ReturnType<typeof mountSuspended<typeof DisplayPrompt>>>) {
  return w.find("[data-test-id='display-prompt']");
}

describe("DisplayPrompt", () => {
  // ─── Mount ────────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(w.vm).toBeTruthy();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders the root element with class display-prompt-core", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(root(w).exists()).toBe(true);
  });

  it("is visible by default (no closed class)", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(root(w).classes()).not.toContain("closed");
  });

  it("has tabindex='0' on the root element", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(root(w).attributes("tabindex")).toBe("0");
  });

  // ─── data-theme ───────────────────────────────────────────────────────────

  it.each(["info", "success", "warning", "error"] as const)(
    "sets data-theme='%s' on the wrapper",
    async (theme) => {
      const w = await mountSuspended(DisplayPrompt, { props: { theme } });
      expect(wrapper(w).attributes("data-theme")).toBe(theme);
    }
  );

  it("defaults to data-theme='info' when no theme prop is provided", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(wrapper(w).attributes("data-theme")).toBe("info");
  });

  // ─── data-test-id ─────────────────────────────────────────────────────────

  it.each(["info", "success", "warning", "error"] as const)(
    "sets data-test-id reflecting the theme on the root element",
    async (theme) => {
      const w = await mountSuspended(DisplayPrompt, { props: { theme } });
      expect(root(w).attributes("data-test-id")).toBe(`display-prompt-core-${theme}`);
    }
  );

  // ─── Icon ─────────────────────────────────────────────────────────────────

  it("renders the icon region", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(w.find("[data-test-id='alert-icon']").exists()).toBe(true);
  });

  it("renders a custom icon via the customDecoratorIcon slot", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      slots: { customDecoratorIcon: '<span class="custom-icon">★</span>' },
    });
    expect(w.find(".custom-icon").exists()).toBe(true);
  });

  // ─── Slots ────────────────────────────────────────────────────────────────

  it("renders title slot content", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      slots: { title: "Important notice" },
    });
    expect(w.find("[data-test-id='alert-title']").text()).toContain("Important notice");
  });

  it("renders content slot when provided", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      slots: { content: "Detailed explanation here" },
    });
    expect(w.find("[data-test-id='alert-content']").exists()).toBe(true);
    expect(w.find("[data-test-id='alert-content']").text()).toContain("Detailed explanation here");
  });

  it("does not render content element when content slot is empty", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(w.find("[data-test-id='alert-content']").exists()).toBe(false);
  });

  // ─── Dismiss button ───────────────────────────────────────────────────────

  it("does not render the dismiss button when dismissible is false", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: false } });
    expect(w.find("[data-test-id='alert-dismiss']").exists()).toBe(false);
  });

  it("renders the dismiss button when dismissible is true", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true } });
    expect(w.find("[data-test-id='alert-dismiss']").exists()).toBe(true);
  });

  // ─── Dismiss behaviour (no parent model) ─────────────────────────────────

  it("adds the closed class after the dismiss button is clicked", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true } });
    await w.find("[data-test-id='alert-dismiss']").trigger("click");
    await nextTick();
    expect(root(w).classes()).toContain("closed");
  });

  // ─── Dismiss behaviour (with parent model) ────────────────────────────────

  it("emits update:modelValue=false when clicked with modelValue=true", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      props: { dismissible: true, modelValue: true },
    });
    await w.find("[data-test-id='alert-dismiss']").trigger("click");
    await nextTick();
    const emitted = w.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([false]);
  });

  it("does not add the closed class when dismissed via parent model", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      props: { dismissible: true, modelValue: true },
    });
    await w.find("[data-test-id='alert-dismiss']").trigger("click");
    await nextTick();
    // componentOpen is unchanged — parent controls visibility via modelValue
    expect(root(w).classes()).not.toContain("closed");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a styleClassPassthrough string class to the wrapper", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      props: { styleClassPassthrough: "outlined" },
    });
    expect(wrapper(w).classes()).toContain("outlined");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      props: { styleClassPassthrough: ["dark", "outlined"] },
    });
    expect(wrapper(w).classes()).toContain("dark");
    expect(wrapper(w).classes()).toContain("outlined");
  });

  // ─── app.config resolution ────────────────────────────────────────────────

  describe("app.config resolution", () => {
    beforeEach(() => {
      useAppConfigMock.mockReturnValue({ srcdev: undefined, icon: {} });
    });

    it("uses hardcoded fallbacks when app.config has no displayPrompt key", async () => {
      const w = await mountSuspended(DisplayPrompt);
      expect(wrapper(w).attributes("data-theme")).toBe("info");
      expect(root(w).attributes("data-test-id")).toBe("display-prompt-core-info");
      expect(w.find("[data-test-id='alert-dismiss']").exists()).toBe(false);
    });

    it("uses app.config values when no props are supplied", async () => {
      useAppConfigMock.mockReturnValue({
        icon: {},
        srcdev: { displayPrompt: { theme: "success", dismissible: true } },
      });
      const w = await mountSuspended(DisplayPrompt);
      expect(wrapper(w).attributes("data-theme")).toBe("success");
      expect(root(w).attributes("data-test-id")).toBe("display-prompt-core-success");
      expect(w.find("[data-test-id='alert-dismiss']").exists()).toBe(true);
    });

    it("explicit props take precedence over app.config", async () => {
      useAppConfigMock.mockReturnValue({
        icon: {},
        srcdev: { displayPrompt: { theme: "warning", dismissible: true } },
      });
      const w = await mountSuspended(DisplayPrompt, {
        props: { theme: "error", dismissible: false },
      });
      expect(wrapper(w).attributes("data-theme")).toBe("error");
      expect(w.find("[data-test-id='alert-dismiss']").exists()).toBe(false);
    });
  });
});
