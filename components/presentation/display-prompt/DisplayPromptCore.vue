<template>
  <div class="display-prompt-wrapper" :data-prompt-theme="theme" :class="[elementClasses, { dismissed: hide }]" data-test-id="display-prompt">
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
        <Icon name="bitcoin-icons:cross-filled" class="icon" />
        <span class="sr-only">Really Close</span>
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
  overflow: hidden;
  transition: height 200ms, opacity 200ms, display 200ms;
  transition-behavior: allow-discrete;

  background-color: var(--display-prompt-wrapper-background-color);
  border: 1px solid var(--display-prompt-wrapper-color);
  border-inline-start: 8px solid var(--display-prompt-wrapper-color);
  border-radius: 4px;
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;

  &.dismissed {
    opacity: 0;
    height: 0;
    display: none;
  }

  .display-prompt-inner {
    background-color: var(--display-prompt-inner-background-color);
    align-items: center;
    display: flex;
    gap: var(--display-prompt-inner-gap);
    justify-content: space-between;
    padding-block: 1rem;
    padding-inline: 1.5rem;

    .display-prompt-icon {
      display: inline-flex;
      .icon {
        color: var(--display-prompt-icon-color);
        display: inline-block;
        font-size: 3rem;
        font-style: normal;
        font-weight: normal;
        overflow: hidden;
      }
    }

    .display-prompt-content {
      display: block flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 1rem;
      margin: 0;
      padding: 0.2rem;

      .title {
        font-size: var(--step-2);
        font-weight: bold;
        line-height: 1.3;
        color: var(--display-prompt-content-title-color);
        margin: 0;
        padding: 0;
      }

      .text {
        font-size: var(--step-2);
        font-weight: normal;
        line-height: 1.3;
        color: var(--display-prompt-content-text-color);
        margin: 0;
        padding: 0;
      }
    }
    .display-prompt-action {
      /* all: unset; */
      background-color: transparent;
      display: block flex;
      align-items: center;
      justify-content: center;
      margin: 1rem;
      padding: 0.5rem;
      border: 0.1rem solid var(--display-prompt-button-border-color);
      border-radius: 50%;
      outline: 1px solid var(--display-prompt-button-outline-color);

      &:hover {
        cursor: pointer;
      }

      .icon {
        color: var(--display-prompt-button-icon-color);
        display: block;
        font-size: var(--step-2);
        border: 1px solid green;
        padding: 1rem;
      }
    }
  }
}
</style>
