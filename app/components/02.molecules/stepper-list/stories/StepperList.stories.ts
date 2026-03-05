import StepperList from "../StepperList.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof StepperList> = {
  title: "Molecules/Lists/StepperList",
  component: StepperList,
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
    indicatorAlignment: {
      control: { type: "select" },
      options: ["top", "center"],
      description: "Vertical alignment of the indicator relative to the list item content",
    },
    indicatorVariant: {
      control: { type: "select" },
      options: ["disc", "circle", "square"],
      description: "Visual style of the counter indicator",
    },
    connected: {
      control: "boolean",
      description: "Whether to show connectors between indicators (only visible in supported browsers)",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "ul",
    itemCount: 3,
    indicatorAlignment: "top",
    indicatorVariant: "disc",
    connected: false,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof StepperList>;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — counter bubbles are rendered via CSS, no indicator slots needed. */
export const Default: Story = {
  args: {
    tag: "ul",
    itemCount: 5,
    connected: false,
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">Plan your project goals and define what success looks like</p></template>
        <template #item-1><p class="page-body-normal">Set up your development environment</p></template>
        <template #item-2><p class="page-body-normal">Build core features following the sprint backlog, reviewing progress at the end of each week with the full team</p></template>
        <template #item-3><p class="page-body-normal">Write tests and review code with your team</p></template>
        <template #item-4><p class="page-body-normal">Deploy to staging, gather feedback, and iterate</p></template>
      </StepperList>
    `,
  }),
};

/** Ordered list — demonstrates the ol tag for sequentially meaningful content. */
export const OrderedList: Story = {
  name: "Ordered List (ol)",
  args: {
    tag: "ol",
    itemCount: 6,
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">Preheat the oven to 180°C</p></template>
        <template #item-1><p class="page-body-normal">Sift together the flour, baking powder, and a pinch of salt into a large bowl</p></template>
        <template #item-2><p class="page-body-normal">Cream the butter and sugar until pale and fluffy, about 3–4 minutes with an electric mixer</p></template>
        <template #item-3><p class="page-body-normal">Beat in the eggs one at a time, adding a spoonful of flour with each egg to prevent the mixture from curdling</p></template>
        <template #item-4><p class="page-body-normal">Fold in the wet ingredients until just combined — do not overmix</p></template>
        <template #item-5><p class="page-body-normal">Bake for 25–30 minutes until a skewer inserted into the centre comes out clean</p></template>
      </StepperList>
    `,
  }),
};

/** Custom indicators — icon slots replace the default CSS counter bubbles. */
export const WithCustomIndicators: Story = {
  name: "With Custom Indicator Icons",
  args: {
    tag: "ul",
    itemCount: 5,
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #indicator-0>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-0><p class="page-body-normal">Identity verified successfully</p></template>

        <template #indicator-1>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-1><p class="page-body-normal">Payment method confirmed — your card ending in 4242 is saved securely</p></template>

        <template #indicator-2>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-2><p class="page-body-normal">Billing address saved</p></template>

        <template #indicator-3>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </template>
        <template #item-3><p class="page-body-normal">Awaiting email confirmation — check your inbox and click the link we sent you to continue</p></template>

        <template #indicator-4>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </template>
        <template #item-4><p class="page-body-normal">Awaiting address confirmation</p></template>
      </StepperList>
    `,
  }),
};

/** Mixed — some items use custom indicator slots, others fall back to CSS counters. */
export const MixedIndicators: Story = {
  name: "Mixed — Icons and Counters",
  args: {
    tag: "ul",
    itemCount: 5,
    connected: true
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #indicator-0>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-0><p class="page-body-normal">Account created and email verified</p></template>

        <template #indicator-1>
          <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
        <template #item-1><p class="page-body-normal">Payment method saved — your subscription will renew automatically on the 1st of each month</p></template>

        <template #item-2><p class="page-body-normal">Awaiting profile completion</p></template>

        <template #item-3><p class="page-body-normal">Pending team invite acceptance — you invited 3 colleagues and are waiting for them to join</p></template>

        <template #item-4><p class="page-body-normal">Pending plan selection</p></template>
      </StepperList>
    `,
  }),
};

