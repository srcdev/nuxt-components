import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../GlowingBorder.vue";
import InputTextCore from "../../../../05.forms/input-text/InputTextCore.vue";
import InputButton from "../../../../05.forms/input-button/InputButton.vue";
import CanvasSwitcher from "../../../canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

const PX_OPTIONS = ["1px", "2px", "3px", "4px", "5px", "6px"] as const;
const DURATION_OPTIONS = ["5s", "6s", "7s", "8s", "9s", "10s", "11s", "12s", "13s", "14s", "15s"] as const;

type StoryArgs = {
  tag: "div" | "p" | "span" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol";
  variant: "subtle" | "vivid" | "silver" | "steel" | "green";
  content: string;
  borderWidth: (typeof PX_OPTIONS)[number];
  borderRadius: (typeof PX_OPTIONS)[number];
  animationDuration: (typeof DURATION_OPTIONS)[number];
  canvasBackground: string;
  surface: string;
};

const darkColours = ["#000000", "#020024", "#0f0f23", "#1e293b", "#262626"];
const darkColourLabels = {
  "": "Theme default (light)",
  "#000000": "Black",
  "#020024": "Midnight",
  "#0f0f23": "Ink",
  "#1e293b": "Slate",
  "#262626": "Charcoal",
};
const surfaceLabels = { ...darkColourLabels, "#ffffff": "White" };
const isDark = (colour: string) => darkColours.includes(colour);

const tokenCategory = "CSS tokens (story only, set in your CSS)";

export default {
  title: "Atoms/Effects/GlowingBorder",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "p", "span", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "Root element tag",
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["subtle", "vivid", "silver", "steel", "green"],
      description: "Glow colour variant",
    },
    content: {
      control: { type: "text" },
      description: "**Story control, not a prop.** Text placed in the default slot.",
      table: { category: "Slot content (story only)" },
    },
    borderWidth: {
      control: { type: "select" },
      options: PX_OPTIONS,
      description: "**Story control, not a prop.** Sets `--glowing-border-width`. In your CSS: `.promo { --glowing-border-width: 4px; }`",
      table: { category: tokenCategory },
    },
    borderRadius: {
      control: { type: "select" },
      options: PX_OPTIONS,
      description: "**Story control, not a prop.** Sets `--glowing-border-radius`. In your CSS: `.promo { --glowing-border-radius: 6px; }`",
      table: { category: tokenCategory },
    },
    animationDuration: {
      control: { type: "select" },
      options: DURATION_OPTIONS,
      description:
        "**Story control, not a prop.** Sets `--glowing-border-animation-duration`. In your CSS: `.promo { --glowing-border-animation-duration: 6s; }`",
      table: { category: tokenCategory },
    },
    surface: {
      control: { type: "select", labels: surfaceLabels },
      options: ["", "#ffffff", ...darkColours],
      description:
        "**Story control, not a prop.** Sets `--glowing-border-surface` (and a light `--glowing-border-text-colour` for dark values). In your CSS: `.promo { --glowing-border-surface: #0f0f23; --glowing-border-text-colour: #f3f4f6; }`",
      table: { category: tokenCategory },
    },
    canvasBackground: {
      control: { type: "select", labels: darkColourLabels },
      options: ["", ...darkColours],
      description:
        "**Story control, not a prop.** Background of the demo stage, so the glow can be checked on a dark page.",
      table: { category: "Story canvas (story only)" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
    class: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    variant: "vivid",
    content: "This is default slot content for the GlowingBorder component. Any HTML content can be placed here.",
    borderWidth: "3px",
    borderRadius: "6px",
    animationDuration: "10s",
    canvasBackground: "",
    surface: "",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Wraps its default slot in an animated conic-gradient glow border. The canvas and surface controls are story-only, for checking the glow against dark themes.",
      },
    },
  },
} as Meta<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const stageStyle = computed(() => ({
    background: args.canvasBackground || undefined,
  }));
  const tokenStyle = computed(() => ({
    "--glowing-border-width": args.borderWidth,
    "--glowing-border-radius": args.borderRadius,
    "--glowing-border-animation-duration": args.animationDuration,
    "--glowing-border-surface": args.surface || undefined,
    "--glowing-border-text-colour":
      isDark(args.surface) ? "#f3f4f6" : undefined,
  }));
  return { args, stageStyle, tokenStyle };
}

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div style="padding: 40px;" :style="stageStyle">
      <StorybookComponent :tag="args.tag" :variant="args.variant" :style="tokenStyle">
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 600;">GlowingBorder</h3>
          <p style="margin: 0; line-height: 1.6;">{{ args.content }}</p>
        </div>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const Vivid = Template.bind({});
Vivid.args = {
  variant: "vivid",
  content:
    "Vivid variant creates a bright, attention-grabbing glow effect perfect for highlighting important content or call-to-action elements.",
};

export const Subtle = Template.bind({});
Subtle.args = {
  variant: "subtle",
  content:
    "Subtle variant provides a gentle glow that adds visual interest without being overwhelming, ideal for elegant content presentation.",
};

export const Silver = Template.bind({});
Silver.args = {
  variant: "silver",
  content:
    "Silver variant offers a metallic, sophisticated glow that works well in professional or modern design contexts.",
};

