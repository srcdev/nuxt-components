import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../ToggleSwitchCore.vue";
import type { FormTheme, FormSize } from "~/types/forms/types.forms.d";

interface ToggleSwitchCoreStoryArgs {
  id: string;
  name: string;
  required: boolean;
  fieldHasError: boolean;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  styleClassPassthrough: string[];
  theme: FormTheme;
  round: boolean;
  size: FormSize;
  ariaDescribedby: string;
  useCustomIcons: boolean;
  iconOnContent: string;
  iconOffContent: string;
}

export default {
  title: "Components/Forms/Toggle Switch/ToggleSwitchCore",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    id: {
      control: "text",
      description: "Unique identifier for the toggle switch",
      table: {
        category: "Basic",
      },
    },
    name: {
      control: "text",
      description: "Name attribute for the toggle switch",
      table: {
        category: "Basic",
      },
    },
    required: {
      control: "boolean",
      description: "Whether the toggle switch is required",
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

    // States
    fieldHasError: {
      control: "boolean",
      description: "Whether the field is in error state",
      table: {
        category: "States",
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

    // Accessibility
    ariaDescribedby: {
      control: "text",
      description: "aria-describedby attribute",
      table: {
        category: "Accessibility",
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
} as Meta<ToggleSwitchCoreStoryArgs>;

const Template: StoryFn<ToggleSwitchCoreStoryArgs> = (_args, { argTypes }) => ({
  components: { StorybookComponent },
  props: Object.keys(argTypes),
  setup() {
    const modelValue = ref(false);
    return { args: _args, modelValue };
  },
  template: `
    <StorybookComponent
      v-model="modelValue"
      :id="args.id"
      :name="args.name"
      :required="args.required"
      :field-has-error="args.fieldHasError"
      :true-value="args.trueValue"
      :false-value="args.falseValue"
      :style-class-passthrough="args.styleClassPassthrough"
      :theme="args.theme"
      :round="args.round"
      :size="args.size"
      :aria-describedby="args.ariaDescribedby"
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
  id: "toggle-default",
  name: "toggleDefault",
  required: false,
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: [],
  theme: "primary",
  round: true,
  size: "default",
  ariaDescribedby: "",
  useCustomIcons: false,
  iconOnContent: "✓",
  iconOffContent: "✗",
};

export const WithCustomIcons = Template.bind({});
WithCustomIcons.args = {
  ...Default.args,
  id: "toggle-custom-icons",
  name: "toggleCustomIcons",
  useCustomIcons: true,
  iconOnContent:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',
  iconOffContent:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...Default.args,
  id: "toggle-error",
  name: "toggleError",
  fieldHasError: true,
  theme: "error",
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  id: "toggle-required",
  name: "toggleRequired",
  required: true,
};

export const SquareShape = Template.bind({});
SquareShape.args = {
  ...Default.args,
  id: "toggle-square",
  name: "toggleSquare",
  round: false,
};

export const StringValues = Template.bind({});
StringValues.args = {
  ...Default.args,
  id: "toggle-string-values",
  name: "toggleStringValues",
  trueValue: "enabled",
  falseValue: "disabled",
};

export const NumericValues = Template.bind({});
NumericValues.args = {
  ...Default.args,
  id: "toggle-numeric-values",
  name: "toggleNumericValues",
  trueValue: 1,
  falseValue: 0,
};
