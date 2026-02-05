import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref, onMounted } from "vue";
import StorybookComponent from "../DisplayToast.vue";

// Custom interface for story args
interface ToastStoryArgs {
  theme: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  position: "top" | "bottom";
  alignment: "left" | "center" | "right";
  fullWidth: boolean;
  autoDismiss: boolean;
  duration: number;
  revealDuration: number;
  text: string;
  customIcon: string;
  // DisplayPromptCore specific props
  usePrompt: boolean;
  promptTheme: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  dismissible: boolean;
  promptTitle: string;
  promptContent: string;
  useAutoFocus: boolean;
  styleClassPassthrough: string[];
}

export default {
  title: "Components/UI/DisplayToast",
  component: StorybookComponent,
  argTypes: {
    // Appearance Config
    theme: {
      control: { type: "select" },
      options: ["primary", "secondary", "success", "warning", "error", "info"],
      description: "Toast theme/variant",
      table: {
        category: "Appearance",
      },
    },
    position: {
      control: { type: "select" },
      options: ["top", "bottom"],
      description: "Vertical position of toast",
      table: {
        category: "Appearance",
      },
    },
    alignment: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Horizontal alignment of toast",
      table: {
        category: "Appearance",
      },
    },
    fullWidth: {
      control: { type: "boolean" },
      description: "Whether toast spans full width",
      table: {
        category: "Appearance",
      },
    },
    // Behavior Config
    autoDismiss: {
      control: { type: "boolean" },
      description: "Auto dismiss toast after duration",
      table: {
        category: "Behavior",
      },
    },
    duration: {
      control: { type: "range", min: 1000, max: 10000, step: 500 },
      description: "Auto dismiss duration in milliseconds",
      table: {
        category: "Behavior",
      },
    },
    revealDuration: {
      control: { type: "range", min: 100, max: 1000, step: 50 },
      description: "Animation duration for reveal/hide",
      table: {
        category: "Behavior",
      },
    },
    // Content Config
    text: {
      control: { type: "text" },
      description: "Toast message text",
      table: {
        category: "Content",
      },
    },
    customIcon: {
      control: { type: "text" },
      description: "Custom icon name (e.g., 'akar-icons:check-box')",
      table: {
        category: "Content",
      },
    },
    // DisplayPromptCore Config
    usePrompt: {
      control: { type: "boolean" },
      description: "Use DisplayPromptCore instead of simple text",
      table: {
        category: "Prompt",
      },
    },
    promptTheme: {
      control: { type: "select" },
      options: ["primary", "secondary", "success", "warning", "error", "info"],
      description: "Theme for DisplayPromptCore",
      table: {
        category: "Prompt",
      },
    },
    dismissible: {
      control: { type: "boolean" },
      description: "Whether DisplayPromptCore is dismissible",
      table: {
        category: "Prompt",
      },
    },
    promptTitle: {
      control: { type: "text" },
      description: "Title for DisplayPromptCore",
      table: {
        category: "Prompt",
      },
    },
    promptContent: {
      control: { type: "text" },
      description: "Content for DisplayPromptCore",
      table: {
        category: "Prompt",
      },
    },
    useAutoFocus: {
      control: { type: "boolean" },
      description: "Auto focus DisplayPromptCore",
      table: {
        category: "Prompt",
      },
    },
    styleClassPassthrough: {
      control: { type: "object" },
      description: "Style classes for DisplayPromptCore (e.g., ['dark', 'outlined'])",
      table: {
        category: "Prompt",
      },
    },
    // Hide complex internal props
    config: {
      table: {
        disable: true,
      },
    },
    modelValue: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    theme: "primary",
    position: "top",
    alignment: "right",
    fullWidth: false,
    autoDismiss: false,
    duration: 3000,
    revealDuration: 300,
    text: "This is a toast notification message",
    customIcon: "",
    usePrompt: false,
    promptTheme: "primary",
    dismissible: true,
    promptTitle: "Prompt Title",
    promptContent: "This is prompt content, it can contain html or plain text.",
    useAutoFocus: false,
    styleClassPassthrough: ["dark", "outlined"],
  },
} as Meta<ToastStoryArgs>;

