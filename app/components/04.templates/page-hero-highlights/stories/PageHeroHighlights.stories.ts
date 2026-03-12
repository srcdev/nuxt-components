import { computed } from "vue";
import PageHeroHighlights from "../PageHeroHighlights.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

type StoryArgs = {
  tag?: "div" | "section" | "main";
  highlightsEqualWidths?: boolean;
  highlightsJustify?: "start" | "center" | "end" | "space-between" | "space-around";
  headerBackground?: string;
  contentBackground?: string;
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
    headerBackground: {
      control: "color",
      description: "Background colour of the header zone (sets --phl-header-bg)",
    },
    contentBackground: {
      control: "color",
      description: "Background colour of the content zone (sets --phl-content-bg)",
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
    headerBackground: "",
    contentBackground: "",
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
  const componentArgs = computed(() => {
    const { headerBackground: _h, contentBackground: _c, ...rest } = args;
    return rest;
  });
  return { bgStyles, componentArgs };
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
          <div style="border-radius: 12px; background: #1a1a2e; color: white; padding: 1.6rem;">
            <p class="page-heading-2">Active Users</p>
            <p class="page-body-normal">1,284</p>
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
