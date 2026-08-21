import ResponsiveHeader from "../ResponsiveHeader.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ResponsiveHeader> = {
  title: "Organisms/Responsive Header",
  component: ResponsiveHeader,
  argTypes: {
    responsiveNavLinks: {
      control: "object",
      description: "Nav groups keyed by name — each item is either a link (`path`) or a dropdown (`childLinks`)",
    },
    gapBetweenFirstAndSecondNav: {
      control: { type: "number", min: 0, step: 4 },
      description: "Gap in pixels reserved between the first and second nav groups",
    },
    overflowDetailsSummaryIcons: {
      control: "object",
      description: "Icon names for the overflow button's two states: `more` (some items collapsed) and `burger`",
    },
    collapseBreakpoint: {
      control: { type: "number" },
      description: "Fixed pixel width below which the whole main nav collapses into the overflow burger menu",
    },
    collapseAtMainNavIntersection: {
      control: "boolean",
      description: "Collapse the whole main nav into the overflow burger menu once it no longer fits its container",
    },
    allowExpandOnGesture: {
      control: "boolean",
      description: "Allow a dropdown to open on hover/focus, not just click",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Extra CSS classes applied to the root element",
    },
  },
  args: {
    gapBetweenFirstAndSecondNav: 12,
    collapseBreakpoint: null,
    collapseAtMainNavIntersection: false,
    allowExpandOnGesture: true,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveHeader>;

const responsiveNavLinks = {
  firstNav: [
    { name: "Home", path: "/" },
    {
      name: "Components",
      iconName: "material-symbols:widgets",
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
};

export const Default: Story = {
  args: { responsiveNavLinks },
};

/** Constrains the canvas so some items must collapse into the overflow burger menu —
 * the same behaviour a narrow viewport triggers in a real page, not a bug. */
export const ConstrainedWidth: Story = {
  name: "Constrained Width (items overflow)",
  args: { responsiveNavLinks },
  render: (args) => ({
    components: { ResponsiveHeader },
    setup() {
      return { args };
    },
    template: `<div style="max-width: 420px"><ResponsiveHeader v-bind="args" /></div>`,
  }),
};

export const CustomOverflowIcons: Story = {
  args: {
    responsiveNavLinks,
    overflowDetailsSummaryIcons: { more: "mdi:dots-horizontal", burger: "mdi:menu" },
  },
};

export const WithSecondaryNavigationSlot: Story = {
  name: "With secondaryNavigation slot",
  args: { responsiveNavLinks },
  render: (args) => ({
    components: { ResponsiveHeader },
    setup() {
      return { args };
    },
    template: `
      <ResponsiveHeader v-bind="args">
        <template #secondaryNavigation>
          <a href="/settings" aria-label="Settings">⚙</a>
        </template>
      </ResponsiveHeader>
    `,
  }),
};

export const SingleFlatGroup: Story = {
  name: "Single Flat Group (no dropdowns)",
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
};