const Template: StoryFn<ToastStoryArgs> = (args) => ({
  components: {
    StorybookComponent,
  },
  setup() {
    const isActive = ref(false);

    // Auto-trigger toast for demo
    onMounted(() => {
      setTimeout(() => {
        isActive.value = true;
      }, 500);
    });

    return { args, isActive };
  },
  template: `
    <div style="position: relative; height: 200px; padding: 20px;">
      <p style="margin-bottom: 20px;">Toast will appear and demonstrate the configured behavior:</p>
      <p v-if="args.usePrompt" style="margin-bottom: 10px; font-style: italic; color: #666;">
        Note: DisplayPromptCore examples require component to be properly loaded in the environment.
      </p>
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
            fullWidth: args.fullWidth
          },
          behavior: {
            autoDismiss: args.autoDismiss,
            duration: args.duration,
            revealDuration: args.revealDuration
          },
          content: args.usePrompt ? {
            text: args.promptTitle + ': ' + args.promptContent
          } : {
            text: args.text,
            ...(args.customIcon && { customIcon: args.customIcon })
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
  text: "Success! Your action was completed.",
  customIcon: "akar-icons:check-box",
  autoDismiss: false,
  duration: 4000,
  position: "top",
  alignment: "right",
  fullWidth: false,
  revealDuration: 300,
};

export const ErrorToast = Template.bind({});
ErrorToast.args = {
  theme: "error",
  text: "Error! Something went wrong.",
  autoDismiss: false,
  position: "top",
  alignment: "center",
  fullWidth: false,
  duration: 3000,
  revealDuration: 300,
  customIcon: "",
};

export const BottomCenterToast = Template.bind({});
BottomCenterToast.args = {
  theme: "info",
  text: "Info message at bottom center",
  position: "bottom",
  alignment: "center",
  autoDismiss: false,
  duration: 5000,
  fullWidth: false,
  revealDuration: 300,
  customIcon: "",
};

export const FullWidthToast = Template.bind({});
FullWidthToast.args = {
  theme: "warning",
  text: "Full width warning message",
  fullWidth: true,
  position: "top",
  alignment: "left",
  autoDismiss: false,
  duration: 6000,
  revealDuration: 300,
  customIcon: "",
};

// DisplayPromptCore Examples - Based on Playground
export const ErrorPromptToast = Template.bind({});
ErrorPromptToast.args = {
  theme: "error",
  position: "top",
  alignment: "right",
  fullWidth: false,
  autoDismiss: false,
  duration: 5000,
  revealDuration: 300,
  usePrompt: true,
  promptTheme: "error",
  dismissible: false,
  promptTitle: "Error Prompt Title with content",
  promptContent: "This is an error prompt content, it can contain html or plain text.",
  useAutoFocus: false,
  styleClassPassthrough: ["dark", "outlined"],
};

export const SuccessPromptToast = Template.bind({});
SuccessPromptToast.args = {
  theme: "success",
  position: "top",
  alignment: "right",
  fullWidth: false,
  autoDismiss: false,
  duration: 3000,
  revealDuration: 300,
  usePrompt: true,
  promptTheme: "success",
  dismissible: true,
  promptTitle: "Success Prompt Title with content (Dismissible)",
  promptContent: "This is success prompt content, it can contain html or plain text.",
  useAutoFocus: true,
  styleClassPassthrough: ["dark", "outlined"],
};

export const InfoPromptFullWidth = Template.bind({});
InfoPromptFullWidth.args = {
  theme: "info",
  position: "top",
  alignment: "center",
  fullWidth: true,
  autoDismiss: false,
  duration: 4000,
  revealDuration: 300,
  usePrompt: true,
  promptTheme: "info",
  dismissible: false,
  promptTitle: "Info Prompt Title with content (Auto Dismiss)",
  promptContent: "This is info prompt content displayed full width.",
  useAutoFocus: false,
  styleClassPassthrough: ["dark", "outlined"],
};

export const WarningPromptBottomCenter = Template.bind({});
WarningPromptBottomCenter.args = {
  theme: "warning",
  position: "bottom",
  alignment: "center",
  fullWidth: false,
  autoDismiss: false,
  duration: 6000,
  revealDuration: 300,
  usePrompt: true,
  promptTheme: "warning",
  dismissible: true,
  promptTitle: "Warning Prompt at Bottom Center",
  promptContent: "This warning prompt appears at the bottom center with auto dismiss.",
  useAutoFocus: false,
  styleClassPassthrough: ["outlined"],
};

export const PrimaryPromptCustomStyles = Template.bind({});
PrimaryPromptCustomStyles.args = {
  theme: "primary",
  position: "top",
  alignment: "left",
  fullWidth: false,
  autoDismiss: false,
  duration: 3000,
  revealDuration: 500,
  usePrompt: true,
  promptTheme: "primary",
  dismissible: true,
  promptTitle: "Primary Prompt with Custom Styles",
  promptContent: "This prompt uses custom style configurations and slower reveal animation.",
  useAutoFocus: false,
  styleClassPassthrough: ["dark"],
};
