<template>
  <div
    class="input-select-wrapper"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :class="[inputVariant, { dirty: isDirty }, { active: isActive }, { error: fieldHasError }]"
  >
    <select
      :id
      v-model="modelValue"
      :aria-invalid="fieldHasError ? 'true' : undefined"
      :class="['input-select-core', elementClasses]"
      :name
      :title
      :required
      :aria-describedby="ariaDescribedby"
      @focusin="isActive = true"
      @focusout="isActive = false"
      @change="isDirty = true"
    >
      <option v-if="placeholder" value="" disabled :selected="!modelValue" class="input-select-core-option placeholder">
        {{ placeholder }}
      </option>
      <option
        v-for="item in fieldData.data"
        :key="item.id"
        :value="item.value"
        :selected="String(item.value) === String(modelValue)"
        class="input-select-core-option"
      >
        <Icon
          v-if="item.icon"
          :name="item.icon"
          class="input-select-core-option-decorator-icon"
          aria-hidden="true"
          focusable="false"
        />
        {{ item.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { IFormMultipleOptions, FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  placeholder?: string;
  title?: string;
  required?: boolean;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  title: "Please select an option",
  required: false,
  fieldHasError: false,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
  ariaDescribedby: "",
});

const modelValue = defineModel<string | number | readonly number[]>({ required: true });
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");
const fieldData = defineModel<IFormMultipleOptions>("fieldData", { required: true });

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
.input-select-wrapper {
  /* Public --input-select-* tokens, inline-fallback to the shared --theme-* tokens (see
     theming-component-token-pattern.md) — overriding one here doesn't touch every other themed
     input/control that also reads --theme-input-surface/--theme-border. --_border is the one
     genuinely reused value (border, underlined border-bottom, open-picker border); the rest of
     this component's tokens are used at exactly one point each, so they're inlined directly
     rather than wrapped in a private var with no composition or state-swap behind it (see
     pitfall #20 in CLAUDE.md). */
  --_border: var(--input-select-border, var(--theme-border));
  /* Split so hover (mouse) and :focus-visible (keyboard/assistive) can diverge — both default to
     the same --theme-border-focus today, identical appearance to before this token existed, but
     each now has its own override point. */
  --_border-focus: var(--input-select-border-focus, var(--theme-border-focus));

  background-color: var(--input-select-surface, var(--theme-input-surface));
  overflow: hidden;

  z-index: 2;
  position: relative;
  transition: all var(--theme-form-transition-duration) ease-in-out;

  &.normal {
    border: var(--form-element-border-width) solid var(--_border);
    border-radius: var(--form-input-border-radius);
    outline: var(--form-element-outline-width) solid transparent;
  }

  &.underlined {
    border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--_border);
  }

  &:has(:hover) {
    outline: var(--form-element-outline-width-focus) solid
      var(--input-select-border-hover, var(--theme-border-focus));
    outline-offset: var(--form-element-outline-offset-focus);
  }

  &:has(select:focus-visible) {
    outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
    outline-offset: var(--form-element-outline-offset-focus);
  }

  .input-select-core {
    appearance: none;
    background-color: transparent;
    display: flex;
    align-items: center;

    /* Start modern Select CSS */
    &,
    &::picker(select) {
      appearance: base-select;
    }

    &::picker(select) {
      transition:
        display allow-discrete var(--theme-form-transition-duration),
        opacity var(--theme-form-transition-duration),
        overlay var(--theme-form-transition-duration) allow-discrete;
    }

    &:not(:open)::picker(select) {
      opacity: 0;
    }

    &:open::picker(select) {
      opacity: 1;
      border: var(--form-element-border-width) solid var(--_border);
      outline: var(--form-element-outline-width) solid var(--_border-focus);

      @starting-style {
        opacity: 0;
      }
    }

    border: none;
    outline: none;
    border-radius: 0;
    width: 100%;

    /* END modern Select CSS */

    font-family: var(--font-family);
    font-size: var(--input-font-size);
    /* line-height: var(--input-element-line-height); */
    padding-block: var(--input-padding-block);
    padding-inline: var(--input-padding-inline);
    min-height: var(--input-min-height);

    .input-select-core-option {
      min-height: var(--input-select-option-min-height);
      gap: 1.5rem;
      transition: all var(--theme-form-transition-duration) ease-in-out;

      &:hover {
        background-color: var(--input-select-surface-hover, var(--theme-input-surface-hover));
      }

      .input-select-core-option-decorator-icon {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
}
}
</style>
