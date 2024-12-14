<template>
  <ClientOnly>
    <button @click.prevent="showPopover()" :popovertarget class="popover-trigger" :class="[elementClasses]">
      <slot name="trigger"></slot>
    </button>

    <dialog :open class="dialog-popover" popover :id="popovertarget" :class="[elementClasses]">
      <focus-trap v-model:active="open" :clickOutsideDeactivates="true" @deactivate="closePopover()">
        <div>
          <button @click.prevent="closePopover()">x</button>
          <slot name="popoverCotent"></slot>
        </div>
      </focus-trap>
    </dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import { FocusTrap } from 'focus-trap-vue';

const { popovertarget, styleClassPassthrough } = defineProps({
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

const { elementClasses } = useStyleClassPassthrough(styleClassPassthrough);

const open = ref<boolean>(false);

const showPopover = () => {
  console.log('showPopover()');
  open.value = true;
};

const closePopover = () => {
  console.log('closePopover()');
  open.value = false;
};
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

/* @layer popover-setup { */
.popover-trigger {
  anchor-name: v-bind(anchorName);
}

.dialog-popover {
  /* backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  border: 0;
  padding: 0; */

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
/* } */
</style>
