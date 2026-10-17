import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../SegmentedControl.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { IFormMultipleOptions } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface SegmentedControlStoryArgs {
  name: string;
  ariaLabel: string;
  stepAnimationDuration: string;
}

// The marker gradients key off three option values: "system", "light", "dark" (see
// CONSUMER-STYLING.md). Any other value falls back to --segmented-control-marker-surface.
export default {
  title: "Components/Forms/Segmented Control/SegmentedControl",
  component: StorybookComponent,
  argTypes: {
    name: {
      control: "text",
      description: "Radio group name. Leave empty for a unique generated name",
      table: { category: "Basic" },
    },
    ariaLabel: {
      control: "text",
      description: "Accessible name for the radiogroup",
      table: { category: "Accessibility" },
    },
    stepAnimationDuration: {
      control: "text",
      description: "CSS transition duration for the marker sliding between options",
      table: { category: "Styling" },
    },
  },
  args: {
    name: "",
    ariaLabel: "Colour scheme",
    stepAnimationDuration: "250ms",
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
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
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A segmented radio group drawn as icons in a pill, with a marker that slides to the selected option. `v-model` is the selected value and `v-model:field-data` the options (`data[]` of `value`, `label`, `icon`); labels are screen-reader text. `aria-label` names the group, `name` defaults to a unique generated name, and `step-animation-duration` sets the slide. The values `system`, `light` and `dark` get their own marker gradients. [DisplayThemeSwitch](?path=/story/molecules-displaythemeswitch--default) wraps it as a colour-scheme switch.",
      },
    },
  },
} as Meta<SegmentedControlStoryArgs>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const themeSwitchNote = `
  <p style="${storyNoteStyle}">
    Wired to the site's colour scheme with labels, icons and a small size in the
    <a href="/?path=/story/molecules-displaythemeswitch--default" target="_top">DisplayThemeSwitch</a> story.
  </p>
`;

const buildOptions = (): IFormMultipleOptions => ({
  data: [
    { id: "system", name: "colour-scheme", value: "system", label: "System", icon: "material-symbols:night-sight-auto-sharp" },
    { id: "light", name: "colour-scheme", value: "light", label: "Light", icon: "radix-icons:sun" },
    { id: "dark", name: "colour-scheme", value: "dark", label: "Dark", icon: "radix-icons:moon" },
  ],
  total: 3,
  skip: 0,
  limit: 3,
});

