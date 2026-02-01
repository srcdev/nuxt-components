<template>
  <label :for="id" class="input-label" :class="[elementClasses, inputVariant]">
    <slot v-if="slots.htmlLabel" name="htmlLabel"></slot>
    <slot v-if="slots.textLabel" name="textLabel"></slot>
  </label>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fieldHasError: {
    type: Boolean,
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
  inputVariant: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.inputVariant.includes(value)
    },
  },
})

const slots = useSlots()

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.input-label {
  touch-action: manipulation;
  color: var(--form-label-color);
  margin-block: 0.8rem;
  font-size: var(--step-5);
  font-weight: normal;
  line-height: 1.5;
  display: block;

  &.normal {
    color: var(--form-label-color);
    margin-block: 0.8rem;
    font-size: var(--step-5);
    font-weight: normal;
    line-height: 1.5;
    display: block;
  }

  &.underlined {
    color: var(--form-label-color);
    margin-block: 0.8rem;
    font-size: var(--step-5);
    font-weight: normal;
    line-height: 1.5;
    display: block;
  }

  & + .input-description {
    margin-block-end: 0.2rem;
  }
}
</style>
