import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../DisplayPill.vue";

type LineClamp = "none" | "1" | "2" | "3";

// labelLineClamp is story-only: it drives a CSS token, not a DisplayPill prop. See its argTypes entry.
type StoryArgs = {
  tag: "span" | "div" | "button" | "a";
  label: string;
  size: "sm" | "md" | "lg";
  variant: "default" | "primary" | "success" | "warning" | "danger" | "neutral";
  reversed: boolean;
  showIcon: boolean;
  labelLineClamp: LineClamp;
  ring?: boolean;
};

export default {
  title: "Atoms/DisplayPill",
  component: StorybookComponent,
  parameters: {
    docs: {
      description: {
        component:
          "Used for the neutral duration and price pills in [ServiceSummary](?path=/story/organisms-services-service-summary--default) " +
          "and [ServiceDetail](?path=/story/organisms-services-service-detail--default), which restyle them through their own pill tokens.",
      },
    },
  },
  argTypes: {
    labelLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--display-pill-label-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.tag-list { --display-pill-label-line-clamp: none; }`. " +
        "`1` (the default) is single-line ellipsis, `none` lets a long label wrap.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "1" } },
    },
    tag: {
      control: { type: "inline-radio" },
      options: ["span", "div", "button", "a"],
      description: "Root element tag",
    },
    label: {
      control: { type: "text" },
      description: "Pill label text",
    },
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "md", "lg"],
      description: "Pill size",
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["default", "primary", "success", "warning", "danger", "neutral"],
      description: "Colour variant",
    },
    reversed: {
      control: { type: "boolean" },
      description: "Swap icon and label order",
    },
    showIcon: {
      control: { type: "boolean" },
      description: "Show icon slot",
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
    tag: "span",
    label: "Status",
    size: "md",
    variant: "default",
    reversed: false,
    showIcon: true,
    labelLineClamp: "1",
  },
} as Meta<StoryArgs>;

// Links open in the Storybook manager (target="_top"), not inside the preview iframe.
const usedByNote = `
  <p style="margin: 0; flex-basis: 100%; text-align: center; font-size: 1.4rem;">
    In use: the duration and price pills in the
    <a href="/?path=/story/organisms-services-service-summary--default" target="_top">ServiceSummary</a> and
    <a href="/?path=/story/organisms-services-service-detail--default" target="_top">ServiceDetail</a> stories.
  </p>
`;

const tokenStyles = (args: StoryArgs) =>
  computed(() => ({ "--display-pill-label-line-clamp": args.labelLineClamp }));

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, tokenStyles: tokenStyles(args) };
  },
  template: `
    <div :style="tokenStyles" style="display: flex; align-items: center; align-content: center; justify-content: center; min-height: 100vh; gap: 1.6rem; flex-wrap: wrap;">
      ${usedByNote}
      <StorybookComponent
        :tag="args.tag"
        :label="args.label"
        :size="args.size"
        :variant="args.variant"
        :reversed="args.reversed"
      >
        <template v-if="args.showIcon" #icon>
          <Icon name="material-symbols:check-circle-outline" />
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

const variants = ["default", "primary", "success", "warning", "danger", "neutral"] as const;

export const AllVariants: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, variants, tokenStyles: tokenStyles(args) };
  },
  template: `
    <div :style="tokenStyles" style="display: flex; align-items: center; align-content: center; justify-content: center; min-height: 100vh; gap: 1.6rem; flex-wrap: wrap;">
      ${usedByNote}
      <StorybookComponent
        v-for="variant in variants"
        :key="variant"
        :tag="args.tag"
        :label="variant"
        :size="args.size"
        :variant="variant"
        :reversed="args.reversed"
      >
        <template v-if="args.showIcon" #icon>
          <Icon name="material-symbols:check-circle-outline" />
        </template>
      </StorybookComponent>
    </div>
  `,
});
AllVariants.argTypes = { variant: { table: { disable: true } }, label: { table: { disable: true } } };

// Each variant keeps its own text colour, so currentColor borders follow the variant. Neutral's text is a light
// step (it's the dark, inverted pill), so it's darkened here to stay visible once its background is transparent.
const tokenShowcase =
  (tokens: string, argTokens: (args: StoryArgs) => Record<string, string> = () => ({})): StoryFn<StoryArgs> =>
  (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, variants, argStyles: computed(() => argTokens(args)) };
  },
  template: `
    <div :style="argStyles" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; gap: 1.6rem; flex-wrap: wrap; ${tokens}">
      <StorybookComponent
        v-for="variant in variants"
        :key="variant"
        :tag="args.tag"
        :label="variant"
        :size="args.size"
        :variant="variant"
        :reversed="args.reversed"
      >
        <template v-if="args.showIcon" #icon>
          <Icon name="material-symbols:check-circle-outline" />
        </template>
      </StorybookComponent>
    </div>
  `,
});

