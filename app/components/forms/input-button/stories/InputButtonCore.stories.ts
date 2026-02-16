import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputButtonCore.vue";

interface InputButtonCoreStoryArgs {
  type: "submit" | "button" | "reset";
  theme: "default" | "success" | "error" | "warning";
  inputVariant: "primary" | "secondary" | "tertiary" | "inline";
  buttonText: string;
  styleClassPassthrough: string[];
  isPending: boolean;
  hasPendingEffect: boolean;
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
    inputVariant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "inline"],
      description: "Button variant/style",
      table: {
        category: "Styling",
      },
    },
    isPill: {
      control: "boolean",
      description: "Whether button has pill shape",
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
    inputVariant: "primary",
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
    };
  },
  template: `
    <div class="space-y-4">
      <StorybookComponent
        v-bind="args"
        @click="handleClick"
      >
        <template v-if="args.useLeftSlot || args.useLeftIcon" #left>
          <Icon v-if="args.useLeftIcon" :name="args.leftIconName" class="icon" />
          <span v-else>{{ args.leftSlotContent }}</span>
        </template>
        <template v-if="args.useRightSlot || args.useRightIcon" #right>
          <Icon v-if="args.useRightIcon" :name="args.rightIconName" class="icon" />
          <span v-else>{{ args.rightSlotContent }}</span>
        </template>
        <template v-if="args.useIconOnlySlot || args.useIconOnly" #iconOnly>
          <Icon v-if="args.useIconOnly" :name="args.iconOnlyName" class="icon" />
          <span v-else>{{ args.iconOnlyContent }}</span>
        </template>
      </StorybookComponent>
      <div class="mbs-40">
        Click count: {{ clickCount }}
      </div>
    </div>
  `,
});

export const ButtonTextOnly = Template.bind({});
ButtonTextOnly.args = {
  buttonText: "Button Text Only",
  inputVariant: "primary",
  useLeftSlot: false,
  useRightSlot: false,
};

export const WithBothEmojiIcons = Template.bind({});
WithBothEmojiIcons.args = {
  buttonText: "With Both Emoji Icons",
  inputVariant: "primary",
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "💸",
  rightSlotContent: "✅",
};

export const WithBothNuxtIconComponents = Template.bind({});
WithBothNuxtIconComponents.args = {
  buttonText: "With Both Nuxt Icon Components",
  inputVariant: "primary",
  useLeftIcon: true,
  useRightIcon: true,
  leftIconName: "mdi:arrow-left",
  rightIconName: "mdi:arrow-right",
};

export const EmojiIconOnly = Template.bind({});
EmojiIconOnly.args = {
  buttonText: "Emoji Icon Only Button",
  inputVariant: "tertiary",
  useIconOnlySlot: true,
  iconOnlyContent: "⚡",
};

export const NuxtIconOnlyComponent = Template.bind({});
NuxtIconOnlyComponent.args = {
  buttonText: "Nuxt Icon Only Button",
  inputVariant: "tertiary",
  useIconOnly: true,
  iconOnlyName: "mdi:chevron-right-circle-outline",
};
