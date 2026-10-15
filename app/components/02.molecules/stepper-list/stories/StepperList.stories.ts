import { computed } from "vue";
import StepperList from "../StepperList.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const serviceDetailNote = `
  <p style="${storyNoteStyle}">
    ServiceDetail renders its process steps as a circle-variant StepperList fed from CMS data: open the
    <a href="/?path=/story/organisms-services-service-detail--default" target="_top">ServiceDetail</a> story.
  </p>
`;

const meta: Meta<typeof StepperList> = {
  title: "Molecules/Lists/StepperList",
  component: StepperList,
  parameters: {
    docs: {
      description: {
        component:
          "A list of steps, each with an indicator and a content area. `itemCount` sets how many rows render; fill them with the zero-indexed `#item-{n}` slots. Each row shows an auto-numbered counter bubble (`indicatorVariant`: disc, circle or square; `indicatorSize`) unless an `#indicator-{n}` slot replaces it. `connected` draws a line between indicators. Used by [ServiceDetail](?path=/story/organisms-services-service-detail--default) for its process steps.",
      },
    },
  },
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
    indicatorSize: {
      control: "text",
      description: "Size of the indicator bubble — any valid CSS length (e.g. '3rem', '40px')",
    },
    connected: {
      control: "boolean",
      description: "Draws a vertical line between indicators, positioned from measured indicator sizes",
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
    indicatorSize: "3rem",
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
      ${serviceDetailNote}
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
      ${serviceDetailNote}
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
      ${serviceDetailNote}
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
      ${serviceDetailNote}
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
      ${serviceDetailNote}
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

type ConnectorGapArgs = InstanceType<typeof StepperList>["$props"] & { connectorGap: string };

export const ConnectorGap: StoryObj<ConnectorGapArgs> = {
  name: "Connector Gap",
  argTypes: {
    connectorGap: {
      name: "Connector gap",
      control: "select",
      options: ["0", "0.2rem", "0.4rem", "0.6rem", "0.8rem", "1.2rem"],
      description:
        "**Story control, not a prop.** Sets the `--stepper-list-connector-gap` CSS token so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.how-it-works { --stepper-list-connector-gap: 0.6rem; }`. " +
        "`0` (the default) makes the line touch both indicators.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "0" } },
    },
  },
  args: {
    tag: "ol",
    itemCount: 5,
    connected: true,
    indicatorAlignment: "center",
    connectorGap: "0.6rem",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`--stepper-list-connector-gap` leaves a space between each end of the connector line and the indicators it joins. It defaults to `0`, where the line touches both indicators. The Connector gap control sets that CSS token on a wrapper; it isn't a prop.",
      },
    },
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      const componentArgs = computed(() => {
        const { connectorGap: _connectorGap, ...rest } = args;
        return rest;
      });
      const tokenStyles = computed(() => ({ "--stepper-list-connector-gap": args.connectorGap }));
      return { componentArgs, tokenStyles };
    },
    template: `
      ${serviceDetailNote}
      <div :style="tokenStyles">
        <StepperList v-bind="componentArgs">
          <template #item-0><p class="page-body-normal">Connect your data source</p></template>
          <template #item-1><p class="page-body-normal">Configure sync settings</p></template>
          <template #item-2><p class="page-body-normal">Map your fields</p></template>
          <template #item-3><p class="page-body-normal">Run a test import to check everything looks right</p></template>
          <template #item-4><p class="page-body-normal">Publish</p></template>
        </StepperList>
      </div>
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
      ${serviceDetailNote}
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
      ${serviceDetailNote}
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
      ${serviceDetailNote}
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

/** Custom indicator size — demonstrates a larger indicator bubble. */
export const CustomIndicatorSize: Story = {
  name: "Custom Indicator Size",
  args: {
    tag: "ul",
    itemCount: 4,
    indicatorSize: "5rem",
    connected: true,
    indicatorAlignment: "center",
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args };
    },
    template: `
      ${serviceDetailNote}
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">Create your account</p></template>
        <template #item-1><p class="page-body-normal">Verify your email and complete your profile with a photo, bio, and preferred contact details</p></template>
        <template #item-2><p class="page-body-normal">Choose a plan</p></template>
        <template #item-3><p class="page-body-normal">Start building</p></template>
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
      ${serviceDetailNote}
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
      ${serviceDetailNote}
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
    template: `${serviceDetailNote}<StepperList v-bind="args" />`,
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
      ${serviceDetailNote}
      <StepperList v-bind="args">
        <template #item-0><p class="page-body-normal">First item</p></template>
        <template #item-1><p class="page-body-normal">Second item</p></template>
      </StepperList>
    `,
  }),
};

// ─── Styled demo ──────────────────────────────────────────────────────────────

type TimelineState = "done" | "current" | "upcoming";

const timelineStateLabels: Record<TimelineState, string> = {
  done: "Done",
  current: "In progress",
  upcoming: "Up next",
};

const timelineSteps: { state: TimelineState; title: string; body: string }[] = [
  { state: "done", title: "Create your account", body: "Enter your email and choose a password to get started." },
  {
    state: "current",
    title: "Verify your email",
    body: "Click the link we sent to your inbox. If you don't see it, check your spam folder: it should arrive within a few minutes.",
  },
  { state: "upcoming", title: "Choose a plan", body: "Select from Starter, Pro, or Enterprise depending on your needs." },
  { state: "upcoming", title: "Invite your team", body: "Add colleagues by email so they can collaborate on your workspace." },
  { state: "upcoming", title: "Start building", body: "You're all set. Dive into the dashboard and start your first project." },
];

const timelineCss = `
  .stepper-timeline-demo {
    background: #16171b;
    color: #e8e9ec;
    padding: 4rem 3.2rem;
    border-radius: 1.2rem;
  }

  .stepper-list.stepper-timeline {
    --stepper-list-gap: 3.2rem;
    --stepper-list-padding-block: 2rem;
    --stepper-list-connector-width: 0.2rem;
    --stepper-list-connector-color: transparent;
    --stepper-list-connector-image: repeating-linear-gradient(to bottom, #3a3d45 0 0.2rem, transparent 0.2rem 0.6rem);
    margin: 0;

    .stepper-list-item:has(.stepper-timeline-marker.is-done) {
      --stepper-list-connector-image: repeating-linear-gradient(to bottom, #00c8d7 0 0.4rem, transparent 0.4rem 0.7rem);
    }

    .stepper-timeline-marker {
      display: grid;
      place-items: center;
      inline-size: 3.2rem;
      block-size: 3.2rem;
      margin-block-start: -0.6rem;

      &::before {
        content: "";
        inline-size: 2.2rem;
        block-size: 2.2rem;
        rotate: 45deg;
        border: 0.2rem solid #4a4d55;
        background: transparent;
      }

      &.is-done::before {
        border-color: #00c8d7;
        background: #00c8d7;
      }

      &.is-current::before {
        border-color: #00c8d7;
        background: #16171b;
        box-shadow: 0 0 0 0.4rem rgb(0 200 215 / 0.15), 0 0 1.6rem 0.2rem rgb(0 200 215 / 0.45);
      }
    }

    .stepper-timeline-eyebrow {
      margin: 0 0 0.6rem;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: var(--step-4);
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #8a8d96;
    }

    .stepper-timeline-title {
      margin: 0 0 0.8rem;
      font-size: 2.2rem;
      font-weight: 600;
      line-height: 1.2;
      color: #ffffff;
    }

    .stepper-timeline-body {
      margin: 0;
      font-size: 1.6rem;
      line-height: 1.5;
      color: #a6a9b2;
    }

    .stepper-list-item:has(.is-current) .stepper-timeline-eyebrow {
      color: #00c8d7;
    }

    .stepper-list-item:has(.is-upcoming) .stepper-list-content {
      opacity: 0.45;
    }
  }
`;

export const TimelineDemo: Story = {
  name: "Timeline (styled demo)",
  args: {
    tag: "ol",
    itemCount: timelineSteps.length,
    connected: true,
    indicatorAlignment: "top",
    indicatorSize: "3.2rem",
    styleClassPassthrough: ["stepper-timeline"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A consumer-styled timeline built only from public tokens and slots, no extra props. Diamond markers are rotated squares in the `#indicator-{n}` slots, each with a state class (`is-done`, `is-current`, `is-upcoming`). `.stepper-list-item:has(.is-done)` swaps that item's connector to a cyan dashed line through `--stepper-list-connector-image`; the rest stay grey and dotted. The current step's eyebrow turns cyan and upcoming steps are dimmed. The state is also written in each eyebrow, so it never depends on colour alone. See CONSUMER-STYLING.md, \"Recipe: per-step states and dashed connectors\".",
      },
    },
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args, timelineSteps, timelineStateLabels, timelineCss };
    },
    template: `
      ${serviceDetailNote}
      <div class="stepper-timeline-demo">
        <component :is="'style'">{{ timelineCss }}</component>
        <StepperList v-bind="args">
          <template v-for="(step, i) in timelineSteps" :key="'indicator-' + i" #[\`indicator-\${i}\`]>
            <span class="stepper-timeline-marker" :class="'is-' + step.state" aria-hidden="true"></span>
          </template>
          <template v-for="(step, i) in timelineSteps" :key="'item-' + i" #[\`item-\${i}\`]>
            <p class="stepper-timeline-eyebrow">Step {{ String(i + 1).padStart(2, "0") }} · {{ timelineStateLabels[step.state] }}</p>
            <h3 class="stepper-timeline-title" :aria-current="step.state === 'current' ? 'step' : undefined">{{ step.title }}</h3>
            <p class="stepper-timeline-body">{{ step.body }}</p>
          </template>
        </StepperList>
      </div>
    `,
  }),
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const unbroken = "Haarpflegebehandlungsterminvereinbarungsbestätigungsschreiben".repeat(3);
const longGerman =
  "Bitte vereinbaren Sie vor der ersten Behandlung einen ausführlichen Beratungstermin, damit wir Ihre Haarstruktur, Ihre bisherigen Färbungen und Ihre Wünsche gemeinsam besprechen können.";