const Template: StoryFn<SegmentedControlStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref("system");
    const fieldData = ref<IFormMultipleOptions>(buildOptions());
    return { args, modelValue, fieldData };
  },
  template: `
    <div>
      ${themeSwitchNote}
      <StorybookComponent
        v-model="modelValue"
        v-model:field-data="fieldData"
        :name="args.name || undefined"
        :aria-label="args.ariaLabel"
        :step-animation-duration="args.stepAnimationDuration"
      />
      <div style="margin-top: 1.6rem; font-size: 1.4rem;">Current value: {{ modelValue }}</div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.parameters = {
  docs: { description: { story: "The three colour-scheme values, each with its own marker gradient." } },
};

const CustomTokensTemplate: StoryFn<SegmentedControlStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref("light");
    const fieldData = ref<IFormMultipleOptions>(buildOptions());
    return { args, modelValue, fieldData };
  },
  template: `
    <div
      style="
        --segmented-control-gap: 0.4rem;
        --segmented-control-padding: 0.4rem;
        --segmented-control-icon-size: 1.6rem;
        --segmented-control-marker-gradient-system: linear-gradient(135deg, #0ea5e9, #6366f1);
        --segmented-control-marker-gradient-light: linear-gradient(135deg, #facc15, #f97316);
        --segmented-control-marker-gradient-dark: linear-gradient(135deg, #1e293b, #475569);
      "
    >
      <StorybookComponent
        v-model="modelValue"
        v-model:field-data="fieldData"
        :name="args.name || undefined"
        :aria-label="args.ariaLabel"
        :step-animation-duration="args.stepAnimationDuration"
      />
      <div style="margin-top: 1.6rem; font-size: 1.4rem;">Current value: {{ modelValue }}</div>
    </div>
  `,
});

export const CustomTokens = CustomTokensTemplate.bind({});
CustomTokens.parameters = {
  docs: {
    description: { story: "Smaller sizing and custom marker gradients, set as tokens on a wrapper." },
  },
};

const stressOptions = (): IFormMultipleOptions => ({
  data: [
    { id: "a", name: "stress", value: "first", label: "Erste Option mit einer sehr langen Beschreibung für Bildschirmleser", icon: "radix-icons:sun" },
    { id: "a", name: "stress", value: "second", label: "<b>not bold</b>", icon: "radix-icons:moon" },
    { id: "c", name: "stress", value: "third", label: "خيار ثالث" },
    { id: "d", name: "stress", value: "fourth", label: "🎉", icon: "material-symbols:night-sight-auto-sharp" },
    { id: "e", name: "stress", value: "fifth", label: "x", icon: "radix-icons:gear" },
  ],
  total: 5,
  skip: 0,
  limit: 5,
});

const StressTemplate: StoryFn<SegmentedControlStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const fiveValue = ref("second");
    const fiveOptions = ref<IFormMultipleOptions>(stressOptions());
    const unknownValue = ref("not-an-option");
    const unknownOptions = ref<IFormMultipleOptions>(buildOptions());
    const singleValue = ref("only");
    const singleOptions = ref<IFormMultipleOptions>({
      data: [{ id: "only", name: "single", value: "only", label: "Only option", icon: "radix-icons:sun" }],
      total: 1,
      skip: 0,
      limit: 1,
    });
    return { args, fiveValue, fiveOptions, unknownValue, unknownOptions, singleValue, singleOptions };
  },
  template: `
    <div style="display: grid; gap: 2.4rem; justify-items: start;">
      <div>
        <p style="margin: 0 0 0.8rem; font-size: 1.4rem;">Five options, one without an icon, a duplicate id in the data</p>
        <StorybookComponent v-model="fiveValue" v-model:field-data="fiveOptions" :aria-label="args.ariaLabel" :step-animation-duration="args.stepAnimationDuration" />
        <div style="margin-top: 0.8rem; font-size: 1.4rem;">Current value: {{ fiveValue }}</div>
      </div>
      <div>
        <p style="margin: 0 0 0.8rem; font-size: 1.4rem;">Value that matches no option (no marker)</p>
        <StorybookComponent v-model="unknownValue" v-model:field-data="unknownOptions" :aria-label="args.ariaLabel" :step-animation-duration="args.stepAnimationDuration" />
      </div>
      <div>
        <p style="margin: 0 0 0.8rem; font-size: 1.4rem;">A single option</p>
        <StorybookComponent v-model="singleValue" v-model:field-data="singleOptions" :aria-label="args.ariaLabel" :step-animation-duration="args.stepAnimationDuration" />
      </div>
      <div dir="rtl">
        <p style="margin: 0 0 0.8rem; font-size: 1.4rem;">Right-to-left</p>
        <StorybookComponent v-model="fiveValue" v-model:field-data="fiveOptions" :aria-label="args.ariaLabel" :step-animation-duration="args.stepAnimationDuration" />
      </div>
    </div>
  `,
});

export const StressTest = StressTemplate.bind({});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  docs: {
    description: {
      story:
        "Five options (one with no icon, two sharing a data id, long, HTML-like, right-to-left and emoji labels as screen-reader text), a value that matches no option, a single option, and the five-option group in a right-to-left container. Check at every canvas width: the marker lines up with the selected option and slides the right way in RTL, the pill shrinks inside the dashed outline rather than overflowing, no marker shows for the unknown value, and clicking any option in either five-option group selects it in both (they share one model) without the two groups interfering.",
    },
  },
};
