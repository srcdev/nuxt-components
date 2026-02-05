import type { Meta, StoryFn } from "@nuxtjs/storybook";
import ContentContainerComponent from "../ContentContainer.vue";

// Define the args interface
interface ContentContainerArgs {
  dataTestid: string;
  tag: string;
  id?: string;
  styleClassPassthrough: string[];
  isLandmark: boolean;
}

export default {
  title: "Components/Layouts/ContentContainer",
  component: ContentContainerComponent,
  argTypes: {
    // Semantic
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"],
      description: "HTML tag to render as",
      table: {
        category: "Semantic",
      },
    },
    isLandmark: {
      control: { type: "boolean" },
      description: "Whether this element should be a landmark (adds tabindex and aria-label)",
      table: {
        category: "Accessibility",
      },
    },
    // Content
    dataTestid: {
      control: { type: "text" },
      description: "Test ID for the inner content container element",
      table: {
        category: "Testing",
      },
    },
    id: {
      control: { type: "text" },
      description: "ID attribute for the component",
      table: {
        category: "HTML",
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
    isLandmark: false,
    dataTestid: "content-container",
    id: "",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A responsive content container that uses CSS Container Queries to provide optimal content width. Automatically adjusts from fluid width on small screens to a maximum 1064px width on larger screens (≥1064px) with proper gutters.",
      },
    },
  },
} as Meta<ContentContainerArgs>;

const Template: StoryFn<ContentContainerArgs> = (args) => ({
  components: { ContentContainerComponent },
  setup() {
    const sampleContent = {
      shortText: "Brief sample content.",
      mediumText:
        "This is a medium-length text example that demonstrates how the content container adapts to different screen sizes and maintains optimal reading width.",
      longText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    };

    return { args, sampleContent };
  },
  template: `
    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); min-height: 100vh; padding: 20px 0;">
      <ContentContainerComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :id="args.id || undefined"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 24px;">
            Content Container Example
          </h2>
          <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.6;">
            {{ sampleContent.longText }}
          </p>
          <div style="padding: 16px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
            <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">Container Behavior</h3>
            <ul style="margin: 0; color: #6b7280; line-height: 1.5; padding-left: 20px;">
              <li><strong>Small screens:</strong> Fluid width with 16px gutters</li>
              <li><strong>≥1064px screens:</strong> Fixed 1064px max-width, centered</li>
              <li><strong>Container queries:</strong> Responsive layout without media queries</li>
            </ul>
          </div>
          <p style="margin: 0; color: #6b7280; font-size: 14px; font-family: monospace; background: #e5e7eb; padding: 8px; border-radius: 4px;">
            Tag: {{ args.tag }} | Landmark: {{ args.isLandmark ? 'Yes' : 'No' }}
          </p>
        </div>
      </ContentContainerComponent>
    </div>
  `,
});

// ===== BASIC STORIES =====

export const Default = Template.bind({});
Default.args = {};

// ===== SEMANTIC TAG STORIES =====

