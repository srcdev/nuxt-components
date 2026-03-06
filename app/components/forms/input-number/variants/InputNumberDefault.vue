<template>
  <div
    class="input-number-with-label"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :class="[elementClasses, `theme-${theme}`, { error: fieldHasError }]"
  >
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

    <InputDescription
      :id
      :description-id
      :name
      :field-has-error="fieldHasError"
      :style-class-passthrough="['input-text-description']"
    >
      <template #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>

    <InputNumberCore
      :id
      v-model="modelValue"
      :name
      :min
      :max
      :step
      :theme
      :required
      :weight
      :field-has-error
      :style-class-passthrough
      :aria-describedby
    >
      <template v-if="slots.left" #left>
        <InputButtonCore
          type="button"
          :readonly="Number(modelValue) <= min"
          :is-pending="false"
          button-text="Step down"
          :theme="theme"
          variant="inline"
          @click.stop.prevent="updateValue(-step, Number(modelValue) > min)"
        >
          <template #iconOnly>
            <slot name="left"></slot>
          </template>
        </InputButtonCore>
      </template>
      <template v-if="slots.right" #right>
        <InputButtonCore
          type="button"
          :readonly="Number(modelValue) >= max"
          :is-pending="false"
          button-text="Step up"
          :theme="theme"
          variant="inline"
          @click.stop.prevent="updateValue(step, Number(modelValue) < max)"
        >
          <template #iconOnly>
            <slot name="right"></slot>
          </template>
        </InputButtonCore>
      </template>
    </InputNumberCore>
    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" />
  </div>
</template>

<script setup lang="ts">
import type { FormWeight } from "~/types/forms/types.forms";

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
  theme?: "default" | "success" | "error" | "warning";
  weight?: FormWeight;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  fieldHasError: false,
  required: false,
  theme: "default",
  weight: "normal",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);
const modelValue = defineModel<number | readonly number[]>();

const updateValue = (step: number, withinRangeLimit: boolean) => {
  if (withinRangeLimit) {
    modelValue.value = (Number(modelValue.value) + step) as number;
  }
};

updateElementClasses(["has-left-button", "has-right-button"]);
</script>

<style lang="css">
@layer components {
.input-number-with-label {
  .input-number-label {
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
}
</style>
