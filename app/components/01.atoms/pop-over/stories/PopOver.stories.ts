import PopOver from "../PopOver.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof PopOver> = {
  title: "Atoms/PopOver",
  component: PopOver,
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Which side of the trigger the popover panel opens on.",
      table: { category: "Basic" },
    },
    triggerAriaLabel: {
      control: "text",
      description: "aria-label on the trigger button — set this when the trigger slot is icon-only.",
      table: { category: "Accessibility" },
    },
    popoverAriaLabel: {
      control: "text",
      description: "Names the popover panel and gives it role=\"dialog\"; set this when the content slot has no visible heading.",
      table: { category: "Accessibility" },
    },
    closeButtonAriaLabel: {
      control: "text",
      description: "aria-label on the close button — override for localisation.",
      table: { category: "Accessibility" },
    },
    closeIcon: {
      control: "text",
      description: "Iconify name for the close button icon.",
      table: { category: "Basic" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    placement: "right",
    closeButtonAriaLabel: "Close",
    closeIcon: "lucide:x",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A generic anchor-positioned disclosure panel built on the native Popover API and CSS anchor positioning, with fallbacks for Safari 16-18. The `trigger` and `content` slots are entirely consumer-supplied; `placement` picks the side the panel opens on (it flips when there is no room), and the close button is labelled by `closeButtonAriaLabel` with its icon set by `closeIcon`. Set `triggerAriaLabel` for an icon-only trigger and `popoverAriaLabel` when the content has no visible heading. See DisplayTooltip for a fixed icon-trigger variant, or ActionMenu for one with menu semantics.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopOver>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Plain text trigger and a single paragraph of content. Use the Controls panel to change the placement and labels.",
      },
    },
  },
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <PopOver v-bind="args">
          <template #trigger>
            <span>Open popover</span>
          </template>
          <template #content>
            <p>This is some popover content.</p>
          </template>
        </PopOver>
      </div>
    `,
  }),
};

export const Placements: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "One instance per `placement` value. Each panel flips to the opposite side when it would overflow the viewport.",
      },
    },
  },
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 4rem; padding: 10rem;">
        <PopOver v-bind="args" placement="top">
          <template #trigger><span>Top</span></template>
          <template #content><p>Opens above the trigger.</p></template>
        </PopOver>
        <PopOver v-bind="args" placement="right">
          <template #trigger><span>Right</span></template>
          <template #content><p>Opens to the right of the trigger.</p></template>
        </PopOver>
        <PopOver v-bind="args" placement="bottom">
          <template #trigger><span>Bottom</span></template>
          <template #content><p>Opens below the trigger.</p></template>
        </PopOver>
        <PopOver v-bind="args" placement="left">
          <template #trigger><span>Left</span></template>
          <template #content><p>Opens to the left of the trigger.</p></template>
        </PopOver>
      </div>
    `,
  }),
};

export const IconTrigger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An icon-only trigger: `triggerAriaLabel` gives the button its accessible name, and `popoverAriaLabel` names the panel because the content has no visible heading.",
      },
    },
  },
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <PopOver v-bind="args" trigger-aria-label="Show filters" popover-aria-label="Filter options">
          <template #trigger>
            <Icon name="lucide:filter" aria-hidden="true" />
          </template>
          <template #content>
            <p>Filter controls would go here.</p>
          </template>
        </PopOver>
      </div>
    `,
  }),
};

export const CustomColours: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Overriding the public colour tokens with inline custom properties on the component.",
      },
    },
  },
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <PopOver
          v-bind="args"
          style="--pop-over-background-colour: #1a1a1a; --pop-over-text-colour: white; --pop-over-border-colour: transparent;"
        >
          <template #trigger>
            <span>Open popover</span>
          </template>
          <template #content>
            <p>Overriding the public tokens via inline custom properties.</p>
          </template>
        </PopOver>
      </div>
    `,
  }),
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    triggerAriaLabel: "Weitereinformationenzurlieferunganzeigen 😀",
    popoverAriaLabel: "Lieferbedingungenundrückgaberichtlinien",
    closeButtonAriaLabel: "Schließenundzurückzurbestellübersicht",
  },
  render: (args) => ({
    components: { PopOver },
    setup() {
      return { args };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem; font-size: 1.4rem;">
        <p style="margin: 0;">Long unbroken trigger text and worst-case content inside an 18rem column.</p>
        <div style="inline-size: 18rem; outline: 0.1rem dashed currentColor;">
          <PopOver v-bind="args">
            <template #trigger>
              <span>😀 Lieferkostenundversandbedingungenfürallebestellungen</span>
            </template>
            <template #content>
              <h3 style="margin-block-end: 0.8rem;">Kostenloselieferungfürallebestellungenübereinemmindestbestellwert</h3>
              <p>https://example.invalid/a/very/long/unbroken/url/that/never/offers/a/break/opportunity/anywhere/at/all</p>
              <p>&lt;b&gt;not bold&lt;/b&gt; Bestellungen über fünfzig Pfund qualifizieren sich für die kostenlose Standardlieferung innerhalb des Vereinigten Königreichs, ausgenommen sind Inseln und abgelegene Regionen.</p>
            </template>
          </PopOver>
        </div>

        <p style="margin: 0;">An oversized <code>--pop-over-width</code> (80rem): the panel stays inside the viewport.</p>
        <PopOver placement="bottom" style="--pop-over-width: 80rem;">
          <template #trigger><span>Very wide panel</span></template>
          <template #content><p>The panel is capped at the viewport width minus 3.2rem.</p></template>
        </PopOver>

        <p style="margin: 0;">Very tall content: the panel caps at the viewport height and scrolls.</p>
        <PopOver placement="bottom">
          <template #trigger><span>Very tall panel</span></template>
          <template #content>
            <p v-for="n in 30" :key="n">Paragraph {{ n }} of thirty.</p>
          </template>
        </PopOver>

        <p style="margin: 0;">Empty content slot, and single characters in the trigger and content.</p>
        <div style="display: flex; gap: 2.4rem;">
          <PopOver placement="bottom">
            <template #trigger><span>Empty content</span></template>
          </PopOver>
          <PopOver placement="bottom" trigger-aria-label="X">
            <template #trigger><span>X</span></template>
            <template #content><p>Y</p></template>
          </PopOver>
        </div>

        <p style="margin: 0;">Right-to-left content at the right edge: the panel flips left and the close button sits at the inline end.</p>
        <div dir="rtl" style="display: flex; justify-content: flex-start;">
          <PopOver placement="right" close-button-aria-label="إغلاق">
            <template #trigger><span>التوصيل المجاني</span></template>
            <template #content><p>الطلبات التي تزيد عن خمسين جنيهًا مؤهلة للتوصيل المجاني.</p></template>
          </PopOver>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      story: { inline: false, height: "900px" },
      description: {
        story:
          "Worst-case content. Open each popover and check: unbroken trigger text wraps inside the dashed column; unbroken heading, URL and German copy wrap inside the panel; HTML-like text renders as text; an oversized `--pop-over-width` never makes the panel wider than the viewport; very tall content scrolls inside a panel no taller than the viewport; an empty content slot leaves just the close button; right-to-left content puts the close button at the inline end and flips the panel when there is no room.",
      },
    },
  },
};
