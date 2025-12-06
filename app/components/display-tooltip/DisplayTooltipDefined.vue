<template>
  <DisplayTooltip :tooltip-id="tooltipId" :style-class-passthrough>
    <template v-if="slots.triggerContent" #triggerContent>
      <slot name="triggerContent"></slot>
    </template>
    <template #tooltipContent>
      <div class="popover-content-defined">
        <component
          :is="props.contentText.tooltipTitle?.tag"
          v-if="props.contentText.tooltipTitle"
          class="tooltip-title subtitle-sm"
        >
          {{ props.contentText.tooltipTitle.text }}
        </component>
        <component
          :is="props.contentText.tooltipContent?.tag"
          v-if="props.contentText.tooltipContent"
          class="tooltip-body body-sm"
        >
          {{ props.contentText.tooltipContent.text }}
        </component>
        <component
          :is="props.contentText.tooltipAction?.tag"
          v-if="props.contentText.tooltipAction"
          class="tooltip-action input-value"
        >
          {{ props.contentText.tooltipAction.text }}
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

<script lang="ts">
export interface TooltipContentText {
  tooltipTitle?: {
    tag: string
    text: string
  }
  tooltipContent?: {
    tag: string
    text: string
  }
  tooltipAction?: {
    tag: string
    text: string
  }
}
</script>

<script setup lang="ts">
const props = defineProps({
  tooltipId: {
    type: String,
    default: "",
  },
  contentText: {
    type: Object as PropType<TooltipContentText>,
    default: () => ({}),
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const slots = useSlots()
const tooltipId = computed(() => {
  return props.tooltipId.length ? `nuxt-tooltip-${props.tooltipId}` : `nuxt-tooltip-${useId()}`
})
</script>

<style lang="css">
.display-tooltip-core {
  .popover {
    .popover-content {
      .popover-content-defined {
        .tooltip-title {
          color: var(--nuxt-text-white-header);
        }

        .tooltip-body {
          color: var(--nuxt-text-white-body);
        }

        .tooltip-action {
          color: var(--nuxt-text-white-body);
        }
      }
    }
  }
}
</style>
