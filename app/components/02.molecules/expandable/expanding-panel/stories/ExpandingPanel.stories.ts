import ExpandingPanel from "../ExpandingPanel.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ExpandingPanel> = {
  title: "Molecules/Expandable/Expanding Panel",
  component: ExpandingPanel,
  argTypes: {
    name: {
      control: { type: "text" },
      description:
        "Unique name used for ARIA attributes and to group panels in a native <details> accordion",
    },
    animationDuration: {
      control: { type: "number", min: 0, step: 50 },
      description: "Expand/collapse animation duration in milliseconds",
    },
    forceOpened: {
      control: { type: "boolean" },
      description: "When true, the panel is always open and the toggle icon is hidden",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    name: "panel-demo",
    animationDuration: 400,
    forceOpened: false,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof ExpandingPanel>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Panel Summary</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            This is the panel content. It can contain any markup — text, images, or components.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const InitiallyOpen: Story = {
  name: "Initially Open",
  args: {
    name: "initially-open",
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <ExpandingPanel v-bind="args" v-model="isOpen">
        <template #summary>
          <span>This panel starts open</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            The panel was opened via v-model on mount.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const ForceOpened: Story = {
  name: "Force Opened",
  args: {
    name: "force-opened",
    forceOpened: true,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Always open — toggle icon hidden</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            When <code>forceOpened</code> is true the panel stays open and the icon is not rendered.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const CustomIcon: Story = {
  name: "Custom Icon",
  args: {
    name: "custom-icon",
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Panel with a custom icon</span>
        </template>
        <template #icon>
          <span style="font-size:1.2rem">＋</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            Replace the default caret with any element via the <code>icon</code> slot.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const SlowAnimation: Story = {
  name: "Slow Animation (800ms)",
  args: {
    name: "slow-animation",
    animationDuration: 800,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Slow animation panel</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            The expand/collapse transition runs over 800 ms.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const NoAnimation: Story = {
  name: "No Animation (0ms)",
  args: {
    name: "no-animation",
    animationDuration: 0,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Instant toggle</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            The panel opens and closes with no transition.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const RichContent: Story = {
  name: "Rich Slot Content",
  args: {
    name: "rich-content",
    animationDuration: 400,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <strong>Materials &amp; Care</strong>
        </template>
        <template #content>
          <ul style="margin:0;padding:0.5rem 0 0.5rem 1.2rem">
            <li>100% organic cotton</li>
            <li>Machine wash at 30°C</li>
            <li>Do not tumble dry</li>
            <li>Iron on low heat</li>
          </ul>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const WithStyleClassPassthrough: Story = {
  name: "With styleClassPassthrough",
  args: {
    name: "style-passthrough",
    styleClassPassthrough: ["custom-class", "another-class"],
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Custom classes applied to root</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            Inspect the root element to see <code>custom-class</code> and <code>another-class</code>.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};
