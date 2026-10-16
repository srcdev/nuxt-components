import { computed, ref } from "vue";
import PageHeroHighlights from "../PageHeroHighlights.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";

type StoryArgs = {
  tag?: "div" | "section" | "main";
  highlightsEqualWidths?: boolean;
  highlightsJustify?: "start" | "center" | "end" | "space-between" | "space-around";
  widthConstrained?: boolean;
  contentAlign?: "start" | "center";
  contentPanel?: boolean;
  highlightTitleBaseline?: boolean;
  headerBackground?: string;
  contentBackground?: string;
  highlightCount?: number;
  styleClassPassthrough?: string | string[];
};

const meta: Meta<StoryArgs> = {
  title: "Templates/PageHeroHighlights",
  component: PageHeroHighlights,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "main"],
      description: "HTML element to render as the root. `section` wires `aria-labelledby` to the heading bound to the `header` slot's `headingId`.",
    },
    highlightsEqualWidths: {
      control: "boolean",
      description:
        "When true, highlight items share equal widths and wrap onto new rows below `--page-hero-highlights-item-min-width` (default 12rem). When false, items size to content (flex).",
    },
    highlightsJustify: {
      control: { type: "select" },
      options: ["start", "center", "end", "space-between", "space-around"],
      description: "Justification of highlight items along the main axis",
    },
    widthConstrained: {
      control: "boolean",
      description:
        "When true, caps the central column at `--page-hero-highlights-max-width` (default 1064px); the gutters grow to enforce it. When false, the column fills the width between the gutters.",
    },
    contentAlign: {
      control: { type: "inline-radio" },
      options: ["start", "center"],
      description:
        "With `widthConstrained`: `center` grows both gutters equally, `start` keeps the start gutter and gives the remaining space to the end gutter. No effect otherwise.",
    },
    contentPanel: {
      control: "boolean",
      description:
        "When true (default), renders a decorative panel behind the content slot and insets the highlights strip. Set to false for a flat layout with no backdrop.",
    },
    highlightTitleBaseline: {
      control: "boolean",
      description:
        "When true, fixes the highlight title row to `--page-hero-highlights-title-height-baseline` so titles line up on the header's baseline.",
    },
    headerBackground: {
      control: "color",
      description: "**Story control, not a prop.** Sets `--page-hero-highlights-header-background`.",
      table: { category: "Story only" },
    },
    contentBackground: {
      control: "color",
      description: "**Story control, not a prop.** Sets `--page-hero-highlights-content-background`.",
      table: { category: "Story only" },
    },
    highlightCount: {
      control: { type: "range", min: 1, max: 6, step: 1 },
      description: "**Story control, not a prop.** Number of highlight items rendered in the `highlights` slot.",
      table: { category: "Story only" },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "div",
    highlightsEqualWidths: false,
    highlightsJustify: "start",
    widthConstrained: false,
    contentAlign: "center",
    contentPanel: true,
    highlightTitleBaseline: false,
    headerBackground: "",
    contentBackground: "",
    highlightCount: 3,
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
        <div :class="canvasName" style="margin-inline: auto; outline: 1px dashed currentColor;">
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
          "A page-level template: a full-bleed header zone (`header` slot, scoped `headingId`), a highlights strip that straddles the header/content boundary (`highlights` slot), " +
          "and a content zone with an optional decorative panel (`content` slot). Give each highlight the `page-hero-highlights-item` class with `-item-title` and `-item-body` children for the card styling. " +
          "Gutters step at 768px and 1024px of the component's own width. Every colour and spacing value is a `--page-hero-highlights-*` token (see CONSUMER-STYLING.md). " +
          "Pair it with `PageHeroHighlightsHeader` for a title plus actions header.",
      },
      story: { inline: false, height: "640px" },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

// ─── Shared setup helper ──────────────────────────────────────────────────────

const sampleHighlights = [
  { title: "Total revenue", body: "£24,500" },
  { title: "Active users", body: "1,284" },
  { title: "Open tasks", body: "37" },
  { title: "Bookings this week", body: "112" },
  { title: "Average rating", body: "4.8" },
  { title: "Repeat clients", body: "62%" },
];

function useStorySetup(args: StoryArgs) {
  const bgStyles = computed(() => ({
    ...(args.headerBackground ? { "--page-hero-highlights-header-background": args.headerBackground } : {}),
    ...(args.contentBackground ? { "--page-hero-highlights-content-background": args.contentBackground } : {}),
  }));
  const highlights = computed(() => sampleHighlights.slice(0, args.highlightCount ?? 3));
  const componentArgs = computed(() => {
    const { headerBackground: _h, contentBackground: _c, highlightCount: _n, ...rest } = args;
    return rest;
  });
  return { bgStyles, componentArgs, highlights };
}

const highlightsTemplate = `
  <template #highlights>
    <div v-for="item in highlights" :key="item.title" class="page-hero-highlights-item">
      <p class="page-hero-highlights-item-title page-heading-4">{{ item.title }}</p>
      <p class="page-hero-highlights-item-body page-body-normal">{{ item.body }}</p>
    </div>
  </template>
`;

const contentTemplate = `
  <template #content>
    <p class="page-heading-2">Recent activity</p>
    <p class="page-body-normal">Your most recent transactions and events will appear here.</p>
  </template>
`;

