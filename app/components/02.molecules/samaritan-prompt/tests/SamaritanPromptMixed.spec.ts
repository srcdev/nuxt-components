import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import SamaritanPromptMixed from "../SamaritanPromptMixed.vue";
import type { SamaritanPromptMessageConfig as MessageConfig } from "~/types/components/samaritan-prompt";

// ─── Typewriter ───────────────────────────────────────────────────────────────
//
// runTypewriter sets the first char and hides the cursor synchronously on mount,
// then suspends at await wait(typeSpeed) before each subsequent character.
// Sequence: mount → [first char immediate] → typeSpeed → [2nd char] → …

describe("SamaritanPromptMixed — typewriter", () => {
  const config: MessageConfig = {
    text: "HELLO",
    effect: "typewriter",
    typeSpeed: 100,
    deleteSpeed: 50,
    holdDuration: 300,
    pauseDuration: 200,
  };

  let wrapper: Awaited<ReturnType<typeof mountSuspended>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("mounts without error", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config] } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders cursor, underline, and stage", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config] } });
    expect(wrapper.find(".samaritan-prompt__cursor").text()).toBe("▲");
    expect(wrapper.find(".samaritan-prompt__underline").exists()).toBe(true);
    expect(wrapper.find(".samaritan-prompt__stage").exists()).toBe(true);
  });

  it("types the first character immediately on mount", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("H");
  });

  it("types one character per typeSpeed tick", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("H");

    vi.advanceTimersByTime(100);
    await Promise.resolve();
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("HE");
  });

  it("hides cursor when typing starts", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 0");
  });

  it("cursor stays visible when hideCursorInCycle is false", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: { messageConfigs: [{ ...config, hideCursorInCycle: false }] },
    });
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });

  it("deletes text after hold duration elapses", async () => {
    const short: MessageConfig = {
      text: "HI",
      effect: "typewriter",
      typeSpeed: 100,
      deleteSpeed: 50,
      holdDuration: 200,
      pauseDuration: 100,
    };
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [short] } });
    await nextTick(); // "H" — first char immediate

    vi.advanceTimersByTime(100); // fire i=1 timer → "HI" typed, await wait(100) for i=2
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(100); // fire i=2 timer → loop exits, await wait(holdDuration=200)
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(200); // hold fires → first delete: "HI"→"H"
    await Promise.resolve();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__text").text().length).toBeLessThan(2);
  });

  it("cursor returns after deleting completes", async () => {
    // text="H" so one type tick, one hold, one delete tick → cursor returns
    const short: MessageConfig = {
      text: "H",
      effect: "typewriter",
      typeSpeed: 100,
      deleteSpeed: 50,
      holdDuration: 200,
      pauseDuration: 100,
    };
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [short] } });
    await nextTick(); // "H" — cursor hidden

    vi.advanceTimersByTime(100); // exit type loop (single char)
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(200); // hold
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(50); // delete "H" → "" → cursorVisible = true
    await Promise.resolve();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });

  it("applies styleClassPassthrough", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: { messageConfigs: [config], styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.find(".samaritan-prompt").classes()).toContain("custom-class");
  });
});

// ─── Word pulse ───────────────────────────────────────────────────────────────
//
// runWordPulse begins with await nextTick() to let the CSS transition duration update.
// Sequence: mount → [activeFadeDuration set] → nextTick → [opacity=0, cursor hidden]
//           → fadeDuration → [text shown] → nextTick + 120ms → [opacity=1]
//           → wordDuration → [opacity=0] → fadeDuration → [reset, pause]

describe("SamaritanPromptMixed — word-pulse", () => {
  const config: MessageConfig = {
    text: "THREAT DETECTED",
    effect: "word-pulse",
    fadeDuration: 300,
    wordDuration: 1000,
    pauseDuration: 400,
  };

  let wrapper: Awaited<ReturnType<typeof mountSuspended>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("mounts without error", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config] } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("starts with empty display text", async () => {
    // mountSuspended flushes pending promises, resolving the component's initial await nextTick()
    // which immediately triggers the fade-out. Text is still empty until fadeDuration elapses.
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config] } });
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
  });

  it("fades content out when cycle starts", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await nextTick(); // component's await nextTick() resolves → sets opacity=0
    await nextTick(); // DOM update

    expect(wrapper.find(".samaritan-prompt__content").attributes("style")).toContain("opacity: 0");
  });

  it("hides cursor when cycle starts", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await nextTick();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 0");
  });

  it("cursor stays visible when hideCursorInCycle is false", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: { messageConfigs: [{ ...config, hideCursorInCycle: false }] },
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });

  it("shows text and restores opacity after fade duration and settle delay", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await nextTick(); // component's nextTick resolves → opacity=0, await wait(fadeDuration)
    await nextTick(); // DOM update

    vi.advanceTimersByTime(300); // fadeDuration → displayText set, component hits await nextTick()
    await Promise.resolve();
    await nextTick(); // component's nextTick resolves → await wait(120)
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(120); // settle → textOpacity=1
    await Promise.resolve();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("THREAT DETECTED");
    expect(wrapper.find(".samaritan-prompt__content").attributes("style")).toContain("opacity: 1");
  });

  it("fades text back out after word duration", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await nextTick();
    await nextTick();

    vi.advanceTimersByTime(300); // fadeDuration
    await Promise.resolve();
    await nextTick();
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(120); // settle
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(1000); // wordDuration → textOpacity=0
    await Promise.resolve();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__content").attributes("style")).toContain("opacity: 0");
  });
});

