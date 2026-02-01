<template>
  <InputButtonCore
    type="button"
    :use-effect
    :isPending
    :readonly
    :effect
    :data-testid
    :size
    :weight
    :button-text
    :style-class-passthrough
    :theme
  >
    <template #left>
      <Icon name="material-symbols:check-circle-outline" class="icon" aria-hidden="true" focusable="false" />
    </template>
  </InputButtonCore>
</template>

<script setup lang="ts">
import propValidators from "../../c12/prop-validators"

defineProps({
  size: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  weight: {
    type: String as PropType<string>,
    default: "wght-400",
    validator(value: string) {
      return propValidators.weight.includes(value)
    },
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  useEffect: {
    type: Boolean,
    default: false,
  },
  effect: {
    type: String as PropType<string>,
    default: "fancy",
    validator(value: string) {
      return ["fancy", "pulse"].includes(value)
    },
  },
  buttonText: {
    type: String,
    required: true,
  },
  dataTestid: {
    type: String,
    default: "",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
</script>
