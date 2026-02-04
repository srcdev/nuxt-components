<template>
  <div class="input-range-fancy-with-label" :data-theme="formTheme" :class="[elementClasses, { error: fieldHasError }]">
    <label class="input-range-fancy-label body-normal-bold" :for="id">{{ label }}</label>
    <template v-if="slots.description">
      <slot name="description"></slot>
    </template>

    <InputRangeFancyCore
      v-model="modelValue"
      :id
      :name
      :rangeLowLabel
      :rangeHighLabel
      :min
      :max
      :step
      :theme
      :required
      :size
      :weight
      :fieldHasError
    />
    <InputError :errorMessage :showError="fieldHasError" :id :isDetached="true" :styleClassPassthrough="['mbe-20']" />
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, FormWeight } from "~/types/forms/types.forms";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  rangeLowLabel: {
    type: String,
    required: true,
  },
  rangeHighLabel: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  placeholder: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: [Object, String],
    required: true,
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<FormTheme>,
    default: "primary",
  },
  size: {
    type: String as PropType<FormSize>,
    default: "medium",
  },
  weight: {
    type: String as PropType<FormWeight>,
    default: "wght-400",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  deepCssClassPassthrough: {
    type: String,
    default: "",
  },
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
