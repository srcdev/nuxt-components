import type { Meta, StoryFn } from "@nuxtjs/storybook";
import LayoutRowComponent from "../LayoutRow.vue";

// Define the args interface
interface LayoutRowArgs {
  dataTestid: string;
  tag: string;
  variant: string;
  id?: string;
  styleClassPassthrough: string[];
  isLandmark: boolean;
}

export default {
  title: "Components/Layouts/LayoutRow",
  component: LayoutRowComponent,
  argTypes: {
    // Configuration
    variant: {
      control: { type: "select" },
      options: [
        "full",
        "full-start",
        "full-end",
        "popout",
        "popout-start",
        "popout-end",
        "content",
        "content-start",
        "content-end",
        "inset-content",
        "inset-content-start",
        "inset-content-end",
        "full-width",
        "full-content",
        "full-content-nopad",
      ],
      description: "Layout variant controlling the grid column positioning",
      table: {
        category: "Layout",
      },
    },
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
      description: "Test ID for the inner layout row element",
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
    variant: "content",
    tag: "div",
    isLandmark: false,
    dataTestid: "layout-row",
    id: "",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A flexible layout component that uses CSS Grid to create various content width constraints. Based on the 'layout breakouts' pattern for responsive design with multiple content tracks.",
      },
    },
  },
} as Meta<LayoutRowArgs>;

const Template: StoryFn<LayoutRowArgs> = (args) => ({
  components: { LayoutRowComponent },
  setup() {
    const sampleContent = {
      shortText: "Brief example content.",
      mediumText:
        "This is a medium-length text example that demonstrates how content adapts within different layout row variants and their width constraints.",
      longText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };

    return { args, sampleContent };
  },
  template: `
    <div style="min-height: 100vh; background: linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 100%);">
      <LayoutRowComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :variant="args.variant"
        :id="args.id || undefined"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 20px 0;">
          <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 20px;">
            Layout Variant: {{ args.variant }}
          </h2>
          <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.5;">
            {{ sampleContent.longText }}
          </p>
          <div style="padding: 12px; background: #f3f4f6; border-radius: 4px; font-family: monospace; font-size: 12px; color: #374151;">
            variant="{{ args.variant }}" tag="{{ args.tag }}"
          </div>
        </div>
      </LayoutRowComponent>
    </div>
  `,
});

// ===== BASIC VARIANT STORIES =====

export const Default = Template.bind({});
Default.args = {};

export const Full = Template.bind({});
Full.args = {
  variant: "full",
};
Full.parameters = {
  docs: {
    description: {
      story: "Full width variant (1fr) - extends to the full available width of the container.",
    },
  },
};

export const Popout = Template.bind({});
Popout.args = {
  variant: "popout",
};
Popout.parameters = {
  docs: {
    description: {
      story: "Popout variant (max 1400px) - wider than content but with some constraints for better readability.",
    },
  },
};

export const Content = Template.bind({});
Content.args = {
  variant: "content",
};
Content.parameters = {
  docs: {
    description: {
      story: "Content variant (max 1064px) - optimal reading width for most content types.",
    },
  },
};

export const InsetContent = Template.bind({});
InsetContent.args = {
  variant: "inset-content",
};
InsetContent.parameters = {
  docs: {
    description: {
      story: "Inset content variant (max 840px) - narrower width ideal for focused reading or sidebar content.",
    },
  },
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  variant: "full-width",
};
FullWidth.parameters = {
  docs: {
    description: {
      story: "Full width variant - extends to full container width without constraints.",
    },
  },
};

export const FullContent = Template.bind({});
FullContent.args = {
  variant: "full-content",
};
FullContent.parameters = {
  docs: {
    description: {
      story: "Full content variant - full width with inline padding applied automatically.",
    },
  },
};

export const FullContentNoPad = Template.bind({});
FullContentNoPad.args = {
  variant: "full-content-nopad",
};
FullContentNoPad.parameters = {
  docs: {
    description: {
      story: "Full content without padding - full width without automatic inline padding.",
    },
  },
};

// ===== POSITIONAL VARIANTS =====

