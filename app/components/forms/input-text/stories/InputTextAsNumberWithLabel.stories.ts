import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../variants/InputTextAsNumberWithLabel.vue";
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms.d";

interface InputTextAsNumberWithLabelStoryArgs {
  modelValue: number | undefined;
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
    theme: "primary",
    size: "default",
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
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputTextAsNumberWithLabelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { modelValue, ...otherArgs } = args;
    const numberValue = ref(modelValue);

    return {
      numberValue,
      args: otherArgs,
      descriptionContent: args.descriptionContent,
      useDescriptionSlot: args.useDescriptionSlot,
      leftSlotContent: args.leftSlotContent,
      rightSlotContent: args.rightSlotContent,
      useLeftSlot: args.useLeftSlot,
      useRightSlot: args.useRightSlot,
    };
  },
  template: `
    <StorybookComponent
      v-model="numberValue"
      v-bind="args"
    >
      <template v-if="useDescriptionSlot" #description>{{ descriptionContent }}</template>
      <template v-if="useLeftSlot" #left>{{ leftSlotContent }}</template>
      <template v-if="useRightSlot" #right>{{ rightSlotContent }}</template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Current value: {{ numberValue ?? 'undefined' }}
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

export const Large = Template.bind({});
Large.args = {
  modelValue: 500,
  size: "large",
  label: "Large Number Input",
  placeholder: "Enter large number",
  min: 0,
  max: 10000,
  step: 10,
  leftSlotContent: "−",
  rightSlotContent: "+",
};

export const Small = Template.bind({});
Small.args = {
  modelValue: 5,
  size: "small",
  label: "Small Counter",
  placeholder: "Count",
  min: 0,
  max: 20,
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

export const AllSizes = Template.bind({});
AllSizes.storyName = "All Sizes";
AllSizes.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const sizes: FormSize[] = ["x-small", "small", "default", "medium", "large"];
    const numberValues = reactive(
      sizes.reduce(
        (acc, size) => ({
          ...acc,
          [size]: 50,
        }),
        {} as Record<string, number>
      )
    );

    return {
      sizes,
      numberValues,
      args,
    };
  },
  template: `
    <div class="space-y-6">
      <div v-for="size in sizes" :key="size" class="space-y-2">
        <h3 class="text-lg font-semibold capitalize">{{ size }} Size</h3>
        <StorybookComponent
          v-model="numberValues[size]"
          v-bind="{ ...args, size, label: size + ' Number Input', name: size + '-number', min: 0, max: 100, useLeftSlot: true, useRightSlot: true, leftSlotContent: '−', rightSlotContent: '+' }"
        >
          <template #left>−</template>
          <template #right>+</template>
        </StorybookComponent>
      </div>
    </div>
  `,
});

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
