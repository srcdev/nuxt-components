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

  it("cursor is visible before typing starts", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, typeSpeed: 100 },
    });
    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 1");
  });

  it("cursor hides when typewriter starts typing first character", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, typeSpeed: 100 },
    });

    vi.advanceTimersByTime(100);
    await nextTick();

    expect(wrapper.find(".samaritan-prompt__cursor").attributes("style")).toContain("opacity: 0");
  });

  it("cursor returns when typewriter enters pause phase", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("starts with empty display text and content visible", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
      props: { messages, effect: "word-pulse", pauseDuration: 500 },
    });
    await nextTick();
    expect(wrapper.find(".samaritan-prompt__text").text()).toBe("");
    const style = wrapper.find(".samaritan-prompt__content").attributes("style");
    expect(style).toContain("opacity: 1");
  });

  it("makes content invisible when cycle starts after pause", async () => {
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
    const wrapper = await mountSuspended(SamaritanPrompt, {
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
