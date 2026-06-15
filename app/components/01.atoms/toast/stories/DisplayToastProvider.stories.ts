import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { useToastQueue } from "~/composables/useToastQueue";
import DisplayToastProvider from "../DisplayToastProvider.vue";
import type { DisplayToastTheme, DisplayToastPosition, DisplayToastAlignment } from "~/types/components";

type StoryArgs = {
  position: DisplayToastPosition;
  alignment: DisplayToastAlignment;
  fullWidth: boolean;
  maxVisible: number;
  theme: DisplayToastTheme;
  autoDismiss: boolean;
  duration: number;
};

const themes = ["info", "success", "warning", "error"] as const;

const messages: Record<DisplayToastTheme, { title: string; description: string }> = {
  info: { title: "Information", description: "This is an informational notification." },
  success: { title: "Success!", description: "Your action completed successfully." },
  warning: { title: "Warning", description: "Please review this before continuing." },
  error: { title: "Error", description: "Something went wrong. Please try again." },
};

export default {
  title: "Atoms/DisplayToastProvider",
  component: DisplayToastProvider,
  argTypes: {
    position: {
      control: { type: "select" },
      options: ["top", "bottom"],
      description: "Vertical position of toasts",
      table: { category: "Provider" },
    },
    alignment: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Horizontal alignment of toasts",
      table: { category: "Provider" },
    },
    fullWidth: {
      control: "boolean",
      description: "Toasts span full viewport width",
      table: { category: "Provider" },
    },
    maxVisible: {
      control: { type: "number", min: 1, max: 5 },
      description: "Max toasts shown simultaneously",
      table: { category: "Provider" },
    },
    theme: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
      description: "Theme for triggered toast",
      table: { category: "Toast" },
    },
    autoDismiss: {
      control: "boolean",
      description: "Auto-dismiss triggered toast",
      table: { category: "Toast" },
    },
    duration: {
      control: { type: "range", min: 1000, max: 10000, step: 500 },
      description: "Auto-dismiss duration in ms",
      table: { category: "Toast" },
    },
  },
  args: {
    position: "top",
    alignment: "right",
    fullWidth: false,
    maxVisible: 1,
    theme: "info",
    autoDismiss: true,
    duration: 4000,
  },
} as Meta<StoryArgs>;

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { DisplayToastProvider },
  setup() {
    const { show, clear } = useToastQueue();

    const triggerToast = () => {
      show({
        appearance: { theme: args.theme },
        behavior: { autoDismiss: args.autoDismiss, duration: args.duration },
        content: messages[args.theme],
      });
    };

    const queueAll = () => {
      themes.forEach((theme) => {
        show({
          appearance: { theme },
          behavior: { autoDismiss: args.autoDismiss, duration: args.duration },
          content: messages[theme],
        });
      });
    };

    return { args, triggerToast, queueAll, clear };
  },
  template: `
    <div style="padding: 2rem; min-height: 200px;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <button @click="triggerToast" style="padding: 0.6rem 1.4rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px;">Trigger Toast</button>
        <button @click="queueAll" style="padding: 0.6rem 1.4rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px;">Queue All Themes</button>
        <button @click="clear" style="padding: 0.6rem 1.4rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px;">Clear Queue</button>
      </div>
      <DisplayToastProvider
        :position="args.position"
        :alignment="args.alignment"
        :full-width="args.fullWidth"
        :max-visible="args.maxVisible"
      />
    </div>
  `,
});

export const Default = Template.bind({});

export const BottomLeft = Template.bind({});
BottomLeft.args = {
  position: "bottom",
  alignment: "left",
  theme: "success",
  autoDismiss: false,
};

export const Stacked = Template.bind({});
Stacked.args = {
  maxVisible: 3,
  autoDismiss: false,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
  theme: "warning",
  autoDismiss: false,
};
