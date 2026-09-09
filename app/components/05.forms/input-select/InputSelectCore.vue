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
      class="input-select-core"
      :name
      :title
      :aria-describedby="ariaDescribedby"
    >
      <option v-if="placeholder" value="" readonly :selected="!modelValue" class="input-select-core-option placeholder">
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
import type { IFormMultipleOptions } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  placeholder?: string;
  title?: string;
  required?: boolean;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: "default" | "success" | "error" | "warning";
  inputVariant?: "normal" | "outlined" | "underlined";
  ariaDescribedby?: string;
}

withDefaults(defineProps<Props>(), {
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
const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>;
</script>

<style lang="css">
@layer components {
.input-select-wrapper {
  /* Public --input-select-* tokens, inline-fallback to the shared --theme-* tokens (see
     theming-component-token-pattern.md) — overriding one here doesn't touch every other themed
     input/control that also reads --theme-input-surface/--theme-border. --_surface etc. are
     private locals purely so the rest of this rule can reuse the resolved value without
     repeating the fallback chain at every property — they are not themselves an override point,
     see CONSUMER-STYLING.md. --_outline-color stays private/computed: it's always just an alias
     for --_border-focus with no independent meaning of its own. */
  --_surface: var(--input-select-surface, var(--theme-input-surface));
  --_surface-hover: var(--input-select-surface-hover, var(--theme-input-surface-hover));
  --_border: var(--input-select-border, var(--theme-border));
  /* Split so hover (mouse) and :focus-visible (keyboard/assistive) can diverge — both default to
     the same --theme-border-focus today, identical appearance to before this token existed, but
     each now has its own override point. */
  --_border-hover: var(--input-select-border-hover, var(--theme-border-focus));
  --_border-focus: var(--input-select-border-focus, var(--theme-border-focus));
  --_outline-color: var(--_border-focus);

  background-color: var(--_surface);
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
    background-color: var(--_surface);
  }

  &:has(:hover) {
    outline: var(--form-element-outline-width-focus) solid var(--_border-hover);
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

    /* For legacy support - eg, Safari */
    /* &::after {
      content: '';
      width: 0.8em;
      height: 0.5em;
      background-color: var(--_border);
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    } */

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
      outline: var(--form-element-outline-width) solid var(--_outline-color);

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
        background-color: var(--_surface-hover);
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
