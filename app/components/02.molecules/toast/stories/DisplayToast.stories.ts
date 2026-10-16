import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";
import StorybookComponent from "../DisplayToast.vue";

type CanvasKey = "none" | "gradient" | "lake" | "portrait" | "dark-photo" | "stripes" | "page-text";

const busyBackdrop = [
  "repeating-linear-gradient(45deg, oklch(100% 0 0 / 0.18) 0 1.2rem, transparent 1.2rem 2.4rem)",
  "linear-gradient(120deg, oklch(70% 0.2 30), oklch(75% 0.18 90) 35%, oklch(65% 0.2 200) 70%, oklch(55% 0.22 300))",
].join(", ");

const canvases: Record<CanvasKey, string> = {
  none: "",
  gradient: "background: linear-gradient(135deg, oklch(40% 0.15 250), oklch(25% 0.1 300));",
  lake: "background: url('/images/banners/video/lake-banner.jpg') center / cover;",
  portrait: "background: url('/images/page/hero/hero-blonde.jpg') center 30% / cover;",
  "dark-photo": "background: url('/images/page/hero/hero-dark.jpg') center / cover;",
  stripes: `background: ${busyBackdrop};`,
  "page-text": "background: white;",
};

const pageText = Array.from(
  { length: 6 },
  () =>
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
);

/*
 * The toast teleports to <body>, so a fill override on a story wrapper never reaches it. Inject a
 * rule on .display-toast instead: --theme-surface-subtle then resolves against the toast's data-theme.
 */
function useMaskedFillStyle(fill: () => number) {
  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  watchEffect(() => {
    styleEl.textContent =
      fill() === 80
        ? ""
        : `.display-toast { --alert-masked-content-background: color-mix(in oklab, var(--theme-surface-subtle) ${fill()}%, transparent); }`;
  });
  onUnmounted(() => styleEl.remove());
}

interface ToastStoryArgs {
  theme: "info" | "success" | "warning" | "error";
  position: "top" | "bottom";
  alignment: "left" | "center" | "right";
  fullWidth: boolean;
  masked: boolean;
  maskedFill: number;
  canvas: CanvasKey;
  autoDismiss: boolean;
  duration: number;
  revealDuration: number;
  title: string;
  description: string;
  customIcon: string;
}

export default {
  title: "Molecules/DisplayToast",
  component: StorybookComponent,
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
      description: "Toast theme/variant",
      table: { category: "Appearance" },
    },
    position: {
      control: { type: "select" },
      options: ["top", "bottom"],
      description: "Vertical position of toast",
      table: { category: "Appearance" },
    },
    alignment: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Horizontal alignment of toast",
      table: { category: "Appearance" },
    },
    fullWidth: {
      control: { type: "boolean" },
      description: "Whether toast spans full width",
      table: { category: "Appearance" },
    },
    masked: {
      control: { type: "boolean" },
      description: "Render with AlertMaskedContent (SVG border, translucent fill) instead of AlertContent",
      table: { category: "Appearance" },
    },
    maskedFill: {
      control: { type: "range", min: 0, max: 100, step: 5 },
      description:
        "Story-only: opacity (%) of the masked fill, set via --alert-masked-content-background. 80 is the library default; lower values cost contrast",
      if: { arg: "masked" },
      table: { category: "Story canvas" },
    },
    canvas: {
      control: { type: "select" },
      options: ["none", "gradient", "lake", "portrait", "dark-photo", "stripes", "page-text"],
      description: "Story-only: full-viewport backdrop behind the toast, to show what the masked variant lets through",
      table: { category: "Story canvas" },
    },
    autoDismiss: {
      control: { type: "boolean" },
      description: "Auto dismiss toast after duration",
      table: { category: "Behaviour" },
    },
    duration: {
      control: { type: "range", min: 1000, max: 10000, step: 500 },
      description: "Auto dismiss duration in milliseconds",
      table: { category: "Behaviour" },
    },
    revealDuration: {
      control: { type: "range", min: 100, max: 1000, step: 50 },
      description: "Animation duration for reveal/hide",
      table: { category: "Behaviour" },
    },
    title: {
      control: { type: "text" },
      description: "Toast title text",
      table: { category: "Content" },
    },
    description: {
      control: { type: "text" },
      description: "Toast description text shown below the title",
      table: { category: "Content" },
    },
    customIcon: {
      control: { type: "text" },
      description: "Custom icon name (Iconify, e.g. 'akar-icons:check-box')",
      table: { category: "Content" },
    },
    config: { table: { disable: true } },
    modelValue: { table: { disable: true } },
  },
  args: {
    theme: "info",
    position: "top",
    alignment: "right",
    fullWidth: false,
    masked: false,
    maskedFill: 80,
    canvas: "none",
    autoDismiss: false,
    duration: 3000,
    revealDuration: 300,
    title: "Notification",
    description: "This is a toast notification message.",
    customIcon: "",
  },
  parameters: {
    // Own iframe on the Docs page: each story opens a viewport-fixed toast on mount.
    docs: { story: { inline: false, height: "320px" } },
  },
} as Meta<ToastStoryArgs>;

