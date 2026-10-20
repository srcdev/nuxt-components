import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, nextTick, ref } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import AccordionGroup from "../AccordionGroup.vue";

type Wrapper = VueWrapper;

const threeItems = {
  "item-0-summary": "<span>Summary 0</span>",
  "item-0-content": "<p>Content 0</p>",
  "item-1-summary": "<span>Summary 1</span>",
  "item-1-content": "<p>Content 1</p>",
  "item-2-summary": "<span>Summary 2</span>",
  "item-2-content": "<p>Content 2</p>",
};

describe("AccordionGroup", () => {
  let wrapper: Wrapper | undefined;

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  // ─── Mount and root ───────────────────────────────────────────────────────

  it("mounts without error", async () => {
    wrapper = await mountSuspended(AccordionGroup, { slots: threeItems });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    wrapper = await mountSuspended(AccordionGroup, {
      props: { name: "faq" },
      slots: { ...threeItems, "item-1-icon": "<span>+</span>" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("has the accordion-group root class", async () => {
    wrapper = await mountSuspended(AccordionGroup);
    expect(wrapper.classes()).toContain("accordion-group");
  });

  // ─── Panel count inferred from slots ──────────────────────────────────────

  it("renders one panel per item-{n}-summary slot", async () => {
    wrapper = await mountSuspended(AccordionGroup, { slots: threeItems });
    expect(wrapper.findAll(".accordion-group-item")).toHaveLength(3);
  });

  it("renders no panels when no summary slots are given", async () => {
    wrapper = await mountSuspended(AccordionGroup);
    expect(wrapper.findAll(".accordion-group-item")).toHaveLength(0);
  });

  it("ignores icon and content slots that have no matching summary", async () => {
    wrapper = await mountSuspended(AccordionGroup, {
      slots: { "item-0-summary": "<span>Only</span>", "item-5-content": "<p>Orphan</p>", "item-6-icon": "<span>!</span>" },
    });
    expect(wrapper.findAll(".accordion-group-item")).toHaveLength(1);
    expect(wrapper.text()).not.toContain("Orphan");
  });

  it("renders gapped indexes in numeric order", async () => {
    wrapper = await mountSuspended(AccordionGroup, {
      slots: {
        "item-10-summary": "<span>Ten</span>",
        "item-2-summary": "<span>Two</span>",
        "item-0-summary": "<span>Zero</span>",
      },
    });
    const summaries = wrapper.findAll(".accordion-group-item summary").map((s) => s.text());
    expect(summaries).toEqual(["Zero", "Two", "Ten"]);
  });

  it("adds a panel when a summary slot appears after mount", async () => {
    const Host = defineComponent({
      components: { AccordionGroup },
      setup() {
        const showSecond = ref(false);
        return { showSecond };
      },
      template: `
        <AccordionGroup>
          <template #item-0-summary>First</template>
          <template v-if="showSecond" #item-1-summary>Second</template>
        </AccordionGroup>
      `,
    });
    wrapper = await mountSuspended(Host);
    expect(wrapper.findAll(".accordion-group-item")).toHaveLength(1);
    (wrapper.vm as unknown as { showSecond: boolean }).showSecond = true;
    await nextTick();
    expect(wrapper.findAll(".accordion-group-item")).toHaveLength(2);
  });

  // ─── Slot content ─────────────────────────────────────────────────────────

  it("places summary and content in the matching panel", async () => {
    wrapper = await mountSuspended(AccordionGroup, { slots: threeItems });
    const second = wrapper.findAll(".accordion-group-item")[1]!;
    expect(second.find("summary").text()).toContain("Summary 1");
    expect(second.text()).toContain("Content 1");
  });

  it("keeps the panel's default caret when no icon slot is given", async () => {
    wrapper = await mountSuspended(AccordionGroup, { slots: threeItems });
    expect(wrapper.findAll(".accordion-group-item .icon-wrapper svg, .accordion-group-item .icon-wrapper .icon")).not.toHaveLength(0);
  });

  it("replaces the caret with the item's icon slot", async () => {
    wrapper = await mountSuspended(AccordionGroup, {
      slots: { "item-0-summary": "<span>S</span>", "item-0-icon": "<span class='custom-icon'>+</span>" },
    });
    const iconWrapper = wrapper.find(".accordion-group-item .icon-wrapper");
    expect(iconWrapper.find(".custom-icon").exists()).toBe(true);
    expect(iconWrapper.find(".icon").exists()).toBe(false);
  });

  // ─── Props forwarded to panels ────────────────────────────────────────────

  it("renders ExpandingPanelClassic by default", async () => {
    wrapper = await mountSuspended(AccordionGroup, { slots: threeItems });
    expect(wrapper.findAll(".accordion-group-item.expanding-panel-classic")).toHaveLength(3);
  });

  it("renders ExpandingPanel when variant='modern'", async () => {
    wrapper = await mountSuspended(AccordionGroup, { props: { variant: "modern" }, slots: threeItems });
    expect(wrapper.findAll(".accordion-group-item.expanding-panel")).toHaveLength(3);
    expect(wrapper.findAll(".expanding-panel-classic")).toHaveLength(0);
  });

  it("gives every panel's <details> the shared name", async () => {
    wrapper = await mountSuspended(AccordionGroup, { props: { name: "faq" }, slots: threeItems });
    const names = wrapper.findAll("details").map((d) => d.attributes("name"));
    expect(names).toEqual(["faq", "faq", "faq"]);
  });

  it("gives each panel unique ids even when they share a name", async () => {
    wrapper = await mountSuspended(AccordionGroup, { props: { name: "faq" }, slots: threeItems });
    const ids = wrapper.findAll("[id]").map((el) => el.attributes("id"));
    expect(new Set(ids).size).toBe(ids.length);
    for (const summary of wrapper.findAll("summary")) {
      const contentId = summary.attributes("aria-controls")!;
      expect(wrapper.find(`[id="${contentId}"]`).attributes("aria-labelledby")).toBe(summary.attributes("id"));
    }
  });

  it("passes only declared props to the panels (no stray attributes)", async () => {
    wrapper = await mountSuspended(AccordionGroup, { slots: threeItems });
    const panel = wrapper.find(".accordion-group-item");
    expect(panel.attributes("icon-size")).toBeUndefined();
    expect(panel.attributes("animation-duration")).toBeUndefined();
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies styleClassPassthrough classes to the root", async () => {
    wrapper = await mountSuspended(AccordionGroup, { props: { styleClassPassthrough: ["faq", "compact"] } });
    expect(wrapper.classes()).toContain("faq");
    expect(wrapper.classes()).toContain("compact");
  });

  it("updates classes when styleClassPassthrough changes", async () => {
    wrapper = await mountSuspended(AccordionGroup, { props: { styleClassPassthrough: ["faq"] } });
    await wrapper.setProps({ styleClassPassthrough: ["compact"] });
    expect(wrapper.classes()).not.toContain("faq");
    expect(wrapper.classes()).toContain("compact");
  });
});
