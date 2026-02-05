import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../variants/InputTextareaWithLabel.vue";
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms.d";

interface InputTextareaWithLabelStoryArgs {
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
  useDescriptionTextSlot: boolean;
  useDescriptionHtmlSlot: boolean;
  descriptionTextContent: string;
  descriptionHtmlContent: string;
  useLeftSlot: boolean;
  useRightSlot: boolean;
  leftSlotContent: string;
  rightSlotContent: string;
}

export default {
  title: "Components/Forms/Input Textarea/InputTextareaWithLabel",
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
    label: {
      control: "text",
      description: "Textarea label",
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
    useDescriptionTextSlot: {
      control: "boolean",
      description: "Use description text slot",
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
    descriptionTextContent: {
      control: "text",
      description: "Content for description text slot",
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
    name: "example-textarea",
    placeholder: "Enter your message...",
    label: "Message",
    errorMessage: "",
    fieldHasError: false,
    required: false,
    theme: "primary",
    size: "default",
    inputVariant: "normal",
    styleClassPassthrough: [],
    useDescriptionTextSlot: false,
    useDescriptionHtmlSlot: false,
    descriptionTextContent: "Please provide a detailed message",
    descriptionHtmlContent: "Please provide a <strong>detailed</strong> message with <em>important</em> information",
    useLeftSlot: false,
    useRightSlot: false,
    leftSlotContent: "📝",
    rightSlotContent: "✨",
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputTextareaWithLabelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { modelValue, ...otherArgs } = args;
    const textareaValue = ref(modelValue);

    return {
      textareaValue,
      args: otherArgs,
      descriptionTextContent: args.descriptionTextContent,
      descriptionHtmlContent: args.descriptionHtmlContent,
      useDescriptionTextSlot: args.useDescriptionTextSlot,
      useDescriptionHtmlSlot: args.useDescriptionHtmlSlot,
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
      <template v-if="useDescriptionTextSlot" #descriptionText>{{ descriptionTextContent }}</template>
      <template v-if="useDescriptionHtmlSlot" #descriptionHtml v-html="descriptionHtmlContent"></template>
      <template v-if="useLeftSlot" #left>{{ leftSlotContent }}</template>
      <template v-if="useRightSlot" #right>{{ rightSlotContent }}</template>
    </StorybookComponent>
    <div class="mt-4 text-sm text-gray-600">
      Character count: {{ textareaValue.length }} / {{ args.maxlength }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const WithDescription = Template.bind({});
WithDescription.args = {
  useDescriptionTextSlot: true,
  label: "Feedback",
  placeholder: "Share your thoughts...",
};

export const WithHtmlDescription = Template.bind({});
WithHtmlDescription.args = {
  useDescriptionHtmlSlot: true,
  label: "Product Review",
  placeholder: "Write your detailed review...",
  descriptionHtmlContent:
    "Please include <strong>specific details</strong> about the product, including <em>pros</em> and <em>cons</em>",
};

export const ContactForm = Template.bind({});
ContactForm.args = {
  label: "Message",
  placeholder: "Tell us how we can help you...",
  useDescriptionTextSlot: true,
  descriptionTextContent: "Please provide as much detail as possible so we can assist you effectively",
  maxlength: 500,
  required: true,
};

export const CommentBox = Template.bind({});
CommentBox.args = {
  label: "Comment",
  placeholder: "Add a comment...",
  maxlength: 280,
  modelValue: "This is a great article! Thanks for sharing.",
};

export const CodeSnippet = Template.bind({});
CodeSnippet.args = {
  label: "Code",
  placeholder: "Paste your code here...",
  useDescriptionTextSlot: true,
  descriptionTextContent: "Please include any relevant context or error messages",
  useLeftSlot: true,
  leftSlotContent: "💻",
  maxlength: 2000,
  modelValue: `function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`,
};

export const WithError = Template.bind({});
WithError.args = {
  fieldHasError: true,
  errorMessage: "Message is too short. Please provide more details.",
  theme: "error",
  label: "Error Example",
  placeholder: "This field has an error",
  modelValue: "Too short",
};

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: "Required Message",
  placeholder: "This field is required",
  useDescriptionTextSlot: true,
  descriptionTextContent: "This field is required and cannot be left empty",
};

export const Outlined = Template.bind({});
Outlined.args = {
  inputVariant: "outlined",
  label: "Outlined Textarea",
  placeholder: "This is an outlined textarea",
  useDescriptionTextSlot: true,
  descriptionTextContent: "Notice how the description appears below in outlined variant",
};

export const Underlined = Template.bind({});
Underlined.args = {
  inputVariant: "underlined",
  label: "Underlined Textarea",
  placeholder: "This is an underlined textarea",
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  label: "Large Textarea",
  placeholder: "This is a large textarea for longer content...",
  maxlength: 2000,
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  label: "Small Note",
  placeholder: "Quick note...",
  maxlength: 100,
};

export const WithSlots = Template.bind({});
WithSlots.args = {
  label: "Message with Icons",
  placeholder: "Type your message...",
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "📝",
  rightSlotContent: "💌",
  useDescriptionTextSlot: true,
  descriptionTextContent: "Icons are displayed on the left and right of the textarea",
};

export const AllVariants = Template.bind({});
AllVariants.storyName = "All Input Variants";
AllVariants.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const variants: InputVariant[] = ["normal", "outlined", "underlined"];
    const textareaValues = reactive(
      variants.reduce(
        (acc, variant) => ({
          ...acc,
          [variant]: `Sample text for ${variant} variant`,
        }),
        {} as Record<string, string>
      )
    );

    return {
      variants,
      textareaValues,
      args,
    };
  },
  template: `
    <div class="space-y-6">
      <div v-for="variant in variants" :key="variant" class="space-y-2">
        <h3 class="text-lg font-semibold capitalize">{{ variant }} Variant</h3>
        <StorybookComponent
          v-model="textareaValues[variant]"
          v-bind="{ ...args, inputVariant: variant, label: variant + ' Textarea', name: variant + '-textarea' }"
        />
      </div>
    </div>
  `,
});

export const FormExamples = Template.bind({});
FormExamples.storyName = "Real-World Form Examples";
FormExamples.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const formData = reactive({
      feedback: "",
      bio: "",
      message: "",
      code: "",
    });

    return {
      formData,
      args,
    };
  },
  template: `
    <div class="space-y-6">
      <div class="space-y-4">
        <h2 class="text-xl font-bold">Contact Form</h2>
        <StorybookComponent
          v-model="formData.message"
          label="Message"
          name="contact-message"
          placeholder="How can we help you?"
          :required="true"
          :maxlength="500"
        >
          <template #descriptionText>Please describe your inquiry in detail (max 500 characters)</template>
        </StorybookComponent>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-bold">User Profile</h2>
        <StorybookComponent
          v-model="formData.bio"
          label="Bio"
          name="user-bio"
          placeholder="Tell us about yourself..."
          :maxlength="200"
          input-variant="outlined"
        >
          <template #descriptionText>Share a brief description about yourself (max 200 characters)</template>
        </StorybookComponent>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-bold">Feedback Form</h2>
        <StorybookComponent
          v-model="formData.feedback"
          label="Feedback"
          name="user-feedback"
          placeholder="Share your experience..."
          :maxlength="1000"
          size="large"
        >
          <template #descriptionHtml>Rate your experience and provide <strong>detailed feedback</strong></template>
          <template #left>⭐</template>
        </StorybookComponent>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-bold">Code Submission</h2>
        <StorybookComponent
          v-model="formData.code"
          label="Code Snippet"
          name="code-snippet"
          placeholder="Paste your code here..."
          :maxlength="5000"
          input-variant="underlined"
        >
          <template #descriptionText>Paste your code snippet with proper formatting</template>
          <template #left>💻</template>
          <template #right>📋</template>
        </StorybookComponent>
      </div>

      <div class="p-4 bg-gray-100 rounded">
        <h3 class="font-semibold mb-2">Form Data Preview:</h3>
        <pre class="text-sm">{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  `,
});
