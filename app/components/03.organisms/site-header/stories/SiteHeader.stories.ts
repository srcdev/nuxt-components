import SiteHeader from "../SiteHeader.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

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
  },
  args: {
    pageRowVariant: "content",
    gapBetweenFirstAndSecondNav: 12,
    collapseAtMainNavIntersection: false,
    allowExpandOnGesture: true,
    styleClassPassthrough: [],
    navStyleClassPassthrough: [],
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