const showcaseArgTypes = {
  variant: { table: { disable: true } },
  label: { table: { disable: true } },
  labelLineClamp: { table: { disable: true } },
};

export const OutlinedViaBaseTokens = tokenShowcase(`
  --display-pill-background: transparent;
  --display-pill-border-width: 0.2rem;
  --display-pill-border-colour: var(--slate-05);
  --display-pill-primary-border-colour: var(--blue-06);
  --display-pill-success-border-colour: var(--status-success);
  --display-pill-warning-border-colour: var(--status-warning);
  --display-pill-danger-border-colour: var(--status-danger);
  --display-pill-neutral-border-colour: var(--slate-08);
  --display-pill-neutral-text-colour: var(--slate-08);
`);
OutlinedViaBaseTokens.storyName = "Outlined (base tokens override every variant)";
OutlinedViaBaseTokens.argTypes = showcaseArgTypes;
OutlinedViaBaseTokens.parameters = {
  docs: {
    description: {
      story:
        "A transparent base --display-pill-background on an ancestor clears every variant's fill; --display-pill-border-colour sets a base border, " +
        "and the per-variant --display-pill-<variant>-border-colour tokens give each variant its own mid-step status colour while the text keeps its darker step. " +
        "--display-pill-neutral-text-colour darkens the neutral pill, whose default text is light because it's normally a dark, inverted pill.",
    },
  },
};

// A 2px ring in each variant's light -02 step, toggled by the story-only ring control.
const ring02Tokens: Record<string, string> = {
  "--display-pill-ring-width": "0.2rem",
  "--display-pill-ring-colour": "var(--slate-02)",
  "--display-pill-primary-ring-colour": "var(--blue-02)",
  "--display-pill-success-ring-colour": "var(--green-02)",
  "--display-pill-warning-ring-colour": "var(--orange-02)",
  "--display-pill-danger-ring-colour": "var(--red-02)",
  "--display-pill-neutral-ring-colour": "var(--slate-02)",
};

const ringArgTypes = {
  ...showcaseArgTypes,
  ring: {
    control: "boolean" as const,
    description:
      "**Story control, not a prop.** Sets `--display-pill-ring-width: 0.2rem` and `--display-pill-<variant>-ring-colour` to each variant's `-02` step " +
      "(`var(--blue-02)`, `var(--green-02)`...) on a wrapper. In an app, set the same tokens in your CSS, e.g. `.tag-list { --display-pill-ring-width: 0.2rem; }`.",
    table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "off" } },
  },
};

const ringArgTokens = (args: StoryArgs): Record<string, string> => (args.ring ? ring02Tokens : {});

export const OutlinedMonochrome = tokenShowcase(`
  --display-pill-background: transparent;
  --display-pill-border-colour: currentColor;
  --display-pill-text-colour: var(--slate-07);
  --display-pill-primary-text-colour: var(--blue-07);
  --display-pill-success-text-colour: var(--green-07);
  --display-pill-warning-text-colour: var(--orange-07);
  --display-pill-danger-text-colour: var(--red-07);
  --display-pill-neutral-text-colour: var(--slate-10);
`, ringArgTokens);
OutlinedMonochrome.storyName = "Outlined monochrome (mid-step colours)";
OutlinedMonochrome.args = { ring: false };
OutlinedMonochrome.argTypes = ringArgTypes;
OutlinedMonochrome.parameters = {
  docs: {
    description: {
      story:
        "Border and text share one colour per variant (--display-pill-border-colour: currentColor on a transparent background). " +
        "The default text steps (-09/-10) are near-black in every hue, so outlined like this the variants look alike. " +
        "Each text token is lifted to its -07 step (all at 48% lightness, so contrast stays even across variants); the border follows because it's currentColor. " +
        "default and neutral are both slate, so neutral uses the darker -10 step to stay distinct.",
    },
  },
};

export const RingedTwoTone = tokenShowcase(`
  --display-pill-border-width: 0.1rem;
  --display-pill-border-colour: currentColor;
  --display-pill-ring-width: 0.2rem;
`, ringArgTokens);
RingedTwoTone.storyName = "Ringed (dark border, light ring, per variant)";
RingedTwoTone.args = { ring: false };
RingedTwoTone.argTypes = ringArgTypes;
RingedTwoTone.parameters = {
  docs: {
    description: {
      story:
        "A 1px border in the variant's dark text colour (--display-pill-border-colour: currentColor) inside a 2px ring in the variant's light background colour " +
        "(--display-pill-ring-width: 0.2rem; --display-pill-ring-colour defaults to the pill's background). The neutral pill is inverted, so its border is light and its ring dark. " +
        "The ring control (a CSS token, not a prop) swaps the ring to each variant's -02 step, a shade darker than the fill, so it reads as a separate ring. " +
        "The ring is a box-shadow, so it takes no layout space: leave room around ringed pills with gap or margin.",
    },
  },
};

