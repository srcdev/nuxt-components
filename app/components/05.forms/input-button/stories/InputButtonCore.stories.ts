import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputButtonCore.vue";
import InputTextCore from "../../input-text/InputTextCore.vue";

interface InputButtonCoreStoryArgs {
  type: "submit" | "button" | "reset";
  theme: "default" | "success" | "error" | "warning";
  variant: "primary" | "secondary" | "tertiary" | "inline";
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
    variant: {
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
    variant: "primary",
    buttonText: "Click me",
    styleClassPassthrough: [],
    isPending: false,
    hasPendingEffect: false,
    readonly: false,
    isPill: false, // Ensure isPill is present and defaulted
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
  // NOTE: In your InputButtonCore.vue component, ensure you do NOT destructure props in <script setup>.
  // Always use props.variant and props.isPill directly for reactivity.
  // Example:
  // const props = defineProps<{ variant: string; isPill: boolean; ... }>()
  // // Use props.variant, props.isPill in template and script.
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
    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;margin: 36px;">
      <!-- :key forces a remount when any slot-visibility arg changes. Verified the args
           themselves ARE reactive here (a plain {{ args.useLeftSlot }} interpolation updates
           live on toggle) — the bug is narrower: Vue's compiled-at-runtime string template
           doesn't reliably re-evaluate a <template v-if="..."> conditionally attached to a named
           slot when only the v-if's condition changes, on this component/Storybook combination.
           Toggling a control changed the fallthrough attribute (confirmed via useleftslot="true"
           in the rendered DOM) but never actually added/removed the slot content until a hard
           refresh. Remounting sidesteps whatever the underlying slot-stability quirk is, rather
           than chasing it further. -->
      <StorybookComponent
        :key="[args.useLeftSlot, args.useLeftIcon, args.useRightSlot, args.useRightIcon, args.useIconOnlySlot, args.useIconOnly].join(',')"
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

export const Default = Template.bind({});
Default.args = {
  buttonText: "Button Text Only",
  useLeftSlot: false,
  useRightSlot: false,
};

export const WithBothEmojiIcons = Template.bind({});
WithBothEmojiIcons.args = {
  buttonText: "With Both Emoji Icons",
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "💸",
  rightSlotContent: "✅",
};

export const WithBothNuxtIconComponents = Template.bind({});
WithBothNuxtIconComponents.args = {
  buttonText: "With Both Nuxt Icon Components",
  useLeftIcon: true,
  useRightIcon: true,
  leftIconName: "mdi:arrow-left",
  rightIconName: "mdi:arrow-right",
};

export const EmojiIconOnly = Template.bind({});
EmojiIconOnly.args = {
  buttonText: "Emoji Icon Only Button",
  useIconOnlySlot: true,
  iconOnlyContent: "⚡",
};

export const NuxtIconOnlyComponent = Template.bind({});
NuxtIconOnlyComponent.args = {
  buttonText: "Nuxt Icon Only Button",
  useIconOnly: true,
  iconOnlyName: "mdi:chevron-right-circle-outline",
};

// Composition check, not a props demo: confirms InputButtonCore's --button-min-height (defaults
// to var(--input-min-height)) actually keeps it height-aligned with an inline text input, the
// most common "usual suspect" pairing (e.g. newsletter signup, search bar). Textareas are the
// deliberate exception to this alignment and aren't part of this story.
const InlineTemplate: StoryFn = () => ({
  components: { StorybookComponent, InputTextCore },
  template: `
    <div style="margin: 36px; max-width: 480px;">
      <div style="display: flex; align-items: flex-start; gap: 0.8rem;">
        <InputTextCore
          id="inline-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          style="flex: 1;"
        />
        <StorybookComponent type="submit" variant="primary" button-text="Subscribe" />
      </div>
    </div>
  `,
});

export const InlineWithTextInput = InlineTemplate.bind({});
