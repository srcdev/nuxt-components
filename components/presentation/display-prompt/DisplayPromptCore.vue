<template>
  <div class="display-prompt-wrapper" :class="[theme, elementClasses, { dismissed: hide }]" data-test-id="display-prompt">
    <div class="display-prompt-inner">
      <div class="display-prompt-icon" data-test-id="prompt-icon">
        <slot name="icon"></slot>
      </div>
      <div class="display-prompt-content">
        <p class="title" data-test-id="display-prompt-title">
          <slot name="title"></slot>
        </p>
        <p v-if="hasContent" class="text" data-test-id="display-prompt-content">
          <slot name="content"></slot>
        </p>
      </div>
      <button v-if="dismissible" @click.prevent="dismissPrompt()" data-test-id="display-prompt-action" class="display-prompt-action">
        <span class="sr-only">Close</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dismissible: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: 'error',
    validator(value: string) {
      return ['error', 'info', 'success', 'warning', 'secondary'].includes(value);
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  iconColor: {
    type: String as PropType<string>,
    default: 'dark-grey',
    validator(value: string) {
      return ['dark-grey', 'white'].includes(value);
    },
  },
});

const slots = useSlots();
const hasContent = ref(slots.content !== undefined);
const hide = ref(false);
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const dismissPrompt = () => {
  // styleClassPassthrough.value = '';
  hide.value = true;
};
</script>

<style lang="css">
.display-prompt-wrapper {
  background-color: var(--display-prompt-core-wrapper-background-color);
  border-radius: var(--display-prompt-core-wrapper-border-radius);
  border: var(--display-prompt-core-wrapper-border);
  outline: var(--display-prompt-core-wrapper-outline);
  overflow: hidden;
  transition: height 200ms, opacity 200ms, display 200ms;
  transition-behavior: allow-discrete;

  &.dismissed {
    opacity: 0;
    height: 0;
    display: none;
  }

  .display-prompt-inner {
    background-color: var(--display-prompt-core-inner-background-color);
    align-items: center;
    border-radius: var(--display-prompt-core-inner-border-radius);
    display: flex;
    gap: var(--display-prompt-core-inner-gap);
    justify-content: space-between;
    padding: var(--display-prompt-core-inner-padding);
    margin: var(--display-prompt-core-inner-margin);

    .display-prompt-icon {
      display: inline-flex;
      .icon {
        color: var(--display-prompt-core-icon-color);
        display: inline-block;
        font-size: var(--display-prompt-core-icon-size);
        font-style: normal;
        font-weight: var(--display-prompt-core-icon-weight);
        overflow: hidden;
      }
    }

    .display-prompt-content {
      display: block flex;
      flex-direction: column;
      flex-grow: 1;
      gap: var(--display-prompt-core-inner-content-gap);
      margin: var(--display-prompt-content-margin);
      padding: var(--display-prompt-content-padding);

      .title {
        font-size: var(--display-prompt-content-title-font-size);
        font-weight: var(--display-prompt-content-title-font-weight);
        line-height: var(--display-prompt-content-title-line-height);
        color: var(--display-prompt-content-title-color);
        margin: var(--display-prompt-content-title-margin);
        padding: var(--display-prompt-content-title-padding);
      }

      .text {
        font-size: var(--display-prompt-content-text-font-size);
        font-weight: var(--display-prompt-content-text-font-weight);
        line-height: var(--display-prompt-content-text-line-height);
        color: var(--display-prompt-content-text-color);
        margin: var(--display-prompt-content-text-margin);
        padding: var(--display-prompt-content-text-padding);
      }
    }
    .display-prompt-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
    }
  }
}
</style>
