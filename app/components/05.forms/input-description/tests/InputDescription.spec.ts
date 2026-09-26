import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import InputDescription from "../InputDescription.vue";

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>;

describe("InputDescription", () => {
  let wrapper: Wrapper | undefined;

  const createWrapper = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
    wrapper = await mountSuspended(InputDescription, {
      props: { descriptionId: "email-description", ...props },
      slots,
    });
    return wrapper;
  };

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  describe("rendering", () => {
    it("renders nothing when neither slot is provided", async () => {
      const w = await createWrapper();
      expect(w.find(".input-description").exists()).toBe(false);
    });

    it("renders descriptionText inside a paragraph", async () => {
      const w = await createWrapper({}, { descriptionText: "We never share your email" });
      const text = w.find(".input-description-text");
      expect(text.exists()).toBe(true);
      expect(text.element.tagName).toBe("P");
      expect(text.text()).toBe("We never share your email");
      expect(w.find(".input-description-html").exists()).toBe(false);
    });

    it("renders descriptionHtml inside a div, preserving markup", async () => {
      const w = await createWrapper({}, { descriptionHtml: "<ul><li>At least 8 characters</li></ul>" });
      const html = w.find(".input-description-html");
      expect(html.exists()).toBe(true);
      expect(html.element.tagName).toBe("DIV");
      expect(html.find("li").text()).toBe("At least 8 characters");
      expect(w.find(".input-description-text").exists()).toBe(false);
    });

    it("renders the HTML slot before the text slot when both are provided", async () => {
      const w = await createWrapper({}, { descriptionText: "Text", descriptionHtml: "<span>Html</span>" });
      const children = w.find(".input-description").element.children;
      expect(children).toHaveLength(2);
      expect(children[0]!.classList.contains("input-description-html")).toBe(true);
      expect(children[1]!.classList.contains("input-description-text")).toBe(true);
    });
  });

  describe("aria-describedby target", () => {
    it("puts descriptionId on the root", async () => {
      const w = await createWrapper({ descriptionId: "field-1-description" }, { descriptionText: "Help" });
      expect(w.find(".input-description").attributes("id")).toBe("field-1-description");
    });

    it("omits the id attribute when descriptionId is empty", async () => {
      const w = await createWrapper({ descriptionId: "" }, { descriptionText: "Help" });
      expect(w.find(".input-description").attributes("id")).toBeUndefined();
    });
  });

  describe("state hooks", () => {
    it("reflects inputVariant as data-input-variant, defaulting to normal", async () => {
      const w = await createWrapper({}, { descriptionText: "Help" });
      expect(w.find(".input-description").attributes("data-input-variant")).toBe("normal");

      await w.setProps({ inputVariant: "outlined" });
      expect(w.find(".input-description").attributes("data-input-variant")).toBe("outlined");
    });

    it("sets data-invalid only while fieldHasError is true", async () => {
      const w = await createWrapper({}, { descriptionText: "Help" });
      expect(w.find(".input-description").attributes("data-invalid")).toBeUndefined();

      await w.setProps({ fieldHasError: true });
      expect(w.find(".input-description").attributes("data-invalid")).toBe("");
    });
  });

  describe("styleClassPassthrough", () => {
    it("has only the base class by default", async () => {
      const w = await createWrapper({}, { descriptionText: "Help" });
      expect(w.find(".input-description").classes()).toEqual(["input-description"]);
    });

    it("accepts a string or an array", async () => {
      const w = await createWrapper({ styleClassPassthrough: "one" }, { descriptionText: "Help" });
      expect(w.find(".input-description").classes()).toContain("one");

      await w.setProps({ styleClassPassthrough: ["two", "three"] });
      await nextTick();
      const classes = w.find(".input-description").classes();
      expect(classes).toContain("two");
      expect(classes).toContain("three");
      expect(classes).not.toContain("one");
    });
  });
});