const Template: StoryFn<ToastStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const isActive = ref(false);

    onMounted(() => {
      setTimeout(() => {
        isActive.value = true;
      }, 500);
    });

    useMaskedFillStyle(() => args.maskedFill);
    const canvasStyle = computed(() => canvases[args.canvas]);

    return { args, isActive, canvasStyle, pageText };
  },
  template: `
    <div
      v-if="args.canvas !== 'none'"
      :style="canvasStyle + ' position: fixed; inset: 0; overflow: hidden; padding: 6rem 2rem 2rem; font-family: sans-serif; font-size: 1.6rem; line-height: 1.5; color: #222;'"
    >
      <template v-if="args.canvas === 'page-text'">
        <h2 style="margin: 0 0 1rem;">Article heading behind the toast</h2>
        <p v-for="(para, i) in pageText" :key="i" style="margin: 0 0 1rem;">{{ para }}</p>
      </template>
    </div>
    <div style="position: relative; height: 200px; padding: 20px;">
      <button
        @click="isActive = true"
        style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Trigger Toast
      </button>

      <StorybookComponent
        v-model="isActive"
        :config="{
          appearance: {
            theme: args.theme,
            position: args.position,
            alignment: args.alignment,
            fullWidth: args.fullWidth,
            masked: args.masked,
          },
          behavior: {
            autoDismiss: args.autoDismiss,
            duration: args.duration,
            revealDuration: args.revealDuration,
          },
          content: {
            title: args.title,
            description: args.description,
            ...(args.customIcon && { customIcon: args.customIcon }),
          },
        }"
      />
    </div>
  `,
});

export const Default = Template.bind({});

export const SuccessToast = Template.bind({});
SuccessToast.args = {
  theme: "success",
  title: "Changes saved",
  description: "Your changes have been saved successfully.",
  customIcon: "akar-icons:check-box",
  autoDismiss: false,
};

export const ErrorToast = Template.bind({});
ErrorToast.args = {
  theme: "error",
  title: "Something went wrong",
  description: "Please try again or contact support if the problem persists.",
  autoDismiss: false,
  position: "top",
  alignment: "center",
};

export const WarningToast = Template.bind({});
WarningToast.args = {
  theme: "warning",
  title: "Action required",
  description: "Please review the highlighted fields before continuing.",
  autoDismiss: false,
};

export const AutoDismiss = Template.bind({});
AutoDismiss.args = {
  theme: "info",
  title: "Auto-dismissing",
  description: "This toast will dismiss itself after 3 seconds.",
  autoDismiss: true,
  duration: 3000,
};

export const BottomCenter = Template.bind({});
BottomCenter.args = {
  theme: "info",
  title: "Bottom centre",
  description: "Positioned at the bottom centre of the viewport.",
  position: "bottom",
  alignment: "center",
  autoDismiss: false,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  theme: "warning",
  title: "Full width warning",
  description: "This toast spans the full width of the viewport.",
  fullWidth: true,
  position: "top",
  autoDismiss: false,
};

export const StressTest = Template.bind({});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  theme: "error",
  alignment: "center",
  autoDismiss: true,
  duration: 10000,
  title: "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft",
  description:
    "Ihre Zahlung konnte leider nicht verarbeitet werden. Bitte überprüfen Sie Ihre Kartendaten und versuchen Sie es erneut, oder wenden Sie sich an Ihre Bank. https://example.com/a-very-long-path-segment-without-any-spaces-at-all-in-it",
};
StressTest.parameters = {
  docs: {
    description: {
      story:
        "Long unbroken title, long German description and a long URL, centred (the alignment most likely to overflow). " +
        "Toasts are fixed to the viewport, so use Storybook's viewport toolbar to check narrow screens. Try every alignment " +
        "and fullWidth: the toast should stay inside the viewport, cap at 48rem on wide screens, and wrap the unbroken text. " +
        "Hover it or tab to it to check the progress bar and the 10s timer pause.",
    },
  },
};

