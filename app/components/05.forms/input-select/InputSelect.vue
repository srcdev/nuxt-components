<template>
  <div
    class="input-select-wrapper"
    :data-theme="theme"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : null"
    :data-dirty="isDirty ? '' : null"
    :data-active="isActive ? '' : null"
  >
    <select
      :id
      v-model="modelValue"
      :aria-invalid="fieldHasError ? 'true' : undefined"
      :class="['input-select', elementClasses]"
      :name
      :title
      :required
      :aria-describedby="ariaDescribedby || undefined"
      @focusin="isActive = true"
      @focusout="isActive = false"
      @change="isDirty = true"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
        :selected="isEmpty"
        class="input-select-option input-select-option-placeholder"
      >
        {{ placeholder }}
      </option>
      <option
        v-for="item in fieldData.data"
        :key="item.id"
        :value="item.value"
        :selected="String(item.value) === String(modelValue)"
        class="input-select-option"
      >
        <Icon
          v-if="item.icon"
          :name="item.icon"
          class="input-select-option-icon"
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

const isEmpty = computed(() => modelValue.value === "" || modelValue.value == null);

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
  .input-select-wrapper {
    --_border: var(--input-select-border, var(--theme-border));
    --_border-focus: var(--input-select-border-focus, var(--theme-border-focus));

    min-inline-size: 0;
    max-inline-size: 100%;
    background-color: var(--input-select-surface, var(--theme-input-surface));
    overflow: hidden;

    z-index: 2;
    position: relative;
    transition: all var(--theme-form-transition-duration) ease-in-out;

    &[data-input-variant="normal"] {
      border: var(--form-element-border-width) solid var(--_border);
      border-radius: var(--form-input-border-radius);
      outline: var(--form-element-outline-width) solid transparent;
    }

    &[data-input-variant="underlined"] {
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

    .input-select {
      appearance: none;
      background-color: transparent;
      color: var(--input-select-text-color, var(--theme-input-text-color-normal));
      display: flex;
      align-items: center;

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
      min-inline-size: 0;

      font-family: var(--font-family);
      font-size: var(--input-font-size);
      padding-block: var(--input-padding-block);
      padding-inline: var(--input-padding-inline);
      min-height: var(--input-min-height);

      .input-select-option {
        min-height: var(--input-select-option-min-height);
        gap: var(--input-select-option-gap, 1.5rem);
        overflow-wrap: anywhere;
        white-space: normal;
        transition: all var(--theme-form-transition-duration) ease-in-out;

        &:hover {
          background-color: var(--input-select-surface-hover, var(--theme-input-surface-hover));
        }

        .input-select-option-icon {
          display: inline-block;
          flex-shrink: 0;
          width: var(--input-select-option-icon-size, 1.5rem);
          height: var(--input-select-option-icon-size, 1.5rem);
        }
      }
    }
  }
}
</style>
