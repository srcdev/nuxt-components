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
  return wrapper.find(".display-prompt");
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

  it("renders the root element with class display-prompt", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(root(w).exists()).toBe(true);
  });

  it("is open by default (data-state=open)", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(root(w).attributes("data-state")).toBe("open");
  });

  it("is not in the tab order by default", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(root(w).attributes("tabindex")).toBeUndefined();
  });

  it("is programmatically focusable (tabindex=-1) when useAutoFocus is on", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { useAutoFocus: true } });
    expect(root(w).attributes("tabindex")).toBe("-1");
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
      expect(root(w).attributes("data-test-id")).toBe(`display-prompt-${theme}`);
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

  it("does not render the title element when the title slot is not provided", async () => {
    const w = await mountSuspended(DisplayPrompt, { slots: { content: "x" } });
    expect(w.find("[data-test-id='alert-title']").exists()).toBe(false);
  });

  it("renders HTML-like slot text as plain text", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      slots: { title: () => "<script>alert('xss')</script>" },
    });
    expect(w.find("[data-test-id='alert-title'] script").exists()).toBe(false);
    expect(w.find("[data-test-id='alert-title']").text()).toContain("<script>");
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

  it("sets data-state=closed after the dismiss button is clicked", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true } });
    await w.find("[data-test-id='alert-dismiss']").trigger("click");
    await nextTick();
    expect(root(w).attributes("data-state")).toBe("closed");
  });

  it("makes the closed prompt inert so its controls leave the tab order", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true } });
    expect(root(w).attributes("inert")).toBeUndefined();
    await w.find("[data-test-id='alert-dismiss']").trigger("click");
    await nextTick();
    expect(root(w).attributes("inert")).toBeDefined();
  });

  it("uses \"Close this prompt\" as the default dismiss label", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true } });
    expect(w.find("[data-test-id='alert-dismiss']").text()).toContain("Close this prompt");
  });

  it("uses the closeLabel prop as the dismiss label", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true, closeLabel: "Fermer" } });
    expect(w.find("[data-test-id='alert-dismiss']").text()).toContain("Fermer");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { styleClassPassthrough: ["original"] } });
    await w.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper(w).classes()).not.toContain("original");
    expect(wrapper(w).classes()).toContain("updated");
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

  it("stays data-state=open when dismissed via parent model", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      props: { dismissible: true, modelValue: true },
    });
    await w.find("[data-test-id='alert-dismiss']").trigger("click");
    await nextTick();
    // componentOpen is unchanged — parent controls visibility via modelValue
    expect(root(w).attributes("data-state")).toBe("open");
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
      expect(root(w).attributes("data-test-id")).toBe("display-prompt-info");
      expect(w.find("[data-test-id='alert-dismiss']").exists()).toBe(false);
    });

    it("uses app.config values when no props are supplied", async () => {
      useAppConfigMock.mockReturnValue({
        icon: {},
        srcdev: { displayPrompt: { theme: "success", dismissible: true } },
      });
      const w = await mountSuspended(DisplayPrompt);
      expect(wrapper(w).attributes("data-theme")).toBe("success");
      expect(root(w).attributes("data-test-id")).toBe("display-prompt-success");
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
