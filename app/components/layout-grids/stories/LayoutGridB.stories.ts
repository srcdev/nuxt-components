import type { Meta, StoryFn } from "@nuxtjs/storybook";
import LayoutGridBComponent from "../LayoutGridB.vue";
import type { MediaCanvas } from "../../../types/components";

// Define the args interface
interface LayoutGridBArgs {
  topRowSlot1ItemCount: number;
  bottomRowItemCount: number;
  mediaCanvas: MediaCanvas;
  styleClassPassthrough: string[];
}

export default {
  title: "Components/Layouts/LayoutGridB",
  component: LayoutGridBComponent,
  argTypes: {
    // Configuration
    topRowSlot1ItemCount: {
      control: { type: "range", min: 1, max: 12, step: 1 },
      description: "Number of items in the top row slot 1 grid",
      table: {
        category: "Configuration",
      },
    },
    bottomRowItemCount: {
      control: { type: "range", min: 1, max: 8, step: 1 },
      description: "Number of items in the bottom row",
      table: {
        category: "Configuration",
      },
    },
    // Canvas/Media Query Testing
    mediaCanvas: {
      control: { type: "select" },
      options: ["mobileCanvas", "tabletCanvas", "laptopCanvas", "desktopCanvas", "fullWidthCanvas"],
      description: "Canvas size for responsive testing",
      table: {
        category: "Responsive",
      },
    },
    // Hide complex props
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    topRowSlot1ItemCount: 6,
    bottomRowItemCount: 4,
    mediaCanvas: "desktopCanvas",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive layout grid with configurable top and bottom sections. Features a flexible 3-area top row (slot1 with multiple panels, slot2, slot3) and a bottom row with multiple panels.",
      },
    },
  },
} as Meta<LayoutGridBArgs>;

const Template: StoryFn<LayoutGridBArgs> = (args) => ({
  components: { LayoutGridBComponent },
  setup() {
    const sampleContent = {
      shortText: "Sample content panel",
      mediumText:
        "This is some medium length content that demonstrates how the layout adapts to different content lengths and screen sizes.",
      longText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    };

    return { args, sampleContent };
  },
  template: `
    <div style="padding: 20px;" :class="args.mediaCanvas">
      <LayoutGridBComponent
        :topRowSlot1ItemCount="args.topRowSlot1ItemCount"
        :bottomRowItemCount="args.bottomRowItemCount"
        :style-class-passthrough="[args.mediaCanvas, ...args.styleClassPassthrough]"
      >
        <!-- Dynamic top row slot 1 content -->
        <template v-for="i in args.topRowSlot1ItemCount" :key="i" v-slot:[(\`top-row-slot1-\${i}-content\`)]>
          <div style="padding: 16px; background: #f8fafc; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Panel {{ i }}</h4>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">{{ sampleContent.shortText }}</p>
          </div>
        </template>

        <!-- Top row slot 2 -->
        <template #top-row-slot-2>
          <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; height: 100%;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px;">Featured Content</h3>
            <p style="margin: 0 0 12px 0; opacity: 0.9;">{{ sampleContent.mediumText }}</p>
            <p style="margin: 0; opacity: 0.8; font-size: 14px;">This slot spans multiple grid areas on larger screens.</p>
          </div>
        </template>

        <!-- Top row slot 3 -->
        <template #top-row-slot-3>
          <div style="padding: 20px; background: #f8fafc; border-radius: 12px; border: 2px solid #e5e7eb;">
            <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px;">Additional Info</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">{{ sampleContent.mediumText }}</p>
          </div>
        </template>

        <!-- Dynamic bottom row content -->
        <template v-for="i in args.bottomRowItemCount" :key="i" v-slot:[(\`bottom-row-\${i}-content\`)]>
          <div style="padding: 20px; background: #fef3c7; border-radius: 12px;">
            <h4 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px;">Bottom Section {{ i }}</h4>
            <p style="margin: 0; color: #b45309; font-size: 14px; line-height: 1.4;">{{ sampleContent.mediumText }}</p>
          </div>
        </template>
      </LayoutGridBComponent>
    </div>
  `,
});

// ===== BASIC STORIES =====

export const Default = Template.bind({});
Default.args = {};

export const MinimalGrid = Template.bind({});
MinimalGrid.args = {
  topRowSlot1ItemCount: 3,
  bottomRowItemCount: 2,
};

export const MaximalGrid = Template.bind({});
MaximalGrid.args = {
  topRowSlot1ItemCount: 9,
  bottomRowItemCount: 6,
};

// ===== RESPONSIVE STORIES =====

export const MobileView = Template.bind({});
MobileView.args = {
  mediaCanvas: "mobileCanvas",
  topRowSlot1ItemCount: 4,
  bottomRowItemCount: 2,
};
MobileView.parameters = {
  docs: {
    description: {
      story: "Layout behavior on mobile devices. Grid items stack vertically with 2-column layout for slot1 items.",
    },
  },
};

