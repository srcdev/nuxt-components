import HeaderBlock from "../HeaderBlock.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof HeaderBlock> = {
  title: "Atoms/Text Blocks/Header Block",
  component: HeaderBlock,
  argTypes: {
    tagLevel: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
      description: "Semantic heading level — which <h1>-<h6> tag is rendered",
    },
    classLevel: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
      description: "Visual size level — which .page-heading-N utility class is applied, independent of tagLevel",
    },
    id: {
      control: "text",
      description: "Bind to a wrapping section's aria-labelledby target (e.g. PageRow's heading-id slot prop)",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional classes applied to the root element",
    },
  },
  args: {
    tagLevel: 1,
    classLevel: 1,
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders an <h1>-<h6> tag chosen by tagLevel (document structure/accessibility), styled by the global .page-heading-{classLevel} utility class (visual size) — the two are independent, so a component can be a semantic h2 styled at the page-heading-1 size.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderBlock>;

export const Default: Story = {
  render: (args) => ({
    components: { HeaderBlock },
    setup() {
      return { args };
    },
    template: `<HeaderBlock v-bind="args">Page title</HeaderBlock>`,
  }),
};

export const DecoupledLevels: Story = {
  name: "Semantic vs Visual Level Decoupled",
  args: { tagLevel: 2, classLevel: 1 },
  parameters: {
    docs: {
      description: {
        story:
          "tagLevel=2 (renders an <h2>, correct for document structure below the page's real <h1>) but classLevel=1 (styled at the largest page-heading size) — inspect the DOM to confirm the tag is <h2> while it visually reads as the biggest heading on the page.",
      },
    },
  },
  render: (args) => ({
    components: { HeaderBlock },
    setup() {
      return { args };
    },
    template: `<HeaderBlock v-bind="args">Section heading, styled big</HeaderBlock>`,
  }),
};

export const SectionAriaLabelledby: Story = {
  name: "Paired with a Section's aria-labelledby",
  parameters: {
    docs: {
      description: {
        story:
          "The id prop lets HeaderBlock be the target of a wrapping landmark's aria-labelledby — pass the same id both places (or, inside this library, the heading-id slot prop that PageRow/other section wrappers expose via useAriaLabelledById).",
      },
    },
  },
  render: () => ({
    components: { HeaderBlock },
    template: `
      <section aria-labelledby="story-section-heading">
        <HeaderBlock id="story-section-heading" :tag-level="2" :class-level="2">Section title</HeaderBlock>
        <p>Section content…</p>
      </section>
    `,
  }),
};

export const AllSizes: Story = {
  name: "All classLevel Sizes",
  render: () => ({
    components: { HeaderBlock },
    template: `
      <div>
        <HeaderBlock :tag-level="1" :class-level="1">page-heading-1</HeaderBlock>
        <HeaderBlock :tag-level="2" :class-level="2">page-heading-2</HeaderBlock>
        <HeaderBlock :tag-level="3" :class-level="3">page-heading-3</HeaderBlock>
        <HeaderBlock :tag-level="4" :class-level="4">page-heading-4</HeaderBlock>
        <HeaderBlock :tag-level="5" :class-level="5">page-heading-5</HeaderBlock>
        <HeaderBlock :tag-level="6" :class-level="6">page-heading-6</HeaderBlock>
      </div>
    `,
  }),
};
