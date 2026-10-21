import { computed, ref } from "vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas, SamaritanPromptMessageConfig } from "~/types/components";
import SamaritanPromptMixed from "../SamaritanPromptMixed.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

// Dark stage with the classic white-on-black tokens (the defaults follow --theme-text and --theme-accent). Keying on the serialised args restarts the
// loop when a control changes, so the new value is visible straight away.
const stageStyle =
  "display: grid; place-items: center; min-block-size: 32rem; padding: 3.2rem; background: #000; color: #fff; " +
  "--samaritan-prompt-text-colour: #fff; --samaritan-prompt-underline-colour: #fff; --samaritan-prompt-cursor-colour: #cc0000;";

const messageConfigs: SamaritanPromptMessageConfig[] = [
  { text: "Good evening", effect: "typewriter", holdDuration: 2500 },
  { text: "Stand by", effect: "word-pulse", wordDuration: 2000, fadeDuration: 800 },
  { text: "Connection established", effect: "typewriter", typeSpeed: 50, holdDuration: 2500 },
];

const meta: Meta<typeof SamaritanPromptMixed> = {
  title: "Molecules/SamaritanPromptMixed",
  component: SamaritanPromptMixed,
  argTypes: {
    messageConfigs: {
      control: "object",
      description: "Messages, each optionally overriding the effect and timing props below",
      table: { category: "Content" },
    },
    effect: {
      control: "inline-radio",
      options: ["typewriter", "word-pulse"],
      description: "Default effect for messages that don't set their own",
      table: { category: "Content", defaultValue: { summary: "typewriter" } },
    },
    introDelay: {
      control: { type: "range", min: 0, max: 5000, step: 100 },
      description: "ms before the first message of each loop",
      table: { category: "Timing", defaultValue: { summary: "2000" } },
    },
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
      table: { category: "Typewriter", defaultValue: { summary: "7000" } },
    },
    pauseDuration: {
      control: { type: "range", min: 0, max: 5000, step: 100 },
      description: "ms pause after each message",
      table: { category: "Timing", defaultValue: { summary: "1000" } },
    },
    wordDuration: {
      control: { type: "range", min: 200, max: 5000, step: 100 },
      description: "ms a word-pulse message stays fully visible",
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
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Styling" },
    },
  },
  args: {
    messageConfigs,
    effect: "typewriter",
    introDelay: 500,
    typeSpeed: 80,
    deleteSpeed: 40,
    holdDuration: 7000,
    pauseDuration: 1000,
    wordDuration: 1200,
    fadeDuration: 400,
    hideCursorInCycle: true,
    styleClassPassthrough: [],
  },
  render: (args) => ({
    components: { SamaritanPromptMixed },
    setup() {
      const restartKey = computed(() => JSON.stringify(args));
      return { args, restartKey, stageStyle };
    },
    template: `
      <div :style="stageStyle">
        <SamaritanPromptMixed :key="restartKey" v-bind="args" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof SamaritanPromptMixed>;

export const Default: Story = {};

export const ThemeDefaults: Story = {
  name: "Theme Defaults",
  render: (args) => ({
    components: { SamaritanPromptMixed },
    setup() {
      const restartKey = computed(() => JSON.stringify(args));
      return { args, restartKey };
    },
    template: `
      <div style="display: grid; place-items: center; min-block-size: 32rem; padding: 3.2rem;">
        <SamaritanPromptMixed :key="restartKey" v-bind="args" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "No colour tokens set: text and underline follow `--theme-text`, the cursor `--theme-accent`.",
      },
    },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    introDelay: 0,
    messageConfigs: [
      {
        text: "Die Überwachungssysteme sind vollständig aktiviert und melden ungewöhnliche Aktivitäten",
        effect: "typewriter",
        typeSpeed: 30,
        holdDuration: 1500,
      },
      { text: "https://example.com/a/very/long/unbroken/path/that/never/wraps/on/its/own", effect: "word-pulse" },
      { text: "", effect: "typewriter", holdDuration: 300 },
      { text: "👍🏽 👨‍👩‍👧 ok", effect: "typewriter", holdDuration: 1500 },
      { text: "<b>Not bold</b>", effect: "word-pulse" },
      { text: "مرحبا بالعالم", effect: "typewriter", holdDuration: 1500 },
      { text: "x", effect: "typewriter", typeSpeed: 0, deleteSpeed: 0, holdDuration: 800, pauseDuration: 0 },
    ],
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
          "Hostile message configs at every `CanvasSwitcher` width, with `introDelay: 0`. Check that: the long German message and the unbroken URL wrap inside the canvas and stay centred; " +
          "the empty message passes without stopping the loop; emoji with a skin tone and a family emoji type as whole characters; `<b>` renders as text; the right-to-left message reads correctly; " +
          "the zero-speed single character still shows. Set `messageConfigs` to `[]` in Controls: the component idles instead of freezing the tab (until 2026-10-21 an empty list with `introDelay: 0` locked up the page).",
      },
    },
  },
};
