import { computed, ref } from "vue";
import Breadcrumb from "../Breadcrumb.vue";
import CanvasSwitcher from "../../../canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { BreadcrumbItem } from "~/types/components/breadcrumb";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof Breadcrumb> = {
  title: "Atoms/Navigation/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
    items: {
      control: "object",
      description: "Ordered list of { label, to? } — items without `to` render as plain text (typically the last, current-page item)",
    },
    separator: {
      control: "text",
      description: "Character or short string rendered between items",
    },
    ariaLabel: {
      control: "text",
      description: "aria-label on the nav landmark; override for localisation",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    separator: "/",
    ariaLabel: "Breadcrumb",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders a `<nav aria-label=\"Breadcrumb\">` trail from an items array. Any item with a `to` renders as a NuxtLink; an item without one renders as plain text marked `aria-current=\"page\"` — routing decisions stay with the consumer, same as the rest of this library.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const items: BreadcrumbItem[] = [
  { label: "Services", to: "/services" },
  { label: "Balayage" },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { items },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      return { args };
    },
    template: `<Breadcrumb v-bind="args" />`,
  }),
};

export const ThreeLevels: Story = {
  name: "Three Levels",
  args: {
    items: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/services" },
      { label: "Balayage" },
    ],
  },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      return { args };
    },
    template: `<Breadcrumb v-bind="args" />`,
  }),
};

export const CustomSeparator: Story = {
  name: "Custom Separator",
  args: { items, separator: ">" },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      return { args };
    },
    template: `<Breadcrumb v-bind="args" />`,
  }),
};

// ─── Stress test ──────────────────────────────────────────────────────────────

type LineClamp = "none" | "1" | "2" | "3";

// Story-only arg: drives a CSS token, not a Breadcrumb prop. See the argTypes entry.
type StressArgs = InstanceType<typeof Breadcrumb>["$props"] & { itemLineClamp: LineClamp };

const longGerman = "Haarverlängerungsbehandlungsberatungsterminvereinbarung";

const stressItems: BreadcrumbItem[] = [
  { label: "Startseite", to: "/" },
  { label: `Kategorie ${longGerman}`, to: "/kategorie" },
  { label: "" },
  { label: "   " },
  { label: "😀 Emoji first", to: "/emoji" },
  { label: "<b>not bold</b>", to: "/html" },
  { label: "تسريحات شعر جديدة لموسم الخريف", to: "/rtl" },
  { label: "https://example.com/a/very/long/url/that/never/breaks/because/it/has/no/spaces", to: "/url" },
  { label: "A", to: "/a" },
  { label: `${longGerman} und ${longGerman}` },
];

export const StressTest: StoryObj<StressArgs> = {
  name: "Stress Test (Worst-Case Data)",
  argTypes: {
    itemLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--breadcrumb-item-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.page-header { --breadcrumb-item-line-clamp: 1; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
  },
  args: {
    items: stressItems,
    separator: "→→",
    ariaLabel: "Navigationspfad",
    itemLineClamp: "none",
  },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      const componentArgs = computed(() => {
        const { itemLineClamp: _itemLineClamp, ...rest } = args;
        return rest;
      });
      const tokenStyles = computed(() => ({ "--breadcrumb-item-line-clamp": args.itemLineClamp }));
      return { componentArgs, tokenStyles };
    },
    template: `<div :style="tokenStyles"><Breadcrumb v-bind="componentArgs" /></div>`,
  }),
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: ten items including a long German compound word, an unbroken URL, " +
          "emoji, HTML-like text (must render as text), right-to-left Arabic, a single character, and two blank labels " +
          "(skipped, with no dangling separator), plus a two-character separator and a German nav label. Check at every " +
          "canvas width: labels wrap inside the trail, separators keep their size, and the last item is the current page. " +
          "Try the Item line clamp control too: it\x27s a CSS token set by the story, not a prop.",
      },
    },
  },
};