export const TabletView = Template.bind({});
TabletView.args = {
  mediaCanvas: "tabletCanvas",
  topRowSlot1ItemCount: 6,
  bottomRowItemCount: 4,
};
TabletView.parameters = {
  docs: {
    description: {
      story: "Layout behavior on tablet devices. Transitional layout between mobile and desktop views.",
    },
  },
};

export const LaptopView = Template.bind({});
LaptopView.args = {
  mediaCanvas: "laptopCanvas",
  topRowSlot1ItemCount: 6,
  bottomRowItemCount: 4,
};
LaptopView.parameters = {
  docs: {
    description: {
      story: "Layout behavior on laptop screens. Desktop layout begins to take effect with side-by-side arrangement.",
    },
  },
};

export const DesktopView = Template.bind({});
DesktopView.args = {
  mediaCanvas: "desktopCanvas",
  topRowSlot1ItemCount: 6,
  bottomRowItemCount: 4,
};
DesktopView.parameters = {
  docs: {
    description: {
      story: "Full desktop layout with slot2 spanning multiple grid areas and 3-column layout for slot1 items.",
    },
  },
};

export const FullWidthView = Template.bind({});
FullWidthView.args = {
  mediaCanvas: "fullWidthCanvas",
  topRowSlot1ItemCount: 8,
  bottomRowItemCount: 6,
};
FullWidthView.parameters = {
  docs: {
    description: {
      story: "Maximum width layout with optimal spacing for large displays.",
    },
  },
};

// ===== CONTENT VARIATION STORIES =====

