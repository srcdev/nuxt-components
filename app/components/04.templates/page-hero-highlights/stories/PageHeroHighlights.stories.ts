import { computed } from "vue";
import PageHeroHighlights from "../PageHeroHighlights.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

type StoryArgs = {
  tag?: "div" | "section" | "main";
  highlightsEqualWidths?: boolean;
  highlightsJustify?: "start" | "center" | "end" | "space-between" | "space-around";
  maxWidth?: string;
  contentAlign?: "start" | "center";
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
      description: "Max width of the central content column. Gutters grow to enforce the constraint; below this width they hold at 16px.",
    },
    contentAlign: {
      control: { type: "inline-radio" },
      options: ["start", "center"],
      description: "Align the content column to the start (left gutter stays 16px, right takes remaining space) or center (equal gutters). Only meaningful when maxWidth is set.",
    },
    headerBackground: {
      control: "color",
      description: "Background colour of the header zone (sets --phl-header-bg)",
    },
    contentBackground: {
      control: "color",
      description: "Background colour of the content zone (sets --phl-content-bg)",
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
    headerBackground: "",
    contentBackground: "",
    highlightCount: 3,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof PageHeroHighlights>;

// ─── Shared setup helper ──────────────────────────────────────────────────────

function useStorySetup(args: StoryArgs) {
  const bgStyles = computed(() => ({
    ...(args.headerBackground ? { "--phl-header-bg": args.headerBackground } : {}),
    ...(args.contentBackground ? { "--phl-content-bg": args.contentBackground } : {}),
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
