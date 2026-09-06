import type { Meta, StoryFn } from "@nuxtjs/storybook";
import CanvasSwitcher from "../CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

interface CanvasSwitcherStoryArgs {
  canvasName: MediaCanvas | undefined;
  styleClassPassthrough: string[];
}

export default {
  title: "Atoms/CanvasSwitcher",
  component: CanvasSwitcher,
  argTypes: {
    canvasName: {
      control: { type: "select" },
      options: ["mobileCanvas", "tabletCanvas", "laptopCanvas", "desktopCanvas", "fullWidthCanvas"],
      description: "Bound via v-model:canvas-name — the currently selected MediaCanvas value",
      table: { category: "Model" },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Styling" },
    },
  },
  args: {
    canvasName: "desktopCanvas",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "An icon button group for switching between MediaCanvas preview widths (mobile/tablet/laptop/desktop/full width). Also declares the `.mobileCanvas`/`.tabletCanvas`/etc. utility classes a consumer can apply to a preview wrapper to constrain it to the matching width — see LayoutGridA/LayoutGridB stories.",
      },
    },
  },
} as Meta<typeof CanvasSwitcher>;

const Template: StoryFn<CanvasSwitcherStoryArgs> = (args) => ({
  components: { CanvasSwitcher },
  setup() {
    const { canvasName, ...otherArgs } = args;
    const selected = ref(canvasName);
    return { selected, args: otherArgs };
  },
  template: `
    <div>
      <CanvasSwitcher v-model:canvas-name="selected" v-bind="args" />
      <p style="margin-top: 1.6rem;">Selected: {{ selected }}</p>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const PreviewWidthDemo = Template.bind({});
PreviewWidthDemo.args = {};
PreviewWidthDemo.render = (args) => ({
  components: { CanvasSwitcher },
  setup() {
    const { canvasName } = args;
    const selected = ref(canvasName);
    return { selected };
  },
  template: `
    <div>
      <CanvasSwitcher v-model:canvas-name="selected" />
      <div :class="selected" style="border: 1px dashed currentColor; margin-top: 1.6rem; padding: 1.6rem;">
        This box is constrained by the selected canvas's utility class.
      </div>
    </div>
  `,
});
