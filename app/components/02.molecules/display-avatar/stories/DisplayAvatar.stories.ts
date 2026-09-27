import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../DisplayAvatar.vue";

export default {
  title: "Molecules/DisplayAvatar",
  component: StorybookComponent,
  argTypes: {
    size: {
      control: { type: "inline-radio" },
      options: ["xs", "s", "md", "lg", "xl"],
      description: "Avatar size",
      table: {
        category: "Avatar",
      },
    },
    src: {
      control: { type: "text" },
      description: "Avatar image source URL",
      table: {
        category: "Avatar",
      },
    },
    alt: {
      control: { type: "text" },
      description: "Alternative text for the avatar image",
      table: {
        category: "Avatar",
      },
    },
    chipSize: {
      control: { type: "range", min: 1, max: 24, step: 1 },
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
      control: { type: "range", min: -12, max: 12, step: 1 },
      description: "Offset of the chip from the edge in pixels",
      table: {
        category: "Chip Configuration",
      },
    },
    chipAngle: {
      control: { type: "range", min: 0, max: 360, step: 1 },
      description: "Angle of the chip position around the avatar in degrees",
      table: {
        category: "Chip Configuration",
      },
    },
    // Hide the chip prop from controls since we're using individual controls
    chip: {
      table: {
        disable: true,
      },
    },
    // Hide styleClassPassthrough from controls for cleaner UI
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    size: "md",
    src: "https://github.com/srcdev.png",
    alt: "SrcDev Avatar",
    chipSize: 12,
    chipMaskWidth: 4,
    chipOffset: 2,
    chipAngle: 45,
    styleClassPassthrough: ["test-storybook--display-avatar", "online"],
  },
} as Meta<typeof StorybookComponent>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useChip = (args: any) =>
  computed(() => ({
    size: `${args.chipSize ?? 12}px`,
    maskWidth: `${args.chipMaskWidth ?? 4}px`,
    offset: `${args.chipOffset ?? 2}px`,
    angle: `${args.chipAngle ?? 45}deg`,
  }));

const Template: StoryFn<typeof StorybookComponent> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, chip: useChip(args) };
  },
  template: `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
      <StorybookComponent
        :size="args.size"
        :src="args.src"
        :alt="args.alt"
        :chip="chip"
        :style-class-passthrough="args.styleClassPassthrough"
      />
    </div>
  `,
});

export const Default = Template.bind({});

export const Initials: StoryFn<typeof StorybookComponent> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, chip: useChip(args) };
  },
  template: `
    <div style="display: flex; align-items: center; justify-content: center; gap: 1.6rem; height: 100vh;">
      <StorybookComponent :size="args.size" :alt="args.alt" :chip="chip" :style-class-passthrough="args.styleClassPassthrough" />
      <StorybookComponent :size="args.size" text="?" :chip="chip" :style-class-passthrough="args.styleClassPassthrough" />
    </div>
  `,
});
Initials.args = { src: undefined, alt: "Jane Smith" };
Initials.argTypes = { src: { table: { disable: true } } };

export const Sizes: StoryFn<typeof StorybookComponent> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args, chip: useChip(args), sizes: ["xs", "s", "md", "lg", "xl"] };
  },
  template: `
    <div style="display: flex; align-items: center; justify-content: center; gap: 1.6rem; height: 100vh;">
      <StorybookComponent
        v-for="size in sizes"
        :key="size"
        :size="size"
        :src="args.src"
        :alt="args.alt"
        :chip="chip"
        :style-class-passthrough="args.styleClassPassthrough"
      />
    </div>
  `,
});
Sizes.args = { src: undefined, alt: "Jane Smith" };
Sizes.argTypes = { size: { table: { disable: true } } };
