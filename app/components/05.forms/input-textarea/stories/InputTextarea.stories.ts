import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputTextarea from "../InputTextarea.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string;
  id: string;
  name: string;
  placeholder: string;
  maxlength: number;
  required: boolean;
  readonly: boolean;
  fieldHasError: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string[];
  leftSlotContent: string;
  rightSlotContent: string;
  maxHeightToken: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Textarea/InputTextarea",
  component: InputTextarea,
  argTypes: {
    modelValue: { control: "text", table: { category: "Model" } },
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    placeholder: { control: "text", table: { category: "Basic" } },
    maxlength: { control: "number", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Validation" } },
    readonly: { control: "boolean", table: { category: "States" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
    leftSlotContent: { control: "text", description: "Story-only: fills the left slot", table: { category: "Slots" } },
    rightSlotContent: { control: "text", description: "Story-only: fills the right slot", table: { category: "Slots" } },
    maxHeightToken: {
      control: { type: "select" },
      options: ["none", "12lh", "20rem"],
      description: "Story-only CSS token, not a prop: sets `--input-textarea-max-height` on a wrapper",
      table: { category: "CSS tokens (story-only)" },
    },
  },
  args: {
    modelValue: "",
    id: "message",
    name: "message",
    placeholder: "Write your message",
    maxlength: 255,
    required: false,
    readonly: false,
    fieldHasError: false,
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    leftSlotContent: "",
    rightSlotContent: "",
    maxHeightToken: "none",
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
          "Bare native `<textarea>` for the `05.forms` textarea family: no label, description or error (use `InputTextareaField` for those, or pair it with your own `<label for>`). It grows with its content where `field-sizing: content` is supported, from `--input-textarea-min-height` (6 lines) up to `--input-textarea-max-height` (no cap by default), then scrolls. `left`/`right` slots hold decorations. State is exposed as `data-*` attributes on `.input-textarea-wrapper`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputTextarea },
  setup() {
    const componentArgs = computed(() => {
      const {
        modelValue: _modelValue,
        leftSlotContent: _left,
        rightSlotContent: _right,
        maxHeightToken: _maxHeight,
        ...rest
      } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <div :style="{ '--input-textarea-max-height': args.maxHeightToken }">
      <InputTextarea v-model="args.modelValue" v-bind="componentArgs">
        <template v-if="args.leftSlotContent" #left>{{ args.leftSlotContent }}</template>
        <template v-if="args.rightSlotContent" #right>{{ args.rightSlotContent }}</template>
      </InputTextarea>
    </div>
    <p style="margin-block-start: 1.6rem; font-family: monospace; white-space: pre-wrap;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const MultiLine: Story = {
  args: { modelValue: "First line\nSecond line\n\n    Indented after a blank line" },
  render,
  parameters: { docs: { description: { story: "Line breaks and indentation show as typed." } } },
};

export const CappedHeight: Story = {
  args: {
    maxHeightToken: "12lh",
    maxlength: 5000,
    modelValue: Array.from({ length: 30 }, (_, index) => `Line ${index + 1}`).join("\n"),
  },
  render,
  parameters: { docs: { description: { story: "`--input-textarea-max-height: 12lh` stops it growing past 12 lines; the rest scrolls." } } },
};

export const WithSlots: Story = { args: { leftSlotContent: "📝", rightSlotContent: "✨" }, render };

export const SlotsOnFirstLine: Story = {
  args: { leftSlotContent: "📝", rightSlotContent: "✨", modelValue: "First line\nSecond line\nThird line" },
  render: (args: StoryArgs) => ({
    ...render(args),
    template: `
      <div style="--input-textarea-slot-align: start; --input-textarea-slot-padding-block: var(--form-textarea-padding-block);">
        ${render(args).template}
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "`--input-textarea-slot-align: start` with `--input-textarea-slot-padding-block: var(--form-textarea-padding-block)` lines the slots up with the first line of text instead of centring them on the field. Story-only CSS tokens, set on a wrapper.",
      },
    },
  },
};

export const WithError: Story = { args: { fieldHasError: true, theme: "error" }, render };

export const Readonly: Story = { args: { readonly: true, modelValue: "This message can't be edited." }, render };

export const Underlined: Story = { args: { inputVariant: "underlined" }, render };

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    maxlength: 5000,
    modelValue:
      "Donaudampfschifffahrtsgesellschaftskapitänswitwenrentenversicherungsbeitragsrückerstattungsantrag https://example.com/a/very/long/unbroken/url/that/never/wraps/anywhere/at/all\n<script>alert(1)</script> <b>not bold</b>\n🎉🎉🎉\nمرحبا بكم في النموذج\n" +
      "Lorem ipsum dolor sit amet. ".repeat(40),
    placeholder: "Bitte beschreiben Sie Ihr Anliegen so ausführlich wie möglich",
    leftSlotContent: "📝📝📝",
    rightSlotContent: "عربى",
    fieldHasError: true,
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A long unbroken German word and URL, HTML-like text, emoji, right-to-left text and a long paragraph, with text in both slots. Check at every canvas width: the textarea stays inside the dashed outline and wraps the unbroken strings instead of scrolling sideways, line breaks are kept, markup shows as text, and the slots keep their size.",
      },
    },
  },
};
