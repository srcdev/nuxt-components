import DeepExpandingMenuClassic from "../DeepExpandingMenuClassic.vue";
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

const meta: Meta<typeof DeepExpandingMenuClassic> = {
  title: "Molecules/DeepExpandingMenuClassic",
  component: DeepExpandingMenuClassic,
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
          "`<details>`/`<summary>`-based fallback implementation of `DeepExpandingMenu`, using `onClickOutside` to close an open group instead of CSS anchor-positioning/Popover API — use this when the modern implementation's browser support (see its own docs) isn't acceptable.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeepExpandingMenuClassic>;

export const Default: Story = {
  render: (args) => ({
    components: { DeepExpandingMenuClassic },
    setup() {
      return { args };
    },
    template: `<DeepExpandingMenuClassic v-bind="args" style="padding: 4rem;" />`,
  }),
};

export const CustomColours: Story = {
  render: (args) => ({
    components: { DeepExpandingMenuClassic },
    setup() {
      return { args };
    },
    template: `
      <DeepExpandingMenuClassic
        v-bind="args"
        style="padding: 4rem; --deep-expanding-menu-classic-panel-background-colour: #1a1a1a; --deep-expanding-menu-classic-panel-border-colour: transparent; --deep-expanding-menu-classic-group-link-colour: white; --deep-expanding-menu-classic-panel-heading-colour: #aaaaaa;"
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Overriding the public tokens via inline `--deep-expanding-menu-classic-*` custom properties.",
      },
    },
  },
};
