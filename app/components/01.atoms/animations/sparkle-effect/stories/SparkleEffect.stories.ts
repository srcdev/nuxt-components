import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../SparkleEffect.vue";
import InputButton from "../../../../05.forms/input-button/InputButton.vue";
import CanvasSwitcher from "../../../canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

const COLOUR_OPTIONS = ["", "hsl(260 80% 70%)", "hsl(330 85% 65%)", "hsl(170 70% 45%)", "hsl(40 95% 55%)"] as const;
const SIZE_OPTIONS = ["0.5rem", "0.7rem", "1rem", "1.4rem"] as const;
const SPARK_BLUR_OPTIONS = ["0px", "0.5px", "1px", "2px", "3px"] as const;
const DURATION_OPTIONS = ["0.8s", "1.5s", "2.5s", "4s"] as const;
const BLUR_OPTIONS = ["0.6rem", "1.2rem", "2rem"] as const;
const OPACITY_OPTIONS = ["0.3", "0.5", "0.8"] as const;

type StoryArgs = {
  count: number;
  radius: string;
  continuous: boolean;
  tag: "span" | "div";
  colour: (typeof COLOUR_OPTIONS)[number];
  size: (typeof SIZE_OPTIONS)[number];
  blur: (typeof SPARK_BLUR_OPTIONS)[number];
  duration: (typeof DURATION_OPTIONS)[number];
  glowBlur: (typeof BLUR_OPTIONS)[number];
  glowOpacity: (typeof OPACITY_OPTIONS)[number];
  buttonText: string;
};

const tokenCategory = "CSS tokens (story only, set in your CSS)";
const tokenControl = (token: string, example: string, options: readonly string[]) => ({
  control: { type: "select" as const },
  options,
  description: `**Story control, not a prop.** Sets \`${token}\`. In your CSS: \`.promo { ${token}: ${example}; }\``,
  table: { category: tokenCategory },
});

export default {
  title: "Atoms/Effects/SparkleEffect",
  component: StorybookComponent,
  argTypes: {
    count: {
      control: { type: "range", min: 1, max: 12, step: 1 },
      description: "Number of sparkles (floored, clamped to 1 to 12).",
    },
    radius: {
      control: { type: "text" },
      description: "Corner radius the sparks travel around; match the slotted element's radius. Sets `--sparkle-effect-radius`.",
    },
    continuous: {
      control: { type: "boolean" },
      description: "Keep the sparkles looping for as long as the hover or focus lasts, instead of one burst per hover.",
    },
    tag: {
      control: { type: "inline-radio" },
      options: ["span", "div"],
      description: "Root element. `span` wraps inline content like a button; `div` wraps block content like a card.",
    },
    colour: {
      ...tokenControl("--sparkle-effect-colour", "hsl(260 80% 70%)", COLOUR_OPTIONS),
      control: {
        type: "select",
        labels: { "": "Theme default", "hsl(260 80% 70%)": "Lavender (the original pen)", "hsl(330 85% 65%)": "Pink", "hsl(170 70% 45%)": "Teal", "hsl(40 95% 55%)": "Amber" },
      },
    },
    size: tokenControl("--sparkle-effect-size", "1rem", SIZE_OPTIONS),
    blur: tokenControl("--sparkle-effect-blur", "0px", SPARK_BLUR_OPTIONS),
    duration: tokenControl("--sparkle-effect-duration", "2.5s", DURATION_OPTIONS),
    glowBlur: tokenControl("--sparkle-effect-glow-blur", "2rem", BLUR_OPTIONS),
    glowOpacity: tokenControl("--sparkle-effect-glow-opacity", "0.8", OPACITY_OPTIONS),
    buttonText: {
      control: { type: "text" },
      description: "**Story control, not a prop.** Text of the demo button in the slot.",
      table: { category: "Slot content (story only)" },
    },
    styleClassPassthrough: { table: { disable: true } },
    class: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {
    count: 5,
    radius: "",
    continuous: false,
    tag: "span",
    colour: "hsl(260 80% 70%)",
    size: "0.7rem",
    blur: "1px",
    duration: "1.5s",
    glowBlur: "1.2rem",
    glowOpacity: "0.5",
    buttonText: "Whimsy",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Wraps its default slot and, on hover or keyboard focus inside it, sends small sparkles along the wrapper's rounded border while a soft glow fades in behind. " +
          "`count` sets how many sparkles (1 to 12), `continuous` keeps them looping while hovered or focused, `radius` sets the shape they follow (match the slotted element's radius), and `tag` picks `span` or `div`. " +
          "Sparkles need `offset-path: border-box` (Safari 17.2+), so older browsers and `prefers-reduced-motion: reduce` get the glow only. " +
          "Effect adapted from a Kevin Powell CodePen. Hover or tab to each example to see it.",
      },
    },
  },
} as Meta<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => ({
    count: args.count,
    radius: args.radius || undefined,
    continuous: args.continuous,
    tag: args.tag,
  }));
  const tokenStyle = computed(() => ({
    "--sparkle-effect-colour": args.colour || undefined,
    "--sparkle-effect-size": args.size,
    "--sparkle-effect-blur": args.blur,
    "--sparkle-effect-duration": args.duration,
    "--sparkle-effect-glow-blur": args.glowBlur,
    "--sparkle-effect-glow-opacity": args.glowOpacity,
  }));
  return { args, componentArgs, tokenStyle };
}

const stage = "padding: 6rem 4rem; display: flex; flex-wrap: wrap; gap: 4rem; align-items: center;";

