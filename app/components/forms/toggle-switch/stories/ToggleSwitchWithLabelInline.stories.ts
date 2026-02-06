import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../variants/ToggleSwitchWithLabelInline.vue";
import type { FormTheme, FormSize, LabelWeight } from "~/types/forms/types.forms.d";

interface ToggleSwitchWithLabelInlineStoryArgs {
  name: string;
  label: string;
  labelWeight: LabelWeight;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  styleClassPassthrough: string[];
  theme: FormTheme;
  round: boolean;
  size: FormSize;
  useCustomIcons: boolean;
  iconOnContent: string;
  iconOffContent: string;
}

export default {
  title: "Components/Forms/Toggle Switch/ToggleSwitchWithLabelInline",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    name: {
      control: "text",
      description: "Name attribute for the toggle switch",
      table: {
        category: "Basic",
      },
    },
    label: {
      control: "text",
      description: "Label text for the toggle switch",
      table: {
        category: "Basic",
      },
    },
    labelWeight: {
      control: { type: "select" },
      options: ["normal", "semi-bold", "bold"],
      description: "Font weight for the label",
      table: {
        category: "Basic",
      },
    },

    // Values
    trueValue: {
      control: "text",
      description: "Value when toggle is on/checked",
      table: {
        category: "Values",
      },
    },
    falseValue: {
      control: "text",
      description: "Value when toggle is off/unchecked",
      table: {
        category: "Values",
      },
    },

    // Styling
    theme: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "ghost", "error", "success", "warning"],
      description: "Toggle switch theme",
      table: {
        category: "Styling",
      },
    },
    size: {
      control: { type: "select" },
      options: ["x-small", "small", "default", "medium", "large"],
      description: "Toggle switch size",
      table: {
        category: "Styling",
      },
    },
    round: {
      control: "boolean",
      description: "Whether the toggle switch is rounded",
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

    // Icons
    useCustomIcons: {
      control: "boolean",
      description: "Use custom icons instead of default",
      table: {
        category: "Icons",
      },
    },
    iconOnContent: {
      control: "text",
      description: "Content for the 'on' icon slot",
      table: {
        category: "Icons",
      },
    },
    iconOffContent: {
      control: "text",
      description: "Content for the 'off' icon slot",
      table: {
        category: "Icons",
      },
    },
  },
} as Meta<ToggleSwitchWithLabelInlineStoryArgs>;

const Template: StoryFn<ToggleSwitchWithLabelInlineStoryArgs> = (_args, { argTypes }) => ({
  components: { StorybookComponent },
  props: Object.keys(argTypes),
  setup() {
    const modelValue = ref(false);
    return { args: _args, modelValue };
  },
  template: `
    <StorybookComponent
      v-model="modelValue"
      :name="args.name"
      :label="args.label"
      :label-weight="args.labelWeight"
      :true-value="args.trueValue"
      :false-value="args.falseValue"
      :style-class-passthrough="args.styleClassPassthrough"
      :theme="args.theme"
      :round="args.round"
      :size="args.size"
    >
      <template v-if="args.useCustomIcons" #iconOn>
        <span v-html="args.iconOnContent"></span>
      </template>
      <template v-if="args.useCustomIcons" #iconOff>
        <span v-html="args.iconOffContent"></span>
      </template>
    </StorybookComponent>
    <div style="margin-top: 1rem; font-size: 0.875rem; color: #666;">
      Current value: {{ modelValue }}
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  name: "toggleInline",
  label: "Enable notifications",
  labelWeight: "normal",
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: [],
  theme: "primary",
  round: true,
  size: "default",
  useCustomIcons: false,
  iconOnContent: "✓",
  iconOffContent: "✗",
};

export const WithCustomIcons = Template.bind({});
WithCustomIcons.args = {
  ...Default.args,
  name: "toggleInlineCustomIcons",
  label: "Dark mode",
  useCustomIcons: true,
  iconOnContent:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
  iconOffContent:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>',
};

export const BoldLabel = Template.bind({});
BoldLabel.args = {
  ...Default.args,
  name: "toggleInlineBold",
  label: "Important setting",
  labelWeight: "bold",
};

export const SemiBoldLabel = Template.bind({});
SemiBoldLabel.args = {
  ...Default.args,
  name: "toggleInlineSemiBold",
  label: "Feature toggle",
  labelWeight: "semi-bold",
};

export const StringValues = Template.bind({});
StringValues.args = {
  ...Default.args,
  name: "toggleInlineStringValues",
  label: "Email preferences",
  trueValue: "enabled",
  falseValue: "disabled",
};

export const InlineFormExample: StoryFn = () => ({
  components: { StorybookComponent },
  setup() {
    const preferences = ref({
      notifications: true,
      autoSave: false,
      darkMode: true,
      soundEffects: false,
      showTips: true,
    });

    const handleReset = () => {
      Object.keys(preferences.value).forEach((key) => {
        preferences.value[key as keyof typeof preferences.value] = false;
      });
    };

    const handleSelectAll = () => {
      Object.keys(preferences.value).forEach((key) => {
        preferences.value[key as keyof typeof preferences.value] = true;
      });
    };

    return { preferences, handleReset, handleSelectAll };
  },
  template: `
    <div style="max-width: 400px; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
      <h3 style="margin: 0 0 1rem 0;">App Preferences</h3>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <StorybookComponent
          v-model="preferences.notifications"
          name="notifications"
          label="Push notifications"
          label-weight="semi-bold"
        />

        <StorybookComponent
          v-model="preferences.autoSave"
          name="autoSave"
          label="Auto-save documents"
          label-weight="normal"
        />

        <StorybookComponent
          v-model="preferences.darkMode"
          name="darkMode"
          label="Dark mode"
          label-weight="normal"
          theme="secondary"
        />

        <StorybookComponent
          v-model="preferences.soundEffects"
          name="soundEffects"
          label="Sound effects"
          label-weight="normal"
        />

        <StorybookComponent
          v-model="preferences.showTips"
          name="showTips"
          label="Show helpful tips"
          label-weight="normal"
          theme="success"
        />
      </div>

      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee; display: flex; gap: 0.5rem;">
        <button @click="handleSelectAll" type="button" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;">
          Select All
        </button>
        <button @click="handleReset" type="button" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;">
          Reset All
        </button>
      </div>

      <div style="margin-top: 1rem; font-size: 0.875rem; color: #666;">
        <strong>Current settings:</strong><br>
        <pre style="font-size: 0.75rem; background: #f5f5f5; padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem;">{{ JSON.stringify(preferences, null, 2) }}</pre>
      </div>
    </div>
  `,
});
