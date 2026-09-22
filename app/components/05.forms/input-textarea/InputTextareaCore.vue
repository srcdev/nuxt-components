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

const modelValue = defineModel<string | number | readonly string[] | null | undefined>({
  required: true,
});
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
  /* Public --input-textarea-* tokens, inline-fallback to the shared --theme-* tokens (see
     theming-component-token-pattern.md) — mirrors InputTextCore's token shape. --_border is
     genuinely reused (both the .normal border and the .underlined border-bottom read it); the
     hover/focus border colours are each used only once, so they're inlined directly rather than
     wrapped in a private var (see the Public token pattern rule in CLAUDE.md's Styling
     Methodology). */
  --_border: var(--input-textarea-border, var(--theme-border));

  background-color: var(--input-textarea-surface, var(--theme-input-surface));
  padding-inline: var(--input-padding-inline);
  transition: all var(--theme-form-transition-duration) ease-in-out;

  z-index: 2;
  position: relative;

  &.normal {
    border: var(--form-element-border-width) solid var(--_border);
    border-radius: var(--form-input-border-radius);
    outline: var(--form-element-outline-width) solid transparent;

    &:has(textarea:focus-visible) {
      outline: var(--form-element-outline-width-focus) solid
        var(--input-textarea-border-focus, var(--theme-border-focus));
      outline-offset: var(--form-element-outline-offset-focus);
    }

    &:has(textarea:is(:hover)) {
      outline: var(--form-element-outline-width-focus) solid
        var(--input-textarea-border-hover, var(--theme-border-focus));
      outline-offset: var(--form-element-outline-offset-focus);
    }
  }

  &.underlined {
    border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--_border);
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

    color: var(--input-textarea-text-color, var(--theme-input-text-color-normal));
    font-family: var(--font-family);
    font-size: var(--input-font-size);
    line-height: var(--input-textarea-line-height);
    padding-block: var(--form-textarea-padding-block);
    padding-inline: var(--form-textarea-padding-inline);

    min-height: 6lh;

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
