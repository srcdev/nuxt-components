import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../InputTextareaCore.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface InputTextareaCoreStoryArgs {
  modelValue: string;
  maxlength: number;
  id: string;
  name: string;
  placeholder: string;
  ariaDescribedby: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
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
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useLeftSlot: false,
    useRightSlot: false,
    leftSlotContent: "📝",
    rightSlotContent: "✨",
  },
} as Meta<typeof StorybookComponent>;

// `args` is Storybook's own reactive object — bind to it directly (`args.x`) rather than
// destructuring it into local variables/refs, which would snapshot the values once at setup()
// and stop reflecting later Controls-panel changes. `componentArgs` strips the non-prop
// slot-toggle args so they don't leak onto the component as unknown attributes.
const Template: StoryFn<InputTextareaCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const componentArgs = computed(() => {
      const { useLeftSlot, useRightSlot, leftSlotContent, rightSlotContent, ...rest } = args;
      return rest;
    });

    return { args, componentArgs };
  },
  template: `
    <StorybookComponent
      v-model="args.modelValue"
      v-bind="componentArgs"
    >
      <template v-if="args.useLeftSlot" #left>{{ args.leftSlotContent }}</template>
      <template v-if="args.useRightSlot" #right>{{ args.rightSlotContent }}</template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Character count: {{ args.modelValue.length }}
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

export const CharacterLimit = Template.bind({});
CharacterLimit.args = {
  maxlength: 140,
  placeholder: "Tweet-length message (140 chars max)",
  modelValue: "This is a sample message to show character counting.",
};
