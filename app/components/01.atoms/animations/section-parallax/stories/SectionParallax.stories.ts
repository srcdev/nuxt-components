import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../SectionParallax.vue";

type StoryArgs = {
  tag: "div" | "section" | "article" | "aside";
  backgroundImage: string;
  showOverlay: boolean;
  overlayText: string;
};

export default {
  title: "Atoms/Effects/SectionParallax",
  component: StorybookComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "aside"],
      description: "Root element tag",
    },
    backgroundImage: {
      control: { type: "text" },
      description: "Path to the background image",
    },
    showOverlay: {
      control: { type: "boolean" },
      description: "Show overlay slot content",
    },
    overlayText: {
      control: { type: "text" },
      description: "Overlay slot text",
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
    tag: "section",
    backgroundImage: "https://picsum.photos/id/28/1600/1200",
    showOverlay: true,
    overlayText: "A quiet moment.",
  },
} as Meta<StoryArgs>;

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <StorybookComponent :tag="args.tag" :background-image="args.backgroundImage">
      <div
        v-if="args.showOverlay"
        style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 2rem; text-shadow: 0 2px 8px rgba(0,0,0,0.6);"
      >
        {{ args.overlayText }}
      </div>
    </StorybookComponent>
  `,
});

export const Default = Template.bind({});

export const NoOverlay = Template.bind({});
NoOverlay.args = {
  showOverlay: false,
};

export const CustomHeight = Template.bind({});
CustomHeight.args = {
  showOverlay: true,
  overlayText: "Shorter atmospheric break via --section-parallax-min-height and -min-height-fixed.",
};
CustomHeight.render = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <StorybookComponent
      :tag="args.tag"
      :background-image="args.backgroundImage"
      style="--section-parallax-min-height: 60vh; --section-parallax-min-height-fixed: 70vh;"
    >
      <div
        v-if="args.showOverlay"
        style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 2rem; text-shadow: 0 2px 8px rgba(0,0,0,0.6);"
      >
        {{ args.overlayText }}
      </div>
    </StorybookComponent>
  `,
});
