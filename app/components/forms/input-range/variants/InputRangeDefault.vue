<template>
  <div
    class="input-range-with-label"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :class="[elementClasses, { error: fieldHasError }]"
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

    <InputRangeCore
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
      :aria-describedby="ariaDescribedby"
      :style-class-passthrough="styleClassPassthrough"
    >
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
          variant="secondary"
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
          variant="secondary"
          @click.stop.prevent="updateRange(step, Number(modelValue) < max)"
        >
          <template #iconOnly>
            <slot name="right"></slot>
          </template>
        </InputButtonCore>
      </template>
    </InputRangeCore>
    <InputError
      :id="errorId"
      :error-message
      :show-error="fieldHasError"
      :is-detached="true"
      :style-class-passthrough="['mbe-20']"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, FormWeight } from "~/types/forms/types.forms";

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
  theme?: FormUiTheme;
  weight?: FormWeight;
  styleClassPassthrough?: string | string[];
  deepCssClassPassthrough?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  fieldHasError: false,
  required: false,
  theme: "default",
  weight: "wght-400",
  styleClassPassthrough: () => [],
  deepCssClassPassthrough: "",
});

const slots = useSlots();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

// const id = useId();

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

// const FormUiTheme = computed(() => {
//   return props.fieldHasError ? "error" : props.theme;
// });

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
