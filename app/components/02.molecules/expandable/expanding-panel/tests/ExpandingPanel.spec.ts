import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { ComponentPublicInstance } from "vue";
import ExpandingPanel from "../ExpandingPanel.vue";

interface ExpandingPanelInstance extends ComponentPublicInstance {
  animationDurationStr: string;
  open: boolean;
  isPanelOpen: boolean;
}

describe("ExpandingPanel", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "test" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure with default props", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "snap-default" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with all props set", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: {
        name: "snap-all",
        animationDuration: 500,
        forceOpened: true,
        styleClassPassthrough: ["extra-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure with populated slots", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "snap-slots" },
      slots: {
        summary: "<span>Summary text</span>",
        icon: "<span>▸</span>",
        content: "<p>Content text</p>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders the root .expanding-panel element", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "root-test" },
    });
    expect(wrapper.find(".expanding-panel").exists()).toBe(true);
  });

  it("renders a <details> element inside the root", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "details-test" },
    });
    expect(wrapper.find("details.expanding-panel-details").exists()).toBe(true);
  });

  it("renders a <summary> element inside <details>", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "summary-test" },
    });
    expect(wrapper.find("summary.expanding-panel-summary").exists()).toBe(true);
  });

  it("renders the content region div", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "content-test" },
    });
    expect(wrapper.find(".expanding-panel-content").exists()).toBe(true);
  });

  // ─── Default prop values ──────────────────────────────────────────────────

  it("uses correct default prop values on the component instance", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "defaults-test" },
    });
    expect(wrapper.props("animationDuration")).toBe(400);
    expect(wrapper.props("forceOpened")).toBe(false);
    expect(wrapper.props("styleClassPassthrough")).toEqual([]);
  });

  it("defaults model value (isPanelOpen) to false", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "model-default" },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    expect(vm.isPanelOpen).toBe(false);
  });

  // ─── Computed ─────────────────────────────────────────────────────────────

  it("computes animationDurationStr as '<value>ms'", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "anim-str", animationDuration: 750 },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    expect(vm.animationDurationStr).toBe("750ms");
  });

  it("computes animationDurationStr using the default duration", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "anim-str-default" },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    expect(vm.animationDurationStr).toBe("400ms");
  });

  it("open is false when forceOpened is false and model is false", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "open-false", forceOpened: false },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    expect(vm.open).toBe(false);
  });

  it("open is true when model is true", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "open-model" },
      attrs: { modelValue: true },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    expect(vm.open).toBe(true);
  });

  it("open is true when forceOpened is true regardless of model", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "open-forced", forceOpened: true },
      attrs: { modelValue: false },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    expect(vm.open).toBe(true);
  });

  // ─── ARIA & IDs ───────────────────────────────────────────────────────────

  it("sets id on summary to id-{name}-trigger", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "aria-panel" },
    });
    expect(wrapper.find("summary").attributes("id")).toBe("id-aria-panel-trigger");
  });

  it("sets aria-controls on summary to id-{name}-content", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "aria-panel" },
    });
    expect(wrapper.find("summary").attributes("aria-controls")).toBe("id-aria-panel-content");
  });

  it("sets aria-expanded to false when closed", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "aria-expanded" },
    });
    expect(wrapper.find("summary").attributes("aria-expanded")).toBe("false");
  });

  it("sets aria-expanded to true when open", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "aria-expanded-open" },
      attrs: { modelValue: true },
    });
    expect(wrapper.find("summary").attributes("aria-expanded")).toBe("true");
  });

  it("sets id on content region to id-{name}-content", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "aria-panel" },
    });
    expect(wrapper.find(".expanding-panel-content").attributes("id")).toBe("id-aria-panel-content");
  });

  it("sets aria-labelledby on content region to id-{name}-trigger", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "aria-panel" },
    });
    expect(wrapper.find(".expanding-panel-content").attributes("aria-labelledby")).toBe(
      "id-aria-panel-trigger",
    );
  });

  it("sets role='region' on the content div", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "role-test" },
    });
    expect(wrapper.find(".expanding-panel-content").attributes("role")).toBe("region");
  });

  // ─── Toggle behaviour ─────────────────────────────────────────────────────

  it("toggles open state when summary is clicked", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "toggle-test" },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    expect(vm.isPanelOpen).toBe(false);

    await wrapper.find("summary").trigger("click");
    expect(vm.isPanelOpen).toBe(true);

    await wrapper.find("summary").trigger("click");
    expect(vm.isPanelOpen).toBe(false);
  });

  it("emits update:modelValue when summary is clicked", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "emit-test" },
    });
    await wrapper.find("summary").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
  });

  it("updates aria-expanded after toggle", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "aria-toggle" },
    });
    expect(wrapper.find("summary").attributes("aria-expanded")).toBe("false");

    await wrapper.find("summary").trigger("click");
    await nextTick();
    expect(wrapper.find("summary").attributes("aria-expanded")).toBe("true");
  });

  it("sets open attribute on <details> when panel is open", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "details-open" },
      attrs: { modelValue: true },
    });
    expect(wrapper.find("details").attributes("open")).toBeDefined();
  });

  it("does not set open attribute on <details> when panel is closed", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "details-closed" },
    });
    expect(wrapper.find("details").attributes("open")).toBeUndefined();
  });

  // ─── forceOpened ──────────────────────────────────────────────────────────

  it("hides the icon-wrapper when forceOpened is true", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "force-icon", forceOpened: true },
    });
    expect(wrapper.find(".icon-wrapper").exists()).toBe(false);
  });

  it("shows the icon-wrapper when forceOpened is false", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "icon-visible", forceOpened: false },
    });
    expect(wrapper.find(".icon-wrapper").exists()).toBe(true);
  });

  it("keeps open true after click when forceOpened is true", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "force-click", forceOpened: true },
    });
    const vm = wrapper.vm as ExpandingPanelInstance;
    await wrapper.find("summary").trigger("click");
    expect(vm.open).toBe(true);
  });

  // ─── Slots ────────────────────────────────────────────────────────────────

  it("renders summary slot content inside .label-wrapper", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "slot-summary" },
      slots: { summary: '<span data-testid="sum">My Summary</span>' },
    });
    expect(wrapper.find('[data-testid="sum"]').text()).toBe("My Summary");
  });

  it("renders content slot content inside .inner", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "slot-content" },
      slots: { content: '<p data-testid="body">My Content</p>' },
    });
    expect(wrapper.find('[data-testid="body"]').text()).toBe("My Content");
  });

  it("renders custom icon slot content inside .icon-wrapper", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "slot-icon" },
      slots: { icon: '<span data-testid="custom-icon">▸</span>' },
    });
    expect(wrapper.find('[data-testid="custom-icon"]').exists()).toBe(true);
  });

  it("renders the default icon when no icon slot is provided", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "default-icon" },
    });
    expect(wrapper.find(".icon-wrapper").exists()).toBe(true);
    expect(wrapper.find(".icon-wrapper .icon").exists()).toBe(true);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a styleClassPassthrough array to the root element", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: {
        name: "scp-array",
        styleClassPassthrough: ["custom-class", "another-class"],
      },
    });
    const root = wrapper.find(".expanding-panel");
    expect(root.classes()).toContain("custom-class");
    expect(root.classes()).toContain("another-class");
  });

  it("applies a single styleClassPassthrough string to the root element", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "scp-string", styleClassPassthrough: "single-class" },
    });
    expect(wrapper.find(".expanding-panel").classes()).toContain("single-class");
  });

  // ─── name prop / useId fallback ───────────────────────────────────────────

  it("uses the provided name in ARIA attributes", async () => {
    const wrapper = await mountSuspended(ExpandingPanel, {
      props: { name: "my-panel" },
    });
    expect(wrapper.find("summary").attributes("id")).toBe("id-my-panel-trigger");
    expect(wrapper.find(".expanding-panel-content").attributes("id")).toBe("id-my-panel-content");
  });

  it("generates ARIA ids when no name prop is supplied", async () => {
    const wrapper = await mountSuspended(ExpandingPanel);
    const summaryId = wrapper.find("summary").attributes("id") ?? "";
    const contentId = wrapper.find(".expanding-panel-content").attributes("id") ?? "";
    expect(summaryId).toMatch(/^id-.+-trigger$/);
    expect(contentId).toMatch(/^id-.+-content$/);
  });
});
