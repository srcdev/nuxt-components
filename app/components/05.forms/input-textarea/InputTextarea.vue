<template>
  <div
    class="input-textarea-wrapper"
    :data-theme="theme"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : null"
    :data-dirty="isDirty ? '' : null"
    :data-active="isActive ? '' : null"
    :data-has-left-slot="slots.left ? '' : null"
    :data-has-right-slot="slots.right ? '' : null"
  >
    <span v-if="slots.left" class="input-textarea-slot input-textarea-slot-left">
      <slot name="left"></slot>
    </span>

    <textarea
      :id
      v-model="modelValue"
      :maxlength
      :placeholder
      :name
      :required
      :readonly
      :autocomplete
      :class="['input-textarea', elementClasses]"
      :aria-invalid="fieldHasError ? 'true' : undefined"
      :aria-describedby="ariaDescribedby || undefined"
      @focusin="isActive = true"
      @focusout="isActive = false"
    ></textarea>

    <span v-if="slots.right" class="input-textarea-slot input-textarea-slot-right">
      <slot name="right"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  maxlength?: number;
  id: string;
  name: string;
  placeholder?: string;
  ariaDescribedby?: string;
  fieldHasError?: boolean;
  required?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  maxlength: 255,
  placeholder: "",
  ariaDescribedby: "",
  fieldHasError: false,
  required: false,
  readonly: false,
  autocomplete: undefined,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const modelValue = defineModel<string | number | readonly string[] | null | undefined>({
  required: true,
});
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");

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
  .input-textarea-wrapper {
    --_border: var(--input-textarea-border, var(--theme-border));

    display: flex;
    align-items: center;
    gap: var(--input-textarea-slot-gap, 1.2rem);
    min-inline-size: 0;
    max-inline-size: 100%;
    background-color: var(--input-textarea-surface, var(--theme-input-surface));
    padding-inline: var(--input-padding-inline);
    transition: all var(--theme-form-transition-duration) ease-in-out;

    z-index: 2;
    position: relative;

    &[data-input-variant="normal"] {
      border: var(--form-element-border-width) solid var(--_border);
      border-radius: var(--form-input-border-radius);
      outline: var(--form-element-outline-width) solid transparent;

      &:has(textarea:is(:hover)) {
        outline: var(--form-element-outline-width-focus) solid
          var(--input-textarea-border-hover, var(--theme-border-focus));
        outline-offset: var(--form-element-outline-offset-focus);
      }

      &:has(textarea:focus-visible) {
        outline: var(--form-element-outline-width-focus) solid
          var(--input-textarea-border-focus, var(--theme-border-focus));
        outline-offset: var(--form-element-outline-offset-focus);
      }
    }

    &[data-input-variant="underlined"] {
      border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--_border);
    }

    .input-textarea-slot {
      display: flex;
      flex-shrink: 0;
      align-self: var(--input-textarea-slot-align, center);
      padding-block: var(--input-textarea-slot-padding-block, 0);
      place-items: center;
      background-clip: padding-box;
    }

    .input-textarea {
      all: unset;
      touch-action: manipulation;
      flex-grow: 1;
      min-inline-size: 0;
      field-sizing: content;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      overflow-y: auto;

      color: var(--input-textarea-text-color, var(--theme-input-text-color-normal));
      font-family: var(--font-family);
      font-size: var(--input-font-size);
      line-height: var(--input-textarea-line-height);
      padding-block: var(--form-textarea-padding-block);
      padding-inline: var(--form-textarea-padding-inline);

      min-height: var(--input-textarea-min-height, 6lh);
      max-block-size: var(--input-textarea-max-height, none);

      &::placeholder {
        color: var(--input-textarea-placeholder-color, var(--theme-input-placeholder));
        font-size: var(--theme-input-placeholder-font-size);
        font-style: italic;
        line-height: 1;
        font-weight: normal;
      }
    }
  }
}
</style>
