import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../ContainerGlow.vue";

type StoryArgs = {
  tag: "div" | "li" | "article" | "section";
  proximity: number;
  spread: number;
  blur: number;
  gap: number;
  vertical: boolean;
  inactiveOpacity: number;
};

export default {
  title: "Atoms/Effects/ContainerGlow",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "li", "article", "section"],
      description: "HTML tag rendered for each glow container",
    },
    proximity: {
      control: { type: "range", min: 10, max: 200, step: 10 },
      description: "Mouse proximity distance (px) that triggers the glow",
      table: { category: "config" },
    },
    spread: {
      control: { type: "range", min: 20, max: 180, step: 10 },
      description: "Angular spread of the glow effect (degrees)",
      table: { category: "config" },
    },
    blur: {
      control: { type: "range", min: 0, max: 50, step: 2 },
      description: "Blur amount for the glow effect (px)",
      table: { category: "config" },
    },
    gap: {
      control: { type: "range", min: 8, max: 64, step: 4 },
      description: "Gap between containers (px)",
      table: { category: "config" },
    },
    vertical: {
      control: { type: "boolean" },
      description: "Arrange containers vertically instead of horizontally",
      table: { category: "config" },
    },
    inactiveOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "Opacity of the glow when not being hovered near",
      table: { category: "config" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
    class: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    proximity: 40,
    spread: 80,
    blur: 20,
    gap: 32,
    vertical: false,
    inactiveOpacity: 0,
  },
  parameters: {
    docs: {
      description: {
        component:
          "An interactive glow effect wrapper that creates one card per named slot the consumer provides, each with an animated gradient border that responds to mouse proximity.",
      },
    },
  },
} as Meta<StoryArgs>;

const cardStyle =
  "height: 100%; display: flex; flex-direction: column; justify-content: center; text-align: center; color: #374151;";

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const config = computed(() => ({
      proximity: args.proximity,
      spread: args.spread,
      blur: args.blur,
      gap: args.gap,
      vertical: args.vertical,
      inactiveOpacity: args.inactiveOpacity,
    }));
    return { args, config };
  },
  template: `
    <div style="background: radial-gradient(ellipse at center, #0f0f23 0%, #020024 100%); padding: 60px 40px; min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <StorybookComponent :tag="args.tag" :config="config">
        <template #one>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Container 1</h3>
            <p style="margin: 0; font-size: 1.3rem;">Move your cursor nearby</p>
          </div>
        </template>
        <template #two>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Container 2</h3>
            <p style="margin: 0; font-size: 1.3rem;">Each named slot is one card</p>
          </div>
        </template>
        <template #three>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Container 3</h3>
            <p style="margin: 0; font-size: 1.3rem;">No item-count prop needed</p>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const SingleContainer: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const config = computed(() => ({
      proximity: args.proximity,
      spread: args.spread,
      blur: args.blur,
      gap: args.gap,
      vertical: args.vertical,
      inactiveOpacity: args.inactiveOpacity,
    }));
    return { args, config };
  },
  template: `
    <div style="background: radial-gradient(ellipse at center, #0f0f23 0%, #020024 100%); padding: 60px 40px; min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <StorybookComponent :tag="args.tag" :config="config">
        <template #cta>
          <div style="${cardStyle}">
            <h3 style="margin: 0 0 8px 0;">Single container</h3>
            <p style="margin: 0; font-size: 1.3rem;">Perfect for one highlighted call-to-action card</p>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Vertical = Template.bind({});
Vertical.args = {
  vertical: true,
};

export const HighIntensity = Template.bind({});
HighIntensity.args = {
  proximity: 100,
  spread: 120,
  blur: 40,
  gap: 48,
  inactiveOpacity: 0,
};

export const SubtleGlow = Template.bind({});
SubtleGlow.args = {
  proximity: 30,
  spread: 40,
  blur: 10,
  gap: 20,
  inactiveOpacity: 0,
};
