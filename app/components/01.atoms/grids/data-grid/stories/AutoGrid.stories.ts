import { computed } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import AutoGridComponent from "../AutoGrid.vue";

interface AutoGridArgs {
  tag: "div" | "section" | "article" | "main";
  isResponsive: boolean;
  styleClassPassthrough: string[];
  minColSizeSmall: string;
  minColSizeDefault: string;
  minColSizeLarge: string;
  gap: string;
}

const meta: Meta<AutoGridArgs> = {
  title: "Atoms/Grids/AutoGrid",
  component: AutoGridComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML tag to render as",
      table: { category: "Props" },
    },
    isResponsive: {
      control: { type: "boolean" },
      description:
        "Enables container-query breakpoints: `--auto-grid-min-col-size-small` below 768px, default 768px+, large 1024px+. Requires a `container-type: inline-size` ancestor.",
      table: { category: "Props" },
    },
    minColSizeSmall: {
      control: { type: "text" },
      description: "`--auto-grid-min-col-size-small` — minimum column width in responsive mode below 768px",
      table: { category: "CSS Tokens" },
    },
    minColSizeDefault: {
      control: { type: "text" },
      description:
        "`--auto-grid-min-col-size-default` — controls column width when `isResponsive` is **off**. Also used as the mid-size step in responsive mode (768px+).",
      table: { category: "CSS Tokens" },
    },
    minColSizeLarge: {
      control: { type: "text" },
      description: "`--auto-grid-min-col-size-large` — minimum column width in responsive mode 1024px+",
      table: { category: "CSS Tokens" },
    },
    gap: {
      control: { type: "text" },
      description: "`--auto-grid-gap` — gap between grid items",
      table: { category: "CSS Tokens" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    isResponsive: false,
    minColSizeSmall: "250px",
    minColSizeDefault: "300px",
    minColSizeLarge: "350px",
    gap: "1rem",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive auto-fit grid container. Override `--auto-grid-min-col-size-default` and `--auto-grid-gap` to control layout. Enable `isResponsive` for container-query-based column steps using `--auto-grid-min-col-size-small` and `--auto-grid-min-col-size-large`.",
      },
    },
  },
};

export default meta;

const cardStyle =
  "padding: 2.4rem; background: white; border-radius: 0.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 0.8rem;";
const labelStyle =
  "font-size: 1.2rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;";
const valueStyle = "font-size: 2.4rem; font-weight: 700; color: #111827;";

const Template: StoryFn<AutoGridArgs> = (args) => ({
  components: { AutoGridComponent },
  setup() {
    const cssTokenStyle = computed(() => ({
      "--auto-grid-min-col-size-small": args.minColSizeSmall,
      "--auto-grid-min-col-size-default": args.minColSizeDefault,
      "--auto-grid-min-col-size-large": args.minColSizeLarge,
      "--auto-grid-gap": args.gap,
    }));
    return { args, cssTokenStyle };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb; container-type: inline-size;">
      <AutoGridComponent :tag="args.tag" :is-responsive="args.isResponsive" :style="cssTokenStyle" :style-class-passthrough="args.styleClassPassthrough">
        <template #item-1>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Revenue</span>
            <span style="${valueStyle}">£24,500</span>
          </div>
        </template>
        <template #item-2>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Clients</span>
            <span style="${valueStyle}">142</span>
          </div>
        </template>
        <template #item-3>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Bookings</span>
            <span style="${valueStyle}">38</span>
          </div>
        </template>
        <template #item-4>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Avg. Rating</span>
            <span style="${valueStyle}">4.9</span>
          </div>
        </template>
      </AutoGridComponent>
    </div>
  `,
});

export const Default = Template.bind({});
Default.parameters = {
  docs: {
    description: {
      story: "Default grid with four stat cards. Columns auto-fit to available space at a minimum of 300px each.",
    },
  },
};

export const Responsive = Template.bind({});
Responsive.args = { isResponsive: true };
Responsive.parameters = {
  docs: {
    description: {
      story:
        "With `isResponsive` enabled, column width steps through three sizes based on container width. Resize the story viewport to see the breakpoints in action.",
    },
  },
};

export const TwoItems = Template.bind({});
TwoItems.storyName = "Two Items";
TwoItems.decorators = [
  () => ({
    components: { AutoGridComponent },
    template: `
      <div style="padding: 3.2rem; background: #f9fafb; container-type: inline-size;">
        <AutoGridComponent>
          <template #item-1>
            <div style="${cardStyle}">
              <span style="${labelStyle}">Revenue</span>
              <span style="${valueStyle}">£24,500</span>
            </div>
          </template>
          <template #item-2>
            <div style="${cardStyle}">
              <span style="${labelStyle}">Clients</span>
              <span style="${valueStyle}">142</span>
            </div>
          </template>
        </AutoGridComponent>
      </div>
    `,
  }),
];
TwoItems.parameters = {
  docs: { description: { story: "Grid with two items — auto-fit spreads them to fill available columns." } },
};

export const NarrowContainer: StoryFn<AutoGridArgs> = (args) => ({
  components: { AutoGridComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <div style="max-width: 400px; container-type: inline-size;">
        <AutoGridComponent :tag="args.tag">
          <template #item-1>
            <div style="${cardStyle}">
              <span style="${labelStyle}">Revenue</span>
              <span style="${valueStyle}">£24,500</span>
            </div>
          </template>
          <template #item-2>
            <div style="${cardStyle}">
              <span style="${labelStyle}">Clients</span>
              <span style="${valueStyle}">142</span>
            </div>
          </template>
          <template #item-3>
            <div style="${cardStyle}">
              <span style="${labelStyle}">Bookings</span>
              <span style="${valueStyle}">38</span>
            </div>
          </template>
        </AutoGridComponent>
      </div>
    </div>
  `,
});
NarrowContainer.parameters = {
  docs: {
    description: {
      story: "In a 400px container the auto-fit columns stack to a single column once items fall below 300px.",
    },
  },
};

export const CustomColumns: StoryFn<AutoGridArgs> = (args) => ({
  components: { AutoGridComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <AutoGridComponent style="grid-template-columns: repeat(3, 1fr); --auto-grid-gap: 2.4rem;" :tag="args.tag">
        <template #item-1>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Revenue</span>
            <span style="${valueStyle}">£24,500</span>
          </div>
        </template>
        <template #item-2>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Clients</span>
            <span style="${valueStyle}">142</span>
          </div>
        </template>
        <template #item-3>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Bookings</span>
            <span style="${valueStyle}">38</span>
          </div>
        </template>
      </AutoGridComponent>
    </div>
  `,
});
CustomColumns.parameters = {
  docs: {
    description: {
      story:
        "Override `grid-template-columns` and `--auto-grid-gap` via inline style to force a fixed 3-column layout with wider gaps.",
    },
  },
};

export const SemanticSection: StoryFn<AutoGridArgs> = (args) => ({
  components: { AutoGridComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb; container-type: inline-size;">
      <AutoGridComponent tag="section">
        <template #item-1>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Revenue</span>
            <span style="${valueStyle}">£24,500</span>
          </div>
        </template>
        <template #item-2>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Clients</span>
            <span style="${valueStyle}">142</span>
          </div>
        </template>
        <template #item-3>
          <div style="${cardStyle}">
            <span style="${labelStyle}">Bookings</span>
            <span style="${valueStyle}">38</span>
          </div>
        </template>
      </AutoGridComponent>
    </div>
  `,
});
SemanticSection.parameters = {
  docs: {
    description: {
      story: "Rendered as a `<section>` — `aria-labelledby` is automatically applied via `useAriaLabelledById`.",
    },
  },
};
