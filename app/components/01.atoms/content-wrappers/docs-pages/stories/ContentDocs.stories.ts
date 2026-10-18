import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import ContentDocs from "../ContentDocs.vue";
import CanvasSwitcher from "../../../canvas-switcher/CanvasSwitcher.vue";
import type { DocsNavItem, MediaCanvas } from "~/types/components";

interface ContentDocsStoryArgs {
  tag: "div" | "section" | "article" | "main";
  docsNavItems: DocsNavItem[];
  docsPageNavItems: DocsNavItem[];
  docsNavLabel: string;
  docsPageNavLabel: string;
  docsNavAriaLabel: string;
  docsPageNavAriaLabel: string;
  panelVariant: "modern" | "classic";
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
      table: { category: "Copy" },
    },
    docsPageNavLabel: {
      control: "text",
      description: "Heading text for the docsPageNav panel",
      table: { category: "Copy" },
    },
    docsNavAriaLabel: {
      control: "text",
      description: "aria-label on the docsNav `<nav>` landmark. Override for localisation",
      table: { category: "Copy" },
    },
    docsPageNavAriaLabel: {
      control: "text",
      description: "aria-label on the docsPageNav `<nav>` landmark. Override for localisation",
      table: { category: "Copy" },
    },
    panelVariant: {
      control: { type: "select" },
      options: ["classic", "modern"],
      description:
        "Collapsible panel implementation. `classic` (default) works on WebKit; `modern` uses `::details-content`, which Safari drops",
      table: { category: "Basic" },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Basic" },
    },
    activeNavItem: {
      control: "text",
      description: "The `to` of the currently-active docsNav item (`v-model:active-nav-item`)",
      table: { category: "Model" },
    },
    activePageNavItem: {
      control: "text",
      description: "The `to` of the currently-active docsPageNav item (`v-model:active-page-nav-item`)",
      table: { category: "Model" },
    },
  },
  args: {
    tag: "div",
    docsNavItems: defaultNavItems,
    docsPageNavItems: defaultPageNavItems,
    docsNavLabel: "Navigation",
    docsPageNavLabel: "On this page",
    docsNavAriaLabel: "Docs navigation",
    docsPageNavAriaLabel: "On this page",
    panelVariant: "classic",
    styleClassPassthrough: [],
    activeNavItem: defaultNavItems[0]?.to,
    activePageNavItem: "",
  },
  decorators: [
    // Breakpoints are container queries on the component's own width, so a constrained wrapper stands in for a narrower viewport.
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
        <div :class="canvasName" style="margin-inline: auto; padding: 1.6rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A three-area docs layout: a site-level `docsNavItems` list, an on-this-page `docsPageNavItems` list, and the `docsContent` slot. Breakpoints follow the component's own width (container queries, mirrored in script): below 768px both navs are collapsible panels that overlay the content, from 768px the page nav is pinned open in a right-hand column, and from 1024px both are pinned open in three columns. The active link in each list is a `v-model` (`activeNavItem`, `activePageNavItem`) and gets `aria-current=\"page\"`. Headings and landmark labels are props for localisation, and `panelVariant` picks the collapsible implementation (`classic` by default, for WebKit).",
      },
    },
  },
} as Meta<typeof ContentDocs>;

// ─── Stories ─────────────────────────────────────────────────────────────────

// `args` is Storybook's own reactive object — bind to it directly (`args.x`) rather than
// destructuring it into local variables/refs, which would snapshot the values once at setup()
// and stop reflecting later Controls-panel changes.
const Template: StoryFn<ContentDocsStoryArgs> = (args) => ({
  components: { ContentDocs },
  setup() {
    return { args };
  },
  template: `
    <ContentDocs
      v-bind="args"
      v-model:active-nav-item="args.activeNavItem"
      v-model:active-page-nav-item="args.activePageNavItem"
    >
      <template #docsContent>
        <h3 style="margin-top:0">Docs Content</h3>
        <p>
          Switch canvas above to see the layout change between mobile, tablet and desktop. The
          thresholds follow the component's own width, not the browser viewport.
        </p>
      </template>
    </ContentDocs>
  `,
});

const story = (text: string) => ({ docs: { description: { story: text } } });

export const Default = Template.bind({});
Default.args = {};
Default.parameters = story("Both navs with icons on some items, the first docs link active.");

export const NoIcons = Template.bind({});
NoIcons.args = {
  docsNavItems: defaultNavItems.map(({ icon: _icon, ...item }) => item),
  docsPageNavItems: defaultPageNavItems.map(({ icon: _icon, ...item }) => item),
};
NoIcons.parameters = story("No item has an icon: the icon column stays reserved, so labels still line up.");

export const NavOnly = Template.bind({});
NavOnly.args = {
  docsPageNavItems: [],
};
NavOnly.parameters = story("An empty `docsPageNavItems` omits the page nav entirely.");

export const PageNavOnly = Template.bind({});
PageNavOnly.args = {
  docsNavItems: [],
};
PageNavOnly.parameters = story("An empty `docsNavItems` omits the docs nav entirely.");

