import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import SingleCheckbox from "../SingleCheckbox.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { InputUiVariant } from "~/types/forms/types.forms.d";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  name: string;
  legend: string;
  label: string;
  errorMessage: string;
  required: boolean;
  fieldHasError: boolean;
  inputVariant: InputUiVariant;
  descriptionText: string;
}

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Input Checkbox/SingleCheckbox",
  component: SingleCheckbox,
  argTypes: {
    name: { control: "text", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    label: { control: "text", table: { category: "Basic" } },
    errorMessage: { control: "text", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Styling" },
    },
    descriptionText: {
      control: "text",
      description: "Story-only: fills the descriptionText slot",
      table: { category: "Slots" },
    },
  },
  args: {
    name: "terms",
    legend: "Terms and conditions",
    label: "I agree to the terms",
    errorMessage: "You must agree to the terms",
    required: true,
    fieldHasError: false,
    inputVariant: "normal",
    descriptionText: "",
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
          "A fieldset holding one checkbox, for consent or opt-in fields. `v-model` toggles between `trueValue` and `falseValue` (default `true`/`false`); `required` puts native `required` on the checkbox. Slots: `labelContent` (rich label, e.g. a link), `descriptionText`, `descriptionHtml`, `checkedIcon`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const render = (args: StoryArgs) => ({
  components: { SingleCheckbox },
  setup() {
    const componentArgs = computed(() => {
      const { descriptionText: _descriptionText, ...rest } = args;
      return rest;
    });
    const modelValue = ref(false);
    return { args, componentArgs, modelValue };
  },
  template: `
    <SingleCheckbox v-bind="componentArgs" v-model="modelValue">
      <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
    </SingleCheckbox>
    <p style="margin-block-start: 2rem; font-family: monospace;">modelValue: {{ modelValue }}</p>
  `,
});

export const Default: Story = { render };

export const ErrorState: Story = {
  args: { fieldHasError: true },
  render,
  parameters: {
    docs: { description: { story: "`fieldHasError` shows the error message and links it to the checkbox with `aria-describedby`." } },
  },
};

export const RichLabel: Story = {
  render: (args: StoryArgs) => ({
    components: { SingleCheckbox },
    setup() {
      const componentArgs = computed(() => {
        const { descriptionText: _descriptionText, ...rest } = args;
        return rest;
      });
      const modelValue = ref(false);
      return { componentArgs, modelValue };
    },
    template: `
      <SingleCheckbox v-bind="componentArgs" v-model="modelValue">
        <template #labelContent>I agree to the <a href="#">terms and conditions</a></template>
      </SingleCheckbox>
    `,
  }),
  parameters: { docs: { description: { story: "The `labelContent` slot replaces the `label` prop, here with a link." } } },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    name: "marketing einwilligung",
    legend:
      "📨 Einwilligungserklärungzurdatenschutzkonformenverarbeitungpersonenbezogenerdaten https://example.com/a/very/long/unbroken/url <script>alert(1)</script>",
    label:
      "Ich stimme zu: Datenschutzgrundverordnungseinwilligungsbestätigung https://example.com/privacy/policy/with/a/long/path <b>not bold</b> قص",
    descriptionText:
      "سياسة الخصوصية Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie uns eine kurze Nachricht schicken. 🙂",
    errorMessage: "BitteakzeptierenSiedieDatenschutzbestimmungenbevorSiefortfahren",
    fieldHasError: true,
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Long unbroken German and URL text in the legend, label and error, emoji, right-to-left text and HTML-like text. Check at every canvas width: everything wraps inside the dashed outline, markup renders as text, and clicking anywhere on the label toggles the checkbox. Also try an empty label and a single character.",
      },
    },
  },
};
