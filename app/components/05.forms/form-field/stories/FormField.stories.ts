import { ref } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../FormField.vue";
import InputTextField from "../../input-text/InputTextField.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

interface FormFieldStoryArgs {
  width: "narrow" | "medium" | "wide";
  hasGutter: boolean;
  fieldHasError: boolean;
  styleClassPassthrough: string;
}

export default {
  title: "Components/Forms/Form Field/FormField",
  component: StorybookComponent,
  argTypes: {
    width: {
      control: { type: "select" },
      options: ["narrow", "medium", "wide"],
      table: { category: "Layout" },
    },
    hasGutter: { control: "boolean", table: { category: "Layout" } },
    fieldHasError: { control: "boolean", table: { category: "Validation" } },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
  },
  args: {
    width: "narrow",
    hasGutter: true,
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
        <div :class="canvasName" style="margin-inline: auto;">
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
          "Layout-only wrapper for one form control. `width` (`narrow`/`medium`/`wide`) caps its width, `has-gutter` insets it from the container edges, and `field-has-error` adds `data-invalid`, which switches every descendant to the error theme. Put an `*Field` component in the default slot; it renders no label, input or error text itself. `style-class-passthrough` lands on the `.form-field` root.",
      },
    },
  },
} as Meta<FormFieldStoryArgs>;

const demoStyles = `
  <component is="style">
    .form-field-story-frame {
      outline: 1px dashed var(--slate-05);
      padding-block: 1.6rem;
    }
    .form-field-story-frame .form-field {
      --form-field-background-color: var(--slate-02);
      outline: 1px solid var(--slate-06);
    }
    .form-field-story-frame .form-field[data-invalid] {
      outline-color: var(--red-06);
    }
    .form-field-story-placeholder {
      padding: 1.2rem;
      font-size: 1.4rem;
    }
    .form-field-story-note {
      font-size: 1.4rem;
      margin: 1.6rem;
    }
  </component>
`;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const usageNote = `
  <p class="form-field-story-note">
    Dashed outline: container. Solid outline and tint: the FormField. For FormField wrapping real
    fields inside a form, open the
    <a href="/?path=/story/patterns-contact-form--default" target="_top">Contact Form</a> pattern or the
    <a href="/?path=/story/components-forms-form-wrapper-formwrapper--default" target="_top">FormWrapper</a> story.
  </p>
`;

const Template: StoryFn<FormFieldStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div>
      ${demoStyles}
      ${usageNote}
      <div class="form-field-story-frame">
        <StorybookComponent
          :width="args.width"
          :has-gutter="args.hasGutter"
          :field-has-error="args.fieldHasError"
          :style-class-passthrough="args.styleClassPassthrough"
        >
          <div class="form-field-story-placeholder">Form control goes here ({{ args.width }})</div>
        </StorybookComponent>
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.parameters = {
  docs: { description: { story: "One FormField around a placeholder control. Use the Controls panel to try each width, the gutter and the error state." } },
};

const WidthsTemplate: StoryFn<FormFieldStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, widths: ["narrow", "medium", "wide"] };
  },
  template: `
    <div>
      ${demoStyles}
      ${usageNote}
      <div class="form-field-story-frame">
        <StorybookComponent
          v-for="w in widths"
          :key="w"
          :width="w"
          :has-gutter="args.hasGutter"
          :field-has-error="args.fieldHasError"
        >
          <div class="form-field-story-placeholder">width="{{ w }}"</div>
        </StorybookComponent>
      </div>
    </div>
  `,
});

export const AllWidths = WidthsTemplate.bind({});
AllWidths.parameters = {
  controls: { include: ["hasGutter", "fieldHasError"] },
  docs: {
    description: {
      story: "The three widths stacked. Each caps at its `--form-field-max-width-*` token and shrinks to the container (minus the gutter) below that.",
    },
  },
};

export const NoGutter = Template.bind({});
NoGutter.args = { width: "wide", hasGutter: false };
NoGutter.parameters = {
  docs: { description: { story: "`has-gutter` off: the field runs edge to edge of its container. Use this when the parent already pads its content." } },
};

const stressLabel =
  "📧 Elektronischepostadressefürdiebenachrichtigungüberbestellungen https://example.com/a/very/long/unbroken/url <b>not bold</b> البريد";
const stressValue = "alex.morgan.with.a.very.long.unbroken.address@subdomain.northtown-example.co.uk";
const stressError = "DieseadresseistleiderungültigbitteüberprüfenSiedieSchreibweise";

const StressTemplate: StoryFn<FormFieldStoryArgs> = (args) => ({
  components: { StorybookComponent, InputTextField },
  setup() {
    const fields = ref([
      { width: "narrow", hasGutter: true, hasError: true, value: stressValue },
      { width: "medium", hasGutter: true, hasError: false, value: "" },
      { width: "wide", hasGutter: false, hasError: true, value: "x" },
    ]);
    return { args, fields, stressLabel, stressError };
  },
  template: `
    <div>
      ${demoStyles}
      ${usageNote}
      <div class="form-field-story-frame">
        <StorybookComponent
          v-for="(field, index) in fields"
          :key="index"
          :width="field.width"
          :has-gutter="field.hasGutter"
          :field-has-error="field.hasError"
          :style-class-passthrough="args.styleClassPassthrough"
        >
          <InputTextField
            v-model="field.value"
            :name="'stress-' + index"
            type="email"
            :label="stressLabel"
            :error-message="field.hasError ? stressError : ''"
            :field-has-error="field.hasError"
            required
          ></InputTextField>
        </StorybookComponent>
      </div>
    </div>
  `,
});

export const StressTest = StressTemplate.bind({});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  controls: { include: ["styleClassPassthrough"] },
  docs: {
    description: {
      story:
        "Each width, with and without the gutter and error state, around an `InputTextField` carrying long unbroken German, a URL, emoji, HTML-like and right-to-left label copy, a long unbroken value and an unbroken error. Check at every canvas width: every FormField stays inside the dashed container, the gutter stays visible on both sides, and the error theme reaches the field inside. Wrapping the slot content is the slotted control's job (FormField doesn't change `overflow-wrap`), so plain text you slot in needs its own.",
    },
  },
};
