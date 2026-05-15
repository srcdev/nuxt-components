import type { Meta, StoryFn } from "@nuxtjs/storybook";
import PageRowComponent from "../PageRow.vue";

interface PageRowArgs {
  tag: string;
  variant: string;
  align?: "start" | "end";
  id?: string;
  styleClassPassthrough: string[];
}

export default {
  title: "Atoms/Layouts/PageRow",
  component: PageRowComponent,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["full", "popout", "content", "inset-content"],
      description: "Grid column track the element occupies when nested inside another PageRow",
      table: { category: "Layout" },
    },
    align: {
      control: { type: "select" },
      options: [undefined, "start", "end"],
      description: "Bleeds the element to the viewport edge on one side while keeping the opposite boundary at the variant track. Has no effect on variant=\"full\".",
      table: { category: "Layout" },
    },
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "header", "footer", "main", "nav"],
      description: "Semantic HTML element to render as",
      table: { category: "Semantic" },
    },
    id: {
      control: { type: "text" },
      description: "id attribute for the element",
      table: { category: "HTML" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    variant: "content",
    align: undefined,
    tag: "div",
    id: "",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A page layout primitive built on CSS Grid named lines. Each PageRow is both a grid container and a grid item — nest them to compose full-width backgrounds with constrained inner content.",
      },
    },
  },
} as Meta<PageRowArgs>;

const sampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

// ===== SINGLE ROW STORIES =====

const SingleTemplate: StoryFn<PageRowArgs> = (args) => ({
  components: { PageRowComponent },
  setup() {
    return { args, sampleText };
  },
  template: `
    <div style="min-height: 100vh; background: linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 100%);">
      <PageRowComponent
        :tag="args.tag"
        :variant="args.variant"
        :align="args.align || undefined"
        :id="args.id || undefined"
        :style-class-passthrough="args.styleClassPassthrough"
        :is-landmark="args.isLandmark"
      >
        <div style="padding: 24px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-block: 20px;">
          <h2 style="margin: 0 0 12px; color: #374151; font-size: 18px;">variant="{{ args.variant }}"<span v-if="args.align"> align="{{ args.align }}"</span></h2>
          <p style="margin: 0; color: #6b7280; line-height: 1.6;">{{ sampleText }}</p>
        </div>
      </PageRowComponent>
    </div>
  `,
});

export const Default = SingleTemplate.bind({});
Default.args = {};

export const Full = SingleTemplate.bind({});
Full.args = { variant: "full" };
Full.parameters = {
  docs: { description: { story: "Full track (1fr) — extends edge to edge when nested in another PageRow." } },
};

export const Popout = SingleTemplate.bind({});
Popout.args = { variant: "popout" };
Popout.parameters = {
  docs: { description: { story: "Popout track (max 1400px) — wider than content, useful for imagery or callouts." } },
};

export const Content = SingleTemplate.bind({});
Content.args = { variant: "content" };
Content.parameters = {
  docs: { description: { story: "Content track (max 1064px) — optimal reading width. The default variant." } },
};

export const InsetContent = SingleTemplate.bind({});
InsetContent.args = { variant: "inset-content" };
InsetContent.parameters = {
  docs: { description: { story: "Inset content track (max 840px) — narrower width for focused reading." } },
};

// ===== NESTING PATTERN =====

const NestingTemplate: StoryFn = () => ({
  components: { PageRowComponent },
  setup() {
    return { sampleText };
  },
  template: `
    <div style="min-height: 100vh;">

      <PageRowComponent tag="section" variant="full" style="background: #1e3a5f; color: white; padding-block: 60px;">
        <h1 style="margin: 0 0 16px; font-size: 2.4rem;">Full-width background, constrained content</h1>
        <p style="margin: 0; opacity: 0.85; line-height: 1.7;">{{ sampleText }}</p>
      </PageRowComponent>

      <PageRowComponent tag="section" style="background: #f0fdf4; padding-block: 48px;">
        <PageRowComponent variant="content">
          <h2 style="margin: 0 0 12px; font-size: 1.8rem; color: #166534;">Nested: content inside a content row</h2>
          <p style="margin: 0; color: #15803d; line-height: 1.7;">{{ sampleText }}</p>
        </PageRowComponent>
        <PageRowComponent variant="popout" style="margin-block: 24px; background: #dcfce7; border-radius: 6px; padding: 24px;">
          <p style="margin: 0; color: #166534;">Popout child breaking out to 1400px</p>
        </PageRowComponent>
        <PageRowComponent variant="inset-content">
          <p style="margin: 0; color: #15803d; font-style: italic; line-height: 1.7;">Inset content (840px) for a focused quote or aside.</p>
        </PageRowComponent>
      </PageRowComponent>

    </div>
  `,
});

export const NestingPattern = NestingTemplate.bind({});
NestingPattern.parameters = {
  docs: {
    description: {
      story:
        "The key composition pattern: nest a full-width outer PageRow (for backgrounds/borders) with inner PageRows at narrower variants. No extra wrapper divs needed.",
    },
  },
};

// ===== WIDTH COMPARISON =====

