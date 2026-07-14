<template>
  <div class="input-copy" :class="elementClasses">
    <div class="input-copy__wrapper">
      <input
        type="text"
        class="input-copy__input"
        :value="value"
        :aria-label="ariaLabel || label"
        readonly
      />
      <button
        type="button"
        class="input-copy__button"
        :aria-label="`Copy ${ariaLabel || label || 'value'} to clipboard`"
        :disabled="copied || isDisabled"
        @click="handleCopy"
      >
        <Icon name="lucide:copy" class="input-copy__icon" />
        <span class="input-copy__button-text">{{ copied ? copiedText : buttonText }}</span>
      </button>
    </div>
    <p v-if="description" class="input-copy__description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string;
  label?: string;
  ariaLabel?: string;
  description?: string;
  buttonText?: string;
  copiedText?: string;
  copiedDuration?: number;
  isDisabled?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  ariaLabel: undefined,
  description: undefined,
  buttonText: "Copy",
  copiedText: "Copied!",
  copiedDuration: 2000,
  isDisabled: false,
  styleClassPassthrough: () => [],
});

const emit = defineEmits<{
  copy: [value: string];
  copied: [value: string];
}>();

const copied = ref(false);
let copyTimeoutId: ReturnType<typeof setTimeout> | null = null;

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    emit("copy", props.value);
    emit("copied", props.value);

    if (copyTimeoutId) {
      clearTimeout(copyTimeoutId);
    }

    copyTimeoutId = setTimeout(() => {
      copied.value = false;
      copyTimeoutId = null;
    }, props.copiedDuration);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  },
);

onUnmounted(() => {
  if (copyTimeoutId) {
    clearTimeout(copyTimeoutId);
  }
});
</script>

<style lang="css">
@layer components {
  .input-copy {
    --_input-bg: var(--input-copy-input-bg, var(--slate-00));
    --_input-border: var(--input-copy-input-border, 1px solid var(--slate-03));
    --_input-border-radius: var(--input-copy-input-border-radius, 0.4rem);
    --_input-padding: var(--input-copy-input-padding, 0.8rem 1rem);
    --_input-text-color: var(--input-copy-input-text-color, #333);
    --_input-placeholder-color: var(--input-copy-input-placeholder-color, #999);
    --_input-font-size: var(--input-copy-input-font-size, 0.95rem);

    --_button-bg: var(--input-copy-button-bg, var(--theme-button-primary-surface));
    --_button-bg-hover: var(--input-copy-button-bg-hover, var(--theme-button-primary-surface-hover));
    --_button-text-color: var(--input-copy-button-text-color, var(--theme-button-primary-text));
    --_button-padding: var(--input-copy-button-padding, 0.8rem 1.2rem);
    --_button-border-radius: var(--input-copy-button-border-radius, 0.4rem);
    --_button-gap: var(--input-copy-button-gap, 0.6rem);

    --_description-color: var(--input-copy-description-color, #666);
    --_description-font-size: var(--input-copy-description-font-size, 0.85rem);
    --_description-margin: var(--input-copy-description-margin, 0.6rem 0 0 0);

    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .input-copy__wrapper {
    display: flex;
    gap: 0.8rem;
    align-items: stretch;
  }

  .input-copy__input {
    flex: 1;
    min-width: 0;

    padding: var(--_input-padding);
    background-color: var(--_input-bg);
    border: var(--_input-border);
    border-radius: var(--_input-border-radius);
    font-size: var(--_input-font-size);
    color: var(--_input-text-color);
    font-family: inherit;

    &::placeholder {
      color: var(--_input-placeholder-color);
    }

    &:focus {
      outline: 2px solid var(--_input-border-radius);
      outline-offset: 2px;
    }
  }

  .input-copy__button {
    display: flex;
    align-items: center;
    gap: var(--_button-gap);
    padding: var(--_button-padding);

    background-color: var(--_button-bg);
    color: var(--_button-text-color);
    border: none;
    border-radius: var(--_button-border-radius);
    font-size: var(--_input-font-size);
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
      background-color: var(--_button-bg-hover);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .input-copy__icon {
      width: 1.2em;
      height: 1.2em;
      flex-shrink: 0;
    }

    .input-copy__button-text {
      display: none;

      @media (min-width: 480px) {
        display: inline;
      }
    }
  }

  .input-copy__description {
    margin: var(--_description-margin);
    font-size: var(--_description-font-size);
    color: var(--_description-color);
  }
}
</style>
