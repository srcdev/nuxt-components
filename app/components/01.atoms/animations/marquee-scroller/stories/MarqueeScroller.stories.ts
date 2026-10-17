import { computed, ref } from "vue";
import MarqueeScroller from "../MarqueeScroller.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import CanvasSwitcher from "../../../canvas-switcher/CanvasSwitcher.vue";
import type { MarqueeItem, MarqueeItemConfig, MediaCanvas } from "~/types/components";

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
  styleClassPassthrough?: string[];
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
      <div style="display: grid; place-items: center; width: 100%; height: 100%; background: #eee; font-weight: 600;">
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
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
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
          "An infinite horizontal scroller for logos, badges, or other small repeating items. Items come from `marqueeData` plus one dynamically named slot per item id; each slot renders in fixed `itemConfig` boxes, and the data repeats until it fills the container. Pauses on hover and whenever focus is inside it (including focusable content in an item), toggles with the spacebar on the region or the optional `show-controls` button, and respects prefers-reduced-motion. All copy (`aria-label`, `aria-description`, `play-label`, `pause-label`) is a prop for localisation.",
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
  parameters: {
    docs: { description: { story: "Five placeholder logos with the visible pause/play button. Hover pauses the track and greys every item except the hovered one." } },
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

const linkData: MarqueeItem[] = [
  { id: 1, content: "Partner one" },
  { id: 2, content: "Partner two" },
  { id: 3, content: "Partner three" },
];

export const FocusableItems: Story = {
  args: {
    animationRuntimeSeconds: 20,
    marqueeData: linkData,
    itemConfig: { width: "160px", height: "60px", gap: "24px" },
    showControls: true,
    ariaLabel: "Partner links",
  },
  render: (args) => ({
    components: { MarqueeScroller },
    setup() {
      const { componentArgs } = useStorySetup(args as StoryArgs);
      return { componentArgs, linkData };
    },
    template: `
      <MarqueeScroller v-bind="componentArgs">
        <template v-for="item in linkData" :key="item.id" #[item.id]>
          <a href="#" style="font-size: 1.6rem;" @click.prevent>{{ item.content }}</a>
        </template>
      </MarqueeScroller>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Links inside items. Tab into the scroller: it pauses as soon as focus is anywhere inside, the track stops being `aria-hidden`, and only the real copy of each link is reachable (the looping duplicate is `inert`). Tabbing out resumes it, unless you paused it yourself with the button or spacebar.",
      },
    },
  },
};

const stressData: MarqueeItem[] = Array.from({ length: 24 }, (_, index) => ({ id: index + 1, content: `Item ${index + 1}` }));
const stressCopy = [
  "Unternehmensberatungsgesellschaftmitbeschränkterhaftung",
  "https://example.com/a/very/long/unbroken/url/that/never/ends",
  "😀 Emoji first",
  "<b>not bold</b>",
  "شركة الشمال",
  "",
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    animationRuntimeSeconds: 8,
    marqueeData: stressData,
    itemConfig: { width: "90px", height: "70px", gap: "8px" },
    showControls: true,
    ariaLabel: "Bevorzugtekontaktmethodefürrückfragen 😀 <b>not bold</b> طريقة الاتصال",
    ariaDescription: "Drücken Sie die Leertaste, um die Animation anzuhalten oder fortzusetzen.",
    playLabel: "Animationfortsetzenundweiterlaufenlassen",
    pauseLabel: "Animationanhaltenundstehenlassen",
  },
  render: (args) => ({
    components: { MarqueeScroller },
    setup() {
      const { componentArgs } = useStorySetup(args as StoryArgs);
      const single: MarqueeItem[] = [{ id: 1, content: "Only one" }];
      const tiny: MarqueeItem[] = [{ id: 1, content: "a" }, { id: 2, content: "b" }];
      return { componentArgs, args, stressCopy, single, tiny };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; font-size: 1.4rem;">
        <p style="margin: 0;">24 items: unbroken German, a long URL, emoji, HTML-like and right-to-left text, an empty item and a broken image.</p>
        <MarqueeScroller v-bind="componentArgs">
          <template v-for="item in args.marqueeData" :key="item.id" #[item.id]>
            <img v-if="item.id === 6" src="https://example.invalid/missing-logo.png" alt="Broken logo" width="60" height="40" />
            <span v-else>{{ stressCopy[(item.id - 1) % stressCopy.length] }}</span>
          </template>
        </MarqueeScroller>

        <p style="margin: 0;">A single item: repeats until it fills the container.</p>
        <MarqueeScroller :marquee-data="single" :item-config="{ width: '120px', height: '50px', gap: '16px' }">
          <template #1><span>Only one</span></template>
        </MarqueeScroller>

        <p style="margin: 0;">Tiny 4px items with no gap: the repeat count caps at 50 copies instead of filling the DOM.</p>
        <MarqueeScroller :marquee-data="tiny" :item-config="{ width: '4px', height: '20px', gap: '0px' }">
          <template #1><span></span></template>
          <template #2><span></span></template>
        </MarqueeScroller>

        <p style="margin: 0;">Empty <code>marqueeData</code>: renders an empty region, no errors.</p>
        <MarqueeScroller :marquee-data="[]"></MarqueeScroller>
      </div>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Worst-case data across four scrollers. Check at every canvas width: unbroken text wraps inside its item box rather than spilling into the next one, markup renders as text, the broken image shows its alt text, the long localised labels stay inside the control button (they're its accessible name, visually hidden), the loop has no visible seam, and the empty scroller throws nothing. Item boxes are a fixed size, so slot content taller than `itemConfig.height` still overflows: size the content to the box.",
      },
    },
  },
};
