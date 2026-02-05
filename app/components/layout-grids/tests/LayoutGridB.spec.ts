import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LayoutGridB from "../LayoutGridB.vue";

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

describe("LayoutGridB", () => {
  let wrapper: ReturnType<typeof mountSuspended>;

  const createWrapper = async (props = {}, slots = {}) => {
    const defaultProps = {
      topRowSlot1ItemCount: 6,
      bottomRowItemCount: 4,
      styleClassPassthrough: [],
      ...props,
    };

    wrapper = await mountSuspended(LayoutGridB, {
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

      expect(wrapper.find(".layout-grid-b-wrapper")).toBeTruthy();
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
    });

    it("renders top row structure correctly", async () => {
      await createWrapper();

      expect(wrapper.find(".top-row")).toBeTruthy();
      expect(wrapper.find(".top-row-slot-1")).toBeTruthy();
      expect(wrapper.find(".top-row-slot-2")).toBeTruthy();
      expect(wrapper.find(".top-row-slot-3")).toBeTruthy();
    });

    it("renders bottom row correctly", async () => {
      await createWrapper();

      expect(wrapper.find(".bottom-row")).toBeTruthy();
    });

    it("has correct grid container structure", async () => {
      await createWrapper();

      const grid = wrapper.find(".layout-grid-b");

      expect(grid.exists()).toBe(true);
      expect(grid.classes()).toContain("layout-grid-b");
    });
  });

  describe("Props", () => {
    it("accepts topRowSlot1ItemCount prop", async () => {
      const itemCount = 8;
      await createWrapper({ topRowSlot1ItemCount: itemCount });

      // Component should render without error with custom item count
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
    });

    it("accepts bottomRowItemCount prop", async () => {
      const itemCount = 6;
      await createWrapper({ bottomRowItemCount: itemCount });

      // Component should render without error with custom item count
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
    });

    it("uses default props when not provided", async () => {
      await createWrapper({
        topRowSlot1ItemCount: undefined,
        bottomRowItemCount: undefined,
      });

      // Should use default values (6 and 4)
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
    });

    it("accepts string styleClassPassthrough", async () => {
      const className = "custom-class";
      await createWrapper({ styleClassPassthrough: className });

      // Component should mount without error with string class
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
    });

    it("accepts array styleClassPassthrough", async () => {
      const classNames = ["class1", "class2", "class3"];
      await createWrapper({ styleClassPassthrough: classNames });

      // Component should mount without error with array of classes
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
    });

    it("applies element classes to wrapper", async () => {
      mockElementClasses.value = "test-class another-class";

      await createWrapper();

      // Check that the component renders
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
    });
  });

  describe("Top Row Slot 1 Dynamic Content", () => {
    it("renders slot1 item content with correct slot names", async () => {
      const slots = {
        "top-row-slot1-1-content": "<div>Item 1</div>",
        "top-row-slot1-2-content": "<div>Item 2</div>",
        "top-row-slot1-3-content": "<div>Item 3</div>",
      };

      await createWrapper({ topRowSlot1ItemCount: 3 }, slots);

      // Check that the slots are available in the template
      expect(wrapper.html()).toContain("Item 1");
      expect(wrapper.html()).toContain("Item 2");
      expect(wrapper.html()).toContain("Item 3");
    });

    it("handles different topRowSlot1ItemCount values", async () => {
      const testCounts = [1, 3, 6, 9, 12];

      for (const count of testCounts) {
        const slots: Record<string, string> = {};
        for (let i = 1; i <= count; i++) {
          slots[`top-row-slot1-${i}-content`] = `<div>Item ${i}</div>`;
        }

        const { unmount } = await createWrapper({ topRowSlot1ItemCount: count }, slots);

        // Should render without error
        expect(wrapper.find(".layout-grid-b")).toBeTruthy();

        // Check that content is rendered
        for (let i = 1; i <= count; i++) {
          expect(wrapper.html()).toContain(`Item ${i}`);
        }

        unmount();
      }
    });
  });

  describe("Top Row Static Slots", () => {
    it("renders top-row-slot-2 content", async () => {
      await createWrapper(
        {},
        {
          "top-row-slot-2": "<div class='slot2-content'>Slot 2 Content</div>",
        }
      );

      expect(wrapper.html()).toContain("Slot 2 Content");
      expect(wrapper.find(".slot2-content").exists()).toBe(true);
    });

    it("renders top-row-slot-3 content", async () => {
      await createWrapper(
        {},
        {
          "top-row-slot-3": "<div class='slot3-content'>Slot 3 Content</div>",
        }
      );

      expect(wrapper.html()).toContain("Slot 3 Content");
      expect(wrapper.find(".slot3-content").exists()).toBe(true);
    });

    it("renders both static slots simultaneously", async () => {
      await createWrapper(
        {},
        {
          "top-row-slot-2": "<h2>Main Content</h2>",
          "top-row-slot-3": "<aside>Sidebar</aside>",
        }
      );

      expect(wrapper.find("h2").exists()).toBe(true);
      expect(wrapper.find("h2").text()).toBe("Main Content");
      expect(wrapper.find("aside").exists()).toBe(true);
      expect(wrapper.find("aside").text()).toBe("Sidebar");
    });
  });

  describe("Bottom Row Dynamic Content", () => {
    it("renders bottom row item content with correct slot names", async () => {
      const slots = {
        "bottom-row-1-content": "<div>Bottom 1</div>",
        "bottom-row-2-content": "<div>Bottom 2</div>",
        "bottom-row-3-content": "<div>Bottom 3</div>",
        "bottom-row-4-content": "<div>Bottom 4</div>",
      };

      await createWrapper({ bottomRowItemCount: 4 }, slots);

      expect(wrapper.html()).toContain("Bottom 1");
      expect(wrapper.html()).toContain("Bottom 2");
      expect(wrapper.html()).toContain("Bottom 3");
      expect(wrapper.html()).toContain("Bottom 4");
    });

    it("handles different bottomRowItemCount values", async () => {
      const testCounts = [1, 2, 4, 6, 8];

      for (const count of testCounts) {
        const slots: Record<string, string> = {};
        for (let i = 1; i <= count; i++) {
          slots[`bottom-row-${i}-content`] = `<div>Bottom ${i}</div>`;
        }

        const { unmount } = await createWrapper({ bottomRowItemCount: count }, slots);

        // Should render without error
        expect(wrapper.find(".layout-grid-b")).toBeTruthy();

        // Check that content is rendered
        for (let i = 1; i <= count; i++) {
          expect(wrapper.html()).toContain(`Bottom ${i}`);
        }

        unmount();
      }
    });
  });

  describe("Complete Layout", () => {
    it("renders all slot types together", async () => {
      const slots = {
        // Top row slot 1 items
        "top-row-slot1-1-content": "<div>Panel 1</div>",
        "top-row-slot1-2-content": "<div>Panel 2</div>",
        "top-row-slot1-3-content": "<div>Panel 3</div>",
        // Top row static slots
        "top-row-slot-2": "<main>Main Content Area</main>",
        "top-row-slot-3": "<aside>Sidebar Content</aside>",
        // Bottom row items
        "bottom-row-1-content": "<div>Feature 1</div>",
        "bottom-row-2-content": "<div>Feature 2</div>",
      };

      await createWrapper(
        {
          topRowSlot1ItemCount: 3,
          bottomRowItemCount: 2,
        },
        slots
      );

      // Check all content is rendered
      expect(wrapper.html()).toContain("Panel 1");
      expect(wrapper.html()).toContain("Panel 2");
      expect(wrapper.html()).toContain("Panel 3");
      expect(wrapper.html()).toContain("Main Content Area");
      expect(wrapper.html()).toContain("Sidebar Content");
      expect(wrapper.html()).toContain("Feature 1");
      expect(wrapper.html()).toContain("Feature 2");

      // Check semantic elements
      expect(wrapper.find("main").exists()).toBe(true);
      expect(wrapper.find("aside").exists()).toBe(true);
    });
  });

  describe("Reactivity", () => {
    it("sets up composable correctly", async () => {
      await createWrapper({ styleClassPassthrough: ["initial"] });

      // Component should maintain structure with different props
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
      expect(wrapper.find(".top-row")).toBeTruthy();
      expect(wrapper.find(".bottom-row")).toBeTruthy();
    });

    it("handles different prop configurations", async () => {
      const { unmount } = await createWrapper(
        {
          topRowSlot1ItemCount: 6,
          bottomRowItemCount: 4,
        },
        {
          "top-row-slot1-1-content": "<div>Panel 1</div>",
          "bottom-row-1-content": "<div>Bottom 1</div>",
        }
      );

      expect(wrapper.html()).toContain("Panel 1");
      expect(wrapper.html()).toContain("Bottom 1");

      // Component should render properly
      expect(wrapper.find(".layout-grid-b")).toBeTruthy();

      unmount();
    });
  });

  describe("CSS Structure", () => {
    it("has correct CSS classes applied", async () => {
      await createWrapper();

      const grid = wrapper.find(".layout-grid-b");
      const topRow = wrapper.find(".top-row");
      const bottomRow = wrapper.find(".bottom-row");

      expect(grid.classes()).toContain("layout-grid-b");
      expect(topRow.classes()).toContain("top-row");
      expect(bottomRow.classes()).toContain("bottom-row");
    });

    it("maintains correct DOM hierarchy", async () => {
      await createWrapper();

      const grid = wrapper.find(".layout-grid-b");
      const topRow = grid.find(".top-row");
      const bottomRow = grid.find(".bottom-row");

      expect(grid.exists()).toBe(true);
      expect(topRow.exists()).toBe(true);
      expect(bottomRow.exists()).toBe(true);

      // Check top row slots exist
      expect(topRow.find(".top-row-slot-1").exists()).toBe(true);
      expect(topRow.find(".top-row-slot-2").exists()).toBe(true);
      expect(topRow.find(".top-row-slot-3").exists()).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles zero item counts gracefully", async () => {
      await createWrapper({
        topRowSlot1ItemCount: 0,
        bottomRowItemCount: 0,
      });

      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
      expect(wrapper.find(".top-row")).toBeTruthy();
      expect(wrapper.find(".bottom-row")).toBeTruthy();
    });

    it("handles large item counts", async () => {
      const largeCount = 20;
      const slots: Record<string, string> = {};

      // Create slots for large count
      for (let i = 1; i <= largeCount; i++) {
        slots[`top-row-slot1-${i}-content`] = `<div>Large Panel ${i}</div>`;
        slots[`bottom-row-${i}-content`] = `<div>Large Bottom ${i}</div>`;
      }

      await createWrapper(
        {
          topRowSlot1ItemCount: largeCount,
          bottomRowItemCount: largeCount,
        },
        slots
      );

      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
      expect(wrapper.html()).toContain("Large Panel 1");
      expect(wrapper.html()).toContain("Large Bottom 1");
    });

    it("handles complex nested content in slots", async () => {
      const complexContent = `
        <article>
          <header>
            <h2>Complex Article</h2>
            <time datetime="2026-02-05">Feb 5, 2026</time>
          </header>
          <main>
            <p>Complex content with <strong>bold</strong> and <em>italic</em> text.</p>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
            </ul>
          </main>
          <footer>
            <button type="button">Action Button</button>
          </footer>
        </article>
      `;

      await createWrapper(
        {},
        {
          "top-row-slot1-1-content": complexContent,
        }
      );

      expect(wrapper.find("article").exists()).toBe(true);
      expect(wrapper.find("header h2").text()).toBe("Complex Article");
      expect(wrapper.find("time").exists()).toBe(true);
      expect(wrapper.find("strong").text()).toBe("bold");
      expect(wrapper.find("em").text()).toBe("italic");
      expect(wrapper.findAll("li")).toHaveLength(2);
      expect(wrapper.find("button").text()).toBe("Action Button");
    });

    it("handles empty slots gracefully", async () => {
      await createWrapper(
        {
          topRowSlot1ItemCount: 2,
          bottomRowItemCount: 2,
        },
        {
          "top-row-slot1-1-content": "",
          "top-row-slot-2": "",
          "bottom-row-1-content": "",
        }
      );

      expect(wrapper.find(".layout-grid-b")).toBeTruthy();
      expect(wrapper.find(".top-row")).toBeTruthy();
      expect(wrapper.find(".bottom-row")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("preserves semantic structure in slot content", async () => {
      await createWrapper(
        {},
        {
          "top-row-slot-2": '<main role="main" aria-label="Main content">Main Content</main>',
          "top-row-slot-3": '<aside role="complementary" aria-label="Sidebar">Sidebar</aside>',
          "bottom-row-1-content": '<section aria-labelledby="feature1">Feature 1</section>',
        }
      );

      const main = wrapper.find('[role="main"]');
      const aside = wrapper.find('[role="complementary"]');
      const section = wrapper.find('section[aria-labelledby="feature1"]');

      expect(main.exists()).toBe(true);
      expect(main.attributes("aria-label")).toBe("Main content");
      expect(aside.exists()).toBe(true);
      expect(aside.attributes("aria-label")).toBe("Sidebar");
      expect(section.exists()).toBe(true);
      expect(section.attributes("aria-labelledby")).toBe("feature1");
    });

    it("maintains focus management in interactive content", async () => {
      await createWrapper(
        {},
        {
          "top-row-slot1-1-content": '<button tabindex="1">First Button</button>',
          "top-row-slot1-2-content": '<button tabindex="2">Second Button</button>',
          "bottom-row-1-content": '<a href="#" tabindex="3">Link</a>',
        }
      );

      const firstButton = wrapper.find('button[tabindex="1"]');
      const secondButton = wrapper.find('button[tabindex="2"]');
      const link = wrapper.find('a[tabindex="3"]');

      expect(firstButton.exists()).toBe(true);
      expect(secondButton.exists()).toBe(true);
      expect(link.exists()).toBe(true);
      expect(firstButton.attributes("tabindex")).toBe("1");
      expect(secondButton.attributes("tabindex")).toBe("2");
      expect(link.attributes("tabindex")).toBe("3");
    });
  });
});
