import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../InputTextCore.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface InputTextCoreStoryArgs {
  modelValue: string;
  type: "text" | "email" | "password" | "tel" | "url" | "search" | "date";
  maxlength: number;
  min: string | number;
  max: string | number;
  name: string;
  placeholder: string;
  label: string;
  errorMessage: string;
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
      options: ["text", "email", "password", "tel", "url", "search", "date"],
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
    min: {
      control: "text",
      description: 'Passed straight through to the native input — e.g. earliest allowed date for type="date", or lowest number for type="number".',
      table: {
        category: "Basic",
      },
    },
    max: {
      control: "text",
      description: 'Passed straight through to the native input — e.g. latest allowed date for type="date", or highest number for type="number".',
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
    theme: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useLeftSlot: false,
    useRightSlot: false,
    leftSlotContent: "L",
    rightSlotContent: "R",
  },
} as Meta<typeof StorybookComponent>;

// `args` is Storybook's own reactive object — bind to it directly (`args.x`) rather than
// destructuring it into local variables/refs, which would snapshot the values once at setup()
// and stop reflecting later Controls-panel changes. `componentArgs` strips the non-prop
// slot-toggle args so they don't leak onto the component as unknown attributes.
const Template: StoryFn<InputTextCoreStoryArgs> = (args) => ({
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
      Current value: {{ args.modelValue }}
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

export const DateWithMinMax = Template.bind({});
DateWithMinMax.args = {
  type: "date",
  label: "Appointment date",
  name: "appointmentDate",
  // Prevents picking a date in the past in the native browser date picker.
  min: new Date().toISOString().split("T")[0],
  max: "2027-12-31",
};
