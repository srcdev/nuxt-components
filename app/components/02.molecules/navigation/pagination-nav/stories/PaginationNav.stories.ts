import { computed, ref } from "vue";
import PaginationNav from "../PaginationNav.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof PaginationNav> = {
  title: "Molecules/PaginationNav",
  component: PaginationNav,
  argTypes: {
    page: {
      control: { type: "number", min: 1 },
      description: "Current page (`v-model:page`). Display clamps it to `1..total`",
      table: { category: "Model" },
    },
    total: {
      control: { type: "number", min: 0 },
      description: "Total number of pages. Below 1 renders nothing",
      table: { category: "Basic" },
    },
    siblings: {
      control: { type: "number", min: 0, max: 5 },
      description: "Pages shown either side of the current one",
      table: { category: "Basic" },
    },
    boundaries: {
      control: { type: "number", min: 0, max: 5 },
      description: "Pages always shown at each end",
      table: { category: "Basic" },
    },
    showEdges: {
      control: "boolean",
      description: "Adds First and Last controls",
      table: { category: "Basic" },
    },
    hideWhenSinglePage: {
      control: "boolean",
      description: "Renders nothing when `total` is 1",
      table: { category: "Basic" },
    },
    marker: {
      control: "inline-radio",
      options: ["none", "background", "underline"],
      description: "`none` fills the current page; `background` slides a fill between pages; `underline` slides a bar",
      table: { category: "Appearance" },
    },
    layout: {
      control: "inline-radio",
      options: ["auto", "full", "compact"],
      description: "`auto` switches to compact (arrows plus summary text) only when the full row doesn't fit",
      table: { category: "Appearance" },
    },
    pageHref: {
      control: false,
      description: "`(page) => string`. Turns every item into a link (see the Link Mode story)",
      table: { category: "Basic" },
    },
    ariaLabel: { control: "text", description: "Name of the nav landmark", table: { category: "Labels" } },
    previousLabel: { control: "text", description: "Accessible name of Previous", table: { category: "Labels" } },
    nextLabel: { control: "text", description: "Accessible name of Next", table: { category: "Labels" } },
    firstLabel: { control: "text", description: "Accessible name of First", table: { category: "Labels" } },
    lastLabel: { control: "text", description: "Accessible name of Last", table: { category: "Labels" } },
    pageLabel: {
      control: "text",
      description: "Accessible name of each page; `{page}` is replaced",
      table: { category: "Labels" },
    },
    summaryLabel: {
      control: "text",
      description: "Visible text in the compact layout; `{page}` and `{total}` are replaced",
      table: { category: "Labels" },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root `nav`",
      table: { category: "Styling" },
    },
  },
  args: {
    page: 1,
    total: 20,
    siblings: 1,
    boundaries: 1,
    showEdges: false,
    hideWhenSinglePage: false,
    marker: "none",
    layout: "auto",
    ariaLabel: "Pagination",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    firstLabel: "First page",
    lastLabel: "Last page",
    pageLabel: "Page {page}",
    summaryLabel: "Page {page} of {total}",
    styleClassPassthrough: [],
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
          "Page navigation in a `<nav>` landmark. `v-model:page` is the current page and `total` the page count; `siblings` and `boundaries` shape the window, which keeps the same number of slots on every page so the control never changes width. Without `page-href` the items are buttons that update the model; with it they're links (`NuxtLink` for internal paths), which suits crawlable listing pages. `marker` slides a fill or an underline between pages, `show-edges` adds First and Last, and the `auto` layout drops to arrows plus a \"Page 3 of 20\" summary when the full row doesn't fit. Every visible and accessible string is a prop. Slots: `#previous-icon`, `#next-icon`, `#first-icon`, `#last-icon`, `#ellipsis`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaginationNav>;

const render: Story["render"] = (args) => ({
  components: { PaginationNav },
  setup() {
    return { args };
  },
  template: `<PaginationNav v-bind="args" v-model:page="args.page" />`,
});

const storyNote = (text: string) => `<p style="margin: 0 0 1.6rem; font-size: 1.4rem;">${text}</p>`;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render,
  parameters: {
    docs: {
      description: {
        story:
          "Twenty pages with the default window. Page through with the arrows and numbers: the slot count stays at seven, so the arrows never move. Narrow the canvas to see the compact layout take over once the row no longer fits.",
      },
    },
  },
};

export const WithEdges: Story = {
  name: "With Edges",
  args: { page: 8, total: 40, showEdges: true },
  render,
  parameters: {
    docs: { description: { story: "`show-edges` adds First and Last. Both are disabled (focusable, `aria-disabled`) at their end." } },
  },
};

