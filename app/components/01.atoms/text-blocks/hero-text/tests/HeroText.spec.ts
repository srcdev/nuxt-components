import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import HeroText from "../HeroText.vue";
import type { TextConfig } from "~/types/components";

type HeroTextProps = InstanceType<typeof HeroText>["$props"];

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountHero = async (props: Partial<HeroTextProps> = {}) => {
  const wrapper = await mountSuspended(HeroText, {
    props: { tag: "h1", textContent: [{ text: "Hello", styleClass: "normal" }], ...props } as HeroTextProps,
  });
  mounted.push(wrapper);
  return wrapper;
};

const segmentTexts = (wrapper: Awaited<ReturnType<typeof mountHero>>) =>
  wrapper.findAll(".hero-text-segment").map((span) => span.element.textContent);

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("HeroText", () => {
  it("mounts without error", async () => {
    const wrapper = await mountHero();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountHero({
      tag: "h2",
      axis: "vertical",
      fontSize: "display",
      textContent: [
        { text: "Hello", styleClass: "normal" },
        { text: "World", styleClass: "accent" },
      ],
      styleClassPassthrough: ["custom-class"],
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Size and axis ───────────────────────────────────────────────────────

  it("defaults to data-font-size='title' and data-axis='horizontal'", async () => {
    const wrapper = await mountHero();
    expect(wrapper.attributes("data-font-size")).toBe("title");
    expect(wrapper.attributes("data-axis")).toBe("horizontal");
  });

  it("sets data-axis and data-font-size from the props", async () => {
    const wrapper = await mountHero({ tag: "h3", axis: "vertical", fontSize: "heading" });
    expect(wrapper.attributes("data-axis")).toBe("vertical");
    expect(wrapper.attributes("data-font-size")).toBe("heading");
  });

  it("puts no bare size or axis class on the root", async () => {
    const wrapper = await mountHero({ axis: "vertical", fontSize: "label" });
    expect(wrapper.classes()).toEqual(["hero-text"]);
  });

  it("updates the attributes when the props change after mount", async () => {
    const wrapper = await mountHero({ fontSize: "label" });
    await wrapper.setProps({ fontSize: "display", axis: "vertical" });
    expect(wrapper.attributes("data-font-size")).toBe("display");
    expect(wrapper.attributes("data-axis")).toBe("vertical");
  });

  it("renders the tag from the tag prop", async () => {
    const wrapper = await mountHero({ tag: "h4" });
    expect(wrapper.element.tagName).toBe("H4");
  });

  it("renders the id when given", async () => {
    const wrapper = await mountHero({ id: "hero-heading" });
    expect(wrapper.attributes("id")).toBe("hero-heading");
  });

  // ─── Segments ────────────────────────────────────────────────────────────

  it("renders every textContent item as a hero-text-segment span with its styleClass", async () => {
    const wrapper = await mountHero({
      tag: "h4",
      textContent: [
        { text: "One", styleClass: "normal" },
        { text: "Two", styleClass: "accent" },
        { text: "Three" },
      ],
    });
    const spans = wrapper.findAll(".hero-text-segment");
    expect(spans).toHaveLength(3);
    expect(spans[0]?.classes()).toContain("normal");
    expect(spans[1]?.classes()).toContain("accent");
    expect(spans[2]?.classes()).toEqual(["hero-text-segment"]);
  });

  it("trims leading and trailing whitespace from text segments", async () => {
    const wrapper = await mountHero({ textContent: [{ text: "  Hello  ", styleClass: "normal" }] });
    expect(segmentTexts(wrapper)).toEqual(["Hello"]);
  });

  it("adds a trailing space to all segments except the last", async () => {
    const wrapper = await mountHero({
      textContent: [{ text: "One" }, { text: "Two" }, { text: "Three" }],
    });
    expect(segmentTexts(wrapper)).toEqual(["One ", "Two ", "Three"]);
  });

  it("drops segments with empty, blank or missing text, and spaces only the remaining ones", async () => {
    const wrapper = await mountHero({
      textContent: [
        { text: "One" },
        { text: "" },
        { text: "   " },
        { text: undefined } as unknown as TextConfig,
        null as unknown as TextConfig,
        { text: "Two" },
      ],
    });
    expect(segmentTexts(wrapper)).toEqual(["One ", "Two"]);
  });

  it("renders nothing but the heading for an empty textContent", async () => {
    const wrapper = await mountHero({ textContent: [] });
    expect(wrapper.findAll(".hero-text-segment")).toHaveLength(0);
  });

  it("renders HTML-like text as text", async () => {
    const wrapper = await mountHero({ textContent: [{ text: "<b>not bold</b>" }] });
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.text()).toBe("<b>not bold</b>");
  });

  // ─── Icon ────────────────────────────────────────────────────────────────

  it("renders a decorative icon when the icon prop is provided", async () => {
    const wrapper = await mountHero({ icon: "lucide:sparkles" });
    const icon = wrapper.find(".hero-text__icon");
    expect(icon.exists()).toBe(true);
    expect(icon.attributes("aria-hidden")).toBe("true");
  });

  it("does not render an icon when the icon prop is omitted", async () => {
    const wrapper = await mountHero();
    expect(wrapper.find(".hero-text__icon").exists()).toBe(false);
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountHero({ styleClassPassthrough: ["extra-class", "another-class"] });
    expect(wrapper.classes()).toContain("extra-class");
    expect(wrapper.classes()).toContain("another-class");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountHero({ styleClassPassthrough: ["original"] });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
