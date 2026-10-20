import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import ActionMenu from "../ActionMenu.vue";
import ActionMenuItem from "../ActionMenuItem.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

// ─── Meta ─────────────────────────────────────────────────────────────────────

interface StoryArgs {
  itemCount?: number;
  labelLineClamp?: string;
  label?: string;
  triggerIcon?: string;
  styleClassPassthrough?: string | string[];
}

const meta: Meta<StoryArgs> = {
  title: "Molecules/ActionMenu",
  component: ActionMenu,
  argTypes: {
    itemCount: {
      control: { type: "number", min: 0, max: 5, step: 1 },
      description: "**Story control, not a prop.** Number of items to show (0 to 5, the size of this data set).",
      table: { category: "Content" },
    },
    label: {
      control: { type: "text" },
      description: "Accessible label for both the trigger button and the menu list (`aria-label`)",
      table: { category: "Accessibility" },
    },
    triggerIcon: {
      control: { type: "text" },
      description: "Icon name for the trigger button",
      table: { category: "Appearance" },
    },
    labelLineClamp: {
      control: { type: "select" },
      options: ["none", "1", "2", "3"],
      description:
        "**Story control, not a prop.** Sets `--action-menu-item-label-line-clamp`. In your CSS: `.my-page { --action-menu-item-label-line-clamp: 1; }`",
      table: { category: "CSS tokens (story only, set in your CSS)" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    itemCount: 5,
    label: "Open actions menu",
    labelLineClamp: "none",
    triggerIcon: "lucide:ellipsis",
  },
  parameters: {
    docs: {
      description: {
        component:
          "An ellipsis trigger button that opens an anchored popover menu. " +
          "Populate the menu via indexed `item-{n}` slots, each containing a single `ActionMenuItem`. " +
          "Items can be buttons (omit `href`) or links (internal `/path` → NuxtLink, external URL → `<a>`). " +
          "The menu closes automatically when any item is clicked. " +
          "Set shared CSS tokens globally — see `CONSUMER-STYLING.md` in the component folder.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

// ─── Shared data ──────────────────────────────────────────────────────────────

const actionItems = [
  { label: "Edit",       icon: "lucide:pencil",   href: undefined },
  { label: "View",       icon: "lucide:eye",      href: undefined },
  { label: "Share",      icon: "lucide:share-2",  href: undefined },
  { label: "Duplicate",  icon: "lucide:copy",     href: undefined },
  { label: "Delete",     icon: "lucide:trash-2",  href: undefined },
] as const;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { itemCount: _itemCount, labelLineClamp: _labelLineClamp, ...rest } = args;
    return rest;
  });
  const tokenStyle = computed(() => ({
    "--action-menu-item-label-line-clamp": args.labelLineClamp || undefined,
  }));
  return { args, componentArgs, tokenStyle };
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Default — five button actions driven by the `itemCount` control.
 * Adjust `itemCount` in the Controls panel to see fewer items (max 5 with this
 * data set — the extra slots simply render empty).
 */
export const Default: Story = {
  args: {
    itemCount: 5,
  },
  render: (args) => ({
    components: { ActionMenu, ActionMenuItem },
    setup() {
      const { componentArgs, tokenStyle } = useStorySetup(args);
      const lastAction = ref<string | null>(null);
      const items = computed(() =>
        actionItems.slice(0, args.itemCount ?? 5).map((item, i) => ({
          ...item,
          slotName: `item-${i}`,
        }))
      );
      return { componentArgs, tokenStyle, items, lastAction };
    },
    template: `
      <div style="padding: 4rem 8rem; display: flex; flex-direction: column; align-items: flex-end; gap: 2rem;">
        <ActionMenu v-bind="componentArgs" :style="tokenStyle">
          <template v-for="item in items" :key="item.slotName" #[item.slotName]>
            <ActionMenuItem :label="item.label" @click="lastAction = item.label">
              <template #icon>
                <Icon :name="item.icon" />
              </template>
            </ActionMenuItem>
          </template>
        </ActionMenu>
        <p v-if="lastAction" style="margin: 0; font-size: 1.3rem; opacity: 0.6;">
          Last action: <strong>{{ lastAction }}</strong>
        </p>
      </div>
    `,
  }),
};

/**
 * Mixed items — demonstrates the three `ActionMenuItem` rendering modes:
 * button (no href), internal link (/path), and external link (https://…).
 */
export const MixedItems: Story = {
  name: "Mixed — Buttons and Links",
  args: {
    label: "Record actions",
  },
  render: (args) => ({
    components: { ActionMenu, ActionMenuItem },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div style="padding: 4rem 8rem; display: flex; justify-content: flex-end;">
        <ActionMenu v-bind="componentArgs" :style="tokenStyle">
          <template #item-0>
            <ActionMenuItem label="Edit record" @click="() => {}">
              <template #icon><Icon name="lucide:pencil" /></template>
            </ActionMenuItem>
          </template>
          <template #item-1>
            <ActionMenuItem label="View full profile" href="/profile/123">
              <template #icon><Icon name="lucide:user" /></template>
            </ActionMenuItem>
          </template>
          <template #item-2>
            <ActionMenuItem label="Open in new tab" href="https://example.com">
              <template #icon><Icon name="lucide:external-link" /></template>
            </ActionMenuItem>
          </template>
          <template #item-3>
            <ActionMenuItem label="Delete record" @click="() => {}">
              <template #icon><Icon name="lucide:trash-2" /></template>
            </ActionMenuItem>
          </template>
        </ActionMenu>
      </div>
    `,
  }),
};

/**
 * No icons — items with label and arrow only. Works without the icon slot.
 */
export const NoIcons: Story = {
  name: "No Icons",
  args: {},
  render: (args) => ({
    components: { ActionMenu, ActionMenuItem },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div style="padding: 4rem 8rem; display: flex; justify-content: flex-end;">
        <ActionMenu v-bind="componentArgs" :style="tokenStyle">
          <template #item-0>
            <ActionMenuItem label="Approve" @click="() => {}" />
          </template>
          <template #item-1>
            <ActionMenuItem label="Request changes" @click="() => {}" />
          </template>
          <template #item-2>
            <ActionMenuItem label="Reject" @click="() => {}" />
          </template>
        </ActionMenu>
      </div>
    `,
  }),
};

/**
 * In context — the most realistic usage: menu anchored at the trailing edge
 * of a data row inside a card. Shows how the trigger sits flush within a
 * compact layout without adding height.
 */
export const InContext: Story = {
  name: "In Context — Data Row",
  args: {
    label: "User actions",
  },
  render: (args) => ({
    components: { ActionMenu, ActionMenuItem },
    setup() {
      const users = [
        { name: "Alex Morgan",    email: "alex@example.com",    role: "Admin" },
        { name: "Sam Patel",      email: "sam@example.com",     role: "Editor" },
        { name: "Jordan Clarke",  email: "jordan@example.com",  role: "Viewer" },
      ];
      return { ...useStorySetup(args), users };
    },
    template: `
      <div style="padding: 4rem; max-width: 56rem; margin: 0 auto;">
        <div
          v-for="user in users"
          :key="user.email"
          style="
            display: flex;
            align-items: center;
            gap: 1.2rem;
            padding: 1.2rem 1.6rem;
            border-bottom: 0.1rem solid rgb(128 128 128 / 0.35);
          "
        >
          <div
            style="
              width: 3.6rem;
              height: 3.6rem;
              border-radius: 50%;
              background: rgb(128 128 128 / 0.35);
              display: grid;
              place-items: center;
              font-size: 1.4rem;
              font-weight: 600;
              flex-shrink: 0;
            "
          >
            {{ Array.from(user.name)[0] }}
          </div>
          <div style="flex: 1; min-width: 0;">
            <p style="margin: 0; font-size: 1.4rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              {{ user.name }}
            </p>
            <p style="margin: 0; font-size: 1.2rem; opacity: 0.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              {{ user.email }}
            </p>
          </div>
          <span style="font-size: 1.2rem; opacity: 0.5; white-space: nowrap;">{{ user.role }}</span>
          <ActionMenu v-bind="componentArgs" :style="tokenStyle">
            <template #item-0>
              <ActionMenuItem label="Edit user" @click="() => {}">
                <template #icon><Icon name="lucide:pencil" /></template>
              </ActionMenuItem>
            </template>
            <template #item-1>
              <ActionMenuItem label="View profile" :href="'/users/' + user.email">
                <template #icon><Icon name="lucide:user" /></template>
              </ActionMenuItem>
            </template>
            <template #item-2>
              <ActionMenuItem label="Reset password" @click="() => {}">
                <template #icon><Icon name="lucide:key" /></template>
              </ActionMenuItem>
            </template>
            <template #item-3>
              <ActionMenuItem label="Remove user" @click="() => {}">
                <template #icon><Icon name="lucide:user-minus" /></template>
              </ActionMenuItem>
            </template>
          </ActionMenu>
        </div>
      </div>
    `,
  }),
};

/**
 * ActionMenuItem — standalone view of the child component in its three
 * rendering modes (button, internal link, external link). Not an interactive
 * menu — use this story to style and test individual item rows.
 */
export const ItemCoreStandalone: Story = {
  name: "ActionMenuItem — Standalone",
  args: {},
  render: () => ({
    components: { ActionMenuItem },
    setup() {
      const lastClick = ref<string | null>(null);
      return { lastClick };
    },
    template: `
      <div style="padding: 4rem; max-width: 32rem; margin: 0 auto;">
        <p style="margin: 0 0 1.2rem; font-size: 1.2rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.08em;">Button items</p>
        <div style="border: 0.1rem solid rgb(128 128 128 / 0.35); border-radius: 0.8rem; overflow: hidden;">
          <ActionMenuItem
            label="Edit"
            style="border-bottom: 0.1rem solid rgb(128 128 128 / 0.35);"
            @click="lastClick = 'Edit'"
          >
            <template #icon><Icon name="lucide:pencil" /></template>
          </ActionMenuItem>
          <ActionMenuItem
            label="Duplicate"
            style="border-bottom: 0.1rem solid rgb(128 128 128 / 0.35);"
            @click="lastClick = 'Duplicate'"
          >
            <template #icon><Icon name="lucide:copy" /></template>
          </ActionMenuItem>
          <ActionMenuItem
            label="Delete"
            @click="lastClick = 'Delete'"
          >
            <template #icon><Icon name="lucide:trash-2" /></template>
          </ActionMenuItem>
        </div>

        <p style="margin: 2.4rem 0 1.2rem; font-size: 1.2rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.08em;">Link items</p>
        <div style="border: 0.1rem solid rgb(128 128 128 / 0.35); border-radius: 0.8rem; overflow: hidden;">
          <ActionMenuItem
            label="Internal link (/about)"
            href="/about"
            style="border-bottom: 0.1rem solid rgb(128 128 128 / 0.35);"
          >
            <template #icon><Icon name="lucide:arrow-up-right" /></template>
          </ActionMenuItem>
          <ActionMenuItem
            label="External link"
            href="https://example.com"
          >
            <template #icon><Icon name="lucide:external-link" /></template>
          </ActionMenuItem>
        </div>

        <p v-if="lastClick" style="margin: 1.6rem 0 0; font-size: 1.3rem; opacity: 0.6;">
          Clicked: <strong>{{ lastClick }}</strong>
        </p>
      </div>
    `,
  }),
};

/**
 * Stress test: hostile labels and item counts, with triggers at both inline edges.
 */
export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    label: "Aktionen für diesen Eintrag öffnen",
  },
  render: (args) => ({
    components: { ActionMenu, ActionMenuItem },
    setup() {
      const hostileLabels = [
        "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft",
        "https://example.com/" + "a-very-long-path-segment-without-spaces".repeat(3),
        "Diesen Eintrag dauerhaft löschen, einschließlich aller zugehörigen Anhänge und Kommentare",
        "🎉 Celebrate",
        "<b>Not bold</b>",
        "حذف هذا السجل نهائيا",
        "A",
      ];
      const manyItems = Array.from({ length: 12 }, (_, i) => `Action ${i + 1}`);
      return { ...useStorySetup(args), hostileLabels, manyItems };
    },
    template: `
      <div style="padding: 2.4rem 1.6rem; display: grid; gap: 4rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1.6rem;">
          <ActionMenu v-bind="componentArgs" :style="tokenStyle">
            <template v-for="(text, i) in hostileLabels" :key="i" #[\`item-\${i}\`]>
              <ActionMenuItem :label="text" @click="() => {}">
                <template #icon><Icon name="lucide:pencil" /></template>
              </ActionMenuItem>
            </template>
          </ActionMenu>
          <span>Hostile labels: left-edge trigger and right-edge trigger</span>
          <ActionMenu v-bind="componentArgs" :style="tokenStyle">
            <template v-for="(text, i) in hostileLabels" :key="i" #[\`item-\${i}\`]>
              <ActionMenuItem :label="text" href="https://example.com"></ActionMenuItem>
            </template>
          </ActionMenu>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1.6rem;">
          <span>Twelve items</span>
          <ActionMenu v-bind="componentArgs" :style="tokenStyle">
            <template v-for="(text, i) in manyItems" :key="i" #[\`item-\${i}\`]>
              <ActionMenuItem :label="text" @click="() => {}"></ActionMenuItem>
            </template>
          </ActionMenu>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1.6rem;">
          <span>One item</span>
          <ActionMenu v-bind="componentArgs" :style="tokenStyle">
            <template #item-0><ActionMenuItem label="Only action" @click="() => {}"></ActionMenuItem></template>
          </ActionMenu>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1.6rem;">
          <span>No items (opens an empty panel, nothing focusable)</span>
          <ActionMenu v-bind="componentArgs" :style="tokenStyle"></ActionMenu>
        </div>
      </div>
    `,
  }),
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "mobileCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "640px" },
      description: {
        story:
          "Open each menu at every canvas width. Long unbroken words and URLs should wrap inside the menu, which never grows past " +
          "`--action-menu-popover-max-width` (32rem, or the viewport less 3.2rem). The left-edge menu should flip to open rightwards " +
          "rather than off-screen (CSS anchor positioning browsers). Emoji and HTML-like text render as text, the Arabic label wraps like the rest, " +
          "twelve items stay keyboard-navigable, and the empty menu opens without errors. Try the line-clamp control to cap labels at 1 to 3 lines.",
      },
    },
  },
};