export const MarkerVariants: Story = {
  name: "Marker Variants",
  args: { page: 3, total: 12 },
  render: (args) => ({
    components: { PaginationNav },
    setup() {
      const pages = ref({ none: args.page ?? 1, background: args.page ?? 1, underline: args.page ?? 1 });
      const variants = ["none", "background", "underline"] as const;
      const componentArgs = computed(() => {
        const { page: _page, marker: _marker, ...rest } = args;
        return rest;
      });
      return { pages, variants, componentArgs };
    },
    template: `
      <div style="display: grid; gap: 2.4rem;">
        ${storyNote("The marker slides between the first and last few pages; in the middle the current page stays in the centre slot and the numbers move around it. Reduced motion turns the slide off.")}
        <div v-for="variant in variants" :key="variant" style="display: grid; gap: 0.8rem;">
          <code style="font-size: 1.4rem;">marker="{{ variant }}"</code>
          <PaginationNav v-bind="componentArgs" v-model:page="pages[variant]" :marker="variant" />
        </div>
        <div style="display: grid; gap: 0.8rem; --pagination-nav-gap: 1.2rem; --pagination-nav-underline-thickness: 0.1rem; --pagination-nav-underline-colour: var(--theme-text); --pagination-nav-current-font-weight: 400; --pagination-nav-item-background-hover: transparent; --pagination-nav-item-colour-hover: var(--theme-surface);">
          <code style="font-size: 1.4rem;">marker="underline" restyled with tokens: thin text-colour bar, regular weight, wider gap, colour-only hover</code>
          <PaginationNav v-bind="componentArgs" v-model:page="pages.underline" marker="underline" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The three `marker` values. `none` fills the current page in place; `background` slides the same fill between slots; `underline` slides a bar along the bottom edge, which suits borderless items. The current page's text colour waits half the slide before switching, so it never shows light-on-light.",
      },
    },
  },
};

export const LinkMode: Story = {
  name: "Link Mode",
  args: { page: 4, total: 12, marker: "background" },
  render: (args) => ({
    components: { PaginationNav },
    setup() {
      const pageHref = (page: number) => `#page-${page}`;
      return { args, pageHref };
    },
    template: `
      <div>
        ${storyNote("Every item is a real link (inspect one): Previous and Next point at the neighbouring pages and lose their href at the ends. This story uses <code>#page-n</code> hashes; an app would pass something like <code>(page) => `/blog?page=${page}`</code>.")}
        <PaginationNav v-bind="args" v-model:page="args.page" :page-href="pageHref" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "With `page-href` the items render as links, so search engines can follow them. The model still updates on click, so the marker slides when the component survives the navigation (a layout-level or persistent instance); one inside a page that remounts per route just renders in place.",
      },
    },
  },
};

export const Compact: Story = {
  args: { page: 7, total: 20, layout: "compact" },
  render,
  parameters: {
    docs: {
      description: {
        story: "`layout=\"compact\"` forces the arrows-plus-summary layout at any width; `auto` picks it only when the full row doesn't fit.",
      },
    },
  },
};

export const Localised: Story = {
  args: {
    page: 5,
    total: 30,
    showEdges: true,
    ariaLabel: "Seitennavigation",
    previousLabel: "Vorherige Seite",
    nextLabel: "Nächste Seite",
    firstLabel: "Erste Seite",
    lastLabel: "Letzte Seite",
    pageLabel: "Seite {page}",
    summaryLabel: "Seite {page} von {total}",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: { description: { story: "Every string is a prop, so a consumer's own i18n can supply them. Starts on the mobile canvas to show the localised summary." } },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

type LineClamp = "none" | "1" | "2" | "3";

// Story-only arg: drives a CSS token, not a PaginationNav prop. See the argTypes entry.
type StressArgs = InstanceType<typeof PaginationNav>["$props"] & { summaryLineClamp: LineClamp };

const longGerman = "Seitennavigationsübersichtsbeschriftungsverlängerung";

export const StressTest: StoryObj<StressArgs> = {
  name: "Stress Test (Worst-Case Data)",
  argTypes: {
    summaryLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--pagination-nav-summary-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.listing { --pagination-nav-summary-line-clamp: 1; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
  },
  args: {
    page: 99998.6,
    total: 99999,
    siblings: 2,
    boundaries: 2,
    showEdges: true,
    marker: "background",
    previousLabel: "",
    pageLabel: "<b>Seite</b> {page}",
    summaryLabel: `${longGerman} {page} / {total} 😀 صفحة`,
    summaryLineClamp: "none",
  },
  render: (args) => ({
    components: { PaginationNav },
    setup() {
      const componentArgs = computed(() => {
        const { summaryLineClamp: _summaryLineClamp, page: _page, ...rest } = args;
        return rest;
      });
      const tokenStyles = computed(() => ({ "--pagination-nav-summary-line-clamp": args.summaryLineClamp }));
      const edgeCases = [
        { label: "total 0 (renders nothing)", total: 0 },
        { label: "total -5 (renders nothing)", total: -5 },
        { label: "total 1", total: 1 },
        { label: "total 2.9 (floors to 2)", total: 2.9 },
        { label: "siblings 50, total 12 (shows all)", total: 12, siblings: 50 },
      ];
      return { args, componentArgs, tokenStyles, edgeCases };
    },
    template: `
      <div :style="tokenStyles" style="display: grid; gap: 2.4rem;">
        <PaginationNav v-bind="componentArgs" v-model:page="args.page" />
        <div v-for="item in edgeCases" :key="item.label" style="display: grid; gap: 0.8rem;">
          <code style="font-size: 1.4rem;">{{ item.label }}</code>
          <PaginationNav :total="item.total" :siblings="item.siblings ?? 1" :page="1" />
        </div>
      </div>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "720px" },
      description: {
        story:
          "Hostile data: 99,999 pages with a fractional page (shows 99,998), a five-digit window of eleven slots plus First and Last, a blank Previous label (falls back to \"Previous page\"), an HTML-like page label (must stay text), and a compact summary with a long German compound word, emoji and Arabic. Below it: totals of 0, -5, 1 and 2.9, and `siblings` far larger than the total. Check at every canvas width: the main control compacts rather than overflowing, the summary wraps between the arrows, and the marker stays on the current page when it returns to full width. Try the Summary line clamp control too: it's a CSS token set by the story, not a prop.",
      },
    },
  },
};