/** Indicator alignment — center alignment works well for single-line items. */
export const AlignmentCenter: Story = {
  name: "Alignment — Center",
  args: {
    tag: "ul",
    itemCount: 5,
    indicatorAlignment: "center",
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">Connect your data source</p></template>
        <template #item-1><p class="page-body-normal">Configure sync settings</p></template>
        <template #item-2><p class="page-body-normal">Map your fields</p></template>
        <template #item-3><p class="page-body-normal">Run a test import to check everything looks right</p></template>
        <template #item-4><p class="page-body-normal">Publish</p></template>
      </StepperList>
    `,
  }),
};

/** Disc variant — filled circle with solid background (default). */
export const VariantDisc: Story = {
  name: "Variant — Disc",
  args: {
    tag: "ul",
    itemCount: 5,
    indicatorVariant: "disc",
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">Research and define requirements with stakeholders</p></template>
        <template #item-1><p class="page-body-normal">Wireframe key user journeys</p></template>
        <template #item-2><p class="page-body-normal">Build interactive prototypes and gather early feedback from a representative sample of users before committing to full development</p></template>
        <template #item-3><p class="page-body-normal">Implement and test</p></template>
        <template #item-4><p class="page-body-normal">Ship and monitor</p></template>
      </StepperList>
    `,
  }),
};

/** Circle variant — transparent background with a circular border. */
export const VariantCircle: Story = {
  name: "Variant — Circle",
  args: {
    tag: "ul",
    itemCount: 5,
    indicatorVariant: "circle",
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">Research and define requirements with stakeholders</p></template>
        <template #item-1><p class="page-body-normal">Wireframe key user journeys</p></template>
        <template #item-2><p class="page-body-normal">Build interactive prototypes and gather early feedback from a representative sample of users before committing to full development</p></template>
        <template #item-3><p class="page-body-normal">Implement and test</p></template>
        <template #item-4><p class="page-body-normal">Ship and monitor</p></template>
      </StepperList>
    `,
  }),
};

/** Square variant — number with a square border and rounded corners. */
export const VariantSquare: Story = {
  name: "Variant — Square",
  args: {
    tag: "ul",
    itemCount: 5,
    indicatorVariant: "square",
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">Research and define requirements with stakeholders</p></template>
        <template #item-1><p class="page-body-normal">Wireframe key user journeys</p></template>
        <template #item-2><p class="page-body-normal">Build interactive prototypes and gather early feedback from a representative sample of users before committing to full development</p></template>
        <template #item-3><p class="page-body-normal">Implement and test</p></template>
        <template #item-4><p class="page-body-normal">Ship and monitor</p></template>
      </StepperList>
    `,
  }),
};

/** Rich content — items contain a mix of heading + body, varying in length. */
export const RichContent: Story = {
  name: "Rich Item Content",
  args: {
    tag: "ol",
    itemCount: 5,
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0>
          <div>
            <strong>Create your account</strong>
            <p class="page-body-normal" style="margin:0.25rem 0 0">Enter your email and choose a password to get started.</p>
          </div>
        </template>
        <template #item-1>
          <div>
            <strong>Verify your email</strong>
            <p class="page-body-normal" style="margin:0.25rem 0 0">Click the link we sent to your inbox. If you don't see it, check your spam folder — it should arrive within a few minutes.</p>
          </div>
        </template>
        <template #item-2>
          <div>
            <strong>Choose a plan</strong>
            <p class="page-body-normal" style="margin:0.25rem 0 0">Select from Starter, Pro, or Enterprise depending on your needs.</p>
          </div>
        </template>
        <template #item-3>
          <div>
            <strong>Invite your team</strong>
            <p class="page-body-normal" style="margin:0.25rem 0 0">Add colleagues by email so they can collaborate on your workspace.</p>
          </div>
        </template>
        <template #item-4>
          <div>
            <strong>Start building</strong>
            <p class="page-body-normal" style="margin:0.25rem 0 0">You're all set — dive into the dashboard and start your first project.</p>
          </div>
        </template>
      </StepperList>
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
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">The only item</p></template>
      </StepperList>
    `,
  }),
};

export const Empty: Story = {
  name: "Zero Items",
  args: {
    itemCount: 0,
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `<StepperList v-bind="args" />`,
  }),
};

export const WithStyleClassPassthrough: Story = {
  name: "With styleClassPassthrough",
  args: {
    itemCount: 2,
    styleClassPassthrough: ["custom-class", "another-class"],
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">First item</p></template>
        <template #item-1><p class="page-body-normal">Second item</p></template>
      </StepperList>
    `,
  }),
};
