import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PageRow from "../PageRow.vue";

const mockElementClasses = { value: "" };
const mockUseStyleClassPassthrough = vi.fn(() => ({
  elementClasses: mockElementClasses,
}));

vi.mock("#imports", () => ({
  useStyleClassPassthrough: mockUseStyleClassPassthrough,
}));

describe("PageRow", () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>;

  const createWrapper = async (props = {}, slots = {}) => {
    wrapper = await mountSuspended(PageRow, {
      props: { ...props },
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

  describe("Rendering", () => {
    it("mounts without error", async () => {
      await createWrapper();
      expect(wrapper.find(".page-row").exists()).toBe(true);
    });

    it("renders as a div by default", async () => {
      await createWrapper();
      expect(wrapper.element.tagName.toLowerCase()).toBe("div");
    });

    it("renders slot content directly inside the root element", async () => {
      await createWrapper({}, { default: "<p>Hello</p>" });
      expect(wrapper.find(".page-row p").exists()).toBe(true);
      expect(wrapper.find(".page-row p").text()).toBe("Hello");
    });

    it("has no intermediate wrapper elements", async () => {
      await createWrapper({}, { default: "<span>Content</span>" });
      const inner = wrapper.find(".page-row span");
      expect(inner.element.parentElement?.classList.contains("page-row")).toBe(true);
    });
  });

  describe("Props — tag", () => {
    it.each([["section"], ["article"], ["header"], ["footer"], ["main"], ["nav"]] as const)(
      "renders as <%s>",
      async (tag) => {
        await createWrapper({ tag });
        expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
      }
    );
  });

  describe("Props — variant", () => {
    it("applies content class by default", async () => {
      await createWrapper();
      expect(wrapper.classes()).toContain("content");
    });

    it.each(["full", "popout", "content", "inset-content"])("applies variant class %s", async (variant) => {
      await createWrapper({ variant });
      expect(wrapper.classes()).toContain(variant);
    });
  });

  describe("Props — id", () => {
    it("does not render id attribute by default", async () => {
      await createWrapper();
      expect(wrapper.attributes("id")).toBeUndefined();
    });

    it("renders the id attribute when provided", async () => {
      await createWrapper({ id: "hero-section" });
      expect(wrapper.attributes("id")).toBe("hero-section");
    });
  });

  describe("Props — styleClassPassthrough", () => {
    it("forwards string class via elementClasses", async () => {
      mockElementClasses.value = "custom-class";
      await createWrapper({ styleClassPassthrough: "custom-class" });
      expect(wrapper.classes()).toContain("custom-class");
    });

    it("forwards array classes via elementClasses", async () => {
      await createWrapper({ styleClassPassthrough: ["class-a", "class-b"] });
      expect(wrapper.classes()).toContain("class-a");
      expect(wrapper.classes()).toContain("class-b");
    });
  });

  describe("Props — align", () => {
    it("does not set data-align attribute by default", async () => {
      await createWrapper();
      expect(wrapper.attributes("data-align")).toBeUndefined();
    });

    it("sets data-align=start when align is start", async () => {
      await createWrapper({ align: "start" });
      expect(wrapper.attributes("data-align")).toBe("start");
    });

    it("sets data-align=end when align is end", async () => {
      await createWrapper({ align: "end" });
      expect(wrapper.attributes("data-align")).toBe("end");
    });

    it("combines variant and align on the same element", async () => {
      await createWrapper({ variant: "content", align: "start" });
      expect(wrapper.classes()).toContain("content");
      expect(wrapper.attributes("data-align")).toBe("start");
    });
  });

  describe("Accessibility — aria-labelledby", () => {
    it("does not set aria-labelledby on non-landmark tags", async () => {
      await createWrapper({ tag: "div" });
      expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
    });

    it.each(["section", "main", "article", "aside"] as const)(
      "sets aria-labelledby on <%s>",
      async (tag) => {
        await createWrapper({ tag });
        expect(wrapper.attributes("aria-labelledby")).toBeTruthy();
      }
    );

    it("does not set aria-labelledby on header, footer, nav", async () => {
      for (const tag of ["header", "footer", "nav"] as const) {
        await createWrapper({ tag });
        expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
        wrapper.unmount();
      }
    });

    it("exposes headingId as a slot prop", async () => {
      let slotHeadingId: string | undefined;
      await createWrapper(
        { tag: "section" },
        {
          default: (slotProps: { headingId: string }) => {
            slotHeadingId = slotProps.headingId;
            return "<h2>Title</h2>";
          },
        }
      );
      expect(slotHeadingId).toBeTruthy();
      expect(wrapper.attributes("aria-labelledby")).toBe(slotHeadingId);
    });

    it("preserves ARIA attributes on slot content", async () => {
      await createWrapper({}, { default: '<nav aria-label="Main navigation">Nav</nav>' });
      expect(wrapper.find("nav").attributes("aria-label")).toBe("Main navigation");
    });
  });

  describe("CSS classes", () => {
    it("always includes the page-row base class", async () => {
      await createWrapper();
      expect(wrapper.classes()).toContain("page-row");
    });

    it("includes both base class and variant class", async () => {
      await createWrapper({ variant: "full" });
      expect(wrapper.classes()).toContain("page-row");
      expect(wrapper.classes()).toContain("full");
    });

    it("includes elementClasses from styleClassPassthrough alongside other classes", async () => {
      await createWrapper({ variant: "popout", styleClassPassthrough: ["extra-class"] });
      expect(wrapper.classes()).toContain("page-row");
      expect(wrapper.classes()).toContain("popout");
      expect(wrapper.classes()).toContain("extra-class");
    });
  });
});
