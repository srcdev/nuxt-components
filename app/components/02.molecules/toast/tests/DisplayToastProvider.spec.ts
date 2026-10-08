import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayToastProvider from "../DisplayToastProvider.vue";
import { useToastQueue } from "~/composables/useToastQueue";

const mounted: { unmount: () => void }[] = [];

// Every provider shares the global queue, so a leftover one from an earlier test would run its own timers.
async function mountProvider(...args: Parameters<typeof mountSuspended<typeof DisplayToastProvider>>) {
  const wrapper = await mountSuspended(...args);
  mounted.push(wrapper);
  return wrapper;
}

function item() {
  return document.querySelector(".display-toast-provider-item");
}

function items() {
  return document.querySelectorAll(".display-toast-provider-item");
}

function provider() {
  return document.querySelector(".display-toast-provider");
}

describe("DisplayToastProvider", () => {
  const { show, clear } = useToastQueue();

  beforeEach(() => {
    clear();
  });

  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    clear();
    document.body.innerHTML = "";
  });

  // ─── Mount ────────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountProvider(DisplayToastProvider);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the provider container", async () => {
    await mountProvider(DisplayToastProvider);
    expect(provider()).not.toBeNull();
  });

  // ─── Empty state ──────────────────────────────────────────────────────────

  it("renders no items when queue is empty", async () => {
    await mountProvider(DisplayToastProvider);
    expect(items().length).toBe(0);
  });

  // ─── Show / queue ─────────────────────────────────────────────────────────

  it("promotes a pending entry to visible on show()", async () => {
    await mountProvider(DisplayToastProvider);
    show({ content: { text: "Hello" } });
    await nextTick();
    expect(items().length).toBe(1);
  });

  it("renders the toast message text", async () => {
    await mountProvider(DisplayToastProvider);
    show({ content: { text: "Toast message" } });
    await nextTick();
    expect(document.querySelector(".alert-content-body")!.textContent).toContain("Toast message");
  });

  it("renders the toast title", async () => {
    await mountProvider(DisplayToastProvider);
    show({ content: { title: "My Title" } });
    await nextTick();
    expect(document.querySelector("[data-test-id='alert-title']")!.textContent).toContain("My Title");
  });

  it("renders the toast description", async () => {
    await mountProvider(DisplayToastProvider);
    show({ content: { description: "My description" } });
    await nextTick();
    expect(document.querySelector("[data-test-id='alert-content']")!.textContent).toContain("My description");
  });

  // ─── data-theme ───────────────────────────────────────────────────────────

  it.each(["info", "success", "warning", "error"] as const)(
    "sets data-theme='%s' from config",
    async (theme) => {
      await mountProvider(DisplayToastProvider);
      show({ appearance: { theme } });
      await nextTick();
      expect(item()!.getAttribute("data-theme")).toBe(theme);
    }
  );

  it("defaults to data-theme='info'", async () => {
    await mountProvider(DisplayToastProvider);
    show({});
    await nextTick();
    expect(item()!.getAttribute("data-theme")).toBe("info");
  });

  // ─── ARIA ─────────────────────────────────────────────────────────────────

  it.each([
    { theme: "info" as const, role: "status", live: "polite" },
    { theme: "success" as const, role: "status", live: "polite" },
    { theme: "warning" as const, role: "alert", live: "assertive" },
    { theme: "error" as const, role: "alert", live: "assertive" },
  ])("sets role=$role and aria-live=$live for theme='$theme'", async ({ theme, role, live }) => {
    await mountProvider(DisplayToastProvider);
    show({ appearance: { theme } });
    await nextTick();
    expect(item()!.getAttribute("role")).toBe(role);
    expect(item()!.getAttribute("aria-live")).toBe(live);
  });

  it("sets aria-describedby on each item", async () => {
    await mountProvider(DisplayToastProvider);
    show({});
    await nextTick();
    expect(item()!.getAttribute("aria-describedby")).not.toBeNull();
  });

  it("sets tabindex='0' on each item", async () => {
    await mountProvider(DisplayToastProvider);
    show({});
    await nextTick();
    expect(item()!.getAttribute("tabindex")).toBe("0");
  });

  // ─── Position / alignment hooks ──────────────────────────────────────────

  it.each(["top", "bottom"] as const)("sets data-position='%s' on the provider", async (position) => {
    await mountProvider(DisplayToastProvider, { props: { position } });
    expect(provider()!.getAttribute("data-position")).toBe(position);
  });

  it.each(["left", "center", "right"] as const)("sets data-alignment='%s' on the provider", async (alignment) => {
    await mountProvider(DisplayToastProvider, { props: { alignment } });
    expect(provider()!.getAttribute("data-alignment")).toBe(alignment);
  });

  it("sets data-alignment='full-width' when fullWidth is true, overriding alignment", async () => {
    await mountProvider(DisplayToastProvider, { props: { fullWidth: true, alignment: "left" } });
    expect(provider()!.getAttribute("data-alignment")).toBe("full-width");
  });

  it("adds no generic position classes a consumer's CSS could match", async () => {
    await mountProvider(DisplayToastProvider, { props: { position: "top", alignment: "center" } });
    for (const name of ["top", "bottom", "left", "center", "right", "full-width"]) {
      expect(provider()!.classList).not.toContain(name);
    }
  });

  // ─── Dismiss label ────────────────────────────────────────────────────────

  it("passes config.content.dismissLabel to the close button's screen-reader text", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: false }, content: { text: "Saved", dismissLabel: "Fermer" } });
    await nextTick();
    expect(document.querySelector("[data-test-id='alert-dismiss']")!.textContent).toContain("Fermer");
  });

  // ─── maxVisible ───────────────────────────────────────────────────────────

  it("shows only one item at a time when maxVisible=1", async () => {
    await mountProvider(DisplayToastProvider, { props: { maxVisible: 1 } });
    show({ content: { text: "First" } });
    show({ content: { text: "Second" } });
    await nextTick();
    expect(items().length).toBe(1);
    expect(document.querySelector(".alert-content-body")!.textContent).toContain("First");
  });

  it("shows up to maxVisible items simultaneously", async () => {
    await mountProvider(DisplayToastProvider, { props: { maxVisible: 2 } });
    show({ content: { text: "First" } });
    show({ content: { text: "Second" } });
    show({ content: { text: "Third" } });
    await nextTick();
    expect(items().length).toBe(2);
  });

  // ─── Dismiss ──────────────────────────────────────────────────────────────

  it("removes item when close button is clicked", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    (document.querySelector("[data-test-id='alert-dismiss']") as HTMLElement).click();
    await nextTick();
    expect(items().length).toBe(0);
  });

  it("removes item when Escape is pressed", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    item()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(items().length).toBe(0);
  });

  // ─── Auto-dismiss timer ───────────────────────────────────────────────────

  it("auto-dismisses after duration", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: true, duration: 3000 } });
    await nextTick();
    expect(items().length).toBe(1);
    vi.advanceTimersByTime(3000);
    await nextTick();
    expect(items().length).toBe(0);
  });

  it("pauses auto-dismiss while hovered and resumes with the remaining time", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: true, duration: 1000 } });
    await nextTick();
    vi.advanceTimersByTime(400);
    item()!.dispatchEvent(new Event("pointerenter"));
    await nextTick();
    expect(item()!.hasAttribute("data-paused")).toBe(true);
    vi.advanceTimersByTime(5000);
    await nextTick();
    expect(items().length).toBe(1);
    item()!.dispatchEvent(new Event("pointerleave"));
    await nextTick();
    vi.advanceTimersByTime(599);
    await nextTick();
    expect(items().length).toBe(1);
    vi.advanceTimersByTime(1);
    await nextTick();
    expect(items().length).toBe(0);
  });

  it("pauses while focus is on something inside a toast, and resumes when it leaves", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: true, duration: 1000 } });
    await nextTick();
    const inner = item()!.querySelector(".alert-content-body") as HTMLElement;
    inner.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await nextTick();
    expect(item()!.hasAttribute("data-paused")).toBe(true);
    vi.advanceTimersByTime(5000);
    await nextTick();
    expect(items().length).toBe(1);
    inner.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: null }));
    await nextTick();
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(items().length).toBe(0);
  });

  it("does not mark a non-auto-dismiss toast as paused", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    item()!.dispatchEvent(new Event("pointerenter"));
    await nextTick();
    expect(item()!.hasAttribute("data-paused")).toBe(false);
  });

  it("does not auto-dismiss when autoDismiss is false", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    vi.advanceTimersByTime(10000);
    await nextTick();
    expect(items().length).toBe(1);
  });

  // ─── Queue progression ────────────────────────────────────────────────────

  it("promotes next pending entry after current is dismissed", async () => {
    await mountProvider(DisplayToastProvider, { props: { maxVisible: 1 } });
    show({ content: { text: "First" }, behavior: { autoDismiss: false } });
    show({ content: { text: "Second" }, behavior: { autoDismiss: false } });
    await nextTick();
    expect(document.querySelector(".alert-content-body")!.textContent).toContain("First");

    item()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(document.querySelector(".alert-content-body")!.textContent).toContain("Second");
  });

  // ─── Progress bar ─────────────────────────────────────────────────────────

  it("renders progress bar when autoDismiss is true", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: true } });
    await nextTick();
    expect(document.querySelector(".display-toast-provider-progress")).not.toBeNull();
  });

  it("does not render progress bar when autoDismiss is false", async () => {
    await mountProvider(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    expect(document.querySelector(".display-toast-provider-progress")).toBeNull();
  });

  // ─── clear() ─────────────────────────────────────────────────────────────

  it("removes all items on clear()", async () => {
    const { clear: clearQueue } = useToastQueue();
    await mountProvider(DisplayToastProvider, { props: { maxVisible: 3 } });
    show({});
    show({});
    await nextTick();
    clearQueue();
    await nextTick();
    expect(items().length).toBe(0);
  });
});
