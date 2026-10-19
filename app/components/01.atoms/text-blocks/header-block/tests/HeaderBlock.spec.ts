import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import HeaderBlock from "../HeaderBlock.vue";

type HeaderBlockProps = InstanceType<typeof HeaderBlock>["$props"];

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountHeader = async (props: HeaderBlockProps = {}, content = "Title") => {
  const wrapper = await mountSuspended(HeaderBlock, { props, slots: { default: content } });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("HeaderBlock", () => {
  it("mounts without error", async () => {
    const wrapper = await mountHeader({}, "Hello World");
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountHeader({}, "Default heading");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountHeader(
      { tagLevel: 3, classLevel: 5, id: "section-heading", styleClassPassthrough: ["custom-class"] },
      "Custom heading"
    );
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root class ──────────────────────────────────────────────────────────

  it("always has the header-block class", async () => {
    const wrapper = await mountHeader({ tagLevel: 4, classLevel: 2, styleClassPassthrough: "extra" });
    expect(wrapper.classes()).toContain("header-block");
  });

  // ─── tagLevel / classLevel ───────────────────────────────────────────────

  it("defaults to an h1 with the page-heading-1 class", async () => {
    const wrapper = await mountHeader();
    expect(wrapper.element.tagName).toBe("H1");
    expect(wrapper.classes()).toContain("page-heading-1");
  });

  it("renders the tag matching tagLevel", async () => {
    const wrapper = await mountHeader({ tagLevel: 4 });
    expect(wrapper.element.tagName).toBe("H4");
  });

  it("applies the page-heading class matching classLevel, independent of tagLevel", async () => {
    const wrapper = await mountHeader({ tagLevel: 2, classLevel: 6 });
    expect(wrapper.element.tagName).toBe("H2");
    expect(wrapper.classes()).toContain("page-heading-6");
    expect(wrapper.classes()).not.toContain("page-heading-2");
  });

  it("accepts tagLevel/classLevel as numeric strings", async () => {
    const wrapper = await mountHeader({ tagLevel: "5", classLevel: "2" });
    expect(wrapper.element.tagName).toBe("H5");
    expect(wrapper.classes()).toContain("page-heading-2");
  });

  it("clamps an out-of-range tagLevel to 1", async () => {
    // @ts-expect-error deliberately invalid at the type level to test the runtime clamp
    const wrapper = await mountHeader({ tagLevel: 9 });
    expect(wrapper.element.tagName).toBe("H1");
  });

  it("clamps an out-of-range classLevel to 1", async () => {
    // @ts-expect-error deliberately invalid at the type level to test the runtime clamp
    const wrapper = await mountHeader({ classLevel: 0 });
    expect(wrapper.classes()).toContain("page-heading-1");
  });

  it("falls back to level 1 for fractional and negative levels", async () => {
    // @ts-expect-error deliberately invalid at the type level to test the runtime clamp
    const wrapper = await mountHeader({ tagLevel: 2.5, classLevel: -3 });
    expect(wrapper.element.tagName).toBe("H1");
    expect(wrapper.classes()).toContain("page-heading-1");
  });

  it("updates the tag and class when the levels change after mount", async () => {
    const wrapper = await mountHeader({ tagLevel: 2, classLevel: 2 });
    await wrapper.setProps({ tagLevel: 3, classLevel: 4 });
    expect(wrapper.element.tagName).toBe("H3");
    expect(wrapper.classes()).toContain("page-heading-4");
    expect(wrapper.classes()).not.toContain("page-heading-2");
  });

  // ─── Slot content ────────────────────────────────────────────────────────

  it("renders slot content", async () => {
    const wrapper = await mountHeader({}, "<span class='highlight'>Big</span> idea");
    expect(wrapper.find(".highlight").exists()).toBe(true);
    expect(wrapper.text()).toContain("idea");
  });

  // ─── id ──────────────────────────────────────────────────────────────────

  it("does not render an id attribute by default", async () => {
    const wrapper = await mountHeader();
    expect(wrapper.attributes("id")).toBeUndefined();
  });

  it("renders a given id, for pairing with a wrapping section's aria-labelledby", async () => {
    const wrapper = await mountHeader({ id: "section-heading" });
    expect(wrapper.attributes("id")).toBe("section-heading");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountHeader({ styleClassPassthrough: "hero-title" });
    expect(wrapper.classes()).toContain("hero-title");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountHeader({ styleClassPassthrough: ["original"] });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
    expect(wrapper.classes()).toContain("header-block");
  });
});
