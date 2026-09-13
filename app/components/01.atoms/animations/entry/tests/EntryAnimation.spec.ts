// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../EntryAnimation.vue";

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slotsData = {}) => {
  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: propsData,
    slots: {
      default: () => "Content",
      ...slotsData,
    },
  });
};

describe("EntryAnimation", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the given tag", async () => {
    wrapper = await wrapperFactory({ tag: "section" });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("applies the default animation class", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.classes()).toContain("entry-slide-in");
  });

  it("applies the requested animationType class", async () => {
    wrapper = await wrapperFactory({ animationType: "entry-zoom-reveal" });
    expect(wrapper.classes()).toContain("entry-zoom-reveal");
    expect(wrapper.classes()).not.toContain("entry-slide-in");
  });

  it("applies no animation class when skipAnimation is true", async () => {
    wrapper = await wrapperFactory({ skipAnimation: true });
    expect(wrapper.classes()).not.toContain("entry-slide-in");
    expect(wrapper.classes()).not.toContain("entry-zoom-reveal");
    expect(wrapper.classes()).not.toContain("entry-exit-blur");
  });

  it("still applies styleClassPassthrough classes when skipAnimation is true", async () => {
    wrapper = await wrapperFactory({ skipAnimation: true, styleClassPassthrough: ["custom-class"] });
    expect(wrapper.classes()).toContain("custom-class");
    expect(wrapper.classes()).not.toContain("entry-slide-in");
  });

  it("renders slot content", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.text()).toContain("Content");
  });
});
