<template>
  <ClientOnly>
    <button :popovertarget class="popover-trigger" :class="[elementClasses]">
      <slot name="trigger"></slot>
    </button>

    <dialog class="dialog-popover" popover :id="popovertarget" :class="[elementClasses]">
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

<style lang="css">
@position-try --left {
  inset: auto;
  top: anchor(bottom);
  right: anchor(right);
}

@position-try --top {
  inset: auto;
  bottom: anchor(top);
  right: anchor(right);
}

@layer popover-setup {
  .popover-trigger {
    anchor-name: v-bind(anchorName);
  }

  .dialog-popover {
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

    position-try-fallbacks: --left;
    position-try-fallbacks: --top;

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
}
</style>
