import type { Meta, StoryFn } from "@nuxtjs/storybook";
import DataGridComponent from "../DataGrid.vue";

const meta: Meta<typeof DataGridComponent> = {
  title: "Atoms/Grids/DataGrid",
  component: DataGridComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML tag to render as",
      table: { category: "Semantic" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive auto-fit grid container. Uses CSS custom properties `--data-grid-columns` and `--data-grid-gap` to control layout. Renders named slots provided by the consumer.",
      },
    },
  },
};

export default meta;

const cardStyle =
  "padding: 2.4rem; background: white; border-radius: 0.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 0.8rem;";
const labelStyle = "font-size: 1.2rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;";
const valueStyle = "font-size: 2.4rem; font-weight: 700; color: #111827;";

interface DataGridArgs {
  tag: "div" | "section" | "article" | "main";
  styleClassPassthrough: string[];
}

const Template: StoryFn<DataGridArgs> = (args) => ({
  components: { DataGridComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <DataGridComponent :tag="args.tag" :style-class-passthrough="args.styleClassPassthrough">
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
      </DataGridComponent>
    </div>
  `,
});

export const Default = Template.bind({});
Default.parameters = {
  docs: {
    description: {
      story: "Default grid with four stat cards. Columns auto-fit to available space at a minimum of 250px each.",
    },
  },
};

export const TwoItems = Template.bind({});
TwoItems.storyName = "Two Items";
TwoItems.decorators = [
  () => ({
    components: { DataGridComponent },
    template: `
      <div style="padding: 3.2rem; background: #f9fafb;">
        <DataGridComponent>
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
        </DataGridComponent>
      </div>
    `,
  }),
];
TwoItems.parameters = {
  docs: { description: { story: "Grid with two items — auto-fit spreads them to fill available columns." } },
};

export const NarrowContainer: StoryFn<DataGridArgs> = (args) => ({
  components: { DataGridComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <div style="max-width: 400px;">
        <DataGridComponent :tag="args.tag">
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
        </DataGridComponent>
      </div>
    </div>
  `,
});
NarrowContainer.parameters = {
  docs: {
    description: {
      story: "In a 400px container the auto-fit columns stack to a single column once items fall below 250px.",
    },
  },
};

export const CustomColumns: StoryFn<DataGridArgs> = (args) => ({
  components: { DataGridComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <DataGridComponent style="--data-grid-columns: repeat(3, 1fr); --data-grid-gap: 2.4rem;" :tag="args.tag">
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
      </DataGridComponent>
    </div>
  `,
});
CustomColumns.parameters = {
  docs: {
    description: {
      story:
        "Override `--data-grid-columns` and `--data-grid-gap` via inline style to force a fixed 3-column layout with wider gaps.",
    },
  },
};

export const SemanticSection: StoryFn<DataGridArgs> = (args) => ({
  components: { DataGridComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 3.2rem; background: #f9fafb;">
      <DataGridComponent tag="section">
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
      </DataGridComponent>
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
