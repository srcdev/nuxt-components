import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LinkText from "../LinkText.vue";

type LinkTextProps = InstanceType<typeof LinkText>["$props"];

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountLink = async (props: Partial<LinkTextProps> = {}, slots: Record<string, string> = {}) => {
  const wrapper = await mountSuspended(LinkText, {
    props: { to: "/about", linkText: "About Us", ...props } as LinkTextProps,
    slots,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("LinkText", () => {
  it("mounts without error", async () => {
    const wrapper = await mountLink();
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountLink();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with left slot", async () => {
    const wrapper = await mountLink({}, { left: "<svg data-testid='icon-left' />" });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with right slot", async () => {
    const wrapper = await mountLink({}, { right: "<svg data-testid='icon-right' />" });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with both slots", async () => {
    const wrapper = await mountLink(
      {},
      { left: "<svg data-testid='icon-left' />", right: "<svg data-testid='icon-right' />" }
    );
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountLink({
      to: "https://example.com",
      linkText: "Visit Us",
      external: true,
      target: "_blank",
      styleClassPassthrough: ["custom-class"],
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root and label ──────────────────────────────────────────────────────

  it("always has the link-text class", async () => {
    const wrapper = await mountLink({ to: "/", linkText: "Home" });
    expect(wrapper.classes()).toContain("link-text");
  });

  it("renders the linkText in a label span", async () => {
    const wrapper = await mountLink({ linkText: "Read More" });
    expect(wrapper.find(".link-text__label").text()).toBe("Read More");
  });

  it("renders linkText with special characters", async () => {
    const wrapper = await mountLink({ linkText: "Édition & Co." });
    expect(wrapper.find(".link-text__label").text()).toBe("Édition & Co.");
  });

  it("renders HTML-like linkText as text", async () => {
    const wrapper = await mountLink({ linkText: "<b>not bold</b>" });
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.find(".link-text__label").text()).toBe("<b>not bold</b>");
  });

  it("updates the label when linkText changes after mount", async () => {
    const wrapper = await mountLink({ linkText: "Before" });
    await wrapper.setProps({ linkText: "After" });
    expect(wrapper.find(".link-text__label").text()).toBe("After");
  });

  // ─── Slots ───────────────────────────────────────────────────────────────

  it("renders no icon spans when no slots provided", async () => {
    const wrapper = await mountLink();
    expect(wrapper.find(".link-text__icon--left").exists()).toBe(false);
    expect(wrapper.find(".link-text__icon--right").exists()).toBe(false);
  });

  it("renders left icon span when left slot is provided", async () => {
    const wrapper = await mountLink({}, { left: "<svg />" });
    expect(wrapper.find(".link-text__icon--left").exists()).toBe(true);
    expect(wrapper.find(".link-text__icon--right").exists()).toBe(false);
  });

  it("renders right icon span when right slot is provided", async () => {
    const wrapper = await mountLink({}, { right: "<svg />" });
    expect(wrapper.find(".link-text__icon--left").exists()).toBe(false);
    expect(wrapper.find(".link-text__icon--right").exists()).toBe(true);
  });

  it("renders left icon before label and right icon after label", async () => {
    const wrapper = await mountLink({}, { left: "<span class='l' />", right: "<span class='r' />" });
    const children = Array.from((wrapper.element as HTMLElement).children);
    expect(children.map((child) => child.classList[1] ?? child.classList[0])).toEqual([
      "link-text__icon--left",
      "link-text__label",
      "link-text__icon--right",
    ]);
  });

  // ─── Link attributes ─────────────────────────────────────────────────────

  it("renders the to prop as href", async () => {
    const wrapper = await mountLink({ to: "/services" });
    expect(wrapper.attributes("href")).toBe("/services");
  });

  it("passes target prop to NuxtLink", async () => {
    const wrapper = await mountLink({ to: "https://example.com", target: "_blank" });
    expect(wrapper.attributes("target")).toBe("_blank");
  });

  it("adds rel noopener to an external link opening in a new tab", async () => {
    const wrapper = await mountLink({ to: "https://example.com", external: true, target: "_blank" });
    expect(wrapper.attributes("rel")).toContain("noopener");
  });

  it("forwards an aria-label to the link for an icon-only link", async () => {
    const wrapper = await mountSuspended(LinkText, {
      props: { to: "/", linkText: "" },
      attrs: { "aria-label": "Home" },
      slots: { left: "<svg />" },
    });
    mounted.push(wrapper);
    expect(wrapper.attributes("aria-label")).toBe("Home");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a styleClassPassthrough array", async () => {
    const wrapper = await mountLink({ styleClassPassthrough: ["class-a", "class-b"] });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountLink({ styleClassPassthrough: "solo-class" });
    expect(wrapper.classes()).toContain("solo-class");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountLink({ styleClassPassthrough: ["original"] });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
