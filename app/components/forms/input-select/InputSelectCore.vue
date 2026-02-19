<template>
  <div
    class="input-select-wrapper"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :data-size="size"
    :class="[inputVariant, size, { dirty: isDirty }, { active: isActive }, { error: fieldHasError }]"
  >
    <select :id v-model="modelValue" :aria-invalid="fieldHasError" class="input-select-core" :name :title>
      <option v-if="placeholder" value="" readonly :selected="!modelValue" class="input-select-core-option placeholder">
        {{ placeholder }}
      </option>
      <option
        v-for="item in fieldData.data"
        :key="item.id"
        :value="item.value"
        :selected="Number(item.value) === modelValue"
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
import type { FormUiTheme, FormSize, InputUiVariant, IFormMultipleOptions } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  placeholder?: string;
  title?: string;
  required?: boolean;
  fieldHasError?: boolean;
  size?: FormSize;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  title: "Please select an option",
  required: false,
  fieldHasError: false,
  size: "medium",
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const FormUiTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<string | number | readonly number[]>({ required: true });
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");
const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>;
</script>

<style lang="css">
.input-select-wrapper {
  background-color: var(--theme-input-surface);
  overflow: hidden;

  z-index: 2;
  position: relative;

  &.normal {
    border: var(--form-element-border-width) solid var(--theme-input-border);
    border-radius: var(--form-input-border-radius);
    outline: var(--form-element-outline-width) solid var(--theme-input-outline);
  }

  &.underlined {
    border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--theme-input-border);
    background-color: var(--theme-input-surface);
  }

  .input-select-core {
    appearance: none;
    background-color: transparent;

    /* For legacy support - eg, Safari */
    /* &::after {
      content: '';
      width: 0.8em;
      height: 0.5em;
      background-color: var(--theme-input-border);
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
      border: var(--form-element-border-width) solid var(--theme-input-border);
      outline: var(--form-element-outline-width) solid var(--_input-select-outline-color);

      @starting-style {
        opacity: 0;
      }
    }

    border: none;
    outline: none;
    border-radius: 0;
    width: 100%;

    &:hover {
      background-color: var(--theme-input-surface-hover);
    }

    /* END modern Select CSS */

    font-family: var(--font-family);
    font-size: var(--form-element-font-size);
    line-height: var(--input-element-line-height);
    padding-block: var(--input-padding-block);
    padding-inline: var(--input-padding-inline);
    min-height: var(--input-min-height);

    .input-select-core-option {
      min-height: var(--input-select-option-min-height);
      gap: 1.5rem;
      transition: all var(--theme-form-transition-duration) ease-in-out;

      &:hover {
        background-color: var(--theme-input-surface-hover);
      }

      .input-select-core-option-decorator-icon {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
}
</style>
