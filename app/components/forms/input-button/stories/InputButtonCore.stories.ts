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
  leftIconName: string;
  rightIconName: string;
  iconOnlyName: string;
  useLeftIcon: boolean;
  useRightIcon: boolean;
  useIconOnly: boolean;
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

    // Icon Configuration
    useLeftIcon: {
      control: "boolean",
      description: "Use Icon component for left slot",
      table: {
        category: "Icons",
      },
    },
    leftIconName: {
      control: "text",
      description: "Icon name for left slot (e.g., 'mdi:arrow-left')",
      table: {
        category: "Icons",
      },
    },
    useRightIcon: {
      control: "boolean",
      description: "Use Icon component for right slot",
      table: {
        category: "Icons",
      },
    },
    rightIconName: {
      control: "text",
      description: "Icon name for right slot (e.g., 'mdi:arrow-right')",
      table: {
        category: "Icons",
      },
    },
    useIconOnly: {
      control: "boolean",
      description: "Use Icon component for icon-only slot",
      table: {
        category: "Icons",
      },
    },
    iconOnlyName: {
      control: "text",
      description: "Icon name for icon-only slot (e.g., 'mdi:flash')",
      table: {
        category: "Icons",
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
    useLeftIcon: false,
    useRightIcon: false,
    useIconOnly: false,
    leftIconName: "mdi:arrow-left",
    rightIconName: "mdi:arrow-right",
    iconOnlyName: "mdi:flash",
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
      useLeftIcon: args.useLeftIcon,
      useRightIcon: args.useRightIcon,
      useIconOnly: args.useIconOnly,
      leftIconName: args.leftIconName,
      rightIconName: args.rightIconName,
      iconOnlyName: args.iconOnlyName,
    };
  },
  template: `
    <div class="space-y-4">
      <StorybookComponent
        v-bind="args"
        @click="handleClick"
      >
        <template v-if="useLeftSlot || useLeftIcon" #left>
          <Icon v-if="useLeftIcon" :name="leftIconName" class="icon" />
          <span v-else>{{ leftSlotContent }}</span>
        </template>
        <template v-if="useRightSlot || useRightIcon" #right>
          <Icon v-if="useRightIcon" :name="rightIconName" class="icon" />
          <span v-else>{{ rightSlotContent }}</span>
        </template>
        <template v-if="useIconOnlySlot || useIconOnly" #iconOnly>
          <Icon v-if="useIconOnly" :name="iconOnlyName" class="icon" />
          <span v-else>{{ iconOnlyContent }}</span>
        </template>
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

export const WithLeftIconComponent = Template.bind({});
WithLeftIconComponent.args = {
  buttonText: "Save Document",
  useLeftIcon: true,
  leftIconName: "mdi:content-save",
};

export const WithRightIcon = Template.bind({});
WithRightIcon.args = {
  buttonText: "Continue",
  useRightSlot: true,
  rightSlotContent: "→",
};

export const WithRightIconComponent = Template.bind({});
WithRightIconComponent.args = {
  buttonText: "Continue",
  useRightIcon: true,
  rightIconName: "mdi:arrow-right",
};

export const WithBothIcons = Template.bind({});
WithBothIcons.args = {
  buttonText: "Transfer",
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "💸",
  rightSlotContent: "✅",
};

export const WithBothIconComponents = Template.bind({});
WithBothIconComponents.args = {
  buttonText: "Navigate",
  useLeftIcon: true,
  useRightIcon: true,
  leftIconName: "mdi:arrow-left",
  rightIconName: "mdi:arrow-right",
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  buttonText: "Icon Only Button",
  useIconOnlySlot: true,
  iconOnlyContent: "⚡",
};

export const IconOnlyComponent = Template.bind({});
IconOnlyComponent.args = {
  buttonText: "Icon Only Button",
  useIconOnly: true,
  iconOnlyName: "mdi:flash",
};
