import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayToastProvider from "../DisplayToastProvider.vue";
import { useToastQueue } from "~/composables/useToastQueue";

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
    clear();
    document.body.innerHTML = "";
  });

  // ─── Mount ────────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayToastProvider);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the provider container", async () => {
    await mountSuspended(DisplayToastProvider);
    expect(provider()).not.toBeNull();
  });

  // ─── Empty state ──────────────────────────────────────────────────────────

  it("renders no items when queue is empty", async () => {
    await mountSuspended(DisplayToastProvider);
    expect(items().length).toBe(0);
  });

  // ─── Show / queue ─────────────────────────────────────────────────────────

  it("promotes a pending entry to visible on show()", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ content: { text: "Hello" } });
    await nextTick();
    expect(items().length).toBe(1);
  });

  it("renders the toast message text", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ content: { text: "Toast message" } });
    await nextTick();
    expect(document.querySelector(".alert-content-body")!.textContent).toContain("Toast message");
  });

  it("renders the toast title", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ content: { title: "My Title" } });
    await nextTick();
    expect(document.querySelector("[data-test-id='alert-title']")!.textContent).toContain("My Title");
  });

  it("renders the toast description", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ content: { description: "My description" } });
    await nextTick();
    expect(document.querySelector("[data-test-id='alert-content']")!.textContent).toContain("My description");
  });

  // ─── data-theme ───────────────────────────────────────────────────────────

  it.each(["info", "success", "warning", "error"] as const)(
    "sets data-theme='%s' from config",
    async (theme) => {
      await mountSuspended(DisplayToastProvider);
      show({ appearance: { theme } });
      await nextTick();
      expect(item()!.getAttribute("data-theme")).toBe(theme);
    }
  );

  it("defaults to data-theme='info'", async () => {
    await mountSuspended(DisplayToastProvider);
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
    await mountSuspended(DisplayToastProvider);
    show({ appearance: { theme } });
    await nextTick();
    expect(item()!.getAttribute("role")).toBe(role);
    expect(item()!.getAttribute("aria-live")).toBe(live);
  });

  it("sets aria-describedby on each item", async () => {
    await mountSuspended(DisplayToastProvider);
    show({});
    await nextTick();
    expect(item()!.getAttribute("aria-describedby")).not.toBeNull();
  });

  it("sets tabindex='0' on each item", async () => {
    await mountSuspended(DisplayToastProvider);
    show({});
    await nextTick();
    expect(item()!.getAttribute("tabindex")).toBe("0");
  });

  // ─── Position / alignment classes ────────────────────────────────────────

  it.each(["top", "bottom"] as const)("applies %s class to provider", async (position) => {
    await mountSuspended(DisplayToastProvider, { props: { position } });
    expect(provider()!.classList).toContain(position);
  });

  it.each(["left", "center", "right"] as const)(
    "applies %s alignment class to provider",
    async (alignment) => {
      await mountSuspended(DisplayToastProvider, { props: { alignment } });
      expect(provider()!.classList).toContain(alignment);
    }
  );

  it("applies full-width class when fullWidth is true", async () => {
    await mountSuspended(DisplayToastProvider, { props: { fullWidth: true } });
    expect(provider()!.classList).toContain("full-width");
  });

  it("does not apply alignment class when fullWidth is true", async () => {
    await mountSuspended(DisplayToastProvider, { props: { fullWidth: true, alignment: "left" } });
    expect(provider()!.classList).not.toContain("left");
  });

  // ─── maxVisible ───────────────────────────────────────────────────────────

  it("shows only one item at a time when maxVisible=1", async () => {
    await mountSuspended(DisplayToastProvider, { props: { maxVisible: 1 } });
    show({ content: { text: "First" } });
    show({ content: { text: "Second" } });
    await nextTick();
    expect(items().length).toBe(1);
    expect(document.querySelector(".alert-content-body")!.textContent).toContain("First");
  });

  it("shows up to maxVisible items simultaneously", async () => {
    await mountSuspended(DisplayToastProvider, { props: { maxVisible: 2 } });
    show({ content: { text: "First" } });
    show({ content: { text: "Second" } });
    show({ content: { text: "Third" } });
    await nextTick();
    expect(items().length).toBe(2);
  });

  // ─── Dismiss ──────────────────────────────────────────────────────────────

  it("removes item when close button is clicked", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    (document.querySelector("[data-test-id='alert-dismiss']") as HTMLElement).click();
    await nextTick();
    expect(items().length).toBe(0);
  });

  it("removes item when Escape is pressed", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    item()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(items().length).toBe(0);
  });

  // ─── Auto-dismiss timer ───────────────────────────────────────────────────

  it("auto-dismisses after duration", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ behavior: { autoDismiss: true, duration: 3000 } });
    await nextTick();
    expect(items().length).toBe(1);
    vi.advanceTimersByTime(3000);
    await nextTick();
    expect(items().length).toBe(0);
  });

  it("does not auto-dismiss when autoDismiss is false", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    vi.advanceTimersByTime(10000);
    await nextTick();
    expect(items().length).toBe(1);
  });

  // ─── Queue progression ────────────────────────────────────────────────────

  it("promotes next pending entry after current is dismissed", async () => {
    await mountSuspended(DisplayToastProvider, { props: { maxVisible: 1 } });
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
    await mountSuspended(DisplayToastProvider);
    show({ behavior: { autoDismiss: true } });
    await nextTick();
    expect(document.querySelector(".display-toast-provider-progress")).not.toBeNull();
  });

  it("does not render progress bar when autoDismiss is false", async () => {
    await mountSuspended(DisplayToastProvider);
    show({ behavior: { autoDismiss: false } });
    await nextTick();
    expect(document.querySelector(".display-toast-provider-progress")).toBeNull();
  });

  // ─── clear() ─────────────────────────────────────────────────────────────

  it("removes all items on clear()", async () => {
    const { clear: clearQueue } = useToastQueue();
    await mountSuspended(DisplayToastProvider, { props: { maxVisible: 3 } });
    show({});
    show({});
    await nextTick();
    clearQueue();
    await nextTick();
    expect(items().length).toBe(0);
  });
});
