import { computed } from "vue";
import PageHeroHighlights from "../PageHeroHighlights.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

type StoryArgs = {
  tag?: "div" | "section" | "main";
  highlightsEqualWidths?: boolean;
  highlightsJustify?: "start" | "center" | "end" | "space-between" | "space-around";
  maxWidth?: string;
  contentAlign?: "start" | "center";
  highlightTitleBaseline?: boolean;
  headerBackground?: string;
  contentBackground?: string;
  highlightCount?: 1 | 2 | 3;
  styleClassPassthrough?: string | string[];
};

const meta: Meta<StoryArgs> = {
  title: "Templates/PageHeroHighlights",
  component: PageHeroHighlights,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "main"],
      description: "HTML element to render as the root",
    },
    highlightsEqualWidths: {
      control: "boolean",
      description: "When true, highlight items share equal widths (grid). When false, items size to content (flex).",
    },
    highlightsJustify: {
      control: { type: "select" },
      options: ["start", "center", "end", "space-between", "space-around"],
      description: "Justification of highlight items along the main axis",
    },
    maxWidth: {
      control: { type: "select" },
      options: ["", "600px", "800px", "1024px", "1200px", "1440px"],
      description:
        "Max width of the central content column. Gutters grow to enforce the constraint; below this width they hold at 16px.",
    },
    contentAlign: {
      control: { type: "inline-radio" },
      options: ["start", "center"],
      description:
        "Align the content column to the start (left gutter stays 16px, right takes remaining space) or center (equal gutters). Only meaningful when maxWidth is set.",
    },
    highlightTitleBaseline: {
      control: "boolean",
      description:
        "When true, fixes the highlight title row to a set height so titles align to the header baseline. Override --highlight-title-height in the consuming page to tune the value.",
    },
    headerBackground: {
      control: "color",
      description: "Background colour of the header zone (sets --header-row-background-colour)",
    },
    contentBackground: {
      control: "color",
      description: "Background colour of the content zone (sets --content-row-background-color)",
    },
    highlightCount: {
      control: { type: "select" },
      options: [1, 2, 3],
      description: "Number of highlight items to display in the highlights slot",
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
    maxWidth: "",
    contentAlign: "center",
    highlightTitleBaseline: false,
    headerBackground: "",
    contentBackground: "",
    highlightCount: 1,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof PageHeroHighlights>;

// ─── Shared setup helper ──────────────────────────────────────────────────────

function useStorySetup(args: StoryArgs) {
  const bgStyles = computed(() => ({
    ...(args.headerBackground ? { "--header-row-background-colour": args.headerBackground } : {}),
    ...(args.contentBackground ? { "--content-row-background-color": args.contentBackground } : {}),
  }));
  const highlightCount = computed(() => args.highlightCount ?? 3);
  const componentArgs = computed(() => {
    const { headerBackground: _h, contentBackground: _c, highlightCount: _n, ...rest } = args;
    return rest;
  });
  return { bgStyles, componentArgs, highlightCount };
}

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — header, highlights strip, and page content with all three slots filled. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
All layout and visual properties are customisable via CSS custom properties. Set them on \`.page-hero-highlights\` (or a scoped class via \`styleClassPassthrough\`):

\`\`\`css
.page-hero-highlights {
  /* Header zone */
  --header-row-background-colour: darkblue;

  /* Highlights strip */
  --highlights-row-item-gap: 1rem;
  --highlights-row-initial-item-offset: 1.2rem;

  /* Highlight cards */
  --highlight-rows-gap: 1.2rem;
  --highlight-title-height: 1fr; /* see: highlight-title-baseline prop */
  --highlight-padding-block-start: 1.2rem;
  --highlight-padding: 1.2rem;
  --highlight-background-color: white;
  --highlight-border: 1px solid black;
  --highlight-border-radius: 8px;
  --highlight-color: black;

  /* Content zone */
  --content-row-background-color: var(--slate-01); /* transparent */
  --content-row-start-gap: 1.2rem;
  --content-row-end-gap: 1.2rem;

  /* Content slot decorative border */
  --content-slot-margin-block-start: 2.4rem;
  --content-slot-margin: var(--highlights-row-initial-item-offset);
  --content-slot-background-color: var(--slate-00);
  --content-slot-border: 1px solid var(--slate-06);
  --content-slot-border-radius: 0.8rem;
  --content-slot-outline: 1px solid var(--slate-02);

  /* When using :highlight-title-baseline="true" */
  &.highlight-title-baseline {
    --highlight-title-height: 4rem; /* proportional value preferred */
    --highlight-padding-block-start: 0;
  }
}
\`\`\`
        `,
      },
    },
  },
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <PageHeroHighlights v-bind="componentArgs" :style="bgStyles">
        <template #header>
          <div style="color: white; padding-block: 1.6rem;">
            <p class="page-heading-1">Dashboard</p>
            <p class="page-body-normal">Overview of your account activity and key metrics.</p>
          </div>
        </template>

        <template #highlights>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Total Revenue</p>
            <p class="page-body-normal">£24,500</p>
          </div>
          <div v-if="highlightCount >= 2" style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Active Users</p>
            <p class="page-body-normal">1,284</p>
          </div>
          <div v-if="highlightCount >= 3" style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Open Tasks</p>
            <p class="page-body-normal">37</p>
          </div>
        </template>

        <template #content>
          <pre style="padding: 1.6rem; font-size: 1.2rem; line-height: 1.6; overflow-x: auto;">/* ─── PageHeroHighlights CSS tokens ─────────────────────────────────
   Set on .page-hero-highlights (or a scoped styleClassPassthrough class).
   Update values as needed. Delete tokens you are not overriding.
   ─────────────────────────────────────────────────────────────────── */
