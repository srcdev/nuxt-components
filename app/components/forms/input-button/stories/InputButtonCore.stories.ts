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
      options: ["default", "success", "error", "warning"],
      description: "Button theme",
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
    hasPendingEffect: {
      control: "boolean",
      description: "Enable pending effect",
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
    theme: "default",
    buttonText: "Click me",
    styleClassPassthrough: [],
    isPending: false,
    hasPendingEffect: false,
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
      <div class="mbs-40">
        Click count: {{ clickCount }}
      </div>
    </div>
  `,
});

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
  // leftSlotContent: '<Icon name="mdi:arrow-left" class="icon" />',
  // rightSlotContent: '<Icon name="mdi:arrow-right" class="icon" />',
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  buttonText: "Icon Only Button",
  useIconOnlySlot: true,
  iconOnlyContent: "⚡",
};
