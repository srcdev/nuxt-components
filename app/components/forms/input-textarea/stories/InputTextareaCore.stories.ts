import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../InputTextareaCore.vue";
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms.d";

interface InputTextareaCoreStoryArgs {
  modelValue: string;
  maxlength: number;
  id: string;
  name: string;
  placeholder: string;
  ariaDescribedby: string;
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
  title: "Components/Forms/Input Textarea/InputTextareaCore",
  component: StorybookComponent,
  argTypes: {
    // Model
    modelValue: {
      control: "text",
      description: "The textarea value",
      table: {
        category: "Model",
      },
    },

    // Basic Configuration
    maxlength: {
      control: { type: "number", min: 1, max: 10000 },
      description: "Maximum length of textarea",
      table: {
        category: "Basic",
      },
    },
    id: {
      control: "text",
      description: "Element ID",
      table: {
        category: "Basic",
      },
    },
    name: {
      control: "text",
      description: "Textarea name attribute",
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
    ariaDescribedby: {
      control: "text",
      description: "ARIA describedby attribute",
      table: {
        category: "Accessibility",
      },
    },

    // Validation
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
      description: "Textarea size",
      table: {
        category: "Styling",
      },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      description: "Textarea variant style",
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
    maxlength: 1000,
    id: "example-textarea",
    name: "example-textarea",
    placeholder: "Enter your message...",
    ariaDescribedby: "",
    fieldHasError: false,
    required: false,
    theme: "primary",
    size: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useLeftSlot: false,
    useRightSlot: false,
    leftSlotContent: "📝",
    rightSlotContent: "✨",
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputTextareaCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { modelValue, ...otherArgs } = args;
    const textareaValue = ref(modelValue);

    return {
      textareaValue,
      args: otherArgs,
      leftSlotContent: args.leftSlotContent,
      rightSlotContent: args.rightSlotContent,
      useLeftSlot: args.useLeftSlot,
      useRightSlot: args.useRightSlot,
    };
  },
  template: `
    <StorybookComponent
      v-model="textareaValue"
      v-bind="args"
    >
      <template v-if="useLeftSlot" #left>{{ leftSlotContent }}</template>
      <template v-if="useRightSlot" #right>{{ rightSlotContent }}</template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Character count: {{ textareaValue.length }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: "Type your thoughts here...",
};

export const LongText = Template.bind({});
LongText.args = {
  modelValue:
    "This is a longer piece of text that demonstrates how the textarea handles multiple lines and wrapping. You can continue typing and see how it behaves with more content.",
  placeholder: "Enter a long message...",
};

export const Required = Template.bind({});
Required.args = {
  required: true,
  placeholder: "This field is required",
};

export const WithError = Template.bind({});
WithError.args = {
  fieldHasError: true,
  theme: "error",
  modelValue: "Invalid content",
  placeholder: "Enter valid content",
};

export const WithSlots = Template.bind({});
WithSlots.args = {
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "📝",
  rightSlotContent: "✨",
  placeholder: "Textarea with decorative slots",
};

export const Outlined = Template.bind({});
Outlined.args = {
  inputVariant: "outlined",
  placeholder: "Outlined textarea",
};

export const Underlined = Template.bind({});
Underlined.args = {
  inputVariant: "underlined",
  placeholder: "Underlined textarea",
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  size: "large",
  placeholder: "Large textarea",
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: "small",
  placeholder: "Small textarea",
  maxlength: 100,
};

export const CharacterLimit = Template.bind({});
CharacterLimit.args = {
  maxlength: 140,
  placeholder: "Tweet-length message (140 chars max)",
  modelValue: "This is a sample message to show character counting.",
};
