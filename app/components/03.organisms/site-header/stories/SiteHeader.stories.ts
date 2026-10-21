import { ref } from "vue";
import SiteHeader from "../SiteHeader.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof SiteHeader> = {
  title: "Organisms/Site Header",
  component: SiteHeader,
  argTypes: {
    responsiveNavLinks: {
      control: "object",
      description: "Nav groups keyed by name — each item is either a link (`path`) or a dropdown (`childLinks`)",
    },
    gapBetweenFirstAndSecondNav: {
      control: { type: "number", min: 0, step: 4 },
      description: "Gap in pixels between the first and second nav groups",
    },
    collapseAtMainNavIntersection: {
      control: "boolean",
      description: "Collapse the main nav into the overflow burger menu once it no longer fits",
    },
    allowExpandOnGesture: {
      control: "boolean",
      description: "Allow the collapsed nav to expand on touch/gesture",
    },
    pageRowVariant: {
      control: { type: "radio" },
      options: ["full", "popout", "content", "inset-content"],
      description: "Variant forwarded to the root PageRow",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Extra CSS classes applied to the root PageRow (targets --site-header-* tokens)",
    },
    navStyleClassPassthrough: {
      control: "object",
      description: "Extra CSS classes applied to the nested ResponsiveHeader (targets its own token API)",
    },
    homeNavAriaLabel: {
      control: "text",
      description: "Accessible name of the branding nav landmark",
      table: { category: "Accessibility", defaultValue: { summary: "Home navigation" } },
    },
    overflowButtonLabel: {
      control: "text",
      description: "Accessible name of the burger button (forwarded to ResponsiveHeader)",
      table: { category: "Accessibility", defaultValue: { summary: "More navigation" } },
    },
  },
  args: {
    pageRowVariant: "content",
    gapBetweenFirstAndSecondNav: 12,
    collapseAtMainNavIntersection: false,
    allowExpandOnGesture: true,
    styleClassPassthrough: [],
    navStyleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Site header row: a `#branding` slot inside a skip-links nav, then `ResponsiveHeader` for the main navigation, all inside a `PageRow`. " +
          "Props: `responsiveNavLinks` (nav groups), `pageRowVariant`, collapse options forwarded to `ResponsiveHeader`, and label props for every landmark and button. " +
          "Slots: `branding`, `secondaryNavigation`. Make it sticky with `--site-header-position: sticky` on the passthrough class.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {
  args: {
    responsiveNavLinks: {
      firstNav: [
        {
          name: "Components",
          childLinksTitle: "UI Components",
          childLinks: [
            { name: "Buttons", path: "/forms/examples/buttons" },
            { name: "Tabs", path: "/ui/tabs" },
            { name: "Carousels", path: "/ui/carousel-basic" },
          ],
        },
        { name: "Typography", path: "/typography/page-heading" },
      ],
      secondNav: [{ name: "Contact", path: "#" }],
    },
  },
  render: (args) => ({
    components: { SiteHeader },
    setup() {
      return { args };
    },
    template: `
      <SiteHeader v-bind="args">
        <template #branding>
          <a href="/" style="color:inherit;text-decoration:none;font-weight:600">Brand</a>
        </template>
      </SiteHeader>
    `,
  }),
};

/** A single flat nav group with no dropdowns — the shape a lighter, few-page site would use. */
export const SimpleFlatNav: Story = {
  name: "Simple Flat Nav (no dropdowns)",
  args: {
    responsiveNavLinks: {
      main: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Contact", path: "/contact" },
      ],
    },
  },
  render: (args) => ({
    components: { SiteHeader },
    setup() {
      return { args };
    },
    template: `
      <SiteHeader v-bind="args">
        <template #branding>
          <a href="/" style="color:inherit;text-decoration:none;font-weight:600">Brand</a>
        </template>
      </SiteHeader>
    `,
  }),
};

export const WithSecondaryNavigationSlot: Story = {
  name: "With secondaryNavigation slot",
  args: {
    responsiveNavLinks: {
      firstNav: [{ name: "Home", path: "/" }],
    },
  },
  render: (args) => ({
    components: { SiteHeader },
    setup() {
      return { args };
    },
    template: `
      <SiteHeader v-bind="args">
        <template #branding>
          <a href="/" style="color:inherit;text-decoration:none;font-weight:600">Brand</a>
        </template>
        <template #secondaryNavigation>
          <a href="/settings" aria-label="Settings">⚙</a>
        </template>
      </SiteHeader>
    `,
  }),
};

const brandingTemplate = `<a href="/" style="color:inherit;text-decoration:none;font-weight:600">{{ brand }}</a>`;

export const Sticky: Story = {
  name: "Sticky (--site-header-position)",
  args: {
    styleClassPassthrough: ["site-header-sticky-demo"],
    responsiveNavLinks: {
      main: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ],
    },
  },
  render: (args) => ({
    components: { SiteHeader },
    setup() {
      return { args, brand: "Brand" };
    },
    template: `
      <div>
        <SiteHeader
          v-bind="args"
          style="--site-header-position: sticky; --site-header-bg: var(--theme-surface-subtle); --site-header-padding-block: 1.2rem;"
        >
          <template #branding>${brandingTemplate}</template>
        </SiteHeader>
        <div style="padding: 2.4rem; display: grid; gap: 1.6rem;">
          <p v-for="n in 40" :key="n" style="margin: 0;">Scroll the page: the header stays pinned to the top. Paragraph {{ n }}.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "480px" },
      description: {
        story:
          "`--site-header-position: sticky` on the root. Until 2026-10-21 the sticky rule sat on the inner `<header>`, whose parent is exactly its height, so it never stuck; it now sits on the outer `.site-header-row`.",
      },
    },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    responsiveNavLinks: {
      firstNav: [
        { name: "Dienstleistungsübersicht", path: "/a" },
        {
          name: "Behandlungen und Pflegeangebote",
          childLinksTitle: "Alle Behandlungen in Northtown",
          childLinks: [
            { name: "Supercalifragilisticexpialidociousandthensome", path: "/b1" },
            { name: "🙂 Emoji link", path: "/b2" },
            { name: "<b>Not bold</b>", path: "/b3" },
          ],
        },
        { name: "مرحبا", path: "/c" },
        { name: "x", path: "/d" },
        ...Array.from({ length: 8 }, (_, i) => ({ name: `Item ${i + 1}`, path: `/item-${i + 1}` })),
      ],
      secondNav: [
        { name: "Contact", path: "/contact" },
        { name: "Contact", path: "/contact" },
      ],
    },
    collapseAtMainNavIntersection: true,
  },
  render: (args) => ({
    components: { SiteHeader },
    setup() {
      return { args, brand: "Alex Morgan Hair, Beauty and Wellbeing Studio of Northtown" };
    },
    template: `
      <SiteHeader v-bind="args">
        <template #branding>${brandingTemplate}</template>
      </SiteHeader>
    `,
  }),
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    initialCanvas: "tabletCanvas",
    docs: {
      story: { inline: false, height: "520px" },
      description: {
        story:
          "A long brand name and 14 hostile nav items at every `CanvasSwitcher` width, with `collapseAtMainNavIntersection` on. Check that: the brand column takes at most half the row " +
          "(`--site-header-branding-max-width`) and wraps instead of squeezing the nav to nothing; the nav collapses into the burger rather than overflowing; " +
          "the long German, emoji, `<b>` and right-to-left labels render as text and wrap in the dropdown; the duplicate `Contact` links both render. " +
          "Set `responsiveNavLinks` to `{}` in Controls: the header shows just the brand.",
      },
    },
  },
};
