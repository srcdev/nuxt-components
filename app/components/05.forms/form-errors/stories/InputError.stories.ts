import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../InputError.vue";

interface InputErrorStoryArgs {
  id: string;
  errorMessage: string | string[];
  showError: boolean;
  isDetached: boolean;
  inputVariant: "normal" | "outlined" | "underlined";
  icon: string;
  styleClassPassthrough: string;
}

export default {
  title: "Components/Forms/Form Errors/InputError",
  component: StorybookComponent,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    errorMessage: {
      control: "object",
      description: "A string, or an array of strings rendered as a list",
      table: { category: "Basic" },
    },
    showError: { control: "boolean", table: { category: "State" } },
    isDetached: {
      control: "boolean",
      description: "Detached: sits below the control with a gap. Attached: tucked under the control's bottom edge",
      table: { category: "Layout" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Layout" },
    },
    icon: { control: "text", table: { category: "Content" } },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
  },
  args: {
    id: "story-field-error-message",
    errorMessage: "Please enter a valid email address",
    showError: true,
    isDetached: false,
    inputVariant: "normal",
    icon: "radix-icons:circle-backslash",
    styleClassPassthrough: "",
  },
} as Meta<InputErrorStoryArgs>;

const demoStyles = `
  <component is="style">
    .input-error-story-field {
      display: grid;
      grid-template-rows: auto auto;
      max-width: 48rem;
      margin: 3.6rem;
    }
    .input-error-story-control {
      grid-row: 1;
      grid-column: 1;
      position: relative;
      z-index: 1;
      padding: 1.2rem;
      font-size: 1.6rem;
      background-color: var(--theme-input-surface);
      color: var(--theme-text);
      border: var(--form-element-border-width) solid var(--theme-border);
      border-radius: var(--form-input-border-radius);
    }
    .input-error-story-field[data-invalid] .input-error-story-control {
      border-color: var(--theme-error-border);
    }
    .input-error-story-field[data-variant="underlined"] .input-error-story-control {
      border-radius: 0;
      border-width: 0 0 var(--form-element-border-width);
    }
  </component>
`;

const Template: StoryFn<InputErrorStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div>
      ${demoStyles}
      <div
        class="input-error-story-field"
        :data-invalid="args.showError ? '' : undefined"
        :data-variant="args.inputVariant"
      >
        <div class="input-error-story-control">Stand-in form control</div>
        <StorybookComponent
          :id="args.id"
          :error-message="args.errorMessage"
          :show-error="args.showError"
          :is-detached="args.isDetached"
          :input-variant="args.inputVariant"
          :icon="args.icon"
          :style-class-passthrough="args.styleClassPassthrough"
        ></StorybookComponent>
      </div>
    </div>
  `,
});

export const Attached = Template.bind({});

export const Detached = Template.bind({});
Detached.args = { isDetached: true };

export const MultipleMessages = Template.bind({});
MultipleMessages.args = {
  isDetached: true,
  errorMessage: ["Password must be at least 12 characters", "Password must contain a number"],
};

export const Underlined = Template.bind({});
Underlined.args = { inputVariant: "underlined" };

export const Hidden = Template.bind({});
Hidden.args = { showError: false };
Hidden.parameters = {
  docs: { description: { story: "Toggle `showError` to see the open/close animation." } },
};
