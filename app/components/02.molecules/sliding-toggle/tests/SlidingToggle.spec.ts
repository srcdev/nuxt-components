import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import SlidingToggle from "../SlidingToggle.vue";
import type { SlidingToggleOption } from "~/types/components";

const billing: SlidingToggleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
];

const observed: Element[] = [];

class MockResizeObserver {
  observe = vi.fn((element: Element) => observed.push(element));
  unobserve = vi.fn();
  disconnect = vi.fn(() => observed.splice(0));
}

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountToggle = async (props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) => {
  const holder: { current?: Awaited<ReturnType<typeof mountSuspended>> } = {};
  const onUpdate = (value: string | number) => {
    void holder.current?.setProps({ modelValue: value });
  };
  const wrapper = await mountSuspended(SlidingToggle, {
    props: { options: billing, modelValue: "monthly", ariaLabel: "Billing period", "onUpdate:modelValue": onUpdate, ...props },
    attrs,
    attachTo: document.body,
  });
  holder.current = wrapper;
  mounted.push(wrapper);
  return wrapper;
};

const radios = (wrapper: Awaited<ReturnType<typeof mountToggle>>) => wrapper.findAll('[role="radio"]');

const mockRow = () => {
  vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (this: HTMLElement) {
    return this.dataset.index === undefined ? 0 : Number(this.dataset.index) * 100;
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
    return this.dataset.index === undefined ? 0 : 100;
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
    return this.classList.contains("sliding-toggle") ? 300 : 0;
  });
};

const edge = (wrapper: Awaited<ReturnType<typeof mountToggle>>, name: string) =>
  (wrapper.element as HTMLElement).style.getPropertyValue(`--_sliding-toggle-${name}`);

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
  observed.splice(0);
});

