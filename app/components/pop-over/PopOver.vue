<template>
  <ClientOnly>
    <button :popovertarget popovertargetaction="toggle" class="popover-trigger" :class="[elementClasses]">
      <slot name="trigger"></slot>
    </button>

    <div class="dialog" popover role="tooltip" :id="popovertarget" :class="[elementClasses]">
      <button :popovertarget popovertargetaction="hide">x</button>
      <slot name="popoverCotent"></slot>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps({
  popovertarget: {
    type: String,
    required: true,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const anchorName = `--anchor-${useId()}`

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style scoped lang="css">
@layer popover-setup {
  /* @position-try --right {
    inset: auto;
    top: anchor(top);
    left: calc(anchor(right) + 10px);
  }

  @position-try --left {
    inset: auto;
    top: anchor(top);
    right: calc(anchor(left) + 10px);
  } */

  .popover-trigger {
    anchor-name: v-bind(anchorName);
  }

  .dialog {
    display: none;
    position: absolute;
    position-anchor: v-bind(anchorName);
    margin: 0;
    inset: auto;
    top: calc(anchor(top) + 0px);
    left: calc(anchor(right) + 10px);
    opacity: 0;
    transition: opacity 200ms, display 200ms, overlay 200ms;
    transition-behavior: allow-discrete;

    position-try-fallbacks: flip-inline;

    &:popover-open {
      display: block;
      opacity: 1;

      @starting-style {
        display: block;
        opacity: 0;
      }
    }
  }

  @position-try --top-left {
    top: anchor(top);
    right: calc(anchor(left + 10px));
    left: unset;
    /* width: revert; */
  }

  @position-try --bottom-right {
    top: anchor(bottom);
    /* right: calc(anchor(left + 10px)); */
    /* left: unset; */
    /* width: revert; */
  }
}
</style>
