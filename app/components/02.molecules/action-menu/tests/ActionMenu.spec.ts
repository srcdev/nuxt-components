import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import ActionMenu from "../ActionMenu.vue";

// --- Types ---
interface ActionMenuInstance {
  menuId: string;
  anchorName: string;
  closeMenu: () => void;
  handleToggle: (event: Event) => void;
}

// --- Helpers ---
const createWrapper = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
  return mountSuspended(ActionMenu, { props, slots });
};

describe("ActionMenu", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as never);

    // Popover API is not implemented in jsdom — define stubs so we can test
    Object.defineProperty(HTMLElement.prototype, "hidePopover", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("default (no items)", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with itemCount and slot content", async () => {
      wrapper = await createWrapper(
        { itemCount: 2 },
        {
          "item-0": '<button role="menuitem">Edit</button>',
          "item-1": '<button role="menuitem">Delete</button>',
        }
      );
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with custom label", async () => {
      wrapper = await createWrapper({ label: "Record actions" });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // -------------------------
  // Trigger button
  // -------------------------
  describe("Trigger button", () => {
    it("renders a trigger button", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-trigger").exists()).toBe(true);
    });

    it("trigger button has type='button'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-trigger").attributes("type")).toBe("button");
    });

    it("trigger button has aria-haspopup='menu'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-trigger").attributes("aria-haspopup")).toBe("menu");
    });

    it("trigger button has default aria-label", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-trigger").attributes("aria-label")).toBe("Open actions menu");
    });

    it("trigger button uses custom label prop for aria-label", async () => {
      wrapper = await createWrapper({ label: "User actions" });
      expect(wrapper.find(".action-menu-trigger").attributes("aria-label")).toBe("User actions");
    });

    it("trigger button has popovertarget attribute linking to the popover", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as ActionMenuInstance;
      const triggerTarget = wrapper.find(".action-menu-trigger").attributes("popovertarget");
      expect(triggerTarget).toBe(vm.menuId);
    });

    it("trigger button has popovertargetaction='toggle'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-trigger").attributes("popovertargetaction")).toBe("toggle");
    });
  });

  // -------------------------
  // Popover
  // -------------------------
  describe("Popover element", () => {
    it("renders the popover element", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-popover").exists()).toBe(true);
    });

    it("popover id matches the trigger's popovertarget", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as ActionMenuInstance;
      expect(wrapper.find(".action-menu-popover").attributes("id")).toBe(vm.menuId);
    });

    it("popover has the popover attribute", async () => {
      wrapper = await createWrapper();
      // jsdom renders boolean attributes as empty string
      expect(wrapper.find(".action-menu-popover").attributes("popover")).toBeDefined();
    });

    it("menu list has role='menu'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".action-menu-list").attributes("role")).toBe("menu");
    });

    it("menu list aria-label matches label prop", async () => {
      wrapper = await createWrapper({ label: "Row options" });
      expect(wrapper.find(".action-menu-list").attributes("aria-label")).toBe("Row options");
    });
  });

  // -------------------------
  // Dynamic item slots
  // -------------------------
  describe("Dynamic item slots", () => {
    it("renders zero list items when itemCount is 0 (default)", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll(".action-menu-list-item")).toHaveLength(0);
    });

    it("renders correct number of list items from itemCount", async () => {
      wrapper = await createWrapper({ itemCount: 3 });
      expect(wrapper.findAll(".action-menu-list-item")).toHaveLength(3);
    });

    it("each list item has role='none'", async () => {
      wrapper = await createWrapper({ itemCount: 2 });
      const items = wrapper.findAll(".action-menu-list-item");
      items.forEach((item) => {
        expect(item.attributes("role")).toBe("none");
      });
    });

    it("renders slot content inside the correct list item", async () => {
      wrapper = await createWrapper(
        { itemCount: 2 },
        {
          "item-0": '<span data-testid="item-zero">First</span>',
          "item-1": '<span data-testid="item-one">Second</span>',
        }
      );
      const items = wrapper.findAll(".action-menu-list-item");
      expect(items[0]!.find('[data-testid="item-zero"]').exists()).toBe(true);
      expect(items[1]!.find('[data-testid="item-one"]').exists()).toBe(true);
    });
  });

  // -------------------------
  // Anchor name
  // -------------------------
  describe("Anchor name CSS variable", () => {
    it("sets a unique --_anchor-name on the root element style", async () => {
      wrapper = await createWrapper();
      const style = wrapper.attributes("style") ?? "";
      expect(style).toContain("--_anchor-name: --action-menu-anchor-");
    });

    it("anchor name starts with -- (valid dashed-ident for CSS anchor positioning)", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as ActionMenuInstance;
      expect(vm.anchorName).toMatch(/^--action-menu-anchor-/);
    });
  });

  // -------------------------
  // closeMenu
  // -------------------------
  describe("closeMenu", () => {
    it("calls hidePopover on the popover element when a list item is clicked", async () => {
      wrapper = await createWrapper(
        { itemCount: 1 },
        { "item-0": '<button role="menuitem">Action</button>' }
      );
      const listItem = wrapper.find(".action-menu-list-item");
      const popoverEl = wrapper.find(".action-menu-popover").element as HTMLElement;
      const hidePopoverSpy = vi.spyOn(popoverEl, "hidePopover");

      await listItem.trigger("click");
      expect(hidePopoverSpy).toHaveBeenCalledOnce();
    });
  });

  // -------------------------
  // handleToggle — focus management
  // -------------------------
  describe("handleToggle focus management", () => {
    it("focuses the first menuitem when the popover opens", async () => {
      wrapper = await createWrapper(
        { itemCount: 1 },
        { "item-0": '<button role="menuitem" data-testid="first-item">Action</button>' }
      );

      const firstItem = wrapper.find('[data-testid="first-item"]').element as HTMLElement;
      const focusSpy = vi.spyOn(firstItem, "focus");

      const popoverEl = wrapper.find(".action-menu-popover").element;
      popoverEl.dispatchEvent(
        new Event("toggle", { bubbles: false })
      );

      // Manually call handleToggle with newState='open'
      const vm = wrapper.vm as unknown as ActionMenuInstance;
      vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));

      await nextTick();
      expect(focusSpy).toHaveBeenCalledOnce();
    });
  });

  // -------------------------
  // styleClassPassthrough
  // -------------------------
  describe("styleClassPassthrough", () => {
    it("applies a string class to the root element", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "custom-menu" });
      expect(wrapper.classes()).toContain("custom-menu");
    });

    it("applies an array of classes to the root element", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["menu-a", "menu-b"] });
      expect(wrapper.classes()).toContain("menu-a");
      expect(wrapper.classes()).toContain("menu-b");
    });

    it("root element always has the 'action-menu' class", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "extra-class" });
      expect(wrapper.classes()).toContain("action-menu");
    });
  });
});
