import TextBlock from "../TextBlock.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof TextBlock> = {
  title: "Atoms/Text Block",
  component: TextBlock,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "Root element. section/article get aria-labelledby pointing at the heading-id slot prop",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional classes applied to the root element",
    },
  },
  args: {
    tag: "div",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Vertical-rhythm wrapper for a block of text (typically a page lead: eyebrow, hero heading, intro copy). Its only styling is fluid block padding, overridable via --text-block-padding-block-start/-end. The dashed outline in these stories shows the padding and is not part of the component.",
      },
    },
  },
  decorators: [
    () => ({
      template: `<div style="outline: 1px dashed currentColor; outline-offset: -1px;"><story /></div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof TextBlock>;

export const Default: Story = {
  render: (args) => ({
    components: { TextBlock },
    setup() {
      return { args };
    },
    template: `
      <TextBlock v-bind="args" v-slot="{ headingId }">
        <h2 :id="headingId" class="page-heading-2">Our services</h2>
        <p>Everything we offer, with prices and appointment lengths.</p>
      </TextBlock>
    `,
  }),
};

export const AsLabelledSection: Story = {
  name: "As a labelled section",
  args: { tag: "section" },
  parameters: {
    docs: {
      description: {
        story:
          "With tag=section the root gets aria-labelledby. Bind the heading-id slot prop to the heading's id so the landmark has an accessible name; a dev-mode console warning fires if you forget.",
      },
    },
  },
  render: Default.render,
};

export const CustomPadding: Story = {
  name: "Custom padding tokens",
  render: (args) => ({
    components: { TextBlock },
    setup() {
      return { args };
    },
    template: `
      <div style="--text-block-padding-block-start: var(--fluid-space-8-16); --text-block-padding-block-end: 0;">
        <TextBlock v-bind="args">
          <p>Tight top padding, none at the bottom, set via the public tokens on a parent.</p>
        </TextBlock>
      </div>
    `,
  }),
};
