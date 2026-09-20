import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ContainerGlow from "../ContainerGlow.vue";

describe("ContainerGlow", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      slots: { one: "<p>One</p>" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default)", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      slots: { one: "<p>One</p>", two: "<p>Two</p>" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Wrapper ────────────────────────────────────────────────────────────

  it("always has the container-glow-wrapper class on the root", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      slots: { one: "<p>One</p>" },
    });
    expect(wrapper.classes()).toContain("container-glow-wrapper");
  });

  // ─── Named dynamic slots ────────────────────────────────────────────────

  it("renders one container-glow item per named slot", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      slots: { one: "<p class='one'>One</p>", two: "<p class='two'>Two</p>", three: "<p class='three'>Three</p>" },
    });
    expect(wrapper.findAll(".container-glow").length).toBe(3);
    expect(wrapper.find(".one").exists()).toBe(true);
    expect(wrapper.find(".two").exists()).toBe(true);
    expect(wrapper.find(".three").exists()).toBe(true);
  });

  it("renders no container-glow items when no slots are provided", async () => {
    const wrapper = await mountSuspended(ContainerGlow);
    expect(wrapper.findAll(".container-glow").length).toBe(0);
  });

  // ─── Tag ────────────────────────────────────────────────────────────────

  it("renders each item as <div> by default", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      slots: { one: "<p>One</p>" },
    });
    expect(wrapper.find(".container-glow").element.tagName).toBe("DIV");
  });

  it.each(["div", "li", "article", "section"] as const)("renders each item as <%s> when tag='%s'", async (tag) => {
    const wrapper = await mountSuspended(ContainerGlow, {
      props: { tag },
      slots: { one: "<p>One</p>" },
    });
    expect(wrapper.find(".container-glow").element.tagName).toBe(tag.toUpperCase());
  });

  // ─── Config ─────────────────────────────────────────────────────────────

  it("applies default config values to the wrapper as CSS custom properties", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      slots: { one: "<p>One</p>" },
    });
    const style = wrapper.element.style;
    expect(style.getPropertyValue("--_gap")).toBe("32");
    expect(style.getPropertyValue("--_blur")).toBe("20");
    expect(style.getPropertyValue("--_spread")).toBe("80");
    expect(style.getPropertyValue("--_direction")).toBe("row");
  });

  it("applies custom config values to the wrapper as CSS custom properties", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      props: { config: { gap: 48, blur: 40, spread: 120, vertical: true } },
      slots: { one: "<p>One</p>" },
    });
    const style = wrapper.element.style;
    expect(style.getPropertyValue("--_gap")).toBe("48");
    expect(style.getPropertyValue("--_blur")).toBe("40");
    expect(style.getPropertyValue("--_spread")).toBe("120");
    expect(style.getPropertyValue("--_direction")).toBe("column");
  });

  it("does not require every config field to be set", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      props: { config: { blur: 5 } },
      slots: { one: "<p>One</p>" },
    });
    const style = wrapper.element.style;
    expect(style.getPropertyValue("--_blur")).toBe("5");
    expect(style.getPropertyValue("--_gap")).toBe("32");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      props: { styleClassPassthrough: "featured" },
      slots: { one: "<p>One</p>" },
    });
    expect(wrapper.classes()).toContain("featured");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      props: { styleClassPassthrough: ["featured", "highlighted"] },
      slots: { one: "<p>One</p>" },
    });
    expect(wrapper.classes()).toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ContainerGlow, {
      props: { styleClassPassthrough: ["featured"] },
      slots: { one: "<p>One</p>" },
    });
    expect(wrapper.classes()).toContain("featured");
    await wrapper.setProps({ styleClassPassthrough: ["highlighted"] });
    expect(wrapper.classes()).not.toContain("featured");
    expect(wrapper.classes()).toContain("highlighted");
  });
});
