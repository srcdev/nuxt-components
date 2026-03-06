<template>
  <div
    class="input-textarea-wrapper"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :class="[
      inputVariant,
      { dirty: isDirty },
      { active: isActive },
      { error: fieldHasError },
      { 'has-left-slot': slots.left },
      { 'has-right-slot': slots.right },
    ]"
  >
    <span v-if="slots.left" class="slot left-slot">
      <slot name="left"></slot>
    </span>

    <textarea
      :id
      ref="inputField"
      v-model="modelValue"
      :maxlength
      :placeholder
      :name
      :required
      :class="['input-textarea-core', elementClasses, { dirty: isDirty }, { active: isActive }]"
      :aria-invalid="fieldHasError"
      :aria-describedby
      @focusin="updateFocus(true)"
      @focusout="updateFocus(false)"
    ></textarea>

    <span v-if="slots.right" class="slot right-slot">
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
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const FormUiTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<string | number | readonly string[] | null | undefined>();
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");

const updateFocus = (isFocused: boolean) => {
  isActive.value = isFocused;
};

const inputField = ref<HTMLInputElement | null>(null);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
.input-textarea-wrapper {
  background-color: var(--theme-input-surface);
  padding-inline: var(--element-decorator-padding-inline);
  transition: all var(--theme-form-transition-duration) ease-in-out;

  z-index: 2;
  position: relative;

  &.normal {
    border: var(--form-element-border-width) solid var(--theme-input-border);
    border-radius: var(--form-input-border-radius);
    outline: var(--form-element-outline-width) solid var(--theme-input-outline);

    &:has(textarea:focus-visible) {
      outline: var(--form-element-outline-width-focus) solid var(--theme-input-outline-focus);
      outline-offset: var(--form-element-outline-offset-focus);
    }

    &:has(textarea:is(:hover)) {
      outline: var(--form-element-outline-width-focus) solid var(--theme-input-outline-focus);
      outline-offset: var(--form-element-outline-offset-focus);
    }
  }

  &.underlined {
    border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--theme-input-border);
  }

  display: flex;
  align-items: center;
  gap: 12px;

  .slot {
    display: flex;
    place-items: center;
    background-clip: padding-box;
  }

  .input-textarea-core {
    all: unset;
    touch-action: manipulation;
    flex-grow: 1;
    field-sizing: content;

    color: var(--theme-input-text-color-normal);
    font-family: var(--font-family);
    font-size: var(--input-font-size);
    line-height: var(--input-textarea-line-height);
    padding-block: var(--form-textarea-padding-block);
    padding-inline: var(--form-textarea-padding-inline);

    min-height: 6lh;

    &::placeholder {
      color: var(--theme-input-placeholder);
      font-size: var(--input-placeholder-font-size);
      font-style: var(--input-placeholder-font-style);
      line-height: var(--input-placeholder-line-height);
      font-weight: var(--input-placeholder-font-weight);
    }
  }
}
}
</style>
