import { computed, ref } from "vue";
import DisplayTooltipRich from "../DisplayTooltipRich.vue";
import DisplayTooltip from "../../../01.atoms/display-tooltip/DisplayTooltip.vue";
import { useTooltipsGuide } from "~/composables/useTooltips";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { TooltipContentText } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3";

type StoryArgs = {
  tooltipId: string;
  contentText: TooltipContentText;
  triggerAriaLabel: string;
  triggerIcon: string;
  closeButtonText: string;
  closeButtonAriaLabel: string;
  titleLineClamp: LineClamp;
  bodyLineClamp: LineClamp;
  actionLineClamp: LineClamp;
  styleClassPassthrough?: string | string[];
};

const contentText: TooltipContentText = {
  tooltipTitle: { tag: "h4", text: "Free delivery" },
  tooltipContent: { tag: "p", text: "Orders over £50 qualify for free standard delivery." },
  tooltipAction: { tag: "span", text: "See delivery policy" },
};

const lineClampControl = (element: string) => ({
  control: { type: "select" as const },
  options: ["none", "1", "2", "3"],
  description: `Story-only CSS token, not a prop: sets \`--display-tooltip-rich-${element}-line-clamp\` on a wrapper (\`1\` is single-line ellipsis).`,
  table: { category: "CSS tokens (story-only)" },
});