export const CustomLabels = Template.bind({});
CustomLabels.args = {
  docsNavLabel: "Sections",
  docsPageNavLabel: "Contents",
};
CustomLabels.parameters = story("Custom panel headings via `docsNavLabel` and `docsPageNavLabel`.");

export const IconAtEnd: StoryFn<ContentDocsStoryArgs> = (args) => ({
  components: { ContentDocs },
  setup() {
    const componentArgs = computed(() => ({ ...args, styleClassPassthrough: ["icon-at-end-demo"] }));
    return { args, componentArgs };
  },
  template: `
    <div>
      <style>
        .content-docs.icon-at-end-demo {
          --content-docs-nav-link-icon-order: rtl;
          --content-docs-page-nav-link-icon-order: rtl;
        }
      </style>
      <ContentDocs
        v-bind="componentArgs"
        v-model:active-nav-item="args.activeNavItem"
        v-model:active-page-nav-item="args.activePageNavItem"
      >
        <template #docsContent>
          <h3 style="margin-top:0">Docs Content</h3>
          <p>
            <code>--content-docs-nav-link-icon-order: rtl</code> moves the icon to the end of each
            link instead of the start (default <code>ltr</code>).
          </p>
        </template>
      </ContentDocs>
    </div>
  `,
});
IconAtEnd.args = {};
IconAtEnd.parameters = story(
  "`--content-docs-nav-link-icon-order: rtl` (and the page-nav equivalent) puts each icon after its label."
);

const stressNavItems: DocsNavItem[] = [
  { label: "Bevorzugtekontaktmethodefürrückfragenundterminvereinbarungen", to: "/docs/a", icon: "lucide:rocket" },
  { label: "https://example.com/a/very/long/path/that/never/breaks/naturally/at/all", to: "/docs/b" },
  { label: "😀 Emoji first", to: "/docs/c", icon: "lucide:smile" },
  { label: "<b>not bold</b>", to: "/docs/d" },
  { label: "طريقة الاتصال المفضلة", to: "/docs/e", icon: "lucide:globe" },
  { label: "", to: "/docs/f" },
  { label: "x", to: "/docs/g" },
  { label: "Duplicate destination", to: "/docs/a" },
  { label: "Broken icon name", to: "/docs/h", icon: "lucide:does-not-exist" },
  ...Array.from({ length: 30 }, (_, i) => ({ label: `Generated page ${i + 1}`, to: `/docs/generated-${i + 1}` })),
];

const stressPageNavItems: DocsNavItem[] = [
  { label: "Ein sehr langer Abschnittstitel, der in einer schmalen Spalte umbrechen muss", to: "/docs#one" },
  { label: "Abschnittohneleerzeichendernichtumbrechenkannundtrotzdempassenmuss", to: "/docs#two" },
  { label: "طريقة الاتصال", to: "/docs#three" },
];

export const StressTest: StoryFn<ContentDocsStoryArgs> = (args) => ({
  components: { ContentDocs },
  setup() {
    return { args };
  },
  template: `
    <ContentDocs
      v-bind="args"
      v-model:active-nav-item="args.activeNavItem"
      v-model:active-page-nav-item="args.activePageNavItem"
    >
      <template #docsContent>
        <h1 style="margin-top:0">Dokumentationsseitenüberschriftohneleerzeichen</h1>
        <p>https://example.com/an/unbroken/url/in/the/content/slot/that/would/otherwise/widen/the/middle/column</p>
        <p>Slot content is the consumer's own markup: the wide table below scrolls in its own wrapper rather than stretching the grid.</p>
        <div style="overflow-x: auto;">
          <table style="min-width: 80rem; border-collapse: collapse;">
            <tr><th style="text-align:start">Prop</th><th style="text-align:start">Type</th><th style="text-align:start">Default</th><th style="text-align:start">Description</th></tr>
            <tr><td>docsNavItems</td><td>DocsNavItem[]</td><td>[]</td><td>Items rendered in the docs nav panel</td></tr>
          </table>
        </div>
      </template>
    </ContentDocs>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  docsNavItems: stressNavItems,
  docsPageNavItems: stressPageNavItems,
  docsNavLabel: "Dokumentationsnavigationüberschriftohneleerzeichen 😀",
  docsPageNavLabel: "<i>Auf dieser Seite</i>",
  docsNavAriaLabel: "Dokumentationsnavigation",
  docsPageNavAriaLabel: "Auf dieser Seite",
  activeNavItem: "/docs/a",
  activePageNavItem: "/docs#two",
};
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  docs: {
    story: { inline: false, height: "900px" },
    description: {
      story:
        "39 docs links (unbroken German, a long URL, emoji first, HTML-like and right-to-left labels, an empty label, a one-character label, a duplicate `to`, an unknown icon name) and three page links, with an unbroken heading. Check at every canvas width: unbroken text wraps inside its link and never widens a column, right-to-left labels read and align right-to-left, markup renders as text, both links sharing `/docs/a` show as active, and the unbroken heading and URL in the content slot wrap instead of widening the middle column at tablet and desktop. The empty label renders a thin link with no accessible name: the component can't invent one, so filter empty labels out of your data. Link labels have no line-clamp token on purpose: they name their destinations.",
    },
  },
};
