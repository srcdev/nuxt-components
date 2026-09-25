import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../InputTextAsNumberWithLabel.vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms.d";

interface InputTextAsNumberWithLabelStoryArgs {
  modelValue: number | undefined;
  maxlength: number;
  name: string;
  placeholder: string;
  label: string;
  errorMessage: string;
  fieldHasError: boolean;
  required: boolean;
  theme: FormUiTheme;
  inputVariant: InputUiVariant;
  min: number;
  max: number;
  step: number;
  styleClassPassthrough: string[];
  useDescriptionSlot: boolean;
  descriptionContent: string;
  useLeftSlot: boolean;
  useRightSlot: boolean;
  leftSlotContent: string;
  rightSlotContent: string;
  stepDownText: string;
  stepUpText: string;
}

export default {
  title: "Components/Forms/Input Text/InputTextAsNumberWithLabel",
  component: StorybookComponent,
  argTypes: {
    // Model
    modelValue: {
      control: { type: "number" },
      description: "The numeric value",
      table: {
        category: "Model",
      },
    },

    // Basic Configuration
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

    // Number Configuration
    min: {
      control: { type: "number" },
      description: "Minimum allowed value",
      table: {
        category: "Number",
      },
    },
    max: {
      control: { type: "number" },
      description: "Maximum allowed value",
      table: {
        category: "Number",
      },
    },
    step: {
      control: { type: "number", min: 0.1, step: 0.1 },
      description: "Step increment/decrement value",
      table: {
        category: "Number",
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
    useDescriptionSlot: {
      control: "boolean",
      description: "Use description slot",
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
    useLeftSlot: {
      control: "boolean",
      description: "Use left slot (decrement button)",
      table: {
        category: "Slots",
      },
    },
    useRightSlot: {
      control: "boolean",
      description: "Use right slot (increment button)",
      table: {
        category: "Slots",
      },
    },
    leftSlotContent: {
      control: "text",
      description: "Content for left slot (decrement icon)",
      table: {
        category: "Slots",
      },
    },
    rightSlotContent: {
      control: "text",
      description: "Content for right slot (increment icon)",
      table: {
        category: "Slots",
      },
    },

    // Localisation
    stepDownText: {
      control: "text",
      description: "Accessible name for the decrement button",
      table: {
        category: "Localisation",
      },
    },
    stepUpText: {
      control: "text",
      description: "Accessible name for the increment button",
      table: {
        category: "Localisation",
      },
    },
  },
  args: {
    modelValue: undefined,
    maxlength: 255,
    name: "number-input",
    placeholder: "Enter number...",
    label: "Number Input",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "default",
    inputVariant: "normal",
    min: 0,
    max: 100,
    step: 1,
    styleClassPassthrough: [],
    useDescriptionSlot: false,
    descriptionContent: "Use the buttons to increment or decrement the value",
    useLeftSlot: true,
    useRightSlot: true,
    leftSlotContent: "−",
    rightSlotContent: "+",
    stepDownText: "Step down",
    stepUpText: "Step up",
  },
} as Meta<typeof StorybookComponent>;

// `args` is Storybook's own reactive object — bind to it directly (`args.x`) rather than
// destructuring it into local variables/refs, which would snapshot the values once at setup()
// and stop reflecting later Controls-panel changes. `componentArgs` strips the non-prop
// slot-toggle args so they don't leak onto the component as unknown attributes.
const Template: StoryFn<InputTextAsNumberWithLabelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const componentArgs = computed(() => {
      const { useDescriptionSlot, descriptionContent, useLeftSlot, useRightSlot, leftSlotContent, rightSlotContent, ...rest } =
        args;
      return rest;
    });

    return { args, componentArgs };
  },
  template: `
    <StorybookComponent
      v-model="args.modelValue"
      v-bind="componentArgs"
    >
      <template v-if="args.useDescriptionSlot" #description>{{ args.descriptionContent }}</template>
      <template v-if="args.useLeftSlot" #left>{{ args.leftSlotContent }}</template>
      <template v-if="args.useRightSlot" #right>{{ args.rightSlotContent }}</template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Current value: {{ args.modelValue ?? 'undefined' }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  modelValue: 50,
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  modelValue: 25,
  useDescriptionSlot: true,
  label: "Quantity",
  placeholder: "Select quantity",
  min: 1,
  max: 99,
};

export const Currency = Template.bind({});
Currency.args = {
  modelValue: 100,
  label: "Price ($)",
  placeholder: "0.00",
  min: 0,
  max: 10000,
  step: 0.01,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const Percentage = Template.bind({});
Percentage.args = {
  modelValue: 50,
  label: "Percentage (%)",
  placeholder: "Enter percentage",
  min: 0,
  max: 100,
  step: 5,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const SmallRange = Template.bind({});
SmallRange.args = {
  modelValue: 3,
  label: "Rating (1-5)",
  placeholder: "Rate from 1 to 5",
  min: 1,
  max: 5,
  step: 1,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const LargeNumbers = Template.bind({});
LargeNumbers.args = {
  modelValue: 5000,
  label: "Budget",
  placeholder: "Enter budget amount",
  min: 1000,
  max: 100000,
  step: 1000,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const WithError = Template.bind({});
WithError.args = {
  modelValue: 150,
  fieldHasError: true,
  errorMessage: "Value must be between 0 and 100",
  theme: "error",
  label: "Invalid Number",
  min: 0,
  max: 100,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: "Required Number",
  placeholder: "This field is required",
  min: 1,
  max: 1000,
  useDescriptionSlot: true,
  descriptionContent: "This field is required",
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const Outlined = Template.bind({});
Outlined.args = {
  modelValue: 42,
  inputVariant: "outlined",
  label: "Temperature (°C)",
  placeholder: "Enter temperature",
  min: -50,
  max: 50,
  step: 0.5,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const Underlined = Template.bind({});
Underlined.args = {
  modelValue: 10,
  inputVariant: "underlined",
  label: "Items Count",
  placeholder: "Number of items",
  min: 0,
  max: 999,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const WithCustomIcons = Template.bind({});
WithCustomIcons.args = {
  modelValue: 15,
  label: "Volume Level",
  placeholder: "Set volume",
  min: 0,
  max: 100,
  step: 5,
  leftSlotContent: "🔉",
  rightSlotContent: "🔊",
};

export const InteractiveDemo = Template.bind({});
InteractiveDemo.storyName = "Interactive Demo";
InteractiveDemo.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const demoValues = reactive({
      quantity: 1,
      price: 25.99,
      percentage: 75,
      rating: 4,
    });

    const total = computed(() => (demoValues.quantity * demoValues.price).toFixed(2));

    return {
      demoValues,
      total,
      args,
    };
  },
  template:
    `<div class="space-y-6 p-4 border rounded-lg">
      <h2 class="text-xl font-bold">Shopping Cart Demo</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StorybookComponent
          v-model="demoValues.quantity"
          :min="1"
          :max="99"
          :step="1"
          label="Quantity"
          name="quantity"
          placeholder="Select quantity"
        >
          <template #left>−</template>
          <template #right>+</template>
        </StorybookComponent>

        <StorybookComponent
          v-model="demoValues.price"
          :min="0"
          :max="999.99"
          :step="0.01"
          label="Price (` +
    "$" +
    `)"
          name="price"
          placeholder="0.00"
        >
          <template #left>−</template>
          <template #right>+</template>
        </StorybookComponent>

        <StorybookComponent
          v-model="demoValues.percentage"
          :min="0"
          :max="100"
          :step="5"
          label="Discount (%)"
          name="percentage"
          placeholder="Enter discount"
        >
          <template #left>−</template>
          <template #right>+</template>
        </StorybookComponent>

        <StorybookComponent
          v-model="demoValues.rating"
          :min="1"
          :max="5"
          :step="1"
          label="Rating (1-5 stars)"
          name="rating"
          placeholder="Rate product"
        >
          <template #left>⭐</template>
          <template #right>⭐</template>
        </StorybookComponent>
      </div>

      <div class="p-4 bg-gray-100 rounded">
        <h3 class="font-semibold">Order Summary:</h3>
        <p>Quantity: {{ demoValues.quantity }}</p>
        <p>Price: ` +
    "$" +
    `{{ demoValues.price }}</p>
        <p>Discount: {{ demoValues.percentage }}%</p>
        <p>Rating: {{ demoValues.rating }}/5</p>
        <p class="font-bold text-lg">Total: ` +
    "$" +
    `{{ total }}</p>
      </div>
    </div>`,
});