const render =
  (header: string): Story["render"] =>
  (args) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <PageHeroHighlights v-bind="componentArgs" :style="bgStyles">
        ${header}
        ${highlightsTemplate}
        ${contentTemplate}
      </PageHeroHighlights>
    `,
  });

const plainHeader = (copy: string) => `
  <template #header>
    <p class="page-heading-1">Dashboard</p>
    <p class="page-body-normal">${copy}</p>
  </template>
`;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — header, highlights strip and page content, with the library's light defaults. */
export const Default: Story = {
  render: render(plainHeader("Overview of your account activity and key metrics.")),
};

/** As section tag — root renders as a semantic section with aria-labelledby wired to the heading. */
export const AsSectionTag: Story = {
  name: "As section Tag",
  args: { tag: "section" },
  render: render(`
    <template #header="{ headingId }">
      <h1 :id="headingId" class="page-heading-1">Dashboard</h1>
      <p class="page-body-normal">The section is labelled by this heading through the header slot's headingId.</p>
    </template>
  `),
};

/** Equal widths — highlight items share equal widths and wrap below their minimum width. */
export const EqualWidthHighlights: Story = {
  name: "Equal Width Highlights",
  args: { highlightsEqualWidths: true, highlightCount: 4 },
  render: render(plainHeader("Four equal-width highlights. Switch to the mobile canvas to see them wrap two by two, then one per row.")),
};

/** Minimal — renders with no slot content to show the bare grid structure. */
export const NoSlotContent: Story = {
  name: "No Slot Content",
  render: (args) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `<PageHeroHighlights v-bind="componentArgs" :style="bgStyles" />`,
  }),
};

/** Width constrained, centred — content column capped at --page-hero-highlights-max-width with equal growing gutters. */
export const MaxWidthCentered: Story = {
  name: "Max Width — Centered",
  args: { widthConstrained: true, contentAlign: "center" },
  render: render(
    plainHeader("The central column is capped at --page-hero-highlights-max-width (1064px by default); both gutters grow equally. Use the full-width canvas on a wide screen.")
  ),
};

/** Width constrained, start — content column capped at --page-hero-highlights-max-width and pinned to the start. */
export const MaxWidthStart: Story = {
  name: "Max Width — Start",
  args: { widthConstrained: true, contentAlign: "start" },
  render: render(
    plainHeader("The central column is capped at --page-hero-highlights-max-width (1064px by default) and pinned to the start; the end gutter takes the remaining space.")
  ),
};

/** No content panel — flat layout with no backdrop or highlight inset behind the content slot. */
export const NoContentPanel: Story = {
  name: "No Content Panel",
  args: { contentPanel: false },
  render: render(plainHeader("Flat layout: no decorative panel behind the content slot.")),
};

const stressHighlights = [
  { title: "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft", body: "Unbroken German compound in the title." },
  { title: "Monatlicher Gesamtumsatz aller Filialen im Vergleich zum Vorjahreszeitraum", body: "€1.234.567,89" },
  { title: "😀 Emoji first", body: "🎉🎉🎉" },
  { title: "<script>alert('xss')</script>", body: "HTML-like text must render as text." },
  { title: "إجمالي الإيرادات", body: "٢٤٬٥٠٠ ج.م", dir: "rtl" },
  { title: "", body: "Empty title." },
  { title: "A", body: "" },
  { title: "Link", body: "https://example.com/a-very-long-path-segment-without-any-spaces-at-all-in-it" },
];

/**
 * Stress test — unbroken and long translated text in the header, eight hostile highlights, a
 * long URL in the content, inside the CanvasSwitcher (starts on mobile).
 */
export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: { tag: "section", highlightsEqualWidths: true, widthConstrained: true },
  render: (args) => ({
    components: { PageHeroHighlights },
    setup() {
      return { ...useStorySetup(args), stressHighlights };
    },
    template: `
      <PageHeroHighlights v-bind="componentArgs" :style="bgStyles">
        <template #header="{ headingId }">
          <h1 :id="headingId" class="page-heading-1" style="overflow-wrap: anywhere;">Kundendienstmitarbeiterkontaktaufnahmeformularübersicht</h1>
          <p class="page-body-normal">Übersicht über die Aktivitäten Ihres Kontos, die wichtigsten Kennzahlen und alle offenen Vorgänge der letzten dreißig Tage.</p>
        </template>
        <template #highlights>
          <div v-for="(item, i) in stressHighlights" :key="i" class="page-hero-highlights-item" :dir="item.dir">
            <p class="page-hero-highlights-item-title page-heading-4">{{ item.title }}</p>
            <p class="page-hero-highlights-item-body page-body-normal">{{ item.body }}</p>
          </div>
        </template>
        <template #content>
          <p class="page-heading-2">Ergebnisse</p>
          <p class="page-body-normal" style="overflow-wrap: anywhere;">https://example.com/another-very-long-path-segment-without-any-spaces-that-must-wrap-inside-the-panel</p>
        </template>
      </PageHeroHighlights>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Check every canvas width, with `highlightsEqualWidths` on and off: no horizontal scroll, the strip still straddles the header and content zones, " +
          "cards wrap onto new rows rather than squeezing (equal widths) or overflowing (flexible), and the unbroken title and URL wrap inside their card. " +
          "Gutters should step from 16px to 40px at 768px and to 32px at 1024px of the component's width. Slot text is the consumer's own markup, so the header and " +
          "content paragraphs set their own `overflow-wrap`; highlight items get `overflow-wrap: anywhere` from the item class.",
      },
    },
  },
};
