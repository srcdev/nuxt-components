<template>
  <div class="input-range-with-label" :data-theme="formTheme" :class="[elementClasses, { error: fieldHasError }]">
    <InputLabel
      :id
      :for="id"
      :theme
      :name
      input-variant="normal"
      :field-has-error
      :style-class-passthrough="['input-number-label', 'body-normal-bold']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <template v-if="slots.description">
      <slot name="description"></slot>
    </template>

    <InputRangeCore :id v-model="modelValue" :name :min :max :step :theme :required :size :weight :field-has-error>
      <template v-if="slots.datalist" #datalist>
        <slot name="datalist"></slot>
      </template>
      <template v-if="slots.left" #left>
        <InputButtonCore
          type="button"
          :readonly="Number(modelValue) === min"
          :is-pending="false"
          button-text="Step down"
          :theme
          size="x-small"
          @click.stop.prevent="updateRange(-step, Number(modelValue) > min)"
        >
          <template #iconOnly>
            <slot name="left"></slot>
          </template>
        </InputButtonCore>
      </template>
      <template v-if="slots.right" #right>
        <InputButtonCore
          type="button"
          :readonly="Number(modelValue) === max"
          :is-pending="false"
          button-text="Step up"
          :theme
          size="x-small"
          @click.stop.prevent="updateRange(step, Number(modelValue) < max)"
        >
          <template #iconOnly>
            <slot name="right"></slot>
          </template>
        </InputButtonCore>
      </template>
    </InputRangeCore>
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
  name: string;
  label: string;
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

const id = useId();
const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<number | readonly number[]>();

const updateRange = (step: number, withinRangeLimit: boolean) => {
  if (withinRangeLimit) {
    modelValue.value = (Number(modelValue.value) + step) as number;
  }
};
</script>

<style lang="css">
.input-range-with-label {
  .input-range-label {
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
