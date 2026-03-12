import type { Meta, StoryObj } from "@nuxtjs/storybook";
import { computed } from "vue";
import ContentWidthComponent from "../ContentWidth.vue";

interface ContentWidthArgs {
  dataTestid: string;
  tag: string;
  id?: string;
  styleClassPassthrough: string[];
  isLandmark: boolean;
  justifyContent: "start" | "center" | "end";
  showBackground: boolean;
}

type Story = StoryObj<ContentWidthArgs>;

export default {
  title: "Atoms/Content Wrappers/Content Width",
  component: ContentWidthComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "HTML tag to render as",
      table: { category: "Semantic" },
    },
    isLandmark: {
      control: { type: "boolean" },
      description: "Whether this element should be a landmark (adds tabindex and aria-label)",
      table: { category: "Accessibility" },
    },
    justifyContent: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Horizontal alignment of the content track at ≥1092px",
      table: { category: "Layout" },
    },
    showBackground: {
      control: { type: "boolean" },
      description: "Highlight the wrapper background to compare wrapper vs content track width",
      table: { category: "Debug" },
    },
    dataTestid: {
      control: { type: "text" },
      description: "Test ID for the inner content width element",
      table: { category: "Testing" },
    },
    id: {
      control: { type: "text" },
      description: "ID attribute for the component",
      table: { category: "HTML" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    tag: "div",
    isLandmark: false,
    justifyContent: "center",
    showBackground: false,
    dataTestid: "content-width",
    id: "",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive content width wrapper that uses CSS Container Queries to provide optimal content width. Automatically adjusts from fluid width on small screens to a maximum 1064px width on larger screens (≥1092px) with proper gutters.",
      },
    },
  },
} as Meta<ContentWidthArgs>;

// ===== BASIC STORIES =====

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { ContentWidthComponent },
    setup() {
      const longText =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.";
      const wrapperStyle = computed(() => (args.showBackground ? { background: "rgba(99, 102, 241, 0.15)" } : {}));
      return { args, longText, wrapperStyle };
    },
    template: `
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); min-height: 100vh; padding: 20px 0;">
        <ContentWidthComponent
          :data-testid="args.dataTestid"
          :tag="args.tag"
          :style-class-passthrough="args.styleClassPassthrough"
          :is-landmark="args.isLandmark"
          :justify-content="args.justifyContent"
          :style="wrapperStyle"
        >
          <div style="padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 24px;">Content Width Example</h2>
            <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.6;">{{ longText }}</p>
            <div style="padding: 16px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">Container Behavior</h3>
              <ul style="margin: 0; color: #6b7280; line-height: 1.5; padding-left: 20px;">
                <li><strong>Small screens:</strong> Fluid width with 16px gutters</li>
                <li><strong>≥1092px screens:</strong> Fixed 1064px max-width, centered</li>
                <li><strong>Container queries:</strong> Responsive layout without media queries</li>
              </ul>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 14px; font-family: monospace; background: #e5e7eb; padding: 8px; border-radius: 4px;">
              Tag: {{ args.tag }} | Landmark: {{ args.isLandmark ? 'Yes' : 'No' }}
            </p>
          </div>
        </ContentWidthComponent>
      </div>
    `,
  }),
};

// ===== SEMANTIC TAG STORIES =====

const semanticRender = (args: ContentWidthArgs) => ({
  components: { ContentWidthComponent },
  setup() {
    const tagInfo: Record<string, { description: string; use: string }> = {
      div: { description: "Generic container", use: "Default wrapper element" },
      section: { description: "Thematic grouping", use: "Groups related content together" },
      article: { description: "Self-contained content", use: "Blog posts, news articles, user comments" },
      aside: { description: "Tangentially related", use: "Sidebars, pull quotes, advertising" },
      header: { description: "Introductory content", use: "Page headers, section headers" },
      footer: { description: "Footer information", use: "Page footers, section footers" },
      main: { description: "Main content", use: "Primary content of the document" },
      nav: { description: "Navigation links", use: "Navigation menus, breadcrumbs" },
    };
    const info = computed(() => tagInfo[args.tag] ?? { description: "Generic container", use: "Default usage" });
    const wrapperStyle = computed(() => (args.showBackground ? { background: "rgba(99, 102, 241, 0.15)" } : {}));
    return { args, info, wrapperStyle };
  },
  template: `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 60vh; padding: 40px 0;">
      <ContentWidthComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
        :justify-content="args.justifyContent"
        :style="wrapperStyle"
      >
        <div style="padding: 30px; background: white; border-radius: 12px; text-align: center;">
          <div style="display: inline-block; padding: 8px 16px; background: #667eea; color: white; border-radius: 6px; font-family: monospace; font-size: 16px; margin-bottom: 20px;">
            &lt;{{ args.tag }}&gt;
          </div>
          <h2 style="margin: 0 0 12px 0; color: #374151; font-size: 22px;">{{ info.description }}</h2>
          <p style="margin: 0 0 20px 0; color: #6b7280; line-height: 1.5; max-width: 400px; margin-left: auto; margin-right: auto;">{{ info.use }}</p>
          <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #374151; font-size: 14px;">
              This semantic element helps structure your content meaningfully for both users and assistive technologies.
            </p>
          </div>
        </div>
      </ContentWidthComponent>
    </div>
  `,
});

