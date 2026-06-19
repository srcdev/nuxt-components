import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref, onMounted } from "vue";
import StorybookComponent from "../DisplayToast.vue";

interface ToastStoryArgs {
  theme: "info" | "success" | "warning" | "error";
  position: "top" | "bottom";
  alignment: "left" | "center" | "right";
  fullWidth: boolean;
  autoDismiss: boolean;
  duration: number;
  revealDuration: number;
  title: string;
  description: string;
  customIcon: string;
}

export default {
  title: "Atoms/DisplayToast",
  component: StorybookComponent,
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
      description: "Toast theme/variant",
      table: { category: "Appearance" },
    },
    position: {
      control: { type: "select" },
      options: ["top", "bottom"],
      description: "Vertical position of toast",
      table: { category: "Appearance" },
    },
    alignment: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Horizontal alignment of toast",
      table: { category: "Appearance" },
    },
    fullWidth: {
      control: { type: "boolean" },
      description: "Whether toast spans full width",
      table: { category: "Appearance" },
    },
    autoDismiss: {
      control: { type: "boolean" },
      description: "Auto dismiss toast after duration",
      table: { category: "Behaviour" },
    },
    duration: {
      control: { type: "range", min: 1000, max: 10000, step: 500 },
      description: "Auto dismiss duration in milliseconds",
      table: { category: "Behaviour" },
    },
    revealDuration: {
      control: { type: "range", min: 100, max: 1000, step: 50 },
      description: "Animation duration for reveal/hide",
      table: { category: "Behaviour" },
    },
    title: {
      control: { type: "text" },
      description: "Toast title text",
      table: { category: "Content" },
    },
    description: {
      control: { type: "text" },
      description: "Toast description text shown below the title",
      table: { category: "Content" },
    },
    customIcon: {
      control: { type: "text" },
      description: "Custom icon name (Iconify, e.g. 'akar-icons:check-box')",
      table: { category: "Content" },
    },
    config: { table: { disable: true } },
    modelValue: { table: { disable: true } },
  },
  args: {
    theme: "info",
    position: "top",
    alignment: "right",
    fullWidth: false,
    autoDismiss: false,
    duration: 3000,
    revealDuration: 300,
    title: "Notification",
    description: "This is a toast notification message.",
    customIcon: "",
  },
} as Meta<ToastStoryArgs>;

const Template: StoryFn<ToastStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const isActive = ref(false);

    onMounted(() => {
      setTimeout(() => {
        isActive.value = true;
      }, 500);
    });

    return { args, isActive };
  },
  template: `
    <div style="position: relative; height: 200px; padding: 20px;">
      <button
        @click="isActive = true"
        style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Trigger Toast
      </button>

      <StorybookComponent
        v-model="isActive"
        :config="{
          appearance: {
            theme: args.theme,
            position: args.position,
            alignment: args.alignment,
            fullWidth: args.fullWidth,
          },
          behavior: {
            autoDismiss: args.autoDismiss,
            duration: args.duration,
            revealDuration: args.revealDuration,
          },
          content: {
            title: args.title,
            description: args.description,
            ...(args.customIcon && { customIcon: args.customIcon }),
          },
        }"
      />
    </div>
  `,
});

export const Default = Template.bind({});

export const SuccessToast = Template.bind({});
SuccessToast.args = {
  theme: "success",
  title: "Changes saved",
  description: "Your changes have been saved successfully.",
  customIcon: "akar-icons:check-box",
  autoDismiss: false,
};

export const ErrorToast = Template.bind({});
ErrorToast.args = {
  theme: "error",
  title: "Something went wrong",
  description: "Please try again or contact support if the problem persists.",
  autoDismiss: false,
  position: "top",
  alignment: "center",
};

export const WarningToast = Template.bind({});
WarningToast.args = {
  theme: "warning",
  title: "Action required",
  description: "Please review the highlighted fields before continuing.",
  autoDismiss: false,
};

export const AutoDismiss = Template.bind({});
AutoDismiss.args = {
  theme: "info",
  title: "Auto-dismissing",
  description: "This toast will dismiss itself after 3 seconds.",
  autoDismiss: true,
  duration: 3000,
};

export const BottomCenter = Template.bind({});
BottomCenter.args = {
  theme: "info",
  title: "Bottom centre",
  description: "Positioned at the bottom centre of the viewport.",
  position: "bottom",
  alignment: "center",
  autoDismiss: false,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  theme: "warning",
  title: "Full width warning",
  description: "This toast spans the full width of the viewport.",
  fullWidth: true,
  position: "top",
  autoDismiss: false,
};