const SemanticTemplate: StoryFn<ContentContainerArgs> = (args) => ({
  components: { ContentContainerComponent },
  setup() {
    const getTagInfo = (tag: string) => {
      const tagInfo = {
        div: { description: "Generic container", use: "Default wrapper element" },
        section: { description: "Thematic grouping", use: "Groups related content together" },
        article: { description: "Self-contained content", use: "Blog posts, news articles, user comments" },
        aside: { description: "Tangentially related", use: "Sidebars, pull quotes, advertising" },
        header: { description: "Introductory content", use: "Page headers, section headers" },
        footer: { description: "Footer information", use: "Page footers, section footers" },
        main: { description: "Main content", use: "Primary content of the document" },
        nav: { description: "Navigation links", use: "Navigation menus, breadcrumbs" },
      };
      return tagInfo[tag as keyof typeof tagInfo] || { description: "Generic container", use: "Default usage" };
    };

    return { args, getTagInfo };
  },
  template: `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 60vh; padding: 40px 0;">
      <ContentContainerComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 30px; background: white; border-radius: 12px; text-align: center;">
          <div style="display: inline-block; padding: 8px 16px; background: #667eea; color: white; border-radius: 6px; font-family: monospace; font-size: 16px; margin-bottom: 20px;">
            &lt;{{ args.tag }}&gt;
          </div>
          <h2 style="margin: 0 0 12px 0; color: #374151; font-size: 22px;">
            {{ getTagInfo(args.tag).description }}
          </h2>
          <p style="margin: 0 0 20px 0; color: #6b7280; line-height: 1.5; max-width: 400px; margin-left: auto; margin-right: auto;">
            {{ getTagInfo(args.tag).use }}
          </p>
          <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #374151; font-size: 14px;">
              This semantic element helps structure your content meaningfully for both users and assistive technologies.
            </p>
          </div>
        </div>
      </ContentContainerComponent>
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

export const SemanticHeader = SemanticTemplate.bind({});
SemanticHeader.args = {
  tag: "header",
};

export const SemanticMain = SemanticTemplate.bind({});
SemanticMain.args = {
  tag: "main",
  isLandmark: true,
};

export const SemanticNav = SemanticTemplate.bind({});
SemanticNav.args = {
  tag: "nav",
  isLandmark: true,
};

// ===== CONTENT EXAMPLES =====

const ContentExampleTemplate: StoryFn<ContentContainerArgs> = (args) => ({
  components: { ContentContainerComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: #f9fafb;">
      <ContentContainerComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <article style="padding: 40px; background: white; border-radius: 0;">
          <header style="margin-bottom: 30px; text-align: center;">
            <h1 style="margin: 0 0 8px 0; color: #1f2937; font-size: 32px; font-weight: 700;">
              The Art of Responsive Design
            </h1>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">
              How container queries are revolutionizing web layouts
            </p>
          </header>

          <div style="line-height: 1.7; color: #374151;">
            <p style="margin: 0 0 24px 0; font-size: 18px; color: #4b5563;">
              Container queries represent a paradigm shift in responsive design, moving beyond viewport-based breakpoints
              to component-centric layouts that adapt to their container's size rather than the entire screen.
            </p>

            <h2 style="margin: 32px 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
              Understanding Container Queries
            </h2>

            <p style="margin: 0 0 16px 0;">
              Traditional media queries respond to viewport dimensions, but container queries respond to the size of
              a specific element. This ContentContainer component demonstrates this concept by adjusting its layout
              based on its own width, not the browser's width.
            </p>

            <div style="padding: 24px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; margin: 24px 0;">
              <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 16px; font-weight: 600;">Key Benefits</h3>
              <ul style="margin: 0; color: #1e40af;">
                <li>Components are truly reusable across different contexts</li>
                <li>No need to know parent container dimensions</li>
                <li>More granular control over responsive behavior</li>
              </ul>
            </div>

            <p style="margin: 0 0 16px 0;">
              In this component, content flows naturally on smaller containers with appropriate gutters,
              then switches to a fixed maximum width with centered alignment when the container reaches 1064px or wider.
            </p>

            <h2 style="margin: 32px 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
              Implementation Details
            </h2>

            <p style="margin: 0 0 16px 0;">
              The magic happens through CSS Container Queries combined with CSS Grid. The container establishes
              a containment context, then child elements can respond to the container's inline size.
            </p>

            <pre style="background: #1f2937; color: #e5e7eb; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 24px 0; font-size: 14px; line-height: 1.4;"><code>container-type: inline-size;
container-name: content-container;

@container content-container (width >= 1064px) {
  --content-max-width: 1064px;
  --gutter: 0;
}</code></pre>

            <p style="margin: 0;">
              This approach creates more maintainable, flexible layouts that work consistently regardless of
              where the component is placed in your application.
            </p>
          </div>
        </article>
      </ContentContainerComponent>
    </div>
  `,
});

export const BlogArticle = ContentExampleTemplate.bind({});
BlogArticle.args = {
  tag: "article",
};
BlogArticle.parameters = {
  docs: {
    description: {
      story:
        "Example of a blog article layout showing how the ContentContainer provides optimal reading width and responsive behavior.",
    },
  },
};

// ===== ACCESSIBILITY STORIES =====

