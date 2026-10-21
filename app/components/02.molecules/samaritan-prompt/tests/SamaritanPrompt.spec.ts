import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import SamaritanPrompt from "../SamaritanPrompt.vue";

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountPrompt = async (options?: Parameters<typeof mountSuspended<typeof SamaritanPrompt>>[1]) => {
  const wrapper = await mountSuspended(SamaritanPrompt, options);
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

const messages: string[] = ["Hello, world.", "Surveillance active.", "Threat detected."];
const [firstMessage, secondMessage] = messages as [string, string, string];

// ─── Typewriter ────────────────────────────────────────────────────────────

describe("SamaritanPrompt — typewriter", () => {
  it("mounts without error", async () => {
    const wrapper = await mountPrompt({
      props: { messages },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the triangle cursor", async () => {
    const wrapper = await mountPrompt({
      props: { messages },
    });
    expect(wrapper.find(".samaritan-prompt__cursor").text()).toBe("▲");
  });

  it("renders the underline element", async () => {
    const wrapper = await mountPrompt({
      props: { messages },
    });
    expect(wrapper.find(".samaritan-prompt__underline").exists()).toBe(true);
  });

  it("starts with empty display text", async () => {
    const wrapper = await mountPrompt({
      props: { messages },
    });
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
  });

  it("types one character per typeSpeed tick", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 100 },
    });

    vi.advanceTimersByTime(100);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("H");

    vi.advanceTimersByTime(100);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("He");
  });

  it("fully types the first message", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 10 },
    });

    vi.advanceTimersByTime(10 * firstMessage.length);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(firstMessage);
  });

  it("deletes text after hold duration", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 10, holdDuration: 500, deleteSpeed: 10 },
    });

    vi.advanceTimersByTime(10 * (firstMessage.length + 1));
    await nextTick();
    vi.advanceTimersByTime(500);
    await nextTick();
    vi.advanceTimersByTime(10);
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__text").text().length).toBeLessThan(firstMessage.length);
  });

  it("advances to the next message after deleting", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 10, holdDuration: 100, deleteSpeed: 10, pauseDuration: 100 },
    });

    vi.advanceTimersByTime(10 * (firstMessage.length + 1));
    await nextTick();
    vi.advanceTimersByTime(100);
    await nextTick();
    vi.advanceTimersByTime(10 * (firstMessage.length + 1));
    await nextTick();
    vi.advanceTimersByTime(100);
    await nextTick();
    vi.advanceTimersByTime(10);
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(secondMessage.slice(0, 1));
  });

  it("cycles back to first message after last message", async () => {
    const singleMessage = "Only one.";
    const wrapper = await mountPrompt({
      props: { messages: [singleMessage], typeSpeed: 10, holdDuration: 100, deleteSpeed: 10, pauseDuration: 100 },
    });

    const len = singleMessage.length;
    vi.advanceTimersByTime(10 * (len + 1) + 100 + 10 * (len + 1) + 100 + 10);
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(singleMessage.slice(0, 1));
  });

  it("applies styleClassPassthrough", async () => {
    const wrapper = await mountPrompt({
      props: { messages, styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.find(".samaritan-prompt").classes()).toContain("custom-class");
  });

  it("cursor is visible before typing starts", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 100 },
    });
    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });

  it("cursor hides when typewriter starts typing first character", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 100 },
    });

    vi.advanceTimersByTime(100);
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 0");
  });

  it("cursor returns when typewriter enters pause phase", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 10, holdDuration: 100, deleteSpeed: 10, pauseDuration: 100 },
    });

    // Type full first message + hold + delete all + enter pausing phase
    vi.advanceTimersByTime(10 * (firstMessage.length + 1)); // typing → holding
    await nextTick();
    vi.advanceTimersByTime(100); // hold → deleting
    await nextTick();
    vi.advanceTimersByTime(10 * (firstMessage.length + 1)); // deleting → pausing (cursorVisible=true)
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });

  it("cursor is always visible when hideCursorInCycle is false", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 100, hideCursorInCycle: false },
    });

    vi.advanceTimersByTime(100);
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });
});

// ─── Word pulse ────────────────────────────────────────────────────────────

