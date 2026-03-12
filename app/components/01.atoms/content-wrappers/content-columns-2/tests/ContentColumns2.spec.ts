import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ContentColumns2 from "../ContentColumns2.vue";

describe("ContentColumns2", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ContentColumns2);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      slots: {
        slot1: "<p>Column 1</p>",
        slot2: "<p>Column 2</p>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("applies the default data-testid", async () => {
    const wrapper = await mountSuspended(ContentColumns2);
    expect(wrapper.find("[data-testid='content-columns-2']").exists()).toBe(true);
  });

  it("applies a custom data-testid", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      props: { dataTestid: "my-layout" },
    });
    expect(wrapper.find("[data-testid='my-layout']").exists()).toBe(true);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      props: { styleClassPassthrough: ["custom-class", "another-class"] },
    });
    const el = wrapper.find(".content-columns-2");
    expect(el.classes()).toContain("custom-class");
    expect(el.classes()).toContain("another-class");
  });

  it("applies styleClassPassthrough as a string", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      props: { styleClassPassthrough: "string-class" },
    });
    expect(wrapper.find(".content-columns-2").classes()).toContain("string-class");
  });

  it("renders slot1 content when slot1 is provided", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      slots: { slot1: "<p>Left content</p>" },
    });
    expect(wrapper.find(".col-1").exists()).toBe(true);
    expect(wrapper.find(".col-1").text()).toBe("Left content");
  });

  it("renders slot2 content when slot2 is provided", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      slots: { slot2: "<p>Right content</p>" },
    });
    expect(wrapper.find(".col-2").exists()).toBe(true);
    expect(wrapper.find(".col-2").text()).toBe("Right content");
  });

  it("does not render col-1 when slot1 is not provided", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      slots: { slot2: "<p>Right only</p>" },
    });
    expect(wrapper.find(".col-1").exists()).toBe(false);
  });

  it("does not render col-2 when slot2 is not provided", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      slots: { slot1: "<p>Left only</p>" },
    });
    expect(wrapper.find(".col-2").exists()).toBe(false);
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ContentColumns2);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it.each(["section", "article", "main"] as const)("renders as <%s> when tag prop is set", async (tag) => {
    const wrapper = await mountSuspended(ContentColumns2, { props: { tag } });
    expect(wrapper.element.tagName).toBe(tag.toUpperCase());
  });

  it("renders neither column when no slots are provided", async () => {
    const wrapper = await mountSuspended(ContentColumns2);
    expect(wrapper.find(".col-1").exists()).toBe(false);
    expect(wrapper.find(".col-2").exists()).toBe(false);
  });

  it("renders both columns when both slots are provided", async () => {
    const wrapper = await mountSuspended(ContentColumns2, {
      slots: {
        slot1: "<p>Left</p>",
        slot2: "<p>Right</p>",
      },
    });
    expect(wrapper.find(".col-1").exists()).toBe(true);
    expect(wrapper.find(".col-2").exists()).toBe(true);
  });
});
