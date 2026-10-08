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
  title: "Molecules/DisplayToastProvider",
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

const longUnbroken = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft";

const stressToasts = [
  {
    theme: "error" as const,
    title: "Ihre Zahlung konnte leider nicht verarbeitet werden, bitte überprüfen Sie Ihre Kartendaten",
    description:
      "Die Bank hat die Transaktion abgelehnt. Bitte versuchen Sie es mit einer anderen Zahlungsmethode erneut oder wenden Sie sich an Ihre Bank, um weitere Informationen zu erhalten. ".repeat(
        2
      ),
  },
  { theme: "warning" as const, title: longUnbroken, description: "https://example.com/" + "a-long-path-segment".repeat(6) },
  { theme: "success" as const, title: "🎉 Emoji first", description: "<b>Not bold</b> <script>alert('x')</script>" },
  { theme: "info" as const, title: "تم حفظ التغييرات بنجاح", description: "نص عربي طويل من اليمين إلى اليسار للتحقق من الاتجاه" },
  { theme: "info" as const, title: "A", description: "" },
  { theme: "info" as const, title: "", description: "Description only, no title." },
];

export const StressTest: StoryFn<StoryArgs> = (args) => ({
  components: { DisplayToastProvider },
  setup() {
    const { show, clear } = useToastQueue();
    const queueStress = () => {
      stressToasts.forEach(({ theme, title, description }) => {
        show({
          appearance: { theme },
          behavior: { autoDismiss: args.autoDismiss, duration: args.duration },
          content: { title, description, dismissLabel: "Benachrichtigung schließen" },
        });
      });
    };
    const flood = () => {
      for (let index = 1; index <= 20; index++) {
        show({ behavior: { autoDismiss: true, duration: 1500 }, content: { title: `Toast ${index} of 20` } });
      }
    };
    return { args, queueStress, flood, clear };
  },
  template: `
    <div style="padding: 2rem; min-height: 200px;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <button @click="queueStress" style="padding: 0.6rem 1.4rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px;">Queue worst-case toasts</button>
        <button @click="flood" style="padding: 0.6rem 1.4rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px;">Flood 20 toasts</button>
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
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  maxVisible: 5,
  autoDismiss: true,
  duration: 8000,
};
StressTest.parameters = {
  docs: {
    description: {
      story:
        "Hostile toast content: long German copy, an unbroken word as the title, a long URL, emoji first, HTML-like text " +
        "(must render as text), RTL, a one-character title, empty title and empty description, plus a flood of 20 queued toasts. " +
        "Toasts are fixed to the viewport, so use Storybook's viewport toolbar (not a canvas width) to check narrow screens. " +
        "Check that every toast stays inside the viewport and caps at 48rem on wide screens, unbroken text wraps, hovering a toast " +
        "or tabbing into it freezes its progress bar and timer, and the flood drains in order without stacking past maxVisible.",
    },
  },
};
