import AccordianCore from "../AccordianCore.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof AccordianCore> = {
  title: "Molecules/Accordian/AccordianCore",
  component: AccordianCore,
  argTypes: {
    name: {
      control: { type: "text" },
      description:
        "Shared name attribute passed to each ExpandingPanel — used to group panels so only one can be open at a time (native <details> behaviour)",
    },
    itemCount: {
      control: { type: "number", min: 0, step: 1 },
      description: "Number of accordion panels to render",
    },
    animationDuration: {
      control: { type: "number", min: 0, step: 50 },
      description: "Expand/collapse animation duration in milliseconds",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    name: undefined,
    itemCount: 3,
    animationDuration: 300,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof AccordianCore>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Builds a slot object for N items with generic placeholder content. */
function buildGenericSlots(count: number): Record<string, string> {
  const slots: Record<string, string> = {};
  for (let i = 0; i < count; i++) {
    slots[`accordian-${i}-summary`] = `<span>Panel ${i + 1} — Summary</span>`;
    slots[`accordian-${i}-icon`] = `<span>▸</span>`;
    slots[`accordian-${i}-content`] =
      `<p style="margin:0;padding:0.5rem 0">This is the content for panel ${i + 1}. ` +
      `Add whatever you need here — text, images, components.</p>`;
  }
  return slots;
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    itemCount: 3,
    animationDuration: 300,
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args, slots: buildGenericSlots(args.itemCount ?? 3) };
    },
    template: `
      <AccordianCore v-bind="args">
        <template v-for="(content, name) in slots" #[name] :key="name">
          <span v-html="content" />
        </template>
      </AccordianCore>
    `,
  }),
};

export const SinglePanel: Story = {
  args: {
    itemCount: 1,
    animationDuration: 300,
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args };
    },
    template: `
      <AccordianCore v-bind="args">
        <template #accordian-0-summary>
          <span>The only panel</span>
        </template>
        <template #accordian-0-content>
          <p style="margin:0;padding:0.5rem 0">Content for the single panel.</p>
        </template>
      </AccordianCore>
    `,
  }),
};

/** Panels share a name so the browser enforces only one open at a time. */
export const ExclusiveOpen: Story = {
  name: "Exclusive Open (name grouped)",
  args: {
    itemCount: 4,
    name: "exclusive-group",
    animationDuration: 300,
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args, slots: buildGenericSlots(args.itemCount ?? 4) };
    },
    template: `
      <AccordianCore v-bind="args">
        <template v-for="(content, name) in slots" #[name] :key="name">
          <span v-html="content" />
        </template>
      </AccordianCore>
    `,
  }),
};

export const SlowAnimation: Story = {
  name: "Slow Animation (800ms)",
  args: {
    itemCount: 3,
    animationDuration: 800,
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args, slots: buildGenericSlots(args.itemCount ?? 3) };
    },
    template: `
      <AccordianCore v-bind="args">
        <template v-for="(content, name) in slots" #[name] :key="name">
          <span v-html="content" />
        </template>
      </AccordianCore>
    `,
  }),
};

export const NoAnimation: Story = {
  name: "No Animation (0ms)",
  args: {
    itemCount: 3,
    animationDuration: 0,
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args, slots: buildGenericSlots(args.itemCount ?? 3) };
    },
    template: `
      <AccordianCore v-bind="args">
        <template v-for="(content, name) in slots" #[name] :key="name">
          <span v-html="content" />
        </template>
      </AccordianCore>
    `,
  }),
};

export const WithStyleClassPassthrough: Story = {
  name: "With styleClassPassthrough",
  args: {
    itemCount: 2,
    styleClassPassthrough: ["custom-class", "another-class"],
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args, slots: buildGenericSlots(args.itemCount ?? 2) };
    },
    template: `
      <AccordianCore v-bind="args">
        <template v-for="(content, name) in slots" #[name] :key="name">
          <span v-html="content" />
        </template>
      </AccordianCore>
    `,
  }),
};

export const RichContent: Story = {
  name: "Rich Slot Content",
  args: {
    itemCount: 3,
    animationDuration: 300,
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args };
    },
    template: `
      <AccordianCore v-bind="args">
        <template #accordian-0-summary>
          <strong>Delivery &amp; Returns</strong>
        </template>
        <template #accordian-0-content>
          <p style="margin:0;padding:0.5rem 0">
            Free standard delivery on orders over £50. Returns accepted within 30 days.
          </p>
        </template>

        <template #accordian-1-summary>
          <strong>Materials &amp; Care</strong>
        </template>
        <template #accordian-1-content>
          <ul style="margin:0;padding:0.5rem 0 0.5rem 1.2rem">
            <li>100% organic cotton</li>
            <li>Machine wash at 30°C</li>
            <li>Do not tumble dry</li>
          </ul>
        </template>

        <template #accordian-2-summary>
          <strong>Sizing Guide</strong>
        </template>
        <template #accordian-2-content>
          <p style="margin:0;padding:0.5rem 0">
            Our pieces run true to size. If you're between sizes, we recommend sizing up.
          </p>
        </template>
      </AccordianCore>
    `,
  }),
};

export const Empty: Story = {
  name: "Zero Items",
  args: {
    itemCount: 0,
  },
  render: (args) => ({
    components: { AccordianCore },
    setup() {
      return { args };
    },
    template: `<AccordianCore v-bind="args" />`,
  }),
};
