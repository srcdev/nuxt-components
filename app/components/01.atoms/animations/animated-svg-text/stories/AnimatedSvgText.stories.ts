import AnimatedSvgText from "../AnimatedSvgText.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof AnimatedSvgText> = {
  title: "Atoms/Animations/AnimatedSvgText",
  component: AnimatedSvgText,
  argTypes: {
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Animates inline SVG text outlines with a stroke-draw-then-fill effect on mount. Provide the SVG markup via the `text` slot. Styling is entirely via CSS custom properties — see CONSUMER-STYLING.md.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedSvgText>;

const svgSlot = `
  <svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
    <text x="0" y="110" font-size="120" font-family="sans-serif" font-weight="700" fill="none">Hello</text>
  </svg>
`;

// The default tokens (stroke-width 0.3, dasharray 1000) are tuned for path data traced at a
// small/normalised coordinate scale. This demo's viewBox is much larger, so both stories override
// stroke-width/dasharray to suit — see CONSUMER-STYLING.md: dasharray should roughly match the
// total path length of the SVG being animated.
const demoScaleTokens = "--animated-svg-text-stroke-width: 2; --animated-svg-text-stroke-dasharray: 2200;";

export const Default: Story = {
  render: () => ({
    components: { AnimatedSvgText },
    template: `<AnimatedSvgText style="${demoScaleTokens}"><template #text>${svgSlot}</template></AnimatedSvgText>`,
  }),
  parameters: {
    docs: {
      description: {
        story: "Default draw-on animation using the theme's text colour for both stroke and fill.",
      },
    },
  },
};

export const CustomColourAndSpeed: Story = {
  render: () => ({
    components: { AnimatedSvgText },
    template: `
      <AnimatedSvgText
        style="${demoScaleTokens} --animated-svg-text-stroke-colour: #e63946; --animated-svg-text-fill-colour: #e63946; --animated-svg-text-animation-duration: 3.5s;"
      >
        <template #text>${svgSlot}</template>
      </AnimatedSvgText>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Overriding `--animated-svg-text-stroke-colour`, `--animated-svg-text-fill-colour`, and slowing the animation via `--animated-svg-text-animation-duration`.",
      },
    },
  },
};
