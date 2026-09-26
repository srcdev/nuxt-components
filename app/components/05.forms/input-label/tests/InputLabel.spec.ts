import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputLabel from "../InputLabel.vue";

const createWrapper = (props = {}, slots = {}) =>
  mountSuspended(InputLabel, {
    props: { id: "test-input", ...props },
    slots,
  });

describe("InputLabel", () => {
  describe("rendering", () => {
    it("renders a label linked to the control id", async () => {
      const wrapper = await createWrapper({ id: "email-input" });
      const label = wrapper.find("label");

      expect(label.exists()).toBe(true);
      expect(label.attributes("for")).toBe("email-input");
      expect(label.classes()).toEqual(["input-label"]);
    });

    it("updates for when the id changes", async () => {
      const wrapper = await createWrapper({ id: "initial-id" });
      await wrapper.setProps({ id: "updated-id" });

      expect(wrapper.find("label").attributes("for")).toBe("updated-id");
    });

    it("renders an empty label when no slots are given", async () => {
      const wrapper = await createWrapper();

      expect(wrapper.find("label").text()).toBe("");
    });

    it("does not leak removed props as attributes", async () => {
      const wrapper = await createWrapper();
      const label = wrapper.find("label");

      expect(label.attributes("name")).toBeUndefined();
      expect(label.attributes("theme")).toBeUndefined();
    });
  });

  describe("slots", () => {
    it("renders the textLabel slot", async () => {
      const wrapper = await createWrapper({}, { textLabel: "Email address" });

      expect(wrapper.find("label").text()).toBe("Email address");
    });

    it("renders the htmlLabel slot", async () => {
      const wrapper = await createWrapper({}, { htmlLabel: "<strong>Required:</strong> Email" });
      const label = wrapper.find("label");

      expect(label.find("strong").text()).toBe("Required:");
      expect(label.text()).toBe("Required: Email");
    });

    it("renders htmlLabel before textLabel when both are given", async () => {
      const wrapper = await createWrapper({}, { htmlLabel: "<em>HTML</em>", textLabel: "Text" });
      const html = wrapper.find("label").html();

      expect(html.indexOf("<em>HTML</em>")).toBeGreaterThan(-1);
      expect(html.indexOf("<em>HTML</em>")).toBeLessThan(html.indexOf("Text"));
    });

    it("escapes special characters in textLabel", async () => {
      const wrapper = await createWrapper({}, { textLabel: "A & B < C" });

      expect(wrapper.find("label").text()).toBe("A & B < C");
    });
  });

  describe("state hooks", () => {
    it("defaults data-input-variant to normal", async () => {
      const wrapper = await createWrapper();

      expect(wrapper.find("label").attributes("data-input-variant")).toBe("normal");
    });

    it.each(["normal", "outlined", "underlined"] as const)("renders data-input-variant=%s", async (inputVariant) => {
      const wrapper = await createWrapper({ inputVariant });

      expect(wrapper.find("label").attributes("data-input-variant")).toBe(inputVariant);
    });

    it("omits data-invalid by default", async () => {
      const wrapper = await createWrapper();

      expect(wrapper.find("label").attributes("data-invalid")).toBeUndefined();
    });

    it("renders data-invalid when the field has an error", async () => {
      const wrapper = await createWrapper({ fieldHasError: true });

      expect(wrapper.find("label").attributes("data-invalid")).toBe("");
    });

    it("toggles data-invalid reactively", async () => {
      const wrapper = await createWrapper();
      await wrapper.setProps({ fieldHasError: true });
      expect(wrapper.find("label").attributes("data-invalid")).toBe("");

      await wrapper.setProps({ fieldHasError: false });
      expect(wrapper.find("label").attributes("data-invalid")).toBeUndefined();
    });
  });

  describe("indicator", () => {
    const indicator = (wrapper: Awaited<ReturnType<typeof createWrapper>>) => wrapper.find(".input-label-indicator");

    it("renders no marker by default", async () => {
      const wrapper = await createWrapper({ required: true });

      expect(indicator(wrapper).exists()).toBe(false);
    });

    it("marks a required field with a hidden asterisk in required mode", async () => {
      const wrapper = await createWrapper({ indicator: "required", required: true }, { textLabel: "Email" });
      const marker = indicator(wrapper);

      expect(marker.attributes("data-indicator")).toBe("required");
      expect(marker.attributes("aria-hidden")).toBe("true");
      expect(marker.text()).toBe("*");
    });

    it("leaves an optional field unmarked in required mode", async () => {
      const wrapper = await createWrapper({ indicator: "required", required: false });

      expect(indicator(wrapper).exists()).toBe(false);
    });

    it("marks an optional field with visible, announced text in optional mode", async () => {
      const wrapper = await createWrapper({ indicator: "optional" });
      const marker = indicator(wrapper);

      expect(marker.attributes("data-indicator")).toBe("optional");
      expect(marker.attributes("aria-hidden")).toBeUndefined();
      expect(marker.text()).toBe("(optional)");
    });

    it("leaves a required field unmarked in optional mode", async () => {
      const wrapper = await createWrapper({ indicator: "optional", required: true });

      expect(indicator(wrapper).exists()).toBe(false);
    });

    it("uses custom marker text", async () => {
      const required = await createWrapper({ indicator: "required", required: true, requiredText: "(required)" });
      const optional = await createWrapper({ indicator: "optional", optionalText: "(facultatif)" });

      expect(indicator(required).text()).toBe("(required)");
      expect(indicator(optional).text()).toBe("(facultatif)");
    });

    it("renders an icon instead of the required text", async () => {
      const wrapper = await createWrapper({ indicator: "required", required: true, requiredIcon: "mdi:asterisk" });
      const marker = indicator(wrapper);

      expect(marker.find(".input-label-indicator-icon").exists()).toBe(true);
      expect(marker.text()).toBe("");
    });

    it("keeps the optional text for screen readers when an icon is used", async () => {
      const wrapper = await createWrapper({ indicator: "optional", optionalIcon: "mdi:help-circle-outline" });
      const marker = indicator(wrapper);

      expect(marker.find(".input-label-indicator-icon").exists()).toBe(true);
      expect(marker.find(".sr-only").text()).toBe("(optional)");
    });

    it("updates when required changes", async () => {
      const wrapper = await createWrapper({ indicator: "required", required: false });
      await wrapper.setProps({ required: true });

      expect(indicator(wrapper).exists()).toBe(true);
    });
  });

  describe("styleClassPassthrough", () => {
    it("applies a string", async () => {
      const wrapper = await createWrapper({ styleClassPassthrough: "custom-label" });

      expect(wrapper.find("label").classes()).toEqual(["input-label", "custom-label"]);
    });

    it("applies an array", async () => {
      const wrapper = await createWrapper({ styleClassPassthrough: ["one", "two"] });

      expect(wrapper.find("label").classes()).toEqual(["input-label", "one", "two"]);
    });

    it("reacts to prop changes", async () => {
      const wrapper = await createWrapper({ styleClassPassthrough: "first" });
      await wrapper.setProps({ styleClassPassthrough: "second" });
      const classes = wrapper.find("label").classes();

      expect(classes).toContain("second");
      expect(classes).not.toContain("first");
    });
  });
});
