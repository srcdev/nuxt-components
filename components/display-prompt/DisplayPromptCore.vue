<template>
  <div class="display-prompt-core" :class="[{ dismissed: hide }, { 'use-local-style-overrides': useLocalStyleOverrides }]" :data-test-id="`display-prompt-core-${theme}`">
    <div class="display-prompt-wrapper" :data-prompt-theme="theme" :class="[elementClasses]" data-test-id="display-prompt">
      <div class="display-prompt-inner">
        <div class="display-prompt-icon" data-test-id="prompt-icon">
          <slot name="customDecoratorIcon">
            <Icon :name="displayPromptIcons[theme]" class="icon" :color="iconColor" />
          </slot>
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
          <slot name="customCloseIcon">
            <Icon name="bitcoin-icons:cross-filled" class="icon" />
          </slot>
          <span class="sr-only">
            <slot name="customTitle">Close this prompt</slot>
          </span>
        </button>
      </div>
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
  useLocalStyleOverrides: {
    type: Boolean,
    default: false,
  },
  displayPromptIcons: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({
      error: 'akar-icons:circle-alert',
      info: 'akar-icons:info',
      success: 'akar-icons:check',
      warning: 'akar-icons:circle-alert',
      secondary: 'akar-icons:info',
    }),
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
.display-prompt-core {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition: all 200ms ease-in-out;

  &.dismissed {
    grid-template-rows: 0fr;
    opacity: 0;
    pointer-events: none;
  }

  .display-prompt-wrapper {
    background-color: var(--component-theme-0);
    border: 1px solid var(--component-theme-8);
    border-radius: 4px;

    border-inline-start: 8px solid var(--component-theme-8);
    border-start-start-radius: 8px;
    border-end-start-radius: 8px;

    overflow: hidden;

    .display-prompt-inner {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      padding-block: 1rem;
      padding-inline: 1.5rem;

      .display-prompt-icon {
        display: inline-flex;
        .icon {
          color: var(--component-theme-8);
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
          color: var(--component-theme-8);
          margin: 0;
          padding: 0;
        }

        .text {
          font-size: var(--step-2);
          font-weight: normal;
          line-height: 1.3;
          color: var(--component-theme-8);
          margin: 0;
          padding: 0;
        }
      }
      .display-prompt-action {
        background-color: transparent;
        display: block flex;
        align-items: center;
        justify-content: center;
        margin: 1rem;
        padding: 0.5rem;
        border: 0.1rem solid var(--component-theme-8);
        border-radius: 50%;
        outline: 1px solid var(--component-theme-3);

        transition: border 200ms ease-in-out, outline 200ms ease-in-out;

        &:hover {
          cursor: pointer;
          border: 0.1rem solid var(--component-theme-12);
          outline: 2px solid var(--component-theme-6);
        }

        &:focus-visible {
          box-shadow: var(--focus-box-shadow-colour-on);
          border: 0.1rem solid var(--component-theme-12);
          outline: 2px solid var(--component-theme-6);
        }

        .icon {
          color: var(--component-theme-8);
          display: block;
          font-size: var(--step-2);
          padding: 1rem;
        }
      }
    }
  }
}
</style>