const longUrl = "https://example.com/a/very/long/url/without/any/spaces/that/keeps/going/and/going/and/going";

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    tag: "ol",
    itemCount: 12,
    connected: true,
    indicatorVariant: "circle",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Worst-case content in every row. Check that: unbroken strings and the long URL wrap inside the content column instead of widening the list; rows 10 to 12 (no slots provided) render as numbered rows with an empty content area; the two-digit counters still fit their bubble; the HTML-like text renders as text; the RTL row reads right to left; the wide custom indicator in row 2 still has the connector line running from its centre; and the second list (fractional `itemCount` 2.9) renders 2 rows rather than none.",
      },
      story: { inline: false, height: "1400px" },
    },
  },
  render: (args) => ({
    components: { StepperList },
    setup() {
      return { args, unbroken, longGerman, longUrl };
    },
    template: `
      ${serviceDetailNote}
      <div style="max-inline-size: 48rem;">
        <StepperList v-bind="args">
          <template #item-0><p class="page-body-normal">{{ unbroken }}</p></template>
          <template #indicator-1><span style="white-space: nowrap; padding-inline: 0.8rem; border: 2px solid currentColor; border-radius: 100vw;">Step 2 of 12 ✨</span></template>
          <template #item-1><p class="page-body-normal">{{ longGerman }} {{ longGerman }}</p></template>
          <template #item-2><p class="page-body-normal"><a :href="longUrl">{{ longUrl }}</a></p></template>
          <template #item-3><p class="page-body-normal">🦄💇‍♀️ Emoji first, then text</p></template>
          <template #item-4><p class="page-body-normal" dir="rtl">مرحبا بكم في صالوننا، نحن نقدم جميع خدمات الشعر</p></template>
          <template #item-5><p class="page-body-normal">&lt;script&gt;alert(1)&lt;/script&gt; renders as text</p></template>
          <template #item-6><p class="page-body-normal">A</p></template>
          <template #item-7></template>
          <template #item-8><p class="page-body-normal">{{ longGerman }}</p><p class="page-body-normal">{{ unbroken }}</p></template>
        </StepperList>
        <StepperList :item-count="2.9" indicator-variant="square" style="margin-block-start: 3.2rem;">
          <template #item-0><p class="page-body-normal">Fractional itemCount: first row</p></template>
          <template #item-1><p class="page-body-normal">Second row (a third would be wrong)</p></template>
          <template #item-2><p class="page-body-normal">Third row: should not render</p></template>
        </StepperList>
      </div>
    `,
  }),
};