.page-hero-highlights {

  /* Header zone */
  --header-row-background-colour: darkblue;

  /* Highlights strip */
  --highlights-row-item-gap: 1rem;
  --highlights-row-initial-item-offset: 1.2rem;

  /* Highlight cards */
  --highlight-rows-gap: 1.2rem;
  --highlight-title-height: 1fr; /* see: highlight-title-baseline prop */
  --highlight-padding-block-start: 1.2rem;
  --highlight-padding: 1.2rem;
  --highlight-background-color: white;
  --highlight-border: 1px solid black;
  --highlight-border-radius: 8px;
  --highlight-color: black;

  /* Content zone */
  --content-row-background-color: var(--slate-01); /* transparent */
  --content-row-start-gap: 1.2rem;
  --content-row-end-gap: 1.2rem;

  /* Content slot decorative border */
  --content-slot-margin-block-start: 2.4rem;
  --content-slot-margin: var(--highlights-row-initial-item-offset);
  --content-slot-background-color: var(--slate-00);
  --content-slot-border: 1px solid var(--slate-06);
  --content-slot-border-radius: 0.8rem;
  --content-slot-outline: 1px solid var(--slate-02);

  /* When using :highlight-title-baseline="true" */
  &.highlight-title-baseline {
    --highlight-title-height: 4rem; /* proportional value preferred */
    --highlight-padding-block-start: 0;
  }
}</pre>
        </template>
      </PageHeroHighlights>
    `,
  }),
};

/** As section tag — root renders as a semantic section with aria-labelledby wired to the heading. */
export const AsSectionTag: Story = {
  name: "As section Tag",
  args: { tag: "section" },
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <PageHeroHighlights v-bind="componentArgs" :style="bgStyles">
        <template #header="{ headingId }">
          <h1 :id="headingId" class="page-heading-1">Dashboard</h1>
          <p class="page-body-normal">Overview of your account activity and key metrics.</p>
        </template>

        <template #highlights>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Total Revenue</p>
            <p class="page-body-normal">£24,500</p>
          </div>
          <div v-if="highlightCount >= 2" style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Active Users</p>
            <p class="page-body-normal">1,284</p>
          </div>
          <div v-if="highlightCount >= 3" style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Open Tasks</p>
            <p class="page-body-normal">37</p>
          </div>
        </template>

        <template #content>
          <p class="page-heading-2">Recent Activity</p>
          <p class="page-body-normal">Your most recent transactions and events will appear here.</p>
        </template>
      </PageHeroHighlights>
    `,
  }),
};

