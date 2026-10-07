import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import SelectMenu from "../SelectMenu.vue";
import type { SelectMenuOption } from "~/types/components/select-menu";

// --- Types ---
interface SelectMenuInstance {
  menuId: string;
  anchorName: string;
  selectOption: (option: SelectMenuOption) => void;
  handleToggle: (event: Event) => void;
  handleKeydown: (event: KeyboardEvent) => void;
  getMenuItems: () => HTMLElement[];
}

const options: SelectMenuOption[] = [
  { value: "en", label: "English", icon: "flag:gb-4x3" },
  { value: "fr", label: "Français", icon: "flag:fr-4x3" },
  { value: "de", label: "Deutsch", icon: "flag:de-4x3" },
];

// --- Helpers ---
const createWrapper = async (props: Record<string, unknown> = {}) => {
  return mountSuspended(SelectMenu, {
    props: { options, label: "Language", ...props },
  });
};

describe("SelectMenu", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  beforeEach(() => {
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
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["hidePopover"];
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("with a selected value", async () => {
      wrapper = await createWrapper({ modelValue: "fr" });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("icon-only trigger", async () => {
      wrapper = await createWrapper({ modelValue: "en", showLabel: false, showChevron: false });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // -------------------------
  // Trigger button
  // -------------------------
  describe("Trigger button", () => {
    it("renders a trigger button", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".select-menu-trigger").exists()).toBe(true);
    });

    it("trigger button has type='button'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".select-menu-trigger").attributes("type")).toBe("button");
    });

    it("trigger button has aria-haspopup='listbox'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".select-menu-trigger").attributes("aria-haspopup")).toBe("listbox");
    });

    it("applies the normal variant class by default and underlined when set", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".select-menu").classes()).toContain("normal");

      await wrapper.setProps({ inputVariant: "underlined" });
      expect(wrapper.find(".select-menu").classes()).toContain("underlined");
      expect(wrapper.find(".select-menu").classes()).not.toContain("normal");
    });

    it("uses label prop as aria-label", async () => {
      wrapper = await createWrapper({ label: "Filter by service" });
      expect(wrapper.find(".select-menu-trigger").attributes("aria-label")).toBe("Filter by service");
    });

    it("shows label text as the placeholder/category tag when nothing is selected", async () => {
      wrapper = await createWrapper({ label: "Choose a service" });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("Choose a service");
    });

    it("prefers an explicit placeholder over the label when nothing is selected", async () => {
      wrapper = await createWrapper({ label: "Language", placeholder: "Select a language" });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("Select a language");
    });

    it("shows the selected option's label once a value is set", async () => {
      wrapper = await createWrapper({ modelValue: "fr" });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("Français");
    });

    it("shows the selected option's icon in the trigger by default", async () => {
      wrapper = await createWrapper({ modelValue: "en" });
      expect(wrapper.find(".select-menu-trigger-icon").exists()).toBe(true);
    });

    it("hides the trigger icon when showIcon is false", async () => {
      wrapper = await createWrapper({ modelValue: "en", showIcon: false });
      expect(wrapper.find(".select-menu-trigger-icon").exists()).toBe(false);
    });

    it("hides the trigger label when showLabel is false (icon-only mode)", async () => {
      wrapper = await createWrapper({ modelValue: "en", showLabel: false });
      expect(wrapper.find(".select-menu-trigger-label").exists()).toBe(false);
    });

    it("hides the chevron when showChevron is false", async () => {
      wrapper = await createWrapper({ showChevron: false });
      expect(wrapper.find(".select-menu-trigger-chevron").exists()).toBe(false);
    });

    it("popovertarget matches the popover id", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as SelectMenuInstance;
      expect(wrapper.find(".select-menu-trigger").attributes("popovertarget")).toBe(vm.menuId);
    });
  });

  // -------------------------
  // Popover / listbox
  // -------------------------
  describe("Popover listbox", () => {
    it("renders one option per entry in options", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll(".select-menu-list-item")).toHaveLength(3);
    });

    it("list has role='listbox'", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".select-menu-list").attributes("role")).toBe("listbox");
    });

    it("each item has role='option'", async () => {
      wrapper = await createWrapper();
      wrapper.findAll(".select-menu-list-item").forEach((item) => {
        expect(item.attributes("role")).toBe("option");
      });
    });

    it("marks the selected option with aria-selected='true'", async () => {
      wrapper = await createWrapper({ modelValue: "de" });
      const items = wrapper.findAll(".select-menu-list-item");
      expect(items[0]!.attributes("aria-selected")).toBe("false");
      expect(items[2]!.attributes("aria-selected")).toBe("true");
    });

    it("renders a checkmark icon only next to the selected option", async () => {
      wrapper = await createWrapper({ modelValue: "de" });
      const items = wrapper.findAll(".select-menu-list-item");
      expect(items[0]!.find(".select-menu-item-check-icon").exists()).toBe(false);
      expect(items[2]!.find(".select-menu-item-check-icon").exists()).toBe(true);
    });
  });

  // -------------------------
  // Selecting an option
  // -------------------------
  describe("selectOption", () => {
    it("updates v-model when an option is clicked", async () => {
      wrapper = await createWrapper({ modelValue: "en" });
      await wrapper.findAll(".select-menu-list-item")[1]!.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["fr"]);
    });

    it("closes the popover when an option is selected", async () => {
      wrapper = await createWrapper();
      const popoverEl = wrapper.find(".select-menu-popover").element as HTMLElement;
      const hidePopoverSpy = vi.spyOn(popoverEl, "hidePopover");
      await wrapper.findAll(".select-menu-list-item")[0]!.trigger("click");
      expect(hidePopoverSpy).toHaveBeenCalledOnce();
    });

    it("returns focus to the trigger after selecting", async () => {
      wrapper = await createWrapper();
      const triggerEl = wrapper.find(".select-menu-trigger").element as HTMLElement;
      const focusSpy = vi.spyOn(triggerEl, "focus");
      await wrapper.findAll(".select-menu-list-item")[0]!.trigger("click");
      expect(focusSpy).toHaveBeenCalledOnce();
    });
  });

  // -------------------------
  // handleToggle — focus management
  // -------------------------
  describe("handleToggle", () => {
    it("focuses the first option when opened with nothing selected", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as SelectMenuInstance;
      const items = vm.getMenuItems();
      const focusSpy = vi.spyOn(items[0]!, "focus");

      vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));
      await nextTick();
      expect(focusSpy).toHaveBeenCalledOnce();
    });

    it("focuses the currently selected option when opened", async () => {
      wrapper = await createWrapper({ modelValue: "de" });
      const vm = wrapper.vm as unknown as SelectMenuInstance;
      const items = vm.getMenuItems();
      const focusSpy = vi.spyOn(items[2]!, "focus");

      vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));
      await nextTick();
      expect(focusSpy).toHaveBeenCalledOnce();
    });

    it("sets aria-expanded on the trigger when open", async () => {
      wrapper = await createWrapper();
      const vm = wrapper.vm as unknown as SelectMenuInstance;
      vm.handleToggle(Object.assign(new Event("toggle"), { newState: "open" }));
      await nextTick();
      expect(wrapper.find(".select-menu-trigger").attributes("aria-expanded")).toBe("true");
    });
  });

  // -------------------------
  // Keyboard navigation
  // -------------------------
  describe("Keyboard navigation (handleKeydown)", () => {
    const mountWithFocusSpies = async () => {
      const w = await createWrapper();
      const vm = w.vm as unknown as SelectMenuInstance;
      const items = vm.getMenuItems();
      const focusSpies = items.map((el) => vi.spyOn(el, "focus"));

      const fire = (key: string) =>
        vm.handleKeydown(
          Object.assign(new KeyboardEvent("keydown", { key, bubbles: true }), { preventDefault: vi.fn() })
        );

      const setActiveItem = (index: number) =>
        vi.spyOn(document, "activeElement", "get").mockReturnValue(items[index]!);

      return { w, vm, items, focusSpies, fire, setActiveItem };
    };

    it("ArrowDown moves focus to the next option", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithFocusSpies();
      const getter = setActiveItem(0);
      fire("ArrowDown");
      expect(focusSpies[1]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("ArrowDown wraps from last to first option", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithFocusSpies();
      const getter = setActiveItem(2);
      fire("ArrowDown");
      expect(focusSpies[0]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("ArrowUp wraps from first to last option", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithFocusSpies();
      const getter = setActiveItem(0);
      fire("ArrowUp");
      expect(focusSpies[2]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("Home focuses the first option", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithFocusSpies();
      const getter = setActiveItem(2);
      fire("Home");
      expect(focusSpies[0]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("End focuses the last option", async () => {
      const { w, focusSpies, fire, setActiveItem } = await mountWithFocusSpies();
      const getter = setActiveItem(0);
      fire("End");
      expect(focusSpies[2]).toHaveBeenCalledOnce();
      getter.mockRestore();
      w.unmount();
    });

    it("Enter selects the focused option", async () => {
      const { w, vm, setActiveItem } = await mountWithFocusSpies();
      const getter = setActiveItem(1);
      const popoverEl = w.find(".select-menu-popover").element as HTMLElement;
      const hidePopoverSpy = vi.spyOn(popoverEl, "hidePopover");
      vm.handleKeydown(Object.assign(new KeyboardEvent("keydown", { key: "Enter" }), { preventDefault: vi.fn() }));
      expect(hidePopoverSpy).toHaveBeenCalledOnce();
      expect(w.emitted("update:modelValue")?.[0]).toEqual(["fr"]);
      getter.mockRestore();
      w.unmount();
    });

    it("Space selects the focused option", async () => {
      const { w, vm, setActiveItem } = await mountWithFocusSpies();
      const getter = setActiveItem(2);
      vm.handleKeydown(Object.assign(new KeyboardEvent("keydown", { key: " " }), { preventDefault: vi.fn() }));
      expect(w.emitted("update:modelValue")?.[0]).toEqual(["de"]);
      getter.mockRestore();
      w.unmount();
    });

    it("Tab closes the popover without moving focus to the trigger", async () => {
      const { w, fire } = await mountWithFocusSpies();
      const popoverEl = w.find(".select-menu-popover").element as HTMLElement;
      const hidePopoverSpy = vi.spyOn(popoverEl, "hidePopover");
      const triggerEl = w.find(".select-menu-trigger").element as HTMLElement;
      const focusSpy = vi.spyOn(triggerEl, "focus");

      fire("Tab");

      expect(hidePopoverSpy).toHaveBeenCalledOnce();
      expect(focusSpy).not.toHaveBeenCalled();
      w.unmount();
    });

    it("does nothing when there are no options", async () => {
      const w = await mountSuspended(SelectMenu, { props: { options: [], label: "Empty" } });
      const vm = w.vm as unknown as SelectMenuInstance;
      expect(() => vm.handleKeydown(new KeyboardEvent("keydown", { key: "ArrowDown" }))).not.toThrow();
      w.unmount();
    });
  });

  // -------------------------
  // Multiple selection
  // -------------------------
  describe("Multiple selection (multiple=true)", () => {
    it("list has aria-multiselectable='true'", async () => {
      wrapper = await createWrapper({ multiple: true });
      expect(wrapper.find(".select-menu-list").attributes("aria-multiselectable")).toBe("true");
    });

    it("omits aria-multiselectable in single-select mode", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".select-menu-list").attributes("aria-multiselectable")).toBeUndefined();
    });

    it("renders a checkbox icon for every option, checked or unchecked", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["fr"] });
      const items = wrapper.findAll(".select-menu-list-item");
      expect(items[0]!.find(".select-menu-item-check-icon").exists()).toBe(true);
      expect(items[1]!.find(".select-menu-item-check-icon").exists()).toBe(true);
    });

    it("adds a value to the array on first click", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [] });
      await wrapper.findAll(".select-menu-list-item")[0]!.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["en"]]);
    });

    it("removes a value from the array when clicked again", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en", "fr"] });
      await wrapper.findAll(".select-menu-list-item")[0]!.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["fr"]]);
    });

    it("does not close the popover when an option is toggled", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [] });
      const popoverEl = wrapper.find(".select-menu-popover").element as HTMLElement;
      const hidePopoverSpy = vi.spyOn(popoverEl, "hidePopover");
      await wrapper.findAll(".select-menu-list-item")[0]!.trigger("click");
      expect(hidePopoverSpy).not.toHaveBeenCalled();
    });

    it("marks each selected option with aria-selected='true'", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en", "de"] });
      const items = wrapper.findAll(".select-menu-list-item");
      expect(items[0]!.attributes("aria-selected")).toBe("true");
      expect(items[1]!.attributes("aria-selected")).toBe("false");
      expect(items[2]!.attributes("aria-selected")).toBe("true");
    });

    it("keeps the static label as the trigger text once options are selected", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en", "de"], label: "Services required" });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("Services required");
    });

    it("shows the label/placeholder as the trigger text when nothing is selected", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [], label: "Services required" });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("Services required");
    });

    it("prefers placeholder over label as the static trigger text, regardless of selection", async () => {
      wrapper = await createWrapper({
        multiple: true,
        modelValue: ["en"],
        label: "Language",
        placeholder: "Select languages",
      });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("Select languages");
    });

    it("shows a comma-joined selection list in the trigger when showSelectionInTrigger is true", async () => {
      wrapper = await createWrapper({
        multiple: true,
        modelValue: ["en", "de"],
        label: "Services required",
        showSelectionInTrigger: true,
      });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("English, Deutsch");
    });

    it("falls back to label/placeholder when showSelectionInTrigger is true but nothing is selected", async () => {
      wrapper = await createWrapper({
        multiple: true,
        modelValue: [],
        label: "Services required",
        showSelectionInTrigger: true,
      });
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("Services required");
    });

    it("does not render a trigger icon in multiple mode", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en"] });
      expect(wrapper.find(".select-menu-trigger-icon").exists()).toBe(false);
    });

    it("Enter toggles the focused option without closing the popover", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [] });
      const vm = wrapper.vm as unknown as SelectMenuInstance;
      const items = vm.getMenuItems();
      const getter = vi.spyOn(document, "activeElement", "get").mockReturnValue(items[1]!);
      const popoverEl = wrapper.find(".select-menu-popover").element as HTMLElement;
      const hidePopoverSpy = vi.spyOn(popoverEl, "hidePopover");

      vm.handleKeydown(Object.assign(new KeyboardEvent("keydown", { key: "Enter" }), { preventDefault: vi.fn() }));

      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["fr"]]);
      expect(hidePopoverSpy).not.toHaveBeenCalled();
      getter.mockRestore();
    });
  });

  // -------------------------
  // Trigger icon + indicator
  // -------------------------
  describe("Trigger icon and indicator", () => {
    const plainOptions: SelectMenuOption[] = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
      { value: "c", label: "Gamma" },
    ];

    it("renders triggerIcon in multiple mode", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [], triggerIcon: "lucide:list" });
      expect(wrapper.find(".select-menu-trigger-icon").exists()).toBe(true);
    });

    it("renders triggerIcon in single mode when the selected option has no icon", async () => {
      wrapper = await createWrapper({ options: plainOptions, modelValue: "a", triggerIcon: "lucide:list" });
      expect(wrapper.find(".select-menu-trigger-icon").exists()).toBe(true);
    });

    it("hides triggerIcon when showIcon is false", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [], triggerIcon: "lucide:list", showIcon: false });
      expect(wrapper.find(".select-menu-trigger-icon").exists()).toBe(false);
    });

    it("renders no indicator by default", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en", "fr"] });
      expect(wrapper.find(".select-menu-trigger-count").exists()).toBe(false);
      expect(wrapper.find(".select-menu-trigger-dot").exists()).toBe(false);
    });

    it("shows the number selected in the count badge", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en", "fr"], indicator: "count" });
      expect(wrapper.find(".select-menu-trigger-count").text()).toBe("2");
    });

    it("keeps an empty, hidden count badge in the layout when nothing is selected", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [], indicator: "count" });
      const badge = wrapper.find(".select-menu-trigger-count");
      expect(badge.exists()).toBe(true);
      expect(badge.text()).toBe("");
      expect(badge.classes()).toContain("select-menu-trigger-indicator-empty");
    });

    it("updates the count badge as options are toggled", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [], indicator: "count" });
      await wrapper.setProps({ modelValue: ["en", "fr", "de"] });
      const badge = wrapper.find(".select-menu-trigger-count");
      expect(badge.text()).toBe("3");
      expect(badge.classes()).not.toContain("select-menu-trigger-indicator-empty");
    });

    it("hides the dot, keeping its space, when nothing is selected", async () => {
      wrapper = await createWrapper({ modelValue: "en", indicator: "dot" });
      const dot = () => wrapper.find(".select-menu-trigger-dot");
      expect(dot().classes()).not.toContain("select-menu-trigger-indicator-empty");
      await wrapper.setProps({ modelValue: undefined });
      expect(dot().exists()).toBe(true);
      expect(dot().classes()).toContain("select-menu-trigger-indicator-empty");
    });

    it("colours the trigger dot with the selected option's dotColor", async () => {
      const statusOptions: SelectMenuOption[] = [
        { value: "active", label: "Active", dotColor: "green" },
        { value: "pending", label: "Pending", dotColor: "orange" },
      ];
      wrapper = await createWrapper({ options: statusOptions, modelValue: "active", indicator: "dot" });
      const dot = () => wrapper.find(".select-menu-trigger-dot").element as HTMLElement;
      expect(dot().style.getPropertyValue("--_dot-color")).toBe("green");
      await wrapper.setProps({ modelValue: "pending" });
      expect(dot().style.getPropertyValue("--_dot-color")).toBe("orange");
    });

    it("leaves the trigger dot on the token colour when the option has no dotColor", async () => {
      wrapper = await createWrapper({ options: plainOptions, modelValue: "a", indicator: "dot" });
      const dot = wrapper.find(".select-menu-trigger-dot").element as HTMLElement;
      expect(dot.style.getPropertyValue("--_dot-color")).toBe("");
    });

    it("renders a list dot for options with dotColor and no icon", async () => {
      wrapper = await createWrapper({
        options: [
          { value: "a", label: "Alpha", dotColor: "green" },
          { value: "b", label: "Beta" },
          { value: "c", label: "Gamma", icon: "lucide:star", dotColor: "red" },
        ],
      });
      const rows = wrapper.findAll(".select-menu-list-item");
      const rowDot = rows[0]!.find(".select-menu-item-dot");
      expect((rowDot.element as HTMLElement).style.getPropertyValue("--_dot-color")).toBe("green");
      expect(rows[1]!.find(".select-menu-item-dot").exists()).toBe(false);
      expect(rows[2]!.find(".select-menu-item-dot").exists()).toBe(false);
    });

    it("hides the indicator from assistive tech", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en"], indicator: "count" });
      expect(wrapper.find(".select-menu-trigger-count").attributes("aria-hidden")).toBe("true");
    });

    it("appends the selected count to the trigger's accessible name while the indicator shows", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: ["en", "fr"], indicator: "count" });
      expect(wrapper.find(".select-menu-trigger").attributes("aria-label")).toBe("Language, 2 selected");
    });

    it("uses a custom selectedCountLabel", async () => {
      wrapper = await createWrapper({
        multiple: true,
        modelValue: ["en"],
        indicator: "count",
        selectedCountLabel: "{count} sélectionné",
      });
      expect(wrapper.find(".select-menu-trigger").attributes("aria-label")).toBe("Language, 1 sélectionné");
    });

    it("keeps the plain label as the accessible name when nothing is selected", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [], indicator: "count" });
      expect(wrapper.find(".select-menu-trigger").attributes("aria-label")).toBe("Language");
    });
  });

  // -------------------------
  // reserveLabelWidth
  // -------------------------
  describe("reserveLabelWidth", () => {
    it("renders plain label text by default", async () => {
      wrapper = await createWrapper({ modelValue: "en" });
      expect(wrapper.find(".select-menu-trigger-label-sizer").exists()).toBe(false);
      expect(wrapper.find(".select-menu-trigger-label").text()).toBe("English");
    });

    it("renders a hidden sizer for the placeholder and every option label", async () => {
      wrapper = await createWrapper({ modelValue: "en", placeholder: "Pick one", reserveLabelWidth: true });
      const sizers = wrapper.findAll(".select-menu-trigger-label-sizer");
      expect(sizers.map((sizer) => sizer.text())).toEqual(["Pick one", "English", "Français", "Deutsch"]);
      expect(sizers.every((sizer) => sizer.attributes("aria-hidden") === "true")).toBe(true);
    });

    it("shows the selected label in the visible text span", async () => {
      wrapper = await createWrapper({ modelValue: "fr", reserveLabelWidth: true });
      expect(wrapper.find(".select-menu-trigger-label-text").text()).toBe("Français");
      await wrapper.setProps({ modelValue: "de" });
      expect(wrapper.find(".select-menu-trigger-label-text").text()).toBe("Deutsch");
    });

    it("has no effect in multiple mode", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [], reserveLabelWidth: true });
      expect(wrapper.find(".select-menu-trigger-label").classes()).not.toContain("select-menu-trigger-label-reserved");
      expect(wrapper.find(".select-menu-trigger-label-sizer").exists()).toBe(false);
    });
  });

  // -------------------------
  // styleClassPassthrough
  // -------------------------
  describe("styleClassPassthrough", () => {
    it("applies a string class to the root element", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "custom-select" });
      expect(wrapper.classes()).toContain("custom-select");
    });

    it("applies an array of classes to the root element", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["select-a", "select-b"] });
      expect(wrapper.classes()).toContain("select-a");
      expect(wrapper.classes()).toContain("select-b");
    });

    it("root element always has the 'select-menu' class", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: "extra-class" });
      expect(wrapper.classes()).toContain("select-menu");
    });
  });

  // -------------------------
  // Without the Popover API (Safari 16 and older)
  // -------------------------
  describe("Without the Popover API", () => {
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "showPopover", { value: undefined, writable: true, configurable: true });
    });

    it("opens from the trigger with the fallback open class and aria-expanded", async () => {
      wrapper = await createWrapper();
      const popover = wrapper.find(".select-menu-popover");
      expect(popover.classes()).not.toContain("select-menu-popover-open");

      await wrapper.find(".select-menu-trigger").trigger("click");
      expect(popover.classes()).toContain("select-menu-popover-open");
      expect(wrapper.find(".select-menu-trigger").attributes("aria-expanded")).toBe("true");
    });

    it("closes when a single-select option is chosen", async () => {
      wrapper = await createWrapper();
      await wrapper.find(".select-menu-trigger").trigger("click");
      await wrapper.findAll('[role="option"]')[1]!.trigger("click");

      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["fr"]);
      expect(wrapper.find(".select-menu-popover").classes()).not.toContain("select-menu-popover-open");
    });

    it("stays open while toggling options in multiple mode", async () => {
      wrapper = await createWrapper({ multiple: true, modelValue: [] });
      await wrapper.find(".select-menu-trigger").trigger("click");
      await wrapper.findAll('[role="option"]')[1]!.trigger("click");

      expect(wrapper.find(".select-menu-popover").classes()).toContain("select-menu-popover-open");
    });
  });
});
