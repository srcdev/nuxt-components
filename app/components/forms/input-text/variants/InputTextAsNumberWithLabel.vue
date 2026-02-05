<template>
  <div
    class="input-text-with-label"
    :data-theme="formTheme"
    :class="[inputVariant, elementClasses, { dirty: isDirty }, { active: isActive }]"
  >
    <InputLabel
      :id
      :for="id"
      :theme
      :name
      :input-variant
      :field-has-error
      :style-class-passthrough="['input-text-label', 'body-normal-bold']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <div v-if="slots.description" :id="`${id}-description`">
      <slot name="description"></slot>
    </div>

    <InputTextCore
      :id
      v-model="internalStringValue"
      v-model:is-dirty="isDirty"
      v-model:is-active="isActive"
      type="text"
      :maxlength
      :name
      :placeholder
      :label
      :error-message
      :field-has-error
      :required
      :style-class-passthrough
      :theme
      inputmode="numeric"
      :aria-describedby
      :size
      :input-variant
    >
      <template v-if="slots.left" #left>
        <InputButtonCore
          type="button"
          :readonly="(modelValue ?? 0) <= min"
          :is-pending="false"
          button-text="Step down"
          theme="input-action"
          :size
          @click.stop.prevent="updateValue(-step, (modelValue ?? 0) > min)"
        >
          <template #iconOnly>
            <slot name="left"></slot>
          </template>
        </InputButtonCore>
      </template>
      <template v-if="slots.right" #right>
        <InputButtonCore
          type="button"
          :readonly="(modelValue ?? 0) >= max"
          :is-pending="false"
          button-text="Step up"
          theme="input-action"
          :size
          @click.stop.prevent="updateValue(step, (modelValue ?? 0) < max)"
        >
          <template #iconOnly>
            <slot name="right"></slot>
          </template>
        </InputButtonCore>
      </template>
    </InputTextCore>
    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" />
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms";
const props = defineProps({
  maxlength: {
    type: Number,
    default: 255,
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
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
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  theme: {
    type: String as PropType<FormTheme>,
    default: "primary",
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
  size: {
    type: String as PropType<FormSize>,
    default: "default",
  },
  inputVariant: {
    type: String as PropType<InputVariant>,
    default: "normal",
  },
});

const slots = useSlots();

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const id = useId();
const errorId = `${id}-error-message`;
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? `${id}-description` : undefined;
  return props.fieldHasError ? errorId : ariaDescribedbyId;
});

const modelValue = defineModel<number>();
const isActive = ref<boolean>(false);
const isDirty = ref<boolean>(false);

// Convert between string (for input) and number (for modelValue)
const internalStringValue = computed({
  get: () => modelValue.value?.toString() ?? "",
  set: (value: string) => {
    const numericValue = value === "" ? undefined : Number(value);
    // Only update if it's a valid number or empty string
    if (value === "" || !isNaN(numericValue as number)) {
      modelValue.value = numericValue;
    }
  },
});

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const minLength = computed(() => `${props.max.toString().length + 1}em`);

const updateValue = (step: number, withinRangeLimit: boolean) => {
  if (withinRangeLimit) {
    const currentValue = modelValue.value ?? 0;
    modelValue.value = currentValue + step;
  }
};

updateElementClasses(["input-text-as-number", "has-left-button", "has-right-button"]);
</script>

<style lang="css">
.input-text-as-number {
  .input-text-wrapper {
    width: fit-content;

    &:has(.input-text-as-number) {
      .left-slot {
        margin-inline: 0;
      }
      .right-slot {
        margin-inline: 0;
      }
    }

    .input-text-core.input-text-as-number {
      flex-grow: initial;
      text-align: center;
      width: v-bind(minLength);
    }
  }
}
</style>
