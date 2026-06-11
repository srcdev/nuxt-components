<template>
  <div
    ref="promptElementRef"
    class="display-prompt-core"
    :class="[{ closed: !componentOpen }]"
    :data-test-id="`display-prompt-core-${theme}`"
    tabindex="0"
  >
    <div class="display-prompt-wrapper" :data-theme="theme" :class="[elementClasses]" data-test-id="display-prompt">
      <div class="display-prompt-inner">
        <div class="display-prompt-icon" data-test-id="prompt-icon" aria-hidden="true">
          <slot name="customDecoratorIcon">
            <Icon :name="themeIcons[theme]" class="icon" />
          </slot>
        </div>
        <div class="display-prompt-content" :aria-live="useAutoFocus ? 'polite' : undefined">
          <p class="title" data-test-id="display-prompt-title">
            <slot name="title"></slot>
          </p>
          <p v-if="slots.content" class="text" data-test-id="display-prompt-content">
            <slot name="content"></slot>
          </p>
        </div>
        <button
          v-if="dismissible"
          data-test-id="display-prompt-action"
          class="display-prompt-action"
          @click.prevent="updateComponentState()"
        >
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
import type { DisplayPromptTheme } from "~/types/components";

interface Props {
  theme?: DisplayPromptTheme;
  dismissible?: boolean;
  useAutoFocus?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  theme: "info",
  dismissible: false,
  useAutoFocus: false,
  styleClassPassthrough: () => [],
});

const themeIcons: Record<DisplayPromptTheme, string> = {
  info: "akar-icons:info",
  success: "akar-icons:check",
  warning: "akar-icons:circle-alert",
  error: "akar-icons:circle-alert",
};

const slots = useSlots();
const promptElementRef = useTemplateRef<HTMLElement>("promptElementRef");
const parentComponentState = defineModel<boolean>({ default: false });
const componentOpen = ref(true);
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const updateComponentState = () => {
  if (parentComponentState.value) {
    parentComponentState.value = false;
    return;
  }

  componentOpen.value = false;
};

onMounted(async () => {
  if (props.useAutoFocus && promptElementRef.value) {
    promptElementRef.value.focus();
  }
});
</script>

<style lang="css">
@layer components {
  .display-prompt-core {
    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: all 200ms ease-in-out;

    &.closed {
      grid-template-rows: 0fr;
      opacity: 0;
      pointer-events: none;
    }

    .display-prompt-wrapper {
      background-color: var(--theme-surface);
      border: 0px solid transparent;
      border-radius: 4px;
      border-start-start-radius: 8px;
      border-end-start-radius: 8px;
      padding-inline-start: 8px;

      overflow: hidden;

      &.outlined {
        border: 1px solid var(--theme-border);
      }

      .display-prompt-inner {
        align-items: center;
        display: flex;
        gap: 12px;
        justify-content: space-between;
        padding-block: 1rem;
        padding-inline: 1.5rem;

        border-start-start-radius: 8px;
        border-end-start-radius: 8px;
        background-color: light-dark(var(--colour-theme-0), var(--colour-theme-10));

        .display-prompt-icon {
          display: inline-flex;
          .icon {
            color: var(--theme-surface);
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
            font-size: var(--step-5);
            font-weight: bold;
            line-height: 1.3;
            color: var(--theme-text);
            margin: 0;
            padding: 0;
          }

          .text {
            font-size: var(--step-4);
            font-weight: normal;
            line-height: 1.3;
            color: var(--theme-text);
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
          border: 0.1rem solid var(--theme-border);
          border-radius: 50%;
          outline: 1px solid var(--theme-ring);

          transition:
            border 200ms ease-in-out,
            outline 200ms ease-in-out;

          &:hover {
            cursor: pointer;
            border: 0.1rem solid var(--theme-surface);
            outline: 2px solid var(--theme-border-focus);
          }

          &:focus-visible {
            box-shadow: var(--focus-box-shadow-colour-on);
            border: 0.1rem solid var(--theme-surface);
            outline: 2px solid var(--theme-border-focus);
          }

          .icon {
            color: var(--theme-text);
            display: block;
            font-size: var(--step-5);
            padding: 1rem;
          }
        }
      }
    }
  }
}
</style>
