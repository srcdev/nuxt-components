import EntryAnimation from "../EntryAnimation.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof EntryAnimation> = {
  title: "Components/Effects/EntryAnimation",
  component: EntryAnimation,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "aside"],
      description: "HTML tag for the wrapper element",
      defaultValue: "div",
    },
    animationType: {
      control: { type: "select" },
      options: ["entry-slide-in", "entry-zoom-reveal", "entry-exit-blur"],
      description: "Type of entry animation",
      defaultValue: "entry-slide-in",
    },
    skipAnimation: {
      control: { type: "boolean" },
      description:
        "Render as a plain element with no animation class — e.g. the first item in a looped list that's already above the fold",
      defaultValue: false,
    },
    styleClassPassthrough: {
      control: { type: "text" },
      description: "Additional classes for styling",
      defaultValue: "",
    },
  },
};

export default meta;

export const EntrySlideIn: StoryObj<typeof EntryAnimation> = {
  args: {
    tag: "div",
    animationType: "entry-slide-in",
    styleClassPassthrough: "",
  },
  render: (args) => ({
    components: { EntryAnimation },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 200px; background-color: red;">
        <label style="display: block; font-weight: bold; margin-bottom: 1rem;">Scroll down to reveal animation</label>
      </div>
      <div style="padding-block: 600px; background-color: green;  margin-bottom: 1000px;">
        <EntryAnimation v-bind="args">
          <template #default>
            <div style="padding: 2rem; background: #f0f0f0; border-radius: 8px;">
              Entry Animation Content
            </div>
          </template>
        </EntryAnimation>
      </div>
    `,
  }),
};

export const ZoomReveal: StoryObj<typeof EntryAnimation> = {
  args: {
    tag: "section",
    animationType: "entry-zoom-reveal",
    styleClassPassthrough: "",
  },
  render: EntrySlideIn.render,
};

export const EntryExitBlur: StoryObj<typeof EntryAnimation> = {
  args: {
    tag: "aside",
    animationType: "entry-exit-blur",
    styleClassPassthrough: "",
  },
  render: EntrySlideIn.render,
};

export const SkippedInALoop: StoryObj<typeof EntryAnimation> = {
  name: "Skip first item (looped list, above the fold)",
  parameters: {
    docs: {
      description: {
        story:
          "The common `v-for` case: the first item is already above the fold, so animating it in " +
          "would just delay content the visitor can already see. Pass `skip-animation` for that one " +
          "item instead of swapping the whole component out for a plain tag.",
      },
    },
  },
  render: () => ({
    components: { EntryAnimation },
    setup() {
      const items = [0, 1, 2];
      return { items };
    },
    template: `
      <div style="padding-block: 400px; background-color: green; margin-bottom: 1000px;">
        <label style="display: block; font-weight: bold; margin-bottom: 1rem; color: #fff;">
          Item 0 renders immediately (skip-animation) — scroll to see items 1 and 2 animate in
        </label>
        <div
          v-for="index in items"
          :key="index"
          style="margin-bottom: 2rem;"
        >
          <EntryAnimation :skip-animation="index === 0" animation-type="entry-slide-in">
            <template #default>
              <div style="padding: 2rem; background: #f0f0f0; border-radius: 8px;">
                Item {{ index }} {{ index === 0 ? '(skipped)' : '(animated)' }}
              </div>
            </template>
          </EntryAnimation>
        </div>
      </div>
    `,
  }),
};
