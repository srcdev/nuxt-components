<template>
  <div class="input-range-fancy-with-label" :data-theme="formTheme" :class="[elementClasses, { error: fieldHasError }]">
    <label class="input-range-fancy-label body-normal-bold" :for="id">{{ label }}</label>
    <template v-if="slots.description">
      <slot name="description"></slot>
    </template>

    <InputRangeFancyCore
      :id
      v-model="modelValue"
      :name
      :range-low-label
      :range-high-label
      :min
      :max
      :step
      :theme
      :required
      :size
      :weight
      :field-has-error
    />
    <InputError
      :id
      :error-message
      :show-error="fieldHasError"
      :is-detached="true"
      :style-class-passthrough="['mbe-20']"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, FormWeight } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  label: string;
  rangeLowLabel: string;
  rangeHighLabel: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  theme?: FormTheme;
  size?: FormSize;
  weight?: FormWeight;
  styleClassPassthrough?: string | string[];
  deepCssClassPassthrough?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  fieldHasError: false,
  required: false,
  theme: "primary",
  size: "medium",
  weight: "wght-400",
  styleClassPassthrough: () => [],
  deepCssClassPassthrough: "",
});

const slots = useSlots();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<number | readonly number[]>();
</script>

<style lang="css">
.input-range-fancy-with-label {
  .input-range-fancy-label {
    display: block;
    margin-block: 0.8rem;

    &:hover {
      cursor: pointer;
    }
  }

  .label-description {
    font-family: var(--font-family);
    font-size: 1.6rem;
    margin-top: 1.2rem;
  }
}
</style>
