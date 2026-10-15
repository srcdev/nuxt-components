<template>
  <div class="input-copy" :class="[{ 'input-copy-copied': copied }, elementClasses]">
    <div class="input-copy__wrapper">
      <input
        :id="resolvedId"
        type="text"
        class="input-copy__input"
        :name="name || resolvedId"
        :value="value"
        :aria-label="ariaLabel || label"
        :aria-describedby="description ? descriptionId : undefined"
        readonly
      />
      <InputButton
        type="button"
        variant="inline"
        class="input-copy__button"
        :button-text="copied ? copiedText : buttonText"
        :aria-label="resolvedButtonAriaLabel"
        :disabled="isDisabled"
        :readonly="copied"
        @click="handleCopy"
      >
        <template #left>
          <Icon :name="copied ? copiedIcon : icon" class="input-copy__icon" />
        </template>
      </InputButton>
    </div>
    <p v-if="description" :id="descriptionId" class="input-copy__description">{{ description }}</p>
    <span class="sr-only" role="status">{{ copied ? copiedText : "" }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string;
  /** Defaults to an auto-generated id — pass one explicitly only if something needs to target this input. */
  id?: string;
  name?: string;
  label?: string;
  ariaLabel?: string;
  description?: string;
  buttonText?: string;
  copiedText?: string;
  buttonAriaLabel?: string;
  icon?: string;
  copiedIcon?: string;
  copiedDuration?: number;
  isDisabled?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  name: undefined,
  label: undefined,
  ariaLabel: undefined,
  description: undefined,
  buttonText: "Copy",
  copiedText: "Copied!",
  buttonAriaLabel: undefined,
  icon: "lucide:copy",
  copiedIcon: "lucide:check",
  copiedDuration: 2000,
  isDisabled: false,
  styleClassPassthrough: () => [],
});

// Readonly text inputs still need an id/name to satisfy "a form field element should have an
// id or name attribute", so one is auto-generated when none is passed.
const autoId = useId();
const resolvedId = computed(() => props.id ?? autoId);
const descriptionId = computed(() => `${resolvedId.value}-description`);

const resolvedButtonAriaLabel = computed(
  () => props.buttonAriaLabel ?? `Copy ${props.ariaLabel || props.label || "value"} to clipboard`
);

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
  }
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
    --_input-font-size: var(--input-copy-input-font-size, var(--step-4));

    container: input-copy / inline-size;
    display: flex;
    flex-direction: column;
    gap: var(--input-copy-gap, 0.8rem);

    .input-copy__wrapper {
      display: flex;
      gap: var(--input-copy-gap, 0.8rem);
      align-items: stretch;
    }

    .input-copy__input {
      flex: 1;
      min-width: 0;
      padding: var(--input-copy-input-padding, 0.8rem 1rem);
      background-color: var(--input-copy-input-bg, var(--theme-input-surface));
      border: var(--input-copy-input-border, 0.1rem solid var(--theme-border));
      border-radius: var(--input-copy-input-border-radius, 0.4rem);
      font-size: var(--_input-font-size);
      color: var(--input-copy-input-text-color, var(--theme-text));
      font-family: inherit;

      &:focus-visible {
        outline: var(--form-element-outline-width-focus, 0.2rem) solid
          var(--input-copy-focus-ring, var(--theme-border-focus));
        outline-offset: var(--form-element-outline-offset-focus, 0.2rem);
      }
    }

    .input-copy__button.input-button {
      flex-shrink: 0;
      max-inline-size: 50%;
      box-sizing: border-box;
      min-height: auto;
      gap: var(--input-copy-button-gap, 0.6rem);
      padding: var(--input-copy-button-padding, 0.8rem 1.2rem);
      background-color: var(--input-copy-button-bg, var(--input-button-primary-surface, var(--theme-surface)));
      color: var(--input-copy-button-text-color, var(--input-button-primary-text, var(--theme-on-surface)));
      border: none;
      border-radius: var(--input-copy-button-border-radius, 0.4rem);
      font-size: var(--_input-font-size);
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      --input-button-text-white-space: normal;

      &:hover:not(:disabled, [aria-disabled="true"]) {
        background-color: var(
          --input-copy-button-bg-hover,
          var(--input-button-primary-surface-hover, var(--theme-surface-hover))
        );
      }

      &:focus-visible {
        outline: var(--form-element-outline-width-focus, 0.2rem) solid
          var(--input-copy-focus-ring, var(--theme-border-focus));
        outline-offset: var(--form-element-outline-offset-focus, 0.2rem);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &[aria-disabled="true"] {
        cursor: default;
      }

      .input-copy__icon {
        width: 1.2em;
        height: 1.2em;
        flex-shrink: 0;
      }

      .button-text {
        font-size: inherit;
        text-transform: none;
      }
    }

    @container input-copy (width < 48rem) {
      .input-copy__button.input-button .button-text {
        display: none;
      }
    }

    .input-copy__description {
      margin: var(--input-copy-description-margin, 0);
      font-size: var(--input-copy-description-font-size, var(--step-4));
      color: var(--input-copy-description-color, var(--theme-text));
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      overflow-wrap: anywhere;
      -webkit-line-clamp: var(--input-copy-description-line-clamp, none);
      line-clamp: var(--input-copy-description-line-clamp, none);
    }
  }
}
</style>
