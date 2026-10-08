import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../ContainerGlow.vue";
import CanvasSwitcher from "../../../canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

type StoryArgs = {
  tag: "div" | "li" | "article" | "section";
  proximity: number;
  spread: number;
  blur: number;
  gap: number;
  vertical: boolean;
  inactiveOpacity: number;
  canvasBackground: string;
  cardBackground: string;
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

export default {
  title: "Atoms/Effects/ContainerGlow",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "li", "article", "section"],
      description: "HTML tag rendered for each glow container",
    },
    proximity: {
      control: { type: "range", min: 10, max: 200, step: 10 },
      description: "Mouse proximity distance (px) that triggers the glow",
      table: { category: "config" },
    },
    spread: {
      control: { type: "range", min: 20, max: 180, step: 10 },
      description: "Angular spread of the glow effect (degrees)",
      table: { category: "config" },
    },
    blur: {
      control: { type: "range", min: 0, max: 50, step: 2 },
      description: "Blur amount for the glow effect (px)",
      table: { category: "config" },
    },
    gap: {
      control: { type: "range", min: 8, max: 64, step: 4 },
      description: "Gap between containers (px)",
      table: { category: "config" },
    },
    vertical: {
      control: { type: "boolean" },
      description: "Arrange containers vertically instead of horizontally",
      table: { category: "config" },
    },
    inactiveOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "Opacity of the glow when not being hovered near",
      table: { category: "config" },
    },
    canvasBackground: {
      control: { type: "select", labels: darkColourLabels },
      options: ["", ...darkColours],
      description:
        "**Story control, not a prop.** Background of the demo stage behind the cards, so the glow can be checked on a dark page.",
      table: { category: "Story canvas (story only)" },
    },
    cardBackground: {
      control: { type: "select", labels: surfaceLabels },
      options: ["", "#ffffff", ...darkColours],
      description:
        "**Story control, not a prop.** Sets `--container-glow-background` (and a light `--container-glow-text-colour` for dark values). In your CSS: `.pricing { --container-glow-background: #0f0f23; --container-glow-text-colour: #f3f4f6; }`",
      table: { category: "CSS tokens (story only, set in your CSS)" },
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
    proximity: 40,
    spread: 80,
    blur: 20,
    gap: 32,
    vertical: false,
    inactiveOpacity: 0,
    canvasBackground: "",
    cardBackground: "",
  },
  parameters: {
    docs: {
      description: {
        component:
          "An interactive glow effect wrapper that creates one card per named slot the consumer provides, each with an animated gradient border that responds to mouse proximity. The canvas and card background controls are story-only, for checking the glow against dark themes.",
      },
    },
  },
} as Meta<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const config = computed(() => ({
    proximity: args.proximity,
    spread: args.spread,
    blur: args.blur,
    gap: args.gap,
    vertical: args.vertical,
    inactiveOpacity: args.inactiveOpacity,
  }));
  const stageStyle = computed(() => ({
    background: args.canvasBackground || undefined,
    "--container-glow-background": args.cardBackground || undefined,
    "--container-glow-text-colour":
      isDark(args.cardBackground) ? "#f3f4f6" : undefined,
  }));
  return { args, config, stageStyle };
}

const stageLayout = "padding: 60px 40px; min-height: 80vh; display: flex; align-items: center; justify-content: center;";
const cardStyle = "height: 100%; display: flex; flex-direction: column; justify-content: center; text-align: center;";

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div style="${stageLayout}" :style="stageStyle">
      <StorybookComponent :tag="args.tag" :config="config">
        <template #one>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Container 1</h3>
            <p style="margin: 0; font-size: 1.3rem;">Move your cursor nearby</p>
          </div>
        </template>
        <template #two>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Container 2</h3>
            <p style="margin: 0; font-size: 1.3rem;">Each named slot is one card</p>
          </div>
        </template>
        <template #three>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Container 3</h3>
            <p style="margin: 0; font-size: 1.3rem;">No item-count prop needed</p>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const SingleContainer: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div style="${stageLayout}" :style="stageStyle">
      <StorybookComponent :tag="args.tag" :config="config">
        <template #cta>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Single container</h3>
            <p style="margin: 0; font-size: 1.3rem;">Perfect for one highlighted call-to-action card</p>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Vertical = Template.bind({});
Vertical.args = {
  vertical: true,
};

export const HighIntensity = Template.bind({});
HighIntensity.args = {
  proximity: 100,
  spread: 120,
  blur: 40,
  gap: 48,
  inactiveOpacity: 0,
};

export const SubtleGlow = Template.bind({});
SubtleGlow.args = {
  proximity: 30,
  spread: 40,
  blur: 10,
  gap: 20,
  inactiveOpacity: 0,
};

export const StressTest: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const longUnbroken = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft";
    const longUrl = "https://example.com/" + "a-very-long-path-segment-without-spaces".repeat(4);
    const longCopy =
      "Unsere Behandlungen werden individuell auf Ihre Bedürfnisse abgestimmt, damit Sie sich rundum wohlfühlen und entspannt nach Hause gehen können. ".repeat(
        3
      );
    return { ...useStorySetup(args), longUnbroken, longUrl, longCopy };
  },
  template: `
    <div style="padding: 40px 16px; min-height: 80vh;" :style="stageStyle">
      <StorybookComponent :tag="args.tag" :config="config">
        <template #long-unbroken>
          <h3 style="margin: 0 0 8px 0;">{{ longUnbroken }}</h3>
          <p style="margin: 0;">{{ longUrl }}</p>
        </template>
        <template #long-copy>
          <h3 style="margin: 0 0 8px 0;">Sehr lange übersetzte Überschrift für eine Karte</h3>
          <p style="margin: 0; font-size: 1.3rem;">{{ longCopy }}</p>
        </template>
        <template #empty></template>
        <template #single-char><p style="margin: 0;">A</p></template>
        <template #emoji><p style="margin: 0;">🎉 Emoji first, then &lt;script&gt;alert("html")&lt;/script&gt; as text</p></template>
        <template #rtl><p dir="rtl" style="margin: 0;">نص عربي طويل من اليمين إلى اليسار للتحقق من الاتجاه</p></template>
        <template #broken-image>
          <img src="/does-not-exist.jpg" alt="Broken image" width="200" height="120" style="max-width: 100%; height: auto;" />
        </template>
        <template #eight><p style="margin: 0;">Card 8</p></template>
        <template #nine><p style="margin: 0;">Card 9</p></template>
        <template #ten><p style="margin: 0;">Card 10</p></template>
      </StorybookComponent>
    </div>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  tag: "li",
  gap: 16,
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
        "Hostile content to find breakage. Ten cards should wrap onto new rows instead of overflowing sideways, " +
        "long unbroken words and URLs should wrap inside the 280px card, the long German copy should grow the card past its aspect ratio " +
        "rather than spilling out, the empty card should keep its size, HTML-like text should render as text, RTL text should align right, " +
        "and the broken image should not stretch the card. With tag 'li' the wrapper renders as a ul. " +
        "Negative, fractional and non-finite config values are clamped (covered by unit tests), so the layout should never collapse. Check at every canvas width.",
    },
  },
};