export const Steel = Template.bind({});
Steel.args = {
  variant: "steel",
  content:
    "Steel variant provides a cool, industrial glow effect that's perfect for technical or utilitarian design themes.",
};

export const Green = Template.bind({});
Green.args = {
  variant: "green",
  content: "Green variant cycles through vibrant, saturated greens for a fresh, energetic glow effect.",
};

export const CustomTokens = Template.bind({});
CustomTokens.args = {
  variant: "vivid",
  content: "Border width, radius, and animation speed all driven by the CSS token controls.",
  borderWidth: "6px",
  borderRadius: "4px",
  animationDuration: "5s",
};

export const HighlightedControls: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent, InputTextCore, InputButton },
  setup() {
    const { args: storyArgs, stageStyle } = useStorySetup(args);
    const glowStyle = (controlRadius: string) =>
      computed(() => ({
        "--glowing-border-width": args.borderWidth,
        "--glowing-border-radius": `calc(${controlRadius} + ${args.borderWidth})`,
        "--glowing-border-animation-duration": args.animationDuration,
        "--glowing-border-surface": "transparent",
        "--glowing-border-overflow": "visible",
        display: "inline-block",
      }));
    const buttonGlowStyle = glowStyle("var(--button-border-radius)");
    const inputGlowStyle = computed(() => ({
      ...glowStyle("var(--form-input-border-radius)").value,
      "--input-text-border": "transparent",
      display: "block",
    }));
    const email = ref("");
    return { args: storyArgs, stageStyle, buttonGlowStyle, inputGlowStyle, email };
  },
  template: `
    <div style="padding: 40px; display: grid; gap: 32px; justify-items: start;" :style="stageStyle">
      <StorybookComponent tag="span" :variant="args.variant" :style="buttonGlowStyle">
        <InputButton type="button" variant="primary" button-text="Book a free consultation"></InputButton>
      </StorybookComponent>

      <div style="display: grid; gap: 8px; inline-size: min(100%, 40rem);">
        <label for="highlighted-email">Early-access email</label>
        <StorybookComponent :variant="args.variant" :style="inputGlowStyle">
          <InputTextCore
            id="highlighted-email"
            v-model="email"
            type="email"
            name="highlighted-email"
            placeholder="eg. jane@example.com"
          ></InputTextCore>
        </StorybookComponent>
      </div>
    </div>
  `,
});
HighlightedControls.args = {
  variant: "vivid",
  borderWidth: "3px",
};
HighlightedControls.parameters = {
  docs: {
    description: {
      story:
        "The glow replaces a single control's border, for when a design calls out something special. No changes to the controls: " +
        "InputButton's border already matches its surface, and the input gets `--input-text-border: transparent`. On the GlowingBorder, " +
        "the radius is the control's radius plus the glow width, the surface is transparent, and `--glowing-border-overflow: visible` " +
        "keeps the controls' hover and focus outlines from being clipped. Tab through to check the focus rings.",
    },
  },
};

export const StressTest: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const longUnbroken = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft";
    const longUrl = "https://example.com/" + "a-very-long-path-segment-without-spaces".repeat(4);
    const longCopy =
      "Unsere Behandlungen werden individuell auf Ihre Bedürfnisse abgestimmt, damit Sie sich rundum wohlfühlen und entspannt nach Hause gehen können. ".repeat(
        6
      );
    return { ...useStorySetup(args), longUnbroken, longUrl, longCopy };
  },
  template: `
    <div style="padding: 24px 16px; display: grid; gap: 24px;" :style="stageStyle">
      <StorybookComponent :tag="args.tag" :variant="args.variant" :style="tokenStyle">
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 12px 0;">{{ longUnbroken }}</h3>
          <p style="margin: 0 0 12px 0;">{{ longUrl }}</p>
          <p style="margin: 0;">{{ longCopy }}</p>
        </div>
      </StorybookComponent>
      <StorybookComponent :tag="args.tag" :variant="args.variant" :style="tokenStyle"></StorybookComponent>
      <StorybookComponent :tag="args.tag" :variant="args.variant" :style="tokenStyle">A</StorybookComponent>
      <StorybookComponent :tag="args.tag" :variant="args.variant" :style="tokenStyle">
        <p style="margin: 0; padding: 12px;">🎉 Emoji first, then &lt;b&gt;html&lt;/b&gt; as text</p>
      </StorybookComponent>
      <StorybookComponent :tag="args.tag" :variant="args.variant" :style="tokenStyle">
        <p dir="rtl" style="margin: 0; padding: 12px;">نص عربي طويل من اليمين إلى اليسار للتحقق من الاتجاه</p>
      </StorybookComponent>
      <p style="margin: 0;">
        Inline use:
        <StorybookComponent tag="span" :variant="args.variant" :style="tokenStyle">{{ longUnbroken }}</StorybookComponent>
        sits in running text.
      </p>
    </div>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  borderWidth: "6px",
  borderRadius: "6px",
};
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
        "Oversized and odd slot content. Long unbroken words and URLs should wrap inside the border rather than being clipped " +
        "(the root has overflow: hidden), long German copy should grow the box, the empty one should collapse to just its border, " +
        "HTML-like text should render as text, RTL text should align right, and the inline span should wrap within running text. " +
        "Check at every canvas width and with each variant.",
    },
  },
};
