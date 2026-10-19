import { computed, ref } from "vue";
import type { ConcreteComponent } from "vue";
import SlidingToggle from "../SlidingToggle.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { SlidingToggleOption } from "~/types/components";

interface StoryArgs {
  modelValue: string;
  options: SlidingToggleOption[];
  ariaLabel: string;
  disabled: boolean;
  trackHover: boolean;
  transitionDuration: number;
  cornerShape: string;
  optionFlex: string;
  stretch: number;
}

const tokenCategory = "CSS tokens (story only, set in your CSS)";

const meta: Meta<StoryArgs> = {
  title: "Molecules/SlidingToggle",
  // Generic components don't fit Meta's ConcreteComponent<Args>; the props table still generates.
  component: SlidingToggle as unknown as ConcreteComponent<StoryArgs>,
  argTypes: {
    modelValue: {
      control: "text",
      description: "The selected option's `value` (`v-model`).",
      table: { category: "Model" },
    },
    options: {
      control: "object",
      description: "Options: `{ value, label, disabled? }[]`.",
      table: { category: "Content" },
    },
    ariaLabel: {
      control: "text",
      description: "Names the radiogroup. Set this or `ariaLabelledby`.",
      table: { category: "Accessibility" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the whole group.",
      table: { category: "Basic" },
    },
    trackHover: {
      control: "boolean",
      description: "Show the hover indicator that follows the pointer.",
      table: { category: "Basic" },
    },
    transitionDuration: {
      control: { type: "range", min: 0, max: 1000, step: 50 },
      description: "Length of each edge's slide, in ms. Reduced motion snaps instead.",
      table: { category: "Basic" },
    },
    cornerShape: {
      control: { type: "select" },
      options: ["round", "squircle", "superellipse(3)", "bevel", "scoop", "notch"],
      description:
        "**Story control, not a prop.** Sets `--sliding-toggle-corner-shape` on a wrapper. In your CSS: `.billing { --sliding-toggle-corner-shape: squircle; }`. Chromium 139+ only; other browsers keep rounded corners.",
      table: { category: tokenCategory },
    },
    optionFlex: {
      control: { type: "select" },
      options: ["0 1 auto", "1 1 0"],
      description:
        "**Story control, not a prop.** Sets `--sliding-toggle-option-flex`. `1 1 0` gives equal widths: `.billing { --sliding-toggle-option-flex: 1 1 0; }`.",
      table: { category: tokenCategory },
    },
    stretch: {
      control: { type: "range", min: 0, max: 1, step: 0.25 },
      description:
        "**Story control, not a prop.** Sets `--sliding-toggle-indicator-stretch`. `0` slides both indicators' edges together instead of stretching: `.billing { --sliding-toggle-indicator-stretch: 0; }`.",
      table: { category: tokenCategory },
    },
    ariaLabelledby: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  } as Meta<StoryArgs>["argTypes"],
  args: {
    modelValue: "monthly",
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "yearly", label: "Yearly (save 20%)" },
      { value: "lifetime", label: "Lifetime" },
    ],
    ariaLabel: "Billing period",
    disabled: false,
    trackHover: true,
    transitionDuration: 200,
    cornerShape: "round",
    optionFlex: "0 1 auto",
    stretch: 1,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A single-choice segmented control whose selected background slides between options of different widths, with the same stretch-then-catch-up motion as TabbedContent's indicator. A second indicator follows the pointer. It's a radio group: arrow keys move and select, and only the selected option is a tab stop. `options` and `v-model` drive it; name it with `ariaLabel` or `ariaLabelledby`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const storySetup = (args: StoryArgs) => {
  const componentArgs = computed(() => {
    const { modelValue: _modelValue, cornerShape: _cornerShape, optionFlex: _optionFlex, stretch: _stretch, ...rest } = args;
    return rest;
  });
  const tokenStyle = computed(() => ({
    "--sliding-toggle-corner-shape": args.cornerShape,
    "--sliding-toggle-option-flex": args.optionFlex,
    "--sliding-toggle-indicator-stretch": String(args.stretch),
  }));
  return { args, componentArgs, tokenStyle };
};

export const Default: Story = {
  render: (args) => ({
    components: { SlidingToggle },
    setup: () => storySetup(args),
    template: `
      <div :style="tokenStyle" style="display: grid; gap: 1.6rem; justify-items: start;">
        <SlidingToggle v-bind="componentArgs" v-model="args.modelValue" />
        <p style="margin: 0; font-size: 1.4rem;">Selected: <code>{{ args.modelValue }}</code></p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Click an option, or Tab in and use the arrow keys, Home and End. Hover across the options to see the hover indicator. The corner-shape, option-flex and stretch controls are CSS tokens, not props: set the stretch to 0 to see both indicators slide without stretching.",
      },
    },
  },
};

export const EqualWidths: Story = {
  args: { optionFlex: "1 1 0" },
  render: (args) => ({
    components: { SlidingToggle },
    setup: () => storySetup(args),
    template: `
      <div :style="tokenStyle" style="inline-size: 40rem; max-inline-size: 100%;">
        <SlidingToggle v-bind="componentArgs" v-model="args.modelValue" style="inline-size: 100%;" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "`--sliding-toggle-option-flex: 1 1 0` with the toggle stretched to its container: every option takes an equal share, the usual look for a two-option billing switch.",
      },
    },
  },
};

