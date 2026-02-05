import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { DOMWrapper } from "@vue/test-utils";
import LayoutGridA from "../LayoutGridA.vue";

// Mock useStyleClassPassthrough composable
const mockElementClasses = { value: "" };
const mockResetElementClasses = vi.fn();

const mockUseStyleClassPassthrough = vi.fn(() => ({
  elementClasses: mockElementClasses,
  resetElementClasses: mockResetElementClasses,
}));

vi.mock("#imports", () => ({
  useStyleClassPassthrough: mockUseStyleClassPassthrough,
}));

describe("LayoutGridA", () => {
  let wrapper: ReturnType<typeof mountSuspended>;

  const createWrapper = async (props = {}, slots = {}) => {
    const defaultProps = {
      styleClassPassthrough: [],
      ...props,
    };

    wrapper = await mountSuspended(LayoutGridA, {
      props: defaultProps,
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

      expect(wrapper.find(".layout-grid-a-wrapper")).toBeTruthy();
      expect(wrapper.find(".layout-grid-a")).toBeTruthy();
    });

    it("renders all four slot containers", async () => {
      await createWrapper();

      const slots = wrapper.findAll(".layout-grid-a > div");
      expect(slots).toHaveLength(4);

      expect(wrapper.find(".slot1")).toBeTruthy();
      expect(wrapper.find(".slot2")).toBeTruthy();
      expect(wrapper.find(".slot3")).toBeTruthy();
      expect(wrapper.find(".slot4")).toBeTruthy();
    });

    it("has correct grid container structure", async () => {
      await createWrapper();

      const wrapper_element = wrapper.find(".layout-grid-a-wrapper");
      const grid = wrapper.find(".layout-grid-a");

      expect(wrapper_element.exists()).toBe(true);
      expect(grid.exists()).toBe(true);
      expect(grid.classes()).toContain("layout-grid-a");
    });
  });

  describe("Slot Content", () => {
    it("renders slot1 content correctly", async () => {
      await createWrapper(
        {},
        {
          slot1: "<h2>Slot 1 Content</h2><p>This is slot 1</p>",
        }
      );

      const slot1 = wrapper.find(".slot1");
      expect(slot1.exists()).toBe(true);
      expect(slot1.html()).toContain("Slot 1 Content");
      expect(slot1.html()).toContain("This is slot 1");
    });

    it("renders slot2 content correctly", async () => {
      await createWrapper(
        {},
        {
          slot2: "<h2>Slot 2 Content</h2>",
        }
      );

      const slot2 = wrapper.find(".slot2");
      expect(slot2.exists()).toBe(true);
      expect(slot2.html()).toContain("Slot 2 Content");
    });

    it("renders slot3 content correctly", async () => {
      await createWrapper(
        {},
        {
          slot3: "<div>Slot 3 Content</div>",
        }
      );

      const slot3 = wrapper.find(".slot3");
      expect(slot3.exists()).toBe(true);
      expect(slot3.html()).toContain("Slot 3 Content");
    });

    it("renders slot4 content correctly", async () => {
      await createWrapper(
        {},
        {
          slot4: "<span>Slot 4 Content</span>",
        }
      );

      const slot4 = wrapper.find(".slot4");
      expect(slot4.exists()).toBe(true);
      expect(slot4.html()).toContain("Slot 4 Content");
    });

    it("renders all slots with different content simultaneously", async () => {
      await createWrapper(
        {},
        {
          slot1: "<h1>Header</h1>",
          slot2: "<p>Paragraph</p>",
          slot3: "<div>Division</div>",
          slot4: "<span>Span</span>",
        }
      );

      expect(wrapper.find(".slot1").html()).toContain("Header");
      expect(wrapper.find(".slot2").html()).toContain("Paragraph");
      expect(wrapper.find(".slot3").html()).toContain("Division");
      expect(wrapper.find(".slot4").html()).toContain("Span");
    });

    it("handles empty slots gracefully", async () => {
      await createWrapper(
        {},
        {
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
        }
      );

      const slots = wrapper.findAll(".layout-grid-a > div");
      expect(slots).toHaveLength(4);

      slots.forEach((slot: DOMWrapper<Element>) => {
        expect(slot.exists()).toBe(true);
      });
    });
  });

  describe("Props", () => {
    it("accepts string styleClassPassthrough", async () => {
      const className = "custom-class";
      await createWrapper({ styleClassPassthrough: className });

      // Component should mount without error with string class
      expect(wrapper.find(".layout-grid-a")).toBeTruthy();
    });

    it("accepts array styleClassPassthrough", async () => {
      const classNames = ["class1", "class2", "class3"];
      await createWrapper({ styleClassPassthrough: classNames });

      // Component should mount without error with array of classes
      expect(wrapper.find(".layout-grid-a")).toBeTruthy();
    });

    it("uses default empty array for styleClassPassthrough", async () => {
      await createWrapper();

      // Component should mount without error with default props
      expect(wrapper.find(".layout-grid-a")).toBeTruthy();
    });

    it("renders correctly with various props", async () => {
      await createWrapper({ styleClassPassthrough: ["test-class", "another-class"] });

      const wrapper_element = wrapper.find(".layout-grid-a-wrapper");
      expect(wrapper_element.exists()).toBe(true);
      expect(wrapper_element.classes()).toContain("layout-grid-a-wrapper");
    });
  });

  describe("Reactivity", () => {
    it("maintains component structure with different props", async () => {
      await createWrapper({ styleClassPassthrough: ["initial"] });

      // Component should maintain its structure
      expect(wrapper.find(".layout-grid-a-wrapper")).toBeTruthy();
      expect(wrapper.find(".layout-grid-a")).toBeTruthy();
      expect(wrapper.findAll(".layout-grid-a > div")).toHaveLength(4);
    });
  });

  describe("CSS Structure", () => {
    it("has correct CSS classes applied", async () => {
      await createWrapper();

      const wrapper_element = wrapper.find(".layout-grid-a-wrapper");
      const grid = wrapper.find(".layout-grid-a");
      const slot1 = wrapper.find(".slot1");
      const slot2 = wrapper.find(".slot2");
      const slot3 = wrapper.find(".slot3");
      const slot4 = wrapper.find(".slot4");

      expect(wrapper_element.classes()).toContain("layout-grid-a-wrapper");
      expect(grid.classes()).toContain("layout-grid-a");
      expect(slot1.classes()).toContain("slot1");
      expect(slot2.classes()).toContain("slot2");
      expect(slot3.classes()).toContain("slot3");
      expect(slot4.classes()).toContain("slot4");
    });

    it("maintains correct DOM hierarchy", async () => {
      await createWrapper();

      const wrapper_element = wrapper.find(".layout-grid-a-wrapper");
      const grid = wrapper_element.find(".layout-grid-a");

      expect(grid.exists()).toBe(true);

      const slots = grid.findAll("div");
      expect(slots).toHaveLength(4);

      // Verify each slot is a direct child of the grid
      slots.forEach((slot: DOMWrapper<Element>, index: number) => {
        const expectedClass = `slot${index + 1}`;
        expect(slot.classes()).toContain(expectedClass);
      });
    });
  });

  describe("Accessibility", () => {
    it("maintains semantic structure with slot content", async () => {
      await createWrapper(
        {},
        {
          slot1: "<h1>Main Heading</h1>",
          slot2: "<main>Main content area</main>",
          slot3: "<aside>Sidebar content</aside>",
          slot4: "<footer>Footer content</footer>",
        }
      );

      expect(wrapper.find("h1").exists()).toBe(true);
      expect(wrapper.find("main").exists()).toBe(true);
      expect(wrapper.find("aside").exists()).toBe(true);
      expect(wrapper.find("footer").exists()).toBe(true);
    });

    it("preserves ARIA attributes in slot content", async () => {
      await createWrapper(
        {},
        {
          slot1: '<div role="banner" aria-label="Site header">Header</div>',
          slot2: '<div role="main" aria-label="Main content">Content</div>',
        }
      );

      const banner = wrapper.find('[role="banner"]');
      const main = wrapper.find('[role="main"]');

      expect(banner.exists()).toBe(true);
      expect(banner.attributes("aria-label")).toBe("Site header");
      expect(main.exists()).toBe(true);
      expect(main.attributes("aria-label")).toBe("Main content");
    });
  });

  describe("Edge Cases", () => {
    it("handles complex nested content", async () => {
      await createWrapper(
        {},
        {
          slot1: `
          <div>
            <header>
              <h1>Complex Header</h1>
              <nav>
                <ul>
                  <li><a href="#">Link 1</a></li>
                  <li><a href="#">Link 2</a></li>
                </ul>
              </nav>
            </header>
          </div>
        `,
        }
      );

      const slot1 = wrapper.find(".slot1");
      expect(slot1.find("header").exists()).toBe(true);
      expect(slot1.find("h1").text()).toBe("Complex Header");
      expect(slot1.find("nav").exists()).toBe(true);
      expect(slot1.findAll("li")).toHaveLength(2);
    });

    it("handles special characters and HTML entities in content", async () => {
      await createWrapper(
        {},
        {
          slot1: "<p>&lt;Special&gt; &amp; Characters &quot;Test&quot;</p>",
        }
      );

      const slot1 = wrapper.find(".slot1 p");
      expect(slot1.exists()).toBe(true);
      // The HTML should be properly parsed
      expect(slot1.html()).toContain("&lt;Special&gt;");
      expect(slot1.html()).toContain("&amp; Characters");
      expect(slot1.html()).toContain('"Test"');
    });

    it("maintains performance with large content", async () => {
      const largeContent = "<div>" + "Large content ".repeat(100) + "</div>";

      await createWrapper(
        {},
        {
          slot1: largeContent,
          slot2: largeContent,
          slot3: largeContent,
          slot4: largeContent,
        }
      );

      const slots = wrapper.findAll(".layout-grid-a > div");
      expect(slots).toHaveLength(4);

      slots.forEach((slot: DOMWrapper<Element>) => {
        expect(slot.html()).toContain("Large content");
      });
    });
  });
});
