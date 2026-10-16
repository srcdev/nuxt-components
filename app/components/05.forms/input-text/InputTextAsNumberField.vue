<template>
  <div
    class="input-text-as-number-field"
    :class="elementClasses"
    :data-theme="theme"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : null"
    :data-dirty="isDirty ? '' : null"
    :data-active="isActive ? '' : null"
  >
    <InputLabel
      :id
      :required
      :input-variant
      :field-has-error
      :style-class-passthrough="['input-text-label', 'body-normal-bold']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
      :description-id
      :input-variant
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

    <InputText
      :id
      v-model="internalStringValue"
      v-model:is-dirty="isDirty"
      v-model:is-active="isActive"
      type="text"
      :maxlength
      :name
      :placeholder
      :field-has-error
      :required
      :theme
      :inputmode
      :aria-describedby="ariaDescribedby() ?? undefined"
      :input-variant
    >
      <template v-if="slots.left" #left>
        <InputButton
          type="button"
          :readonly="(modelValue ?? 0) <= min"
          :is-pending="false"
          :button-text="stepDownText"
          :theme
          variant="inline"
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
          :readonly="(modelValue ?? 0) >= max"
          :is-pending="false"
          :button-text="stepUpText"
          :theme
          variant="inline"
          @click.stop.prevent="stepBy(1)"
        >
          <template #iconOnly>
            <slot name="right"></slot>
          </template>
        </InputButton>
      </template>
    </InputText>
    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" :input-variant />
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  maxlength?: number;
  name: string;
  placeholder?: string;
  label: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  min: number;
  max: number;
  step?: number;
  inputVariant?: InputUiVariant;
  stepDownText?: string;
  stepUpText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxlength: 255,
  placeholder: "",
  fieldHasError: false,
  required: false,
  styleClassPassthrough: () => [],
  theme: "default",
  step: 1,
  inputVariant: "normal",
  stepDownText: "Step down",
  stepUpText: "Step up",
});

const slots = useSlots();

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<number | undefined>({ default: undefined });
const isActive = ref<boolean>(false);
const isDirty = ref<boolean>(false);

const internalStringValue = computed({
  get: () => modelValue.value?.toString() ?? "",
  set: (value: string) => {
    if (value === "") {
      modelValue.value = undefined;
      return;
    }
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) modelValue.value = numericValue;
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const decimalPlaces = (value: number) => (String(value).split(".")[1] ?? "").length;
const clamp = (value: number) => Math.min(Math.max(value, props.min), props.max);

const inputmode = computed(() => {
  if (props.min < 0) return "text";
  return Number.isInteger(props.step) ? "numeric" : "decimal";
});

const minLength = computed(() => {
  const longest = Math.max(String(props.min).length, String(props.max).length) + decimalPlaces(props.step);
  return `${Math.min(longest + 1, 12)}em`;
});

const stepBy = (direction: 1 | -1) => {
  const current = modelValue.value;
  if (typeof current !== "number" || !Number.isFinite(current)) {
    modelValue.value = clamp(0);
    return;
  }
  const stepSize = Math.abs(props.step) || 1;
  const precision = Math.max(decimalPlaces(stepSize), decimalPlaces(current), decimalPlaces(props.min));
  const next = clamp(Number((current + direction * stepSize).toFixed(precision)));
  if (next !== current) modelValue.value = next;
};
</script>

<style lang="css">
@layer components {
  .input-text-as-number-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;

    .input-text-wrapper[data-input-variant] {
      width: fit-content;
      max-inline-size: 100%;
      padding-inline: 0;

      .input-text-slot {
        margin-inline: 0;
      }

      .input-text-slot-left .input-button {
        border-inline-end: var(--form-element-border-width) solid var(--input-text-border, var(--theme-border));
      }

      .input-text-slot-right .input-button {
        border-inline-start: var(--form-element-border-width) solid var(--input-text-border, var(--theme-border));
      }

      .input-text {
        flex-grow: initial;
        text-align: center;
        width: v-bind(minLength);
      }
    }
  }
}
</style>
