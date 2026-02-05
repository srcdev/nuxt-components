import type { Meta, StoryFn } from "@nuxtjs/storybook";
import LayoutGridAComponent from "../LayoutGridA.vue";
import type { MediaCanvas } from "../../../types/components";

// Define the args interface
interface LayoutGridAArgs {
  mediaCanvas: MediaCanvas;
  styleClassPassthrough: string[];
}

export default {
  title: "Components/Layouts/LayoutGridA",
  component: LayoutGridAComponent,
  argTypes: {
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
    mediaCanvas: "desktopCanvas",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive 4-slot grid layout that transforms from mobile (stacked) to tablet (2x3 grid) to desktop (3x2 grid with slot1 spanning vertically). Uses container queries for responsive behavior.",
      },
    },
  },
} as Meta<LayoutGridAArgs>;

const Template: StoryFn<LayoutGridAArgs> = (args) => ({
  components: { LayoutGridAComponent },
  setup() {
    const sampleContent = {
      shortText: "Brief sample content for this slot.",
      mediumText:
        "This is a medium-length text sample that demonstrates how content adapts to different slot sizes and responsive breakpoints.",
      longText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };

    return { args, sampleContent };
  },
  template: `
    <div style="padding: 20px;" :class="args.mediaCanvas">
      <LayoutGridAComponent :style-class-passthrough="[args.mediaCanvas, ...args.styleClassPassthrough]">
        <template #slot1>
          <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 18px;">Primary Content</h3>
          <p style="margin: 0 0 12px 0; color: #6b7280; line-height: 1.5;">{{ sampleContent.longText }}</p>
          <p style="margin: 0; color: #6b7280; line-height: 1.5; opacity: 0.8;">This slot spans vertically on desktop layout (≥1060px) and spans full width on smaller screens.</p>
        </template>

        <template #slot2>
          <h3 style="margin: 0 0 16px 0; color: #7c3aed; font-size: 18px;">Featured Content</h3>
          <p style="margin: 0; color: #8b5cf6; line-height: 1.5;">{{ sampleContent.mediumText }}</p>
        </template>

        <template #slot3>
          <h3 style="margin: 0 0 16px 0; color: #059669; font-size: 18px;">Secondary Info</h3>
          <p style="margin: 0; color: #10b981; line-height: 1.5;">{{ sampleContent.mediumText }}</p>
        </template>

        <template #slot4>
          <h3 style="margin: 0 0 16px 0; color: #dc2626; font-size: 18px;">Additional Details</h3>
          <p style="margin: 0; color: #ef4444; line-height: 1.5;">{{ sampleContent.mediumText }}</p>
        </template>
      </LayoutGridAComponent>
    </div>
  `,
});

// ===== BASIC STORIES =====

export const Default = Template.bind({});
Default.args = {};

// ===== RESPONSIVE STORIES =====

export const MobileView = Template.bind({});
MobileView.args = {
  mediaCanvas: "mobileCanvas",
};
MobileView.parameters = {
  docs: {
    description: {
      story: "Mobile layout where all slots stack vertically in order (slot1 → slot2 → slot3 → slot4).",
    },
  },
};

export const TabletView = Template.bind({});
TabletView.args = {
  mediaCanvas: "tabletCanvas",
};
TabletView.parameters = {
  docs: {
    description: {
      story:
        "Tablet layout (≥768px) with 2×3 grid structure. Slot1 and slot2 span full width, while slot3 and slot4 are side-by-side in the bottom row.",
    },
  },
};

export const LaptopView = Template.bind({});
LaptopView.args = {
  mediaCanvas: "laptopCanvas",
};
LaptopView.parameters = {
  docs: {
    description: {
      story:
        "Laptop layout transitioning toward desktop breakpoint. Shows tablet layout behavior until 1060px width is reached.",
    },
  },
};

export const DesktopView = Template.bind({});
DesktopView.args = {
  mediaCanvas: "desktopCanvas",
};
DesktopView.parameters = {
  docs: {
    description: {
      story:
        "Desktop layout (≥1060px) with 3×2 grid. Slot1 spans vertically on the left, slot2 spans horizontally across the top-right, and slot3/slot4 are positioned in the bottom-right.",
    },
  },
};

export const FullWidthView = Template.bind({});
FullWidthView.args = {
  mediaCanvas: "fullWidthCanvas",
};
FullWidthView.parameters = {
  docs: {
    description: {
      story: "Full-width layout maintains desktop grid structure with maximum available space utilization.",
    },
  },
};

// ===== CONTENT VARIATION STORIES =====

