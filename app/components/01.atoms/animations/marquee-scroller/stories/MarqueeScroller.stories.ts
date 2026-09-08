import { computed } from "vue";
import MarqueeScroller from "../MarqueeScroller.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MarqueeItem, MarqueeItemConfig } from "~/types/components";

// animationRuntime is a CSS duration string ("30s") on the component — Storybook has no native
// range control for that, so the story exposes a plain-number `animationRuntimeSeconds` arg and
// maps it to the real prop. See feedback_storybook_extra_args memory / StoryArgs pattern.
type StoryArgs = {
  animationRuntimeSeconds?: number;
  reverse?: boolean;
  marqueeData?: MarqueeItem[];
  itemConfig?: MarqueeItemConfig;
  ariaLabel?: string;
  ariaDescription?: string;
  showControls?: boolean;
  respectReducedMotion?: boolean;
  playIcon?: string;
  pauseIcon?: string;
  playLabel?: string;
  pauseLabel?: string;
};

const logoData: MarqueeItem[] = [
  { id: 1, content: "Logo A" },
  { id: 2, content: "Logo B" },
  { id: 3, content: "Logo C" },
  { id: 4, content: "Logo D" },
  { id: 5, content: "Logo E" },
];

const logoSlots = logoData
  .map(
    (item) => `
    <template #${item.id}>
      <div style="display: grid; place-items: center; width: 100%; height: 100%; background: light-dark(#eee, #333); font-weight: 600;">
        ${item.content}
      </div>
    </template>`
  )
  .join("\n");

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { animationRuntimeSeconds, ...rest } = args;
    return {
      ...rest,
      animationRuntime: `${animationRuntimeSeconds ?? 30}s`,
    };
  });
  return { componentArgs };
}

const meta: Meta<StoryArgs> = {
  title: "Atoms/Effects/MarqueeScroller",
  component: MarqueeScroller,
  argTypes: {
    animationRuntimeSeconds: {
      control: { type: "range", min: 5, max: 90, step: 1 },
      description: "Loop duration in seconds — maps to the `animationRuntime` prop (e.g. `30s`)",
      table: { category: "Animation" },
    },
    reverse: {
      control: "boolean",
      description: "Reverses the scroll direction",
      table: { category: "Animation" },
    },
    marqueeData: {
      control: "object",
      description: "Array of `{ id, content }` items — each `id` names a slot to fill with that item's markup",
      table: { category: "Content" },
    },
    itemConfig: {
      control: "object",
      description: "`{ width, height, gap }` applied to every item and the track",
      table: { category: "Layout" },
    },
    ariaLabel: {
      control: "text",
      table: { category: "Accessibility" },
    },
    ariaDescription: {
      control: "text",
      table: { category: "Accessibility" },
    },
    showControls: {
      control: "boolean",
      description: "Shows a visible pause/play button (required for WCAG 2.2.2 on any auto-scrolling content)",
      table: { category: "Accessibility" },
    },
    respectReducedMotion: {
      control: "boolean",
      description: "Auto-pauses and disables the animation when the user has prefers-reduced-motion set",
      table: { category: "Accessibility" },
    },
    playIcon: {
      control: "text",
      description: "Iconify icon name shown on the control button while paused",
      table: { category: "Control button" },
    },
    pauseIcon: {
      control: "text",
      description: "Iconify icon name shown on the control button while playing",
      table: { category: "Control button" },
    },
    playLabel: {
      control: "text",
      description: "Control button aria-label while paused — override for localisation",
      table: { category: "Control button" },
    },
    pauseLabel: {
      control: "text",
      description: "Control button aria-label while playing — override for localisation",
      table: { category: "Control button" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "An infinite horizontal scroller for logos, badges, or other small repeating items. Items are provided via `marqueeData` plus one dynamically-named slot per item id. Pauses on hover/focus, supports keyboard control (spacebar), and respects prefers-reduced-motion.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const WithControls: Story = {
  args: {
    animationRuntimeSeconds: 30,
    reverse: false,
    marqueeData: logoData,
    itemConfig: { width: "120px", height: "60px", gap: "24px" },
    showControls: true,
    respectReducedMotion: true,
  },
  render: (args) => ({
    components: { MarqueeScroller },
    setup() {
      const { componentArgs } = useStorySetup(args as StoryArgs);
      return { componentArgs };
    },
    template: `
      <MarqueeScroller v-bind="componentArgs">
        ${logoSlots}
      </MarqueeScroller>
    `,
  }),
};