describe("SamaritanPrompt — word-pulse", () => {
  it("mounts without error", async () => {
    const wrapper = await mountPrompt({
      props: { messages, effect: "word-pulse" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("starts with empty display text and content visible", async () => {
    const wrapper = await mountPrompt({
      props: { messages, effect: "word-pulse", pauseDuration: 500 },
    });
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 1");
  });

  it("makes content invisible when cycle starts after pause", async () => {
    const wrapper = await mountPrompt({
      props: { messages, effect: "word-pulse", pauseDuration: 500, fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    vi.advanceTimersByTime(500); // pauseDuration fires
    await Promise.resolve();
    await nextTick(); // textOpacity=0, schedules wait(fadeDuration)

    // Text not yet set — underline is transitioning out
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 0");
  });

  it("makes content visible after expansion delay", async () => {
    const wrapper = await mountPrompt({
      props: { messages, effect: "word-pulse", pauseDuration: 500, fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    vi.advanceTimersByTime(500); // pauseDuration fires
    await Promise.resolve();
    await nextTick(); // textOpacity=0, schedules wait(fadeDuration)

    vi.advanceTimersByTime(400); // fadeDuration fires
    await Promise.resolve();
    await nextTick(); // displayText=firstMessage, component awaits nextTick
    await Promise.resolve();
    await nextTick(); // component nextTick resolves, schedules wait(120)

    vi.advanceTimersByTime(120); // wait(120) fires
    await Promise.resolve();
    await nextTick(); // textOpacity=1

    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 1");
  });

  it("fades content back out after word duration", async () => {
    const wrapper = await mountPrompt({
      props: { messages, effect: "word-pulse", pauseDuration: 500, fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    vi.advanceTimersByTime(500); // pauseDuration
    await Promise.resolve();
    await nextTick(); // textOpacity=0, schedules wait(fadeDuration)

    vi.advanceTimersByTime(400); // fadeDuration (initial fade out)
    await Promise.resolve();
    await nextTick(); // displayText=firstMessage, component nextTick
    await Promise.resolve();
    await nextTick(); // schedules wait(120)

    vi.advanceTimersByTime(120);
    await Promise.resolve();
    await nextTick(); // textOpacity=1, schedules wait(1200)

    vi.advanceTimersByTime(1200);
    await Promise.resolve();
    await nextTick(); // textOpacity=0

    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 0");
  });

  it("advances to the next message after fade out", async () => {
    const wrapper = await mountPrompt({
      props: { messages, effect: "word-pulse", pauseDuration: 500, fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    vi.advanceTimersByTime(500); // pauseDuration
    await Promise.resolve();
    await nextTick(); // textOpacity=0, schedules wait(fadeDuration)

    vi.advanceTimersByTime(400); // initial fadeDuration (underline fade)
    await Promise.resolve();
    await nextTick(); // displayText=firstMessage, component nextTick
    await Promise.resolve();
    await nextTick(); // schedules wait(120)

    vi.advanceTimersByTime(120);
    await Promise.resolve();
    await nextTick(); // textOpacity=1, schedules wait(1200)

    vi.advanceTimersByTime(1200);
    await Promise.resolve();
    await nextTick(); // textOpacity=0, schedules wait(fadeDuration)

    vi.advanceTimersByTime(400); // first message fade complete
    await Promise.resolve();
    await nextTick(); // displayText=secondMessage, component nextTick
    await Promise.resolve();
    await nextTick(); // schedules wait(120)

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(secondMessage);
  });

  it("collapses displayText and restores opacity at end of cycle", async () => {
    const singleMsg = "Only.";
    const wrapper = await mountPrompt({
      props: { messages: [singleMsg], effect: "word-pulse", pauseDuration: 300, fadeDuration: 200, wordDuration: 500 },
    });
    await nextTick();

    vi.advanceTimersByTime(300); // pauseDuration
    await Promise.resolve();
    await nextTick(); // textOpacity=0, schedules wait(fadeDuration=200)

    vi.advanceTimersByTime(200); // initial fadeDuration
    await Promise.resolve();
    await nextTick(); // displayText=singleMsg, component nextTick
    await Promise.resolve();
    await nextTick(); // schedules wait(120)

    vi.advanceTimersByTime(120);
    await Promise.resolve();
    await nextTick(); // textOpacity=1, schedules wait(500)

    vi.advanceTimersByTime(500);
    await Promise.resolve();
    await nextTick(); // textOpacity=0, schedules wait(200)

    vi.advanceTimersByTime(200);
    await Promise.resolve();
    await nextTick(); // end of for loop: displayText="", textOpacity=1, await nextTick()
    await Promise.resolve();
    await nextTick(); // while loop top: schedules wait(300)

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
    expect(wrapper.find(".samaritan-prompt__content").attributes("style")).toContain("opacity: 1");
  });

  it("cursor hides when word-pulse cycle starts", async () => {
    const wrapper = await mountPrompt({
      props: { messages, effect: "word-pulse", pauseDuration: 500, fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");

    vi.advanceTimersByTime(500); // pauseDuration fires → cursorVisible=false
    await Promise.resolve();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 0");
  });

  it("cursor returns after word-pulse cycle resets", async () => {
    const singleMsg = "Only.";
    const wrapper = await mountPrompt({
      props: { messages: [singleMsg], effect: "word-pulse", pauseDuration: 300, fadeDuration: 200, wordDuration: 500 },
    });
    await nextTick();

    vi.advanceTimersByTime(300); // pauseDuration → cursorVisible=false
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(200); // initial fadeDuration
    await Promise.resolve();
    await nextTick();
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(120);
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(500);
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(200); // message fade out complete → cycle resets: cursorVisible=true
    await Promise.resolve();
    await nextTick();
    await Promise.resolve();
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });
});

// ─── Accessibility, pause and slots ─────────────────────────────────────────

describe("SamaritanPrompt — accessibility and pause", () => {
  it("hides the animated content from assistive tech and exposes a polite live region", async () => {
    const wrapper = await mountPrompt({ props: { messages } });
    expect(wrapper.find(".samaritan-prompt__content").attributes("aria-hidden")).toBe("true");
    const live = wrapper.find(".samaritan-prompt__sr-text");
    expect(live.attributes("aria-live")).toBe("polite");
    expect(live.attributes("aria-atomic")).toBe("true");
    expect(live.text()).toBe("");
  });

  it("announces the full message once typed, and clears it when deleting starts", async () => {
    const wrapper = await mountPrompt({
      props: { messages, typeSpeed: 10, holdDuration: 500, deleteSpeed: 10 },
    });

    vi.advanceTimersByTime(10 * (firstMessage.length + 1));
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__sr-text").text()).toBe(firstMessage);

    vi.advanceTimersByTime(500);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__sr-text").text()).toBe("");
  });

  it("stops typing while hovered and resumes on leave", async () => {
    const wrapper = await mountPrompt({ props: { messages, typeSpeed: 100 } });
    const root = wrapper.find(".samaritan-prompt");

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("He");

    await root.trigger("pointerenter");
    expect(root.attributes("data-paused")).toBeDefined();
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("He");

    await root.trigger("pointerleave");
    expect(root.attributes("data-paused")).toBeUndefined();
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("Hel");
  });

  it("renders a custom cursor from the cursor slot", async () => {
    const wrapper = await mountPrompt({
      props: { messages },
      slots: { cursor: () => "_" },
    });
    expect(wrapper.find(".samaritan-prompt__cursor").text()).toBe("_");
  });

  it("updates passthrough classes when the prop changes", async () => {
    const wrapper = await mountPrompt({
      props: { messages, styleClassPassthrough: "first-class" },
    });
    await wrapper.setProps({ styleClassPassthrough: "second-class" });
    const classes = wrapper.find(".samaritan-prompt").classes();
    expect(classes).toContain("second-class");
    expect(classes).not.toContain("first-class");
  });
});

// ─── Worst-case data ──────────────────────────────────────────────────────────

const stubReducedMotion = () => {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-reduced-motion: reduce"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
};

describe("SamaritanPrompt — worst-case data", () => {
  const text = (wrapper: Awaited<ReturnType<typeof mountPrompt>>) => wrapper.find(".samaritan-prompt__text").text();

  it("types an emoji with a skin-tone modifier as one character", async () => {
    const wrapper = await mountPrompt({ props: { messages: ["👍🏽A"], typeSpeed: 100 } });
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(text(wrapper)).toBe("👍🏽");
  });

  it("moves past an empty message instead of stopping", async () => {
    const wrapper = await mountPrompt({
      props: { messages: ["", "B"], typeSpeed: 10, holdDuration: 10, deleteSpeed: 10, pauseDuration: 10 },
    });
    const seen = new Set<string>();
    for (let i = 0; i < 12; i++) {
      vi.advanceTimersByTime(10);
      await nextTick();
      seen.add(text(wrapper));
    }
    expect(seen.has("B")).toBe(true);
  });

  it("restarts when messages change by value, but not for an equal new array", async () => {
    const wrapper = await mountPrompt({ props: { messages: ["AB"], typeSpeed: 100 } });
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(text(wrapper)).toBe("A");

    await wrapper.setProps({ messages: ["AB"] });
    expect(text(wrapper)).toBe("A");

    await wrapper.setProps({ messages: ["XY"] });
    expect(text(wrapper)).toBe("");
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(text(wrapper)).toBe("X");
  });

  it("shows the whole message at once under reduced motion", async () => {
    const restore = stubReducedMotion();
    try {
      const wrapper = await mountPrompt({ props: { messages: ["HELLO"], typeSpeed: 100 } });
      vi.advanceTimersByTime(100);
      await nextTick();
      expect(text(wrapper)).toBe("HELLO");
    } finally {
      restore();
    }
  });
});