const ComparisonTemplate: StoryFn = () => ({
  components: { PageRowComponent },
  setup() {
    const tracks = [
      { variant: "full", label: "full", color: "#ef4444", desc: "1fr — edge to edge" },
      { variant: "popout", label: "popout", color: "#f97316", desc: "max 1400px" },
      { variant: "content", label: "content", color: "#eab308", desc: "max 1064px" },
      { variant: "inset-content", label: "inset-content", color: "#22c55e", desc: "max 840px" },
    ];
    return { tracks };
  },
  template: `
    <div style="background: #f8fafc; padding-block: 32px;">
      <PageRowComponent>
        <h2 style="margin: 0 0 8px; color: #374151;">Track width comparison</h2>
        <p style="margin: 0 0 32px; color: #6b7280;">Resize the viewport to see how each track adapts.</p>
      </PageRowComponent>

      <PageRowComponent v-for="track in tracks" :key="track.variant">
        <PageRowComponent :variant="track.variant" style="margin-block: 8px;">
          <div
            :style="{
              background: track.color,
              color: 'white',
              padding: '16px 20px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }"
          >
            <strong>{{ track.label }}</strong>
            <span style="opacity: 0.85; font-size: 0.875rem;">{{ track.desc }}</span>
          </div>
        </PageRowComponent>
      </PageRowComponent>
    </div>
  `,
});

export const WidthComparison = ComparisonTemplate.bind({});
WidthComparison.parameters = {
  docs: {
    description: {
      story: "Side-by-side comparison of all four main track widths.",
    },
  },
};

// ===== ALIGNMENT =====

const AlignTemplate: StoryFn = () => ({
  components: { PageRowComponent },
  setup() {
    return { sampleText };
  },
  template: `
    <div style="background: #f8fafc; padding-block: 32px; overflow-x: hidden;">
      <PageRowComponent>
        <h2 style="margin: 0 0 8px; color: #374151;">align prop — edge bleed</h2>
        <p style="margin: 0 0 32px; color: #6b7280;">
          combine <code>variant</code> with <code>align</code> to bleed one side to the viewport edge
          while keeping the opposite boundary at the track line.
        </p>
      </PageRowComponent>

      <PageRowComponent style="margin-block: 8px;">
        <PageRowComponent variant="content" align="start"
          style="background: #fde68a; padding: 20px; border-radius: 0 6px 6px 0;">
          <strong>variant="content" align="start"</strong>
          <p style="margin: 8px 0 0;">full-start → content-end</p>
        </PageRowComponent>
      </PageRowComponent>

      <PageRowComponent style="margin-block: 8px;">
        <PageRowComponent variant="content" align="end"
          style="background: #a5f3fc; padding: 20px; border-radius: 6px 0 0 6px;">
          <strong>variant="content" align="end"</strong>
          <p style="margin: 8px 0 0;">content-start → full-end</p>
        </PageRowComponent>
      </PageRowComponent>

      <PageRowComponent style="margin-block: 8px;">
        <PageRowComponent variant="popout" align="start"
          style="background: #bbf7d0; padding: 20px; border-radius: 0 6px 6px 0;">
          <strong>variant="popout" align="start"</strong>
          <p style="margin: 8px 0 0;">full-start → popout-end</p>
        </PageRowComponent>
      </PageRowComponent>

      <PageRowComponent style="margin-block: 8px;">
        <PageRowComponent variant="inset-content" align="end"
          style="background: #e9d5ff; padding: 20px; border-radius: 6px 0 0 6px;">
          <strong>variant="inset-content" align="end"</strong>
          <p style="margin: 8px 0 0;">inset-content-start → full-end</p>
        </PageRowComponent>
      </PageRowComponent>
    </div>
  `,
});

export const Alignment = AlignTemplate.bind({});
Alignment.parameters = {
  docs: {
    description: {
      story:
        "Use align=\"start\" or align=\"end\" to bleed a PageRow to the left or right viewport edge while respecting the variant track boundary on the opposite side. Typical use: asymmetric imagery, pull-quotes, or decorative panels.",
    },
  },
};

// ===== ACCESSIBILITY =====

const A11yTemplate: StoryFn = () => ({
  components: { PageRowComponent },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-block: 32px;">

      <PageRowComponent tag="section" style="background: #dbeafe; padding-block: 24px;">
        <template #default="{ headingId }">
          <h2 :id="headingId" style="margin: 0 0 8px; color: #1e40af;">Section with aria-labelledby</h2>
          <p style="margin: 0; color: #3b82f6;">
            The <code>&lt;section&gt;</code> element receives <code>aria-labelledby</code> automatically,
            pointing to the heading via the <code>headingId</code> slot prop.
          </p>
        </template>
      </PageRowComponent>

      <PageRowComponent tag="div" style="background: #f3f4f6; padding-block: 24px;">
        <template #default="{ headingId }">
          <h2 :id="headingId" style="margin: 0 0 8px; color: #374151;">div — no aria-labelledby</h2>
          <p style="margin: 0; color: #6b7280;">
            Non-landmark tags (<code>div</code>, <code>header</code>, <code>footer</code>, <code>nav</code>)
            do not receive <code>aria-labelledby</code>. The <code>headingId</code> slot prop is still
            provided but unused.
          </p>
        </template>
      </PageRowComponent>

    </div>
  `,
});

export const AriaLabelledBy = A11yTemplate.bind({});
AriaLabelledBy.parameters = {
  docs: {
    description: {
      story:
        "section, main, article, and aside receive aria-labelledby automatically. Use the headingId slot prop on the first heading inside the PageRow to complete the association.",
    },
  },
};