// ─── Config resolution ────────────────────────────────────────────────────────

describe("SamaritanPromptMixed — config resolution", () => {
  afterEach(() => {
    // wrappers are unmounted inline in each test
  });

  it("falls back to global effect prop when not specified per message", async () => {
    const wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: {
        messageConfigs: [{ text: "TEST" }], // no effect
        introDelay: 0,
        effect: "typewriter",
        typeSpeed: 100,
      },
    });
    await nextTick();
    // typewriter first char is immediate
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("T");
    wrapper.unmount();
  });

  it("falls back to global typeSpeed when not specified per message", async () => {
    const wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: {
        messageConfigs: [{ text: "HI", effect: "typewriter" }],
        introDelay: 0,
        typeSpeed: 150,
      },
    });
    await nextTick(); // "H" immediate

    vi.advanceTimersByTime(149); // just under global typeSpeed
    await Promise.resolve();
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("H");

    vi.advanceTimersByTime(1); // complete 150ms
    await Promise.resolve();
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("HI");

    wrapper.unmount();
  });

  it("per-message holdDuration overrides global default", async () => {
    const wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: {
        messageConfigs: [
          { text: "H", effect: "typewriter", typeSpeed: 100, holdDuration: 200, deleteSpeed: 50, pauseDuration: 100 },
        ],
        holdDuration: 9999, // global — should not be used
      },
    });
    await nextTick(); // "H" immediate

    vi.advanceTimersByTime(100); // exit type loop
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(200); // per-message holdDuration fires (not 9999)
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(50); // delete
    await Promise.resolve();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
    wrapper.unmount();
  });
});

// ─── Accessibility, pause and slots ───────────────────────────────────────────

describe("SamaritanPromptMixed — accessibility and pause", () => {
  const config: MessageConfig = {
    text: "HI",
    effect: "typewriter",
    typeSpeed: 100,
    deleteSpeed: 50,
    holdDuration: 300,
    pauseDuration: 100,
  };

  let wrapper: Awaited<ReturnType<typeof mountSuspended>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("hides the animated content from assistive tech and exposes a polite live region", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    expect(wrapper.find(".samaritan-prompt__content").attributes("aria-hidden")).toBe("true");
    const live = wrapper.find(".samaritan-prompt__sr-text");
    expect(live.attributes("aria-live")).toBe("polite");
    expect(live.attributes("aria-atomic")).toBe("true");
  });

  it("announces the full message once it is typed", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], introDelay: 0 } });
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__sr-text").text()).toBe("HI");
  });

  it("sets data-paused on hover and removes it on leave", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config] } });
    const root = wrapper.find(".samaritan-prompt");
    await root.trigger("pointerenter");
    expect(root.attributes("data-paused")).toBeDefined();
    await root.trigger("pointerleave");
    expect(root.attributes("data-paused")).toBeUndefined();
  });

  it("stops typing while hovered and resumes on leave", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: { messageConfigs: [{ ...config, text: "HELLO" }], introDelay: 0 },
    });
    await vi.advanceTimersByTimeAsync(100);
    await nextTick();
    const typedBeforePause = wrapper.find(".samaritan-prompt__text").text();

    await wrapper.find(".samaritan-prompt").trigger("pointerenter");
    await vi.advanceTimersByTimeAsync(1000);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(typedBeforePause);

    await wrapper.find(".samaritan-prompt").trigger("pointerleave");
    await vi.advanceTimersByTimeAsync(300);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text().length).toBeGreaterThan(typedBeforePause.length);
  });

  it("renders a custom cursor from the cursor slot", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, {
      props: { messageConfigs: [config] },
      slots: { cursor: () => "_" },
    });
    expect(wrapper.find(".samaritan-prompt__cursor").text()).toBe("_");
  });

  it("exposes the fade duration as an inline private token", async () => {
    wrapper = await mountSuspended(SamaritanPromptMixed, { props: { messageConfigs: [config], fadeDuration: 900 } });
    const style = (wrapper.find(".samaritan-prompt").element as HTMLElement).style;
    expect(style.getPropertyValue("--_fade-duration")).toBe("900ms");
  });
});
