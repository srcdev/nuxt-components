import DeepExpandingMenu from "../DeepExpandingMenu.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { ResponsiveHeaderNavItem } from "~/types/components";

const navLinks: ResponsiveHeaderNavItem[] = [
  { name: "Home", path: "/" },
  {
    name: "Services",
    childLinksTitle: "Our services",
    childLinks: [
      { name: "Haircuts", path: "/services/haircuts" },
      { name: "Colouring", path: "/services/colouring" },
      { name: "Styling", path: "/services/styling" },
    ],
  },
  { name: "Contact", path: "/contact" },
];

const meta: Meta<typeof DeepExpandingMenu> = {
  title: "Molecules/DeepExpandingMenu",
  component: DeepExpandingMenu,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "nav", "ul", "ol"],
      description: "Root element tag",
      table: { category: "Basic" },
    },
    navLinks: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    tag: "nav",
    navLinks,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Modern implementation of a top-level nav with expanding child-link panels, using CSS anchor-positioning and the Popover API. See `DeepExpandingMenuClassic` for a `<details>`-based fallback with wider browser support.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeepExpandingMenu>;

export const Default: Story = {
  render: (args) => ({
    components: { DeepExpandingMenu },
    setup() {
      return { args };
    },
    template: `<DeepExpandingMenu v-bind="args" style="padding: 4rem;" />`,
  }),
};

export const CustomColours: Story = {
  render: (args) => ({
    components: { DeepExpandingMenu },
    setup() {
      return { args };
    },
    template: `
      <DeepExpandingMenu
        v-bind="args"
        style="padding: 4rem; --deep-expanding-menu-panel-background-colour: #1a1a1a; --deep-expanding-menu-panel-border-colour: transparent; --deep-expanding-menu-group-link-colour: white; --deep-expanding-menu-panel-heading-colour: #aaaaaa;"
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Overriding the public tokens via inline `--deep-expanding-menu-*` custom properties.",
      },
    },
  },
};
