import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import CanvasSwitcher from "../CanvasSwitcher.vue";

describe("CanvasSwitcher", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders one button per canvas option", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher);
    expect(wrapper.findAll("button").length).toBe(5);
  });

  it("gives each button an accessible name", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher);
    const labels = wrapper.findAll("button").map((button) => button.text());
    expect(labels).toEqual(["Mobile", "Tablet", "Laptop", "Desktop", "Full width"]);
  });

  it("marks no button as pressed when canvasName is unset", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher);
    const pressed = wrapper.findAll('button[aria-pressed="true"]');
    expect(pressed.length).toBe(0);
  });

  it("marks the matching button as pressed via the canvasName model", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher, {
      props: { canvasName: "tabletCanvas" },
    });
    const buttons = wrapper.findAll("button");
    expect(buttons[1]?.attributes("aria-pressed")).toBe("true");
    expect(buttons[0]?.attributes("aria-pressed")).toBe("false");
  });

  it("updates the canvasName model when a button is clicked", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher, {
      props: { canvasName: "mobileCanvas" },
    });
    await wrapper.findAll("button")[3]?.trigger("click");
    expect(wrapper.emitted("update:canvasName")?.[0]).toEqual(["desktopCanvas"]);
  });

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher, { props: { styleClassPassthrough: "custom-class" } });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher, {
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(CanvasSwitcher, {
      props: { styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
