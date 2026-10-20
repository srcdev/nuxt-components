import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AccordionGroup from "../AccordionGroup.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  name?: string;
  animationDuration?: number;
  variant?: "modern" | "classic";
  panelCount?: number;
  maxWidth?: string;
  styleClassPassthrough?: string | string[];
}

const meta: Meta<StoryArgs> = {
  title: "Molecules/Expandable/AccordionGroup",
  component: AccordionGroup,
  argTypes: {
    name: {
      control: { type: "text" },
      description:
        "Shared `name` on every panel's `<details>`, so the browser keeps only one open at a time. Leave empty for independent panels.",
    },
    animationDuration: {
      control: { type: "number", min: 0, step: 50 },
      description: "Open/close animation duration in milliseconds, passed to every panel.",
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["classic", "modern"],
      description:
        "`classic` (ExpandingPanelClassic, default, works in every browser) or `modern` (ExpandingPanel, needs `::details-content`, so not WebKit).",
    },
    panelCount: {
      control: { type: "range", min: 0, max: 8, step: 1 },
      description: "**Story control, not a prop.** How many `item-{n}-summary` slots the story fills; the component counts them itself.",
      table: { category: "Slot content (story only)" },
    },
    maxWidth: {
      control: { type: "select" },
      options: ["40rem", "60rem", "100%"],
      description:
        "**Story control, not a prop.** Sets `--accordion-group-max-width`. In your CSS: `.faq { --accordion-group-max-width: 80rem; }`",
      table: { category: "CSS tokens (story only, set in your CSS)" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    name: "",
    animationDuration: 300,
    variant: "classic",
    panelCount: 3,
    maxWidth: "60rem",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A group of expanding panels. Each panel is defined by `item-{n}-summary`, `item-{n}-content` and an optional `item-{n}-icon` slot; " +
          "the group renders one panel per `item-{n}-summary` slot, in numeric order, so there's no count to keep in sync. " +
          "Pass `name` to make it exclusive (one panel open at a time). `variant` picks the panel implementation, `classic` by default " +
          "because `modern` relies on `::details-content`, which WebKit lacks.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const faqs = [
  { q: "How long does a first appointment take?", a: "Allow about an hour, including a short consultation before we start." },
  { q: "Can I change or cancel a booking?", a: "Yes, up to 24 hours before your appointment, from the link in your confirmation email." },
  { q: "Do you offer gift vouchers?", a: "Vouchers are available in any amount and are valid for twelve months." },
  { q: "Is there parking nearby?", a: "There's free on-street parking on Northtown Road and a pay car park two minutes away." },
  { q: "Which payment methods do you accept?", a: "Card, contactless and cash." },
  { q: "Do I need to bring anything?", a: "Just yourself. Wear something comfortable." },
  { q: "Is the studio accessible?", a: "Everything is on the ground floor, with step-free access from the street." },
  { q: "Can I bring a friend?", a: "Of course, there's a seating area in reception." },
];

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => ({
    name: args.name || undefined,
    animationDuration: args.animationDuration,
    variant: args.variant,
  }));
  const tokenStyle = computed(() => ({ "--accordion-group-max-width": args.maxWidth }));
  const items = computed(() => faqs.slice(0, args.panelCount ?? 3));
  return { componentArgs, tokenStyle, items };
}

const faqTemplate = `
  <AccordionGroup v-bind="componentArgs" :style="tokenStyle">
    <template v-for="(item, i) in items" :key="i" #[\`item-\${i}-summary\`]>{{ item.q }}</template>
    <template v-for="(item, i) in items" :key="'c' + i" #[\`item-\${i}-content\`]><p style="margin: 0; padding-block: 0.8rem;">{{ item.a }}</p></template>
  </AccordionGroup>
`;

export const Default: Story = {
  render: (args) => ({
    components: { AccordionGroup },
    setup() {
      return useStorySetup(args);
    },
    template: `<div style="padding: 2.4rem;">${faqTemplate}</div>`,
  }),
  parameters: {
    docs: { description: { story: "Independent panels: any number can be open. Change the panel count control to add or remove `item-{n}-summary` slots." } },
  },
};

export const ExclusiveOpen: Story = {
  name: "Exclusive Open (shared name)",
  args: { name: "faq", panelCount: 4 },
  render: Default.render,
  parameters: {
    docs: { description: { story: "With `name` set, opening one panel closes the others (native `<details name>` grouping). Each panel still gets its own ids." } },
  },
};

export const ModernVariant: Story = {
  name: "Modern Variant",
  args: { variant: "modern" },
  render: Default.render,
  parameters: {
    docs: { description: { story: "`variant=\"modern\"` renders `ExpandingPanel`, animated with `::details-content`. It doesn't animate in WebKit (Safari, every iOS browser)." } },
  },
};

export const CustomIcons: Story = {
  name: "Custom Icons",
  render: (args) => ({
    components: { AccordionGroup },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div style="padding: 2.4rem;">
        <AccordionGroup v-bind="componentArgs" :style="tokenStyle">
          <template #item-0-summary>Default caret (no icon slot)</template>
          <template #item-0-content><p style="margin: 0; padding-block: 0.8rem;">This panel keeps the panel's own caret.</p></template>
          <template #item-1-summary>Custom icon</template>
          <template #item-1-icon><Icon name="lucide:plus" /></template>
          <template #item-1-content><p style="margin: 0; padding-block: 0.8rem;">This panel's caret is replaced by its <code>item-1-icon</code> slot.</p></template>
        </AccordionGroup>
      </div>
    `,
  }),
  parameters: {
    docs: { description: { story: "`item-{n}-icon` is optional per panel. Without it the panel keeps its default caret." } },
  },
};

export const SlowAnimation: Story = {
  name: "Slow Animation (800ms)",
  args: { animationDuration: 800 },
  render: Default.render,
};

export const NoPanels: Story = {
  name: "No Panels",
  args: { panelCount: 0 },
  render: Default.render,
  parameters: {
    docs: { description: { story: "With no `item-{n}-summary` slots the group renders an empty wrapper." } },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: { name: "stress", maxWidth: "100%" },
  render: (args) => ({
    components: { AccordionGroup },
    setup() {
      const longUnbroken = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft";
      const longUrl = "https://example.com/" + "a-very-long-path-segment-without-spaces".repeat(4);
      const longCopy =
        "Unsere Behandlungen werden individuell auf Ihre Bedürfnisse abgestimmt, damit Sie sich rundum wohlfühlen. ".repeat(8);
      return { ...useStorySetup(args), longUnbroken, longUrl, longCopy };
    },
    template: `
      <div style="padding: 1.6rem;">
        <AccordionGroup v-bind="componentArgs" :style="tokenStyle">
          <template #item-0-summary>{{ longUnbroken }}</template>
          <template #item-0-content><p style="margin: 0; padding-block: 0.8rem;">{{ longUrl }}</p></template>

          <template #item-1-summary>{{ longCopy.slice(0, 220) }}</template>
          <template #item-1-content><p style="margin: 0; padding-block: 0.8rem;">{{ longCopy }}</p></template>

          <template #item-2-summary>🎉 Emoji first, then &lt;b&gt;html&lt;/b&gt; as text</template>
          <template #item-2-content><p style="margin: 0; padding-block: 0.8rem;">&lt;script&gt;alert(1)&lt;/script&gt;</p></template>

          <template #item-3-summary><span dir="rtl">سؤال طويل من اليمين إلى اليسار للتحقق من الاتجاه</span></template>
          <template #item-3-content><p dir="rtl" style="margin: 0; padding-block: 0.8rem;">إجابة قصيرة.</p></template>

          <template #item-4-summary>A</template>
          <template #item-4-content></template>

          <template #item-9-summary>Gapped index (item-9 after item-4)</template>
          <template #item-9-content><p style="margin: 0; padding-block: 0.8rem;">Indexes needn't be contiguous; panels render in numeric order.</p></template>

          <template #item-7-content><p>Orphan content with no summary: never rendered.</p></template>
        </AccordionGroup>
      </div>
    `,
  }),
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "mobileCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "720px" },
      description: {
        story:
          "Open each panel at every canvas width. Long unbroken words and URLs should wrap inside the summary and content, the caret should " +
          "stay visible beside a three-line summary, emoji and HTML-like text render as text, the RTL summary reads right to left, the empty " +
          "content panel opens to nothing, item-9 follows item-4, and the orphan item-7 content never appears.",
      },
    },
  },
};
