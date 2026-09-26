import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../FormField.vue";

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
  </component>
`;

const Template: StoryFn<FormFieldStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div>
      ${demoStyles}
      <p style="font-size: 1.4rem; margin: 1.6rem;">Dashed outline: container. Solid outline and tint: the FormField.</p>
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

const WidthsTemplate: StoryFn<FormFieldStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, widths: ["narrow", "medium", "wide"] };
  },
  template: `
    <div>
      ${demoStyles}
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
AllWidths.parameters = { controls: { include: ["hasGutter", "fieldHasError"] } };

export const NoGutter = Template.bind({});
NoGutter.args = { width: "wide", hasGutter: false };
