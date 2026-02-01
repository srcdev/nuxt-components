<template>
  <div
    class="input-checkbox-radio-wrapper"
    :data-theme="formTheme"
    :data-size="size"
    :class="[
      type,
      size,
      elementClasses,
      { error: fieldHasError },
      { button: isButton },
      { 'display-as-disc': displayAsDisc },
    ]"
  >
    <div class="input-checked-icon-slot">
      <slot name="checkedIcon">
        <Icon :name="defaultIcon" class="input-checked-icon-checked" />
      </slot>
    </div>

    <input
      :type
      :true-value
      :false-value
      :id
      :name
      :required="required && !multipleOptions"
      :value="trueValue"
      class="input-checkbox-radio-core"
      :class="[size, { error: fieldHasError }, { 'is-button': isButton }]"
      v-model="modelValue"
      ref="inputField"
      :aria-checked="isChecked"
      :aria-describedby
      :aria-invalid="fieldHasError"
    />
  </div>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"
const props = defineProps({
  isButton: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<"checkbox" | "radio">,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    value: false,
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  multipleOptions: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  ariaDescribedby: {
    type: String,
    default: null,
  },
  displayAsDisc: {
    type: Boolean,
    default: false,
  },
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme
})

const modelValue = defineModel<any>()

const inputField = ref<HTMLInputElement | null>(null)

const defaultIcon = computed(() => {
  return props.type === "checkbox" ? "material-symbols:check-small" : "material-symbols:circle"
})

const isArray = Array.isArray(modelValue.value)

const isChecked = computed(() => {
  if (isArray) {
    return modelValue.value.includes(props.trueValue)
  } else {
    return modelValue.value === props.trueValue
  }
})
</script>

<style lang="css">
.input-checkbox-radio-wrapper {
  display: grid;
  grid-template-areas: "element-stack";
  place-content: center;

  background-color: var(--theme-checkbox-symbol-surface);
  border: 0.1rem solid var(--theme-input-border);
  outline: var(--form-element-outline-width) solid var(--theme-input-outline);
  box-shadow: var(--_box-shadow);

  height: var(--input-checked-element-size);
  width: var(--input-checked-element-size);

  transition: all var(--theme-form-transition-duration) ease-in-out;

  &.checkbox {
    border-radius: var(--form-input-border-radius);
    &.button {
      &.display-as-disc {
        border-radius: 50%;
      }
    }
  }

  &.radio {
    border-radius: 50%;
  }

  &:has(.input-checkbox-radio-core:checked) {
    .input-checked-icon-slot {
      opacity: 1;

      .input-checked-icon-checked,
      .icon {
        color: var(--theme-checkbox-symbol-color);
      }
    }
  }

  /* focus-visible */
  &:not(.button):has(.input-checkbox-radio-core:focus-visible) {
    outline: var(--theme-focus-visible-outline);
  }

  .input-checked-icon-slot {
    grid-area: element-stack;
    display: grid;
    place-content: center;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    .input-checked-icon-checked,
    .icon {
      color: var(--theme-checkbox-symbol-color);
      height: var(--input-checked-icon-size);
      width: var(--input-checked-icon-size);
      box-shadow: var(--_box-shadow);
    }
  }

  .input-checkbox-radio-core {
    touch-action: manipulation;
    grid-area: element-stack;
    appearance: none;
    margin: 0;
    overflow: hidden;
    opacity: 0;

    height: var(--input-checked-element-size);
    width: var(--input-checked-element-size);

    &:hover {
      cursor: pointer;
    }

    &:not(.is-button) {
      &:focus-visible {
        border: var(--input-checkbox-radio-wrapper-border-on);
        outline: var(--input-checkbox-radio-wrapper-outline-on);
        box-shadow: var(--input-checkbox-radio-wrapper-box-shadow-on);
      }
    }
  }
}
</style>
