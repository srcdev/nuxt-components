import OverlineText from "../OverlineText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof OverlineText> = {
  title: "Atoms/Text Blocks/Overline Text",
  component: OverlineText,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["p", "div", "span"],
      description: "HTML tag for the text element. Use `span` inside a line of text.",
      table: { category: "Basic" },
    },
    fontSize: {
      control: { type: "select" },
      options: ["large", "medium", "small"],
      description: "Size step, set as `data-font-size` and sized by `--overline-text-large/medium/small`.",
      table: { category: "Basic" },
    },
    textContent: {
      control: { type: "text" },
      description: "The label text. Pass it in normal case: the component uppercases it.",
      table: { category: "Content" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    tag: "div",
    fontSize: "medium",
    textContent: "Designing Artistry at Home",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A short uppercase label above a heading, filled with the `--overline-text-bg-img` gradient. `textContent` is the label, `fontSize` picks one of three size steps and `tag` the element. Rendered inside `ServicesCard`, `ServiceSummary` and `ServiceDetail`; `ProfileSection` restyles one placed in its slot.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OverlineText>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const parentNote = `
  <p style="${storyNoteStyle}">
    In use: the subtitle above the title in
    <a href="/?path=/story/organisms-services-services-card--config-overrides" target="_top">ServicesCard</a>
    (size and tag set through <code>overlineConfig</code>),
    <a href="/?path=/story/organisms-services-service-summary--default" target="_top">ServiceSummary</a> and
    <a href="/?path=/story/organisms-services-service-detail--default" target="_top">ServiceDetail</a>.
  </p>
`;
const parentDocs =
  "In use: the subtitle in [ServicesCard](?path=/story/organisms-services-services-card--config-overrides) (sized through `overlineConfig`), [ServiceSummary](?path=/story/organisms-services-service-summary--default) and [ServiceDetail](?path=/story/organisms-services-service-detail--default).";

export const Default: Story = {
  render: (args) => ({
    components: { OverlineText },
    setup() {
      return { args };
    },
    template: `<div>${parentNote}<OverlineText v-bind="args" /></div>`,
  }),
  parameters: {
    docs: {
      description: {
        story: `Default \`div\` at the \`medium\` size. Use the Controls panel to change the tag, size and text. ${parentDocs}`,
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { OverlineText },
    setup() {
      return { args };
    },
    template: `
      ${parentNote}
      <div style="display: grid; gap: 1.2rem;">
        <OverlineText v-bind="args" font-size="large" />
        <OverlineText v-bind="args" font-size="medium" />
        <OverlineText v-bind="args" font-size="small" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: `The three \`fontSize\` steps, largest first. ${parentDocs}`,
      },
    },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: () => ({
    components: { OverlineText },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem; font-size: 1.4rem;">
        <p style="margin: 0;">Long German copy and an unbroken string in an 18rem column.</p>
        <div style="display: grid; gap: 1.2rem; inline-size: 18rem; outline: 0.1rem dashed currentColor;">
          <OverlineText text-content="Kostenlose Lieferung für alle Bestellungen über einem Mindestbestellwert" font-size="large" />
          <OverlineText text-content="Kostenloselieferungfürallebestellungenübereinemmindestbestellwert" />
          <OverlineText text-content="https://example.invalid/a/very/long/unbroken/url/with/no/break/opportunity" font-size="small" />
        </div>

        <p style="margin: 0;">Emoji first, HTML-like text (must show as text), right-to-left text, a single character and an empty string (renders nothing visible).</p>
        <div style="display: grid; gap: 1.2rem;">
          <OverlineText text-content="😀 Emoji at the start" />
          <OverlineText text-content="<b>not bold</b>" />
          <OverlineText text-content="التوصيل المجاني" dir="rtl" />
          <OverlineText text-content="a" />
          <OverlineText text-content="" />
        </div>

        <p style="margin: 0;">Inline <code>span</code> inside a sentence: the italic overhang of the last letter should not be cut off.</p>
        <p style="margin: 0;">Before <OverlineText tag="span" text-content="Inline overline WIDTH" font-size="large" /> after.</p>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Worst-case text. Check: long copy and unbroken strings wrap inside the dashed column; emoji and right-to-left text keep the gradient fill; HTML-like text shows its tags as text; an empty string adds no visible box; the inline span sits on the line and its last italic letter is fully painted.",
      },
    },
  },
};
