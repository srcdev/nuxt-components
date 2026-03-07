import LinkText from "../LinkText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof LinkText> = {
  title: "Atoms/Text Blocks/LinkText",
  component: LinkText,
  argTypes: {
    to: {
      control: "text",
      description: "Link destination (internal path or external URL)",
    },
    linkText: {
      control: "text",
      description: "Visible link label",
    },
    external: {
      control: "boolean",
      description: "Force external link handling",
      defaultValue: false,
    },
    target: {
      control: { type: "select" },
      options: [undefined, "_blank", "_self"],
      description: "Link target attribute",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional classes",
      defaultValue: [],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LinkText>;

export const Default: Story = {
  args: {
    to: "/",
    linkText: "Read More",
    external: false,
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { LinkText },
    setup() {
      return { args };
    },
    template: `<LinkText v-bind="args" />`,
  }),
};

export const WithLeftIcon: Story = {
  args: {
    to: "/",
    linkText: "Go Back",
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { LinkText },
    setup() {
      return { args };
    },
    template: `
      <LinkText v-bind="args">
        <template #left>
          <Icon name="lucide:arrow-left" />
        </template>
      </LinkText>
    `,
  }),
};

export const WithRightIcon: Story = {
  args: {
    to: "/",
    linkText: "Learn More",
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { LinkText },
    setup() {
      return { args };
    },
    template: `
      <LinkText v-bind="args">
        <template #right>
          <Icon name="lucide:arrow-right" />
        </template>
      </LinkText>
    `,
  }),
};

export const WithBothIcons: Story = {
  args: {
    to: "/",
    linkText: "Explore",
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { LinkText },
    setup() {
      return { args };
    },
    template: `
      <LinkText v-bind="args">
        <template #left>
          <Icon name="lucide:sparkles" />
        </template>
        <template #right>
          <Icon name="lucide:arrow-right" />
        </template>
      </LinkText>
    `,
  }),
};

export const ExternalLink: Story = {
  args: {
    to: "https://nuxt.com",
    linkText: "Nuxt Docs",
    external: true,
    target: "_blank",
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { LinkText },
    setup() {
      return { args };
    },
    template: `
      <LinkText v-bind="args">
        <template #right>
          <Icon name="lucide:external-link" />
        </template>
      </LinkText>
    `,
  }),
};
