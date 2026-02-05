import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputButtonCore.vue";
import type { FormTheme, FormSize, FormWeight } from "~/types/forms/types.forms.d";

interface InputButtonCoreStoryArgs {
  type: "submit" | "button" | "reset";
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
  useLeftSlot: boolean;
  useRightSlot: boolean;
  useIconOnlySlot: boolean;
  leftSlotContent: string;
  rightSlotContent: string;
  iconOnlyContent: string;
}

export default {
  title: "Components/Forms/Input Button/InputButtonCore",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
      description: "Button type attribute",
      table: {
        category: "Basic",
      },
    },
    buttonText: {
      control: "text",
      description: "Button text content",
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
      options: [
        "primary",
        "secondary",
        "tertiary",
        "ghost",
        "error",
        "success",
        "warning",
        "input-action",
        "input-action-underlined",
      ],
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

    // Slots
    useLeftSlot: {
      control: "boolean",
      description: "Use left icon slot",
      table: {
        category: "Slots",
      },
    },
    useRightSlot: {
      control: "boolean",
      description: "Use right icon slot",
      table: {
        category: "Slots",
      },
    },
    useIconOnlySlot: {
      control: "boolean",
      description: "Use icon-only slot (hides text)",
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
    iconOnlyContent: {
      control: "text",
      description: "Content for icon-only slot",
      table: {
        category: "Slots",
      },
    },
  },
  args: {
    type: "button",
    size: "default",
    weight: "wght-400",
    theme: "primary",
    buttonText: "Click me",
    dataTestid: "",
    styleClassPassthrough: [],
    useEffect: false,
    effect: "fancy",
    isPending: false,
    readonly: false,
    useLeftSlot: false,
    useRightSlot: false,
    useIconOnlySlot: false,
    leftSlotContent: "👈",
    rightSlotContent: "👉",
    iconOnlyContent: "⚡",
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<InputButtonCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const clickCount = ref(0);

    const handleClick = () => {
      if (!args.readonly) {
        clickCount.value++;
      }
    };

    return {
      args,
      clickCount,
      handleClick,
      leftSlotContent: args.leftSlotContent,
      rightSlotContent: args.rightSlotContent,
      iconOnlyContent: args.iconOnlyContent,
      useLeftSlot: args.useLeftSlot,
      useRightSlot: args.useRightSlot,
      useIconOnlySlot: args.useIconOnlySlot,
    };
  },
  template: `
    <div class="space-y-4">
      <StorybookComponent
        v-bind="args"
        @click="handleClick"
      >
        <template v-if="useLeftSlot" #left>{{ leftSlotContent }}</template>
        <template v-if="useRightSlot" #right>{{ rightSlotContent }}</template>
        <template v-if="useIconOnlySlot" #iconOnly>{{ iconOnlyContent }}</template>
      </StorybookComponent>
      <div class="text-sm text-gray-600">
        Click count: {{ clickCount }}
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const Primary = Template.bind({});
Primary.args = {
  theme: "primary",
  buttonText: "Primary Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  theme: "secondary",
  buttonText: "Secondary Button",
};

export const Success = Template.bind({});
Success.args = {
  theme: "success",
  buttonText: "Success Button",
};

export const Error = Template.bind({});
Error.args = {
  theme: "error",
  buttonText: "Error Button",
};

export const Ghost = Template.bind({});
Ghost.args = {
  theme: "ghost",
  buttonText: "Ghost Button",
};

export const WithLeftIcon = Template.bind({});
WithLeftIcon.args = {
  buttonText: "Save Document",
  useLeftSlot: true,
  leftSlotContent: "💾",
};

export const WithRightIcon = Template.bind({});
WithRightIcon.args = {
  buttonText: "Continue",
  useRightSlot: true,
  rightSlotContent: "→",
};

export const WithBothIcons = Template.bind({});
WithBothIcons.args = {
  buttonText: "Transfer",
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "💸",
  rightSlotContent: "✅",
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  buttonText: "Icon Only Button",
  useIconOnlySlot: true,
  iconOnlyContent: "⚡",
};

export const SubmitButton = Template.bind({});
SubmitButton.args = {
  type: "submit",
  theme: "primary",
  buttonText: "Submit Form",
  useRightSlot: true,
  rightSlotContent: "📤",
};

export const ResetButton = Template.bind({});
ResetButton.args = {
  type: "reset",
  theme: "ghost",
  buttonText: "Reset",
  useLeftSlot: true,
  leftSlotContent: "🔄",
};

export const ReadonlyButton = Template.bind({});
ReadonlyButton.args = {
  readonly: true,
  buttonText: "Readonly Button",
  theme: "primary",
};

export const PendingButton = Template.bind({});
PendingButton.args = {
  isPending: true,
  buttonText: "Loading...",
  theme: "primary",
};

export const WithFancyEffect = Template.bind({});
WithFancyEffect.args = {
  useEffect: true,
  effect: "fancy",
  buttonText: "Fancy Button",
  theme: "primary",
};

export const WithPulseEffect = Template.bind({});
WithPulseEffect.args = {
  useEffect: true,
  effect: "pulse",
  buttonText: "Pulse Button",
  theme: "success",
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  buttonText: "Large Button",
  theme: "primary",
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  buttonText: "Small Button",
  theme: "primary",
};

export const BoldText = Template.bind({});
BoldText.args = {
  weight: "wght-700",
  buttonText: "Bold Button",
  theme: "primary",
};

export const AllThemes = Template.bind({});
AllThemes.storyName = "All Themes";
AllThemes.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const themes = ["primary", "secondary", "tertiary", "ghost", "success", "warning", "error", "input-action"];

    return {
      themes,
      args,
    };
  },
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="theme in themes" :key="theme" class="space-y-2">
        <h4 class="text-sm font-medium capitalize">{{ theme }}</h4>
        <StorybookComponent
          v-bind="{ ...args, theme, buttonText: theme }"
        />
      </div>
    </div>
  `,
});

export const AllSizes = Template.bind({});
AllSizes.storyName = "All Sizes";
AllSizes.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const sizes = ["x-small", "small", "default", "medium", "large"];

    return {
      sizes,
      args,
    };
  },
  template: `
    <div class="flex flex-wrap items-end gap-4">
      <div v-for="size in sizes" :key="size" class="space-y-2">
        <h4 class="text-sm font-medium capitalize">{{ size }}</h4>
        <StorybookComponent
          v-bind="{ ...args, size, buttonText: size }"
        />
      </div>
    </div>
  `,
});

export const ButtonTypes = Template.bind({});
ButtonTypes.storyName = "Button Types";
ButtonTypes.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    const types = [
      { type: "button", text: "Button", theme: "primary" },
      { type: "submit", text: "Submit", theme: "success" },
      { type: "reset", text: "Reset", theme: "ghost" },
    ];

    return {
      types,
      args,
    };
  },
  template: `
    <div class="flex gap-4">
      <div v-for="buttonType in types" :key="buttonType.type" class="space-y-2">
        <h4 class="text-sm font-medium capitalize">{{ buttonType.type }}</h4>
        <StorybookComponent
          v-bind="{ ...args, type: buttonType.type, buttonText: buttonType.text, theme: buttonType.theme }"
        />
      </div>
    </div>
  `,
});
