<template>
  <div
    class="input-copy-core"
    data-testid="input-copy-core"
    :class="[elementClasses, { copied: isCopied }]"
  >
    <input
      :id
      :value
      type="text"
      readonly
      aria-readonly="true"
      class="input-copy-field"
    />
    <InputButtonCore
      type="button"
      variant="inline"
      class="input-copy-button"
      :button-text="isCopied ? copiedLabel : copyLabel"
      :aria-label="isCopied ? copiedLabel : copyLabel"
      @click="handleCopy"
    >
      <template v-if="slots.icon" #left>
        <slot name="icon"></slot>
      </template>
    </InputButtonCore>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  value: string;
  copyLabel?: string;
  copiedLabel?: string;
  feedbackDuration?: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  copyLabel: "Copy",
  copiedLabel: "Copied!",
  feedbackDuration: 2000,
  styleClassPassthrough: () => [],
});

const emit = defineEmits<{
  copy: [value: string];
}>();

const slots = useSlots();
const isCopied = ref(false);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
    isCopied.value = true;
    emit("copy", props.value);
    await useSleep(props.feedbackDuration);
    isCopied.value = false;
  } catch {
    // Clipboard API unavailable — fail silently
  }
};

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .input-copy-core {
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border: var(--form-element-border-width) solid var(--theme-input-border);
    border-radius: var(--form-input-border-radius);
    background-color: var(--theme-input-surface);
    transition: all var(--theme-form-transition-duration) ease-in-out;

    .input-copy-field {
      all: unset;
      flex-grow: 1;
      padding-block: var(--input-padding-block);
      padding-inline: var(--input-padding-inline);
      font-family: var(--font-family);
      font-size: var(--input-font-size);
      color: var(--theme-input-text-color-normal);
      cursor: default;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }

    .input-copy-button.input-button-core {
      border-radius: 0;
      border-inline-start: var(--form-element-border-width) solid var(--theme-input-border);
      padding-inline: var(--input-padding-inline);
      min-width: var(--input-min-height);
      background-color: var(--theme-button-secondary-surface);
      color: var(--theme-button-secondary-text);

      &:hover {
        background-color: var(--theme-button-primary-surface);
        color: var(--theme-button-primary-text);
      }

      &:focus-visible {
        outline: var(--form-element-outline-width-focus) solid var(--theme-input-outline-focus);
        outline-offset: -4px;
      }
    }

    &.copied {
      --_copy-success-surface: light-dark(var(--green-01), var(--green-09));
      --_copy-success-text: light-dark(var(--green-08), var(--green-01));

      .input-copy-button.input-button-core {
        background-color: var(--_copy-success-surface);
        color: var(--_copy-success-text);
      }
    }
  }
}
</style>
