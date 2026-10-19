import { computed } from "vue";
import HeaderBlock from "../HeaderBlock.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface StoryArgs {
  tagLevel: HeadingLevel;
  classLevel: HeadingLevel;
  id?: string;
  headingText: string;
  styleClassPassthrough?: string | string[];
}

const meta: Meta<StoryArgs> = {
  title: "Atoms/Text Blocks/Header Block",
  component: HeaderBlock,
  argTypes: {
    tagLevel: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
      description: "Semantic heading level: which `<h1>`-`<h6>` tag is rendered.",
      table: { category: "Basic" },
    },
    classLevel: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
      description: "Visual size level: which `.page-heading-N` utility class is applied, independent of `tagLevel`.",
      table: { category: "Basic" },
    },
    id: {
      control: "text",
      description: "Rendered as `id`, for a wrapping section's `aria-labelledby` (e.g. PageRow's `heading-id` slot prop).",
      table: { category: "Accessibility" },
    },
    headingText: {
      control: "text",
      description: "Story-only: text placed in the default slot.",
      table: { category: "Slots (story-only)" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    tagLevel: 1,
    classLevel: 1,
    headingText: "Page title",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders an `<h1>`-`<h6>` chosen by `tagLevel` (document structure), sized by the global `.page-heading-{classLevel}` utility class (visual size). The two are independent, so a heading can be a semantic `h2` styled at the `page-heading-1` size. The default slot is the heading content; `id` pairs it with a section's `aria-labelledby`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render: Story["render"] = (args) => ({
  components: { HeaderBlock },
  setup() {
    const componentArgs = computed(() => {
      const { headingText: _headingText, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `<HeaderBlock v-bind="componentArgs">{{ args.headingText }}</HeaderBlock>`,
});

export const Default: Story = {
  render,
  parameters: {
    docs: {
      description: {
        story: "An `h1` at the `page-heading-1` size. Use the Controls panel to change either level or the text.",
      },
    },
  },
};

export const DecoupledLevels: Story = {
  name: "Semantic vs Visual Level Decoupled",
  render,
  args: { tagLevel: 2, classLevel: 1, headingText: "Section heading, styled big" },
  parameters: {
    docs: {
      description: {
        story:
          "`tagLevel` 2 renders an `<h2>`, correct for document structure below the page's real `<h1>`, while `classLevel` 1 styles it at the largest size. Inspect the DOM to confirm the tag is `<h2>`.",
      },
    },
  },
};

export const SectionAriaLabelledby: Story = {
  name: "Paired with a Section's aria-labelledby",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The `id` prop lets HeaderBlock be the target of a wrapping landmark's `aria-labelledby`. Pass the same id both places, or inside `PageRow`, `ProfileSection` (`heroText` slot) or `PageHeroHighlights` (`header` slot) bind the `heading-id` slot prop they expose. See the [PageRow](?path=/story/atoms-layouts-pagerow--aria-labelled-by) story, which wires the slot prop to a heading.",
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Every `classLevel`, from `page-heading-1` (`--step-8`) down to `page-heading-6` (`--step-3`).",
      },
    },
  },
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

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Worst-case headings. Check: an unbroken word and a long URL at `page-heading-1` wrap inside the dashed 24rem column instead of overflowing; long German copy wraps on spaces; emoji, right-to-left text and HTML-like text (shown as text) render normally; a single character still gets the full size; out-of-range levels (9 and 0) fall back to `h1` at `page-heading-1`.",
      },
    },
  },
  render: () => ({
    components: { HeaderBlock },
    setup() {
      return { htmlLike: "<b>not bold</b>" };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem;">
        <p style="margin: 0; font-size: 1.4rem;">Unbroken word, long URL and long German copy in a 24rem column at the largest size.</p>
        <div style="display: grid; gap: 1.6rem; inline-size: 24rem; outline: 0.1rem dashed currentColor;">
          <HeaderBlock :tag-level="2" :class-level="1">Kostenloselieferungfürallebestellungen</HeaderBlock>
          <HeaderBlock :tag-level="2" :class-level="2">https://example.invalid/a/very/long/unbroken/url</HeaderBlock>
          <HeaderBlock :tag-level="2" :class-level="3">Kostenlose Lieferung für alle Bestellungen über einem Mindestbestellwert</HeaderBlock>
        </div>

        <p style="margin: 0; font-size: 1.4rem;">Emoji first, right-to-left, HTML-like text and a single character.</p>
        <HeaderBlock :tag-level="2" :class-level="3">😀 Emoji at the start</HeaderBlock>
        <HeaderBlock :tag-level="2" :class-level="3" dir="rtl">تسريحات شعر جديدة لموسم الخريف</HeaderBlock>
        <HeaderBlock :tag-level="2" :class-level="3">{{ htmlLike }}</HeaderBlock>
        <HeaderBlock :tag-level="2" :class-level="3">A</HeaderBlock>

        <p style="margin: 0; font-size: 1.4rem;">Out-of-range levels (tag 9, class 0): both fall back to 1.</p>
        <HeaderBlock :tag-level="9" :class-level="0">Fallback heading</HeaderBlock>
      </div>
    `,
  }),
};
