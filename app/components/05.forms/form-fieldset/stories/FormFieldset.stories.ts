import { ref } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../FormFieldset.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

interface FormFieldsetStoryArgs {
  id: string;
  name: string;
  legend: string;
  groupRole: "group" | "radiogroup";
  required: boolean;
  fieldHasError: boolean;
  styleClassPassthrough: string;
}

export default {
  title: "Components/Forms/Form Fieldset/FormFieldset",
  component: StorybookComponent,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    legend: { control: "text", table: { category: "Basic" } },
    groupRole: {
      control: { type: "select" },
      options: ["group", "radiogroup"],
      description: "\"radiogroup\" for radio buttons, \"group\" (native fieldset role) for everything else",
      table: { category: "Accessibility" },
    },
    required: {
      control: "boolean",
      description: "Only produces aria-required when groupRole is radiogroup",
      table: { category: "Validation" },
    },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
  },
  args: {
    id: "contact-preference",
    name: "contactPreference",
    legend: "How should we contact you?",
    groupRole: "radiogroup",
    required: true,
    fieldHasError: false,
    styleClassPassthrough: "",
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
          "Shared `<fieldset>` + `<legend>` wrapper for a group of controls. `legend` (or the `legend` slot) names the group, the `content` slot holds the controls, `group-role` switches between the native `group` and `radiogroup`, and `required`/`field-has-error` set `aria-required` (radiogroup only) and `aria-invalid`. Mostly a building block: `SingleCheckbox`, `MultipleCheckboxes` and `MultipleRadiobuttons` render it.",
      },
    },
  },
} as Meta<FormFieldsetStoryArgs>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const parentNote = `
  <p style="font-size: 1.3rem; margin: 0 0 1.6rem;">
    Rendered by
    <a href="/?path=/story/components-forms-input-checkbox-singlecheckbox--default" target="_top">SingleCheckbox</a>,
    <a href="/?path=/story/components-forms-input-checkbox-multiplecheckboxes--default" target="_top">MultipleCheckboxes</a> and
    <a href="/?path=/story/components-forms-input-radio-multipleradiobuttons--default" target="_top">MultipleRadiobuttons</a>,
    which add styled options, a description and an error message. Inspect the fieldset to see role and aria-* output.
  </p>
`;

const Template: StoryFn<FormFieldsetStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div>
      ${parentNote}
      <StorybookComponent
        :id="args.id"
        :name="args.name"
        :legend="args.legend"
        :group-role="args.groupRole"
        :required="args.required"
        :field-has-error="args.fieldHasError"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #content>
          <label style="display: block; font-size: 1.6rem;">
            <input type="radio" :name="args.name" value="email" /> Email
          </label>
          <label style="display: block; font-size: 1.6rem;">
            <input type="radio" :name="args.name" value="phone" /> Phone
          </label>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});
Default.parameters = {
  docs: { description: { story: "A required radio group: `role=\"radiogroup\"` and `aria-required=\"true\"` on the fieldset." } },
};

export const CheckboxGroup = Template.bind({});
CheckboxGroup.args = { groupRole: "group", legend: "Interests", required: false };
CheckboxGroup.parameters = {
  docs: { description: { story: "`group-role=\"group\"`: no `role` attribute (a fieldset is already a group) and never `aria-required`." } },
};

export const WithError = Template.bind({});
WithError.args = { fieldHasError: true };
WithError.parameters = {
  docs: { description: { story: "`field-has-error` sets `aria-invalid=\"true\"`. With it off, the attribute is left out entirely." } },
};

export const StressTest = Template.bind({});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  legend:
    "📞 Bevorzugtekontaktmethodefürrückfragenzuihrerbestellung https://example.com/a/very/long/unbroken/url <b>not bold</b> طريقة الاتصال",
  fieldHasError: true,
};
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  docs: {
    description: {
      story:
        "Long unbroken German, a URL, emoji, HTML-like and right-to-left copy in the legend, with the error state on. Check at every canvas width: the legend wraps inside the dashed outline, the fieldset never grows past its column (it sets `min-inline-size: 0`, so a native fieldset's min-content width can't push it out), and markup renders as text. Wrapping the slotted controls is the slot content's job.",
    },
  },
};
