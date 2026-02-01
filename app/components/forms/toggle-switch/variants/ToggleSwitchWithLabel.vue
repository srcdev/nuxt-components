<template>
  <div class="toggle-switch-with-label" :class="[elementClasses]" :data-theme="formTheme">
    <InputLabel
      :for="`toggle-sitch-${id}`"
      :id
      :theme
      :name
      input-variant="normal"
      :field-has-error
      :style-class-passthrough="['input-switch-label', 'input-text-label', 'body-normal-bold']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <div v-if="slots.description" :id="`${id}-description`">
      <slot name="description"></slot>
    </div>
    <ToggleSwitchCore
      v-model="modelValue"
      :id
      :name
      :required
      :field-has-error
      :true-value
      :false-value
      :theme
      :round
      :size
      :ariaDescribedby
    >
      <template v-if="slots.iconOn" #iconOn>
        <slot name="iconOn"></slot>
      </template>

      <template v-if="slots.iconOff" #iconOff>
        <slot name="iconOff"></slot>
      </template>
    </ToggleSwitchCore>
    <InputError :errorMessage :showError="fieldHasError" :id="errorId" :isDetached="true" />
  </div>
</template>

<script setup lang="ts">
import propValidators from "../../c12/prop-validators"

const props = defineProps({
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
  errorMessage: {
    type: [Object, String],
    default: "",
    required: false,
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
  round: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
})

const slots = useSlots()

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme
})

const id = useId()
const errorId = `${id}-error-message`
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? `${id}-description` : undefined
  return props.fieldHasError ? errorId : ariaDescribedbyId
})

const modelValue = defineModel()
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.toggle-switch-with-label {
  --_transition-duration: 0.4s;

  .toggle-switch-label {
    display: block;
  }
}
</style>
