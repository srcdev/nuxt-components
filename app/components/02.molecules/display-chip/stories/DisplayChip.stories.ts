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
  statusLabel: string;
  useSlot: boolean;
  slotContent: string;
  styleClassPassthrough: string[];
}

export default {
  title: "Molecules/DisplayChip",
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
      description: "Status colour for the chip dot",
      table: {
        category: "Appearance",
      },
    },
    statusLabel: {
      control: { type: "text" },
      description: "Screen-reader text for the status (e.g. 'Online'), so it isn't conveyed by colour alone",
      table: {
        category: "Accessibility",
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
    statusLabel: "",
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

    const classes = computed(() => args.styleClassPassthrough || []);

    return { args, chipConfig, classes };
  },
  template: `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
      <StorybookComponent
        :tag="args.tag"
        :shape="args.shape"
        :config="chipConfig"
        :status="args.status"
        :status-label="args.statusLabel"
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
        status="online"
      >
        <div style="width: 50px; height: 50px; background: #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f8fafc; font-weight: 600; font-size: 1.3rem; font-family: sans-serif;">SRC</div>
      </StorybookComponent>

      <StorybookComponent
        :config="{ size: '10px', maskWidth: '3px', offset: '2px', angle: '315deg', icon: 'mdi:pause' }"
        status="idle"
      >
        <div style="width: 50px; height: 50px; background: #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f8fafc; font-weight: 600; font-size: 1.3rem; font-family: sans-serif;">SRC</div>
      </StorybookComponent>

      <StorybookComponent
        shape="square"
        :config="{ size: '14px', maskWidth: '2px', offset: '-5px', angle: '135deg', label: 'DND' }"
        status="dnd"
      >
        <div style="width: 50px; height: 50px; background: #64748b; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #f8fafc; font-weight: 600; font-size: 1.3rem; font-family: sans-serif;">SRC</div>
      </StorybookComponent>

      <StorybookComponent
        :config="{ size: '16px', maskWidth: '6px', offset: '8px', angle: '90deg' }"
        status="offline"
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

const hostStyle = (shape: "circle" | "square", size = 50) =>
  `width: ${size}px; height: ${size}px; background: #64748b; border-radius: ${shape === "circle" ? "50%" : "4px"}; display: flex; align-items: center; justify-content: center; color: #f8fafc; font: 600 1.3rem sans-serif;`;

const stressChips: Array<{
  key: string;
  caption: string;
  shape?: "circle" | "square";
  status?: ChipStoryArgs["status"];
  config?: DisplayChipConfig;
  hostSize?: number;
  hostText?: string;
  brokenImage?: boolean;
  noSlot?: boolean;
  dir?: "rtl";
}> = [
  { key: "family", caption: "ZWJ family emoji (one grapheme)", status: "online", config: { size: "18px", angle: "45deg", label: "👨‍👩‍👧‍👦" } },
  { key: "flags", caption: "4 flags, truncated to 3", status: "idle", config: { size: "20px", angle: "45deg", label: "🇬🇧🇺🇸🇫🇷🇩🇪" } },
  { key: "count", caption: '"999+", truncated to "999"', status: "dnd", config: { size: "18px", angle: "45deg", label: "999+" } },
  { key: "wide", caption: '"WWW" (widest glyphs)', status: "online", config: { size: "16px", angle: "45deg", label: "WWW" } },
  { key: "html", caption: "HTML-like label", status: "dnd", config: { size: "18px", angle: "45deg", label: "<b>" } },
  { key: "rtl", caption: "Arabic label in an RTL wrapper", status: "online", dir: "rtl", config: { size: "18px", angle: "45deg", label: "مرحبا" } },
  { key: "whitespace", caption: "Whitespace-only label (no label)", status: "idle", config: { size: "14px", angle: "45deg", label: "   " } },
  { key: "partial", caption: "Config with only a label (geometry from defaults)", status: "online", config: { label: "5" } },
  { key: "empty-config", caption: "Empty config object", status: "dnd", config: {} },
  { key: "zero", caption: "size 0px (no dot)", status: "online", config: { size: "0px", angle: "45deg" } },
  { key: "negative", caption: "size -10px, mask -4px (clamped to 0)", status: "online", config: { size: "-10px", maskWidth: "-4px", angle: "45deg" } },
  { key: "huge", caption: "size 64px on a 50px host", status: "idle", config: { size: "64px", angle: "45deg", label: "9" } },
  { key: "angles", caption: "angle -45deg, offset 40px", status: "online", config: { size: "12px", angle: "-45deg", offset: "40px" } },
  { key: "wrap", caption: "angle 720deg, offset -30px (square)", shape: "square", status: "dnd", config: { size: "12px", angle: "720deg", offset: "-30px" } },
  { key: "invalid", caption: "Invalid units: size 'abc', angle '45'", status: "online", config: { size: "abc", angle: "45" } },
  { key: "broken-icon", caption: "Broken icon name", status: "online", config: { size: "16px", angle: "45deg", icon: "not-a-real-set:missing" } },
  { key: "tiny-host", caption: "8px host", status: "online", hostSize: 8, config: { size: "6px", maskWidth: "1px", angle: "45deg" } },
  { key: "big-host", caption: "200px host, long host text", status: "online", hostSize: 200, hostText: "Donaudampfschifffahrtsgesellschaft", config: { size: "24px", angle: "135deg", label: "!" } },
  { key: "broken-image", caption: "Broken image as host", status: "idle", brokenImage: true, config: { size: "12px", angle: "45deg" } },
  { key: "no-slot", caption: "No slot content", status: "online", noSlot: true, config: { size: "12px", angle: "45deg" } },
];

export const StressTest: StoryFn<ChipStoryArgs> = () => ({
  components: { StorybookComponent },
  setup() {
    return { stressChips, hostStyle };
  },
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 4.8rem 2.4rem; padding: 4rem 2rem; font: 1.2rem sans-serif;">
      <figure
        v-for="chip in stressChips"
        :key="chip.key"
        :dir="chip.dir"
        style="margin: 0; display: grid; justify-items: center; align-content: start; gap: 1.6rem; min-inline-size: 0;"
      >
        <StorybookComponent :shape="chip.shape ?? 'circle'" :status="chip.status" :config="chip.config" status-label="Status">
          <template v-if="!chip.noSlot" #default>
            <img
              v-if="chip.brokenImage"
              src="/does-not-exist.jpg"
              alt="Broken avatar"
              width="50"
              height="50"
              :style="hostStyle(chip.shape ?? 'circle')"
            />
            <div v-else :style="hostStyle(chip.shape ?? 'circle', chip.hostSize)">
              <span style="overflow-wrap: anywhere; text-align: center;">{{ chip.hostText ?? (chip.hostSize && chip.hostSize < 20 ? "" : "SRC") }}</span>
            </div>
          </template>
        </StorybookComponent>
        <figcaption style="text-align: center; overflow-wrap: anywhere;">{{ chip.caption }}</figcaption>
      </figure>
    </div>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.parameters = {
  // Fixed showcase: hardcoded values, so Controls would do nothing here.
  controls: { disable: true },
  docs: {
    description: {
      story:
        "Hostile config and labels: a ZWJ family emoji and a run of flags (must not split into broken characters), a label over the 3-character limit, " +
        "the widest Latin glyphs, HTML-like and right-to-left text, a whitespace-only label, a config with missing or empty geometry, zero, negative, " +
        "oversized and invalid sizes, out-of-range angles and offsets, a broken icon name, tiny and huge hosts, a broken image and no slot at all. " +
        "Check that every label is whole and centred on its dot, missing geometry falls back to the default 12px dot at 90deg, negative and invalid sizes show no dot " +
        "rather than a broken one, and the cutout ring always sits under the dot.",
    },
  },
};