export const SemanticSection: Story = { args: { tag: "section" }, render: semanticRender };
export const SemanticArticle: Story = { args: { tag: "article" }, render: semanticRender };
export const SemanticAside: Story = { args: { tag: "aside" }, render: semanticRender };
export const SemanticHeader: Story = { args: { tag: "header" }, render: semanticRender };
export const SemanticMain: Story = { args: { tag: "main", isLandmark: true }, render: semanticRender };
export const SemanticNav: Story = { args: { tag: "nav", isLandmark: true }, render: semanticRender };

// ===== CONTENT EXAMPLES =====

export const BlogArticle: Story = {
  args: { tag: "article" },
  parameters: {
    docs: {
      description: {
        story:
          "Example of a blog article layout showing how ContentWidth provides optimal reading width and responsive behavior.",
      },
    },
  },
  render: (args) => ({
    components: { ContentWidthComponent },
    setup() {
      const wrapperStyle = computed(() => (args.showBackground ? { background: "rgba(99, 102, 241, 0.15)" } : {}));
      return { args, wrapperStyle };
    },
    template: `
      <div style="background: #f9fafb;">
        <ContentWidthComponent
          :data-testid="args.dataTestid"
          :tag="args.tag"
          :style-class-passthrough="args.styleClassPassthrough"
          :is-landmark="args.isLandmark"
          :justify-content="args.justifyContent"
          :style="wrapperStyle"
        >
          <article style="padding: 40px; background: white; border-radius: 0;">
            <header style="margin-bottom: 30px; text-align: center;">
              <h1 style="margin: 0 0 8px 0; color: #1f2937; font-size: 32px; font-weight: 700;">The Art of Responsive Design</h1>
              <p style="margin: 0; color: #6b7280; font-size: 16px;">How container queries are revolutionizing web layouts</p>
            </header>
            <div style="line-height: 1.7; color: #374151;">
              <p style="margin: 0 0 24px 0; font-size: 18px; color: #4b5563;">
                Container queries represent a paradigm shift in responsive design, moving beyond viewport-based breakpoints
                to component-centric layouts that adapt to their container's size rather than the entire screen.
              </p>
              <pre style="background: #1f2937; color: #e5e7eb; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 24px 0; font-size: 14px; line-height: 1.4;"><code>container-type: inline-size;
container-name: content-width;

@container content-width (width >= 1092px) {
  --content-max-width: 1064px;
  --gutter: 0;
}</code></pre>
              <p style="margin: 0;">
                This approach creates more maintainable, flexible layouts that work consistently regardless of
                where the component is placed in your application.
              </p>
            </div>
          </article>
        </ContentWidthComponent>
      </div>
    `,
  }),
};

// ===== ACCESSIBILITY STORIES =====

