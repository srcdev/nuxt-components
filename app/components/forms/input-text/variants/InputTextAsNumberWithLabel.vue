<template>
  <div
    class="input-text-with-label"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
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
      :input-variant
    >
      <template v-if="slots.left" #left>
        <InputButtonCore
          type="button"
          :readonly="(modelValue ?? 0) <= min"
          :is-pending="false"
          button-text="Step down"
          theme="default"
          variant="inline"
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
          theme="default"
          variant="inline"
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
});

const slots = useSlots();

const FormUiTheme = computed(() => {
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
    padding-inline: 0;

    &:has(.input-text-as-number) {
      .slot {
        margin-inline: 0;

        .input-button-core {
          background-color: var(--theme-input-surface);

          &:hover {
            background-color: var(--theme-input-surface-hover);
          }

          &.icon-only {
            .btn-icon {
              margin: 0;
            }
          }
        }

        &.left-slot {
          .input-button-core {
            border-right: var(--form-element-border-width) solid var(--theme-input-border);
          }
        }

        &.right-slot {
          .input-button-core {
            border-left: var(--form-element-border-width) solid var(--theme-input-border);
          }
        }
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
