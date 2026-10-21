import { computed, ref } from "vue";
import DeepExpandingMenu from "../DeepExpandingMenu.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas, ResponsiveHeaderNavItem } from "~/types/components";

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

const stressNavLinks: ResponsiveHeaderNavItem[] = [
  { name: "H", path: "/" },
  {
    name: "Dienstleistungsangebotsübersichtsseite",
    childLinksTitle:
      "Unsere vollständige Übersicht aller Dienstleistungen, Behandlungen und Pflegeangebote für Haut und Haar in Northtown",
    childLinks: [
      { name: "Haarschnitt", path: "/services/haircuts" },
      { name: "https://example.com/a/very/long/unbroken/path/that/never/wraps/on/its/own", path: "/long-url" },
      { name: "🎨 Colouring", path: "/services/colouring" },
      { name: "Styling", path: "/services/styling-1" },
      { name: "Styling", path: "/services/styling-2" },
      { name: "<b>Not bold</b>", path: "/services/html" },
      { name: "قص الشعر", path: "/services/rtl" },
      ...Array.from({ length: 24 }, (_, i) => ({ name: `Treatment ${i + 1}`, path: `/services/treatment-${i + 1}` })),
    ],
  },
  { name: "Gruppe ohne Titel", childLinks: [{ name: "Only link", path: "/only" }] },
  { name: "Empty group", childLinksTitle: "Nothing here yet", childLinks: [] },
  { name: "Supercalifragilisticexpialidociousandthensomemoretext", path: "/unbroken" },
  { name: "🙂", path: "/emoji" },
  { name: "Contact", path: "/contact" },
  { name: "Contact", path: "/contact" },
  {
    name: "About us and our story",
    childLinksTitle: "About Alex Morgan",
    childLinks: [
      { name: "Team", path: "/about/team" },
      { name: "History", path: "/about/history" },
    ],
  },
];

type LineClamp = "none" | "1" | "2" | "3";

// Story-only arg: drives a CSS token, not a DeepExpandingMenu prop. See the argTypes entry.
type StoryArgs = InstanceType<typeof DeepExpandingMenu>["$props"] & {
  headingLineClamp: LineClamp;
};

const meta: Meta<StoryArgs> = {
  title: "Molecules/DeepExpandingMenu",
  component: DeepExpandingMenu,
  argTypes: {
    headingLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--deep-expanding-menu-panel-heading-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.site-nav { --deep-expanding-menu-panel-heading-line-clamp: 1; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
    tag: {
      control: { type: "select" },
      options: ["div", "section", "nav"],
      description: "Root element tag",
      table: { category: "Basic", defaultValue: { summary: "nav" } },
    },
    ariaLabel: {
      control: "text",
      description: "Accessible name for the root. Set it when the page has more than one `<nav>`",
      table: { category: "Basic" },
    },
    navLinks: {
      control: "object",
      description: "Top-level items: `path` renders a link, `childLinks` renders a toggle and panel",
      table: { category: "Content" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    tag: "nav",
    navLinks,
    headingLineClamp: "none",
  },
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
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
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
          "Top-level nav row where each item is a direct link (`path`) or a toggle that opens a panel of child links (`childLinks`, with an optional `childLinksTitle` heading). " +
          "Built on CSS anchor positioning and the Popover API, with a JS fallback for Safari 16-18. Props: `navLinks`, `tag`, `ariaLabel`. " +
          "See `DeepExpandingMenuClassic` for the `<details>`-based alternative.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { headingLineClamp: _headingLineClamp, ...rest } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--deep-expanding-menu-panel-heading-line-clamp": args.headingLineClamp,
  }));
  return { componentArgs, tokenStyles };
}

const render = (args: StoryArgs) => ({
  components: { DeepExpandingMenu },
  setup() {
    return useStorySetup(args);
  },
  template: `<div :style="tokenStyles"><DeepExpandingMenu v-bind="componentArgs" /></div>`,
});

export const Default: Story = {
  render,
};

export const CustomColours: Story = {
  name: "Custom Colours",
  render: (args) => ({
    components: { DeepExpandingMenu },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div
        :style="tokenStyles"
        style="--deep-expanding-menu-panel-background-colour: #1a1a1a; --deep-expanding-menu-panel-border-colour: transparent; --deep-expanding-menu-group-link-colour: white; --deep-expanding-menu-group-link-border-colour-hover: white; --deep-expanding-menu-panel-heading-colour: #aaaaaa;"
      >
        <DeepExpandingMenu v-bind="componentArgs" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Overriding the public `--deep-expanding-menu-*` tokens on a wrapper element.",
      },
    },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    navLinks: stressNavLinks,
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "720px" },
      description: {
        story:
          "Hostile nav data at every `CanvasSwitcher` width. Check that: the top-level row wraps instead of overflowing; " +
          "the long German label and the unbroken word break inside the canvas; the caret stays beside a wrapped toggle label; " +
          "the first panel's long heading wraps (try the story-only `headingLineClamp` CSS token control), its unbroken URL link stays inside the panel, " +
          "`<b>Not bold</b>` renders as text, the right-to-left link reads correctly, and its 31 links scroll inside the panel; " +
          "duplicate `Styling` and `Contact` items both render; a group without a title shows its list only; " +
          "an empty group opens with its heading and no list; the last group's panel flips to stay on screen near the right edge.",
      },
    },
  },
};
