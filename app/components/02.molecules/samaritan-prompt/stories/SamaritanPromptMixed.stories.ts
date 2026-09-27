import { computed } from "vue";
import SamaritanPromptMixed from "../SamaritanPromptMixed.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { SamaritanPromptMessageConfig } from "~/types/components";

// Dark stage because the default colours are white. Keying on the serialised args restarts the
// loop when a control changes, so the new value is visible straight away.
const stageStyle =
  "display: grid; place-items: center; min-block-size: 32rem; padding: 3.2rem; background: #000; color: #fff;";

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

export const LightPage: Story = {
  name: "Light Page (token override)",
  render: (args) => ({
    components: { SamaritanPromptMixed },
    setup() {
      const restartKey = computed(() => JSON.stringify(args));
      return { args, restartKey };
    },
    template: `
      <div style="display: grid; place-items: center; min-block-size: 32rem; padding: 3.2rem; background: #fff; --samaritan-prompt-text-colour: #000; --samaritan-prompt-underline-colour: #000;">
        <SamaritanPromptMixed :key="restartKey" v-bind="args" />
      </div>
    `,
  }),
};