const meta: Meta<StoryArgs> = {
  title: "Molecules/DisplayTooltipRich",
  component: DisplayTooltipRich,
  argTypes: {
    tooltipId: {
      control: "text",
      description: "Base id for the popover, prefixed with `nuxt-tooltip-`. Auto-generated when omitted.",
      table: { category: "Basic" },
    },
    triggerIcon: {
      control: "text",
      description: "Iconify name for the trigger button icon (DisplayTooltip's default when empty)",
      table: { category: "Basic" },
    },
    triggerAriaLabel: {
      control: "text",
      description: "aria-label on the trigger button (override for localisation)",
      table: { category: "Accessibility" },
    },
    closeButtonText: {
      control: "text",
      description: "Visible close button text (override for localisation)",
      table: { category: "Content" },
    },
    closeButtonAriaLabel: {
      control: "text",
      description: "aria-label on the close button; keep the visible text inside it",
      table: { category: "Accessibility" },
    },
    titleLineClamp: lineClampControl("title"),
    bodyLineClamp: lineClampControl("body"),
    actionLineClamp: lineClampControl("action"),
    contentText: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    contentText,
    triggerAriaLabel: "Toggle the popover",
    closeButtonText: "Close",
    closeButtonAriaLabel: "Close tool tip",
    titleLineClamp: "none",
    bodyLineClamp: "none",
    actionLineClamp: "none",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Material 3's rich tooltip, built on DisplayTooltip: a structured panel where `contentText` supplies an optional title, body and action line (each with its own tag), followed by a built-in close button (an `InputButton`) wired to the popover and to DisplayTooltip's `close()`. Props localise the trigger and close button (`triggerAriaLabel`, `triggerIcon`, `closeButtonText`, `closeButtonAriaLabel`); the `triggerContent` slot passes through. For free-form panel content use DisplayTooltip directly.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const clampSetup = (args: StoryArgs) => ({
  componentArgs: computed(() => {
    const { titleLineClamp: _t, bodyLineClamp: _b, actionLineClamp: _a, ...rest } = args;
    return { ...rest, triggerIcon: rest.triggerIcon || undefined };
  }),
  clampStyle: computed(() => ({
    "--display-tooltip-rich-title-line-clamp": args.titleLineClamp,
    "--display-tooltip-rich-body-line-clamp": args.bodyLineClamp,
    "--display-tooltip-rich-action-line-clamp": args.actionLineClamp,
  })),
});

const renderWithClampTokens: Story["render"] = (args) => ({
  components: { DisplayTooltipRich },
  setup: () => clampSetup(args),
  template: `<div style="padding: 8rem;" :style="clampStyle"><DisplayTooltipRich v-bind="componentArgs" /></div>`,
});

export const Default: Story = {
  render: renderWithClampTokens,
};

export const TitleOnly: Story = {
  args: {
    contentText: { tooltipTitle: { tag: "h4", text: "Just a title" } },
  },
  render: renderWithClampTokens,
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    contentText: {
      tooltipTitle: {
        tag: "h4",
        text: "😀 Kostenloselieferungfürallebestellungenübereinemmindestbestellwert <b>not bold</b> التوصيل المجاني",
      },
      tooltipContent: {
        tag: "",
        text: "https://example.invalid/a/very/long/unbroken/url/that/never/offers/a/break/opportunity/anywhere ".repeat(2) +
          "Bestellungen über fünfzig Pfund qualifizieren sich für die kostenlose Standardlieferung innerhalb des Vereinigten Königreichs, ausgenommen sind Inseln und abgelegene Regionen.",
      },
      tooltipAction: { tag: "span", text: "Lieferrichtliniensowierückgabebedingungenansehen" },
    },
    triggerAriaLabel: "Weitereinformationenzurlieferunganzeigen 😀",
    closeButtonText: "Schließenundzurückzurbestellübersicht",
    closeButtonAriaLabel: "Schließenundzurückzurbestellübersicht",
    titleLineClamp: "2",
    bodyLineClamp: "none",
    actionLineClamp: "1",
  },
  render: (args) => ({
    components: { DisplayTooltipRich },
    setup: () => clampSetup(args),
    template: `
      <div style="display: grid; gap: 2.4rem; padding: 2.4rem; font-size: 1.4rem;" :style="clampStyle">
        <p style="margin: 0;">Every field at its worst, an empty body tag (falls back to <code>&lt;p&gt;</code>) and a long unbroken close label. The line-clamp controls apply to this tooltip.</p>
        <div style="inline-size: 18rem; outline: 0.1rem dashed currentColor;">
          <DisplayTooltipRich v-bind="componentArgs">
            <template #triggerContent>
              <span>Lieferkostenundversandbedingungen</span>
            </template>
          </DisplayTooltipRich>
        </div>

        <p style="margin: 0;">Empty <code>contentText</code>: the panel holds only the close button.</p>
        <DisplayTooltipRich :content-text="{}"></DisplayTooltipRich>

        <p style="margin: 0;">Single characters in every field.</p>
        <DisplayTooltipRich
          :content-text="{ tooltipTitle: { tag: 'h4', text: 'T' }, tooltipContent: { tag: 'p', text: 'B' }, tooltipAction: { tag: 'span', text: 'A' } }"
          close-button-text="X"
          close-button-aria-label="X"
        ></DisplayTooltipRich>

        <p style="margin: 0;">Right-to-left content at the right edge: the panel flips to the left of the trigger.</p>
        <div style="display: flex; justify-content: flex-end;">
          <DisplayTooltipRich
            :content-text="{ tooltipTitle: { tag: 'h4', text: 'التوصيل المجاني' }, tooltipContent: { tag: 'p', text: 'الطلبات التي تزيد عن خمسين جنيهًا مؤهلة للتوصيل المجاني.' } }"
          ></DisplayTooltipRich>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      story: { inline: false, height: "900px" },
      description: {
        story:
          "Worst-case `contentText`. Open each tooltip and check: unbroken title, body, action and close-button text wraps inside the panel and the panel never gets wider than the viewport; HTML-like text renders as text; the title is capped at two lines and the action at one with an ellipsis (change them with the story-only line-clamp controls); the close button stays right-aligned at its natural width instead of stretching; an empty `contentText` leaves just the close button; a trigger at the right edge opens its panel to the left.",
      },
    },
  },
};

export const GuidedTour: Story = {
  parameters: {
    docs: {
      story: { inline: false, height: "500px" },
      description: {
        story:
          "`useTooltipsGuide` walks a container's `[popover]` elements in DOM order, opening each and waiting for its close button before advancing. Mixes a `DisplayTooltipRich` step (its close button relabelled \"Next\" via `closeButtonText`) with a plain `DisplayTooltip` step. A hand-written close button must call the `tooltipContent` slot's `close()` as well as carrying `popovertargetaction=\"hide\"`: the attribute alone does nothing on Safari 16, which has no Popover API. The guide auto-starts 800ms after mount; use \"Run guide again\" to replay it.",
      },
    },
  },
  render: () => ({
    components: { DisplayTooltipRich, DisplayTooltip },
    setup() {
      const guideContainer = ref<HTMLElement | null>(null);
      const { isGuideRunning, restartGuide, currentTooltipIndex, totalPopovers } = useTooltipsGuide(guideContainer, {
        autoStart: true,
        startDelay: 800,
      });

      return { guideContainer, isGuideRunning, restartGuide, currentTooltipIndex, totalPopovers };
    },
    template: `
      <div style="padding: 4rem; display: grid; gap: 2rem; max-width: 48rem;">
        <div style="display: flex; align-items: center; gap: 1.2rem;">
          <button type="button" @click="restartGuide" :disabled="isGuideRunning" style="padding: 0.6rem 1.2rem;">
            {{ isGuideRunning ? 'Guide running…' : 'Run guide again' }}
          </button>
          <span v-if="isGuideRunning" style="font-size: 1.3rem; color: #666;">
            Step {{ currentTooltipIndex + 1 }} of {{ totalPopovers }}: click Next (Close on the last step) to advance
          </span>
        </div>

        <div ref="guideContainer" style="display: grid; gap: 2rem;">
          <DisplayTooltipRich
            close-button-text="Next"
            close-button-aria-label="Next step"
            :content-text="{
              tooltipTitle: { tag: 'h3', text: 'Step 1' },
              tooltipContent: { tag: 'p', text: 'This step uses DisplayTooltipRich: structured title/body/action content plus a built-in close button.' },
              tooltipAction: { tag: 'p', text: 'Step 1 of 2' },
            }"
          >
            <template #triggerContent>Trigger from DisplayTooltipRich</template>
          </DisplayTooltipRich>

          <DisplayTooltip tooltip-id="guided-tour-step-2">
            <template #triggerContent>Trigger from plain DisplayTooltip</template>
            <template #tooltipContent="{ close }">
              <p>This step uses plain DisplayTooltip: you supply the close button yourself via the tooltipContent slot.</p>
              <button
                type="button"
                popovertarget="guided-tour-step-2"
                popovertargetaction="hide"
                class="display-tooltip-close-button"
                style="align-self: flex-end;"
                aria-label="Close tool tip"
                @click="close"
              >
                Close
              </button>
            </template>
          </DisplayTooltip>
        </div>
      </div>
    `,
  }),
};
