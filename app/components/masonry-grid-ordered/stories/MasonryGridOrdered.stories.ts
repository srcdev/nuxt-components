import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../MasonryGridOrdered.vue";
import type { IQuote } from "~/types/types.quotes";

// Custom interface for story args
interface MasonryGridOrderedStoryArgs {
  gridData: IQuote[];
  gap: number;
  minTileWidth: number;
  fixedWidth: boolean;
  styleClassPassthrough: string[];
  // Display options for stories
  showBorders: boolean;
  showNumbers: boolean;
  itemVariant: "simple" | "card" | "detailed";
}

// Sample data for stories
const sampleQuotes: IQuote[] = [
  {
    id: 1,
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    id: 2,
    quote: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    id: 3,
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    id: 4,
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    id: 5,
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    id: 6,
    quote: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    id: 7,
    quote: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
    author: "Unknown",
  },
  {
    id: 8,
    quote: "It's not whether you get knocked down, it's whether you get up.",
    author: "Vince Lombardi",
  },
  {
    id: 9,
    quote:
      "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    author: "Steve Jobs",
  },
  {
    id: 10,
    quote: "People who are crazy enough to think they can change the world, are the ones who do.",
    author: "Rob Siltanen",
  },
  {
    id: 11,
    quote: "We don't make mistakes, just happy little accidents.",
    author: "Bob Ross",
  },
  {
    id: 12,
    quote: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
  },
];

export default {
  title: "Components/UI/MasonryGridOrdered",
  component: StorybookComponent,
  argTypes: {
    // Layout Configuration
    gap: {
      control: { type: "range", min: 0, max: 50, step: 2 },
      description: "Gap between grid items in pixels",
      table: {
        category: "Layout",
      },
    },
    minTileWidth: {
      control: { type: "range", min: 200, max: 500, step: 10 },
      description: "Minimum width for each grid tile",
      table: {
        category: "Layout",
      },
    },
    fixedWidth: {
      control: { type: "boolean" },
      description: "Whether to use fixed width for tiles",
      table: {
        category: "Layout",
      },
    },
    styleClassPassthrough: {
      control: { type: "object" },
      description: "Additional CSS classes to pass through",
      table: {
        category: "Layout",
      },
    },
    // Data Configuration
    gridData: {
      control: { type: "object" },
      description: "Array of quote objects to display in the grid",
      table: {
        category: "Data",
      },
    },
    // Display Options (for stories only)
    showBorders: {
      control: { type: "boolean" },
      description: "Show borders around grid items",
      table: {
        category: "Display Options",
      },
    },
    showNumbers: {
      control: { type: "boolean" },
      description: "Show index numbers on grid items",
      table: {
        category: "Display Options",
      },
    },
    itemVariant: {
      control: { type: "select" },
      options: ["simple", "card", "detailed"],
      description: "Style variant for grid items",
      table: {
        category: "Display Options",
      },
    },
  },
  args: {
    gridData: sampleQuotes.slice(0, 8),
    gap: 12,
    minTileWidth: 300,
    fixedWidth: true,
    styleClassPassthrough: ["mi-auto"],
    showBorders: true,
    showNumbers: true,
    itemVariant: "card",
  },
} as Meta<MasonryGridOrderedStoryArgs>;

