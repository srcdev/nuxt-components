import SkipLinks from "../SkipLinks.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { SkipLink } from "~/types/components";

const meta: Meta<typeof SkipLinks> = {
  title: "Atoms/Navigation/SkipLinks",
  component: SkipLinks,
  argTypes: {
    links: {
      control: "object",
      description: "Ordered list of { href, label } skip targets. Entries with an empty href or label are skipped.",
    },
    ariaLabel: {
      control: "text",
      description: "aria-label on the nav landmark (override for localisation)",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    ariaLabel: "Skip navigation",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Keyboard skip links: a `<nav>` of in-page links that stays hidden until one of them takes focus, letting keyboard and screen-reader users jump past repeated navigation. Place `<SkipLinks>` first in the page layout. Links come from the `links` prop (`{ href, label }[]`, default main content and footer); the optional `homeLink` slot renders a visible item (usually the logo link) that the panel drops down beneath. `ariaLabel` names the landmark. SiteHeader renders this as its branding row: see the [Site Header](?path=/story/organisms-site-header--default) story.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkipLinks>;

const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const siteHeaderNote = `
  <p style="${storyNoteStyle}">
    SiteHeader puts its branding in the <code>homeLink</code> slot and these links beneath it: open the
    <a href="/?path=/story/organisms-site-header--default" target="_top">Site Header</a> story to see it in a real header.
  </p>
`;

const forceOpenStyle = `
  <style>
    .skip-links-force-open .skip-links__nav {
      opacity: 1 !important;
      pointer-events: auto !important;
      transform: translateY(0) !important;
      position: static !important;
    }
  </style>
`;

export const Default: Story = {
  render: (args) => ({
    components: { SkipLinks },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 2rem;">
        ${siteHeaderNote}
        <p style="${storyNoteStyle}">
          The skip links are hidden until focused. Click into this preview, then press <kbd>Tab</kbd> to reveal them.
        </p>
        <SkipLinks v-bind="args" />
      </div>
    `,
  }),
};

const customLinks: SkipLink[] = [
  { href: "#site-navigation", label: "Skip to navigation" },
  { href: "#main-content", label: "Skip to main content" },
  { href: "#footer-content", label: "Skip to footer" },
];

export const CustomLinks: Story = {
  name: "Custom Links",
  args: { links: customLinks },
  render: (args) => ({
    components: { SkipLinks },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 2rem;">
        ${siteHeaderNote}
        <p style="${storyNoteStyle}">
          Press <kbd>Tab</kbd> after clicking into this preview to reveal three custom skip links.
        </p>
        <SkipLinks v-bind="args" />
      </div>
    `,
  }),
};

export const AlwaysVisible: Story = {
  name: "Always Visible (for review)",
  parameters: {
    docs: {
      description: {
        story:
          "Forces the panel open with story-only CSS so it can be inspected without tabbing. For visual review only: in real use it only shows while a link has focus.",
      },
    },
  },
  render: (args) => ({
    components: { SkipLinks },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 2rem;">
        ${forceOpenStyle}
        ${siteHeaderNote}
        <div class="skip-links-force-open">
          <SkipLinks v-bind="args" />
        </div>
      </div>
    `,
  }),
};

const stressLinks: SkipLink[] = [
  { href: "#main-content", label: "Zumhauptinhaltspringenundnavigationüberspringen" },
  { href: "#main-content", label: "😀 Same target, second label" },
  { href: "#search", label: "<b>not bold</b> renders as text" },
  { href: "#footer-content", label: "انتقل إلى التذييل" },
  { href: "#x", label: "X" },
  { href: "", label: "Dropped: empty href" },
  { href: "#dropped", label: "   " },
  ...Array.from({ length: 6 }, (_, index) => ({ href: `#section-${index + 1}`, label: `Skip to section ${index + 1}` })),
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    links: stressLinks,
    ariaLabel: "Navigationsübersprunglinksfürtastaturnutzerinnenundnutzer 😀",
  },
  render: (args) => ({
    components: { SkipLinks },
    setup() {
      return { args };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2rem; font-size: 1.4rem;">
        ${forceOpenStyle}
        <p style="margin: 0;">Forced open in a narrow column: long unbroken, emoji, HTML-like and right-to-left labels wrap inside the panel, two links share a target, and the two entries with an empty href or label are dropped (11 links show, not 13).</p>
        <div class="skip-links-force-open" style="inline-size: 18rem; outline: 0.1rem dashed currentColor;">
          <SkipLinks v-bind="args" />
        </div>

        <p style="margin: 0;">The real behaviour with the same data: press <kbd>Tab</kbd> from here. The panel drops down under the logo, stays inside the viewport and shows each link's focus ring.</p>
        <SkipLinks v-bind="args">
          <template #homeLink>
            <a href="#" style="display: inline-block; padding: 0.8rem;">Logo</a>
          </template>
        </SkipLinks>

        <p style="margin: 0;">No usable links (an empty array): nothing renders, not even an empty <code>&lt;nav&gt;</code> landmark.</p>
        <div class="skip-links-force-open" style="outline: 0.1rem dashed currentColor; min-block-size: 2rem;">
          <SkipLinks :links="[]" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      story: { inline: false, height: "900px" },
      description: {
        story:
          "Worst-case `links`. Check: labels wrap instead of running off-screen, the panel is never wider than the viewport, links that share an href both render, entries with an empty href or label are dropped, HTML-like text renders as text, and an empty list leaves no landmark behind. Tab through the second instance to check the reveal and focus rings. The long `ariaLabel` only names the landmark, so it never shows on screen.",
      },
    },
  },
};
