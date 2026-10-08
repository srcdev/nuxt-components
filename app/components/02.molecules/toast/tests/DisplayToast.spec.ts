import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import DisplayToast from "../DisplayToast.vue";

const { useAppConfigMock } = vi.hoisted(() => ({
  // icon: {} is required — @nuxt/icon reads useAppConfig().icon.collections internally.
  useAppConfigMock: vi.fn(() => ({ srcdev: undefined as Record<string, unknown> | undefined, icon: {} as object })),
}));

mockNuxtImport("useAppConfig", () => useAppConfigMock);

const mounted: { unmount: () => void }[] = [];
let focusVisibleSpy: { mockRestore: () => void } | null = null;

// Helper: mount the toast and activate it so the teleported element is in the DOM.
async function mountAndShow(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const { config, styleClassPassthrough, ...rest } = props;
  const wrapper = await mountSuspended(DisplayToast, {
    props: { config, styleClassPassthrough } as Record<string, unknown>,
    slots,
  });
  mounted.push(wrapper);
  await wrapper.setProps({ ...rest, modelValue: true });
  await nextTick();
  return wrapper;
}

function toast() {
  return document.querySelector(".display-toast");
}

describe("DisplayToast", () => {
  // Unmount first: a leftover toast's pending timers would otherwise re-render into the cleared body.
  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    focusVisibleSpy?.mockRestore();
    focusVisibleSpy = null;
    document.body.innerHTML = "";
  });

  // ─── Mount ────────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayToast);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Visibility ───────────────────────────────────────────────────────────

  it("does not render the toast element when modelValue is false", async () => {
    await mountSuspended(DisplayToast);
    expect(toast()).toBeNull();
  });

  it("renders the toast element when modelValue becomes true", async () => {
    await mountAndShow();
    expect(toast()).not.toBeNull();
  });

  it("has data-state='show' when activated", async () => {
    await mountAndShow();
    expect(toast()!.getAttribute("data-state")).toBe("show");
  });

  // ─── data-theme ───────────────────────────────────────────────────────────

  it.each(["info", "success", "warning", "error"] as const)(
    "sets data-theme='%s' from config",
    async (theme) => {
      await mountAndShow({ config: { appearance: { theme } } });
      expect(toast()!.getAttribute("data-theme")).toBe(theme);
    }
  );

  it("defaults to data-theme='info' when no theme is configured", async () => {
    await mountAndShow();
    expect(toast()!.getAttribute("data-theme")).toBe("info");
  });

  // ─── ARIA ─────────────────────────────────────────────────────────────────

  it.each([
    { theme: "info" as const, role: "status", live: "polite" },
    { theme: "success" as const, role: "status", live: "polite" },
    { theme: "warning" as const, role: "alert", live: "assertive" },
    { theme: "error" as const, role: "alert", live: "assertive" },
  ])("sets role=$role and aria-live=$live for theme='$theme'", async ({ theme, role, live }) => {
    await mountAndShow({ config: { appearance: { theme } } });
    expect(toast()!.getAttribute("role")).toBe(role);
    expect(toast()!.getAttribute("aria-live")).toBe(live);
  });

  // ─── Position hooks ───────────────────────────────────────────────────────

  it.each(["top", "bottom"] as const)("sets data-position='%s'", async (position) => {
    await mountAndShow({ config: { appearance: { position } } });
    expect(toast()!.getAttribute("data-position")).toBe(position);
  });

  it.each(["left", "center", "right"] as const)("sets data-alignment='%s'", async (alignment) => {
    await mountAndShow({ config: { appearance: { alignment } } });
    expect(toast()!.getAttribute("data-alignment")).toBe(alignment);
  });

  it("sets data-alignment='full-width' when fullWidth is true, overriding alignment", async () => {
    await mountAndShow({ config: { appearance: { fullWidth: true, alignment: "left" } } });
    expect(toast()!.getAttribute("data-alignment")).toBe("full-width");
  });

  it("adds no generic position or state classes a consumer's CSS could match", async () => {
    await mountAndShow({ config: { appearance: { position: "top", alignment: "center" } } });
    for (const name of ["top", "bottom", "left", "center", "right", "show", "hide", "full-width"]) {
      expect(toast()!.classList).not.toContain(name);
    }
  });

  // ─── tabindex / aria-describedby ──────────────────────────────────────────

  it("sets tabindex='0' when no default slot is used", async () => {
    await mountAndShow();
    expect(toast()!.getAttribute("tabindex")).toBe("0");
  });

  it("omits tabindex when a default slot is used", async () => {
    await mountAndShow({}, { default: "<div>Custom</div>" });
    expect(toast()!.getAttribute("tabindex")).toBeNull();
  });

  it("sets aria-describedby when no default slot is used", async () => {
    await mountAndShow();
    expect(toast()!.getAttribute("aria-describedby")).not.toBeNull();
  });

  it("omits aria-describedby when a default slot is used", async () => {
    await mountAndShow({}, { default: "<div>Custom</div>" });
    expect(toast()!.getAttribute("aria-describedby")).toBeNull();
  });

  // ─── Content ──────────────────────────────────────────────────────────────

  it("renders text content from config", async () => {
    await mountAndShow({ config: { content: { text: "Hello toast" } } });
    expect(document.querySelector(".alert-content-body")!.textContent).toContain("Hello toast");
  });

  it("renders title from config", async () => {
    await mountAndShow({ config: { content: { title: "Toast Title" } } });
    expect(document.querySelector("[data-test-id='alert-title']")!.textContent).toContain("Toast Title");
  });

  it("renders description from config", async () => {
    await mountAndShow({ config: { content: { description: "Toast description" } } });
    expect(document.querySelector("[data-test-id='alert-content']")!.textContent).toContain(
      "Toast description"
    );
  });

  it("renders title and description together", async () => {
    await mountAndShow({
      config: { content: { title: "Title", description: "Desc" } },
    });
    expect(document.querySelector("[data-test-id='alert-title']")).not.toBeNull();
    expect(document.querySelector("[data-test-id='alert-content']")).not.toBeNull();
  });

  // ─── Default slot ─────────────────────────────────────────────────────────

  it("renders default slot content instead of AlertContent", async () => {
    await mountAndShow({}, { default: '<p class="custom-content">Custom</p>' });
    expect(document.querySelector(".custom-content")).not.toBeNull();
    expect(document.querySelector(".alert-content")).toBeNull();
  });

  // ─── Progress bar ─────────────────────────────────────────────────────────

  it("renders the progress bar when autoDismiss is true", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: true } } });
    expect(document.querySelector(".display-toast-progress")).not.toBeNull();
  });

  it("does not render the progress bar when autoDismiss is false", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: false } } });
    expect(document.querySelector(".display-toast-progress")).toBeNull();
  });

  // ─── Close button ─────────────────────────────────────────────────────────

  it("renders the close button in the toast content when autoDismiss is false", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: false } } });
    expect(document.querySelector("[data-test-id='alert-dismiss']")).not.toBeNull();
  });

  it("does not render the close button when autoDismiss is true", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: true } } });
    expect(document.querySelector("[data-test-id='alert-dismiss']")).toBeNull();
  });

  // ─── Dismiss via Escape key ────────────────────────────────────────────────

  it("transitions to hide class when Escape is pressed", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: false } } });
    vi.advanceTimersByTime(100); // fire the focus setTimeout
    await nextTick();
    toast()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("hide");
  });

  // ─── Dismiss via close button ─────────────────────────────────────────────

  it("transitions to hide class when the close button is clicked", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: false } } });
    vi.advanceTimersByTime(100);
    await nextTick();
    (document.querySelector("[data-test-id='alert-dismiss']") as HTMLElement).click();
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("hide");
  });

  // ─── Dismiss label ────────────────────────────────────────────────────────

  it("passes config.content.dismissLabel to the close button's screen-reader text", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: false }, content: { dismissLabel: "Schließen" } } });
    expect(document.querySelector("[data-test-id='alert-dismiss']")!.textContent).toContain("Schließen");
  });

  // ─── Auto-dismiss pause ──────────────────────────────────────────────────

  const autoConfig = { behavior: { autoDismiss: true, duration: 1000 } };

  // jsdom matches :focus-visible whenever an element is focused; real browsers only do after keyboard input.
  const originalMatches = Element.prototype.matches;
  function setFocusVisible(keyboard: boolean) {
    const spy = vi.spyOn(Element.prototype, "matches");
    spy.mockImplementation(function (this: Element, selector: string) {
      return selector === ":focus-visible" ? keyboard : originalMatches.call(this, selector);
    });
    focusVisibleSpy = spy;
  }

  it("auto-dismisses after the duration", async () => {
    await mountAndShow({ config: autoConfig });
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("hide");
  });

  it("pauses auto-dismiss while hovered and resumes with the remaining time", async () => {
    setFocusVisible(false);
    await mountAndShow({ config: autoConfig });
    vi.advanceTimersByTime(400);
    toast()!.dispatchEvent(new Event("pointerenter"));
    await nextTick();
    expect(toast()!.hasAttribute("data-paused")).toBe(true);
    vi.advanceTimersByTime(5000);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("show");
    toast()!.dispatchEvent(new Event("pointerleave"));
    await nextTick();
    expect(toast()!.hasAttribute("data-paused")).toBe(false);
    vi.advanceTimersByTime(599);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("show");
    vi.advanceTimersByTime(1);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("hide");
  });

  it("pauses while focus is on something inside the toast", async () => {
    await mountAndShow({ config: autoConfig }, { default: "<a href='#' class='inner-link'>Undo</a>" });
    const link = document.querySelector(".inner-link") as HTMLElement;
    link.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await nextTick();
    vi.advanceTimersByTime(5000);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("show");
    link.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: null }));
    await nextTick();
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("hide");
  });

  it("does not pause when the toast takes focus after mouse input", async () => {
    setFocusVisible(false);
    await mountAndShow({ config: autoConfig });
    vi.advanceTimersByTime(100); // the toast focuses itself
    await nextTick();
    expect(document.activeElement).toBe(toast());
    expect(toast()!.hasAttribute("data-paused")).toBe(false);
    vi.advanceTimersByTime(900);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("hide");
  });

  it("pauses when the toast takes focus after keyboard input, until focus leaves", async () => {
    setFocusVisible(true);
    await mountAndShow({ config: autoConfig });
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(toast()!.hasAttribute("data-paused")).toBe(true);
    vi.advanceTimersByTime(5000);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("show");
    (toast() as HTMLElement).blur();
    await nextTick();
    vi.advanceTimersByTime(900);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("hide");
  });

  it("does not let an earlier show's timer dismiss a toast re-shown after a manual dismiss", async () => {
    const wrapper = await mountAndShow({ config: autoConfig });
    await wrapper.setProps({ modelValue: false });
    vi.advanceTimersByTime(550);
    await nextTick();
    await wrapper.setProps({ modelValue: true });
    await nextTick();
    vi.advanceTimersByTime(600);
    await nextTick();
    expect(toast()!.getAttribute("data-state")).toBe("show");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a styleClassPassthrough string class to the toast element", async () => {
    await mountAndShow({ styleClassPassthrough: "my-custom" });
    expect(toast()!.classList).toContain("my-custom");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    await mountAndShow({ styleClassPassthrough: ["class-a", "class-b"] });
    expect(toast()!.classList).toContain("class-a");
    expect(toast()!.classList).toContain("class-b");
  });

  // ─── app.config resolution ────────────────────────────────────────────────
  // Combines mockNuxtImport (#imports path) + vi.stubGlobal (global path) to
  // cover both routes Nuxt may use to resolve useAppConfig in this test env.

  describe("app.config resolution", () => {
    beforeEach(() => {
      // Stub the global so the component's useAppConfig() call is intercepted
      // regardless of whether Nuxt resolves it via #imports or the global scope.
      vi.stubGlobal("useAppConfig", useAppConfigMock);
      useAppConfigMock.mockImplementation(() => ({ srcdev: undefined, icon: {} }));
    });

    it("uses hardcoded fallbacks when app.config has no displayToast key", async () => {
      await mountAndShow();
      expect(toast()!.getAttribute("data-theme")).toBe("info");
      expect(toast()!.getAttribute("data-position")).toBe("top");
      expect(toast()!.getAttribute("data-alignment")).toBe("right");
      expect(document.querySelector(".display-toast-progress")).not.toBeNull();
    });

    it("uses app.config autoDismiss:false when no config prop is supplied", async () => {
      // autoDismiss defaults to true (both hardcoded and real app.config), so false
      // is the only value that proves the mock is being read.
      useAppConfigMock.mockImplementation(() => ({
        icon: {},
        srcdev: { displayToast: { behavior: { autoDismiss: false } } },
      }));
      await mountAndShow();
      expect(document.querySelector(".display-toast-progress")).toBeNull();
      expect(document.querySelector("[data-test-id='alert-dismiss']")).not.toBeNull();
    });

    it("config prop takes precedence over app.config", async () => {
      useAppConfigMock.mockImplementation(() => ({
        icon: {},
        srcdev: { displayToast: { appearance: { theme: "success", position: "bottom" } } },
      }));
      await mountAndShow({ config: { appearance: { theme: "warning", position: "top" } } });
      expect(toast()!.getAttribute("data-theme")).toBe("warning");
      expect(toast()!.getAttribute("data-position")).toBe("top");
    });
  });
});
