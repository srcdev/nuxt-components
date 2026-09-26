import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import InputButtonCore from "../../input-button/InputButtonCore.vue";

interface PendingEffectStoryArgs {
  isPending: boolean;
  theme: "default" | "success" | "error" | "warning";
  variant: "primary" | "secondary" | "tertiary";
  buttonText: string;
  lineColor: string;
  blurColor: string;
  lineThickness: string;
  lineLength: string;
  blurSize: string;
  offset: string;
  animationDuration: string;
}

export default {
  title: "Components/Forms/Pending Effect/PendingEffect",
  argTypes: {
    isPending: { control: "boolean", description: "InputButtonCore is-pending", table: { category: "State" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "State" },
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      table: { category: "Host button" },
    },
    buttonText: { control: "text", table: { category: "Host button" } },
    lineColor: {
      control: "color",
      description: "--pending-effect-line-color (empty = theme colour, var(--theme-surface))",
      table: { category: "Tokens" },
    },
    blurColor: {
      control: "color",
      description: "--pending-effect-blur-color (empty = theme colour; only visible when blurSize > 0rem)",
      table: { category: "Tokens" },
    },
    lineThickness: {
      control: { type: "select" },
      options: ["0.1rem", "0.2rem", "0.3rem", "0.4rem", "0.6rem"],
      description: "--pending-effect-line-thickness (default 0.1rem)",
      table: { category: "Tokens" },
    },
    lineLength: {
      control: { type: "select" },
      options: ["1rem", "2rem", "3rem", "3.5rem", "4.5rem"],
      description: "--pending-effect-line-length (default 2rem; the dash pattern repeats every 5rem)",
      table: { category: "Tokens" },
    },
    blurSize: {
      control: { type: "select" },
      options: ["0rem", "0.2rem", "0.3rem", "0.4rem", "0.6rem"],
      description: "--pending-effect-blur-size (default 0rem = no glow)",
      table: { category: "Tokens" },
    },
    offset: {
      control: { type: "select" },
      options: ["0rem", "0.5rem", "1rem", "2rem", "3rem"],
      description: "--pending-effect-offset (default 1rem, split across both sides)",
      table: { category: "Tokens" },
    },
    animationDuration: {
      control: { type: "select" },
      options: ["800ms", "1200ms", "2000ms", "3000ms", "5000ms"],
      description: "--pending-effect-animation-duration (default 3000ms)",
      table: { category: "Tokens" },
    },
  },
  args: {
    isPending: true,
    theme: "default",
    variant: "primary",
    buttonText: "Submitting",
    lineColor: "",
    blurColor: "",
    lineThickness: "0.1rem",
    lineLength: "2rem",
    blurSize: "0rem",
    offset: "1rem",
    animationDuration: "3000ms",
  },
} as Meta<PendingEffectStoryArgs>;

const Template: StoryFn<PendingEffectStoryArgs> = (args) => ({
  components: { InputButtonCore },
  setup() {
    const tokenStyle = computed(() => ({
      ...(args.lineColor ? { "--pending-effect-line-color": args.lineColor } : {}),
      ...(args.blurColor ? { "--pending-effect-blur-color": args.blurColor } : {}),
      "--pending-effect-line-thickness": args.lineThickness,
      "--pending-effect-line-length": args.lineLength,
      "--pending-effect-blur-size": args.blurSize,
      "--pending-effect-offset": args.offset,
      "--pending-effect-animation-duration": args.animationDuration,
    }));
    return { args, tokenStyle };
  },
  template: `
    <div style="margin: 3.6rem;">
      <p style="font-size: 1.4rem; margin-block-end: 2.4rem;">
        PendingEffect is rendered by InputButtonCore when <code>has-pending-effect</code> is set, and animates while
        <code>is-pending</code> is true. It is hidden under <code>prefers-reduced-motion: reduce</code>.
      </p>
      <div :style="tokenStyle">
        <InputButtonCore
          :button-text="args.buttonText"
          :variant="args.variant"
          :theme="args.theme"
          :is-pending="args.isPending"
          :has-pending-effect="true"
        />
      </div>
    </div>
  `,
});

export const Default = Template.bind({});

export const Exaggerated = Template.bind({});
Exaggerated.args = {
  lineThickness: "0.4rem",
  lineLength: "3.5rem",
  blurSize: "0.4rem",
  offset: "2rem",
  animationDuration: "1200ms",
};
