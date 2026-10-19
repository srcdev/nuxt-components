import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import EyebrowText from "../EyebrowText.vue";

type EyebrowProps = InstanceType<typeof EyebrowText>["$props"];

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountEyebrow = async (props: EyebrowProps) => {
  const wrapper = await mountSuspended(EyebrowText, { props });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("EyebrowText", () => {
  it("mounts without error", async () => {
    const wrapper = await mountEyebrow({ textContent: "Hello World" });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountEyebrow({ textContent: "Featured Collection" });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountEyebrow({
      tag: "p",
      fontSize: "large",
      textContent: "New Arrivals",
      styleClassPassthrough: ["custom-class"],
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure for each tag variant", async () => {
    for (const tag of ["p", "div", "span"] as const) {
      const wrapper = await mountEyebrow({ tag, textContent: "Snapshot text" });
      expect(wrapper.html()).toMatchSnapshot();
    }
  });

  it("renders correct HTML structure for each fontSize variant", async () => {
    for (const fontSize of ["large", "medium", "small"] as const) {
      const wrapper = await mountEyebrow({ fontSize, textContent: "Snapshot text" });
      expect(wrapper.html()).toMatchSnapshot();
    }
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountEyebrow({ textContent: "Default tag" });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it.each([
    ["p", "P"],
    ["span", "SPAN"],
    ["div", "DIV"],
  ] as const)("renders as <%s> when tag='%s'", async (tag, tagName) => {
    const wrapper = await mountEyebrow({ tag, textContent: "Tag" });
    expect(wrapper.element.tagName).toBe(tagName);
  });

  it("always has the eyebrow-text class", async () => {
    const wrapper = await mountEyebrow({ textContent: "Base class check" });
    expect(wrapper.classes()).toContain("eyebrow-text");
  });

  // ─── fontSize ────────────────────────────────────────────────────────────

  it("sets data-font-size='medium' by default", async () => {
    const wrapper = await mountEyebrow({ textContent: "Default fontSize" });
    expect(wrapper.attributes("data-font-size")).toBe("medium");
  });

  it.each(["large", "medium", "small"] as const)("sets data-font-size='%s'", async (fontSize) => {
    const wrapper = await mountEyebrow({ fontSize, textContent: "Sized" });
    expect(wrapper.attributes("data-font-size")).toBe(fontSize);
  });

  it("does not put the size on the element as a bare class", async () => {
    const wrapper = await mountEyebrow({ fontSize: "small", textContent: "No bare class" });
    expect(wrapper.classes()).toEqual(["eyebrow-text"]);
  });

  // ─── textContent ─────────────────────────────────────────────────────────

  it("renders the textContent string", async () => {
    const wrapper = await mountEyebrow({ textContent: "New Arrivals" });
    expect(wrapper.text()).toBe("New Arrivals");
  });

  it("renders an empty string without error", async () => {
    const wrapper = await mountEyebrow({ textContent: "" });
    expect(wrapper.text()).toBe("");
  });

  it("renders textContent with special characters correctly", async () => {
    const wrapper = await mountEyebrow({ textContent: "Édition Limitée & Co." });
    expect(wrapper.text()).toBe("Édition Limitée & Co.");
  });

  it("renders HTML-like textContent as text", async () => {
    const wrapper = await mountEyebrow({ textContent: "<b>not bold</b>" });
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.text()).toBe("<b>not bold</b>");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a styleClassPassthrough array", async () => {
    const wrapper = await mountEyebrow({ textContent: "Styled", styleClassPassthrough: ["class-a", "class-b"] });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountEyebrow({ textContent: "Styled", styleClassPassthrough: "solo-class" });
    expect(wrapper.classes()).toContain("solo-class");
  });

  it("renders correctly with all props combined", async () => {
    const wrapper = await mountEyebrow({
      tag: "span",
      fontSize: "small",
      textContent: "Limited Edition",
      styleClassPassthrough: ["promo-label"],
    });
    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toContain("eyebrow-text");
    expect(wrapper.attributes("data-font-size")).toBe("small");
    expect(wrapper.classes()).toContain("promo-label");
    expect(wrapper.text()).toBe("Limited Edition");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountEyebrow({ textContent: "Eyebrow", styleClassPassthrough: ["original"] });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });

  it("updates data-font-size when fontSize changes after mount", async () => {
    const wrapper = await mountEyebrow({ textContent: "Eyebrow", fontSize: "small" });
    await wrapper.setProps({ fontSize: "large" });
    expect(wrapper.attributes("data-font-size")).toBe("large");
  });
});