const PositionalTemplate: StoryFn<LayoutRowArgs> = (args) => ({
  components: { LayoutRowComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="min-height: 100vh; background: linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 100%);">
      <LayoutRowComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :variant="args.variant"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 20px 0;">
          <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 20px;">
            Positional Variant: {{ args.variant }}
          </h2>
          <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.5;">
            This variant demonstrates how content can be positioned to start or end at specific grid lines,
            allowing for asymmetric layouts and creative positioning within the grid system.
          </p>
          <div style="padding: 12px; background: #fef3c7; border-radius: 4px; border-left: 4px solid #f59e0b;">
            <strong>Grid Column:</strong> {{ args.variant }}
          </div>
        </div>
      </LayoutRowComponent>
    </div>
  `,
});

export const FullStart = PositionalTemplate.bind({});
FullStart.args = {
  variant: "full-start",
};
FullStart.parameters = {
  docs: {
    description: {
      story: "Starts at the full grid line - content begins at the edge and flows inward.",
    },
  },
};

export const PopoutStart = PositionalTemplate.bind({});
PopoutStart.args = {
  variant: "popout-start",
};
PopoutStart.parameters = {
  docs: {
    description: {
      story: "Starts at the popout grid line - content begins at the popout boundary.",
    },
  },
};

export const ContentStart = PositionalTemplate.bind({});
ContentStart.args = {
  variant: "content-start",
};
ContentStart.parameters = {
  docs: {
    description: {
      story: "Starts at the content grid line - content begins at the content boundary.",
    },
  },
};

export const InsetContentStart = PositionalTemplate.bind({});
InsetContentStart.args = {
  variant: "inset-content-start",
};
InsetContentStart.parameters = {
  docs: {
    description: {
      story: "Starts at the inset-content grid line - content begins at the inset boundary.",
    },
  },
};

// ===== SEMANTIC TAG VARIANTS =====

const SemanticTemplate: StoryFn<LayoutRowArgs> = (args) => ({
  components: { LayoutRowComponent },
  setup() {
    const getTagDescription = (tag: string) => {
      const descriptions = {
        section: "Groups related content together",
        article: "Self-contained, distributable content",
        aside: "Content tangentially related to main content",
        header: "Introductory content or navigation",
        footer: "Footer information for its nearest sectioning element",
        main: "Main content of the document",
        nav: "Navigation links",
        div: "Generic container (default)",
      };
      return descriptions[tag as keyof typeof descriptions] || "Generic container";
    };

    return { args, getTagDescription };
  },
  template: `
    <div style="min-height: 50vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <LayoutRowComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :variant="args.variant"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 30px; text-align: center;">
          <h2 style="margin: 0 0 16px 0; font-size: 24px;">
            Semantic Element: &lt;{{ args.tag }}&gt;
          </h2>
          <p style="margin: 0 0 20px 0; opacity: 0.9; line-height: 1.6;">
            {{ getTagDescription(args.tag) }}
          </p>
          <div style="display: inline-block; padding: 12px 20px; background: rgba(255, 255, 255, 0.2); border-radius: 6px; font-family: monospace; font-size: 14px;">
            &lt;{{ args.tag }} class="layout-row"&gt;
          </div>
        </div>
      </LayoutRowComponent>
    </div>
  `,
});

export const SemanticSection = SemanticTemplate.bind({});
SemanticSection.args = {
  tag: "section",
  variant: "content",
};

export const SemanticArticle = SemanticTemplate.bind({});
SemanticArticle.args = {
  tag: "article",
  variant: "content",
};

export const SemanticHeader = SemanticTemplate.bind({});
SemanticHeader.args = {
  tag: "header",
  variant: "full-width",
};

export const SemanticMain = SemanticTemplate.bind({});
SemanticMain.args = {
  tag: "main",
  variant: "content",
  isLandmark: true,
};

export const SemanticNav = SemanticTemplate.bind({});
SemanticNav.args = {
  tag: "nav",
  variant: "popout",
  isLandmark: true,
};

// ===== ACCESSIBILITY STORY =====

const AccessibilityTemplate: StoryFn<LayoutRowArgs> = (args) => ({
  components: { LayoutRowComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: #f9fafb; padding: 20px;">
      <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <h3 style="margin: 0 0 16px 0; color: #374151;">Accessibility Features</h3>
        <p style="margin: 0 0 20px 0; color: #6b7280; line-height: 1.5;">
          When <code>isLandmark</code> is enabled, the component becomes keyboard focusable and includes appropriate ARIA labeling.
        </p>
      </div>

      <LayoutRowComponent
        :data-testid="args.dataTestid"
        :tag="args.tag"
        :variant="args.variant"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 20px; background: #dbeafe; border-radius: 8px; margin: 20px 0; border: 2px solid #3b82f6;">
          <h3 style="margin: 0 0 12px 0; color: #1e40af;">
            {{ args.isLandmark ? 'Landmark Element' : 'Regular Element' }}
          </h3>
          <p style="margin: 0 0 12px 0; color: #3b82f6; line-height: 1.5;">
            {{ args.isLandmark
              ? 'This element is focusable with tab navigation and has an accessible label.'
              : 'This is a regular layout element without landmark features.'
            }}
          </p>
          <div style="padding: 8px; background: rgba(59, 130, 246, 0.1); border-radius: 4px; font-family: monospace; font-size: 12px;">
            tabindex="{{ args.isLandmark ? '0' : 'null' }}"
            aria-label="{{ args.isLandmark ? 'Layout Row Landmark' : 'undefined' }}"
          </div>
        </div>
      </LayoutRowComponent>
    </div>
  `,
});

export const WithLandmark = AccessibilityTemplate.bind({});
WithLandmark.args = {
  variant: "content",
  isLandmark: true,
  tag: "section",
};
WithLandmark.parameters = {
  docs: {
    description: {
      story: "Layout row with landmark accessibility features enabled - focusable and labeled for screen readers.",
    },
  },
};

export const WithoutLandmark = AccessibilityTemplate.bind({});
WithoutLandmark.args = {
  variant: "content",
  isLandmark: false,
  tag: "div",
};
WithoutLandmark.parameters = {
  docs: {
    description: {
      story: "Standard layout row without landmark features - regular content container.",
    },
  },
};

// ===== COMPARISON STORY =====

const ComparisonTemplate: StoryFn = () => ({
  components: { LayoutRowComponent },
  setup() {
    const variants = [
      { name: "full", description: "Full width (1fr)", color: "#ef4444" },
      { name: "popout", description: "Popout (1400px max)", color: "#f97316" },
      { name: "content", description: "Content (1064px max)", color: "#eab308" },
      { name: "inset-content", description: "Inset (840px max)", color: "#22c55e" },
    ];
    return { variants };
  },
  template: `
    <div style="background: #f8fafc; min-height: 100vh; padding: 20px 0;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 28px;">Layout Row Width Comparison</h2>
        <p style="margin: 0; color: #6b7280; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          Observe how different variants create varying content widths at different viewport sizes.
        </p>
      </div>

      <div v-for="variant in variants" :key="variant.name">
        <LayoutRowComponent :variant="variant.name" style="margin-bottom: 20px;">
          <div
            style="padding: 20px; border-radius: 8px; text-align: center;"
            :style="{
              background: variant.color,
              color: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }"
          >
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">
              {{ variant.name }}
            </h3>
            <p style="margin: 0 0 8px 0; opacity: 0.9;">
              {{ variant.description }}
            </p>
            <code style="background: rgba(255, 255, 255, 0.2); padding: 4px 8px; border-radius: 4px; font-size: 12px;">
              variant="{{ variant.name }}"
            </code>
          </div>
        </LayoutRowComponent>
      </div>

      <LayoutRowComponent variant="content" style="margin-top: 40px;">
        <div style="padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <h3 style="margin: 0 0 16px 0; color: #374151;">Understanding the Grid System</h3>
          <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.6;">
            The layout row component uses CSS Grid with named grid lines to create a flexible, responsive layout system.
            Each variant corresponds to different grid column spans, allowing for precise control over content width and positioning.
          </p>
          <ul style="margin: 0; color: #6b7280; line-height: 1.6; padding-left: 20px;">
            <li><strong>Full:</strong> Uses the entire available width</li>
            <li><strong>Popout:</strong> Wider than content, ideal for images or callouts</li>
            <li><strong>Content:</strong> Optimal reading width for most text content</li>
            <li><strong>Inset:</strong> Narrower width for focused content or sidebars</li>
          </ul>
        </div>
      </LayoutRowComponent>
    </div>
  `,
});

export const VariantComparison = ComparisonTemplate.bind({});
VariantComparison.parameters = {
  docs: {
    description: {
      story:
        "Side-by-side comparison of all major layout variants, demonstrating the width differences and visual hierarchy they create.",
    },
  },
};
