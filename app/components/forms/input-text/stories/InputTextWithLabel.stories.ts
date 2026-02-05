import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../variants/InputTextWithLabel.vue";
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms.d";

interface InputTextWithLabelStoryArgs {
  modelValue: string;
  type: "text" | "email" | "password" | "tel" | "url" | "search";
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
  title: "Components/Forms/Input Text/InputTextWithLabel",
  component: StorybookComponent,
  argTypes: {
    // Model
    modelValue: {
      control: "text",
      description: "The input value",
      table: {
        category: "Model",
      },
    },

    // Basic Configuration
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "tel", "url", "search"],
      description: "Input type",
      table: {
        category: "Basic",
      },
    },
    maxlength: {
      control: { type: "number", min: 1, max: 1000 },
      description: "Maximum length of input",
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
    type: "text",
    maxlength: 255,
    name: "example-input",
    placeholder: "Enter your text...",
    label: "Text Input",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "primary",
    size: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useDescriptionSlot: false,
    useDescriptionHtmlSlot: false,
    descriptionContent: "This is a helpful description",
    descriptionHtmlContent: "<strong>Bold</strong> HTML description",
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputTextWithLabelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { modelValue, ...otherArgs } = args;
    const inputValue = ref(modelValue);

    return {
      inputValue,
      args: otherArgs,
      descriptionContent: args.descriptionContent,
      descriptionHtmlContent: args.descriptionHtmlContent,
      useDescriptionSlot: args.useDescriptionSlot,
      useDescriptionHtmlSlot: args.useDescriptionHtmlSlot,
    };
  },
  template: `
    <StorybookComponent
      v-model="inputValue"
      v-bind="args"
    >
      <template v-if="useDescriptionSlot" #description>{{ descriptionContent }}</template>
      <template v-if="useDescriptionHtmlSlot" #descriptionHtml v-html="descriptionHtmlContent"></template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Current value: {{ inputValue }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const WithDescription = Template.bind({});
WithDescription.args = {
  useDescriptionSlot: true,
  label: "Email Address",
  placeholder: "Enter your email address",
  type: "email",
};

export const WithHtmlDescription = Template.bind({});
WithHtmlDescription.args = {
  useDescriptionHtmlSlot: true,
  label: "Password",
  placeholder: "Enter a strong password",
  type: "password",
  descriptionHtmlContent:
    "Password must contain at least <strong>8 characters</strong> and include <em>uppercase</em>, <em>lowercase</em>, and <em>numbers</em>",
};

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: "Full Name",
  placeholder: "Enter your full name",
  useDescriptionSlot: true,
  descriptionContent: "This field is required",
};

export const WithError = Template.bind({});
WithError.args = {
  fieldHasError: true,
  errorMessage: "Please enter a valid email address",
  theme: "error",
  label: "Email Address",
  placeholder: "Enter your email",
  type: "email",
  modelValue: "invalid-email",
};

export const Outlined = Template.bind({});
Outlined.args = {
  inputVariant: "outlined",
  label: "Phone Number",
  placeholder: "Enter your phone number",
  type: "tel",
};

export const Underlined = Template.bind({});
Underlined.args = {
  inputVariant: "underlined",
  label: "Website URL",
  placeholder: "https://example.com",
  type: "url",
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  label: "Search Query",
  placeholder: "Search for anything...",
  type: "search",
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  label: "Reference Code",
  placeholder: "Enter reference code",
  maxlength: 10,
};

export const AllThemes = Template.bind({});
AllThemes.storyName = "All Themes";
AllThemes.args = {};
AllThemes.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const themes: FormTheme[] = ["primary", "secondary", "tertiary", "ghost", "success", "warning"];
    const inputValues = reactive(
      themes.reduce(
        (acc, theme) => ({
          ...acc,
          [theme]: "",
        }),
        {} as Record<string, string>
      )
    );

    return {
      themes,
      inputValues,
      args,
    };
  },
  template: `
    <div class="space-y-6">
      <div v-for="theme in themes" :key="theme" class="space-y-2">
        <h3 class="text-lg font-semibold capitalize">{{ theme }} Theme</h3>
        <StorybookComponent
          v-model="inputValues[theme]"
          v-bind="{ ...args, theme, label: theme + ' Input', name: theme + '-input' }"
        />
      </div>
    </div>
  `,
});