export const Default: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent, InputButton },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div style="${stage}" :style="tokenStyle">
      <StorybookComponent v-bind="componentArgs">
        <InputButton :button-text="args.buttonText" variant="secondary" is-pill></InputButton>
      </StorybookComponent>
    </div>
  `,
});
Default.parameters = {
  docs: {
    description: {
      story:
        "The original pen's look: a pill button with a lavender colour and five sparkles. Hover the button, or tab to it and check its own focus ring is still visible.",
    },
  },
};

export const ThemeColour: StoryFn<StoryArgs> = Default.bind({});
ThemeColour.args = { colour: "" };
ThemeColour.parameters = {
  docs: {
    description: {
      story:
        "With no colour set, the effect takes `--theme-border`. The sparkles keep the theme hue but are lightened, so they stay pastel on any theme.",
    },
  },
};

export const ManySparks: StoryFn<StoryArgs> = Default.bind({});
ManySparks.args = { count: 12, buttonText: "Twelve sparkles" };
ManySparks.parameters = {
  docs: {
    description: {
      story:
        "Sparkles 6 to 12 reuse the five tuned presets with a hue shift, a further end point and mirrored drift, so they spread out rather than doubling up.",
    },
  },
};

export const Continuous: StoryFn<StoryArgs> = Default.bind({});
Continuous.args = { continuous: true, count: 7, buttonText: "Keep hovering" };
Continuous.parameters = {
  docs: {
    description: {
      story:
        "With `continuous`, each sparkle loops (travel, drift and fade in one keyframe) for as long as the pointer stays or focus remains inside. Their different speeds stop them pulsing in step.",
    },
  },
};

export const OnCard: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div style="${stage}" :style="tokenStyle">
      <StorybookComponent v-bind="componentArgs" style="inline-size: min(100%, 36rem);">
        <a
          href="#"
          style="display: grid; gap: 0.8rem; padding: 2.4rem; border-radius: 1.2rem; border: 1px solid var(--theme-border); background: var(--theme-surface-subtle); color: var(--theme-text); text-decoration: none;"
        >
          <strong style="font-size: var(--step-5);">Northtown spring workshop</strong>
          <span>Hover or tab to this card. The sparkles follow its 1.2rem corners because the wrapper has the same radius.</span>
        </a>
      </StorybookComponent>
    </div>
  `,
});
OnCard.args = { tag: "div", radius: "1.2rem", count: 7 };
OnCard.parameters = {
  docs: {
    description: {
      story:
        "Block content uses `tag=\"div\"`, and `radius` matches the card's own corners. Keyboard focus on the link inside triggers the effect too.",
    },
  },
};

export const Disabled: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent, InputButton },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div style="${stage}" :style="tokenStyle">
      <StorybookComponent v-bind="componentArgs">
        <button type="button" disabled style="padding: 1.2rem 3rem; border-radius: 100vw;">Disabled button</button>
      </StorybookComponent>
      <StorybookComponent v-bind="componentArgs">
        <InputButton button-text="Read-only InputButton" variant="secondary" is-pill readonly></InputButton>
      </StorybookComponent>
    </div>
  `,
});
Disabled.parameters = {
  docs: {
    description: {
      story:
        "No glow or sparkles while the slotted control is `:disabled` or `aria-disabled=\"true\"` (InputButton's `readonly` sets the latter).",
    },
  },
};

export const StressTest: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent, InputButton },
  setup() {
    const longUnbroken = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft";
    const hostileCounts = [0, -3, 2.5, 99, Number.NaN];
    return { ...useStorySetup(args), longUnbroken, hostileCounts };
  },
  template: `
    <div style="padding: 4rem 1.6rem; display: grid; gap: 4rem; justify-items: start;" :style="tokenStyle">
      <div style="display: flex; flex-wrap: wrap; gap: 3rem;">
        <StorybookComponent v-for="(count, index) in hostileCounts" :key="index" :count="count">
          <InputButton :button-text="'count=' + count" variant="secondary" is-pill></InputButton>
        </StorybookComponent>
      </div>

      <StorybookComponent v-bind="componentArgs" style="max-inline-size: 100%;">
        <InputButton :button-text="longUnbroken" variant="secondary" is-pill></InputButton>
      </StorybookComponent>

      <StorybookComponent v-bind="componentArgs" tag="div" radius="0" style="inline-size: 100%;">
        <div style="padding: 2.4rem; background: var(--theme-surface-subtle); overflow-wrap: anywhere;">
          Full-width block child with square corners. {{ longUnbroken }}
        </div>
      </StorybookComponent>

      <StorybookComponent v-bind="componentArgs" radius="50%">
        <InputButton button-text="Settings" variant="secondary" is-pill>
          <template #iconOnly><Icon name="material-symbols:settings" class="icon"></Icon></template>
        </InputButton>
      </StorybookComponent>

      <StorybookComponent v-bind="componentArgs" tag="div" radius="1.6rem" style="padding: 2rem; border: 1px dashed currentColor; border-radius: 1.6rem;">
        <StorybookComponent v-bind="componentArgs">
          <InputButton button-text="Nested SparkleEffect" variant="secondary" is-pill></InputButton>
        </StorybookComponent>
      </StorybookComponent>

      <StorybookComponent v-bind="componentArgs"></StorybookComponent>
    </div>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.decorators = [
  (story, context) => ({
    components: { story, CanvasSwitcher },
    setup() {
      const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "mobileCanvas");
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
];
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  docs: {
    description: {
      story:
        "Hostile counts (0 and -3 render one sparkle, 2.5 renders two, 99 renders twelve, NaN falls back to five), a button with a long unbroken label " +
        "(it should wrap or overflow the same as without the wrapper, and the sparkles follow its box), a full-width square block, a round icon-only button, " +
        "a nested SparkleEffect (hovering the inner one runs both) and an empty wrapper (renders nothing visible). Hover each at every canvas width.",
    },
  },
};
