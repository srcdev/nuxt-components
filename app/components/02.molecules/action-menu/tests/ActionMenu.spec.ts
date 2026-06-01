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
  handleKeydown: (event: KeyboardEvent) => void;
  getMenuItems: () => HTMLElement[];
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
    vi.restoreAllMocks();
    // Object.defineProperty stubs are not touched by vi.restoreAllMocks() — remove explicitly
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["hidePopover"];
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("default (no items)", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with slot content", async () => {
      wrapper = await createWrapper(
        {},
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
    it("renders zero list items when no slots are provided", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll(".action-menu-list-item")).toHaveLength(0);
    });

    it("renders the correct number of list items from provided slots", async () => {
      wrapper = await createWrapper(
        {},
        {
          "item-0": '<button role="menuitem">A</button>',
          "item-1": '<button role="menuitem">B</button>',
          "item-2": '<button role="menuitem">C</button>',
        }
      );
      expect(wrapper.findAll(".action-menu-list-item")).toHaveLength(3);
    });

    it("each list item has role='none'", async () => {
      wrapper = await createWrapper(
        {},
        {
          "item-0": '<button role="menuitem">A</button>',
          "item-1": '<button role="menuitem">B</button>',
        }
      );
      const items = wrapper.findAll(".action-menu-list-item");
      items.forEach((item) => {
        expect(item.attributes("role")).toBe("none");
      });
    });

    it("renders slot content inside the correct list item", async () => {
      wrapper = await createWrapper(
        {},
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
        {},
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
        {},
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
  // Keyboard navigation
  // -------------------------
  describe("Keyboard navigation (handleKeydown)", () => {
    /**
     * Mount with three real button menuitems and return focused test helpers.
     *
     * Because the popover is hidden (display:none) in jsdom, calling .focus()
     * on children does not update document.activeElement. Instead we:
     *   • spy on each item's .focus() to assert the right element is targeted
     *   • mock document.activeElement to simulate the current focused position
     */
    const mountWithItems = async () => {
      const w = await mountSuspended(ActionMenu, {
        props: { label: "Actions" },
        slots: {
          "item-0": '<button role="menuitem" data-idx="0">First</button>',
          "item-1": '<button role="menuitem" data-idx="1">Second</button>',
          "item-2": '<button role="menuitem" data-idx="2">Third</button>',
        },
      });
      const vm = w.vm as unknown as ActionMenuInstance;
      const items = vm.getMenuItems();
      const focusSpies = items.map((el) => vi.spyOn(el, "focus"));

      /** Fire a keydown event directly through the handler. */
      const fire = (key: string) =>
        vm.handleKeydown(
          Object.assign(new KeyboardEvent("keydown", { key, bubbles: true }), {
            preventDefault: vi.fn(),
          })
        );

      /**
       * Mock document.activeElement so the handler calculates currentIndex
       * from the supplied item index rather than the real (unusable) DOM state.
       */
      const setActiveItem = (index: number) =>
        vi.spyOn(document, "activeElement", "get").mockReturnValue(items[index]!);

      return { w, vm, items, focusSpies, fire, setActiveItem };
    };

    it("ArrowDown moves focus to the next item", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithItems();
      const getter = setActiveItem(0);
      fire("ArrowDown");
      expect(focusSpies[1]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("ArrowDown wraps from last to first item", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithItems();
      const getter = setActiveItem(2);
      fire("ArrowDown");
      expect(focusSpies[0]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("ArrowUp moves focus to the previous item", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithItems();
      const getter = setActiveItem(2);
      fire("ArrowUp");
      expect(focusSpies[1]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("ArrowUp wraps from first to last item", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithItems();
      const getter = setActiveItem(0);
      fire("ArrowUp");
      expect(focusSpies[2]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("ArrowDown focuses the first item when focus is outside the menu (currentIndex = -1)", async () => {
      const { w, focusSpies, fire } = await mountWithItems();
      // No setActiveItem call — document.activeElement is <body>, indexOf returns -1
      fire("ArrowDown");
      expect(focusSpies[0]).toHaveBeenCalledOnce();
      w.unmount();
    });

    it("ArrowUp focuses the last item when focus is outside the menu (currentIndex = -1)", async () => {
      const { w, focusSpies, fire } = await mountWithItems();
      // No setActiveItem call — document.activeElement is <body>, indexOf returns -1
      fire("ArrowUp");
      expect(focusSpies[2]).toHaveBeenCalledOnce();
      w.unmount();
    });

    it("Home moves focus to the first item regardless of starting position", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithItems();
      const getter = setActiveItem(2);
      fire("Home");
      expect(focusSpies[0]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("End moves focus to the last item regardless of starting position", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithItems();
      const getter = setActiveItem(0);
      fire("End");
      expect(focusSpies[2]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("Tab calls hidePopover without returning focus to the trigger", async () => {
      const { w, fire } = await mountWithItems();
      const popoverEl = w.find(".action-menu-popover").element as HTMLElement;
      const hidePopoverSpy = vi.spyOn(popoverEl, "hidePopover");
      const triggerEl = w.find(".action-menu-trigger").element as HTMLElement;
      const focusSpy = vi.spyOn(triggerEl, "focus");

      fire("Tab");

      expect(hidePopoverSpy).toHaveBeenCalledOnce();
      expect(focusSpy).not.toHaveBeenCalled();
      w.unmount();
    });

    it("navigation keys call preventDefault; Tab does not", async () => {
      const { w, vm, setActiveItem } = await mountWithItems();
      const getter = setActiveItem(0);
      const preventDefaultSpy = vi.fn();
      const makeEvent = (key: string) =>
        Object.assign(new KeyboardEvent("keydown", { key, bubbles: true }), {
          preventDefault: preventDefaultSpy,
        });

      vm.handleKeydown(makeEvent("ArrowDown"));
      vm.handleKeydown(makeEvent("ArrowUp"));
      vm.handleKeydown(makeEvent("Home"));
      vm.handleKeydown(makeEvent("End"));
      vm.handleKeydown(makeEvent("Tab"));

      // Arrow/Home/End prevent default scroll; Tab does not
      expect(preventDefaultSpy).toHaveBeenCalledTimes(4);
      getter.mockRestore();
      w.unmount();
    });

    it("does nothing when there are no menuitems", async () => {
      const w = await mountSuspended(ActionMenu, { props: {} });
      const vm = w.vm as unknown as ActionMenuInstance;
      expect(() =>
        vm.handleKeydown(new KeyboardEvent("keydown", { key: "ArrowDown" }))
      ).not.toThrow();
      w.unmount();
    });
  });

  // -------------------------
  // closeMenu — focus return
  // -------------------------
  describe("closeMenu — focus return", () => {
    it("returns focus to the trigger button after closing", async () => {
      wrapper = await mountSuspended(ActionMenu, {
        props: {},
        slots: { "item-0": '<button role="menuitem">Action</button>' },
      });
      const triggerEl = wrapper.find(".action-menu-trigger").element as HTMLElement;
      const focusSpy = vi.spyOn(triggerEl, "focus");
      const popoverEl = wrapper.find(".action-menu-popover").element as HTMLElement;
      vi.spyOn(popoverEl, "hidePopover");

      const vm = wrapper.vm as unknown as ActionMenuInstance;
      vm.closeMenu();

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