const accessibilityRender = (args: ContentWidthArgs) => ({
  components: { ContentWidthComponent },
  setup() {
    const wrapperStyle = computed(() => (args.showBackground ? { background: "rgba(99, 102, 241, 0.15)" } : {}));
    return { args, wrapperStyle };
  },
  template: `
    <div style="background: #f3f4f6; padding: 20px;">
      <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <h3 style="margin: 0 0 16px 0; color: #374151;">Accessibility Features</h3>
        <div style="padding: 12px; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #6366f1;">
          <strong style="color: #4338ca;">Current state:</strong>
          {{ args.isLandmark ? 'Landmark enabled (focusable, labeled)' : 'Standard wrapper (no landmark features)' }}
        </div>
      </div>
      <ContentWidthComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
        :justify-content="args.justifyContent"
        :style="wrapperStyle"
      >
        <div style="padding: 24px; background: white; border-radius: 8px; border: 2px solid #d1d5db;">
          <div :style="{
            padding: '16px',
            background: args.isLandmark ? '#dbeafe' : '#f9fafb',
            borderRadius: '8px',
            border: args.isLandmark ? '2px solid #3b82f6' : '2px solid #e5e7eb'
          }">
            <h3 style="margin: 0 0 12px 0; color: #374151;">
              {{ args.isLandmark ? '🏷️ Landmark Wrapper' : '📦 Standard Wrapper' }}
            </h3>
            <div style="font-family: monospace; font-size: 12px; background: rgba(0, 0, 0, 0.05); padding: 8px; border-radius: 4px;">
              <div>tabIndex: {{ args.isLandmark ? '0' : 'null' }}</div>
              <div>aria-label: {{ args.isLandmark ? '"Content Width Landmark"' : 'undefined' }}</div>
            </div>
          </div>
        </div>
      </ContentWidthComponent>
    </div>
  `,
});

export const WithLandmark: Story = {
  args: { tag: "section", isLandmark: true },
  parameters: {
    docs: {
      description: {
        story:
          "ContentWidth with landmark accessibility features enabled - makes the wrapper focusable and properly labeled for assistive technologies.",
      },
    },
  },
  render: accessibilityRender,
};

export const WithoutLandmark: Story = {
  args: { tag: "div", isLandmark: false },
  parameters: {
    docs: {
      description: {
        story: "Standard ContentWidth without landmark features - regular content width wrapper behavior.",
      },
    },
  },
  render: accessibilityRender,
};

// ===== RESPONSIVE DEMONSTRATION =====

export const ResponsiveBehavior: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demonstration of how ContentWidth responds to different container widths using CSS Container Queries instead of media queries.",
      },
    },
  },
  render: () => ({
    components: { ContentWidthComponent },
    template: `
      <div style="background: #f8fafc; padding: 20px;">
        <div style="margin-bottom: 40px;">
          <h2 style="text-align: center; margin: 0 0 16px 0; color: #374151; font-size: 28px;">Responsive Behavior Demonstration</h2>
          <p style="text-align: center; margin: 0 0 32px 0; color: #6b7280; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
            ContentWidth adapts its layout based on its own width using container queries.
            Resize your browser to see the responsive behavior in action.
          </p>
        </div>
        <div style="margin-bottom: 40px;">
          <h3 style="margin: 0 0 16px 0; color: #374151;">Narrow Container (&lt; 1092px)</h3>
          <div style="max-width: 800px; border: 2px dashed #cbd5e1; padding: 20px; margin-bottom: 20px;">
            <ContentWidthComponent tag="div">
              <div style="padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center;">
                <h4 style="margin: 0 0 8px 0; color: #92400e;">Fluid Width Mode</h4>
                <p style="margin: 0; color: #b45309; font-size: 14px;">Content uses available width with 16px gutters on each side</p>
              </div>
            </ContentWidthComponent>
          </div>
        </div>
        <div style="margin-bottom: 40px;">
          <h3 style="margin: 0 0 16px 0; color: #374151;">Wide Container (≥ 1092px)</h3>
          <div style="border: 2px dashed #cbd5e1; padding: 20px;">
            <ContentWidthComponent tag="div">
              <div style="padding: 20px; background: #dcfce7; border-radius: 8px; text-align: center;">
                <h4 style="margin: 0 0 8px 0; color: #166534;">Fixed Width Mode</h4>
                <p style="margin: 0; color: #15803d; font-size: 14px;">Content is constrained to 1064px max-width and centered within the container</p>
              </div>
            </ContentWidthComponent>
          </div>
        </div>
        <ContentWidthComponent tag="section">
          <div style="padding: 24px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="margin: 0 0 16px 0; color: #374151;">How It Works</h3>
            <div style="display: grid; gap: 16px;">
              <div style="padding: 16px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Container Queries</h4>
                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">Uses <code>@container</code> rules to respond to the container's own width, not the viewport width.</p>
              </div>
              <div style="padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
                <h4 style="margin: 0 0 8px 0; color: #15803d; font-size: 14px; font-weight: 600;">CSS Grid Layout</h4>
                <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.5;">Named grid lines create flexible layouts that adapt to content needs automatically.</p>
              </div>
            </div>
          </div>
        </ContentWidthComponent>
      </div>
    `,
  }),
};
