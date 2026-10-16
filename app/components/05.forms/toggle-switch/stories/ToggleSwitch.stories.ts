import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import ToggleSwitch from "../ToggleSwitch.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { FormUiTheme } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  modelValue: string | number | boolean;
  id: string;
  name: string;
  required: boolean;
  fieldHasError: boolean;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  theme: FormUiTheme;
  round: boolean;
  styleClassPassthrough: string[];
  useCustomIcons: boolean;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Toggle Switch/ToggleSwitch",
  component: ToggleSwitch,
  argTypes: {
    modelValue: { control: "boolean", table: { category: "Model" } },
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Validation" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    trueValue: { control: "text", table: { category: "Values" } },
    falseValue: { control: "text", table: { category: "Values" } },
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      table: { category: "Styling" },
    },
    round: { control: "boolean", table: { category: "Styling" } },
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
    useCustomIcons: {
      control: "boolean",
      description: "Story-only: fills the iconOn/iconOff slots",
      table: { category: "Slots" },
    },
  },
  args: {
    modelValue: false,
    id: "notifications",
    name: "notifications",
    required: false,
    fieldHasError: false,
    trueValue: true,
    falseValue: false,
    theme: "default",
    round: true,
    styleClassPassthrough: [],
    useCustomIcons: false,
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
          "Bare on/off switch: a visually hidden native checkbox with `role=\"switch\"` and a decorative track and thumb. No label (use `ToggleSwitchField`, or give it your own `<label for=\"toggle-switch-{id}\">`). `v-model` toggles between `trueValue` and `falseValue`; `iconOn`/`iconOff` slots replace the thumb icons. Clicking the track or the input, a label click and Space all toggle it once.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { ToggleSwitch },
  setup() {
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, useCustomIcons: _useCustomIcons, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <label :for="'toggle-switch-' + args.id" style="display: block; margin-block-end: 0.8rem;">Email notifications</label>
    <ToggleSwitch v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.useCustomIcons" #iconOn><Icon name="mdi:check" /></template>
      <template v-if="args.useCustomIcons" #iconOff><Icon name="mdi:close" /></template>
    </ToggleSwitch>
    <p style="margin-block-start: 1.6rem; font-family: monospace;">modelValue: {{ JSON.stringify(args.modelValue) }}</p>
  `,
});

export const Default: Story = { render };

export const WithCustomIcons: Story = { args: { useCustomIcons: true }, render };

export const ErrorState: Story = { args: { fieldHasError: true }, render };

export const SquareShape: Story = {
  args: { round: false },
  render,
  parameters: { docs: { description: { story: "`round: false` gives a rounded-square track and thumb." } } },
};

export const StringValues: Story = {
  args: { modelValue: "off", trueValue: "on", falseValue: "off" },
  render,
  parameters: { docs: { description: { story: "`v-model` toggles between the strings `\"on\"` and `\"off\"`." } } },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: { modelValue: "neither", trueValue: 1, falseValue: 0, fieldHasError: true, useCustomIcons: true },
  render: (args: StoryArgs) => ({
    ...render(args),
    template: `
      <div style="--input-toggle-symbol-size: 4.8rem;">${render(args).template}</div>
      <div style="--input-toggle-symbol-size: 1.2rem; margin-block-start: 1.6rem;">
        <ToggleSwitch id="tiny" v-model="args.modelValue" name="tiny" :true-value="1" :false-value="0" />
      </div>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "A model value that is neither `trueValue` nor `falseValue` (shows as off; the first click turns it on), numeric values, the error state and custom icons, at an oversized and a tiny thumb size. Check at every canvas width: the track stays inside the dashed outline and scales with the thumb, the icons stay centred, and both switches share one value.",
      },
    },
  },
};
