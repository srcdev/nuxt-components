import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayToast from "../DisplayToast.vue";

// Helper: mount the toast and activate it so the teleported element is in the DOM.
async function mountAndShow(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const { config, styleClassPassthrough, ...rest } = props;
  const wrapper = await mountSuspended(DisplayToast, {
    props: { config, styleClassPassthrough } as Record<string, unknown>,
    slots,
  });
  await wrapper.setProps({ ...rest, modelValue: true });
  await nextTick();
  return wrapper;
}

function toast() {
  return document.querySelector(".display-toast");
}

describe("DisplayToast", () => {
  afterEach(() => {
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

  it("has the show class when activated", async () => {
    await mountAndShow();
    expect(toast()!.classList).toContain("show");
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

  // ─── Position classes ─────────────────────────────────────────────────────

  it.each(["top", "bottom"] as const)("applies %s position class", async (position) => {
    await mountAndShow({ config: { appearance: { position } } });
    expect(toast()!.classList).toContain(position);
  });

  it.each(["left", "center", "right"] as const)("applies %s alignment class", async (alignment) => {
    await mountAndShow({ config: { appearance: { alignment } } });
    expect(toast()!.classList).toContain(alignment);
  });

  it("applies full-width class when fullWidth is true", async () => {
    await mountAndShow({ config: { appearance: { fullWidth: true } } });
    expect(toast()!.classList).toContain("full-width");
  });

  it("does not apply alignment class when fullWidth is true", async () => {
    await mountAndShow({ config: { appearance: { fullWidth: true, alignment: "left" } } });
    expect(toast()!.classList).not.toContain("left");
  });

  // ─── has-theme class ──────────────────────────────────────────────────────

  it("has the has-theme class when no default slot is used", async () => {
    await mountAndShow();
    expect(toast()!.classList).toContain("has-theme");
  });

  it("does not have the has-theme class when a default slot is used", async () => {
    await mountAndShow({}, { default: "<div>Custom</div>" });
    expect(toast()!.classList).not.toContain("has-theme");
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
    expect(document.querySelector(".toast-message")!.textContent).toContain("Hello toast");
  });

  it("renders title from config", async () => {
    await mountAndShow({ config: { content: { title: "Toast Title" } } });
    expect(document.querySelector("[data-test-id='toast-title']")!.textContent).toContain("Toast Title");
  });

  it("renders description from config", async () => {
    await mountAndShow({ config: { content: { description: "Toast description" } } });
    expect(document.querySelector("[data-test-id='toast-description']")!.textContent).toContain(
      "Toast description"
    );
  });

  it("renders title and description together", async () => {
    await mountAndShow({
      config: { content: { title: "Title", description: "Desc" } },
    });
    expect(document.querySelector("[data-test-id='toast-title']")).not.toBeNull();
    expect(document.querySelector("[data-test-id='toast-description']")).not.toBeNull();
  });

  // ─── Default slot ─────────────────────────────────────────────────────────

  it("renders default slot content instead of DefaultToastContent", async () => {
    await mountAndShow({}, { default: '<p class="custom-content">Custom</p>' });
    expect(document.querySelector(".custom-content")).not.toBeNull();
    expect(document.querySelector(".display-toast-inner")).toBeNull();
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
    expect(document.querySelector(".toast-action button")).not.toBeNull();
  });

  it("does not render the close button when autoDismiss is true", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: true } } });
    expect(document.querySelector(".toast-action")).toBeNull();
  });

  // ─── Dismiss via Escape key ────────────────────────────────────────────────

  it("transitions to hide class when Escape is pressed", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: false } } });
    vi.advanceTimersByTime(100); // fire the focus setTimeout
    await nextTick();
    toast()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(toast()!.classList).toContain("hide");
  });

  // ─── Dismiss via close button ─────────────────────────────────────────────

  it("transitions to hide class when the close button is clicked", async () => {
    await mountAndShow({ config: { behavior: { autoDismiss: false } } });
    vi.advanceTimersByTime(100);
    await nextTick();
    (document.querySelector(".toast-action button") as HTMLElement).click();
    await nextTick();
    expect(toast()!.classList).toContain("hide");
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
});
