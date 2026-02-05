import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../InputTextCore.vue";
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms.d";

interface InputTextCoreStoryArgs {
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
  leftSlotContent: string;
  rightSlotContent: string;
  useLeftSlot: boolean;
  useRightSlot: boolean;
}

export default {
  title: "Components/Forms/Input Text/InputTextCore",
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
    useLeftSlot: {
      control: "boolean",
      description: "Use left slot",
      table: {
        category: "Slots",
      },
    },
    useRightSlot: {
      control: "boolean",
      description: "Use right slot",
      table: {
        category: "Slots",
      },
    },
    leftSlotContent: {
      control: "text",
      description: "Content for left slot",
      table: {
        category: "Slots",
      },
    },
    rightSlotContent: {
      control: "text",
      description: "Content for right slot",
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
    placeholder: "Enter text...",
    label: "Example Label",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "primary",
    size: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useLeftSlot: false,
    useRightSlot: false,
    leftSlotContent: "L",
    rightSlotContent: "R",
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputTextCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { modelValue, ...otherArgs } = args;
    const inputValue = ref(modelValue);

    return {
      inputValue,
      args: otherArgs,
      leftSlotContent: args.leftSlotContent,
      rightSlotContent: args.rightSlotContent,
      useLeftSlot: args.useLeftSlot,
      useRightSlot: args.useRightSlot,
    };
  },
  template: `
    <StorybookComponent
      v-model="inputValue"
      v-bind="args"
    >
      <template v-if="useLeftSlot" #left>{{ leftSlotContent }}</template>
      <template v-if="useRightSlot" #right>{{ rightSlotContent }}</template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Current value: {{ inputValue }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: "Type something here...",
};

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: "Required Field",
};

export const WithError = Template.bind({});
WithError.args = {
  fieldHasError: true,
  errorMessage: "This field is required",
  theme: "error",
};

export const WithSlots = Template.bind({});
WithSlots.args = {
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "📧",
  rightSlotContent: "🔍",
};

export const Outlined = Template.bind({});
Outlined.args = {
  inputVariant: "outlined",
  placeholder: "Outlined input",
};

export const Underlined = Template.bind({});
Underlined.args = {
  inputVariant: "underlined",
  placeholder: "Underlined input",
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  size: "large",
  placeholder: "Large input",
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: "small",
  placeholder: "Small input",
};
