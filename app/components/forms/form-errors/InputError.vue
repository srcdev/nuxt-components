<template>
  <div
    :id
    class="input-error-message"
    data-theme="error"
    :class="[inputVariant, elementClasses, { show: showError }, { detached: isDetached }]"
    :data-testid
    :aria-hidden="!showError"
  >
    <div class="inner" :class="[{ show: showError }]">
      <div class="inner-content">
        <div class="inner-icon">
          <Icon name="radix-icons:circle-backslash" class="icon" />
        </div>
        <div class="message">
          <ul v-if="isArray" class="message-list">
            <li v-for="(message, index) in errorMessage" :key="index" class="message-list-item">{{ message }}</li>
          </ul>
          <span v-else class="message-single">
            {{ errorMessage }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  errorMessage: string | string[] | object;
  showError: boolean;
  id: string;
  styleClassPassthrough?: string | string[];
  compact?: boolean;
  isDetached: boolean;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "inputError",
  styleClassPassthrough: () => [],
  compact: false,
  inputVariant: "normal",
});

const isArray = computed(() => {
  return Array.isArray(props.errorMessage);
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.input-error-message {
  grid-row: 2;
  grid-column: 1;
  display: grid;
  grid-template-rows: 0fr;

  color: var(--input-error-color);
  background-color: var(--theme-error-surface);
  opacity: 0;

  transition:
    grid-template-rows var(--theme-form-transition-duration) linear,
    opacity var(--theme-form-transition-duration) linear,
    margin-block-start var(--theme-form-transition-duration) linear;

  transition-behavior: allow-discrete;

  border-radius: 0;
  border: var(--form-element-border-width) solid transparent;
  outline: var(--form-element-outline-width) solid transparent;

  background-clip: padding-box;

  translate: 0 calc(-1 * calc(var(--form-element-border-width) + var(--form-input-border-radius)));

  margin-block-start: var(--input-error-margin-block-start);

  &.underlined {
    outline-color: transparent;
  }

  &.detached {
    margin-block-start: 0rem;

    border-top: var(--form-element-border-width) solid var(--theme-error-surface);
    border-right: var(--form-element-border-width) solid var(--theme-error-surface);
    border-bottom: var(--form-element-border-width) solid var(--red-08);
    border-left: var(--form-element-border-width) solid var(--theme-error-surface);

    border-radius: var(--form-input-border-radius);
  }

  &.show {
    grid-template-rows: 1fr;
    display: grid;
    opacity: 1;

    border: var(--form-element-border-width) solid var(--theme-error-border);
    outline: var(--form-element-outline-width) solid var(--theme-error-outline);

    &:not(.underlined) {
      border-bottom-left-radius: var(--form-input-border-radius);
      border-bottom-right-radius: var(--form-input-border-radius);
    }

    &.detached {
      margin-block-start: 2rem;
    }
  }

  .inner {
    align-items: center;
    overflow: hidden;

    .inner-content {
      display: flex;
      align-items: center;

      .inner-icon {
        display: inline-block;
        padding-left: 1.2rem;

        .icon {
          color: white;
          transform: translateY(3px);
        }
      }

      .message {
        display: inline-block;
        flex-grow: 1;
        font-family: var(--font-family);
        font-size: 1.6rem;
        font-weight: 500;
        padding-inline: 1.2rem;

        .message-single {
          color: var(--input-error-color);
        }

        .message-list {
          list-style-type: none;
          padding-inline-start: 0;
          margin-block-start: 0;
          margin-block-end: 0;

          .message-list-item {
            color: white;
          }

          .message-list-item + .message-list-item {
            margin-block-start: 0.6rem;
          }
        }
      }
    }
  }

  /* Modifiers for input variants: */
  &:is(.detached) {
    &.normal {
      .inner {
        .inner-content {
          .message {
            padding-block: 1.2rem 1rem;
          }
        }
      }
    }
  }

  &:not(.detached) {
    &.normal {
      .inner {
        padding-block-start: var(--form-input-border-radius);

        .inner-content {
          .message {
            padding-block: 1.2rem 1rem;
          }
        }
      }
    }
    &.underlined {
      .inner {
        .inner-content {
          .message {
            padding-block: 1rem 1rem;
          }
        }
      }
    }
  }
}
</style>
