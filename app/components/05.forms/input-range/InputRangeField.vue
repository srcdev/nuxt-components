<template>
  <div
    class="input-range-field"
    :class="elementClasses"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : undefined"
  >
    <InputLabel
      :id
      :required
      input-variant="normal"
      :field-has-error
      :style-class-passthrough="['input-range-label']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
      :description-id
      :field-has-error="fieldHasError"
      :style-class-passthrough="['input-text-description']"
    >
      <template v-if="slots.descriptionHtml" #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template v-if="slots.descriptionText" #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>

    <InputRange
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
      :aria-describedby="ariaDescribedby()"
    >
      <template v-if="slots.markers" #markers>
        <slot name="markers"></slot>
      </template>
      <template v-if="slots.datalist" #datalist="{ datalistId }">
        <slot name="datalist" :datalist-id="datalistId"></slot>
      </template>
      <template v-if="slots.left" #left>
        <InputButton
          type="button"
          :readonly="modelValue <= min"
          :is-pending="false"
          :button-text="stepDownLabel"
          :theme
          variant="secondary"
          @click.stop.prevent="stepBy(-1)"
        >
          <template #iconOnly>
            <slot name="left"></slot>
          </template>
        </InputButton>
      </template>
      <template v-if="slots.right" #right>
        <InputButton
          type="button"
          :readonly="modelValue >= max"
          :is-pending="false"
          :button-text="stepUpLabel"
          :theme
          variant="secondary"
          @click.stop.prevent="stepBy(1)"
        >
          <template #iconOnly>
            <slot name="right"></slot>
          </template>
        </InputButton>
      </template>
    </InputRange>
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
  stepDownLabel?: string;
  stepUpLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  fieldHasError: false,
  required: false,
  theme: "default",
  weight: "wght-400",
  styleClassPassthrough: () => [],
  stepDownLabel: "Step down",
  stepUpLabel: "Step up",
});

const slots = useSlots();
const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<number>({
  required: true,
});

const decimalPlaces = (value: number) => (String(value).split(".")[1] ?? "").length;
const clamp = (value: number) => Math.min(Math.max(value, props.min), props.max);

const stepBy = (direction: 1 | -1) => {
  const current = Number(modelValue.value);
  const stepSize = Math.abs(props.step) || 1;
  const precision = Math.max(decimalPlaces(stepSize), decimalPlaces(props.min));
  const next = clamp(Number(((Number.isFinite(current) ? current : props.min) + direction * stepSize).toFixed(precision)));
  if (next !== current) modelValue.value = next;
};
</script>

<style lang="css">
@layer components {
  .input-range-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }
}
</style>
