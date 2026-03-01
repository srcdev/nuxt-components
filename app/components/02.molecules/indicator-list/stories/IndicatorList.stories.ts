import IndicatorList from "../IndicatorList.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof IndicatorList> = {
  title: "Molecules/Lists/IndicatorList",
  component: IndicatorList,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["ul", "ol"],
      description: "HTML list element to render — use ol for ordered/sequential content",
    },
    itemCount: {
      control: { type: "number", min: 0, step: 1 },
      description: "Number of list items to render",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "ul",
    itemCount: 3,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof IndicatorList>;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — counter bubbles are rendered via CSS, no indicator slots needed. */
export const Default: Story = {
  args: {
    tag: "ul",
    itemCount: 3,
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `
      <IndicatorList v-bind="args">
        <template #item-0><span>First list item</span></template>
        <template #item-1><span>Second list item</span></template>
        <template #item-2><span>Third list item</span></template>
      </IndicatorList>
    `,
  }),
};

/** Ordered list — demonstrates the ol tag for sequentially meaningful content. */
export const OrderedList: Story = {
  name: "Ordered List (ol)",
  args: {
    tag: "ol",
    itemCount: 4,
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `
      <IndicatorList v-bind="args">
        <template #item-0><span>Preheat the oven to 180°C</span></template>
        <template #item-1><span>Mix the dry ingredients together</span></template>
        <template #item-2><span>Fold in the wet ingredients until just combined</span></template>
        <template #item-3><span>Bake for 25–30 minutes until golden</span></template>
      </IndicatorList>
    `,
  }),
};

/** Custom indicators — icon slots replace the default CSS counter bubbles. */
export const WithCustomIndicators: Story = {
  name: "With Custom Indicator Icons",
  args: {
    tag: "ul",
    itemCount: 3,
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `
      <IndicatorList v-bind="args">
        <template #indicator-0>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-0><span>Identity verified successfully</span></template>

        <template #indicator-1>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-1><span>Payment method confirmed</span></template>

        <template #indicator-2>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </template>
        <template #item-2><span>Awaiting address confirmation</span></template>
      </IndicatorList>
    `,
  }),
};

/** Mixed — some items use custom indicator slots, others fall back to CSS counters. */
export const MixedIndicators: Story = {
  name: "Mixed — Icons and Counters",
  args: {
    tag: "ul",
    itemCount: 4,
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `
      <IndicatorList v-bind="args">
        <template #indicator-0>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-0><span>Completed — icon indicator</span></template>

        <template #item-1><span>Pending — CSS counter fallback</span></template>

        <template #indicator-2>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-2><span>Completed — icon indicator</span></template>

        <template #item-3><span>Pending — CSS counter fallback</span></template>
      </IndicatorList>
    `,
  }),
};

/** Rich content — items contain more than a single line of text. */
export const RichContent: Story = {
  name: "Rich Item Content",
  args: {
    tag: "ol",
    itemCount: 3,
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `
      <IndicatorList v-bind="args">
        <template #item-0>
          <div>
            <strong>Create your account</strong>
            <p style="margin:0.25rem 0 0">Enter your email and choose a password to get started.</p>
          </div>
        </template>
        <template #item-1>
          <div>
            <strong>Choose a plan</strong>
            <p style="margin:0.25rem 0 0">Select from Starter, Pro, or Enterprise depending on your needs.</p>
          </div>
        </template>
        <template #item-2>
          <div>
            <strong>Start building</strong>
            <p style="margin:0.25rem 0 0">You're all set — dive into the dashboard and start your first project.</p>
          </div>
        </template>
      </IndicatorList>
    `,
  }),
};

export const SingleItem: Story = {
  name: "Single Item",
  args: {
    tag: "ul",
    itemCount: 1,
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `
      <IndicatorList v-bind="args">
        <template #item-0><span>The only item</span></template>
      </IndicatorList>
    `,
  }),
};

export const Empty: Story = {
  name: "Zero Items",
  args: {
    itemCount: 0,
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `<IndicatorList v-bind="args" />`,
  }),
};

export const WithStyleClassPassthrough: Story = {
  name: "With styleClassPassthrough",
  args: {
    itemCount: 2,
    styleClassPassthrough: ["custom-class", "another-class"],
  },
  render: (args) => ({
    components: { IndicatorList },
    setup() {
      return { args };
    },
    template: `
      <IndicatorList v-bind="args">
        <template #item-0><span>First item</span></template>
        <template #item-1><span>Second item</span></template>
      </IndicatorList>
    `,
  }),
};
