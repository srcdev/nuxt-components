<template>
  <div class="display-tooltip-core" :class="[elementClasses]" :style="`--anchor-name: ${tooltipAnchorName}`">
    <div class="display-tooltip-trigger-wrapper body-md">
      <slot v-if="slots.triggerContent" name="triggerContent"></slot>
      <button
        :popovertarget="tooltipId"
        popovertargetaction="toggle"
        class="display-tooltip-trigger-button"
        :class="{ hide: hideTooltipTrigger }"
        aria-label="Toggle the popover"
      >
        <Icon name="fa7-solid:circle-question" class="display-tooltip-trigger-icon" aria-hidden="true" />
      </button>
    </div>
    <div popover class="display-tooltip-popover" :id="tooltipId" ref="popover1">
      <div class="display-tooltip-popover-content">
        <slot name="tooltipContent"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  tooltipId: {
    type: String,
    default: "",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const slots = useSlots()
const tooltipId = computed(() => {
  return props.tooltipId.length ? props.tooltipId : `nuxt-tooltip-${useId()}`
})
const tooltipAnchorName = `tooltip-anchor-${useId()}`
const hideTooltipTrigger = ref(false)

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.display-tooltip-core {
  padding-block: 8px;
  position: relative;

  .display-tooltip-trigger-wrapper {
    display: inline-flex;
    align-items: flex-start;

    .display-tooltip-trigger-button {
      margin-left: 8px;

      &.hide {
        width: 0;
        overflow: hidden;
        opacity: 0;
      }

      .display-tooltip-trigger-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        color: var(--nuxt-text-header);
        font-size: 18px;
        line-height: 20px;
      }
    }
  }

  .display-tooltip-trigger-button {
    all: unset;
    aspect-ratio: 1 / 1;
    width: 24px;
    display: grid;
    place-items: center;

    outline: 1px solid transparent;
    anchor-name: var(--anchor-name);

    @supports (corner-shape: squircle) {
      corner-shape: squircle;
      border-radius: 50%;
    }

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }

    &:hover,
    &:focus-visible {
      outline-offset: 2px;
    }
  }

  .display-tooltip-popover {
    display: none;
    position: absolute;
    border: none;
    width: 300px;

    outline: 1px solid light-dark(black, white);
    color: light-dark(black, white);
    background-color: light-dark(white, black);
    border-radius: 8px;

    position-anchor: var(--anchor-name);
    margin: 0;
    inset: auto;
    top: calc(anchor(top) + 0px);
    left: calc(anchor(right) + 1px);
    opacity: 0;
    transition: opacity 200ms, display 200ms, overlay 200ms;

    transition-behavior: allow-discrete;
    position-try-fallbacks: flip-inline;

    /* .popover-action {
      display: flex;
      justify-content: flex-end;
      padding: 8px;
      border-bottom: 1px solid var(--nuxt-stroke-border-grey);
    } */

    .display-tooltip-popover-content {
      .display-tooltip-close-button {
        all: unset;
        cursor: pointer;
        color: var(--nuxt-text-accessibility-blue);
        border: 1px solid var(--theme-button-border);
        outline: 1px solid var(--theme-button-outline);

        font-weight: 600;
        padding: 8px 12px;

        &:hover,
        &:focus {
          text-decoration: underline;
          border: 1px solid var(--theme-button-border-hover);
          outline: 1px solid var(--theme-button-outline-hover);
          outline-offset: 2px;
        }
      }
    }

    &:popover-open {
      display: flex;
      opacity: 1;

      flex-direction: column;

      @starting-style {
        display: flex;
        opacity: 0;
      }
    }
  }
}
</style>
