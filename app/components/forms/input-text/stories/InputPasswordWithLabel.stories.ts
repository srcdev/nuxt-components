import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../variants/InputPasswordWithLabel.vue";
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms.d";

interface InputPasswordWithLabelStoryArgs {
  modelValue: string;
  maxlength: number;
  name: string;
  placeholder: string;
  label: string;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormTheme;
  size: FormSize;
  inputVariant: InputVariant;
  styleClassPassthrough: string[];
  useDescriptionSlot: boolean;
  useDescriptionHtmlSlot: boolean;
  descriptionContent: string;
  descriptionHtmlContent: string;
}

export default {
  title: "Components/Forms/Input Text/InputPasswordWithLabel",
  component: StorybookComponent,
  argTypes: {
    // Model
    modelValue: {
      control: "text",
      description: "The password value",
      table: {
        category: "Model",
      },
    },

    // Basic Configuration
    maxlength: {
      control: { type: "number", min: 1, max: 1000 },
      description: "Maximum length of password",
      table: {
        category: "Basic",
      },
    },
    name: {
      control: "text",
      description: "Input name attribute",
      table: {
        category: "Basic",
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
      table: {
        category: "Basic",
      },
    },
    label: {
      control: "text",
      description: "Input label",
      table: {
        category: "Basic",
      },
    },

    // Validation
    errorMessage: {
      control: "text",
      description: "Error message to display",
      table: {
        category: "Validation",
      },
    },
    fieldHasError: {
      control: "boolean",
      description: "Whether field has validation error",
      table: {
        category: "Validation",
      },
    },
    required: {
      control: "boolean",
      description: "Whether field is required",
      table: {
        category: "Validation",
      },
    },

    // Styling
    theme: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "ghost", "error", "success", "warning"],
      description: "Theme for styling",
      table: {
        category: "Styling",
      },
    },
    size: {
      control: { type: "select" },
      options: ["x-small", "small", "default", "medium", "large"],
      description: "Input size",
      table: {
        category: "Styling",
      },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      description: "Input variant style",
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

    // Slots
    useDescriptionSlot: {
      control: "boolean",
      description: "Use description slot",
      table: {
        category: "Slots",
      },
    },
    useDescriptionHtmlSlot: {
      control: "boolean",
      description: "Use description HTML slot",
      table: {
        category: "Slots",
      },
    },
    descriptionContent: {
      control: "text",
      description: "Content for description slot",
      table: {
        category: "Slots",
      },
    },
    descriptionHtmlContent: {
      control: "text",
      description: "HTML content for description slot",
      table: {
        category: "Slots",
      },
    },
  },
  args: {
    modelValue: "",
    maxlength: 255,
    name: "password-input",
    placeholder: "Enter your password...",
    label: "Password",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "primary",
    size: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useDescriptionSlot: false,
    useDescriptionHtmlSlot: false,
    descriptionContent: "Password should be at least 8 characters long",
    descriptionHtmlContent:
      "Password must contain: <strong>8+ characters</strong>, <em>uppercase</em>, <em>lowercase</em>, <em>numbers</em>",
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputPasswordWithLabelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { modelValue, ...otherArgs } = args;
    const passwordValue = ref(modelValue);

    return {
      passwordValue,
      args: otherArgs,
      descriptionContent: args.descriptionContent,
      descriptionHtmlContent: args.descriptionHtmlContent,
      useDescriptionSlot: args.useDescriptionSlot,
      useDescriptionHtmlSlot: args.useDescriptionHtmlSlot,
    };
  },
  template: `
    <StorybookComponent
      v-model="passwordValue"
      v-bind="args"
    >
      <template v-if="useDescriptionSlot" #description>{{ descriptionContent }}</template>
      <template v-if="useDescriptionHtmlSlot" #descriptionHtml v-html="descriptionHtmlContent"></template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Current value: {{ passwordValue ? '•'.repeat(passwordValue.length) : 'Empty' }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const WithDescription = Template.bind({});
WithDescription.args = {
  useDescriptionSlot: true,
  label: "Account Password",
  placeholder: "Create a secure password",
};

export const WithHtmlDescription = Template.bind({});
WithHtmlDescription.args = {
  useDescriptionHtmlSlot: true,
  label: "New Password",
  placeholder: "Enter new password",
};

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: "Login Password",
  placeholder: "Enter your password",
  useDescriptionSlot: true,
  descriptionContent: "This field is required for login",
};

export const WithError = Template.bind({});
WithError.args = {
  fieldHasError: true,
  errorMessage: "Password must be at least 8 characters long",
  theme: "error",
  label: "Password",
  placeholder: "Enter password",
  modelValue: "123", // Short password to show error
};

export const PasswordTooShort = Template.bind({});
PasswordTooShort.args = {
  fieldHasError: true,
  errorMessage: "Password is too weak",
  theme: "error",
  label: "Strong Password",
  placeholder: "Enter a strong password",
  modelValue: "weak",
  useDescriptionHtmlSlot: true,
};

export const Outlined = Template.bind({});
Outlined.args = {
  inputVariant: "outlined",
  label: "Confirm Password",
  placeholder: "Confirm your password",
};

export const Underlined = Template.bind({});
Underlined.args = {
  inputVariant: "underlined",
  label: "Master Password",
  placeholder: "Enter master password",
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  label: "Security Key",
  placeholder: "Enter security key",
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  label: "PIN",
  placeholder: "Enter PIN",
  maxlength: 6,
};

export const AllVariants = Template.bind({});
AllVariants.storyName = "All Input Variants";
AllVariants.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const variants: InputVariant[] = ["normal", "outlined", "underlined"];
    const passwordValues = reactive(
      variants.reduce(
        (acc, variant) => ({
          ...acc,
          [variant]: "",
        }),
        {} as Record<string, string>
      )
    );

    return {
      variants,
      passwordValues,
      args,
    };
  },
  template: `
    <div class="space-y-6">
      <div v-for="variant in variants" :key="variant" class="space-y-2">
        <h3 class="text-lg font-semibold capitalize">{{ variant }} Variant</h3>
        <StorybookComponent
          v-model="passwordValues[variant]"
          v-bind="{ ...args, inputVariant: variant, label: variant + ' Password', name: variant + '-password' }"
        />
      </div>
    </div>
  `,
});

export const SecurityFeatures = Template.bind({});
SecurityFeatures.storyName = "Password Security Demo";
SecurityFeatures.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const passwords = reactive({
      weak: "123",
      medium: "password123",
      strong: "MyStr0ng!Pass",
    });

    const getStrengthColor = (password: string) => {
      if (password.length < 6) return "error";
      if (password.length < 10) return "warning";
      return "success";
    };

    return {
      passwords,
      getStrengthColor,
      args,
    };
  },
  template: `
    <div class="space-y-6">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Weak Password (Error State)</h3>
        <StorybookComponent
          v-model="passwords.weak"
          v-bind="{ ...args, theme: getStrengthColor(passwords.weak), fieldHasError: passwords.weak.length < 6, errorMessage: 'Password too short', label: 'Weak Password', name: 'weak-password' }"
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Medium Password (Warning State)</h3>
        <StorybookComponent
          v-model="passwords.medium"
          v-bind="{ ...args, theme: getStrengthColor(passwords.medium), label: 'Medium Password', name: 'medium-password' }"
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Strong Password (Success State)</h3>
        <StorybookComponent
          v-model="passwords.strong"
          v-bind="{ ...args, theme: getStrengthColor(passwords.strong), label: 'Strong Password', name: 'strong-password' }"
        />
      </div>
    </div>
  `,
});
