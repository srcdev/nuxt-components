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
});
