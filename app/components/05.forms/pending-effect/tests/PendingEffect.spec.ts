import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PendingEffect from "../PendingEffect.vue";
import InputButtonCore from "../../input-button/InputButtonCore.vue";

describe("PendingEffect", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(PendingEffect);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders a prefixed svg container with blur and line rects", async () => {
    const wrapper = await mountSuspended(PendingEffect);
    const svg = wrapper.find("svg.pending-effect-container");
    expect(svg.exists()).toBe(true);
    expect(svg.find("rect.pending-effect-blur").exists()).toBe(true);
    expect(svg.find("rect.pending-effect-line").exists()).toBe(true);
  });

  it("is hidden from assistive technology and not focusable", async () => {
    const wrapper = await mountSuspended(PendingEffect);
    const svg = wrapper.find("svg");
    expect(svg.attributes("aria-hidden")).toBe("true");
    expect(svg.attributes("focusable")).toBe("false");
  });

  it("defaults data-theme to default and reflects the theme prop", async () => {
    const wrapper = await mountSuspended(PendingEffect);
    expect(wrapper.find("svg").attributes("data-theme")).toBe("default");

    await wrapper.setProps({ theme: "error" });
    expect(wrapper.find("svg").attributes("data-theme")).toBe("error");
  });

  it("applies styleClassPassthrough and updates on change", async () => {
    const wrapper = await mountSuspended(PendingEffect, { props: { styleClassPassthrough: ["one"] } });
    expect(wrapper.find("svg").classes()).toContain("one");

    await wrapper.setProps({ styleClassPassthrough: "two three" });
    await nextTick();
    const classes = wrapper.find("svg").classes();
    expect(classes).toContain("two");
    expect(classes).toContain("three");
    expect(classes).not.toContain("one");
  });

  describe("inside InputButtonCore", () => {
    it("is rendered only when hasPendingEffect is true", async () => {
      const without = await mountSuspended(InputButtonCore, { props: { buttonText: "Save" } });
      expect(without.find(".pending-effect-container").exists()).toBe(false);

      const withEffect = await mountSuspended(InputButtonCore, {
        props: { buttonText: "Save", hasPendingEffect: true },
      });
      expect(withEffect.find(".pending-effect-container").exists()).toBe(true);
      expect(withEffect.find("button").classes()).toContain("pending-effect");
    });

    it("passes the button theme through", async () => {
      const wrapper = await mountSuspended(InputButtonCore, {
        props: { buttonText: "Save", hasPendingEffect: true, theme: "success" },
      });
      expect(wrapper.find(".pending-effect-container").attributes("data-theme")).toBe("success");
    });
  });
});