const longGerman = "Haarverlängerungsberatungstermin";

type StressCase = {
  key: string;
  caption: string;
  label?: string;
  slotHtml?: string;
  icon?: string;
  variant?: string;
  size?: "sm" | "md" | "lg";
  tag?: "span" | "button" | "a";
  reversed?: boolean;
  dir?: "rtl";
};

const stressCases: StressCase[] = [
  { key: "german", caption: "Long German words", label: `${longGerman} und ${longGerman}`, icon: "material-symbols:schedule-outline" },
  { key: "url", caption: "Unbroken URL", label: "https://example.com/a/very/long/path/that/never/breaks/anywhere/at/all" },
  { key: "price", caption: "Long price (reversed)", label: "Ab 1.250,00 € pro Sitzung", icon: "material-symbols:sell-outline", reversed: true },
  { key: "emoji", caption: "Emoji first", label: "👩‍👩‍👧‍👦🇬🇧🇫🇷 Family plan", variant: "primary" },
  { key: "html", caption: "HTML-like text", label: "<script>alert('xss')</script>", variant: "danger" },
  { key: "rtl", caption: "Right-to-left", label: "تسريحات شعر جديدة لموسم الخريف", icon: "material-symbols:check-circle-outline", dir: "rtl", variant: "success" },
  { key: "accents", caption: "Descenders and accents", label: "Ägypten · gypsy · ÇĄĘ · Ýjqpg", variant: "warning", size: "lg" },
  { key: "single", caption: "Single character", label: "A", variant: "neutral" },
  { key: "empty", caption: "Empty label (renders nothing)", label: "" },
  { key: "blank", caption: "Whitespace label + icon (icon-only)", label: "   ", icon: "material-symbols:star-outline", variant: "primary" },
  { key: "brokenIcon", caption: "Broken icon name", label: "Missing icon", icon: "material-symbols:this-icon-does-not-exist" },
  { key: "slot", caption: "Long default slot", slotHtml: `<strong>Pro</strong> plan with ${longGerman}`, icon: "material-symbols:star", variant: "primary" },
  { key: "invalidVariant", caption: "Unknown variant from a CMS", label: "variant: info", variant: "info" },
  { key: "button", caption: "Button, small", label: `Filter: ${longGerman}`, tag: "button", size: "sm" },
  { key: "link", caption: "Link, large", label: `${longGerman}${longGerman}`, tag: "a", size: "lg", variant: "neutral" },
];

const stressWidths = ["32rem", "16rem", "8rem"];

export const StressTest: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { stressCases, stressWidths, tokenStyles: tokenStyles(args) };
  },
  template: `
    <div :style="tokenStyles" style="display: grid; gap: 2.4rem; padding: 3.2rem 2rem; font: 1.2rem sans-serif;">
      <div style="display: grid; grid-template-columns: 16rem repeat(3, max-content); gap: 1.2rem 2.4rem; align-items: start;">
        <span></span>
        <strong v-for="width in stressWidths" :key="width">{{ width }} wide</strong>
        <template v-for="item in stressCases" :key="item.key">
          <span style="overflow-wrap: anywhere;">{{ item.caption }}</span>
          <div
            v-for="width in stressWidths"
            :key="width"
            :dir="item.dir"
            :style="{ inlineSize: width, outline: '1px dashed currentColor', padding: '0.4rem' }"
          >
            <StorybookComponent
              :label="item.label"
              :variant="item.variant"
              :size="item.size ?? 'md'"
              :tag="item.tag ?? 'span'"
              :href="item.tag === 'a' ? '#' : undefined"
              :reversed="item.reversed ?? false"
            >
              <template v-if="item.icon" #icon><Icon :name="item.icon" /></template>
              <template v-if="item.slotHtml" #default><span v-html="item.slotHtml"></span></template>
            </StorybookComponent>
          </div>
        </template>
      </div>
    </div>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.parameters = {
  controls: { include: ["labelLineClamp"] },
  docs: {
    description: {
      story:
        "Hostile labels at three container widths: long German words, an unbroken URL, a long reversed price, emoji, HTML-like and right-to-left text, " +
        "descenders and accents, a single character, empty and whitespace-only labels, a broken icon name, a long default slot, an unknown variant, " +
        "and small button and large link pills. Check that no pill grows past its dashed box, long text ends in an ellipsis on one line, " +
        "descenders and accents aren't clipped, the empty label renders no pill, the whitespace label becomes an icon-only pill, " +
        "the unknown variant falls back to the default colours, and the icon never shrinks. " +
        "Set the labelLineClamp control (a CSS token, not a prop) to none to see long labels wrap instead.",
    },
  },
};
