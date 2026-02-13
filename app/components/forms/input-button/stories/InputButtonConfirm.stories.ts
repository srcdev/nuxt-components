import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../variants/InputButtonConfirm.vue";
import type { FormTheme, FormSize, FormWeight } from "~/types/forms/types.forms.d";

interface InputButtonConfirmStoryArgs {
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
  title: "Components/Forms/Input Button/InputButtonConfirm",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    buttonText: {
      control: "text",
      description: "Confirm button text",
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
      description: "Whether button is in pending state",
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
    theme: "success",
    buttonText: "Confirm",
    dataTestid: "",
    styleClassPassthrough: [],
    useEffect: false,
    effect: "fancy",
    isPending: false,
    readonly: false,
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputButtonConfirmStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const confirmCount = ref(0);
    const isProcessing = ref(false);

    const handleConfirm = async () => {
      if (!args.readonly && !args.isPending) {
        isProcessing.value = true;
        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1500));
        confirmCount.value++;
        isProcessing.value = false;
      }
    };

    return {
      args,
      confirmCount,
      isProcessing,
      handleConfirm,
    };
  },
  template: `
    <div class="space-y-4">
      <StorybookComponent
        v-bind="{ ...args, isPending: args.isPending || isProcessing }"
        @click="handleConfirm"
      />
      <div class="text-sm text-gray-600">
        Confirmations: {{ confirmCount }}
        <span v-if="isProcessing"> (Processing...)</span>
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const ConfirmAction = Template.bind({});
ConfirmAction.args = {
  theme: "success",
  buttonText: "Confirm Action",
};

export const ApproveRequest = Template.bind({});
ApproveRequest.args = {
  theme: "success",
  buttonText: "Approve Request",
  size: "medium",
};

export const AcceptTerms = Template.bind({});
AcceptTerms.args = {
  theme: "primary",
  buttonText: "Accept Terms",
  weight: "wght-500",
};

export const VerifyIdentity = Template.bind({});
VerifyIdentity.args = {
  theme: "success",
  buttonText: "Verify Identity",
  size: "large",
};

export const ConfirmPayment = Template.bind({});
ConfirmPayment.args = {
  theme: "success",
  buttonText: "Confirm Payment",
  size: "large",
  weight: "wght-600",
  useEffect: true,
  effect: "fancy",
};

export const ProcessingState = Template.bind({});
ProcessingState.args = {
  isPending: true,
  buttonText: "Processing...",
  theme: "success",
};

export const DisabledConfirm = Template.bind({});
DisabledConfirm.args = {
  readonly: true,
  buttonText: "Confirm (Disabled)",
  theme: "ghost",
};

export const SmallConfirm = Template.bind({});
SmallConfirm.args = {
  size: "small",
  buttonText: "OK",
  theme: "success",
};

export const ConfirmDialog = Template.bind({});
ConfirmDialog.storyName = "Confirmation Dialog Example";
ConfirmDialog.render = (_args) => ({
  components: { StorybookComponent },
  setup() {
    const showDialog = ref(false);
    const isDeleting = ref(false);
    const deletedItems = ref<string[]>([]);

    const openDialog = () => {
      showDialog.value = true;
    };

    const closeDialog = () => {
      showDialog.value = false;
    };

    const confirmDelete = async () => {
      isDeleting.value = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      deletedItems.value.push(`Item ${deletedItems.value.length + 1}`);
      isDeleting.value = false;
      showDialog.value = false;
    };

    return {
      showDialog,
      isDeleting,
      deletedItems,
      openDialog,
      closeDialog,
      confirmDelete,
    };
  },
  template: `
    <div class="space-y-4">
      <button
        @click="openDialog"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Item
      </button>

      <div v-if="deletedItems.length" class="text-sm text-gray-600">
        Deleted items: {{ deletedItems.join(', ') }}
      </div>

      <!-- Modal Overlay -->
      <div
        v-if="showDialog"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="closeDialog"
      >
        <div
          class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
          @click.stop
        >
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              ⚠️
            </div>
            <h3 class="text-lg font-semibold">Confirm Deletion</h3>
          </div>

          <p class="text-gray-600 mb-6">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeDialog"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              :disabled="isDeleting"
            >
              Cancel
            </button>
            <StorybookComponent
              button-text="Yes, Delete"
              theme="error"
              :is-pending="isDeleting"
              @click="confirmDelete"
            />
          </div>
        </div>
      </div>
    </div>
  `,
});

export const MultiStepConfirmation = Template.bind({});
MultiStepConfirmation.storyName = "Multi-Step Confirmation";
MultiStepConfirmation.render = (_args) => ({
  components: { StorybookComponent },
  setup() {
    const currentStep = ref(1);
    const isProcessing = ref(false);
    const completedSteps = ref<number[]>([]);

    const steps = [
      { id: 1, title: "Review Details", action: "Continue" },
      { id: 2, title: "Verify Information", action: "Verify" },
      { id: 3, title: "Final Confirmation", action: "Confirm" },
      { id: 4, title: "Complete", action: "Finish" },
    ];

    const handleNext = async () => {
      isProcessing.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1500));

      completedSteps.value.push(currentStep.value);
      if (currentStep.value < steps.length) {
        currentStep.value++;
      } else {
        // Reset for demo
        currentStep.value = 1;
        completedSteps.value = [];
      }
      isProcessing.value = false;
    };

    const getCurrentStep = () => steps.find((s) => s.id === currentStep.value);

    return {
      currentStep,
      isProcessing,
      completedSteps,
      steps,
      handleNext,
      getCurrentStep,
    };
  },
  template: `
    <div class="max-w-md mx-auto space-y-6">
      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm text-gray-600">
          <span>Step {{ currentStep }} of {{ steps.length }}</span>
          <span>{{ Math.round((currentStep / steps.length) * 100) }}% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: (currentStep / steps.length) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Steps -->
      <div class="space-y-4">
        <div
          v-for="step in steps"
          :key="step.id"
          class="flex items-center space-x-3 p-3 rounded border"
          :class="{
            'bg-blue-50 border-blue-200': step.id === currentStep,
            'bg-green-50 border-green-200': completedSteps.includes(step.id),
            'bg-gray-50 border-gray-200': step.id > currentStep
          }"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium"
            :class="{
              'bg-blue-500 text-white': step.id === currentStep,
              'bg-green-500 text-white': completedSteps.includes(step.id),
              'bg-gray-300 text-gray-600': step.id > currentStep
            }"
          >
            <span v-if="completedSteps.includes(step.id)">✓</span>
            <span v-else>{{ step.id }}</span>
          </div>
          <span
            :class="{
              'font-medium': step.id === currentStep,
              'text-gray-600': step.id !== currentStep
            }"
          >
            {{ step.title }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex justify-center">
        <StorybookComponent
          :button-text="getCurrentStep()?.action || 'Next'"
          :theme="currentStep === steps.length ? 'success' : 'primary'"
          :size="'large'"
          :is-pending="isProcessing"
          :use-effect="currentStep === steps.length"
          effect="fancy"
          @click="handleNext"
        />
      </div>
    </div>
  `,
});

export const ConfirmationStates = Template.bind({});
ConfirmationStates.storyName = "All Confirmation States";
ConfirmationStates.render = (_args) => ({
  components: { StorybookComponent },
  setup() {
    const scenarios = [
      { theme: "success", text: "Approve", description: "Standard approval action" },
      { theme: "primary", text: "Accept", description: "Accept terms or conditions" },
      { theme: "success", text: "Verify", description: "Verify information or identity" },
      { theme: "warning", text: "Proceed", description: "Proceed with caution" },
      { theme: "error", text: "Delete", description: "Destructive action confirmation" },
    ];

    return {
      scenarios,
    };
  },
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="scenario in scenarios"
        :key="scenario.text"
        class="p-4 border rounded-lg space-y-3"
      >
        <div>
          <h4 class="font-medium">{{ scenario.text }} Action</h4>
          <p class="text-sm text-gray-600">{{ scenario.description }}</p>
        </div>
        <StorybookComponent
          :button-text="scenario.text"
          :theme="scenario.theme"
          size="default"
        />
      </div>
    </div>
  `,
});
