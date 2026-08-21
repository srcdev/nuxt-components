import NavigationItems from "../NavigationItems.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { ResponsiveHeaderState } from "../../../../types/components";

const mainNavigationState: ResponsiveHeaderState = {
  hasSecondNav: true,
  navListVisibility: { firstNav: false, secondNav: false },
  clonedNavLinks: {
    firstNav: [
      { name: "Home", path: "/", config: { left: 0, right: 0, width: 0, visible: false } },
      { name: "About", path: "/about", config: { left: 0, right: 0, width: 0, visible: false } },
      {
        name: "Components",
        childLinksTitle: "UI Components",
        childLinks: [
          { name: "Buttons", path: "/forms/examples/buttons" },
          { name: "Tabs", path: "/ui/tabs" },
        ],
        config: { left: 0, right: 0, width: 0, visible: false },
      },
    ],
    secondNav: [{ name: "Contact", path: "/contact", config: { left: 0, right: 0, width: 0, visible: false } }],
  },
};

const meta: Meta<typeof NavigationItems> = {
  title: "Organisms/Responsive Header/Navigation Items",
  component: NavigationItems,
  parameters: {
    docs: {
      description: {
        component:
          "Internal panel rendered inside ResponsiveHeader's overflow burger menu — not typically used standalone. " +
          "Shows the *complement* of ResponsiveHeader's main nav: an item appears here only when its `config.visible` " +
          "is `false` in the main bar.",
      },
    },
  },
  argTypes: {
    mainNavigationState: {
      control: "object",
      description: "Shared geometry/visibility state, normally supplied by the parent ResponsiveHeader",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Extra CSS classes applied to the root element",
    },
  },
  args: {
    mainNavigationState,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof NavigationItems>;

export const Default: Story = {};

export const MixedVisibility: Story = {
  name: "Mixed Visibility (only hidden items shown)",
  args: {
    mainNavigationState: {
      hasSecondNav: false,
      navListVisibility: { firstNav: false },
      clonedNavLinks: {
        firstNav: [
          { name: "Home", path: "/", config: { left: 0, right: 0, width: 0, visible: true } },
          { name: "About", path: "/about", config: { left: 0, right: 0, width: 0, visible: false } },
          { name: "Contact", path: "/contact", config: { left: 0, right: 0, width: 0, visible: false } },
        ],
      },
    },
  },
};

export const Empty: Story = {
  name: "Empty (nothing collapsed)",
  args: { mainNavigationState: { hasSecondNav: false, navListVisibility: {}, clonedNavLinks: {} } },
};
