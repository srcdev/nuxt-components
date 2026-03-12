import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ContentWidth from "../ContentWidth.vue";

const mockElementClasses = { value: "" };

const mockUseStyleClassPassthrough = vi.fn(() => ({
  elementClasses: mockElementClasses,
}));

vi.mock("#imports", () => ({
  useStyleClassPassthrough: mockUseStyleClassPassthrough,
  useId: () => "test-id",
}));

describe("ContentWidth", () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>;

  const createWrapper = async (props = {}, slots = {}) => {
    wrapper = await mountSuspended(ContentWidth, {
      props: { styleClassPassthrough: [], ...props },
      slots,
    });
    return wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockElementClasses.value = "";
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe("Component Rendering", () => {
    it("mounts without error", async () => {
      await createWrapper();
      expect(wrapper.find(".content-width-wrapper").exists()).toBe(true);
    });

    it("renders the correct inner structure", async () => {
      await createWrapper();
      expect(wrapper.find(".content-width").exists()).toBe(true);
      expect(wrapper.find(".content-width-inner").exists()).toBe(true);
    });

    it("renders as a div by default", async () => {
      await createWrapper();
      expect(wrapper.find(".content-width-wrapper").element.tagName).toBe("DIV");
    });
  });

  describe("Tag Prop", () => {
    const tags = ["section", "article", "aside", "header", "footer", "main", "nav"] as const;

    tags.forEach((tag) => {
      it(`renders as <${tag}> when tag="${tag}"`, async () => {
        await createWrapper({ tag });
        expect(wrapper.find(".content-width-wrapper").element.tagName).toBe(tag.toUpperCase());
      });
    });
  });

  describe("isLandmark Prop", () => {
    it("does not set tabindex or aria-label by default", async () => {
      await createWrapper();
      const el = wrapper.find(".content-width-wrapper");
      expect(el.attributes("tabindex")).toBeUndefined();
      expect(el.attributes("aria-label")).toBeUndefined();
    });

    it("sets tab-index=0 when isLandmark is true", async () => {
      await createWrapper({ isLandmark: true });
      expect(wrapper.find(".content-width-wrapper").attributes("tab-index")).toBe("0");
    });

    it("sets aria-label when isLandmark is true", async () => {
      await createWrapper({ isLandmark: true });
      expect(wrapper.find(".content-width-wrapper").attributes("aria-label")).toBe(
        "Content Width Landmark"
      );
    });
  });

  describe("Slot", () => {
    it("renders default slot content", async () => {
      await createWrapper({}, { default: "<p>Slot content</p>" });
      expect(wrapper.find(".content-width-inner").html()).toContain("Slot content");
    });

    it("renders nested slot content", async () => {
      await createWrapper(
        {},
        { default: "<section><h2>Title</h2><p>Body</p></section>" }
      );
      expect(wrapper.find(".content-width-inner h2").text()).toBe("Title");
    });

    it("renders without slot content gracefully", async () => {
      await createWrapper();
      expect(wrapper.find(".content-width-inner").exists()).toBe(true);
    });
  });

  describe("styleClassPassthrough Prop", () => {
    it("accepts a string value", async () => {
      await createWrapper({ styleClassPassthrough: "custom-class" });
      expect(wrapper.find(".content-width-wrapper").exists()).toBe(true);
    });

    it("accepts an array of strings", async () => {
      await createWrapper({ styleClassPassthrough: ["class-a", "class-b"] });
      expect(wrapper.find(".content-width-wrapper").exists()).toBe(true);
    });

    it("applies elementClasses from useStyleClassPassthrough to wrapper", async () => {
      mockElementClasses.value = "injected-class";
      await createWrapper({ styleClassPassthrough: "injected-class" });
      expect(wrapper.find(".content-width-wrapper").classes()).toContain("injected-class");
    });
  });

  describe("DOM Structure", () => {
    it("maintains correct nesting: wrapper > content-width > inner > slot", async () => {
      await createWrapper({}, { default: "<span>nested</span>" });
      const inner = wrapper.find(".content-width-wrapper .content-width .content-width-inner");
      expect(inner.exists()).toBe(true);
      expect(inner.find("span").text()).toBe("nested");
    });
  });
});