const AccessibilityTemplate: StoryFn<ContentContainerArgs> = (args) => ({
  components: { ContentContainerComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: #f3f4f6; padding: 20px;">
      <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <h3 style="margin: 0 0 16px 0; color: #374151;">Accessibility Features</h3>
        <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.5;">
          When <code>isLandmark</code> is enabled, the container becomes keyboard focusable and includes appropriate ARIA labeling for screen readers.
        </p>
        <div style="padding: 12px; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #6366f1;">
          <strong style="color: #4338ca;">Current state:</strong>
          {{ args.isLandmark ? 'Landmark enabled (focusable, labeled)' : 'Standard container (no landmark features)' }}
        </div>
      </div>

      <ContentContainerComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 24px; background: white; border-radius: 8px; border: 2px solid #d1d5db;">
          <div :style="{
            padding: '16px',
            background: args.isLandmark ? '#dbeafe' : '#f9fafb',
            borderRadius: '8px',
            border: args.isLandmark ? '2px solid #3b82f6' : '2px solid #e5e7eb'
          }">
            <h3 style="margin: 0 0 12px 0; color: #374151;">
              {{ args.isLandmark ? '🏷️ Landmark Container' : '📦 Standard Container' }}
            </h3>
            <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.5;">
              {{ args.isLandmark
                ? 'This container is marked as a landmark region. Screen reader users can navigate directly to it using landmark navigation commands.'
                : 'This is a regular content container without special accessibility features.'
              }}
            </p>
            <div style="font-family: monospace; font-size: 12px; background: rgba(0, 0, 0, 0.05); padding: 8px; border-radius: 4px;">
              <div>tabIndex: {{ args.isLandmark ? '0' : 'null' }}</div>
              <div>aria-label: {{ args.isLandmark ? '"Content Container Landmark"' : 'undefined' }}</div>
            </div>
          </div>
        </div>
      </ContentContainerComponent>
    </div>
  `,
});

export const WithLandmark = AccessibilityTemplate.bind({});
WithLandmark.args = {
  tag: "section",
  isLandmark: true,
};
WithLandmark.parameters = {
  docs: {
    description: {
      story:
        "ContentContainer with landmark accessibility features enabled - makes the container focusable and properly labeled for assistive technologies.",
    },
  },
};

export const WithoutLandmark = AccessibilityTemplate.bind({});
WithoutLandmark.args = {
  tag: "div",
  isLandmark: false,
};
WithoutLandmark.parameters = {
  docs: {
    description: {
      story: "Standard ContentContainer without landmark features - regular content container behavior.",
    },
  },
};

// ===== RESPONSIVE DEMONSTRATION =====

const ResponsiveTemplate: StoryFn = () => ({
  components: { ContentContainerComponent },
  template: `
    <div style="background: #f8fafc; padding: 20px;">
      <div style="margin-bottom: 40px;">
        <h2 style="text-align: center; margin: 0 0 16px 0; color: #374151; font-size: 28px;">
          Responsive Behavior Demonstration
        </h2>
        <p style="text-align: center; margin: 0 0 32px 0; color: #6b7280; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          The ContentContainer adapts its layout based on its own width using container queries.
          Resize your browser to see the responsive behavior in action.
        </p>
      </div>

      <!-- Small container demonstration -->
      <div style="margin-bottom: 40px;">
        <h3 style="margin: 0 0 16px 0; color: #374151;">Narrow Container (< 1064px)</h3>
        <div style="max-width: 800px; border: 2px dashed #cbd5e1; padding: 20px; margin-bottom: 20px;">
          <ContentContainerComponent tag="div">
            <div style="padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 8px 0; color: #92400e;">Fluid Width Mode</h4>
              <p style="margin: 0; color: #b45309; font-size: 14px;">
                Content uses available width with 16px gutters on each side
              </p>
            </div>
          </ContentContainerComponent>
        </div>
      </div>

      <!-- Large container demonstration -->
      <div style="margin-bottom: 40px;">
        <h3 style="margin: 0 0 16px 0; color: #374151;">Wide Container (≥ 1064px)</h3>
        <div style="border: 2px dashed #cbd5e1; padding: 20px;">
          <ContentContainerComponent tag="div">
            <div style="padding: 20px; background: #dcfce7; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 8px 0; color: #166534;">Fixed Width Mode</h4>
              <p style="margin: 0; color: #15803d; font-size: 14px;">
                Content is constrained to 1064px max-width and centered within the container
              </p>
            </div>
          </ContentContainerComponent>
        </div>
      </div>

      <!-- Technical details -->
      <ContentContainerComponent tag="section">
        <div style="padding: 24px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <h3 style="margin: 0 0 16px 0; color: #374151;">How It Works</h3>
          <div style="display: grid; gap: 16px;">
            <div style="padding: 16px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">Container Queries</h4>
              <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
                Uses <code>@container</code> rules to respond to the container's own width, not the viewport width.
              </p>
            </div>
            <div style="padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
              <h4 style="margin: 0 0 8px 0; color: #15803d; font-size: 14px; font-weight: 600;">CSS Grid Layout</h4>
              <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.5;">
                Named grid lines create flexible layouts that adapt to content needs automatically.
              </p>
            </div>
            <div style="padding: 16px; background: #fef7ff; border-radius: 8px; border-left: 4px solid #a855f7;">
              <h4 style="margin: 0 0 8px 0; color: #7c3aed; font-size: 14px; font-weight: 600;">Component Reusability</h4>
              <p style="margin: 0; color: #8b5cf6; font-size: 14px; line-height: 1.5;">
                Works consistently regardless of where it's placed in your layout hierarchy.
              </p>
            </div>
          </div>
        </div>
      </ContentContainerComponent>
    </div>
  `,
});

export const ResponsiveBehavior = ResponsiveTemplate.bind({});
ResponsiveBehavior.parameters = {
  docs: {
    description: {
      story:
        "Interactive demonstration of how the ContentContainer responds to different container widths using CSS Container Queries instead of media queries.",
    },
  },
};