const Template: StoryFn<MasonryGridOrderedStoryArgs> = (args) => ({
  components: {
    StorybookComponent,
  },
  setup() {
    const getItemClasses = (variant: string, showBorders: boolean) => {
      const baseClasses = ["p-10"];

      if (showBorders) {
        baseClasses.push("border", "border-1", "border-grey-dark");

        if (variant === "card") {
          baseClasses.push("border-r-4");
        }
      }

      if (variant === "detailed") {
        baseClasses.push("bg-gray-1", "rounded-4");
      }

      return baseClasses.join(" ");
    };

    return { args, getItemClasses };
  },
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">MasonryGridOrdered Component</h3>
        <p style="color: #666; margin-bottom: 20px;">
          Displaying {{ args.gridData.length }} items with {{ args.gap }}px gap and {{ args.minTileWidth }}px minimum width
        </p>
      </div>

      <StorybookComponent
        :gridData="args.gridData"
        :gap="args.gap"
        :min-tile-width="args.minTileWidth"
        :fixed-width="args.fixedWidth"
        :styleClassPassthrough="args.styleClassPassthrough"
      >
        <template v-for="(item, index) in args.gridData" v-slot:[item.id]>
          <div :class="getItemClasses(args.itemVariant, args.showBorders)">
            <p v-if="args.showNumbers" class="text-normal wght-700" style="margin-bottom: 8px;">
              {{ index + 1 }}: {{ item.author }}
            </p>
            <p v-else class="text-normal wght-700" style="margin-bottom: 8px;">
              {{ item.author }}
            </p>
            <p class="text-normal">{{ item.quote }}</p>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const SmallGap = Template.bind({});
SmallGap.args = {
  gap: 4,
  minTileWidth: 250,
  fixedWidth: false,
  itemVariant: "simple",
  showBorders: false,
  showNumbers: false,
};

export const LargeGap = Template.bind({});
LargeGap.args = {
  gap: 24,
  minTileWidth: 320,
  fixedWidth: true,
  itemVariant: "card",
  showBorders: true,
  showNumbers: true,
};

export const WideItems = Template.bind({});
WideItems.args = {
  gap: 16,
  minTileWidth: 400,
  fixedWidth: false,
  itemVariant: "detailed",
  showBorders: true,
  showNumbers: false,
};

export const NarrowItems = Template.bind({});
NarrowItems.args = {
  gap: 8,
  minTileWidth: 200,
  fixedWidth: true,
  itemVariant: "simple",
  showBorders: true,
  showNumbers: true,
};

export const ManyItems = Template.bind({});
ManyItems.args = {
  gridData: sampleQuotes, // All 12 items
  gap: 12,
  minTileWidth: 280,
  fixedWidth: true,
  itemVariant: "card",
  showBorders: true,
  showNumbers: true,
};

export const FewItems = Template.bind({});
FewItems.args = {
  gridData: sampleQuotes.slice(0, 4),
  gap: 20,
  minTileWidth: 350,
  fixedWidth: false,
  itemVariant: "detailed",
  showBorders: true,
  showNumbers: false,
};

export const MinimalStyle = Template.bind({});
MinimalStyle.args = {
  gap: 16,
  minTileWidth: 300,
  fixedWidth: false,
  styleClassPassthrough: [],
  itemVariant: "simple",
  showBorders: false,
  showNumbers: false,
};

export const CustomStyles = Template.bind({});
CustomStyles.args = {
  gap: 12,
  minTileWidth: 320,
  fixedWidth: true,
  styleClassPassthrough: ["mi-auto", "mb-20"],
  itemVariant: "detailed",
  showBorders: true,
  showNumbers: true,
};

// Example with different content structure
const Template2: StoryFn<MasonryGridOrderedStoryArgs> = (args) => ({
  components: {
    StorybookComponent,
  },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">Custom Content Example</h3>
        <p style="color: #666; margin-bottom: 20px;">
          Showing how different content can be displayed in the masonry grid
        </p>
      </div>

      <StorybookComponent
        :gridData="args.gridData"
        :gap="args.gap"
        :min-tile-width="args.minTileWidth"
        :fixed-width="args.fixedWidth"
        :styleClassPassthrough="args.styleClassPassthrough"
      >
        <template v-for="(item, index) in args.gridData" v-slot:[item.id]>
          <div class="p-16 bg-gray-1 rounded-8 border border-1 border-gray-6">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div
                style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 12px; font-size: 14px;"
              >
                {{ index + 1 }}
              </div>
              <h4 class="text-normal wght-700" style="margin: 0;">{{ item.author }}</h4>
            </div>
            <blockquote class="text-normal" style="font-style: italic; border-left: 3px solid #667eea; padding-left: 12px; margin: 0;">
              "{{ item.quote }}"
            </blockquote>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const RichContent = Template2.bind({});
RichContent.args = {
  gridData: sampleQuotes.slice(0, 6),
  gap: 16,
  minTileWidth: 320,
  fixedWidth: false,
  styleClassPassthrough: ["mi-auto"],
};