const ContentVariationsTemplate: StoryFn<LayoutGridAArgs> = (args) => ({
  components: { LayoutGridAComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px;" :class="args.mediaCanvas">
      <LayoutGridAComponent :style-class-passthrough="[args.mediaCanvas]">
        <!-- Slot 1 - Main article content -->
        <template #slot1>
          <article style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px; margin: -20px; height: calc(100% + 40px); display: flex; flex-direction: column;">
            <h2 style="margin: 0 0 16px 0; font-size: 24px;">Featured Article</h2>
            <div style="flex: 1;">
              <p style="margin: 0 0 16px 0; opacity: 0.95; line-height: 1.6;">
                Discover the latest insights and trends in modern web development. This comprehensive guide covers
                everything you need to know about building scalable, responsive applications.
              </p>
              <p style="margin: 0 0 20px 0; opacity: 0.9; line-height: 1.6;">
                From CSS Grid and Container Queries to Vue 3 composition patterns, learn how to create stunning
                user interfaces that work seamlessly across all devices and screen sizes.
              </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="opacity: 0.8; font-size: 14px;">Published: Feb 5, 2026</span>
              <button style="padding: 10px 20px; background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; cursor: pointer;">
                Read More
              </button>
            </div>
          </article>
        </template>

        <!-- Slot 2 - Statistics dashboard -->
        <template #slot2>
          <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: -20px; height: calc(100% + 40px);">
            <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 18px;">Performance Overview</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;">
              <div style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 4px;">98.5%</div>
                <div style="font-size: 12px; color: #6b7280;">Uptime</div>
              </div>
              <div style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 4px;">1,247</div>
                <div style="font-size: 12px; color: #6b7280;">Active Users</div>
              </div>
              <div style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <div style="font-size: 28px; font-weight: bold; color: #f59e0b; margin-bottom: 4px;">342ms</div>
                <div style="font-size: 12px; color: #6b7280;">Avg Response</div>
              </div>
            </div>
          </div>
        </template>

        <!-- Slot 3 - Quick actions -->
        <template #slot3>
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; margin: -20px; height: calc(100% + 40px);">
            <h3 style="margin: 0 0 16px 0; font-size: 16px;">Quick Actions</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; cursor: pointer; text-align: left;">
                📊 View Analytics
              </button>
              <button style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; cursor: pointer; text-align: left;">
                ⚙️ Settings
              </button>
              <button style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; cursor: pointer; text-align: left;">
                👥 Manage Users
              </button>
            </div>
          </div>
        </template>

        <!-- Slot 4 - Recent activity -->
        <template #slot4>
          <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: -20px; height: calc(100% + 40px);">
            <h3 style="margin: 0 0 16px 0; color: #92400e; font-size: 16px;">Recent Activity</h3>
            <div style="space-y: 12px;">
              <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(146, 64, 14, 0.1);">
                <div style="width: 8px; height: 8px; background: #059669; border-radius: 50%; margin-right: 12px;"></div>
                <div style="flex: 1;">
                  <div style="font-size: 13px; color: #92400e;">New user registered</div>
                  <div style="font-size: 11px; color: #b45309; opacity: 0.7;">2 minutes ago</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(146, 64, 14, 0.1);">
                <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; margin-right: 12px;"></div>
                <div style="flex: 1;">
                  <div style="font-size: 13px; color: #92400e;">System backup completed</div>
                  <div style="font-size: 11px; color: #b45309; opacity: 0.7;">15 minutes ago</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; padding: 8px 0;">
                <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-right: 12px;"></div>
                <div style="flex: 1;">
                  <div style="font-size: 13px; color: #92400e;">Update available</div>
                  <div style="font-size: 11px; color: #b45309; opacity: 0.7;">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </LayoutGridAComponent>
    </div>
  `,
});

export const DashboardExample = ContentVariationsTemplate.bind({});
DashboardExample.args = {
  mediaCanvas: "desktopCanvas",
};
DashboardExample.parameters = {
  docs: {
    description: {
      story:
        "Complete dashboard example showcasing LayoutGridA with a featured article, performance metrics, quick actions, and activity feed. Demonstrates real-world usage with rich content.",
    },
  },
};

// ===== CONTENT LENGTH VARIATIONS =====

const ContentLengthTemplate: StoryFn<LayoutGridAArgs> = (args) => ({
  components: { LayoutGridAComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px;" :class="args.mediaCanvas">
      <LayoutGridAComponent :style-class-passthrough="[args.mediaCanvas]">
        <!-- Slot 1 - Short content -->
        <template #slot1>
          <h3 style="margin: 0 0 16px 0; color: #374151;">Short Content</h3>
          <p style="margin: 0; color: #6b7280;">Brief content example.</p>
        </template>

        <!-- Slot 2 - Medium content -->
        <template #slot2>
          <h3 style="margin: 0 0 16px 0; color: #7c3aed;">Medium Content</h3>
          <p style="margin: 0; color: #8b5cf6; line-height: 1.5;">
            This is a medium-length content example that demonstrates how the layout handles
            different content lengths across responsive breakpoints.
          </p>
        </template>

        <!-- Slot 3 - Long content -->
        <template #slot3>
          <h3 style="margin: 0 0 16px 0; color: #059669;">Long Content</h3>
          <p style="margin: 0; color: #10b981; line-height: 1.5;">
            This is a longer content example that shows how the grid layout adapts when one slot
            contains significantly more content than others. The container queries ensure that the
            layout remains stable and visually balanced regardless of content length variations
            across different screen sizes.
          </p>
        </template>

        <!-- Slot 4 - Variable content -->
        <template #slot4>
          <h3 style="margin: 0 0 16px 0; color: #dc2626;">Variable Content</h3>
          <ul style="margin: 0; color: #ef4444; line-height: 1.5;">
            <li>List item one</li>
            <li>List item two with more text</li>
            <li>List item three</li>
          </ul>
        </template>
      </LayoutGridAComponent>
    </div>
  `,
});

export const ContentLengthVariations = ContentLengthTemplate.bind({});
ContentLengthVariations.args = {
  mediaCanvas: "desktopCanvas",
};
ContentLengthVariations.parameters = {
  docs: {
    description: {
      story:
        "Demonstrates how the layout handles different content lengths in each slot, showing the grid's flexibility and stability.",
    },
  },
};

// ===== COMPARISON STORY =====

const ComparisonTemplate: StoryFn = () => ({
  components: { LayoutGridAComponent },
  setup() {
    const canvases: MediaCanvas[] = ["mobileCanvas", "tabletCanvas", "laptopCanvas", "desktopCanvas"];
    return { canvases };
  },
  template: `
    <div style="padding: 20px;">
      <h2 style="margin: 0 0 30px 0; text-align: center; color: #374151;">Responsive Layout Comparison</h2>
      <div style="display: grid; gap: 40px;">
        <div v-for="canvas in canvases" :key="canvas" :class="canvas">
          <h3 style="margin: 0 0 16px 0; color: #6b7280; text-transform: capitalize;">
            {{ canvas.replace('Canvas', '') }} Layout
            {{ canvas === 'mobileCanvas' ? '(< 768px)' : canvas === 'tabletCanvas' ? '(768px - 1059px)' : '(≥ 1060px)' }}
          </h3>
          <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; background: #fafafa;">
            <LayoutGridAComponent :style-class-passthrough="[canvas]">
              <template #slot1>
                <div style="background: #dbeafe; padding: 16px; border-radius: 8px; text-align: center; font-weight: bold; color: #1e40af; margin: -20px; height: calc(100% + 40px); display: flex; align-items: center; justify-content: center;">
                  Slot 1
                  <span v-if="canvas === 'desktopCanvas'" style="display: block; font-size: 12px; font-weight: normal; opacity: 0.8; margin-top: 4px;">
                    Spans Vertically
                  </span>
                </div>
              </template>

              <template #slot2>
                <div style="background: #f3e8ff; padding: 16px; border-radius: 8px; text-align: center; font-weight: bold; color: #7c3aed; margin: -20px; height: calc(100% + 40px); display: flex; align-items: center; justify-content: center;">
                  Slot 2
                  <span v-if="canvas === 'desktopCanvas'" style="display: block; font-size: 12px; font-weight: normal; opacity: 0.8; margin-top: 4px;">
                    Spans Horizontally
                  </span>
                </div>
              </template>

              <template #slot3>
                <div style="background: #dcfce7; padding: 16px; border-radius: 8px; text-align: center; font-weight: bold; color: #059669; margin: -20px; height: calc(100% + 40px); display: flex; align-items: center; justify-content: center;">
                  Slot 3
                </div>
              </template>

              <template #slot4>
                <div style="background: #fef3c7; padding: 16px; border-radius: 8px; text-align: center; font-weight: bold; color: #d97706; margin: -20px; height: calc(100% + 40px); display: flex; align-items: center; justify-content: center;">
                  Slot 4
                </div>
              </template>
            </LayoutGridAComponent>
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
        "Side-by-side comparison showing how LayoutGridA transforms across different responsive breakpoints. Notice how the layout changes from stacked (mobile) to 2×3 grid (tablet) to 3×2 grid with spanning elements (desktop).",
    },
  },
};
