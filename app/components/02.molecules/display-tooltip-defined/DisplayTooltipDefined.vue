<template>
  <DisplayTooltip
    :tooltip-id="tooltipId"
    :trigger-aria-label="triggerAriaLabel"
    :style-class-passthrough="styleClassPassthrough"
  >
    <template v-if="$slots.triggerContent" #triggerContent>
      <slot name="triggerContent"></slot>
    </template>
    <template #tooltipContent>
      <div class="popover-content-defined">
        <component
          :is="contentText.tooltipTitle?.tag"
          v-if="contentText.tooltipTitle"
          class="tooltip-title subtitle-sm"
        >
          {{ contentText.tooltipTitle.text }}
        </component>
        <component :is="contentText.tooltipContent?.tag" v-if="contentText.tooltipContent" class="tooltip-body body-sm">
          {{ contentText.tooltipContent.text }}
        </component>
        <component
          :is="contentText.tooltipAction?.tag"
          v-if="contentText.tooltipAction"
          class="tooltip-action input-value"
        >
          {{ contentText.tooltipAction.text }}
        </component>
        <button
          :popovertarget="tooltipId"
          popovertargetaction="hide"
          class="display-tooltip-close-button"
          :aria-label="closeButtonAriaLabel"
        >
          {{ closeButtonText }}
        </button>
      </div>
    </template>
  </DisplayTooltip>
</template>

<script setup lang="ts">
import type { TooltipContentText } from "~/types/components";

interface Props {
  tooltipId?: string;
  contentText?: TooltipContentText;
  /** aria-label on the trigger button — override for localisation. */
  triggerAriaLabel?: string;
  /** Visible text on the close button — override for localisation. */
  closeButtonText?: string;
  /** aria-label on the close button — override for localisation. */
  closeButtonAriaLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tooltipId: "",
  contentText: () => ({}),
  triggerAriaLabel: "Toggle the popover",
  closeButtonText: "Close",
  closeButtonAriaLabel: "Close tool tip",
  styleClassPassthrough: () => [],
});

const tooltipId = computed(() =>
  props.tooltipId.length ? `nuxt-tooltip-${props.tooltipId}` : `nuxt-tooltip-${useId()}`
);
</script>

<style lang="css">
@layer components {
  .display-tooltip-core {
    .popover-content-defined {
      display: flex;
      flex-direction: column;
      gap: var(--display-tooltip-defined-content-gap, 1.2rem);

      /* margin-block resets below neutralise the UA default margin of whatever tag the consumer
         picks via contentText.*.tag (e.g. h3/h4 carry their own margin-block) — gap is the only
         intended spacing mechanism between these three. */
      .tooltip-title {
        color: var(--display-tooltip-defined-title-colour, inherit);
        margin-block: var(--display-tooltip-defined-title-margin-block, 0 0);
        font-size: var(--display-tooltip-defined-title-font-size, 1.6rem);
        font-weight: var(--display-tooltip-defined-title-font-weight, 700);
        line-height: var(--display-tooltip-defined-title-line-height, 120%);
        letter-spacing: var(--display-tooltip-defined-title-letter-spacing, normal);
      }

      .tooltip-body {
        color: var(--display-tooltip-defined-body-colour, inherit);
        margin-block: var(--display-tooltip-defined-body-margin-block, 0 0);
        font-size: var(--display-tooltip-defined-body-font-size, 1.3rem);
        font-weight: var(--display-tooltip-defined-body-font-weight, inherit);
        line-height: var(--display-tooltip-defined-body-line-height, 140%);
        letter-spacing: var(--display-tooltip-defined-body-letter-spacing, normal);
      }

      .tooltip-action {
        color: var(--display-tooltip-defined-action-colour, inherit);
        margin-block: var(--display-tooltip-defined-action-margin-block, 0 0);
        font-size: var(--display-tooltip-defined-action-font-size, 1.4rem);
        font-weight: var(--display-tooltip-defined-action-font-weight, 700);
        line-height: var(--display-tooltip-defined-action-line-height, 130%);
        letter-spacing: var(--display-tooltip-defined-action-letter-spacing, normal);
      }

      .display-tooltip-close-button {
        align-self: flex-end;
        margin-block: var(--display-tooltip-defined-close-button-margin-block, 1.2rem 0);
      }
    }
  }
}
</style>
