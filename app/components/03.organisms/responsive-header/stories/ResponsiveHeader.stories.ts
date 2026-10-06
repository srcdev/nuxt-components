import { computed, ref } from "vue";
import ResponsiveHeader from "../ResponsiveHeader.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas, ResponsiveHeaderProp } from "~/types/components";

type MainNavJustify = "space-between" | "flex-start" | "safe center" | "safe end";

// Story-only arg: drives a CSS token, not a ResponsiveHeader prop. See the argTypes entry.
type StoryArgs = InstanceType<typeof ResponsiveHeader>["$props"] & {
  mainNavJustifyContent: MainNavJustify;
};

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { mainNavJustifyContent: _mainNavJustifyContent, ...rest } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--responsive-header-main-nav-justify-content": args.mainNavJustifyContent,
  }));
  return { componentArgs, tokenStyles };
}

const renderWith = (template: string) => (args: StoryArgs) => ({
  components: { ResponsiveHeader },
  setup() {
    return useStorySetup(args);
  },
  template: `<div :style="tokenStyles">${template}</div>`,
});

const render = renderWith(`<ResponsiveHeader v-bind="componentArgs" />`);

const meta: Meta<StoryArgs> = {
  title: "Organisms/Responsive Header",
  component: ResponsiveHeader,
  argTypes: {
    mainNavJustifyContent: {
      control: "select",
      options: ["space-between", "flex-start", "safe center", "safe end"] satisfies MainNavJustify[],
      description:
        "**Story control, not a prop.** Sets the `--responsive-header-main-nav-justify-content` CSS token on a wrapper. " +
        "To use it in an app, set the token in your own CSS, e.g. `.site-nav { --responsive-header-main-nav-justify-content: flex-start; }`. " +
        "Use `safe end` / `safe center` rather than plain `end` / `center`, so items that don't fit aren't clipped off the start edge.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "space-between" } },
    },
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
    mainNavAriaLabel: { control: "text", table: { category: "Labels", defaultValue: { summary: "Main navigation" } } },
    secondaryNavAriaLabel: { control: "text", table: { category: "Labels", defaultValue: { summary: "Secondary navigation" } } },
    overflowMenuAriaLabel: { control: "text", table: { category: "Labels", defaultValue: { summary: "Overflow navigation menu" } } },
    overflowButtonLabel: {
      control: "text",
      description: "Accessible name of the icon-only overflow/burger button",
      table: { category: "Labels", defaultValue: { summary: "More navigation" } },
    },
    submenuAriaLabel: {
      control: "text",
      description: "aria-label on each dropdown summary; {title} is replaced with the item's title",
      table: { category: "Labels", defaultValue: { summary: "{title} submenu" } },
    },
    anchorScrollOffset: {
      control: { type: "number", min: 0, step: 10 },
      description: "Pixels left above a section when a #anchor link scrolls to it (e.g. a sticky header's height)",
      table: { category: "Behaviour", defaultValue: { summary: "0" } },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Extra CSS classes applied to the root element",
    },
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
  },
  render,
  args: {
    mainNavJustifyContent: "space-between",
    gapBetweenFirstAndSecondNav: 12,
    collapseBreakpoint: null,
    collapseAtMainNavIntersection: false,
    allowExpandOnGesture: true,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;


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
  render: renderWith(`<div style="max-width: 420px"><ResponsiveHeader v-bind="componentArgs" /></div>`),
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
  render: renderWith(`
      <ResponsiveHeader v-bind="componentArgs">
        <template #secondaryNavigation>
          <a href="/settings" aria-label="Settings">⚙</a>
        </template>
      </ResponsiveHeader>
    `),
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

export const MainNavAlignment: Story = {
  name: "Main Nav Alignment",
  args: { responsiveNavLinks, mainNavJustifyContent: "flex-start" },
  parameters: {
    docs: {
      description: {
        story:
          "The main nav's two groups are spread with `space-between` by default. Use the Main nav justify content control " +
          "(a CSS token set by the story, not a prop) to try `flex-start`, `safe center` and `safe end`. " +
          "Narrow the canvas to check items still collapse into the overflow menu from the end, whatever the alignment.",
      },
    },
  },
};

export const SamePageAnchorLinks: Story = {
  name: "Same-Page Anchor Links",
  args: {
    responsiveNavLinks: {
      main: [
        { name: "Home", path: "#rh-home" },
        { name: "About", path: "#rh-about" },
        { name: "Testimonials", path: "#rh-testimonials" },
        {
          name: "More",
          childLinks: [
            { name: "Prices", path: "#rh-prices" },
            { name: "Blog (a route)", path: "/blog" },
          ],
        },
        { name: "Contact", path: "#rh-contact" },
      ],
    },
    anchorScrollOffset: 80,
  },
  render: renderWith(`
    <div style="position: sticky; top: 0; z-index: 2; background: var(--page-bg, white); border-block-end: 1px solid currentColor;">
      <ResponsiveHeader v-bind="componentArgs" />
    </div>
    <section
      v-for="id in ['rh-home', 'rh-about', 'rh-testimonials', 'rh-prices', 'rh-contact']"
      :id="id"
      :key="id"
      style="min-block-size: 70vh; padding: 2.4rem; border-block-end: 1px dashed currentColor;"
    >
      <h2 style="margin: 0;">#{{ id }}</h2>
    </section>
  `),
  parameters: {
    docs: {
      description: {
        story:
          "Items whose `path` starts with `#` are same-page section links: they render as plain `<a>` (not NuxtLink), " +
          "smooth-scroll to the section (an instant jump under reduced motion), and are active by hash rather than by " +
          "route; the first anchor is active on load. `anchorScrollOffset` (80 here) leaves room for the sticky header. " +
          "Route links like Blog mix in as normal. Narrow the canvas so items move into the overflow menu: anchor links " +
          "there scroll the same way and close the menu. This replaces TabNavigation's anchor mode.",
      },
    },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const stressNavLinks: ResponsiveHeaderProp = {
  primary: [
    { name: "Startseite", path: "/" },
    { name: "Pneumonoultramicroscopicsilicovolcanoconiosisbehandlungohneleerzeichen", path: "/long" },
    {
      name: "Leistungen und Behandlungen",
      iconName: "lucide:this-icon-does-not-exist",
      childLinks: [
        ...Array.from({ length: 26 }, (_, i) => ({ name: `Behandlung ${i + 1}`, path: `/treatment-${i + 1}` })),
        { name: "Same name", path: "/same-a" },
        { name: "Same name", path: "/same-b" },
        { name: "Kopfhautbehandlungmitspeziellenätherischenölenohneleerzeichendurchgehend", path: "/unbroken" },
        { name: "💇‍♀️ Emoji first", path: "/emoji" },
      ],
    },
    { name: "One child", childLinksTitle: "Only one", childLinks: [{ name: "The one", path: "/one" }] },
    { name: "<b>not bold</b>", path: "/html" },
    { name: "من نحن", path: "/rtl" },
    ...Array.from({ length: 8 }, (_, i) => ({ name: `Item ${i + 1}`, path: `/item-${i + 1}` })),
  ],
  secondary: [{ name: "Kontakt und Terminvereinbarung", path: "/contact" }],
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    responsiveNavLinks: stressNavLinks,
    mainNavAriaLabel: "Hauptnavigation",
    secondaryNavAriaLabel: "Sekundäre Navigation",
    overflowMenuAriaLabel: "Weitere Navigationspunkte",
    overflowButtonLabel: "Weitere Navigationspunkte anzeigen",
    submenuAriaLabel: "Untermenü {title}",
  },
  parameters: {
    initialCanvas: "laptopCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: 16 top-level items in group keys other than firstNav/secondNav, " +
          "a 70-character unbroken item name, a dropdown with no childLinksTitle (its name is shown instead) and 30 children " +
          "including duplicate names, an unbroken name and emoji, a dropdown with one child, a broken icon name, HTML-like text " +
          "(must render as text), right-to-left Arabic and German labels throughout. Check at every canvas width: items that " +
          "don't fit collapse into the overflow menu, the burger only appears when something has collapsed, the top-bar dropdown " +
          "and the overflow panel never run off-screen (long names wrap, 30 children scroll inside the panel), and nothing " +
          "shows 'undefined'. Resize the canvas back and forth to check items return to the bar.",
      },
    },
  },
};
