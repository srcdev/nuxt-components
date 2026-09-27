import type { Meta, StoryObj } from "@nuxtjs/storybook";
import RampReference from "./RampReference.vue";
import { buildRamp, rampNames, themesForPalette } from "./ramp-data";

const meta: Meta<typeof RampReference> = {
  title: "Foundations/Colour Ramps",
  component: RampReference,
  parameters: {
    layout: "padded",
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Reference for every colour ramp in ramps.config.mjs. Values, theme roles and component references are read from the library source, so these pages stay in step with the generated CSS.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RampReference>;

const rampStory = (name: string): Story => ({
  args: { name },
  render: (args) => ({
    components: { RampReference },
    setup() {
      return { args };
    },
    template: `<RampReference :name="args.name"></RampReference>`,
  }),
});

/** Every ramp side by side. New entries in ramps.config.mjs appear here automatically. */
export const AllRamps: Story = {
  name: "All Ramps",
  render: () => ({
    setup() {
      const rows = rampNames.map((name) => ({ name, themes: themesForPalette(name), steps: buildRamp(name) }));
      const stepLabels = rows[0]?.steps.map((s) => s.step) ?? [];
      return { rows, stepLabels };
    },
    template: `
      <div style="display: grid; gap: 1.2rem; font-family: system-ui, sans-serif; font-size: 1.4rem; color: var(--colour-text-default, CanvasText);">
        <p style="margin: 0; max-width: 70ch;">
          Every ramp shares the same lightness and chroma curve (step 00 lightest, 10 darkest);
          only hue and maximum chroma differ. Hover a swatch for its token and value.
        </p>
        <div style="display: grid; grid-template-columns: 12rem repeat(11, minmax(3.2rem, 1fr)); gap: 0.4rem; align-items: center; overflow-x: auto;">
          <span></span>
          <span v-for="label in stepLabels" :key="label" style="text-align: center; font-size: 1.2rem; opacity: 0.7;">{{ label }}</span>
          <template v-for="row in rows" :key="row.name">
            <span style="display: grid;">
              <strong style="text-transform: capitalize;">{{ row.name }}</strong>
              <small style="opacity: 0.7;">{{ row.themes.length ? row.themes.join(", ") : "named steps only" }}</small>
            </span>
            <span
              v-for="step in row.steps"
              :key="step.token"
              :title="step.token + '  ' + step.oklch + '  ' + step.hex"
              :style="{ background: 'var(' + step.token + ')', aspectRatio: '1', borderRadius: '0.6rem', boxShadow: 'inset 0 0 0 0.1rem color-mix(in oklab, CanvasText 12%, transparent)' }"
            ></span>
          </template>
        </div>
      </div>
    `,
  }),
};

export const Blue: Story = rampStory("blue");
export const Red: Story = rampStory("red");
export const Green: Story = rampStory("green");
export const Amber: Story = rampStory("amber");
export const Orange: Story = rampStory("orange");
export const Sunset: Story = rampStory("sunset");
export const Slate: Story = rampStory("slate");
