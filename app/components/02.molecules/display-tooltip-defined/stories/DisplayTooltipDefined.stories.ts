import { ref } from "vue";
import DisplayTooltipDefined from "../DisplayTooltipDefined.vue";
import DisplayTooltip from "../../../01.atoms/display-tooltip/DisplayTooltip.vue";
import { useTooltipsGuide } from "~/composables/useTooltips";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { TooltipContentText } from "~/types/components";

const contentText: TooltipContentText = {
  tooltipTitle: { tag: "h4", text: "Free delivery" },
  tooltipContent: { tag: "p", text: "Orders over £50 qualify for free standard delivery." },
  tooltipAction: { tag: "span", text: "See delivery policy" },
};

const meta: Meta<typeof DisplayTooltipDefined> = {
  title: "Molecules/DisplayTooltipDefined",
  component: DisplayTooltipDefined,
  argTypes: {
    tooltipId: {
      control: "text",
      description: "Id used to link the trigger button to the popover. Auto-generated when omitted.",
      table: { category: "Basic" },
    },
    contentText: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    contentText,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Structured title/body/action content variant of DisplayTooltip, plus a built-in close button wired to the popover.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayTooltipDefined>;

export const Default: Story = {
  render: (args) => ({
    components: { DisplayTooltipDefined },
    setup() {
      return { args };
    },
    template: `<div style="padding: 8rem;"><DisplayTooltipDefined v-bind="args" /></div>`,
  }),
};

export const TitleOnly: Story = {
  args: {
    contentText: { tooltipTitle: { tag: "h4", text: "Just a title" } },
  },
  render: (args) => ({
    components: { DisplayTooltipDefined },
    setup() {
      return { args };
    },
    template: `<div style="padding: 8rem;"><DisplayTooltipDefined v-bind="args" /></div>`,
  }),
};

export const GuidedTour: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Recreates the deleted `app/pages/ui/tooltips.vue` demo: `useTooltipsGuide` walks a container's `[popover]` elements in DOM order, opening each and waiting for its close button before advancing — the autoplay-through-steps pattern seen on some guide intros. Mixes a `DisplayTooltipDefined` step with a plain `DisplayTooltip` step (the guide works with either, since it only needs native `[popover]`/`popovertarget` markup). Guide auto-starts 800ms after mount in this story; use \"Run guide again\" to replay it.",
      },
    },
  },
  render: () => ({
    components: { DisplayTooltipDefined, DisplayTooltip },
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
          <button @click="restartGuide" :disabled="isGuideRunning" style="padding: 0.6rem 1.2rem;">
            {{ isGuideRunning ? 'Guide running…' : 'Run guide again' }}
          </button>
          <span v-if="isGuideRunning" style="font-size: 1.3rem; color: #666;">
            Step {{ currentTooltipIndex + 1 }} of {{ totalPopovers }} — click each popover's Close button to advance
          </span>
        </div>

        <div ref="guideContainer" style="display: grid; gap: 2rem;">
          <DisplayTooltipDefined
            :content-text="{
              tooltipTitle: { tag: 'h3', text: 'Step 1' },
              tooltipContent: { tag: 'p', text: 'This step uses DisplayTooltipDefined — structured title/body/action content plus a built-in close button.' },
              tooltipAction: { tag: 'p', text: 'Step 1 of 2' },
            }"
          >
            <template #triggerContent>Trigger from DisplayTooltipDefined</template>
          </DisplayTooltipDefined>

          <DisplayTooltip tooltip-id="guided-tour-step-2">
            <template #triggerContent>Trigger from plain DisplayTooltip</template>
            <template #tooltipContent>
              <p style="margin: 0;">This step uses plain DisplayTooltip — you supply the close button yourself via the tooltipContent slot.</p>
              <button
                popovertarget="guided-tour-step-2"
                popovertargetaction="hide"
                class="display-tooltip-close-button"
                style="align-self: flex-end;"
                aria-label="Close tool tip"
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
