<template>
  <DisplayTooltip :tooltip-id="tooltipId" :style-class-passthrough="styleClassPassthrough">
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
        <component
          :is="contentText.tooltipContent?.tag"
          v-if="contentText.tooltipContent"
          class="tooltip-body body-sm"
        >
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
          aria-label="Close tool tip"
        >
          Close
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
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tooltipId: "",
  contentText: () => ({}),
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
    .tooltip-title {
      color: var(--display-tooltip-defined-title-colour, inherit);
    }

    .tooltip-body {
      color: var(--display-tooltip-defined-body-colour, inherit);
    }

    .tooltip-action {
      color: var(--display-tooltip-defined-action-colour, inherit);
    }
  }
}
}
</style>
