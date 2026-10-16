import { ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputRange from "../InputRange.vue";
import InputButton from "../../input-button/InputButton.vue";
import type { FormUiTheme } from "~/types/forms/types.forms.d";

interface StoryArgs {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  required: boolean;
  fieldHasError: boolean;
  theme: FormUiTheme;
  weight: string;
}

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const parentNote = `
  <p style="${storyNoteStyle}">
    With a label, description, error message and clamped step buttons wired up, this is the
    <a href="/?path=/story/components-forms-input-range-inputrangefield--with-step-buttons" target="_top">InputRangeField</a>.
  </p>
`;

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Range/InputRange",
  component: InputRange,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    min: { control: "number", table: { category: "Basic" } },
    max: { control: "number", table: { category: "Basic" } },
    step: { control: "number", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", description: "Sets data-invalid and aria-invalid", table: { category: "States" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    weight: { control: "text", description: "Adds an `input-range--{weight}` class; nothing styles it yet", table: { category: "Styling" } },
  },
  args: {
    id: "range-default",
    name: "rangeDefault",
    min: 0,
    max: 100,
    step: 1,
    required: false,
    fieldHasError: false,
    theme: "default",
    weight: "normal",
  },
  parameters: {
    docs: {
      description: {
        component:
          "The bare native `<input type=\"range\">`. Slots: `left`/`right` (step buttons), `markers` (custom tick marks overlaid on the track; the native thumb is hidden), and `datalist`, which receives a generated `datalistId` slot prop to put on your `<datalist>`. No label, description or error: that's `InputRangeField`. Hooks: `data-theme`, `data-invalid`, `data-has-markers`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { InputRange },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      ${parentNote}
      <InputRange v-bind="args" v-model="modelValue" />
    </div>
  `,
});

export const Default: Story = { render };

export const ErrorState: Story = {
  args: { fieldHasError: true },
  render,
  parameters: { docs: { description: { story: "`fieldHasError` sets `data-invalid` on the wrapper and `aria-invalid` on the input." } } },
};

export const WithStepButtons: Story = {
  render: (args: StoryArgs) => ({
    components: { InputRange, InputButton },
    setup() {
      const modelValue = ref(50);
      return { args, modelValue };
    },
    template: `
      <div style="margin: 36px; max-width: 320px;">
        ${parentNote}
        <InputRange v-bind="args" v-model="modelValue">
          <template #left>
            <InputButton type="button" button-text="Step down" variant="secondary" @click="modelValue = Math.max(args.min, modelValue - args.step)">
              <template #iconOnly><Icon name="mdi:minus" /></template>
            </InputButton>
          </template>
          <template #right>
            <InputButton type="button" button-text="Step up" variant="secondary" @click="modelValue = Math.min(args.max, modelValue + args.step)">
              <template #iconOnly><Icon name="mdi:plus" /></template>
            </InputButton>
          </template>
        </InputRange>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "`InputButton`s in the `left`/`right` slots, sized by `--input-range-button-size`. The wiring here is minimal; `InputRangeField` clamps and rounds properly.",
      },
    },
  },
};

export const WithMarkers: Story = {
  args: { min: 0, max: 2, step: 1 },
  render: (args: StoryArgs) => ({
    components: { InputRange },
    setup() {
      const modelValue = ref(1);
      return { args, modelValue };
    },
    template: `
      <div style="margin: 36px; max-width: 320px;">
        <InputRange v-bind="args" v-model="modelValue">
          <template #markers>
            <div class="input-range-markers">
              <div class="input-range-marker"><span class="input-range-marker-icon">😀</span></div>
              <div class="input-range-marker"><span class="input-range-marker-icon">🙂</span></div>
              <div class="input-range-marker"><span class="input-range-marker-icon">😐</span></div>
            </div>
          </template>
        </InputRange>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `markers` slot with the pre-styled `.input-range-markers` / `.input-range-marker` / `.input-range-marker-icon` classes. The line joining them sits behind the markers, the whole row is the slider (drag, click or use the arrow keys), and a ring circles the selected marker. Use one marker per step.",
      },
    },
  },
};

export const WithDatalist: Story = {
  render: (args: StoryArgs) => ({
    components: { InputRange },
    setup() {
      const modelValue = ref(50);
      return { args, modelValue };
    },
    template: `
      <div style="margin: 36px; max-width: 320px;">
        <InputRange v-bind="args" v-model="modelValue">
          <template #datalist="{ datalistId }">
            <datalist :id="datalistId" class="input-range-datalist">
              <option value="0" label="Low"></option>
              <option value="50" label="Medium"></option>
              <option value="100" label="High"></option>
            </datalist>
          </template>
        </InputRange>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `datalist` slot receives a generated `datalistId`; put it on your `<datalist>` and the input's `list` points at it. The thumb snaps to the options in browsers that support it.",
      },
    },
  },
};
