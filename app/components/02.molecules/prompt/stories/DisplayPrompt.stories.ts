import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import StorybookComponent from "../DisplayPrompt.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only args: drive AlertContent's CSS tokens, not DisplayPrompt props. See their argTypes entries.
type StoryArgs = InstanceType<typeof StorybookComponent>["$props"] & {
  titleLineClamp: LineClamp;
  textLineClamp: LineClamp;
};

const lineClampArgType = (token: string, example: string) => ({
  control: "select" as const,
  options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
  description:
    `**Story control, not a prop.** Sets the \`${token}\` CSS token on a wrapper so you can try it here. ` +
    `To use it in an app, set the token in your own CSS, e.g. \`.site-notice { ${token}: ${example}; }\`. ` +
    "`1` is single-line ellipsis, `none` (the default) shows everything. Don't clamp messages people need to read in full.",
  table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
});

const meta: Meta<StoryArgs> = {
  title: "Molecules/DisplayPrompt",
  component: StorybookComponent,
  argTypes: {
    titleLineClamp: lineClampArgType("--alert-content-title-line-clamp", "1"),
    textLineClamp: lineClampArgType("--alert-content-text-line-clamp", "3"),
    theme: {
      control: { type: "inline-radio" },
      options: ["info", "success", "warning", "error"],
      description: "Semantic theme for the prompt",
      table: { category: "Appearance" },
    },
    dismissible: {
      control: { type: "boolean" },
      description: "Show a close button to dismiss the prompt",
      table: { category: "Behaviour" },
    },
    useAutoFocus: {
      control: { type: "boolean" },
      description: "Focuses the prompt element on mount",
      table: { category: "Behaviour" },
    },
    masked: {
      control: { type: "boolean" },
      description: "Render with AlertMaskedContent instead of AlertContent",
      table: { category: "Appearance" },
    },
    closeLabel: {
      control: { type: "text" },
      description: "Dismiss button label (screen-reader) — override for localisation",
      table: { category: "Accessibility" },
    },
    styleClassPassthrough: {
      control: { type: "object" },
      description: "Extra classes applied to the prompt wrapper",
      table: { category: "Styling" },
    },
    modelValue: { table: { disable: true } },
  },
  args: {
    theme: "info",
    dismissible: false,
    useAutoFocus: false,
    masked: false,
    closeLabel: "Close this prompt",
    styleClassPassthrough: [],
    titleLineClamp: "none",
    textLineClamp: "none",
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const tokenStyles = computed(() => ({
    "--alert-content-title-line-clamp": args.titleLineClamp,
    "--alert-content-text-line-clamp": args.textLineClamp,
  }));
  return { args, tokenStyles };
}

const Template: Story = {
  render: (args) => ({
    components: { StorybookComponent },
    setup() {
      const model = ref(false);
      return { ...useStorySetup(args), model };
    },
    template: `
      <div :style="tokenStyles" style="padding: 2rem; max-width: 640px;">
        <StorybookComponent
          v-model="model"
          :theme="args.theme"
          :dismissible="args.dismissible"
          :use-auto-focus="args.useAutoFocus"
          :masked="args.masked"
          :close-label="args.closeLabel"
          :style-class-passthrough="args.styleClassPassthrough"
        >
          <template #title>Prompt title</template>
          <template #content>This is the prompt content. It can contain any information you want to communicate to the user.</template>
        </StorybookComponent>
      </div>
    `,
  }),
};

export const Default: Story = { ...Template };

export const InfoTheme: Story = { ...Template, args: { theme: "info", dismissible: true } };

export const SuccessTheme: Story = { ...Template, args: { theme: "success", dismissible: true } };

export const WarningTheme: Story = { ...Template, args: { theme: "warning", dismissible: true } };

export const ErrorTheme: Story = { ...Template, args: { theme: "error", dismissible: true } };

export const Dismissible: Story = { ...Template, args: { theme: "info", dismissible: true } };

export const AllThemesDismissible: Story = {
  render: () => ({
    components: { StorybookComponent },
    setup() {
      return { themes: ["info", "success", "warning", "error"] as const };
    },
    template: `
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.6rem; max-width: 640px;">
        <StorybookComponent
          v-for="theme in themes"
          :key="theme"
          :theme="theme"
          :dismissible="true"
        >
          <template #title>{{ theme.charAt(0).toUpperCase() + theme.slice(1) }} prompt</template>
          <template #content>This is the {{ theme }} variant of the prompt component.</template>
        </StorybookComponent>
      </div>
    `,
  }),
  // Fixed showcase: hardcoded values, so Controls would do nothing here.
  parameters: { controls: { disable: true } },
};

const stressPrompts = [
  {
    key: "german",
    theme: "error",
    title: "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft",
    content:
      "Ihre Sitzung läuft in Kürze ab. Bitte speichern Sie alle ungespeicherten Änderungen, bevor Sie fortfahren, sonst gehen sie verloren. https://example.com/konto/sitzung/a-very-long-path-segment-without-any-spaces-at-all-in-it",
    closeLabel: "Diese Benachrichtigung schließen und nicht erneut anzeigen",
  },
  {
    key: "emoji-html",
    theme: "warning",
    title: "🚨🔥 Heads up <script>alert('xss')</script>",
    content: "<b>Not bold</b> &amp; <img src=x onerror=alert(1)> should all render as plain text. 👍🏽👨‍👩‍👧‍👦",
    decoratorIcon: "🚨",
  },
  {
    key: "rtl",
    theme: "info",
    dir: "rtl",
    title: "تنبيه مهم بخصوص حسابك",
    content: "تم تحديث شروط الخدمة. يرجى مراجعة التغييرات قبل المتابعة لاستخدام الموقع.",
    closeLabel: "إغلاق",
  },
  {
    key: "masked",
    theme: "success",
    masked: true,
    title: "Gespeichert: Kundendienstmitarbeiterkontaktaufnahmeformular",
    content: "Masked variant over a gradient, with an unbroken German compound in the title.",
  },
  {
    key: "title-only",
    theme: "success",
    title: "Ok",
  },
  {
    key: "empty-title",
    theme: "info",
    title: "",
    content: "An empty title slot, a custom close icon and nothing else.",
    customCloseIcon: true,
  },
  {
    key: "content-only",
    theme: "warning",
    content: "x",
  },
];

/**
 * Stress test — hostile content across several prompts, inside the CanvasSwitcher so it can be
 * checked at every width.
 */
export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: { titleLineClamp: "none", textLineClamp: "none" },
  decorators: [
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
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  render: (args) => ({
    components: { StorybookComponent },
    setup() {
      return { ...useStorySetup(args), stressPrompts };
    },
    template: `
      <div :style="tokenStyles" style="display: grid; gap: 1.6rem;">
        <div
          v-for="prompt in stressPrompts"
          :key="prompt.key"
          :dir="prompt.dir"
          :style="prompt.masked ? 'padding: 1.6rem; background: linear-gradient(135deg, oklch(40% 0.15 250), oklch(25% 0.1 300));' : undefined"
        >
          <StorybookComponent
            :theme="prompt.theme"
            :masked="prompt.masked ?? false"
            :close-label="prompt.closeLabel"
            dismissible
          >
            <template v-if="prompt.decoratorIcon" #customDecoratorIcon>{{ prompt.decoratorIcon }}</template>
            <template v-if="prompt.title !== undefined" #title>{{ prompt.title }}</template>
            <template v-if="prompt.content" #content>{{ prompt.content }}</template>
            <template v-if="prompt.customCloseIcon" #customCloseIcon>✕</template>
          </StorybookComponent>
        </div>
      </div>
    `,
  }),
  parameters: {
    layout: "fullscreen",
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Hostile content: an unbroken German compound as the title, long German copy ending in a long URL, a long German close label, " +
          "emoji at the start and as the decorator icon, HTML-like text (must render as text), right-to-left Arabic, the masked variant over a gradient, " +
          "a two-character title, an empty title slot with a custom close icon, and a one-character message with no title. " +
          "Check at every CanvasSwitcher width that nothing overflows or gets clipped, unbroken text wraps, the icon and dismiss button keep their size, " +
          "the RTL prompt mirrors, and dismissing any prompt collapses it to zero height (the story's own grid gap stays)." +
          "The two line-clamp controls are AlertContent CSS tokens (story only), not props: try `1` to see single-line ellipsis.",
      },
    },
  },
};
