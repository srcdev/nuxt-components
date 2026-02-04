<template>
  <div
    v-if="slots.descriptionText || slots.descriptionHtml"
    :id="descriptionId"
    class="input-description"
    :class="[elementClasses]"
  >
    <div v-if="slots.descriptionHtml" class="input-description-html">
      <slot name="descriptionHtml"></slot>
    </div>
    <p v-if="slots.descriptionText" class="input-description-text">
      <slot name="descriptionText"></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators";

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
      return propValidators.theme.includes(value);
    },
  },
  inputVariant: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.inputVariant.includes(value);
    },
  },
});

const slots = useSlots();

const descriptionId = `${props.id}-description`;

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>
<style lang="css">
.input-description {
  .input-description-html {
    margin-block: 0.4rem 0.8rem;
  }
  .input-description-text {
    color: var(--form-description-color);
    font-size: var(--step-4);
    margin-block: 0.4rem 0.8rem;
    line-height: var(--step-4);
  }
}
</style>
