import HeroText from "../HeroText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { TextConfig } from "~/types/components";

const meta: Meta<typeof HeroText> = {
  title: "Atoms/Text Blocks/Hero Text",
  component: HeroText,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      description: "Heading element to render.",
      table: { category: "Basic" },
    },
    axis: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "`horizontal` flows the segments as one line of text; `vertical` stacks them in a column. Set as `data-axis`.",
      table: { category: "Basic" },
    },
    fontSize: {
      control: { type: "select" },
      options: ["display", "title", "heading", "subheading", "label"],
      description: "Size step, set as `data-font-size` and sized by `--hero-text-{size}`.",
      table: { category: "Basic" },
    },
    textContent: {
      control: "object",
      description:
        "Segments: `{ text, styleClass?: \"normal\" | \"accent\" }`. Text is trimmed, a space joins segments, and blank segments are dropped.",
      table: { category: "Content" },
    },
    icon: {
      control: { type: "select" },
      options: [undefined, "lucide:sparkles"],
      description: "Iconify name for a decorative icon before the text.",
      table: { category: "Basic" },
    },
    id: {
      control: "text",
      description: "Rendered as `id`, for a section's `aria-labelledby`.",
      table: { category: "Accessibility" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    tag: "h1",
    axis: "horizontal",
    fontSize: "title",
    textContent: [
      { text: "Designing", styleClass: "normal" },
      { text: "Artistry", styleClass: "accent" },
      { text: "at Home", styleClass: "normal" },
    ],
    icon: "lucide:sparkles",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A heading built from text segments (`textContent`), each `normal` or `accent` (italic, filled with the `--hero-text-bg-img` gradient). `fontSize` picks one of five size steps, `axis` flows the segments inline or stacks them, and `icon` adds a decorative icon. Rendered as the title in `ServicesCard`, `ServiceSummary`, `ServiceDetail` and as `PriceList`'s group headings.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroText>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const parentNote = `
  <p style="${storyNoteStyle}">
    In use: the title in
    <a href="/?path=/story/organisms-services-services-card--config-overrides" target="_top">ServicesCard</a>
    (size and tag set through <code>heroConfig</code>),
    <a href="/?path=/story/organisms-services-service-summary--default" target="_top">ServiceSummary</a>,
    <a href="/?path=/story/organisms-services-service-detail--default" target="_top">ServiceDetail</a>, and the group headings in
    <a href="/?path=/story/molecules-pricelist--default" target="_top">PriceList</a>.
  </p>
`;
const parentDocs =
  "In use: the title in [ServicesCard](?path=/story/organisms-services-services-card--config-overrides) (sized through `heroConfig`), [ServiceSummary](?path=/story/organisms-services-service-summary--default), [ServiceDetail](?path=/story/organisms-services-service-detail--default) and the group headings in [PriceList](?path=/story/molecules-pricelist--default).";

export const Default: Story = {
  render: (args) => ({
    components: { HeroText },
    setup() {
      return { args };
    },
    template: `<div>${parentNote}<HeroText v-bind="args" /></div>`,
  }),
  parameters: {
    docs: {
      description: {
        story: `Three segments with the middle one accented. Use the Controls panel to change the tag, axis, size, icon and segments. ${parentDocs}`,
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { HeroText },
    setup() {
      return { args, sizes: ["display", "title", "heading", "subheading", "label"] };
    },
    template: `
      <div style="display: grid; gap: 2.4rem;">
        <HeroText v-for="size in sizes" :key="size" v-bind="args" :font-size="size" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Every `fontSize` step, largest first. The icon shrinks to `0.75em` at `subheading`.",
      },
    },
  },
};

export const Vertical: Story = {
  args: { axis: "vertical", fontSize: "display", icon: undefined },
  render: (args) => ({
    components: { HeroText },
    setup() {
      return { args };
    },
    template: `<HeroText v-bind="args" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: "`axis=\"vertical\"` stacks each segment on its own line, spaced by `--hero-text-vertical-gap`.",
      },
    },
  },
};

const longGerman = "Freihändige Balayage-Farbtechnik für natürlich wirkende Übergänge";

const stressCases: { note: string; textContent: TextConfig[]; fontSize?: string }[] = [
  {
    note: "Unbroken word and long URL at display size",
    fontSize: "display",
    textContent: [
      { text: "Kostenloselieferungfürallebestellungen", styleClass: "normal" },
      { text: "https://example.invalid/a/very/long/url", styleClass: "accent" },
    ],
  },
  {
    note: "Long German copy across an accent segment",
    textContent: [
      { text: longGerman, styleClass: "normal" },
      { text: longGerman, styleClass: "accent" },
    ],
  },
  {
    note: "Emoji first and HTML-like text (shown as text)",
    textContent: [
      { text: "😀 Neue", styleClass: "normal" },
      { text: "<b>not bold</b>", styleClass: "accent" },
    ],
  },
  {
    note: "Blank and missing segments are dropped: only “Kept” and “Too” render, one space apart",
    textContent: [
      { text: "Kept", styleClass: "normal" },
      { text: "", styleClass: "accent" },
      { text: "   ", styleClass: "normal" },
      { text: undefined, styleClass: "accent" } as unknown as TextConfig,
      { text: "Too", styleClass: "accent" },
    ],
  },
  {
    note: "A single character",
    textContent: [{ text: "A", styleClass: "accent" }],
  },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: () => ({
    components: { HeroText },
    setup() {
      return { stressCases };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem;">
        <template v-for="(item, index) in stressCases" :key="index">
          <p style="margin: 0; font-size: 1.4rem;">{{ item.note }}, in a 24rem column.</p>
          <div style="inline-size: 24rem; outline: 0.1rem dashed currentColor;">
            <HeroText tag="h2" :font-size="item.fontSize ?? 'title'" :text-content="item.textContent" icon="lucide:sparkles" />
          </div>
        </template>

        <p style="margin: 0; font-size: 1.4rem;">Right-to-left text, vertical axis.</p>
        <HeroText
          tag="h2"
          axis="vertical"
          dir="rtl"
          :text-content="[{ text: 'تسريحات شعر', styleClass: 'normal' }, { text: 'لموسم الخريف', styleClass: 'accent' }]"
        />

        <p style="margin: 0; font-size: 1.4rem;">Empty <code>textContent</code>: an empty heading, no stray space.</p>
        <div style="outline: 0.1rem dashed currentColor;">
          <HeroText tag="h2" :text-content="[]" />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      story: { inline: false, height: "1300px" },
      description: {
        story:
          "Worst-case segments. Check: unbroken words and URLs wrap inside each dashed 24rem column, including at `display` size; long copy wraps across the accent segment with its gradient intact and its descenders unclipped; emoji and HTML-like text render as text; blank or missing segments leave no double spaces; right-to-left text stacks correctly on the vertical axis; an empty `textContent` renders an empty heading.",
      },
    },
  },
};
