import DisplayTooltip from "../DisplayTooltip.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof DisplayTooltip> = {
  title: "Atoms/DisplayTooltip",
  component: DisplayTooltip,
  argTypes: {
    tooltipId: {
      control: "text",
      description: "Id used to link the trigger button to the popover. Auto-generated when omitted.",
      table: { category: "Basic" },
    },
    hideTrigger: {
      control: "boolean",
      description: "Visually hides the trigger button and removes it from the tab order and accessibility tree. It stays in the DOM as the panel's anchor, for a panel opened by your own `popovertarget` button.",
      table: { category: "Basic" },
    },
    triggerAriaLabel: {
      control: "text",
      description: "aria-label on the trigger button (override for localisation)",
      table: { category: "Accessibility" },
    },
    triggerIcon: {
      control: "text",
      description: "Iconify name for the trigger button icon",
      table: { category: "Basic" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    hideTrigger: false,
    triggerAriaLabel: "Toggle the popover",
    triggerIcon: "fa7-solid:circle-question",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A trigger button that opens an anchor-positioned popover panel, built on the native Popover API and CSS anchor positioning (with fallbacks for Safari 16-18). Slots: `triggerContent` (a label before the button) and `tooltipContent` (the panel, with a scoped `close()`). Props set the trigger's icon (`triggerIcon`) and accessible name (`triggerAriaLabel`). DisplayTooltipDefined builds on this with a structured title, body and close button: see its stories.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayTooltip>;

export const Default: Story = {
  render: (args) => ({
    components: { DisplayTooltip },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <DisplayTooltip v-bind="args">
          <template #tooltipContent>
            <p>This is some helpful additional information.</p>
          </template>
        </DisplayTooltip>
      </div>
    `,
  }),
};

export const WithTriggerContent: Story = {
  render: (args) => ({
    components: { DisplayTooltip },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <DisplayTooltip v-bind="args">
          <template #triggerContent>
            <span>Delivery cost</span>
          </template>
          <template #tooltipContent>
            <p>Free delivery on orders over £50.</p>
          </template>
        </DisplayTooltip>
      </div>
    `,
  }),
};

export const CustomColours: Story = {
  render: (args) => ({
    components: { DisplayTooltip },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 8rem;">
        <DisplayTooltip
          v-bind="args"
          style="--display-tooltip-popover-background-colour: #1a1a1a; --display-tooltip-popover-text-colour: white; --display-tooltip-popover-outline-colour: transparent;"
        >
          <template #tooltipContent>
            <p>Overriding the public tokens via inline custom properties.</p>
          </template>
        </DisplayTooltip>
      </div>
    `,
  }),
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    triggerAriaLabel: "Weitereinformationenzudieserangabeanzeigenundausblenden 😀",
  },
  render: (args) => ({
    components: { DisplayTooltip },
    setup() {
      return { args };
    },
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem; font-size: 1.4rem;">
        <p style="margin: 0;">A long unbroken label in a narrow column: the label wraps and the button stays beside its first line.</p>
        <div style="inline-size: 16rem; outline: 0.1rem dashed currentColor;">
          <DisplayTooltip v-bind="args">
            <template #triggerContent>
              <span>Lieferkostenundversandbedingungenfürauslandsbestellungen</span>
            </template>
            <template #tooltipContent>
              <p>Short content.</p>
            </template>
          </DisplayTooltip>
        </div>

        <p style="margin: 0;">Long unbroken popover content with emoji, HTML-like text and right-to-left text: the panel stays within the viewport width and wraps.</p>
        <DisplayTooltip v-bind="args">
          <template #triggerContent>
            <span>😀 &lt;b&gt;not bold&lt;/b&gt;</span>
          </template>
          <template #tooltipContent>
            <p>https://example.invalid/a/very/long/unbroken/url/that/never/offers/a/break/opportunity/anywhere</p>
            <p>Kostenloselieferungbeibestellungenübereinenbestimmtenmindestbestellwert 😀</p>
            <p>&lt;script&gt;alert("x")&lt;/script&gt; renders as text.</p>
            <p dir="rtl">التوصيل مجاني للطلبات التي تزيد عن خمسين جنيهًا.</p>
          </template>
        </DisplayTooltip>

        <p style="margin: 0;">Many paragraphs: the panel grows to its content's height.</p>
        <DisplayTooltip v-bind="args">
          <template #tooltipContent>
            <p v-for="n in 8" :key="n">Paragraph {{ n }}: Lorem ipsum odor amet, consectetuer adipiscing elit.</p>
          </template>
        </DisplayTooltip>

        <p style="margin: 0;">Empty <code>tooltipContent</code> and a single-character label: the panel is just its padding.</p>
        <DisplayTooltip v-bind="args">
          <template #triggerContent><span>x</span></template>
          <template #tooltipContent></template>
        </DisplayTooltip>

        <p style="margin: 0;">A broken <code>triggerIcon</code> name: the button keeps its size and stays focusable.</p>
        <DisplayTooltip v-bind="args" trigger-icon="not-a-set:not-an-icon">
          <template #tooltipContent><p>Opened from an empty button.</p></template>
        </DisplayTooltip>

        <p style="margin: 0;">Right-aligned at the edge of the canvas: the panel flips to the left of the trigger.</p>
        <div style="display: flex; justify-content: flex-end;">
          <DisplayTooltip v-bind="args">
            <template #tooltipContent><p>Flipped to fit.</p></template>
          </DisplayTooltip>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      story: { inline: false, height: "900px" },
      description: {
        story:
          "Worst-case content. Open each tooltip and check: long unbroken labels wrap without pushing the button out of a narrow column, panel content wraps and the panel never gets wider than the viewport, HTML-like text renders as text, an empty panel collapses to its padding, a broken icon name leaves an empty but focusable button, and a trigger at the right edge opens its panel to the left. Tab through: every trigger is reachable and shows a focus ring. The long `triggerAriaLabel` is only the buttons' accessible name, so it never shows on screen.",
      },
    },
  },
};
