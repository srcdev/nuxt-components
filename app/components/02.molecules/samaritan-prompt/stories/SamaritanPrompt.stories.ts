import { computed, ref } from "vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";
import SamaritanPrompt from "../SamaritanPrompt.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

// Stories render the classic white-on-black look by setting the colour tokens on a dark stage (the
// defaults follow --theme-text and --theme-accent). Keying on the serialised args restarts the loop when a timing control changes, so the
// new value is visible straight away instead of after the current cycle.
const stageStyle =
  "display: grid; place-items: center; min-block-size: 32rem; padding: 3.2rem; background: #000; color: #fff; " +
  "--samaritan-prompt-text-colour: #fff; --samaritan-prompt-underline-colour: #fff; --samaritan-prompt-cursor-colour: #cc0000;";

const timingArgTypes = {
  typeSpeed: {
    control: { type: "range", min: 10, max: 400, step: 10 },
    description: "ms per character typed",
    table: { category: "Typewriter", defaultValue: { summary: "80" } },
  },
  deleteSpeed: {
    control: { type: "range", min: 10, max: 400, step: 10 },
    description: "ms per character deleted",
    table: { category: "Typewriter", defaultValue: { summary: "40" } },
  },
  holdDuration: {
    control: { type: "range", min: 0, max: 10000, step: 100 },
    description: "ms the fully typed text holds before deleting",
    table: { category: "Typewriter", defaultValue: { summary: "2000" } },
  },
  pauseDuration: {
    control: { type: "range", min: 0, max: 5000, step: 100 },
    description: "ms pause between messages (typewriter) or cycles (word-pulse)",
    table: { category: "Timing", defaultValue: { summary: "500" } },
  },
  wordDuration: {
    control: { type: "range", min: 200, max: 5000, step: 100 },
    description: "ms each word-pulse message stays fully visible",
    table: { category: "Word pulse", defaultValue: { summary: "1200" } },
  },
  fadeDuration: {
    control: { type: "range", min: 0, max: 2000, step: 50 },
    description: "ms for the word-pulse fade in and out",
    table: { category: "Word pulse", defaultValue: { summary: "400" } },
  },
  hideCursorInCycle: {
    control: "boolean",
    description: "Hide the cursor while text animates, show it during pauses",
    table: { category: "Cursor", defaultValue: { summary: "true" } },
  },
} as const;

const meta: Meta<typeof SamaritanPrompt> = {
  title: "Molecules/SamaritanPrompt",
  component: SamaritanPrompt,
  argTypes: {
    messages: {
      control: "object",
      description: "Messages to cycle through",
      table: { category: "Content" },
    },
    effect: {
      control: "inline-radio",
      options: ["typewriter", "word-pulse"],
      description: "Animation effect for every message",
      table: { category: "Content", defaultValue: { summary: "typewriter" } },
    },
    ...timingArgTypes,
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Styling" },
    },
  },
  args: {
    messages: ["Can you hear me?", "Surveillance active", "Threat detected"],
    effect: "typewriter",
    typeSpeed: 80,
    deleteSpeed: 40,
    holdDuration: 2000,
    pauseDuration: 500,
    wordDuration: 1200,
    fadeDuration: 400,
    hideCursorInCycle: true,
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { SamaritanPrompt },
    setup() {
      const restartKey = computed(() => JSON.stringify(args));
      return { args, restartKey, stageStyle };
    },
    template: `
      <div :style="stageStyle">
        <SamaritanPrompt :key="restartKey" v-bind="args" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof SamaritanPrompt>;

export const Typewriter: Story = {};

export const WordPulse: Story = {
  name: "Word Pulse",
  args: {
    effect: "word-pulse",
  },
};

export const CustomCursorAndTokens: Story = {
  name: "Custom Cursor and Tokens",
  render: (args) => ({
    components: { SamaritanPrompt },
    setup() {
      const restartKey = computed(() => JSON.stringify(args));
      return { args, restartKey, stageStyle };
    },
    template: `
      <div :style="stageStyle">
        <SamaritanPrompt
          :key="restartKey"
          v-bind="args"
          style="--samaritan-prompt-text-colour: #00ff88; --samaritan-prompt-underline-colour: #00ff88; --samaritan-prompt-cursor-colour: #ffcc00; --samaritan-prompt-font-size: 3.2rem;"
        >
          <template #cursor>&#9679;</template>
        </SamaritanPrompt>
      </div>
    `,
  }),
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    messages: [
      "Die Überwachungssysteme sind vollständig aktiviert und melden ungewöhnliche Aktivitäten",
      "https://example.com/a/very/long/unbroken/path/that/never/wraps/on/its/own",
      "",
      "👍🏽 👨‍👩‍👧 ok",
      "<b>Not bold</b>",
      "مرحبا بالعالم",
      "x",
    ],
    typeSpeed: 40,
    deleteSpeed: 20,
    holdDuration: 1500,
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
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "520px" },
      description: {
        story:
          "Hostile messages at every `CanvasSwitcher` width, typed fast so the cycle comes round quickly. Check that: the long German message and the unbroken URL wrap inside the canvas and stay centred; " +
          "the empty message is skipped over rather than stopping the loop (until 2026-10-21 it halted the cycle); emoji with a skin tone and a family emoji type as whole characters, never half a glyph; " +
          "`<b>` types as text; the right-to-left message reads correctly; a single character still shows. Try `effect: word-pulse` too, and turn on reduced motion in your OS: each message then appears whole instead of typing.",
      },
    },
  },
};