describe("SlidingToggle", () => {
  it("mounts without error", async () => {
    const wrapper = await mountToggle();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountToggle({ styleClassPassthrough: "custom-class" });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Semantics ───────────────────────────────────────────────────────────

  it("renders a named radiogroup", async () => {
    const wrapper = await mountToggle();
    expect(wrapper.attributes("role")).toBe("radiogroup");
    expect(wrapper.attributes("aria-label")).toBe("Billing period");
  });

  it("can be named by aria-labelledby instead", async () => {
    const wrapper = await mountToggle({ ariaLabel: "", ariaLabelledby: "billing-heading" });
    expect(wrapper.attributes("aria-label")).toBeUndefined();
    expect(wrapper.attributes("aria-labelledby")).toBe("billing-heading");
  });

  it("renders one type=button radio per option, labelled by its text", async () => {
    const wrapper = await mountToggle();
    const options = radios(wrapper);
    expect(options).toHaveLength(3);
    options.forEach((option, index) => {
      expect(option.element.tagName).toBe("BUTTON");
      expect(option.attributes("type")).toBe("button");
      expect(option.text()).toBe(billing[index]!.label);
    });
  });

  it("marks the selected option aria-checked", async () => {
    const wrapper = await mountToggle({ modelValue: "yearly" });
    expect(radios(wrapper).map((option) => option.attributes("aria-checked"))).toEqual(["false", "true", "false"]);
  });

  it("hides both indicators from assistive tech", async () => {
    const wrapper = await mountToggle();
    wrapper.findAll(".sliding-toggle-indicator").forEach((indicator) => {
      expect(indicator.attributes("aria-hidden")).toBe("true");
    });
  });

  // ─── Selection ───────────────────────────────────────────────────────────

  it("selects on click", async () => {
    const wrapper = await mountToggle();
    await radios(wrapper)[2]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["lifetime"]);
    expect(radios(wrapper)[2]!.attributes("aria-checked")).toBe("true");
  });

  it("follows an external v-model change", async () => {
    const wrapper = await mountToggle();
    await wrapper.setProps({ modelValue: "lifetime" });
    expect(radios(wrapper)[2]!.attributes("aria-checked")).toBe("true");
    expect(radios(wrapper)[0]!.attributes("aria-checked")).toBe("false");
  });

  it("supports numeric values", async () => {
    const wrapper = await mountToggle({
      options: [
        { value: 1, label: "One" },
        { value: 2, label: "Two" },
      ],
      modelValue: 1,
    });
    await radios(wrapper)[1]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([2]);
  });

  // ─── Roving tabindex ─────────────────────────────────────────────────────

  it("gives only the checked option the tab stop", async () => {
    const wrapper = await mountToggle({ modelValue: "yearly" });
    expect(radios(wrapper).map((option) => option.attributes("tabindex"))).toEqual(["-1", "0", "-1"]);
  });

  it("gives the first enabled option the tab stop when the value matches no option", async () => {
    const wrapper = await mountToggle({
      modelValue: "weekly",
      options: [{ value: "a", label: "A", disabled: true }, ...billing],
    });
    expect(radios(wrapper).map((option) => option.attributes("tabindex"))).toEqual(["-1", "0", "-1", "-1"]);
    expect(wrapper.attributes("data-has-selection")).toBeUndefined();
  });

  // ─── Keyboard ────────────────────────────────────────────────────────────

  it("ArrowRight selects and focuses the next option", async () => {
    const wrapper = await mountToggle();
    await radios(wrapper)[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["yearly"]);
    expect(document.activeElement).toBe(radios(wrapper)[1]!.element);
  });

  it("ArrowDown also moves to the next option, and ArrowLeft/ArrowUp to the previous", async () => {
    const wrapper = await mountToggle({ modelValue: "yearly" });
    await radios(wrapper)[1]!.trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["lifetime"]);
    await radios(wrapper)[2]!.trigger("keydown", { key: "ArrowUp" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["yearly"]);
    await radios(wrapper)[1]!.trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["monthly"]);
  });

  it("wraps from the last option to the first and back", async () => {
    const wrapper = await mountToggle({ modelValue: "lifetime" });
    await radios(wrapper)[2]!.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["monthly"]);
    await radios(wrapper)[0]!.trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["lifetime"]);
  });

  it("Home and End select the first and last options", async () => {
    const wrapper = await mountToggle({ modelValue: "yearly" });
    await radios(wrapper)[1]!.trigger("keydown", { key: "End" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["lifetime"]);
    await radios(wrapper)[2]!.trigger("keydown", { key: "Home" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["monthly"]);
  });

  it("skips disabled options", async () => {
    const wrapper = await mountToggle({
      options: [billing[0]!, { ...billing[1]!, disabled: true }, billing[2]!],
    });
    await radios(wrapper)[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["lifetime"]);
  });

  it("RTL swaps the arrow directions", async () => {
    const wrapper = await mountToggle({}, { dir: "rtl" });
    await radios(wrapper)[0]!.trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["yearly"]);
  });

  it("ignores other keys", async () => {
    const wrapper = await mountToggle();
    await radios(wrapper)[0]!.trigger("keydown", { key: "a" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  // ─── Disabled ────────────────────────────────────────────────────────────

  it("disables every option and blocks selection when the group is disabled", async () => {
    const wrapper = await mountToggle({ disabled: true });
    expect(wrapper.attributes("aria-disabled")).toBe("true");
    radios(wrapper).forEach((option) => expect(option.attributes("disabled")).toBeDefined());
    await radios(wrapper)[1]!.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("does not select a disabled option on click", async () => {
    const wrapper = await mountToggle({ options: [billing[0]!, { ...billing[1]!, disabled: true }, billing[2]!] });
    const vm = wrapper.vm as unknown as { select: (index: number) => void };
    vm.select(1);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  // ─── Indicators ──────────────────────────────────────────────────────────

  it("sets data-ready once mounted and measured", async () => {
    const wrapper = await mountToggle();
    expect(wrapper.attributes("data-ready")).toBeDefined();
    expect(wrapper.attributes("data-has-selection")).toBeDefined();
  });

  it("snaps the active indicator onto the checked option on mount", async () => {
    mockRow();
    const wrapper = await mountToggle({ modelValue: "yearly" });
    expect(edge(wrapper, "active-start")).toBe("100px");
    expect(edge(wrapper, "active-end")).toBe("100px");
    expect(edge(wrapper, "active-duration")).toBe("0ms");
  });

  it("slides the active indicator with the leading edge first", async () => {
    mockRow();
    const wrapper = await mountToggle();
    await radios(wrapper)[2]!.trigger("click");
    await nextTick();
    expect(edge(wrapper, "active-start")).toBe("200px");
    expect(edge(wrapper, "active-start-delay")).toBe("200ms");
    expect(edge(wrapper, "active-end-delay")).toBe("0ms");
  });

  it("moves the hover indicator with the pointer and back to the checked option on leave", async () => {
    mockRow();
    const wrapper = await mountToggle();
    await radios(wrapper)[2]!.trigger("mouseenter");
    expect(edge(wrapper, "hover-start")).toBe("200px");
    expect(wrapper.attributes("data-hovering")).toBeDefined();
    await wrapper.trigger("mouseleave");
    expect(edge(wrapper, "hover-start")).toBe("0px");
    expect(wrapper.attributes("data-hovering")).toBeUndefined();
  });

  it("does not track hover when trackHover is false", async () => {
    mockRow();
    const wrapper = await mountToggle({ trackHover: false });
    await radios(wrapper)[2]!.trigger("mouseenter");
    expect(edge(wrapper, "hover-start")).toBe("0px");
    expect(wrapper.attributes("data-hovering")).toBeUndefined();
  });

  it("uses transitionDuration for the slide", async () => {
    mockRow();
    const wrapper = await mountToggle({ transitionDuration: 350 });
    await radios(wrapper)[1]!.trigger("click");
    await nextTick();
    expect(edge(wrapper, "active-duration")).toBe("350ms");
  });

  // ─── Re-measuring ────────────────────────────────────────────────────────

  it("observes the track and each option for size changes", async () => {
    const wrapper = await mountToggle();
    expect(observed).toContain(wrapper.element);
    radios(wrapper).forEach((option) => expect(observed).toContain(option.element));
  });

  it("re-places the indicators when the options change", async () => {
    mockRow();
    const wrapper = await mountToggle({ modelValue: "lifetime" });
    await wrapper.setProps({ options: [billing[2]!, billing[0]!] });
    await nextTick();
    await nextTick();
    expect(edge(wrapper, "active-start")).toBe("0px");
  });

  // ─── Worst-case data ─────────────────────────────────────────────────────

  it("renders an empty group without errors", async () => {
    const wrapper = await mountToggle({ options: [] });
    expect(radios(wrapper)).toHaveLength(0);
    expect(wrapper.attributes("data-has-selection")).toBeUndefined();
  });

  it("renders duplicate labels as separate radios", async () => {
    const wrapper = await mountToggle({
      options: [
        { value: "a", label: "Same" },
        { value: "b", label: "Same" },
      ],
      modelValue: "b",
    });
    expect(radios(wrapper)).toHaveLength(2);
    expect(radios(wrapper)[1]!.attributes("aria-checked")).toBe("true");
  });

  it("renders HTML-like labels as text", async () => {
    const wrapper = await mountToggle({ options: [{ value: "x", label: "<b>not bold</b>" }], modelValue: "x" });
    expect(wrapper.find("b").exists()).toBe(false);
    expect(radios(wrapper)[0]!.text()).toBe("<b>not bold</b>");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountToggle({ styleClassPassthrough: ["original"] });
    expect(wrapper.classes()).toContain("sliding-toggle");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
