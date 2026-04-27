import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import SamaritanPrompt from "../SamaritanPrompt.vue";

const messages: string[] = ["Hello, world.", "Surveillance active.", "Threat detected."];
const [firstMessage, secondMessage] = messages as [string, string, string];

// ─── Typewriter ────────────────────────────────────────────────────────────

describe("SamaritanPrompt — typewriter", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the triangle cursor", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages },
    });
    expect(wrapper.find(".samaritan-prompt__cursor").text()).toBe("▲");
  });

  it("renders the underline element", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages },
    });
    expect(wrapper.find(".samaritan-prompt__underline").exists()).toBe(true);
  });

  it("starts with empty display text", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages },
    });
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
  });

  it("types one character per typeSpeed tick", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, typeSpeed: 10 },
    });

    vi.advanceTimersByTime(10 * firstMessage.length);
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(firstMessage);
  });

  it("deletes text after hold duration", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages: [singleMessage], typeSpeed: 10, holdDuration: 100, deleteSpeed: 10, pauseDuration: 100 },
    });

    const len = singleMessage.length;
    vi.advanceTimersByTime(10 * (len + 1) + 100 + 10 * (len + 1) + 100 + 10);
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(singleMessage.slice(0, 1));
  });

  it("applies styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.find(".samaritan-prompt").classes()).toContain("custom-class");
  });
});

// ─── Word pulse ────────────────────────────────────────────────────────────

describe("SamaritanPrompt — word-pulse", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("sets the first message immediately on mount", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse", fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(firstMessage);
  });

  it("starts with text invisible (opacity 0)", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse", fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();
    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 0");
  });

  it("makes text visible after underline expansion delay", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse", fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    vi.advanceTimersByTime(120);
    await Promise.resolve();
    await nextTick();

    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 1");
  });

  it("fades text back out after word duration", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse", fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    vi.advanceTimersByTime(120);
    await Promise.resolve();
    await nextTick();

    vi.advanceTimersByTime(1200);
    await Promise.resolve();
    await nextTick();

    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 0");
  });

  it("advances to the next message after fade out", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse", fadeDuration: 400, wordDuration: 1200 },
    });
    await nextTick();

    // Each await wait() in the async chain only schedules the NEXT timer after microtasks
    // flush — so each step must be advanced individually with microtask flushes between.
    vi.advanceTimersByTime(120); // wait(120) fires
    await Promise.resolve();
    await nextTick(); // async resumes: textOpacity=1, schedules wait(1200)

    vi.advanceTimersByTime(1200); // wait(1200) fires
    await Promise.resolve();
    await nextTick(); // async resumes: textOpacity=0, schedules wait(400)

    vi.advanceTimersByTime(400); // wait(400) fires
    await Promise.resolve();
    await nextTick(); // async resumes: sets displayText=secondMessage, await nextTick()
    await Promise.resolve();
    await nextTick(); // component nextTick resolves, schedules wait(120)

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe(secondMessage);
  });

  it("collapses displayText at end of cycle", async () => {
    const singleMsg = "Only.";
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages: [singleMsg], effect: "word-pulse", fadeDuration: 200, wordDuration: 500, pauseDuration: 300 },
    });
    await nextTick();

    vi.advanceTimersByTime(120); // wait(120) fires
    await Promise.resolve();
    await nextTick(); // async resumes: textOpacity=1, schedules wait(500)

    vi.advanceTimersByTime(500); // wait(500) fires
    await Promise.resolve();
    await nextTick(); // async resumes: textOpacity=0, schedules wait(200)

    vi.advanceTimersByTime(200); // wait(200) fires
    await Promise.resolve();
    await nextTick(); // async resumes: end of for loop, displayText="", await nextTick()
    await Promise.resolve();
    await nextTick(); // component nextTick resolves, schedules wait(300)

    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
  });
});
