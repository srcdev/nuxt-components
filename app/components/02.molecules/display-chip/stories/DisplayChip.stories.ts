import { computed } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../DisplayChip.vue";
import type { DisplayChipConfig } from "~/types/components";

// Custom interface for story args
interface ChipStoryArgs {
  tag: "div" | "span";
  shape: "circle" | "square";
  chipSize: number;
  chipMaskWidth: number;
  chipOffset: number;
  chipAngle: number;
  icon: string;
  label: string;
  status: "offline" | "online" | "idle" | "dnd";
  useSlot: boolean;
  slotContent: string;
  styleClassPassthrough: string[];
}

export default {
  title: "Components/UI/DisplayChip",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    tag: {
      control: { type: "select" },
      options: ["div", "span"],
      description: "HTML tag to render",
      table: {
        category: "Basic",
      },
    },
    shape: {
      control: { type: "select" },
      options: ["circle", "square"],
      description: "Shape of the parent element for chip positioning",
      table: {
        category: "Basic",
      },
    },
    // Chip Configuration
    chipSize: {
      control: { type: "range", min: 8, max: 32, step: 1 },
      description: "Size of the chip in pixels",
      table: {
        category: "Chip Configuration",
      },
    },
    chipMaskWidth: {
      control: { type: "range", min: 0, max: 12, step: 1 },
      description: "Width of the chip mask/border in pixels",
      table: {
        category: "Chip Configuration",
      },
    },
    chipOffset: {
      control: { type: "range", min: -20, max: 20, step: 1 },
      description: "Offset of the chip from the edge in pixels",
      table: {
        category: "Chip Configuration",
      },
    },
    chipAngle: {
      control: { type: "range", min: 0, max: 360, step: 15 },
      description: "Angle of the chip position around the element in degrees",
      table: {
        category: "Chip Configuration",
      },
    },
    // Chip Content
    icon: {
      control: { type: "text" },
      description: "Icon name to display in the chip (e.g., 'mdi:account')",
      table: {
        category: "Content",
      },
    },
    label: {
      control: { type: "text" },
      description: "Text label to display in the chip (max 3 characters)",
      table: {
        category: "Content",
      },
    },
    status: {
      control: { type: "select" },
      options: ["offline", "online", "idle", "dnd"],
      description: "Status color for the chip",
      table: {
        category: "Appearance",
      },
    },
    // Slot Configuration
    useSlot: {
      control: { type: "boolean" },
      description: "Whether to use slot content",
      table: {
        category: "Slot",
      },
    },
    slotContent: {
      control: { type: "text" },
      description: "Content to display in the default slot",
      table: {
        category: "Slot",
      },
    },
    // Hide complex props from controls
    config: {
      table: {
        disable: true,
      },
    },
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    tag: "div",
    shape: "circle",
    chipSize: 12,
    chipMaskWidth: 4,
    chipOffset: 0,
    chipAngle: 45,
    icon: "",
    label: "",
    status: "offline",
    useSlot: true,
    slotContent: "SRC",
    styleClassPassthrough: [],
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<ChipStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const chipConfig = computed(
      (): DisplayChipConfig => ({
        size: `${args.chipSize}px`,
        maskWidth: `${args.chipMaskWidth}px`,
        offset: `${args.chipOffset}px`,
        angle: `${args.chipAngle}deg`,
        icon: args.icon || undefined,
        label: args.label || undefined,
      })
    );

    const classes = computed(() => [...(args.styleClassPassthrough || []), args.status]);

    return { args, chipConfig, classes };
  },
  template: `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
      <StorybookComponent
        :tag="args.tag"
        :shape="args.shape"
        :config="chipConfig"
        :style-class-passthrough="classes"
      >
        <template v-if="args.useSlot" #default>
          <div :style="{
            width: '50px',
            height: '50px',
            background: '#64748b',
            borderRadius: args.shape === 'circle' ? '50%' : '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            fontWeight: '600',
            fontSize: '1.3rem',
            fontFamily: 'sans-serif',
          }">{{ args.slotContent }}</div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

// Default Story
export const Default = Template.bind({});
Default.args = {
  status: "online",
  label: "5",
};

// Icon Chip
export const WithIcon = Template.bind({});
WithIcon.args = {
  status: "online",
  icon: "mdi:check",
};

// Different Statuses
export const OnlineStatus = Template.bind({});
OnlineStatus.args = {
  status: "online",
  label: "●",
};

export const IdleStatus = Template.bind({});
IdleStatus.args = {
  status: "idle",
  label: "⏸",
};

export const DoNotDisturbStatus = Template.bind({});
DoNotDisturbStatus.args = {
  status: "dnd",
  label: "✕",
};

export const OfflineStatus = Template.bind({});
OfflineStatus.args = {
  status: "offline",
  label: "○",
};

// Different Positions
export const TopRight = Template.bind({});
TopRight.args = {
  status: "online",
  chipAngle: 45,
  label: "TR",
};

export const TopLeft = Template.bind({});
TopLeft.args = {
  status: "online",
  chipAngle: 315,
  label: "TL",
};

export const BottomRight = Template.bind({});
BottomRight.args = {
  status: "online",
  chipAngle: 135,
  label: "BR",
};

export const BottomLeft = Template.bind({});
BottomLeft.args = {
  status: "online",
  chipAngle: 225,
  label: "BL",
};

// Different Sizes
export const SmallChip = Template.bind({});
SmallChip.args = {
  status: "online",
  chipSize: 8,
  label: "S",
};

export const LargeChip = Template.bind({});
LargeChip.args = {
  status: "online",
  chipSize: 20,
  label: "L",
};

// Square Shape
export const SquareShape = Template.bind({});
SquareShape.args = {
  shape: "square",
  status: "online",
  label: "□",
};

// With Offset
export const WithOffset = Template.bind({});
WithOffset.args = {
  status: "online",
  chipOffset: 10,
  label: "10",
};

// Multiple Chips Demo
const MultipleChipsTemplate: StoryFn<ChipStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="display: flex; gap: 40px; align-items: center; justify-content: center; height: 100vh; flex-wrap: wrap;">
      <StorybookComponent
        :config="{ size: '12px', maskWidth: '4px', offset: '0px', angle: '45deg', label: '5' }"
        :style-class-passthrough="['online']"
      >
        <div style="width: 50px; height: 50px; background: #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f8fafc; font-weight: 600; font-size: 1.3rem; font-family: sans-serif;">SRC</div>
      </StorybookComponent>

      <StorybookComponent
        :config="{ size: '10px', maskWidth: '3px', offset: '2px', angle: '315deg', icon: 'mdi:pause' }"
        :style-class-passthrough="['idle']"
      >
        <div style="width: 50px; height: 50px; background: #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f8fafc; font-weight: 600; font-size: 1.3rem; font-family: sans-serif;">SRC</div>
      </StorybookComponent>

      <StorybookComponent
        shape="square"
        :config="{ size: '14px', maskWidth: '2px', offset: '-5px', angle: '135deg', label: 'DND' }"
        :style-class-passthrough="['dnd']"
      >
        <div style="width: 50px; height: 50px; background: #64748b; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #f8fafc; font-weight: 600; font-size: 1.3rem; font-family: sans-serif;">SRC</div>
      </StorybookComponent>

      <StorybookComponent
        :config="{ size: '16px', maskWidth: '6px', offset: '8px', angle: '90deg' }"
        :style-class-passthrough="['offline']"
      >
        <div style="width: 50px; height: 50px; background: #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f8fafc; font-weight: 600; font-size: 1.3rem; font-family: sans-serif;">SRC</div>
      </StorybookComponent>
    </div>
  `,
});

export const MultipleChips = MultipleChipsTemplate.bind({});
MultipleChips.parameters = {
  docs: {
    description: {
      story: "Examples of multiple chips with different configurations and statuses.",
    },
  },
};
