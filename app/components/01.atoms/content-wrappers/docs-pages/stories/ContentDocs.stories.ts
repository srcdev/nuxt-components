import type { Meta, StoryFn } from "@nuxtjs/storybook";
import ContentDocs from "../ContentDocs.vue";
import type { DocsNavItem } from "~/types/components";

interface ContentDocsStoryArgs {
  tag: "div" | "section" | "article" | "main";
  docsNavItems: DocsNavItem[];
  docsPageNavItems: DocsNavItem[];
  docsNavLabel: string;
  docsPageNavLabel: string;
  styleClassPassthrough: string[];
  activeNavItem: string;
  activePageNavItem: string;
}

const defaultNavItems: DocsNavItem[] = [
  { label: "Getting started", to: "/docs", icon: "lucide:rocket" },
  { label: "Installation", to: "/docs/install", icon: "lucide:download" },
  { label: "Configuration", to: "/docs/config" },
  { label: "Theming", to: "/docs/theming", icon: "lucide:palette" },
];

const defaultPageNavItems: DocsNavItem[] = [
  { label: "Overview", to: "/docs#overview", icon: "lucide:eye" },
  { label: "Examples", to: "/docs#examples" },
  { label: "Props", to: "/docs#props", icon: "lucide:settings-2" },
];

export default {
  title: "Atoms/Content Wrappers/ContentDocs",
  component: ContentDocs,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "Root element tag",
      table: { category: "Basic" },
    },
    docsNavItems: {
      control: "object",
      description: "Items rendered in the docsNav panel. The panel is omitted entirely when empty.",
      table: { category: "Nav items" },
    },
    docsPageNavItems: {
      control: "object",
      description: "Items rendered in the docsPageNav panel. The panel is omitted entirely when empty.",
      table: { category: "Nav items" },
    },
    docsNavLabel: {
      control: "text",
      description: "Heading text for the docsNav panel",
      table: { category: "Basic" },
    },
    docsPageNavLabel: {
      control: "text",
      description: "Heading text for the docsPageNav panel",
      table: { category: "Basic" },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Basic" },
    },
    activeNavItem: {
      control: "text",
      description: "The `to` of the currently-active docsNav item",
      table: { category: "Model" },
    },
    activePageNavItem: {
      control: "text",
      description: "The `to` of the currently-active docsPageNav item",
      table: { category: "Model" },
    },
  },
  args: {
    tag: "div",
    docsNavItems: defaultNavItems,
    docsPageNavItems: defaultPageNavItems,
    docsNavLabel: "Navigation",
    docsPageNavLabel: "On this page",
    styleClassPassthrough: [],
    activeNavItem: defaultNavItems[0]?.to,
    activePageNavItem: "",
  },
} as Meta<typeof ContentDocs>;

// ─── Stories ─────────────────────────────────────────────────────────────────

const Template: StoryFn<ContentDocsStoryArgs> = (args) => ({
  components: { ContentDocs },
  setup() {
    const { activeNavItem, activePageNavItem, ...rest } = args;
    const activeNav = ref(activeNavItem);
    const activePageNav = ref(activePageNavItem);
    return { args: rest, activeNav, activePageNav };
  },
  template: `
    <ContentDocs
      v-bind="args"
      v-model:active-nav-item="activeNav"
      v-model:active-page-nav-item="activePageNav"
    >
      <template #docsContent>
        <h3 style="margin-top:0">Docs Content</h3>
        <p>
          Resize this story's preview panel to see the layout switch between mobile, tablet,
          and desktop — thresholds are based on the component's own measured width, not the
          browser viewport, so page decoration elsewhere on a real page won't throw them off.
        </p>
      </template>
    </ContentDocs>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const NoIcons = Template.bind({});
NoIcons.args = {
  docsNavItems: defaultNavItems.map(({ icon: _icon, ...item }) => item),
  docsPageNavItems: defaultPageNavItems.map(({ icon: _icon, ...item }) => item),
};

export const NavOnly = Template.bind({});
NavOnly.args = {
  docsPageNavItems: [],
};

export const PageNavOnly = Template.bind({});
PageNavOnly.args = {
  docsNavItems: [],
};

export const CustomLabels = Template.bind({});
CustomLabels.args = {
  docsNavLabel: "Sections",
  docsPageNavLabel: "Contents",
};

export const IconAtEnd: StoryFn<ContentDocsStoryArgs> = (args) => ({
  components: { ContentDocs },
  setup() {
    const { activeNavItem, activePageNavItem, ...rest } = args;
    const activeNav = ref(activeNavItem);
    const activePageNav = ref(activePageNavItem);
    return { args: { ...rest, styleClassPassthrough: ["icon-at-end-demo"] }, activeNav, activePageNav };
  },
  template: `
    <div>
      <style>
        .content-docs.icon-at-end-demo {
          --docs-nav-link-icon-order: rtl;
          --docs-page-nav-link-icon-order: rtl;
        }
      </style>
      <ContentDocs
        v-bind="args"
        v-model:active-nav-item="activeNav"
        v-model:active-page-nav-item="activePageNav"
      >
        <template #docsContent>
          <h3 style="margin-top:0">Docs Content</h3>
          <p>
            <code>--docs-nav-link-icon-order: rtl</code> moves the icon to the end of each
            link instead of the start (default <code>ltr</code>).
          </p>
        </template>
      </ContentDocs>
    </div>
  `,
});
IconAtEnd.args = {};
