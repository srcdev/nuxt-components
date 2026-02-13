import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../variants/InputButtonSubmit.vue";
import type { FormTheme, FormSize, FormWeight } from "~/types/forms/types.forms.d";

interface InputButtonSubmitStoryArgs {
  size: FormSize;
  weight: FormWeight;
  theme: FormTheme;
  buttonText: string;
  dataTestid: string;
  styleClassPassthrough: string[];
  useEffect: boolean;
  effect: "fancy" | "pulse";
  isPending: boolean;
  readonly: boolean;
}

export default {
  title: "Components/Forms/Input Button/InputButtonSubmit",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    buttonText: {
      control: "text",
      description: "Submit button text",
      table: {
        category: "Basic",
      },
    },
    dataTestid: {
      control: "text",
      description: "Test ID for testing purposes",
      table: {
        category: "Basic",
      },
    },

    // States
    readonly: {
      control: "boolean",
      description: "Whether button is readonly/disabled",
      table: {
        category: "States",
      },
    },
    isPending: {
      control: "boolean",
      description: "Whether button is in pending state (useful for form submission)",
      table: {
        category: "States",
      },
    },

    // Styling
    theme: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "ghost", "error", "success", "warning"],
      description: "Button theme",
      table: {
        category: "Styling",
      },
    },
    size: {
      control: { type: "select" },
      options: ["x-small", "small", "default", "medium", "large"],
      description: "Button size",
      table: {
        category: "Styling",
      },
    },
    weight: {
      control: { type: "select" },
      options: [
        "wght-100",
        "wght-200",
        "wght-300",
        "wght-400",
        "wght-500",
        "wght-600",
        "wght-700",
        "wght-800",
        "wght-900",
        "light",
      ],
      description: "Font weight",
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

    // Effects
    useEffect: {
      control: "boolean",
      description: "Enable visual effects",
      table: {
        category: "Effects",
      },
    },
    effect: {
      control: { type: "select" },
      options: ["fancy", "pulse"],
      description: "Effect type",
      table: {
        category: "Effects",
      },
    },
  },
  args: {
    size: "default",
    weight: "wght-500",
    theme: "primary",
    buttonText: "Submit",
    dataTestid: "",
    styleClassPassthrough: [],
    useEffect: false,
    effect: "fancy",
    isPending: false,
    readonly: false,
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputButtonSubmitStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const submitCount = ref(0);
    const isSubmitting = ref(false);

    const handleSubmit = async (event: Event) => {
      event.preventDefault();
      if (!args.readonly && !args.isPending) {
        isSubmitting.value = true;
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000));
        submitCount.value++;
        isSubmitting.value = false;
      }
    };

    return {
      args,
      submitCount,
      isSubmitting,
      handleSubmit,
    };
  },
  template: `
    <form @submit="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium">Sample Form Field</label>
        <input
          type="text"
          placeholder="Enter some text..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <StorybookComponent
        v-bind="{ ...args, isPending: args.isPending || isSubmitting }"
      />

      <div class="text-sm text-gray-600">
        Form submitted {{ submitCount }} times
        <span v-if="isSubmitting"> (Currently submitting...)</span>
      </div>
    </form>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const Primary = Template.bind({});
Primary.args = {
  theme: "primary",
  buttonText: "Submit Form",
};

export const Success = Template.bind({});
Success.args = {
  theme: "success",
  buttonText: "Save Changes",
};

export const ContactForm = Template.bind({});
ContactForm.args = {
  theme: "primary",
  buttonText: "Send Message",
  size: "medium",
  weight: "wght-500",
};

export const LoginForm = Template.bind({});
LoginForm.args = {
  theme: "primary",
  buttonText: "Sign In",
  size: "large",
};

export const RegisterForm = Template.bind({});
RegisterForm.args = {
  theme: "success",
  buttonText: "Create Account",
  size: "large",
  weight: "wght-600",
};

export const PendingSubmission = Template.bind({});
PendingSubmission.args = {
  isPending: true,
  buttonText: "Submitting...",
  theme: "primary",
};

export const DisabledSubmit = Template.bind({});
DisabledSubmit.args = {
  readonly: true,
  buttonText: "Submit (Disabled)",
  theme: "ghost",
};

export const WithEffect = Template.bind({});
WithEffect.args = {
  useEffect: true,
  effect: "fancy",
  buttonText: "Submit with Effect",
  theme: "primary",
};

export const SmallSubmit = Template.bind({});
SmallSubmit.args = {
  size: "small",
  buttonText: "Quick Submit",
  theme: "secondary",
};

export const LargeSubmit = Template.bind({});
LargeSubmit.args = {
  size: "large",
  buttonText: "Complete Registration",
  theme: "success",
  weight: "wght-600",
};

export const FormExamples = Template.bind({});
FormExamples.storyName = "Real-World Form Examples";
FormExamples.render = (_args) => ({
  components: { StorybookComponent },
  setup() {
    const formStates = ref({
      contact: { submitting: false, submitted: 0 },
      login: { submitting: false, submitted: 0 },
      newsletter: { submitting: false, submitted: 0 },
      feedback: { submitting: false, submitted: 0 },
    });

    const handleSubmit = async (formType: string, event: Event) => {
      event.preventDefault();
      const state = formStates.value[formType as keyof typeof formStates.value];
      if (!state.submitting) {
        state.submitting = true;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        state.submitted++;
        state.submitting = false;
      }
    };

    return {
      formStates,
      handleSubmit,
    };
  },
  template: `
    <div class="space-y-8">
      <!-- Contact Form -->
      <div class="p-6 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Contact Form</h3>
        <form @submit="(e) => handleSubmit('contact', e)" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" class="px-3 py-2 border rounded" />
            <input type="text" placeholder="Last Name" class="px-3 py-2 border rounded" />
          </div>
          <input type="email" placeholder="Email Address" class="w-full px-3 py-2 border rounded" />
          <textarea placeholder="Your Message" class="w-full px-3 py-2 border rounded h-24"></textarea>
          <div class="flex justify-between items-center">
            <StorybookComponent
              button-text="Send Message"
              theme="primary"
              size="medium"
              :is-pending="formStates.contact.submitting"
            />
            <span class="text-sm text-gray-600">Sent: {{ formStates.contact.submitted }}</span>
          </div>
        </form>
      </div>

      <!-- Login Form -->
      <div class="p-6 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Login Form</h3>
        <form @submit="(e) => handleSubmit('login', e)" class="space-y-4">
          <input type="email" placeholder="Email" class="w-full px-3 py-2 border rounded" />
          <input type="password" placeholder="Password" class="w-full px-3 py-2 border rounded" />
          <div class="flex justify-between items-center">
            <StorybookComponent
              button-text="Sign In"
              theme="primary"
              size="large"
              weight="wght-500"
              :is-pending="formStates.login.submitting"
            />
            <span class="text-sm text-gray-600">Attempts: {{ formStates.login.submitted }}</span>
          </div>
        </form>
      </div>

      <!-- Newsletter Signup -->
      <div class="p-6 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Newsletter Signup</h3>
        <form @submit="(e) => handleSubmit('newsletter', e)" class="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-3 py-2 border rounded"
          />
          <StorybookComponent
            button-text="Subscribe"
            theme="success"
            size="default"
            :is-pending="formStates.newsletter.submitting"
          />
        </form>
        <p class="text-sm text-gray-600 mt-2">Subscriptions: {{ formStates.newsletter.submitted }}</p>
      </div>

      <!-- Feedback Form -->
      <div class="p-6 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Feedback Form</h3>
        <form @submit="(e) => handleSubmit('feedback', e)" class="space-y-4">
          <div class="grid grid-cols-3 gap-2">
            <label class="flex items-center">
              <input type="radio" name="rating" value="good" class="mr-2" />
              Good
            </label>
            <label class="flex items-center">
              <input type="radio" name="rating" value="neutral" class="mr-2" />
              Neutral
            </label>
            <label class="flex items-center">
              <input type="radio" name="rating" value="bad" class="mr-2" />
              Bad
            </label>
          </div>
          <textarea placeholder="Additional comments..." class="w-full px-3 py-2 border rounded h-20"></textarea>
          <div class="flex justify-between items-center">
            <StorybookComponent
              button-text="Submit Feedback"
              theme="secondary"
              size="medium"
              use-effect
              effect="pulse"
              :is-pending="formStates.feedback.submitting"
            />
            <span class="text-sm text-gray-600">Feedback sent: {{ formStates.feedback.submitted }}</span>
          </div>
        </form>
      </div>
    </div>
  `,
});