export const CornerShapes: Story = {
  render: (args) => ({
    components: { SlidingToggle },
    setup() {
      const shapes = ["round", "squircle", "superellipse(3)", "bevel", "scoop", "notch"];
      const values = ref<Record<string, string>>(Object.fromEntries(shapes.map((shape) => [shape, "yearly"])));
      return { args, shapes, values };
    },
    template: `
      <div style="display: grid; gap: 1.6rem; justify-items: start;">
        <p style="margin: 0; font-size: 1.4rem;">
          <code>--sliding-toggle-corner-shape</code> applies to the track, both indicators and the options.
          It needs Chromium 139+; elsewhere every row shows plain rounded corners.
        </p>
        <div v-for="shape in shapes" :key="shape" :style="{ '--sliding-toggle-corner-shape': shape, '--sliding-toggle-border-radius': '1.6rem', '--sliding-toggle-option-border-radius': '1.2rem' }" style="display: flex; gap: 1.6rem; align-items: center;">
          <code style="inline-size: 14rem; font-size: 1.3rem;">{{ shape }}</code>
          <SlidingToggle :options="args.options" :aria-label="shape + ' corners'" v-model="values[shape]" />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Each `corner-shape` value with larger radii so the difference shows. A progressive enhancement: browsers without `corner-shape` ignore it and keep `border-radius`.",
      },
    },
  },
};

export const CustomColours: Story = {
  render: (args) => ({
    components: { SlidingToggle },
    setup: () => storySetup(args),
    template: `
      <div
        :style="tokenStyle"
        style="--sliding-toggle-surface: #1f2937; --sliding-toggle-indicator-surface: #f9fafb; --sliding-toggle-hover-indicator-surface: #374151; --sliding-toggle-marker-colour: #f59e0b; --sliding-toggle-option-colour: #d1d5db; --sliding-toggle-option-colour-active: #111827;"
      >
        <SlidingToggle v-bind="componentArgs" v-model="args.modelValue" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Every colour overridden with public tokens set on a wrapper.",
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => ({
    components: { SlidingToggle },
    setup() {
      const partial = ref("monthly");
      const options = [
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly", disabled: true },
        { value: "lifetime", label: "Lifetime" },
      ];
      return { args, partial, options };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; justify-items: start;">
        <p style="margin: 0; font-size: 1.4rem;">One disabled option: the arrow keys skip it and the hover indicator ignores it.</p>
        <SlidingToggle v-model="partial" :options="options" aria-label="Billing period, yearly unavailable" />
        <p style="margin: 0; font-size: 1.4rem;">The whole group disabled.</p>
        <SlidingToggle v-model="partial" :options="args.options" aria-label="Billing period (disabled)" disabled />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "A single disabled option (skipped by the keyboard) and a fully `disabled` group.",
      },
    },
  },
};

const longGerman = "Jährliche Abrechnung mit zwanzig Prozent Rabatt";

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: () => ({
    components: { SlidingToggle },
    setup() {
      const cases = [
        {
          note: "Long German labels in an 18rem column: labels wrap, the indicator stays on the selected option",
          width: "18rem",
          model: ref("b"),
          options: [
            { value: "a", label: "Monatliche Abrechnung" },
            { value: "b", label: longGerman },
          ],
        },
        {
          note: "An unbroken label and a URL",
          width: "24rem",
          model: ref("a"),
          options: [
            { value: "a", label: "Monatlicheabrechnungohnemindestlaufzeit" },
            { value: "b", label: "https://example.invalid/a/very/long/url" },
          ],
        },
        {
          note: "Seven options in a 24rem column",
          width: "24rem",
          model: ref("4"),
          options: Array.from({ length: 7 }, (_, index) => ({ value: String(index), label: `Option ${index + 1}` })),
        },
        {
          note: "Emoji first, HTML-like text (shown as text) and duplicate labels",
          width: "auto",
          model: ref("c"),
          options: [
            { value: "a", label: "😀 Happy" },
            { value: "b", label: "<b>not bold</b>" },
            { value: "c", label: "Same" },
            { value: "d", label: "Same" },
          ],
        },
        {
          note: "A single option",
          width: "auto",
          model: ref("only"),
          options: [{ value: "only", label: "Only choice" }],
        },
        {
          note: "A value matching no option: nothing selected, no indicator, the first option is the tab stop",
          width: "auto",
          model: ref("missing"),
          options: [
            { value: "a", label: "First" },
            { value: "b", label: "Second" },
          ],
        },
        {
          note: "Every option disabled",
          width: "auto",
          model: ref("a"),
          options: [
            { value: "a", label: "First", disabled: true },
            { value: "b", label: "Second", disabled: true },
          ],
        },
        {
          note: "An empty options array: an empty track, no errors",
          width: "auto",
          model: ref("a"),
          options: [],
        },
      ];
      const rtlValue = ref("b");
      return { cases, rtlValue };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem;">
        <template v-for="(item, index) in cases" :key="index">
          <div style="display: grid; gap: 0.8rem; justify-items: start;">
            <p style="margin: 0; font-size: 1.4rem;">{{ item.note }}</p>
            <div :style="{ inlineSize: item.width }" style="outline: 0.1rem dashed currentColor;">
              <SlidingToggle v-model="item.model.value" :options="item.options" :aria-label="item.note" />
            </div>
          </div>
        </template>

        <div style="display: grid; gap: 0.8rem; justify-items: start;">
          <p style="margin: 0; font-size: 1.4rem;">Right-to-left: options run right to left, and ArrowLeft moves to the next one.</p>
          <SlidingToggle
            v-model="rtlValue"
            dir="rtl"
            aria-label="فترة الفوترة"
            :options="[{ value: 'a', label: 'شهري' }, { value: 'b', label: 'سنوي مع خصم' }, { value: 'c', label: 'مدى الحياة' }]"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      story: { inline: false, height: "1300px" },
      description: {
        story:
          "Worst-case options. Check: long and unbroken labels wrap inside each dashed column and the indicator still covers the selected option (re-measured as labels wrap); seven options shrink rather than overflow; emoji, HTML-like and duplicate labels render as text; a lone option and an unmatched value behave; a fully disabled group can't be focused; an empty `options` array leaves just the track; right-to-left reverses the order and the arrow keys.",
      },
    },
  },
};
