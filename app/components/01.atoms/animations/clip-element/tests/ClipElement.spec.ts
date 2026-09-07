import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ClipElement from "../ClipElement.vue";

function setTopAndScroll(wrapper: Awaited<ReturnType<typeof mountSuspended>>, top: number) {
  const clipElement = wrapper.find(".clipped-element").element as HTMLElement;
  clipElement.getBoundingClientRect = () => ({ top } as DOMRect);
  window.dispatchEvent(new Event("scroll"));
}

describe("ClipElement", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ClipElement);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(ClipElement);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders the wrapper and clipped-element structure", async () => {
    const wrapper = await mountSuspended(ClipElement);
    expect(wrapper.find(".clip-element-wrapper").exists()).toBe(true);
    expect(wrapper.find(".clipped-element").exists()).toBe(true);
  });

  it("renders slot content inside .clipped-element", async () => {
    const wrapper = await mountSuspended(ClipElement, {
      slots: { default: "<p class='slot-child'>Hello</p>" },
    });
    const content = wrapper.find(".clipped-element");
    expect(content.find(".slot-child").exists()).toBe(true);
    expect(content.find(".slot-child").text()).toBe("Hello");
  });

  it("applies styleClassPassthrough classes to the wrapper", async () => {
    const wrapper = await mountSuspended(ClipElement, {
      props: { styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.find(".clip-element-wrapper").classes()).toContain("custom-class");
  });

  it("clips fully (0px inset) once the element has scrolled past maxClip", async () => {
    const wrapper = await mountSuspended(ClipElement, { props: { maxClip: 100 } });
    setTopAndScroll(wrapper, 150);
    await wrapper.vm.$nextTick();

    const clipElement = wrapper.find(".clipped-element").element as HTMLElement;
    expect(clipElement.style.getPropertyValue("--_clip-path")).toBe("inset(0px 0 0 0)");
  });

  it("increases the clip offset as the element approaches the top of the viewport", async () => {
    const wrapper = await mountSuspended(ClipElement, { props: { maxClip: 100 } });
    setTopAndScroll(wrapper, 40);
    await wrapper.vm.$nextTick();

    const clipElement = wrapper.find(".clipped-element").element as HTMLElement;
    expect(clipElement.style.getPropertyValue("--_clip-path")).toBe("inset(60px 0 0 0)");
  });

  it("keeps clipping past 0px once the element has scrolled above the viewport", async () => {
    const wrapper = await mountSuspended(ClipElement, { props: { maxClip: 100 } });
    setTopAndScroll(wrapper, -20);
    await wrapper.vm.$nextTick();

    const clipElement = wrapper.find(".clipped-element").element as HTMLElement;
    expect(clipElement.style.getPropertyValue("--_clip-path")).toBe("inset(120px 0 0 0)");
  });
});
