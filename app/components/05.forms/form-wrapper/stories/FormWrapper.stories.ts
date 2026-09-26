import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../FormWrapper.vue";
import FormField from "../../form-field/FormField.vue";

interface FormWrapperStoryArgs {
  width: "narrow" | "medium" | "wide";
  styleClassPassthrough: string;
}

export default {
  title: "Components/Forms/Form Wrapper/FormWrapper",
  component: StorybookComponent,
  argTypes: {
    width: {
      control: { type: "select" },
      options: ["narrow", "medium", "wide"],
      table: { category: "Layout" },
    },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
  },
  args: {
    width: "narrow",
    styleClassPassthrough: "",
  },
} as Meta<FormWrapperStoryArgs>;

const demoStyles = `
  <component is="style">
    .form-wrapper-story-frame {
      outline: 1px dashed var(--slate-05);
      padding: 1.6rem;
    }
    .form-wrapper-story-frame .form-wrapper {
      outline: 1px solid var(--slate-06);
      background-color: var(--slate-01);
    }
    .form-wrapper-story-frame .form-field {
      outline: 1px dotted var(--slate-05);
    }
    .form-wrapper-story-placeholder {
      padding: 1.2rem;
      font-size: 1.4rem;
    }
  </component>
`;

const Template: StoryFn<FormWrapperStoryArgs> = (args) => ({
  components: { StorybookComponent, FormField },
  setup() {
    return { args };
  },
  template: `
    <div>
      ${demoStyles}
      <p style="font-size: 1.4rem; margin: 1.6rem;">Dashed outline: page container. Solid outline: the FormWrapper. Dotted: FormField children.</p>
      <div class="form-wrapper-story-frame">
        <StorybookComponent :width="args.width" :style-class-passthrough="args.styleClassPassthrough">
          <form @submit.prevent>
            <FormField v-for="n in 3" :key="n" width="wide" :has-gutter="false">
              <div class="form-wrapper-story-placeholder">Field {{ n }} (FormWrapper width="{{ args.width }}")</div>
            </FormField>
          </form>
        </StorybookComponent>
      </div>
    </div>
  `,
});

export const Default = Template.bind({});

export const Medium = Template.bind({});
Medium.args = { width: "medium" };

export const Wide = Template.bind({});
Wide.args = { width: "wide" };