export const MaskedOverGradient = Template.bind({});
MaskedOverGradient.storyName = "Masked: Over Gradient";
MaskedOverGradient.args = {
  masked: true,
  canvas: "gradient",
  title: "Masked toast",
  description: "AlertMaskedContent: the accent border is an SVG cut-out and the fill is 80% translucent.",
};
MaskedOverGradient.parameters = {
  docs: {
    description: {
      story:
        "`appearance.masked: true` swaps AlertContent for AlertMaskedContent. Over a flat gradient the effect is subtle: " +
        "switch `canvas` to a photo or the stripes to see the backdrop through the fill.",
    },
  },
};

export const MaskedOverPhoto = Template.bind({});
MaskedOverPhoto.storyName = "Masked: Over Photo";
MaskedOverPhoto.args = {
  theme: "success",
  masked: true,
  canvas: "portrait",
  title: "Booking confirmed",
  description: "We've sent the details to your inbox.",
  customIcon: "akar-icons:check-box",
};
MaskedOverPhoto.parameters = {
  docs: {
    description: {
      story:
        "A photo backdrop is where the masked variant earns its place: the image stays visible through the body and around the border. " +
        "Try `lake` and `dark-photo` too, and every theme.",
    },
  },
};

export const MaskedVsOpaque: StoryFn<ToastStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const isActive = ref(false);
    onMounted(() => {
      setTimeout(() => {
        isActive.value = true;
      }, 500);
    });
    useMaskedFillStyle(() => args.maskedFill);
    const canvasStyle = computed(() => canvases[args.canvas]);
    const config = (masked: boolean, alignment: "left" | "right") => ({
      appearance: { theme: args.theme, position: args.position, alignment, masked },
      behavior: { autoDismiss: false, revealDuration: args.revealDuration },
      content: { title: masked ? "AlertMaskedContent" : "AlertContent", description: args.description },
    });
    return { args, isActive, canvasStyle, config };
  },
  template: `
    <div :style="canvasStyle + ' position: fixed; inset: 0;'"></div>
    <div style="position: relative; padding: 20px;">
      <button
        @click="isActive = true"
        style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Trigger Toasts
      </button>
    </div>
    <StorybookComponent v-model="isActive" :config="config(false, 'left')" />
    <StorybookComponent v-model="isActive" :config="config(true, 'right')" />
  `,
});
MaskedVsOpaque.storyName = "Masked: Side by Side with Opaque";
MaskedVsOpaque.args = {
  masked: true,
  canvas: "lake",
  description: "Same theme, same backdrop: opaque on the left, masked on the right.",
};
MaskedVsOpaque.argTypes = {
  masked: { table: { disable: true } },
  alignment: { table: { disable: true } },
  fullWidth: { table: { disable: true } },
  title: { table: { disable: true } },
  customIcon: { table: { disable: true } },
  autoDismiss: { table: { disable: true } },
  duration: { table: { disable: true } },
};
MaskedVsOpaque.parameters = {
  docs: {
    description: {
      story:
        "Two toasts over one backdrop: AlertContent (left) and AlertMaskedContent (right). Change `canvas` and `theme` to compare, " +
        "and drag `maskedFill` to see how much backdrop the masked one lets through.",
    },
  },
};

export const MaskedLowContrast = Template.bind({});
MaskedLowContrast.storyName = "Masked: Low Contrast Risk";
MaskedLowContrast.args = {
  theme: "info",
  masked: true,
  maskedFill: 35,
  canvas: "page-text",
  alignment: "center",
  title: "Hard to read",
  description: "Page text shows through a 35% fill and fights with the toast's own text.",
};
MaskedLowContrast.parameters = {
  docs: {
    description: {
      story:
        "What can go wrong. The default 80% fill keeps `--theme-text` readable over most backdrops, but contrast depends on what's behind the toast, " +
        "which you don't control once it's fixed to the viewport. Here the fill is lowered to 35% over body copy, so letterforms from the page " +
        "show through and compete with the message. Other traps to try: `stripes` or `portrait` with a low fill (busy detail behind small text), " +
        "and the `info` theme over `gradient` (the 1px accent border nearly vanishes against a backdrop of a similar hue). " +
        "Drag `maskedFill` back up to 80 to see the default recover. If you lower `--alert-masked-content-background`, test it over your real imagery and content, " +
        "and prefer the opaque variant for error and warning toasts that must be read.",
    },
  },
};