/** Equal widths — highlights items share equal column widths via grid. */
export const EqualWidthHighlights: Story = {
  name: "Equal Width Highlights",
  args: { highlightsEqualWidths: true },
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <PageHeroHighlights v-bind="componentArgs" :style="bgStyles">
        <template #header>
          <p class="page-heading-1">Dashboard</p>
          <p class="page-body-normal">Overview of your account activity and key metrics.</p>
        </template>

        <template #highlights>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Total Revenue</p>
            <p class="page-body-normal">£24,500</p>
          </div>
          <div v-if="highlightCount >= 2" style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Active Users</p>
            <p class="page-body-normal">1,284</p>
          </div>
          <div v-if="highlightCount >= 3" style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Open Tasks</p>
            <p class="page-body-normal">37</p>
          </div>
        </template>

        <template #content>
          <p class="page-heading-2">Recent Activity</p>
          <p class="page-body-normal">Your most recent transactions and events will appear here.</p>
        </template>
      </PageHeroHighlights>
    `,
  }),
};

/** Minimal — renders with no slot content to show the bare grid structure. */
export const NoSlotContent: Story = {
  name: "No Slot Content",
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `<PageHeroHighlights v-bind="componentArgs" :style="bgStyles" />`,
  }),
};

/** Max width centered — content column capped at 800px with equal growing gutters either side. */
export const MaxWidthCentered: Story = {
  name: "Max Width — Centered",
  args: { maxWidth: "800px", contentAlign: "center" },
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <PageHeroHighlights v-bind="componentArgs" :style="bgStyles">
        <template #header>
          <p class="page-heading-1">Dashboard</p>
          <p class="page-body-normal">Content column is capped at 800px — gutters grow equally on both sides.</p>
        </template>

        <template #highlights>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Total Revenue</p>
            <p class="page-body-normal">£24,500</p>
          </div>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Active Users</p>
            <p class="page-body-normal">1,284</p>
          </div>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Open Tasks</p>
            <p class="page-body-normal">37</p>
          </div>
        </template>

        <template #content>
          <p class="page-heading-2">Recent Activity</p>
          <p class="page-body-normal">Your most recent transactions and events will appear here.</p>
        </template>
      </PageHeroHighlights>
    `,
  }),
};

/** Max width start — content column capped at 800px, pinned to the left with a fixed 16px gutter. */
export const MaxWidthStart: Story = {
  name: "Max Width — Start",
  args: { maxWidth: "800px", contentAlign: "start" },
  render: (args: StoryArgs) => ({
    components: { PageHeroHighlights },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <PageHeroHighlights v-bind="componentArgs" :style="bgStyles">
        <template #header>
          <p class="page-heading-1">Dashboard</p>
          <p class="page-body-normal">Content column is capped at 800px, aligned to the start — right side takes the remaining space.</p>
        </template>

        <template #highlights>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Total Revenue</p>
            <p class="page-body-normal">£24,500</p>
          </div>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Active Users</p>
            <p class="page-body-normal">1,284</p>
          </div>
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Open Tasks</p>
            <p class="page-body-normal">37</p>
          </div>
        </template>

        <template #content>
          <p class="page-heading-2">Recent Activity</p>
          <p class="page-body-normal">Your most recent transactions and events will appear here.</p>
        </template>
      </PageHeroHighlights>
    `,
  }),
};
