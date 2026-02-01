<template>
  <div
    class="input-error-message"
    data-theme="error"
    :id
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
import propValidators from "../c12/prop-validators"

const props = defineProps({
  dataTestid: {
    type: String,
    default: "inputError",
  },
  errorMessage: {
    type: [Array, Object, String],
    required: true,
  },
  showError: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  compact: {
    type: Boolean,
    value: false,
  },
  isDetached: {
    type: Boolean,
    required: true,
  },
  inputVariant: {
    type: String as PropType<string>,
    default: "normal",
    validator(value: string) {
      return propValidators.inputVariant.includes(value)
    },
  },
})

const isArray = computed(() => {
  return Array.isArray(props.errorMessage)
})

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.input-error-message {
  grid-row: 2;
  grid-column: 1;
  display: grid;
  grid-template-rows: 0fr;

  color: var(--input-error-color);
  background-color: var(--theme-error-surface);

  transition: grid-template-rows var(--theme-form-transition-duration) linear;
  transition-behavior: allow-discrete;

  outline: var(--form-element-outline-width) solid transparent;

  border-radius: 0;

  border: var(--form-element-border-width) solid transparent;
  border-radius: 0;

  background-clip: padding-box;

  translate: 0 calc(-1 * var(--form-element-border-width));

  margin-block-start: var(--input-error-margin-block-start);

  &.detached {
    margin-block-start: 2rem;
  }

  &.show {
    grid-template-rows: 1fr;
    display: grid;

    border: var(--form-element-border-width) solid var(--theme-error-surface);
    border-bottom-left-radius: var(--form-input-border-radius-underlined);
    border-bottom-right-radius: var(--form-input-border-radius-underlined);
    outline: var(--form-element-outline-width) solid var(--theme-error-surface);

    &.detached {
      margin-block-start: 2rem;

      border-top: var(--form-element-border-width) solid var(--theme-error-surface);
      border-right: var(--form-element-border-width) solid var(--theme-error-surface);
      border-bottom: var(--form-element-border-width) solid var(--red-8);
      border-left: var(--form-element-border-width) solid var(--theme-error-surface);

      border-radius: var(--form-input-border-radius);
    }
  }

  .inner {
    align-items: center;

    overflow: hidden;
    transition: opacity var(--theme-form-transition-duration) linear,
      display var(--theme-form-transition-duration) linear allow-discrete;

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
        padding-block: 1.2rem 1rem;
        padding-inline: 1.2rem;

        .message-single {
          color: white;
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
}
</style>
