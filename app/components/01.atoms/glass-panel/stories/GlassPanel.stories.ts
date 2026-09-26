import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../GlassPanel.vue";

interface GlassPanelStoryArgs {
  tag: "div" | "section" | "article" | "main" | "header" | "footer";
  styleClassPassthrough: string;
  bg: string;
  borderColor: string;
  highlight: string;
  borderRadius: string;
  backdropFilter: string;
}

export default {
  title: "Atoms/GlassPanel",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main", "header", "footer"],
      description: "section/article get aria-labelledby pointing at the heading bound to the heading-id slot prop",
      table: { category: "Basic" },
    },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
    bg: {
      control: "color",
      description: "--glass-panel-bg (empty = default)",
      table: { category: "Tokens" },
    },
    borderColor: {
      control: "color",
      description: "--glass-panel-border-color (empty = default)",
      table: { category: "Tokens" },
    },
    highlight: {
      control: "color",
      description: "--glass-panel-highlight (empty = default)",
      table: { category: "Tokens" },
    },
    borderRadius: {
      control: { type: "select" },
      options: ["0rem", "0.4rem", "1rem", "1.6rem", "2.4rem"],
      description: "--glass-panel-border-radius (default 1rem)",
      table: { category: "Tokens" },
    },
    backdropFilter: {
      control: { type: "select" },
      options: ["none", "blur(6px)", "blur(14px) saturate(180%)", "blur(24px) saturate(140%)"],
      description: "--glass-panel-backdrop-filter (default blur(14px) saturate(180%))",
      table: { category: "Tokens" },
    },
  },
  args: {
    tag: "section",
    styleClassPassthrough: "",
    bg: "",
    borderColor: "",
    highlight: "",
    borderRadius: "1rem",
    backdropFilter: "blur(14px) saturate(180%)",
  },
} as Meta<GlassPanelStoryArgs>;

const Template: StoryFn<GlassPanelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const tokenStyle = computed(() => ({
      ...(args.bg ? { "--glass-panel-bg": args.bg } : {}),
      ...(args.borderColor ? { "--glass-panel-border-color": args.borderColor } : {}),
      ...(args.highlight ? { "--glass-panel-highlight": args.highlight } : {}),
      "--glass-panel-border-radius": args.borderRadius,
      "--glass-panel-backdrop-filter": args.backdropFilter,
    }));
    return { args, tokenStyle };
  },
  template: `
    <div
      :style="[
        tokenStyle,
        {
          padding: '4.8rem',
          minHeight: '40rem',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(circle at 20% 30%, oklch(70% 0.2 20) 0 12rem, transparent 12.1rem),' +
            'radial-gradient(circle at 75% 65%, oklch(65% 0.18 250) 0 14rem, transparent 14.1rem),' +
            'linear-gradient(135deg, oklch(85% 0.1 90), oklch(75% 0.12 300))',
        },
      ]"
    >
      <StorybookComponent :tag="args.tag" :style-class-passthrough="args.styleClassPassthrough">
        <template #default="{ headingId }">
          <div style="padding: 3.2rem; max-width: 36rem;">
            <h2 :id="headingId" style="margin: 0 0 1.2rem; font-size: 2.4rem;">Book a consultation</h2>
            <p style="margin: 0; font-size: 1.5rem;">
              GlassPanel only reads as glass over a busy background like this one. The coloured shapes
              behind are blurred and saturated by the panel's backdrop-filter.
            </p>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const NoFrosting = Template.bind({});
NoFrosting.args = { backdropFilter: "none" };

export const DarkGlass = Template.bind({});
DarkGlass.args = {
  bg: "#0c0c1473",
  borderColor: "#ffffff12",
  highlight: "#ffffff0a",
};
DarkGlass.parameters = {
  docs: { description: { story: "The pre-2026-09-26 dark-mode defaults, now set by the consumer." } },
};
