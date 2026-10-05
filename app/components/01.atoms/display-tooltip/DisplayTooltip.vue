<template>
  <div
    ref="rootRef"
    class="display-tooltip-core"
    :class="[elementClasses]"
    :style="{ '--_anchor-name': tooltipAnchorName }"
  >
    <div class="display-tooltip-trigger-wrapper body-md">
      <slot v-if="$slots.triggerContent" name="triggerContent"></slot>
      <button
        ref="triggerRef"
        :popovertarget="tooltipId"
        popovertargetaction="toggle"
        class="display-tooltip-trigger-button"
        :class="{ hide: hideTrigger }"
        :aria-label="triggerAriaLabel"
        :aria-expanded="isOpen"
        @click="handleTriggerClick"
      >
        <Icon name="fa7-solid:circle-question" class="display-tooltip-trigger-icon" aria-hidden="true" />
      </button>
    </div>
    <div
      :id="tooltipId"
      ref="popoverRef"
      popover
      class="display-tooltip-popover"
      :class="{ 'display-tooltip-popover-open': usesFallbackPopover && isOpen }"
      :style="positionStyle"
      :data-placement="popoverPlacement"
      @beforetoggle="handleBeforeToggle"
      @toggle="handleToggle"
    >
      <div class="display-tooltip-popover-content">
        <slot name="tooltipContent" :close="hide"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tooltipId?: string;
  hideTrigger?: boolean;
  /** aria-label on the trigger button — override for localisation. */
  triggerAriaLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tooltipId: "",
  hideTrigger: false,
  triggerAriaLabel: "Toggle the popover",
  styleClassPassthrough: () => [],
});

const tooltipId = computed(() => (props.tooltipId.length ? props.tooltipId : `nuxt-tooltip-${useId()}`));
const tooltipAnchorName = `--tooltip-anchor-${useId()}`;

const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);

const {
  isOpen,
  usesFallbackPopover,
  positionStyle,
  popoverPlacement,
  hide,
  handleTriggerClick,
  handleBeforeToggle,
  handleToggle,
} = useAnchoredPopover({ rootRef, triggerRef, popoverRef, side: "right" });

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
          padding: 0;
          border-width: 0;
          overflow: hidden;
          opacity: 0;
        }

        .display-tooltip-trigger-icon {
          width: var(--_trigger-icon-size);
          height: var(--_trigger-icon-size);
          color: var(--display-tooltip-trigger-icon-colour, var(--theme-text));
        }
      }
    }

    .display-tooltip-trigger-button {
      --_trigger-icon-size: var(--display-tooltip-trigger-icon-box-size, 1.6rem);
      --_trigger-padding: var(--display-tooltip-trigger-padding, 0rem);
      --_trigger-border-width: var(--display-tooltip-trigger-border-width, 0.1rem);

      all: unset;
      aspect-ratio: 1 / 1;
      padding: var(--_trigger-padding);
      display: grid;
      place-items: center;

      border: var(--_trigger-border-width) solid
        var(--display-tooltip-trigger-border-colour, transparent);
      border-radius: var(--display-tooltip-trigger-border-radius, 100vw);
      outline: var(--display-tooltip-trigger-outline-width, 0.1rem) solid transparent;
      anchor-name: var(--_anchor-name);
      /* Centres the button on the first line of trigger text */
      translate: 0 calc((1lh - var(--_trigger-icon-size) - 2 * (var(--_trigger-padding) + var(--_trigger-border-width))) / 2);

      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }

      &:hover,
      &:focus-visible {
        outline-color: var(--display-tooltip-trigger-outline-colour-hover, var(--theme-ring));
        outline-offset: 0.1rem;
      }
    }

    .display-tooltip-popover {
      display: none;
      position: absolute;
      border: none;
      width: var(--display-tooltip-popover-width, 30rem);

      outline: var(--display-tooltip-popover-outline-width, 0.1rem) solid
        var(--display-tooltip-popover-outline-colour, var(--slate-02));
      color: var(--display-tooltip-popover-text-colour, var(--slate-09));
      background-color: var(--display-tooltip-popover-background-colour, var(--slate-00));
      border-radius: var(--display-tooltip-popover-border-radius, 0.8rem);
      box-shadow: var(--display-tooltip-popover-shadow, 0 0.4rem 1.6rem rgba(0, 0, 0, 0.12));

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
        font-size: var(--display-tooltip-popover-font-size, 1.4rem);
        line-height: var(--display-tooltip-popover-line-height, 1.4);

        /* Gap is the only spacing between slotted elements; :where keeps consumer margins winning. */
        > :where(*) {
          margin-block: 0;
        }

        .display-tooltip-close-button {
          all: unset;
          cursor: pointer;
          color: var(--display-tooltip-close-button-colour, var(--slate-09));
          border: var(--display-tooltip-close-button-border-width, 0.1rem) solid
            var(--display-tooltip-close-button-border-colour, var(--slate-03));
          outline: var(--display-tooltip-close-button-outline-width, 0.1rem) solid transparent;

          font-weight: 600;
          padding: var(--display-tooltip-close-button-padding, 0.4rem 1rem);

          &:hover,
          &:focus {
            text-decoration: underline;
            border-color: var(--display-tooltip-close-button-border-colour-hover, var(--slate-06));
            outline-color: var(--display-tooltip-close-button-outline-colour-hover, var(--slate-06));
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

      /* Kept apart from :popover-open, which would invalidate a shared selector list where unsupported. */
      &.display-tooltip-popover-open {
        display: flex;
        opacity: 1;
        flex-direction: column;
      }

      @supports not (anchor-name: --a) {
        position: fixed;
        top: var(--_anchor-top, 0px);
        left: calc(var(--_anchor-right, 0px) + var(--display-tooltip-popover-offset, 0.1rem));
        z-index: var(--display-tooltip-popover-z-index, 999999);

        &[data-placement="left"] {
          left: auto;
          right: calc(var(--_anchor-left-inverse, 0px) + var(--display-tooltip-popover-offset, 0.1rem));
        }
      }
    }
  }
}
</style>
