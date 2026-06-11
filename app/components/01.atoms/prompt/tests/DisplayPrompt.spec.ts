import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayPrompt from "../DisplayPrompt.vue";

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
    expect(w.find("[data-test-id='prompt-icon']").exists()).toBe(true);
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
    expect(w.find("[data-test-id='display-prompt-title']").text()).toContain("Important notice");
  });

  it("renders content slot when provided", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      slots: { content: "Detailed explanation here" },
    });
    expect(w.find("[data-test-id='display-prompt-content']").exists()).toBe(true);
    expect(w.find("[data-test-id='display-prompt-content']").text()).toContain("Detailed explanation here");
  });

  it("does not render content element when content slot is empty", async () => {
    const w = await mountSuspended(DisplayPrompt);
    expect(w.find("[data-test-id='display-prompt-content']").exists()).toBe(false);
  });

  // ─── Dismiss button ───────────────────────────────────────────────────────

  it("does not render the dismiss button when dismissible is false", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: false } });
    expect(w.find("[data-test-id='display-prompt-action']").exists()).toBe(false);
  });

  it("renders the dismiss button when dismissible is true", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true } });
    expect(w.find("[data-test-id='display-prompt-action']").exists()).toBe(true);
  });

  // ─── Dismiss behaviour (no parent model) ─────────────────────────────────

  it("adds the closed class after the dismiss button is clicked", async () => {
    const w = await mountSuspended(DisplayPrompt, { props: { dismissible: true } });
    await w.find("[data-test-id='display-prompt-action']").trigger("click");
    await nextTick();
    expect(root(w).classes()).toContain("closed");
  });

  // ─── Dismiss behaviour (with parent model) ────────────────────────────────

  it("emits update:modelValue=false when clicked with modelValue=true", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      props: { dismissible: true, modelValue: true },
    });
    await w.find("[data-test-id='display-prompt-action']").trigger("click");
    await nextTick();
    const emitted = w.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([false]);
  });

  it("does not add the closed class when dismissed via parent model", async () => {
    const w = await mountSuspended(DisplayPrompt, {
      props: { dismissible: true, modelValue: true },
    });
    await w.find("[data-test-id='display-prompt-action']").trigger("click");
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
});
