import SkipLinks from "../SkipLinks.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { SkipLink } from "~/types/components";

const meta: Meta<typeof SkipLinks> = {
  title: "Atoms/Navigation/SkipLinks",
  component: SkipLinks,
  argTypes: {
    links: {
      control: "object",
      description: "Ordered list of { href, label } skip targets",
    },
    ariaLabel: {
      control: "text",
      description: "aria-label on the nav landmark — override for localisation",
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
          "An accessibility utility that renders a set of visually-hidden links revealed only on keyboard focus, letting keyboard/screen-reader users jump past repeated navigation straight to main content, the footer, or any other in-page target. The links are placed first in the DOM — consumers should place `<SkipLinks>` at the very top of their page layout.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkipLinks>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { SkipLinks },
    setup() {
      return { args };
    },
    template: `
      <div>
        <p style="padding: 2rem; text-align: center;">
          The skip links below are visually hidden until focused. Click into this preview, then
          press <kbd>Tab</kbd> to reveal them.
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
      <div>
        <p style="padding: 2rem; text-align: center;">
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
        story: "Forces the skip-nav panel open via `:focus-within` emulation so it can be inspected without tabbing — for visual review only, not representative of real usage.",
      },
    },
  },
  render: (args) => ({
    components: { SkipLinks },
    setup() {
      return { args };
    },
    template: `
      <div>
        <style>
          .always-visible-demo .skip-links__nav {
            opacity: 1 !important;
            transform: translateY(0) !important;
            position: static !important;
          }
        </style>
        <div class="always-visible-demo">
          <SkipLinks v-bind="args" />
        </div>
      </div>
    `,
  }),
};
