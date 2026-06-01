import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import ActionMenu from "../ActionMenu.vue";
import ActionMenuItemCore from "../ActionMenuItemCore.vue";

// ─── Meta ─────────────────────────────────────────────────────────────────────

interface StoryArgs {
  itemCount?: number;
  label?: string;
  styleClassPassthrough?: string | string[];
}

const meta: Meta<StoryArgs> = {
  title: "Molecules/ActionMenu",
  component: ActionMenu,
  argTypes: {
    itemCount: {
      control: { type: "number", min: 0, max: 8, step: 1 },
      description: "Number of items to show (story control — not a component prop)",
      table: { category: "Content" },
    },
    label: {
      control: { type: "text" },
      description: "Accessible label for both the trigger button and the menu list (`aria-label`)",
      table: { category: "Accessibility" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    itemCount: 5,
    label: "Open actions menu",
  },
  parameters: {
    docs: {
      description: {
        component:
          "An ellipsis trigger button that opens an anchored popover menu. " +
          "Populate the menu via indexed `item-{n}` slots, each containing a single `ActionMenuItemCore`. " +
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
    components: { ActionMenu, ActionMenuItemCore },
    setup() {
      const { itemCount, ...componentArgs } = args;
      const lastAction = ref<string | null>(null);
      const items = computed(() =>
        actionItems.slice(0, itemCount ?? 5).map((item, i) => ({
          ...item,
          slotName: `item-${i}`,
        }))
      );
      return { componentArgs, items, lastAction };
    },
    template: `
      <div style="padding: 4rem 8rem; display: flex; flex-direction: column; align-items: flex-end; gap: 2rem;">
        <ActionMenu v-bind="componentArgs">
          <template v-for="item in items" :key="item.slotName" #[item.slotName]>
            <ActionMenuItemCore :label="item.label" @click="lastAction = item.label">
              <template #icon>
                <Icon :name="item.icon" />
              </template>
            </ActionMenuItemCore>
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
 * Mixed items — demonstrates the three `ActionMenuItemCore` rendering modes:
 * button (no href), internal link (/path), and external link (https://…).
 */
export const MixedItems: Story = {
  name: "Mixed — Buttons and Links",
  args: {
    label: "Record actions",
  },
  render: (args) => ({
    components: { ActionMenu, ActionMenuItemCore },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 4rem 8rem; display: flex; justify-content: flex-end;">
        <ActionMenu v-bind="args">
          <template #item-0>
            <ActionMenuItemCore label="Edit record" @click="() => {}">
              <template #icon><Icon name="lucide:pencil" /></template>
            </ActionMenuItemCore>
          </template>
          <template #item-1>
            <ActionMenuItemCore label="View full profile" href="/profile/123">
              <template #icon><Icon name="lucide:user" /></template>
            </ActionMenuItemCore>
          </template>
          <template #item-2>
            <ActionMenuItemCore label="Open in new tab" href="https://example.com">
              <template #icon><Icon name="lucide:external-link" /></template>
            </ActionMenuItemCore>
          </template>
          <template #item-3>
            <ActionMenuItemCore label="Delete record" @click="() => {}">
              <template #icon><Icon name="lucide:trash-2" /></template>
            </ActionMenuItemCore>
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
    components: { ActionMenu, ActionMenuItemCore },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 4rem 8rem; display: flex; justify-content: flex-end;">
        <ActionMenu v-bind="args">
          <template #item-0>
            <ActionMenuItemCore label="Approve" @click="() => {}" />
          </template>
          <template #item-1>
            <ActionMenuItemCore label="Request changes" @click="() => {}" />
          </template>
          <template #item-2>
            <ActionMenuItemCore label="Reject" @click="() => {}" />
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
    components: { ActionMenu, ActionMenuItemCore },
    setup() {
      const users = [
        { name: "Alex Morgan",    email: "alex@example.com",    role: "Admin" },
        { name: "Sam Patel",      email: "sam@example.com",     role: "Editor" },
        { name: "Jordan Clarke",  email: "jordan@example.com",  role: "Viewer" },
      ];
      return { args, users };
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
            border-bottom: 0.1rem solid light-dark(#e5e7eb, #374151);
          "
        >
          <div
            style="
              width: 3.6rem;
              height: 3.6rem;
              border-radius: 50%;
              background: light-dark(#e5e7eb, #374151);
              display: grid;
              place-items: center;
              font-size: 1.4rem;
              font-weight: 600;
              flex-shrink: 0;
            "
          >
            {{ user.name[0] }}
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
          <ActionMenu v-bind="args">
            <template #item-0>
              <ActionMenuItemCore label="Edit user" @click="() => {}">
                <template #icon><Icon name="lucide:pencil" /></template>
              </ActionMenuItemCore>
            </template>
            <template #item-1>
              <ActionMenuItemCore label="View profile" :href="'/users/' + user.email">
                <template #icon><Icon name="lucide:user" /></template>
              </ActionMenuItemCore>
            </template>
            <template #item-2>
              <ActionMenuItemCore label="Reset password" @click="() => {}">
                <template #icon><Icon name="lucide:key" /></template>
              </ActionMenuItemCore>
            </template>
            <template #item-3>
              <ActionMenuItemCore label="Remove user" @click="() => {}">
                <template #icon><Icon name="lucide:user-minus" /></template>
              </ActionMenuItemCore>
            </template>
          </ActionMenu>
        </div>
      </div>
    `,
  }),
};

/**
 * ActionMenuItemCore — standalone view of the child component in its three
 * rendering modes (button, internal link, external link). Not an interactive
 * menu — use this story to style and test individual item rows.
 */
export const ItemCoreStandalone: Story = {
  name: "ActionMenuItemCore — Standalone",
  args: {},
  render: () => ({
    components: { ActionMenuItemCore },
    setup() {
      const lastClick = ref<string | null>(null);
      return { lastClick };
    },
    template: `
      <div style="padding: 4rem; max-width: 32rem; margin: 0 auto;">
        <p style="margin: 0 0 1.2rem; font-size: 1.2rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.08em;">Button items</p>
        <div style="border: 0.1rem solid light-dark(#e5e7eb, #374151); border-radius: 0.8rem; overflow: hidden;">
          <ActionMenuItemCore
            label="Edit"
            style="border-bottom: 0.1rem solid light-dark(#e5e7eb, #374151);"
            @click="lastClick = 'Edit'"
          >
            <template #icon><Icon name="lucide:pencil" /></template>
          </ActionMenuItemCore>
          <ActionMenuItemCore
            label="Duplicate"
            style="border-bottom: 0.1rem solid light-dark(#e5e7eb, #374151);"
            @click="lastClick = 'Duplicate'"
          >
            <template #icon><Icon name="lucide:copy" /></template>
          </ActionMenuItemCore>
          <ActionMenuItemCore
            label="Delete"
            @click="lastClick = 'Delete'"
          >
            <template #icon><Icon name="lucide:trash-2" /></template>
          </ActionMenuItemCore>
        </div>

        <p style="margin: 2.4rem 0 1.2rem; font-size: 1.2rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.08em;">Link items</p>
        <div style="border: 0.1rem solid light-dark(#e5e7eb, #374151); border-radius: 0.8rem; overflow: hidden;">
          <ActionMenuItemCore
            label="Internal link (/about)"
            href="/about"
            style="border-bottom: 0.1rem solid light-dark(#e5e7eb, #374151);"
          >
            <template #icon><Icon name="lucide:arrow-up-right" /></template>
          </ActionMenuItemCore>
          <ActionMenuItemCore
            label="External link"
            href="https://example.com"
          >
            <template #icon><Icon name="lucide:external-link" /></template>
          </ActionMenuItemCore>
        </div>

        <p v-if="lastClick" style="margin: 1.6rem 0 0; font-size: 1.3rem; opacity: 0.6;">
          Clicked: <strong>{{ lastClick }}</strong>
        </p>
      </div>
    `,
  }),
};
