<template>
  <label
    :for="id"
    class="input-checkbox-radio-options-button"
    :data-theme="formTheme"
    :data-size="size"
    :class="[size, elementClasses, optionsLayout, { error: fieldHasError }, { lozenge: displayAsLozenge }]"
  >
    <InputCheckboxRadioCore
      :isButton="true"
      :type
      :id
      :name
      :required
      v-model="modelValue"
      :size
      :trueValue
      :falseValue
      :fieldHasError
      :theme
      :ariaDescribedby
      :displayAsDisc
    >
      <template #checkedIcon>
        <slot name="checkedIcon"></slot>
      </template>
    </InputCheckboxRadioCore>
    <div v-if="slots.labelContent" class="input-checkbox-radio-options-button-label">
      <slot name="labelContent"></slot>
    </div>
    <div v-else class="input-checkbox-radio-options-button-label">{{ label }}</div>
    <div class="decorator-icon">
      <slot name="itemIcon">
        <Icon name="material-symbols:add-2" class="icon" aria-hidden="true" focusable="false" />
      </slot>
    </div>
  </label>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"

const props = defineProps({
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
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  optionsLayout: {
    type: String as PropType<string>,
    default: "equal-widths",
    validator(value: string) {
      return propValidators.optionsLayout.includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  direction: {
    type: String as PropType<"row" | "row-reverse">,
    default: "row",
    validator(value: string) {
      return ["row", "row-reverse"].includes(value)
    },
  },
  ariaDescribedby: {
    type: String,
    default: null,
  },
  displayAsDisc: {
    type: Boolean,
    default: false,
  },
  displayAsLozenge: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const modelValue = defineModel()

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme
})

const flexDirection = ref(props.direction)
</script>

<style lang="css">
.input-checkbox-radio-options-button {
  --_white-space: wrap;

  display: flex;
  flex-direction: v-bind(flexDirection);
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 0.4rem;
  transition: all 0.2s ease-in-out;

  &.lozenge {
    border-radius: 100vw;
  }

  &.inline {
    --_white-space: nowrap;
  }
  background-color: var(--theme-input-surface);
  border: var(--form-element-border-width) solid var(--theme-input-border);
  outline: var(--form-element-outline-width) solid var(--theme-input-outline);

  box-shadow: 0.1rem 0.1rem 0.8rem 0.1rem transparent;

  &:hover {
    background-color: var(--theme-input-surface-hover);
    border-color: var(--theme-input-border);
    outline-color: var(--theme-input-outline-hover);
    outline-offset: var(--form-element-outline-offset-focus);
    cursor: pointer;
  }

  &:has(.input-checkbox-radio-core:focus-visible) {
    background-color: var(--theme-input-surface-focus);
    outline-color: var(--theme-input-outline-focus);
    outline-offset: var(--form-element-outline-offset-focus);
  }

  /* Sizes */
  &.x-small {
    padding-block: 0.2rem;
    padding-inline: 1.6rem;
    gap: 1rem;
  }
  &.small {
    padding-block: 0.2rem;
    padding-inline: 1.6rem;
    gap: 1rem;
  }
  &.default {
    padding-block: 0.4rem;
    padding-inline: 1.2rem;
    gap: 1rem;
  }
  &.medium {
    padding-block: 0.4rem;
    padding-inline: 1.2rem;
    gap: 1rem;
  }
  &.large {
    padding-block: 0.4rem;
    padding-inline: 1.2rem;
    gap: 1rem;
  }

  .input-checkbox-radio-options-button-label {
    display: flex;
    flex-grow: 1;
    color: var(--theme-checkbox-label-text-color);
    font-size: var(--form-element-font-size);
    width: 100%;
    min-height: var(--form-element-line-height);
    align-items: center;
    justify-content: center;
    padding-block: 0.8rem;
    padding-inline: 0.8rem;
    white-space: var(--_white-space);

    &:hover {
      cursor: pointer;
    }
  }

  .decorator-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-checkbox-decorator-color);

    .icon {
      height: var(--theme-checkbox-decorator-icon-size);
      width: var(--theme-checkbox-decorator-icon-size);
    }
  }
}
</style>
