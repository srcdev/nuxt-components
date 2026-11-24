import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import OverlineText from "../OverlineText.vue";

type OverlineProps = InstanceType<typeof OverlineText>["$props"];

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountOverline = async (props: OverlineProps) => {
  const wrapper = await mountSuspended(OverlineText, { props });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("OverlineText", () => {
  it("mounts without error", async () => {
    const wrapper = await mountOverline({ textContent: "Hello World" });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountOverline({ textContent: "Featured Collection" });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountOverline({
      tag: "p",
      fontSize: "large",
      textContent: "New Arrivals",
      styleClassPassthrough: ["custom-class"],
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure for each tag variant", async () => {
    for (const tag of ["p", "div", "span"] as const) {
      const wrapper = await mountOverline({ tag, textContent: "Snapshot text" });
      expect(wrapper.html()).toMatchSnapshot();
    }
  });

  it("renders correct HTML structure for each fontSize variant", async () => {
    for (const fontSize of ["large", "medium", "small"] as const) {
      const wrapper = await mountOverline({ fontSize, textContent: "Snapshot text" });
      expect(wrapper.html()).toMatchSnapshot();
    }
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountOverline({ textContent: "Default tag" });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it.each([
    ["p", "P"],
    ["span", "SPAN"],
    ["div", "DIV"],
  ] as const)("renders as <%s> when tag='%s'", async (tag, tagName) => {
    const wrapper = await mountOverline({ tag, textContent: "Tag" });
    expect(wrapper.element.tagName).toBe(tagName);
  });

  it("always has the overline-text class", async () => {
    const wrapper = await mountOverline({ textContent: "Base class check" });
    expect(wrapper.classes()).toContain("overline-text");
  });

  // ─── fontSize ────────────────────────────────────────────────────────────

  it("sets data-font-size='medium' by default", async () => {
    const wrapper = await mountOverline({ textContent: "Default fontSize" });
    expect(wrapper.attributes("data-font-size")).toBe("medium");
  });

  it.each(["large", "medium", "small"] as const)("sets data-font-size='%s'", async (fontSize) => {
    const wrapper = await mountOverline({ fontSize, textContent: "Sized" });
    expect(wrapper.attributes("data-font-size")).toBe(fontSize);
  });

  it("does not put the size on the element as a bare class", async () => {
    const wrapper = await mountOverline({ fontSize: "small", textContent: "No bare class" });
    expect(wrapper.classes()).toEqual(["overline-text"]);
  });

  // ─── textContent ─────────────────────────────────────────────────────────

  it("renders the textContent string", async () => {
    const wrapper = await mountOverline({ textContent: "New Arrivals" });
    expect(wrapper.text()).toBe("New Arrivals");
  });

  it("renders an empty string without error", async () => {
    const wrapper = await mountOverline({ textContent: "" });
    expect(wrapper.text()).toBe("");
  });

  it("renders textContent with special characters correctly", async () => {
    const wrapper = await mountOverline({ textContent: "Édition Limitée & Co." });
    expect(wrapper.text()).toBe("Édition Limitée & Co.");
  });

  it("renders HTML-like textContent as text", async () => {
    const wrapper = await mountOverline({ textContent: "<b>not bold</b>" });
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.text()).toBe("<b>not bold</b>");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a styleClassPassthrough array", async () => {
    const wrapper = await mountOverline({ textContent: "Styled", styleClassPassthrough: ["class-a", "class-b"] });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountOverline({ textContent: "Styled", styleClassPassthrough: "solo-class" });
    expect(wrapper.classes()).toContain("solo-class");
  });

  it("renders correctly with all props combined", async () => {
    const wrapper = await mountOverline({
      tag: "span",
      fontSize: "small",
      textContent: "Limited Edition",
      styleClassPassthrough: ["promo-label"],
    });
    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toContain("overline-text");
    expect(wrapper.attributes("data-font-size")).toBe("small");
    expect(wrapper.classes()).toContain("promo-label");
    expect(wrapper.text()).toBe("Limited Edition");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountOverline({ textContent: "Overline", styleClassPassthrough: ["original"] });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });

  it("updates data-font-size when fontSize changes after mount", async () => {
    const wrapper = await mountOverline({ textContent: "Overline", fontSize: "small" });
    await wrapper.setProps({ fontSize: "large" });
    expect(wrapper.attributes("data-font-size")).toBe("large");
  });
});
