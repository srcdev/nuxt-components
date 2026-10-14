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
    status: {
      control: { type: "inline-radio" },
      options: ["offline", "online", "idle", "dnd"],
      description: "Chip status colour (forwarded to DisplayChip)",
      table: {
        category: "Chip Configuration",
      },
    },
    statusLabel: {
      control: { type: "text" },
      description: "Screen-reader text for the chip status, e.g. 'Online' (forwarded to DisplayChip)",
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
    status: "online",
    statusLabel: "Online",
    styleClassPassthrough: ["test-storybook--display-avatar"],
  },
} as Meta<typeof StorybookComponent>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const googleReviewsNote = `
  <p style="${storyNoteStyle}">
    GoogleReviewCard puts an avatar beside each reviewer's name, with their photo or initials and its own avatar colour tokens. See the
    <a href="/?path=/story/organisms-google-reviews--default" target="_top">Google Reviews</a> story, and
    <a href="/?path=/story/organisms-google-reviews--no-avatars" target="_top">No Avatars</a> for the initials fallback.
  </p>
`;

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
    ${googleReviewsNote}
    <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
      <StorybookComponent
        :size="args.size"
        :src="args.src"
        :alt="args.alt"
        :chip="chip"
        :status="args.status"
        :status-label="args.statusLabel"
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
    ${googleReviewsNote}
    <div style="display: flex; align-items: center; justify-content: center; gap: 1.6rem; min-height: 80vh;">
      <StorybookComponent :size="args.size" :alt="args.alt" :chip="chip" :status="args.status" :status-label="args.statusLabel" :style-class-passthrough="args.styleClassPassthrough" />
      <StorybookComponent :size="args.size" text="?" :chip="chip" :status="args.status" :status-label="args.statusLabel" :style-class-passthrough="args.styleClassPassthrough" />
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
    ${googleReviewsNote}
    <div style="display: flex; align-items: center; justify-content: center; gap: 1.6rem; min-height: 80vh;">
      <StorybookComponent
        v-for="size in sizes"
        :key="size"
        :size="size"
        :src="args.src"
        :alt="args.alt"
        :chip="chip"
        :status="args.status"
        :status-label="args.statusLabel"
        :style-class-passthrough="args.styleClassPassthrough"
      />
    </div>
  `,
});
Sizes.args = { src: undefined, alt: "Jane Smith" };
Sizes.argTypes = { size: { table: { disable: true } } };

const stressAvatars = [
  { key: "long-text", caption: "Long text prop", props: { text: "Administrator account" } },
  { key: "unbroken", caption: "Unbroken alt", props: { alt: "Pneumonoultramicroscopicsilicovolcanoconiosis" } },
  { key: "german", caption: "Long German name", props: { alt: "Maximilian-Alexander von Hohenzollern-Sigmaringen" } },
  { key: "emoji", caption: "Emoji first", props: { alt: "🦄 Unicorn Team" } },
  { key: "zwj", caption: "ZWJ family emoji", props: { alt: "👩‍👩‍👧 Family" } },
  { key: "flags", caption: "Flag emoji", props: { alt: "🇬🇧 🇫🇷" } },
  { key: "whitespace", caption: "Extra whitespace", props: { alt: "   Jane      Smith   " } },
  { key: "text-blank", caption: "Whitespace text prop", props: { alt: "Jane Smith", text: "   " } },
  { key: "single", caption: "Single character", props: { alt: "J" } },
  { key: "empty", caption: "No alt, text or src", props: {} },
  { key: "html", caption: "HTML-like alt", props: { alt: "<b>Bold</b> <script>" } },
  { key: "rtl", caption: "Right-to-left", props: { alt: "محمد علي" }, dir: "rtl" },
  { key: "wide", caption: "Widest glyphs", props: { text: "WW" } },
  { key: "broken", caption: "Broken src", props: { src: "/does-not-exist.jpg", alt: "Jane Smith" } },
  { key: "broken-no-alt", caption: "Broken src, no alt", props: { src: "/does-not-exist.jpg" } },
  { key: "custom-size", caption: "Unknown size string", props: { alt: "Jane Smith", size: "huge" } },
];

export const StressTest: StoryFn<typeof StorybookComponent> = () => ({
  components: { StorybookComponent },
  setup() {
    return { stressAvatars, sizes: ["xs", "s", "md", "lg", "xl"] };
  },
  template: `
    ${googleReviewsNote}
    <div style="display: grid; gap: 4.8rem; padding: 4rem 2rem; font: 1.2rem sans-serif;">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 3.2rem 2.4rem;">
        <figure
          v-for="avatar in stressAvatars"
          :key="avatar.key"
          :dir="avatar.dir"
          style="margin: 0; display: grid; justify-items: center; align-content: start; gap: 1.2rem; min-inline-size: 0;"
        >
          <StorybookComponent v-bind="avatar.props" :chip="true" status="online" status-label="Online" />
          <figcaption style="text-align: center; overflow-wrap: anywhere;">{{ avatar.caption }}</figcaption>
        </figure>
      </div>

      <div style="display: flex; align-items: center; gap: 1.6rem;">
        <StorybookComponent v-for="size in sizes" :key="size" :size="size" text="WW" />
      </div>

      <div style="display: grid; gap: 1.2rem; inline-size: 20rem; border: 1px dashed currentColor; padding: 0.8rem;">
        <div v-for="size in sizes" :key="size" style="display: flex; align-items: center; gap: 0.8rem;">
          <StorybookComponent :size="size" alt="Jane Smith" />
          <span style="min-inline-size: 0; overflow-wrap: anywhere;">Averyveryverylongunbrokenusername@example.com</span>
        </div>
      </div>
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
        "Hostile names and sources: long and unbroken text, emoji (including ZWJ and flags) at the start of a name, extra whitespace, a whitespace-only " +
        "text prop, a single character, nothing at all, HTML-like and right-to-left text, the widest Latin glyphs at every size, broken image URLs with and " +
        "without alt, and an unknown size string. The last block puts each size in a narrow flex row next to a long unbroken name. " +
        "Check that initials are whole characters (never a broken half emoji), overlong text is clipped inside the circle rather than spilling out, " +
        "a broken image falls back to initials (or an empty circle with no alt), an unknown size renders at md, and no avatar squashes into an oval in the narrow rows.",
    },
  },
};
