<template>
  <ClientOnly>
    <div class="pop-over" :class="[elementClasses]" :style="{ '--_anchor-name': anchorName }" :data-placement="placement">
      <button
        ref="triggerRef"
        :popovertarget="popoverId"
        popovertargetaction="toggle"
        type="button"
        class="pop-over-trigger"
        :aria-label="triggerAriaLabel || undefined"
      >
        <slot name="trigger"></slot>
      </button>

      <div :id="popoverId" ref="popoverRef" popover class="pop-over-popover" :aria-label="popoverAriaLabel || undefined" @toggle="handleToggle">
        <button
          ref="closeButtonRef"
          :popovertarget="popoverId"
          popovertargetaction="hide"
          type="button"
          class="pop-over-close-button"
          :aria-label="closeButtonAriaLabel"
        >
          <Icon name="lucide:x" class="pop-over-close-button-icon" aria-hidden="true" />
        </button>
        <div class="pop-over-content">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  placement?: "top" | "right" | "bottom" | "left";
  /** aria-label on the trigger button — set this when the trigger slot is icon-only. */
  triggerAriaLabel?: string;
  /** aria-label on the popover content region — set this when the content slot has no visible heading. */
  popoverAriaLabel?: string;
  /** aria-label on the close button — override for localisation. */
  closeButtonAriaLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  placement: "right",
  triggerAriaLabel: "",
  popoverAriaLabel: "",
  closeButtonAriaLabel: "Close",
  styleClassPassthrough: () => [],
});

const id = useId();
const popoverId = `pop-over-${id}`;
const anchorName = `--pop-over-anchor-${id}`;

const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);

/** Move focus into the popover on open; the Popover API restores focus to the trigger on close. */
const handleToggle = (event: Event) => {
  const toggleEvent = event as ToggleEvent;
  if (toggleEvent.newState === "open") {
    closeButtonRef.value?.focus();
  }
};

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
  .pop-over {
    display: inline-block;
    position: relative;

    .pop-over-trigger {
      all: unset;
      cursor: pointer;
      anchor-name: var(--_anchor-name);
      outline: var(--pop-over-trigger-outline-width, 0.1rem) solid transparent;

      &:focus-visible {
        outline-color: var(--pop-over-trigger-outline-colour-hover, var(--theme-ring));
        outline-offset: 0.2rem;
      }
    }

    .pop-over-popover {
      display: none;
      position: absolute;
      position-anchor: var(--_anchor-name);
      margin: 0;
      inset: auto;
      border: var(--pop-over-border-width, 0.1rem) solid
        var(--pop-over-border-colour, var(--slate-02));
      border-radius: var(--pop-over-border-radius, 0.8rem);
      background-color: var(--pop-over-background-colour, var(--slate-00));
      color: var(--pop-over-text-colour, var(--slate-09));
      box-shadow: var(
        --pop-over-shadow,
        0 0.4rem 1.6rem rgba(0, 0, 0, 0.12)
      );
      width: var(--pop-over-width, 30rem);

      opacity: 0;
      transition:
        opacity var(--pop-over-transition-duration, 200ms),
        display var(--pop-over-transition-duration, 200ms),
        overlay var(--pop-over-transition-duration, 200ms);
      transition-behavior: allow-discrete;

      &:popover-open {
        display: block;
        opacity: 1;

        @starting-style {
          opacity: 0;
        }
      }

      .pop-over-close-button {
        all: unset;
        cursor: pointer;
        position: absolute;
        top: var(--pop-over-close-button-offset, 0.8rem);
        right: var(--pop-over-close-button-offset, 0.8rem);
        display: grid;
        place-items: center;
        width: var(--pop-over-close-button-size, 2.4rem);
        height: var(--pop-over-close-button-size, 2.4rem);
        border-radius: var(--pop-over-close-button-border-radius, 50%);
        color: var(--pop-over-close-button-colour, var(--slate-06));
        outline: var(--pop-over-close-button-outline-width, 0.1rem) solid transparent;

        &:hover,
        &:focus-visible {
          background-color: var(--pop-over-close-button-surface-hover, var(--slate-01));
          outline-color: var(--pop-over-close-button-outline-colour-hover, var(--theme-ring));
          outline-offset: 0.1rem;
        }

        .pop-over-close-button-icon {
          width: var(--pop-over-close-button-icon-size, 1.4rem);
          height: var(--pop-over-close-button-icon-size, 1.4rem);
        }
      }

      .pop-over-content {
        padding: var(--pop-over-content-padding, 1.6rem);
        padding-top: var(--pop-over-content-padding-block-start, 3.2rem);

        /* Trim the slotted content's own default UA margins so this padding is the only
           space above/below it — interior spacing between multiple children is untouched. */
        > :first-child {
          margin-block-start: 0;
        }

        > :last-child {
          margin-block-end: 0;
        }
      }
    }

    &[data-placement="right"] .pop-over-popover {
      top: anchor(top);
      left: calc(anchor(right) + var(--pop-over-gap, 1rem));
      position-try-fallbacks: flip-inline;
    }

    &[data-placement="left"] .pop-over-popover {
      top: anchor(top);
      right: calc(anchor(left) + var(--pop-over-gap, 1rem));
      left: auto;
      position-try-fallbacks: flip-inline;
    }

    &[data-placement="bottom"] .pop-over-popover {
      top: calc(anchor(bottom) + var(--pop-over-gap, 1rem));
      left: anchor(left);
      position-try-fallbacks: flip-block;
    }

    &[data-placement="top"] .pop-over-popover {
      bottom: calc(anchor(top) + var(--pop-over-gap, 1rem));
      top: auto;
      left: anchor(left);
      position-try-fallbacks: flip-block;
    }
  }
}
</style>
