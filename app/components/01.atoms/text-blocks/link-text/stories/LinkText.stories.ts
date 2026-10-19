import LinkText from "../LinkText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof LinkText> = {
  title: "Atoms/Text Blocks/Link Text",
  component: LinkText,
  argTypes: {
    to: {
      control: "text",
      description: "Link destination (internal path or external URL).",
      table: { category: "Basic" },
    },
    linkText: {
      control: "text",
      description: "Visible link label. It should name the destination, so it's never clamped.",
      table: { category: "Content" },
    },
    external: {
      control: "boolean",
      description: "Force external link handling on an internal-looking path.",
      table: { category: "Basic" },
    },
    target: {
      control: { type: "select" },
      options: [undefined, "_blank", "_self"],
      description: "Link `target`. NuxtLink adds `rel=\"noopener noreferrer\"` for an external `_blank`.",
      table: { category: "Basic" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    to: "/",
    linkText: "Read More",
    external: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A `NuxtLink` styled as a standalone text link. `to` and `linkText` are required; `left` and `right` slots take icons, which stay centred on the label. Colours, underline and gap come from `--link-text-*` tokens.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LinkText>;

const withIcons = (left: string | null, right: string | null) => `
  <LinkText v-bind="args">
    ${left ? `<template #left><Icon name="${left}" /></template>` : ""}
    ${right ? `<template #right><Icon name="${right}" /></template>` : ""}
  </LinkText>
`;

const story = (template: string, description: string, args: Story["args"] = {}): Story => ({
  args,
  render: (storyArgs) => ({
    components: { LinkText },
    setup() {
      return { args: storyArgs };
    },
    template,
  }),
  parameters: { docs: { description: { story: description } } },
});

export const Default = story(withIcons(null, null), "A plain link. Use the Controls panel to change the destination, label and target.");

export const WithLeftIcon = story(withIcons("lucide:arrow-left", null), "A `left` slot icon for a back or previous link.", {
  linkText: "Go Back",
});

export const WithRightIcon = story(withIcons(null, "lucide:arrow-right"), "A `right` slot icon for a forward or more link.", {
  linkText: "Learn More",
});

export const WithBothIcons = story(withIcons("lucide:sparkles", "lucide:arrow-right"), "Both slots. Left icon, label, then right icon.", {
  linkText: "Explore",
});

export const ExternalLink = story(
  withIcons(null, "lucide:external-link"),
  "An external link opening in a new tab, with an icon that says so.",
  { to: "https://nuxt.com", linkText: "Nuxt Docs", external: true, target: "_blank" }
);

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: () => ({
    components: { LinkText },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem; font-size: 1.6rem;">
        <p style="margin: 0; font-size: 1.4rem;">Long German label, an unbroken label and a long URL as the label, each with icons, in an 18rem column.</p>
        <div style="display: grid; gap: 1.6rem; justify-items: start; inline-size: 18rem; outline: 0.1rem dashed currentColor;">
          <LinkText to="/" link-text="Alle Lieferbedingungen und Rückgaberichtlinien ansehen">
            <template #right><Icon name="lucide:arrow-right" /></template>
          </LinkText>
          <LinkText to="/" link-text="Lieferbedingungenundrückgaberichtlinienansehen">
            <template #left><Icon name="lucide:arrow-left" /></template>
            <template #right><Icon name="lucide:arrow-right" /></template>
          </LinkText>
          <LinkText to="https://example.invalid/a/very/long/unbroken/url" link-text="https://example.invalid/a/very/long/unbroken/url" external target="_blank">
            <template #right><Icon name="lucide:external-link" /></template>
          </LinkText>
        </div>

        <p style="margin: 0; font-size: 1.4rem;">Emoji first, HTML-like text (shown as text), right-to-left with a right icon, and a single character.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 2.4rem; align-items: center;">
          <LinkText to="/" link-text="😀 Emoji first" />
          <LinkText to="/" link-text="<b>not bold</b>" />
          <LinkText to="/" link-text="اقرأ المزيد" dir="rtl">
            <template #right><Icon name="lucide:arrow-left" /></template>
          </LinkText>
          <LinkText to="/" link-text="A" />
        </div>

        <p style="margin: 0; font-size: 1.4rem;">Icon-only link: empty <code>link-text</code>, named with <code>aria-label</code>. Tab to it to check the focus ring.</p>
        <LinkText to="/" link-text="" aria-label="Back to home">
          <template #left><Icon name="lucide:house" /></template>
        </LinkText>

        <p style="margin: 0; font-size: 1.4rem;">Inside a sentence: the link sits on the text line.</p>
        <p style="margin: 0;">Our full price list is on the <LinkText to="/" link-text="services page" /> and updated monthly.</p>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Worst-case labels. Check: long and unbroken labels and URLs wrap inside the dashed 18rem column with their icons centred on the wrapped text; emoji and HTML-like text render as text; right-to-left puts the right slot on the inline end; an icon-only link keeps a visible focus ring; an inline link sits on the line of text.",
      },
    },
  },
};
