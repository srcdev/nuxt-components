import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../variants/ToggleSwitchWithLabel.vue";
import type { FormTheme, FormSize } from "~/types/forms/types.forms.d";

interface ToggleSwitchWithLabelStoryArgs {
  name: string;
  label: string;
  required: boolean;
  errorMessage: object | string;
  fieldHasError: boolean;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  styleClassPassthrough: string[];
  theme: FormTheme;
  round: boolean;
  size: FormSize;
  useDescription: boolean;
  descriptionContent: string;
  useCustomIcons: boolean;
  iconOnContent: string;
  iconOffContent: string;
}

export default {
  title: "Components/Forms/Toggle Switch/ToggleSwitchWithLabel",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    name: {
      control: "text",
      description: "Name attribute for the toggle switch",
      table: {
        category: "Basic",
      },
    },
    label: {
      control: "text",
      description: "Label text for the toggle switch",
      table: {
        category: "Basic",
      },
    },
    required: {
      control: "boolean",
      description: "Whether the toggle switch is required",
      table: {
        category: "Basic",
      },
    },

    // Values
    trueValue: {
      control: "text",
      description: "Value when toggle is on/checked",
      table: {
        category: "Values",
      },
    },
    falseValue: {
      control: "text",
      description: "Value when toggle is off/unchecked",
      table: {
        category: "Values",
      },
    },

    // Error Handling
    fieldHasError: {
      control: "boolean",
      description: "Whether the field is in error state",
      table: {
        category: "Error Handling",
      },
    },
    errorMessage: {
      control: "text",
      description: "Error message to display",
      table: {
        category: "Error Handling",
      },
    },

    // Styling
    theme: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "ghost", "error", "success", "warning"],
      description: "Toggle switch theme",
      table: {
        category: "Styling",
      },
    },
    size: {
      control: { type: "select" },
      options: ["x-small", "small", "default", "medium", "large"],
      description: "Toggle switch size",
      table: {
        category: "Styling",
      },
    },
    round: {
      control: "boolean",
      description: "Whether the toggle switch is rounded",
      table: {
        category: "Styling",
      },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes",
      table: {
        category: "Styling",
      },
    },

    // Content Slots
    useDescription: {
      control: "boolean",
      description: "Show description slot content",
      table: {
        category: "Content",
      },
    },
    descriptionContent: {
      control: "text",
      description: "Description text content",
      table: {
        category: "Content",
      },
    },

    // Icons
    useCustomIcons: {
      control: "boolean",
      description: "Use custom icons instead of default",
      table: {
        category: "Icons",
      },
    },
    iconOnContent: {
      control: "text",
      description: "Content for the 'on' icon slot",
      table: {
        category: "Icons",
      },
    },
    iconOffContent: {
      control: "text",
      description: "Content for the 'off' icon slot",
      table: {
        category: "Icons",
      },
    },
  },
} as Meta<ToggleSwitchWithLabelStoryArgs>;

const Template: StoryFn<ToggleSwitchWithLabelStoryArgs> = (_args, { argTypes }) => ({
  components: { StorybookComponent },
  props: Object.keys(argTypes),
  setup() {
    const modelValue = ref(false);
    return { args: _args, modelValue };
  },
  template: `
    <StorybookComponent
      v-model="modelValue"
      :name="args.name"
      :label="args.label"
      :required="args.required"
      :error-message="args.errorMessage"
      :field-has-error="args.fieldHasError"
      :true-value="args.trueValue"
      :false-value="args.falseValue"
      :style-class-passthrough="args.styleClassPassthrough"
      :theme="args.theme"
      :round="args.round"
      :size="args.size"
    >
      <template v-if="args.useDescription" #description>
        <div style="color: #666; font-size: 0.875rem;">{{ args.descriptionContent }}</div>
      </template>
      <template v-if="args.useCustomIcons" #iconOn>
        <span v-html="args.iconOnContent"></span>
      </template>
      <template v-if="args.useCustomIcons" #iconOff>
        <span v-html="args.iconOffContent"></span>
      </template>
    </StorybookComponent>
    <div style="margin-top: 1rem; font-size: 0.875rem; color: #666;">
      Current value: {{ modelValue }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  name: "toggleWithLabel",
  label: "Enable notifications",
  required: false,
  errorMessage: "",
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: [],
  theme: "primary",
  round: true,
  size: "default",
  useDescription: false,
  descriptionContent: "Turn this on to receive notifications",
  useCustomIcons: false,
  iconOnContent: "✓",
  iconOffContent: "✗",
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  ...Default.args,
  name: "toggleWithDescription",
  label: "Enable dark mode",
  useDescription: true,
  descriptionContent: "Switch between light and dark themes",
};

export const WithCustomIcons = Template.bind({});
WithCustomIcons.args = {
  ...Default.args,
  name: "toggleWithCustomIcons",
  label: "Enable feature",
  useCustomIcons: true,
  iconOnContent:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',
  iconOffContent:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...Default.args,
  name: "toggleError",
  label: "Accept terms and conditions",
  required: true,
  fieldHasError: true,
  errorMessage: "You must accept the terms and conditions to continue",
  theme: "error",
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  name: "toggleRequired",
  label: "I agree to the privacy policy *",
  required: true,
};

export const StringValues = Template.bind({});
StringValues.args = {
  ...Default.args,
  name: "toggleStringValues",
  label: "Email notifications",
  trueValue: "enabled",
  falseValue: "disabled",
  useDescription: true,
  descriptionContent: "Choose whether to receive email notifications",
};
