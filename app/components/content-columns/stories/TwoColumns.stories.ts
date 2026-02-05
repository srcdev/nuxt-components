import type { Meta, StoryFn } from "@nuxtjs/storybook";
import TwoColumnsComponent from "../TwoColumns.vue";

// Define the args interface
interface TwoColumnsArgs {
  dataTestid: string;
  tag: string;
  styleClassPassthrough: string[];
}

export default {
  title: "Components/Layouts/TwoColumns",
  component: TwoColumnsComponent,
  argTypes: {
    // Semantic
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "aside", "header", "footer", "main", "nav"],
      description: "HTML tag to render as",
      table: {
        category: "Semantic",
      },
    },
    // Content
    dataTestid: {
      control: { type: "text" },
      description: "Test ID for the component",
      table: {
        category: "Testing",
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
    tag: "div",
    dataTestid: "two-column-layout",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive two-column layout component that uses CSS Container Queries. Displays content in a single column on smaller containers (< 1064px) and switches to a two-column grid layout on larger containers (≥ 1064px).",
      },
    },
  },
} as Meta<TwoColumnsArgs>;

const Template: StoryFn<TwoColumnsArgs> = (args) => ({
  components: { TwoColumnsComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 40px 20px; min-height: 60vh;">
      <TwoColumnsComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #col1>
          <div style="padding: 24px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); height: 100%;">
            <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 20px; font-weight: 600;">
              🏠 Left Column
            </h3>
            <p style="margin: 0 0 16px 0; color: #374151; line-height: 1.6;">
              This is the first column content. On smaller containers (< 1064px), this will appear above the second column in a single-column layout.
            </p>
            <div style="padding: 16px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 500;">
                💡 Container Query: This layout responds to the container width, not the viewport width.
              </p>
            </div>
          </div>
        </template>
        <template #col2>
          <div style="padding: 24px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); height: 100%;">
            <h3 style="margin: 0 0 16px 0; color: #dc2626; font-size: 20px; font-weight: 600;">
              🎯 Right Column
            </h3>
            <p style="margin: 0 0 16px 0; color: #374151; line-height: 1.6;">
              This is the second column content. When the container reaches 1064px or wider, both columns will display side by side with equal widths.
            </p>
            <div style="padding: 16px; background: #fecaca; border-radius: 8px; border-left: 4px solid #ef4444;">
              <p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 500;">
                🚀 Responsive: Automatic mobile-first responsive behavior without media queries.
              </p>
            </div>
          </div>
        </template>
      </TwoColumnsComponent>
    </div>
  `,
});

// ===== BASIC STORIES =====

export const Default = Template.bind({});
Default.args = {};

// ===== SEMANTIC TAG STORIES =====

const SemanticTemplate: StoryFn<TwoColumnsArgs> = (args) => ({
  components: { TwoColumnsComponent },
  setup() {
    const getTagInfo = (tag: string) => {
      const tagInfo = {
        div: { description: "Generic container", use: "Default wrapper for general content" },
        section: { description: "Thematic grouping", use: "Related content sections" },
        article: { description: "Self-contained content", use: "Blog posts, news articles" },
        aside: { description: "Tangentially related", use: "Sidebars, supplementary content" },
        header: { description: "Introductory content", use: "Page headers, section headers" },
        footer: { description: "Footer information", use: "Page footers, credits" },
        main: { description: "Main content", use: "Primary page content" },
        nav: { description: "Navigation links", use: "Navigation menus, site structure" },
      };
      return tagInfo[tag as keyof typeof tagInfo] || { description: "Generic container", use: "Default usage" };
    };

    return { args, getTagInfo };
  },
  template: `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
      <TwoColumnsComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #col1>
          <div style="padding: 30px; background: white; border-radius: 12px; text-align: center;">
            <div style="display: inline-block; padding: 8px 16px; background: #667eea; color: white; border-radius: 6px; font-family: monospace; font-size: 16px; margin-bottom: 20px;">
              &lt;{{ args.tag }}&gt;
            </div>
            <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 20px;">
              {{ getTagInfo(args.tag).description }}
            </h3>
            <p style="margin: 0; color: #6b7280; line-height: 1.5;">
              {{ getTagInfo(args.tag).use }}
            </p>
          </div>
        </template>
        <template #col2>
          <div style="padding: 30px; background: rgba(255, 255, 255, 0.95); border-radius: 12px;">
            <h4 style="margin: 0 0 16px 0; color: #374151; font-size: 18px;">Semantic Benefits</h4>
            <ul style="margin: 0; color: #6b7280; line-height: 1.6; padding-left: 20px;">
              <li>Better accessibility for screen readers</li>
              <li>Improved SEO and document structure</li>
              <li>Clearer code intent and maintainability</li>
              <li>Enhanced landmark navigation</li>
            </ul>
            <div style="padding: 16px; background: #f0f9ff; border-radius: 8px; margin-top: 16px;">
              <p style="margin: 0; color: #3730a3; font-size: 14px; font-weight: 500;">
                Choose semantic tags that match your content's purpose and structure.
              </p>
            </div>
          </div>
        </template>
      </TwoColumnsComponent>
    </div>
  `,
});

export const SemanticSection = SemanticTemplate.bind({});
SemanticSection.args = {
  tag: "section",
};

export const SemanticArticle = SemanticTemplate.bind({});
SemanticArticle.args = {
  tag: "article",
};

export const SemanticAside = SemanticTemplate.bind({});
SemanticAside.args = {
  tag: "aside",
};

// ===== CONTENT EXAMPLES =====

const ContentExampleTemplate: StoryFn<TwoColumnsArgs> = (args) => ({
  components: { TwoColumnsComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: #f9fafb; padding: 20px;">
      <TwoColumnsComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #col1>
          <article style="padding: 32px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 28px; font-weight: 700;">
              Understanding Container Queries
            </h2>
            <p style="margin: 0 0 20px 0; color: #374151; line-height: 1.7; font-size: 16px;">
              Container queries allow components to respond to their own size rather than the viewport size.
              This two-column layout demonstrates this concept perfectly.
            </p>
            <p style="margin: 0 0 20px 0; color: #374151; line-height: 1.7;">
              When the container is narrower than 1064px, content flows in a single column. Once it reaches
              that threshold, it switches to the two-column grid layout automatically.
            </p>
            <div style="padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px;">Key Advantages</h3>
              <ul style="margin: 0; color: #1e40af; line-height: 1.6;">
                <li>Component-based responsive design</li>
                <li>No dependency on viewport size</li>
                <li>Truly reusable across contexts</li>
              </ul>
            </div>
          </article>
        </template>
        <template #col2>
          <div style="padding: 32px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); height: fit-content;">
            <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
              Technical Implementation
            </h3>

            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #059669; font-size: 16px; font-weight: 600;">Container Setup</h4>
              <pre style="background: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 6px; font-size: 12px; overflow-x: auto; margin: 0;"><code>container-type: inline-size;
container-name: two-column-layout;</code></pre>
            </div>

            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #7c3aed; font-size: 16px; font-weight: 600;">Responsive Grid</h4>
              <pre style="background: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 6px; font-size: 12px; overflow-x: auto; margin: 0;"><code>@container two-column-layout (width >= 1064px) {
  grid-template-columns: repeat(2, 1fr);
}</code></pre>
            </div>

            <div style="padding: 16px; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #6b7280;">
              <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
                This approach ensures consistent behavior regardless of where the component is placed
                in your application layout.
              </p>
            </div>
          </div>
        </template>
      </TwoColumnsComponent>
    </div>
  `,
});

export const TechnicalArticle = ContentExampleTemplate.bind({});
TechnicalArticle.args = {
  tag: "article",
};
TechnicalArticle.parameters = {
  docs: {
    description: {
      story:
        "Example of a technical article layout showing how content flows between the two columns with detailed implementation information.",
    },
  },
};

// ===== FEATURE SHOWCASE STORIES =====

const FeatureTemplate: StoryFn<TwoColumnsArgs> = (args) => ({
  components: { TwoColumnsComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%); padding: 40px 20px;">
      <TwoColumnsComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #col1>
          <div style="padding: 32px; background: white; border-radius: 16px; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                ⚡
              </div>
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 24px; font-weight: 700;">
                Premium Features
              </h3>
              <p style="margin: 0; color: #6b7280; font-size: 16px;">
                Everything you need to succeed
              </p>
            </div>

            <div style="space-y: 16px;">
              <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 16px;">
                <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                  <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                </div>
                <div>
                  <h4 style="margin: 0 0 4px 0; color: #374151; font-size: 16px; font-weight: 600;">Container Query Responsive</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Adapts to container size, not viewport</p>
                </div>
              </div>

              <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 16px;">
                <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                  <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                </div>
                <div>
                  <h4 style="margin: 0 0 4px 0; color: #374151; font-size: 16px; font-weight: 600;">Semantic HTML Support</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Choose from 8 semantic HTML tags</p>
                </div>
              </div>

              <div style="display: flex; align-items: start; gap: 12px;">
                <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                  <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                </div>
                <div>
                  <h4 style="margin: 0 0 4px 0; color: #374151; font-size: 16px; font-weight: 600;">Flexible Content Slots</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Named slots for organized content</p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #col2>
          <div style="padding: 32px; background: white; border-radius: 16px; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);">
            <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
              💡 How It Works
            </h3>

            <div style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 2px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 32px; height: 32px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">1</div>
                <h4 style="margin: 0; color: #374151; font-size: 16px; font-weight: 600;">Mobile First</h4>
              </div>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                Content stacks vertically in a single column layout on smaller containers
              </p>
            </div>

            <div style="margin-bottom: 24px; padding: 20px; background: #f0fdf4; border-radius: 12px; border: 2px solid #bbf7d0;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 32px; height: 32px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">2</div>
                <h4 style="margin: 0; color: #374151; font-size: 16px; font-weight: 600;">Desktop Responsive</h4>
              </div>
              <p style="margin: 0; color: #059669; font-size: 14px; line-height: 1.5;">
                Automatically switches to two-column grid when container reaches 1064px
              </p>
            </div>

            <div style="padding: 16px; background: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5; font-weight: 500;">
                🎯 Perfect for dashboards, content layouts, and component libraries where context matters more than screen size.
              </p>
            </div>
          </div>
        </template>
      </TwoColumnsComponent>
    </div>
  `,
});

export const FeatureShowcase = FeatureTemplate.bind({});
FeatureShowcase.args = {};
FeatureShowcase.parameters = {
  docs: {
    description: {
      story:
        "Feature showcase demonstrating the key capabilities and benefits of the TwoColumns component with visual examples.",
    },
  },
};

// ===== SINGLE COLUMN DEMONSTRATION =====

const SingleColumnTemplate: StoryFn<TwoColumnsArgs> = (args) => ({
  components: { TwoColumnsComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: #f3f4f6; padding: 20px;">
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="margin: 0 0 8px 0; color: #374151; font-size: 24px;">Single Column Content</h2>
        <p style="margin: 0; color: #6b7280;">Only one slot provided - layout adapts accordingly</p>
      </div>

      <TwoColumnsComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template #col1>
          <div style="padding: 32px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="margin: 0 0 16px 0; color: #7c3aed; font-size: 22px; font-weight: 600;">
              🎨 Creative Content Block
            </h3>
            <p style="margin: 0 0 20px 0; color: #374151; line-height: 1.7; font-size: 16px;">
              When only one column is provided, the component gracefully handles the single-column layout.
              This demonstrates the component's flexibility in handling partial content scenarios.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;">
              <div style="padding: 16px; background: #fef3c7; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
                <h4 style="margin: 0 0 4px 0; color: #92400e; font-size: 14px; font-weight: 600;">Mobile</h4>
                <p style="margin: 0; color: #b45309; font-size: 12px;">Single column</p>
              </div>
              <div style="padding: 16px; background: #dbeafe; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">💻</div>
                <h4 style="margin: 0 0 4px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Desktop</h4>
                <p style="margin: 0; color: #1e40af; font-size: 12px;">Still single column</p>
              </div>
            </div>

            <div style="padding: 20px; background: #f0fdf4; border-radius: 10px; border-left: 4px solid #10b981;">
              <h4 style="margin: 0 0 8px 0; color: #059669; font-size: 16px;">Flexible Architecture</h4>
              <p style="margin: 0; color: #065f46; line-height: 1.5;">
                The component only renders columns that have content, making it perfect for dynamic
                content scenarios where you might not always have content for both columns.
              </p>
            </div>
          </div>
        </template>
        <!-- col2 intentionally left empty -->
      </TwoColumnsComponent>
    </div>
  `,
});

export const SingleColumn = SingleColumnTemplate.bind({});
SingleColumn.args = {};
SingleColumn.parameters = {
  docs: {
    description: {
      story:
        "Demonstrates the component's behavior when only one column has content - shows the graceful handling of partial content scenarios.",
    },
  },
};

// ===== RESPONSIVE DEMONSTRATION =====

const ResponsiveTemplate: StoryFn = () => ({
  components: { TwoColumnsComponent },
  template: `
    <div style="background: #f8fafc; padding: 20px;">
      <div style="margin-bottom: 40px; text-align: center;">
        <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 28px;">
          🔄 Responsive Behavior Demo
        </h2>
        <p style="margin: 0 0 32px 0; color: #6b7280; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Resize your browser to see how the layout responds to container width changes.
          The breakpoint is at 1064px container width, not viewport width.
        </p>
      </div>

      <!-- Small container demonstration -->
      <div style="margin-bottom: 40px;">
        <h3 style="margin: 0 0 16px 0; color: #374151;">📱 Narrow Container (< 1064px)</h3>
        <div style="max-width: 800px; border: 2px dashed #cbd5e1; padding: 20px; margin-bottom: 20px;">
          <TwoColumnsComponent tag="div">
            <template #col1>
              <div style="padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 16px;">Column 1</h4>
                <p style="margin: 0; color: #b45309; font-size: 14px;">Stacked vertically</p>
              </div>
            </template>
            <template #col2>
              <div style="padding: 20px; background: #fecaca; border-radius: 8px;">
                <h4 style="margin: 0 0 8px 0; color: #dc2626; font-size: 16px;">Column 2</h4>
                <p style="margin: 0; color: #b91c1c; font-size: 14px;">Appears below Column 1</p>
              </div>
            </template>
          </TwoColumnsComponent>
        </div>
      </div>

      <!-- Large container demonstration -->
      <div style="margin-bottom: 40px;">
        <h3 style="margin: 0 0 16px 0; color: #374151;">🖥️ Wide Container (≥ 1064px)</h3>
        <div style="border: 2px dashed #cbd5e1; padding: 20px;">
          <TwoColumnsComponent tag="div">
            <template #col1>
              <div style="padding: 20px; background: #dcfce7; border-radius: 8px;">
                <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 16px;">Column 1</h4>
                <p style="margin: 0; color: #15803d; font-size: 14px;">Side-by-side layout</p>
              </div>
            </template>
            <template #col2>
              <div style="padding: 20px; background: #ddd6fe; border-radius: 8px;">
                <h4 style="margin: 0 0 8px 0; color: #7c3aed; font-size: 16px;">Column 2</h4>
                <p style="margin: 0; color: #6d28d9; font-size: 14px;">Equal width columns with 32px gap</p>
              </div>
            </template>
          </TwoColumnsComponent>
        </div>
      </div>

      <!-- Technical explanation -->
      <TwoColumnsComponent tag="section">
        <template #col1>
          <div style="padding: 24px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 20px; font-weight: 600;">⚙️ How It Works</h3>
            <div style="space-y: 16px;">
              <div style="padding: 16px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Container Queries</h4>
                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
                  Uses <code>@container</code> to respond to the component's width, not the browser viewport.
                </p>
              </div>

              <div style="padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #15803d; font-size: 14px; font-weight: 600;">CSS Grid Layout</h4>
                <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.5;">
                  Switches from <code>grid-auto-flow: row</code> to <code>grid-template-columns: repeat(2, 1fr)</code>
                </p>
              </div>

              <div style="padding: 16px; background: #fefce8; border-radius: 8px; border-left: 4px solid #eab308;">
                <h4 style="margin: 0 0 8px 0; color: #a16207; font-size: 14px; font-weight: 600;">1064px Breakpoint</h4>
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  Optimal width for two-column layouts with comfortable reading experience.
                </p>
              </div>
            </div>
          </div>
        </template>
        <template #col2>
          <div style="padding: 24px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 20px; font-weight: 600;">📊 Benefits</h3>
            <ul style="margin: 0; color: #374151; line-height: 1.7; padding-left: 20px;">
              <li><strong>Component Reusability:</strong> Works in any container context</li>
              <li><strong>Performance:</strong> No JavaScript required for responsive behavior</li>
              <li><strong>Maintainability:</strong> Self-contained responsive logic</li>
              <li><strong>User Experience:</strong> Smooth, predictable layout transitions</li>
            </ul>

            <div style="padding: 20px; background: #fef7ff; border-radius: 10px; margin-top: 20px; border-left: 4px solid #a855f7;">
              <p style="margin: 0; color: #7c3aed; font-size: 14px; line-height: 1.6; font-weight: 500;">
                💡 <strong>Pro Tip:</strong> Container queries make this component truly modular - it behaves
                consistently whether it's in a sidebar, main content area, or modal dialog.
              </p>
            </div>
          </div>
        </template>
      </TwoColumnsComponent>
    </div>
  `,
});

export const ResponsiveBehavior = ResponsiveTemplate.bind({});
ResponsiveBehavior.parameters = {
  docs: {
    description: {
      story:
        "Interactive demonstration showing how the TwoColumns component responds to different container widths using CSS Container Queries. The layout switches from single-column to two-column at 1064px container width.",
    },
  },
};
