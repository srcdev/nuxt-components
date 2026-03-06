import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import HeroText from "../HeroText.vue";

describe("HeroText", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h1",
        axis: "horizontal",
        fontSize: "title",
        textContent: [
          { text: "Designing", styleClass: "normal" },
          { text: "Artistry", styleClass: "accent" },
          { text: "at Home", styleClass: "normal" },
        ],
        styleClassPassthrough: [],
      },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h2",
        axis: "vertical",
        fontSize: "display",
        textContent: [
          { text: "Hello", styleClass: "normal" },
          { text: "World", styleClass: "accent" },
        ],
        styleClassPassthrough: ["custom-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("applies axis and fontSize classes", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h3",
        axis: "vertical",
        fontSize: "heading",
        textContent: [{ text: "A", styleClass: "normal" }],
        styleClassPassthrough: [],
      },
    });
    const el = wrapper.find(".hero-text");
    expect(el.classes()).toContain("axis-vertical");
    expect(el.classes()).toContain("heading");
  });

  it("renders all textContent items as spans", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h4",
        textContent: [
          { text: "One", styleClass: "normal" },
          { text: "Two", styleClass: "accent" },
          { text: "Three", styleClass: "normal" },
        ],
      },
    });
    const spans = wrapper.findAll("span");
    expect(spans.length).toBe(3);
    expect(spans[0]?.text()).toBe("One");
    expect(spans[1]?.text()).toBe("Two");
    expect(spans[2]?.text()).toBe("Three");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h5",
        textContent: [{ text: "Styled", styleClass: "accent" }],
        styleClassPassthrough: ["extra-class", "another-class"],
      },
    });
    const el = wrapper.find(".hero-text");
    expect(el.classes()).toContain("extra-class");
    expect(el.classes()).toContain("another-class");
  });

  // -------------------------
  // normalisedContent
  // -------------------------
  it("trims leading and trailing whitespace from text segments", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h1",
        textContent: [{ text: "  Hello  ", styleClass: "normal" }],
      },
    });
    expect(wrapper.find("span").element.textContent).toBe("Hello");
  });

  it("adds a trailing space to all segments except the last", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h1",
        textContent: [
          { text: "One", styleClass: "normal" },
          { text: "Two", styleClass: "normal" },
          { text: "Three", styleClass: "normal" },
        ],
      },
    });
    const spans = wrapper.findAll("span");
    expect(spans[0]!.element.textContent).toBe("One ");
    expect(spans[1]!.element.textContent).toBe("Two ");
    expect(spans[2]!.element.textContent).toBe("Three");
  });

  it("does not add a trailing space when there is only one segment", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h1",
        textContent: [{ text: "Solo", styleClass: "normal" }],
      },
    });
    expect(wrapper.find("span").element.textContent).toBe("Solo");
  });

  // -------------------------
  // Icon
  // -------------------------
  it("renders an icon when the icon prop is provided", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h1",
        textContent: [{ text: "Hello", styleClass: "normal" }],
        icon: "lucide:sparkles",
      },
    });
    expect(wrapper.find(".hero-text__icon").exists()).toBe(true);
  });

  it("does not render an icon when the icon prop is omitted", async () => {
    const wrapper = await mountSuspended(HeroText, {
      props: {
        tag: "h1",
        textContent: [{ text: "Hello", styleClass: "normal" }],
      },
    });
    expect(wrapper.find(".hero-text__icon").exists()).toBe(false);
  });
});
