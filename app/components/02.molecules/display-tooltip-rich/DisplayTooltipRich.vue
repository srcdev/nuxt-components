<template>
  <DisplayTooltip
    :tooltip-id="tooltipId"
    :trigger-aria-label="triggerAriaLabel"
    :trigger-icon="triggerIcon"
    :style-class-passthrough="rootClasses"
  >
    <template v-if="$slots.triggerContent" #triggerContent>
      <slot name="triggerContent"></slot>
    </template>
    <template #tooltipContent="{ close }">
      <div class="display-tooltip-rich-content">
        <component
          :is="tagOf(contentText.tooltipTitle, 'p')"
          v-if="contentText.tooltipTitle"
          class="display-tooltip-rich-title"
        >
          {{ contentText.tooltipTitle.text }}
        </component>
        <component
          :is="tagOf(contentText.tooltipContent, 'p')"
          v-if="contentText.tooltipContent"
          class="display-tooltip-rich-body"
        >
          {{ contentText.tooltipContent.text }}
        </component>
        <component
          :is="tagOf(contentText.tooltipAction, 'span')"
          v-if="contentText.tooltipAction"
          class="display-tooltip-rich-action"
        >
          {{ contentText.tooltipAction.text }}
        </component>
        <InputButton
          type="button"
          variant="inline"
          :popovertarget="tooltipId"
          popovertargetaction="hide"
          :button-text="closeButtonText"
          :aria-label="closeButtonAriaLabel"
          style-class-passthrough="display-tooltip-close-button"
          @click="close"
        />
      </div>
    </template>
  </DisplayTooltip>
</template>

<script setup lang="ts">
import type { TooltipContentText, TooltipContentTextItem } from "~/types/components";

interface Props {
  tooltipId?: string;
  contentText?: TooltipContentText;
  /** aria-label on the trigger button — override for localisation. */
  triggerAriaLabel?: string;
  /** Iconify name for the trigger button icon. */
  triggerIcon?: string;
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
  triggerIcon: undefined,
  closeButtonText: "Close",
  closeButtonAriaLabel: "Close tool tip",
  styleClassPassthrough: () => [],
});

const generatedTooltipId = `nuxt-tooltip-${useId()}`;
const tooltipId = computed(() => (props.tooltipId ? `nuxt-tooltip-${props.tooltipId}` : generatedTooltipId));

const rootClasses = computed(() => ["display-tooltip-rich", ...[props.styleClassPassthrough].flat()]);

const tagOf = (item: TooltipContentTextItem | undefined, fallback: string) => item?.tag?.trim() || fallback;
</script>

<style lang="css">
@layer components {
  .display-tooltip.display-tooltip-rich {
    .display-tooltip-rich-content {
      display: flex;
      flex-direction: column;
      gap: var(--display-tooltip-rich-content-gap, 1.2rem);

      .display-tooltip-rich-title,
      .display-tooltip-rich-body,
      .display-tooltip-rich-action {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        overflow-wrap: anywhere;
      }

      /* margin-block resets the UA margin of whatever tag contentText.*.tag picks, so gap is the only spacing. */
      .display-tooltip-rich-title {
        color: var(--display-tooltip-rich-title-colour, inherit);
        margin-block: var(--display-tooltip-rich-title-margin-block, 0 0);
        font-size: var(--display-tooltip-rich-title-font-size, 1.6rem);
        font-weight: var(--display-tooltip-rich-title-font-weight, 700);
        line-height: var(--display-tooltip-rich-title-line-height, 120%);
        letter-spacing: var(--display-tooltip-rich-title-letter-spacing, normal);
        -webkit-line-clamp: var(--display-tooltip-rich-title-line-clamp, none);
        line-clamp: var(--display-tooltip-rich-title-line-clamp, none);
      }

      .display-tooltip-rich-body {
        color: var(--display-tooltip-rich-body-colour, inherit);
        margin-block: var(--display-tooltip-rich-body-margin-block, 0 0);
        font-size: var(--display-tooltip-rich-body-font-size, 1.3rem);
        font-weight: var(--display-tooltip-rich-body-font-weight, inherit);
        line-height: var(--display-tooltip-rich-body-line-height, 140%);
        letter-spacing: var(--display-tooltip-rich-body-letter-spacing, normal);
        -webkit-line-clamp: var(--display-tooltip-rich-body-line-clamp, none);
        line-clamp: var(--display-tooltip-rich-body-line-clamp, none);
      }

      .display-tooltip-rich-action {
        color: var(--display-tooltip-rich-action-colour, inherit);
        margin-block: var(--display-tooltip-rich-action-margin-block, 0 0);
        font-size: var(--display-tooltip-rich-action-font-size, 1.4rem);
        font-weight: var(--display-tooltip-rich-action-font-weight, 700);
        line-height: var(--display-tooltip-rich-action-line-height, 130%);
        letter-spacing: var(--display-tooltip-rich-action-letter-spacing, normal);
        -webkit-line-clamp: var(--display-tooltip-rich-action-line-clamp, none);
        line-clamp: var(--display-tooltip-rich-action-line-clamp, none);
      }

      .display-tooltip-close-button.input-button {
        align-self: flex-end;
        margin-block: var(--display-tooltip-rich-close-button-margin-block, 1.2rem 0);
        overflow-wrap: anywhere;

        .input-button-text {
          font-size: inherit;
          text-transform: none;
        }
      }
    }
  }
}
</style>
