import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import EyebrowText from "../EyebrowText.vue";

describe("EyebrowText", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "Hello World" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "Featured Collection" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: {
        tag: "p",
        fontSize: "large",
        textContent: "New Arrivals",
        styleClassPassthrough: ["custom-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure for each tag variant", async () => {
    for (const tag of ["p", "div", "span"] as const) {
      const wrapper = await mountSuspended(EyebrowText, {
        props: { tag, textContent: "Snapshot text" },
      });
      expect(wrapper.html()).toMatchSnapshot();
    }
  });

  it("renders correct HTML structure for each fontSize variant", async () => {
    for (const fontSize of ["large", "medium", "small"] as const) {
      const wrapper = await mountSuspended(EyebrowText, {
        props: { fontSize, textContent: "Snapshot text" },
      });
      expect(wrapper.html()).toMatchSnapshot();
    }
  });

  // ─── Tag rendering ───────────────────────────────────────────────────────

  it("renders as <div> by default", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "Default tag" },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders as <p> when tag='p'", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { tag: "p", textContent: "Paragraph tag" },
    });
    expect(wrapper.element.tagName).toBe("P");
  });

  it("renders as <span> when tag='span'", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { tag: "span", textContent: "Span tag" },
    });
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it("renders as <div> when tag='div'", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { tag: "div", textContent: "Div tag" },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  // ─── Base class ──────────────────────────────────────────────────────────

  it("always has the eyebrow-text class", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "Base class check" },
    });
    expect(wrapper.classes()).toContain("eyebrow-text");
  });

  // ─── fontSize class ──────────────────────────────────────────────────────

  it("applies the medium class by default", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "Default fontSize" },
    });
    expect(wrapper.classes()).toContain("medium");
  });

  it("applies the large class when fontSize='large'", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { fontSize: "large", textContent: "Large text" },
    });
    expect(wrapper.classes()).toContain("large");
  });

  it("applies the small class when fontSize='small'", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { fontSize: "small", textContent: "Small text" },
    });
    expect(wrapper.classes()).toContain("small");
  });

  it("applies only one fontSize class at a time", async () => {
    const fontSizes = ["large", "medium", "small"] as const;
    for (const fontSize of fontSizes) {
      const wrapper = await mountSuspended(EyebrowText, {
        props: { fontSize, textContent: "One class only" },
      });
      const otherSizes = fontSizes.filter((s) => s !== fontSize);
      otherSizes.forEach((size) => {
        expect(wrapper.classes()).not.toContain(size);
      });
    }
  });

  // ─── textContent ─────────────────────────────────────────────────────────

  it("renders the textContent string", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "New Arrivals" },
    });
    expect(wrapper.text()).toBe("New Arrivals");
  });

  it("renders an empty string without error", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "" },
    });
    expect(wrapper.text()).toBe("");
  });

  it("renders textContent with special characters correctly", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "Édition Limitée & Co." },
    });
    expect(wrapper.text()).toBe("Édition Limitée & Co.");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a styleClassPassthrough array", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: {
        textContent: "Styled",
        styleClassPassthrough: ["class-a", "class-b"],
      },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "Styled", styleClassPassthrough: "solo-class" },
    });
    expect(wrapper.classes()).toContain("solo-class");
  });

  it("renders cleanly with no styleClassPassthrough prop", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: { textContent: "No passthrough" },
    });
    expect(wrapper.classes()).toContain("eyebrow-text");
  });

  // ─── Combined props ───────────────────────────────────────────────────────

  it("renders correctly with all props combined", async () => {
    const wrapper = await mountSuspended(EyebrowText, {
      props: {
        tag: "span",
        fontSize: "small",
        textContent: "Limited Edition",
        styleClassPassthrough: ["promo-label"],
      },
    });
    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toContain("eyebrow-text");
    // expect(wrapper.classes()).toContain("small");
    expect(wrapper.classes()).toContain("promo-label");
    expect(wrapper.text()).toBe("Limited Edition");
  });
});
