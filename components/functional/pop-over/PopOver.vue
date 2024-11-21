<template>
  <div>
    <button :popovertarget class="popover-trigger">
      <slot name="trigger"></slot>
    </button>

    <dialog popover :id="popovertarget">
      <slot name="popoverCotent"></slot>
    </dialog>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  popovertarget: {
    type: String,
    required: true,
  },
});

const anchorName = `--anchor-${useId()}`;
</script>

<style lang="css">
@layer popover-setup {
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

    position-try-fallbacks: --left;

    &:popover-open {
      display: block;
      opacity: 1;

      @starting-style {
        display: block;
        opacity: 0;
      }
    }
  }

  @position-try --left {
    inset: auto;
    top: anchor(bottom);
    right: anchor(right);
  }
}
</style>
