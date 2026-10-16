import { defineComponent, ref } from "vue";
import type { PropType } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputCheckboxRadioButton from "../InputCheckboxRadioButton.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { OptionsLayout } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  type: "checkbox" | "radio";
  label: string;
  isPill: boolean;
  fieldHasError: boolean;
  displayAsDisc: boolean;
  direction: "row" | "row-reverse";
  optionsLayout: OptionsLayout;
  options: string[];
}

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const parentNote = `
  <p style="${storyNoteStyle}">
    The group components draw each option with this when <code>isButton</code> is on, and add the
    fieldset, legend, description and error: see the
    <a href="/?path=/story/components-forms-input-checkbox-multiplecheckboxes--buttons" target="_top">MultipleCheckboxes</a>
    and
    <a href="/?path=/story/components-forms-input-radio-multipleradiobuttons--buttons" target="_top">MultipleRadiobuttons</a>
    Buttons stories.
  </p>
`;

const serviceOptions = ["Balayage", "Highlights", "Half Head Highlights", "Full Colour", "Lowlights", "Toner & Gloss"];

const layoutStyles: Record<OptionsLayout, string> = {
  "equal-widths": "display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: 0.8rem;",
  inline: "display: flex; flex-wrap: wrap; gap: 0.8rem;",
  block: "display: flex; flex-direction: column; gap: 0.8rem;",
};

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Checkbox Radio/InputCheckboxRadioButton",
  component: InputCheckboxRadioButton,
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["checkbox", "radio"],
      table: { category: "Basic" },
    },
    label: { control: "text", description: "Single-option stories only", table: { category: "Basic" } },
    isPill: { control: "boolean", table: { category: "Styling" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    displayAsDisc: { control: "boolean", table: { category: "Styling" } },
    direction: {
      control: { type: "select" },
      options: ["row", "row-reverse"],
      description: "row-reverse puts the control on the right",
      table: { category: "Styling" },
    },
    optionsLayout: {
      control: { type: "select" },
      options: ["equal-widths", "inline", "block"],
      description:
        "Rendered as `data-options-layout`. In the group stories it also lays out the story's wrapper the way `MultipleCheckboxes` does",
      table: { category: "Styling" },
    },
    options: {
      control: "object",
      description: "Story-only: the option labels in the group stories",
      table: { category: "Story data" },
    },
  },
  args: {
    type: "checkbox",
    label: "Balayage",
    isPill: false,
    fieldHasError: false,
    displayAsDisc: false,
    direction: "row",
    optionsLayout: "equal-widths",
    options: serviceOptions,
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
          "One checkbox or radio option drawn as a button or pill: a `<label>` holding the control, a centred label and a decorator icon. `id` is optional and generated with `useId()` when omitted. Props: `type`, `name`, `label`, `trueValue`, `multipleOptions`, `isPill`, `direction`, `displayAsDisc`, `optionsLayout`, `itemIcon`. Slots: `labelContent`, `checkedIcon`, `itemIcon`. Usually used through the `isButton` mode of `MultipleCheckboxes` and `MultipleRadiobuttons`: see the [MultipleCheckboxes Buttons](?path=/story/components-forms-input-checkbox-multiplecheckboxes--buttons) story.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (args: StoryArgs) => ({
    components: { InputCheckboxRadioButton },
    setup() {
      const modelValue = ref(false);
      return { args, modelValue };
    },
    template: `
      ${parentNote}
      <div style="max-width: 260px;">
        <InputCheckboxRadioButton
          name="single"
          :type="args.type"
          :label="args.label"
          :is-pill="args.isPill"
          :field-has-error="args.fieldHasError"
          :display-as-disc="args.displayAsDisc"
          :direction="args.direction"
          :options-layout="args.optionsLayout"
          v-model="modelValue"
        />
      </div>
    `,
  }),
  argTypes: { options: { table: { disable: true } } },
};

// Selection state lives in a child keyed on type, so switching checkbox/radio remounts it with
// the right empty value (an array for checkboxes, a string for radios). A watch on args.type
// isn't reliable here: the template sees the new arg, but the watcher doesn't fire.
const OptionGroupDemo = defineComponent({
  components: { InputCheckboxRadioButton },
  props: {
    type: { type: String as PropType<"checkbox" | "radio">, required: true },
    options: { type: Array as PropType<string[]>, required: true },
    optionsLayout: { type: String as PropType<OptionsLayout>, required: true },
    isPill: Boolean,
    fieldHasError: Boolean,
    displayAsDisc: Boolean,
    direction: { type: String as PropType<"row" | "row-reverse">, default: "row" },
  },
  setup(props) {
    const selected = ref<string[] | string>(props.type === "checkbox" ? [] : "");
    return { selected, layoutStyles };
  },
  template: `
    <div>
      <div :style="layoutStyles[optionsLayout]">
        <InputCheckboxRadioButton
          v-for="(option, index) in options"
          :key="index"
          name="services"
          :type="type"
          :label="option"
          :true-value="option"
          :multiple-options="type === 'checkbox'"
          :is-pill="isPill"
          :field-has-error="fieldHasError"
          :display-as-disc="displayAsDisc"
          :direction="direction"
          :options-layout="optionsLayout"
          v-model="selected"
        />
      </div>
      <p style="margin-block-start: 1.6rem; font-family: monospace; overflow-wrap: anywhere;">selected: {{ JSON.stringify(selected) }}</p>
    </div>
  `,
});

const renderGroup = (args: StoryArgs) => ({
  components: { OptionGroupDemo },
  setup() {
    return { args };
  },
  template: `
    ${parentNote}
    <OptionGroupDemo
      :key="args.type"
      :type="args.type"
      :options="args.options"
      :options-layout="args.optionsLayout"
      :is-pill="args.isPill"
      :field-has-error="args.fieldHasError"
      :display-as-disc="args.displayAsDisc"
      :direction="args.direction"
    />
  `,
});

export const OptionGroup: Story = {
  render: renderGroup,
  argTypes: { label: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        story: "A group of options sharing one `name` and model, the way the group components render them. Switch `type` and `optionsLayout`.",
      },
    },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    optionsLayout: "inline",
    isPill: true,
    options: [
      "A",
      "",
      "Haarverlängerungsberatungstermindienstleistungspaket",
      "https://example.com/a/very/long/unbroken/url/that/should/wrap/somewhere",
      "<b>Not bold</b> & <i>not italic</i>",
      "💇‍♀️ Colour + cut 🌈",
      "قص الشعر وتصفيفه",
      "A conditioning treatment with a scalp massage, a hot towel and a blow-dry finish",
      ...Array.from({ length: 16 }, (_, index) => `Option ${index + 9}`),
    ],
  },
  render: renderGroup,
  argTypes: { label: { table: { disable: true } } },
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "24 pill options with an empty label, a single character, a long unbroken German word and URL, HTML-like text, emoji, right-to-left text and a long sentence, laid out inline. Check at every canvas width: no option pokes out of the dashed outline (long labels wrap inside their pill instead), the control and decorator icon keep their size, short labels stay on one line, and markup renders as text. Switch `optionsLayout`, `direction` and `type`.",
      },
    },
  },
};