const ContentVariationsTemplate: StoryFn<LayoutGridBArgs> = (args) => ({
  components: { LayoutGridBComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px;" :class="args.mediaCanvas">
      <LayoutGridBComponent
        :topRowSlot1ItemCount="args.topRowSlot1ItemCount"
        :bottomRowItemCount="args.bottomRowItemCount"
        :style-class-passthrough="[args.mediaCanvas]"
      >
        <!-- Top row slot 1 - Different content types -->
        <template #top-row-slot1-1-content>
          <div style="padding: 16px; background: #dbeafe; border-radius: 8px; text-align: center;">
            <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">1</div>
            <h4 style="margin: 0; color: #1e40af;">Statistics</h4>
          </div>
        </template>

        <template #top-row-slot1-2-content>
          <div style="padding: 16px; background: #dcfce7; border-radius: 8px; text-align: center;">
            <div style="width: 40px; height: 40px; background: #22c55e; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">✓</div>
            <h4 style="margin: 0; color: #15803d;">Tasks</h4>
          </div>
        </template>

        <template #top-row-slot1-3-content>
          <div style="padding: 16px; background: #fed7d7; border-radius: 8px; text-align: center;">
            <div style="width: 40px; height: 40px; background: #ef4444; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">!</div>
            <h4 style="margin: 0; color: #dc2626;">Alerts</h4>
          </div>
        </template>

        <template #top-row-slot1-4-content>
          <div style="padding: 16px; background: #fef3c7; border-radius: 8px; text-align: center;">
            <div style="width: 40px; height: 40px; background: #f59e0b; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">⚡</div>
            <h4 style="margin: 0; color: #d97706;">Activity</h4>
          </div>
        </template>

        <template #top-row-slot1-5-content>
          <div style="padding: 16px; background: #f3e8ff; border-radius: 8px; text-align: center;">
            <div style="width: 40px; height: 40px; background: #8b5cf6; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">📊</div>
            <h4 style="margin: 0; color: #7c3aed;">Reports</h4>
          </div>
        </template>

        <template #top-row-slot1-6-content>
          <div style="padding: 16px; background: #f0f9ff; border-radius: 8px; text-align: center;">
            <div style="width: 40px; height: 40px; background: #0ea5e9; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">👥</div>
            <h4 style="margin: 0; color: #0284c7;">Users</h4>
          </div>
        </template>

        <!-- Top row slot 2 - Main content area -->
        <template #top-row-slot-2>
          <div style="padding: 24px; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; border-radius: 12px; height: 100%;">
            <h2 style="margin: 0 0 16px 0; font-size: 24px;">Dashboard Overview</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
              <div style="padding: 16px; background: rgba(255, 255, 255, 0.1); border-radius: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 32px; font-weight: bold;">1,234</h3>
                <p style="margin: 0; opacity: 0.8; font-size: 14px;">Total Views</p>
              </div>
              <div style="padding: 16px; background: rgba(255, 255, 255, 0.1); border-radius: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 32px; font-weight: bold;">89%</h3>
                <p style="margin: 0; opacity: 0.8; font-size: 14px;">Success Rate</p>
              </div>
            </div>
            <p style="margin: 0; opacity: 0.9; line-height: 1.5;">This main content area spans multiple grid positions on larger screens, providing prime real estate for your most important information.</p>
          </div>
        </template>

        <!-- Top row slot 3 - Secondary content -->
        <template #top-row-slot-3>
          <div style="padding: 20px; background: #f8fafc; border-radius: 12px; border: 2px solid #e5e7eb;">
            <h3 style="margin: 0 0 16px 0; color: #374151;">Recent Activity</h3>
            <div style="space-y: 12px;">
              <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 12px;"></div>
                <span style="color: #6b7280; font-size: 14px;">User registration completed</span>
              </div>
              <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; margin-right: 12px;"></div>
                <span style="color: #6b7280; font-size: 14px;">Data sync successful</span>
              </div>
              <div style="display: flex; align-items: center; padding: 8px 0;">
                <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-right: 12px;"></div>
                <span style="color: #6b7280; font-size: 14px;">System update pending</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Bottom row - Feature cards -->
        <template #bottom-row-1-content>
          <div style="padding: 24px; background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 12px;">
            <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 18px;">Feature One</h3>
            <p style="margin: 0 0 16px 0; color: #b45309; line-height: 1.5;">Comprehensive feature description that explains the benefits and functionality of this particular feature.</p>
            <button style="padding: 8px 16px; background: #d97706; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Learn More</button>
          </div>
        </template>

        <template #bottom-row-2-content>
          <div style="padding: 24px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px;">
            <h3 style="margin: 0 0 12px 0; color: #1e40af; font-size: 18px;">Feature Two</h3>
            <p style="margin: 0 0 16px 0; color: #1d4ed8; line-height: 1.5;">Advanced functionality that provides users with powerful tools and seamless integration capabilities.</p>
            <button style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Explore</button>
          </div>
        </template>

        <template #bottom-row-3-content>
          <div style="padding: 24px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px;">
            <h3 style="margin: 0 0 12px 0; color: #15803d; font-size: 18px;">Feature Three</h3>
            <p style="margin: 0 0 16px 0; color: #16a34a; line-height: 1.5;">Innovative solution that streamlines workflows and enhances user productivity across all platforms.</p>
            <button style="padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Get Started</button>
          </div>
        </template>

        <template #bottom-row-4-content>
          <div style="padding: 24px; background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border-radius: 12px;">
            <h3 style="margin: 0 0 12px 0; color: #7c3aed; font-size: 18px;">Feature Four</h3>
            <p style="margin: 0 0 16px 0; color: #8b5cf6; line-height: 1.5;">Premium feature set that delivers enterprise-grade performance and customization options.</p>
            <button style="padding: 8px 16px; background: #7c3aed; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Upgrade</button>
          </div>
        </template>
      </LayoutGridBComponent>
    </div>
  `,
});

export const DashboardExample = ContentVariationsTemplate.bind({});
DashboardExample.args = {
  topRowSlot1ItemCount: 6,
  bottomRowItemCount: 4,
  mediaCanvas: "desktopCanvas",
};
DashboardExample.parameters = {
  docs: {
    description: {
      story:
        "Complete dashboard example showing how LayoutGridB can be used for admin interfaces with statistics, main content, activity feeds, and feature cards.",
    },
  },
};

// ===== COMPARISON STORY =====

const ComparisonTemplate: StoryFn = () => ({
  components: { LayoutGridBComponent },
  setup() {
    const canvases: MediaCanvas[] = ["mobileCanvas", "tabletCanvas", "laptopCanvas", "desktopCanvas"];
    return { canvases };
  },
  template: `
    <div style="padding: 20px;">
      <h2 style="margin: 0 0 30px 0; text-align: center; color: #374151;">Responsive Behavior Comparison</h2>
      <div style="display: grid; gap: 40px;">
        <div v-for="canvas in canvases" :key="canvas" :class="canvas">
          <h3 style="margin: 0 0 16px 0; color: #6b7280; text-transform: capitalize;">
            {{ canvas.replace('Canvas', '') }} View
          </h3>
          <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; background: #fafafa;">
            <LayoutGridBComponent
              :topRowSlot1ItemCount="6"
              :bottomRowItemCount="4"
              :style-class-passthrough="[canvas]"
            >
              <!-- Simplified content for comparison -->
              <template v-for="i in 6" :key="i" v-slot:[(\`top-row-slot1-\${i}-content\`)]>
                <div style="padding: 12px; background: #dbeafe; border-radius: 6px; text-align: center; font-size: 12px; color: #1e40af;">
                  {{ i }}
                </div>
              </template>

              <template #top-row-slot-2>
                <div style="padding: 16px; background: #7c3aed; color: white; border-radius: 8px; text-align: center;">
                  <strong>Main Content</strong>
                </div>
              </template>

              <template #top-row-slot-3>
                <div style="padding: 16px; background: #f59e0b; color: white; border-radius: 8px; text-align: center;">
                  <strong>Side Content</strong>
                </div>
              </template>

              <template v-for="i in 4" :key="i" v-slot:[(\`bottom-row-\${i}-content\`)]>
                <div style="padding: 12px; background: #fef3c7; border-radius: 6px; text-align: center; font-size: 12px; color: #d97706;">
                  Bottom {{ i }}
                </div>
              </template>
            </LayoutGridBComponent>
          </div>
        </div>
      </div>
    </div>
  `,
});

export const ResponsiveComparison = ComparisonTemplate.bind({});
ResponsiveComparison.parameters = {
  docs: {
    description: {
      story:
        "Side-by-side comparison showing how the layout adapts across different screen sizes and canvas configurations.",
    },
  },
};
