import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { defineComponent, nextTick, ref } from "vue";
import AccordionChat from "../AccordionChat.vue";

const twoItems = {
  "item-0-summary": "<span>Question 0</span>",
  "item-0-content": "<p class='answer-0'>Answer 0</p>",
  "item-1-summary": "<span>Question 1</span>",
  "item-1-content": "<p class='answer-1'>Answer 1</p>",
};

describe("AccordionChat", () => {
  let wrapper: VueWrapper | undefined;

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  // ─── Mount and root ───────────────────────────────────────────────────────

  it("mounts with the accordion-chat root class", async () => {
    wrapper = await mountSuspended(AccordionChat, { slots: twoItems });
    expect(wrapper.classes()).toContain("accordion-chat");
  });

  it("renders correct HTML structure", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      props: { name: "faq", avatarLabel: "AM" },
      slots: twoItems,
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Panels inferred from slots ───────────────────────────────────────────

  it("renders one panel per item-{n}-summary slot", async () => {
    wrapper = await mountSuspended(AccordionChat, { slots: twoItems });
    expect(wrapper.findAll(".accordion-chat-item")).toHaveLength(2);
  });

  it("renders gapped indexes in numeric order and ignores orphan content", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      slots: {
        "item-7-summary": "<span>Seven</span>",
        "item-2-summary": "<span>Two</span>",
        "item-4-content": "<p>Orphan</p>",
      },
    });
    expect(wrapper.findAll("summary").map((s) => s.text())).toEqual(["Two", "Seven"]);
    expect(wrapper.text()).not.toContain("Orphan");
  });

  it("adds a panel when a summary slot appears after mount", async () => {
    const Host = defineComponent({
      components: { AccordionChat },
      setup() {
        const showSecond = ref(false);
        return { showSecond };
      },
      template: `
        <AccordionChat>
          <template #item-0-summary>First</template>
          <template v-if="showSecond" #item-1-summary>Second</template>
        </AccordionChat>
      `,
    });
    wrapper = await mountSuspended(Host);
    expect(wrapper.findAll(".accordion-chat-item")).toHaveLength(1);
    (wrapper.vm as unknown as { showSecond: boolean }).showSecond = true;
    await nextTick();
    expect(wrapper.findAll(".accordion-chat-item")).toHaveLength(2);
  });

  // ─── Bubbles ──────────────────────────────────────────────────────────────

  it("puts the summary in the question bubble and the content in the answer bubble", async () => {
    wrapper = await mountSuspended(AccordionChat, { slots: twoItems });
    const second = wrapper.findAll(".accordion-chat-item")[1]!;
    expect(second.find("summary").text()).toContain("Question 1");
    expect(second.find(".accordion-chat-bubble .answer-1").exists()).toBe(true);
  });

  it("renders no answer bubble for a panel without a content slot", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      props: { avatarLabel: "A" },
      slots: { "item-0-summary": "<span>No answer</span>" },
    });
    expect(wrapper.find(".accordion-chat-answer").exists()).toBe(false);
  });

  it("shows the default plus icon, and an item-{n}-icon slot replaces it", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      slots: { ...twoItems, "item-1-icon": "<span class='custom-icon'>?</span>" },
    });
    const [first, second] = wrapper.findAll(".accordion-chat-item");
    expect(first!.find(".accordion-chat-icon").attributes("aria-hidden")).toBe("true");
    expect(second!.find(".accordion-chat-icon").exists()).toBe(false);
    expect(second!.find(".custom-icon").exists()).toBe(true);
  });

  // ─── Avatar precedence ────────────────────────────────────────────────────

  it("uses the avatarLabel when no avatar slot is given", async () => {
    wrapper = await mountSuspended(AccordionChat, { props: { avatarLabel: "S" }, slots: twoItems });
    expect(wrapper.findAll(".accordion-chat-avatar").map((a) => a.text())).toEqual(["S", "S"]);
  });

  it("prefers the group #avatar slot over the label", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      props: { avatarLabel: "S" },
      slots: { ...twoItems, avatar: "<span class='group-avatar'>G</span>" },
    });
    expect(wrapper.findAll(".accordion-chat-avatar .group-avatar")).toHaveLength(2);
    expect(wrapper.find(".accordion-chat-avatar").text()).toBe("G");
  });

  it("prefers a per-panel avatar slot over the group slot", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      slots: {
        ...twoItems,
        avatar: "<span class='group-avatar'>G</span>",
        "item-1-avatar": "<span class='panel-avatar'>P</span>",
      },
    });
    const avatars = wrapper.findAll(".accordion-chat-avatar");
    expect(avatars[0]!.find(".group-avatar").exists()).toBe(true);
    expect(avatars[1]!.find(".panel-avatar").exists()).toBe(true);
    expect(avatars[1]!.find(".group-avatar").exists()).toBe(false);
  });

  it("renders no avatar column when there is no slot and no label", async () => {
    wrapper = await mountSuspended(AccordionChat, { slots: twoItems });
    expect(wrapper.find(".accordion-chat-avatar").exists()).toBe(false);
  });

  it("only gives an avatar to the panel that has its own avatar slot", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      slots: { ...twoItems, "item-0-avatar": "<span>P</span>" },
    });
    const [first, second] = wrapper.findAll(".accordion-chat-item");
    expect(first!.find(".accordion-chat-avatar").exists()).toBe(true);
    expect(second!.find(".accordion-chat-avatar").exists()).toBe(false);
  });

  it("removes the avatar column when showAvatar is false", async () => {
    wrapper = await mountSuspended(AccordionChat, {
      props: { avatarLabel: "S", showAvatar: false },
      slots: { ...twoItems, avatar: "<span>G</span>" },
    });
    expect(wrapper.find(".accordion-chat-avatar").exists()).toBe(false);
  });

  it("hides the avatar from assistive tech", async () => {
    wrapper = await mountSuspended(AccordionChat, { props: { avatarLabel: "S" }, slots: twoItems });
    expect(wrapper.find(".accordion-chat-avatar").attributes("aria-hidden")).toBe("true");
  });

  it.each([
    ["Alexandra", "Al"],
    ["  Sam ", "Sa"],
    ["👩‍🔬 Lab", "👩‍🔬 "],
    ["N", "N"],
  ])("trims avatarLabel %j to two characters", async (avatarLabel, expected) => {
    wrapper = await mountSuspended(AccordionChat, { props: { avatarLabel }, slots: twoItems });
    expect(wrapper.find(".accordion-chat-avatar").text()).toBe(expected.trim());
  });

  // ─── Panel behaviour from ExpandingPanelClassic ───────────────────────────

  it("gives every panel's <details> the shared name", async () => {
    wrapper = await mountSuspended(AccordionChat, { props: { name: "faq" }, slots: twoItems });
    expect(wrapper.findAll("details").map((d) => d.attributes("name"))).toEqual(["faq", "faq"]);
  });

  it("keeps the panel's aria-expanded and unique aria-controls pairing", async () => {
    wrapper = await mountSuspended(AccordionChat, { props: { name: "faq" }, slots: twoItems });
    const summaries = wrapper.findAll("summary");
    expect(summaries.map((s) => s.attributes("aria-expanded"))).toEqual(["false", "false"]);
    const ids = wrapper.findAll("[id]").map((el) => el.attributes("id"));
    expect(new Set(ids).size).toBe(ids.length);
    for (const summary of summaries) {
      const region = wrapper.find(`[id="${summary.attributes("aria-controls")}"]`);
      expect(region.attributes("aria-labelledby")).toBe(summary.attributes("id"));
    }
  });

  it("toggles aria-expanded when a question is clicked", async () => {
    wrapper = await mountSuspended(AccordionChat, { slots: twoItems });
    await wrapper.find("summary").trigger("click");
    expect(wrapper.find("summary").attributes("aria-expanded")).toBe("true");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies and updates styleClassPassthrough classes on the root", async () => {
    wrapper = await mountSuspended(AccordionChat, { props: { styleClassPassthrough: ["faq"] } });
    expect(wrapper.classes()).toContain("faq");
    await wrapper.setProps({ styleClassPassthrough: ["help"] });
    expect(wrapper.classes()).not.toContain("faq");
    expect(wrapper.classes()).toContain("help");
  });
});
