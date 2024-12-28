<template>
  <ClientOnly>
    <button :popovertarget popovertargetaction="toggle" class="popover-trigger" :class="[elementClasses]">
      <slot name="trigger"></slot>
    </button>

    <dialog popover role="tooltip" :id="popovertarget" :class="[elementClasses]">
      <button :popovertarget popovertargetaction="hide">x</button>
      <slot name="popoverCotent"></slot>
    </dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps({
  popovertarget: {
    type: String,
    required: true,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const anchorName = `--anchor-${useId()}`;

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style scoped lang="css">
@position-try --right {
  inset: auto;
  top: anchor(top);
  left: anchor(right);
}

@position-try --left {
  inset: auto;
  top: anchor(top);
  right: anchor(left);
}

/* @layer popover-setup { */
.popover-trigger {
  anchor-name: v-bind(anchorName);
}

dialog {
  display: none;
  position: absolute;
  position-anchor: v-bind(anchorName);
  margin: 0;
  inset: auto;
  bottom: anchor(bottom);
  left: anchor(right);
  opacity: 0;
  transition: opacity 200ms, display 200ms, overlay 200ms;
  transition-behavior: allow-discrete;

  position-try-fallbacks: --left, --right;
  /* position-try-fallbacks: --right; */

  &:popover-open {
    display: block;
    opacity: 1;

    @starting-style {
      display: block;
      opacity: 0;
    }
  }
}

/* @position-try --left {
    inset: auto;
    top: anchor(bottom);
    right: anchor(right);
  } */
/* } */
</style>
