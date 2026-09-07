<template>
  <div class="display-tooltip-core" :class="[elementClasses]" :style="{ '--_anchor-name': tooltipAnchorName }">
    <div class="display-tooltip-trigger-wrapper body-md">
      <slot v-if="$slots.triggerContent" name="triggerContent"></slot>
      <button
        :popovertarget="tooltipId"
        popovertargetaction="toggle"
        class="display-tooltip-trigger-button"
        :class="{ hide: hideTrigger }"
        aria-label="Toggle the popover"
      >
        <Icon name="fa7-solid:circle-question" class="display-tooltip-trigger-icon" aria-hidden="true" />
      </button>
    </div>
    <div :id="tooltipId" popover class="display-tooltip-popover">
      <div class="display-tooltip-popover-content">
        <slot name="tooltipContent"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tooltipId?: string;
  hideTrigger?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tooltipId: "",
  hideTrigger: false,
  styleClassPassthrough: () => [],
});

const tooltipId = computed(() => (props.tooltipId.length ? props.tooltipId : `nuxt-tooltip-${useId()}`));
const tooltipAnchorName = `--tooltip-anchor-${useId()}`;

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .display-tooltip-core {
    padding-block: var(--display-tooltip-padding-block, 0.8rem);
    position: relative;

    .display-tooltip-trigger-wrapper {
      display: inline-flex;
      align-items: flex-start;

      .display-tooltip-trigger-button {
        margin-left: var(--display-tooltip-trigger-gap, 0.8rem);

        &.hide {
          width: 0;
          overflow: hidden;
          opacity: 0;
        }

        .display-tooltip-trigger-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--display-tooltip-trigger-icon-box-size, 2rem);
          height: var(--display-tooltip-trigger-icon-box-size, 2rem);
          color: var(--display-tooltip-trigger-icon-colour, var(--theme-text));
          font-size: var(--display-tooltip-trigger-icon-font-size, 1.8rem);
          line-height: var(--display-tooltip-trigger-icon-box-size, 2rem);
        }
      }
    }

    .display-tooltip-trigger-button {
      all: unset;
      aspect-ratio: 1 / 1;
      width: 2.4rem;
      display: grid;
      place-items: center;

      outline: var(--display-tooltip-trigger-outline-width, 0.1rem) solid transparent;
      anchor-name: var(--_anchor-name);

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
        outline-color: var(--display-tooltip-trigger-outline-colour-hover, var(--theme-ring));
        outline-offset: 0.2rem;
      }
    }

    .display-tooltip-popover {
      display: none;
      position: absolute;
      border: none;
      width: var(--display-tooltip-popover-width, 30rem);

      outline: var(--display-tooltip-popover-outline-width, 0.1rem) solid
        var(--display-tooltip-popover-outline-colour, light-dark(var(--slate-02), var(--slate-06)));
      color: var(--display-tooltip-popover-text-colour, light-dark(var(--slate-09), var(--slate-01)));
      background-color: var(--display-tooltip-popover-background-colour, light-dark(var(--slate-00), var(--slate-07)));
      border-radius: var(--display-tooltip-popover-border-radius, 0.8rem);
      box-shadow: var(
        --display-tooltip-popover-shadow,
        light-dark(0 0.4rem 1.6rem rgba(0, 0, 0, 0.12), 0 0.4rem 1.6rem rgba(0, 0, 0, 0.5))
      );

      position-anchor: var(--_anchor-name);
      margin: 0;
      inset: auto;
      top: calc(anchor(top) + 0rem);
      left: calc(anchor(right) + var(--display-tooltip-popover-offset, 0.1rem));
      opacity: 0;
      transition:
        opacity 200ms,
        display 200ms,
        overlay 200ms;

      transition-behavior: allow-discrete;
      position-try-fallbacks: flip-inline;

      .display-tooltip-popover-content {
        padding: var(--display-tooltip-popover-padding, 1.2rem);
        display: flex;
        flex-direction: column;
        gap: var(--display-tooltip-popover-content-gap, 1.2rem);

        .display-tooltip-close-button {
          all: unset;
          cursor: pointer;
          color: var(--display-tooltip-close-button-colour, light-dark(var(--slate-09), var(--slate-01)));
          border: var(--display-tooltip-close-button-border-width, 0.1rem) solid
            var(--display-tooltip-close-button-border-colour, light-dark(var(--slate-03), var(--slate-06)));
          outline: var(--display-tooltip-close-button-outline-width, 0.1rem) solid transparent;

          font-weight: 600;
          padding: var(--display-tooltip-close-button-padding, 0.4rem 1rem);

          &:hover,
          &:focus {
            text-decoration: underline;
            border-color: var(
              --display-tooltip-close-button-border-colour-hover,
              light-dark(var(--slate-06), var(--slate-03))
            );
            outline-color: var(
              --display-tooltip-close-button-outline-colour-hover,
              light-dark(var(--slate-06), var(--slate-03))
            );
            outline-offset: 0.2rem;
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
}
</style>
