import { computed, ref } from "vue";
import PriceList from "../PriceList.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas, PriceListData } from "~/types/components";

const priceListData = [
  {
    headingtext: "Cutting & Treatment",
    headingIcon: "lucide:sparkles",
    items: [
      { description: "Cut & Blow Dry", price: "£45" },
      { description: "Restyle", price: "£65" },
      { description: "Wash & Blow Dry", price: "£35" },
      { description: "Trim & Tidy", price: "£25" },
      { description: "Keratin Treatment", price: "£120", from: true },
    ],
  },
  {
    headingtext: "Hair Colouring",
    headingIcon: "lucide:sparkles",
    items: [
      { description: "Full Head Colour", price: "£75" },
      { description: "Half Head Highlights", price: "£65" },
      { description: "Full Head Highlights", price: "£85" },
      { description: "Balayage", price: "£95", from: true },
      { description: "Toner", price: "£35" },
    ],
  },
];

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only arg: drives a CSS token, not a PriceList prop. See the argTypes entry.
type StoryArgs = InstanceType<typeof PriceList>["$props"] & {
  descriptionLineClamp: LineClamp;
};

const meta: Meta<StoryArgs> = {
  title: "Molecules/PriceList",
  component: PriceList,
  argTypes: {
    descriptionLineClamp: {
      control: "select",
      options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
      description:
        "**Story control, not a prop.** Sets the `--price-list-description-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.salon-menu { --price-list-description-line-clamp: 2; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
    priceListData: {
      control: "object",
      description: "Array of columns, each with a heading and list of items",
      table: { category: "Content" },
    },
    headingTag: {
      control: "select",
      options: ["h2", "h3", "h4", "h5", "h6"],
      description: "Heading level for each column title; pick to fit the surrounding page outline",
      table: { category: "Content", defaultValue: { summary: "h2" } },
    },
    fromLabel: {
      control: "text",
      description: "Text shown before a price whose item has `from: true`",
      table: { category: "Content", defaultValue: { summary: "from" } },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Styling" },
    },
  },
  args: {
    descriptionLineClamp: "none",
  },
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
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { descriptionLineClamp: _descriptionLineClamp, ...rest } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--price-list-description-line-clamp": args.descriptionLineClamp,
  }));
  return { componentArgs, tokenStyles };
}

const render = (args: StoryArgs) => ({
  components: { PriceList },
  setup() {
    return useStorySetup(args);
  },
  template: `<div :style="tokenStyles"><PriceList v-bind="componentArgs" /></div>`,
});

export const Default: Story = {
  args: {
    priceListData,
    headingTag: "h2",
    fromLabel: "from",
    styleClassPassthrough: [],
  },
  render,
};

export const SingleColumn: Story = {
  name: "Single Column",
  args: {
    priceListData: [priceListData[0]!],
  },
  render,
};

export const EmptyState: Story = {
  name: "Empty State",
  args: {
    priceListData: priceListData.map(({ headingtext, headingIcon }) => ({ headingtext, headingIcon, items: [] })),
  },
  render,
};

export const NoIcons: Story = {
  name: "No Icons",
  args: {
    priceListData: priceListData.map(({ headingtext, items }) => ({ headingtext, items })),
  },
  render,
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const stressPriceListData: PriceListData[] = [
  {
    headingtext: "Haarschnitte, Pflegebehandlungen und Kopfhautmassagen für jeden Haartyp und jede Länge",
    headingIcon: "lucide:sparkles",
    items: [
      { description: "Pneumonoultramicroscopicsilicovolcanoconiosisbehandlungohneleerzeichen", price: "£45" },
      {
        description: `${"Cut, wash, condition, blow dry and finish with a heat protectant serum. ".repeat(5)}`,
        price: "£1,234.56 – £9,999.99 pro Sitzung inklusive Beratung",
        from: true,
      },
      { description: "Price with no spaces", price: "£123456789012345678901234567890.00" },
      { description: "From, but the price is empty", price: "", from: true },
      { description: "", price: "£10" },
      { description: "💇‍♀️💅🏽 Emoji first", price: "£0" },
      { description: "<script>alert('xss')</script> rendered as text &amp; entities", price: "<b>£5</b>" },
      { description: "قص الشعر وتصفيفه", price: "٤٥ £" },
      { description: "X", price: "1" },
      { description: "See https://example.com/a/very/long/path/that/never/breaks/segmentsegmentsegment", price: "-£20" },
    ],
  },
  {
    headingtext: "",
    items: Array.from({ length: 30 }, (_, i) => ({ description: `Item ${i + 1} in a column with no heading`, price: `£${(i + 1) * 5}` })),
  },
  {
    headingtext: "Broken icon, no items",
    headingIcon: "lucide:this-icon-does-not-exist",
    items: [],
  },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    priceListData: stressPriceListData,
    headingTag: "h2",
    fromLabel: "ab einem Mindestpreis von",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: a long German heading, unbroken description and price strings, " +
          "a long price range with a long German 'from' label, a 'from' item with an empty price, an empty description, " +
          "emoji, HTML-like text (must render as text), right-to-left Arabic, single characters, a negative price, " +
          "a column with no heading (no empty heading is rendered) and 30 items, a broken icon name, and a column with no items. " +
          "Check at every canvas width: nothing overflows its column, the price column never takes more than half the row " +
          "and wraps inside it, columns go two-up only when the container is wide enough, and a third column wraps to a new row. " +
          "Try the Description line clamp control too: it's a CSS token set by the story, not a prop.",
      },
    },
  },
};
