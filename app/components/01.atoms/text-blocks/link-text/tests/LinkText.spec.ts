import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LinkText from "../LinkText.vue";

describe("LinkText", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/about", linkText: "About Us" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/about", linkText: "About Us" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with left slot", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/about", linkText: "About Us" },
      slots: { left: "<svg data-testid='icon-left' />" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with right slot", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/about", linkText: "About Us" },
      slots: { right: "<svg data-testid='icon-right' />" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with both slots", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/about", linkText: "About Us" },
      slots: {
        left: "<svg data-testid='icon-left' />",
        right: "<svg data-testid='icon-right' />",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: {
        to: "https://example.com",
        linkText: "Visit Us",
        external: true,
        target: "_blank",
        styleClassPassthrough: ["custom-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Base class ──────────────────────────────────────────────────────────

  it("always has the link-text class", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "Home" },
    });
    expect(wrapper.classes()).toContain("link-text");
  });

  // ─── linkText ────────────────────────────────────────────────────────────

  it("renders the linkText in a label span", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "Read More" },
    });
    expect(wrapper.find(".link-text__label").text()).toBe("Read More");
  });

  it("renders linkText with special characters", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "Édition & Co." },
    });
    expect(wrapper.find(".link-text__label").text()).toBe("Édition & Co.");
  });

  // ─── Slots ───────────────────────────────────────────────────────────────

  it("renders no icon spans when no slots provided", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "No Icons" },
    });
    expect(wrapper.find(".link-text__icon--left").exists()).toBe(false);
    expect(wrapper.find(".link-text__icon--right").exists()).toBe(false);
  });

  it("renders left icon span when left slot is provided", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "With Left Icon" },
      slots: { left: "<svg />" },
    });
    expect(wrapper.find(".link-text__icon--left").exists()).toBe(true);
    expect(wrapper.find(".link-text__icon--right").exists()).toBe(false);
  });

  it("renders right icon span when right slot is provided", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "With Right Icon" },
      slots: { right: "<svg />" },
    });
    expect(wrapper.find(".link-text__icon--left").exists()).toBe(false);
    expect(wrapper.find(".link-text__icon--right").exists()).toBe(true);
  });

  it("renders both icon spans when both slots are provided", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "Both Icons" },
      slots: { left: "<svg />", right: "<svg />" },
    });
    expect(wrapper.find(".link-text__icon--left").exists()).toBe(true);
    expect(wrapper.find(".link-text__icon--right").exists()).toBe(true);
  });

  // ─── Props ───────────────────────────────────────────────────────────────

  it("passes target prop to NuxtLink", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "https://example.com", linkText: "External", target: "_blank" },
    });
    expect(wrapper.attributes("target")).toBe("_blank");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a styleClassPassthrough array", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: {
        to: "/",
        linkText: "Styled",
        styleClassPassthrough: ["class-a", "class-b"],
      },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "Styled", styleClassPassthrough: "solo-class" },
    });
    expect(wrapper.classes()).toContain("solo-class");
  });

  // ─── DOM order ───────────────────────────────────────────────────────────

  it("renders left icon before label and right icon after label", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "Ordered" },
      slots: { left: "<span class='l' />", right: "<span class='r' />" },
    });
    const children = wrapper.element.children;
    expect(children[0].classList.contains("link-text__icon--left")).toBe(true);
    expect(children[1].classList.contains("link-text__label")).toBe(true);
    expect(children[2].classList.contains("link-text__icon--right")).toBe(true);
  });
});
