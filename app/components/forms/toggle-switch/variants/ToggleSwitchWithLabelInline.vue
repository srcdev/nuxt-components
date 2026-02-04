<template>
  <div class="toggle-switch-with-label-inline" :class="[elementClasses]" :data-theme="theme">
    <InputLabel
      :for="`toggle-sitch-${id}`"
      :id
      :theme
      :name
      input-variant="normal"
      :style-class-passthrough="['input-switch-label', 'input-text-label', labelWeightClass]"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <ToggleSwitchCore v-model="modelValue" :id :name :true-value :false-value :theme :round :size>
      <template v-if="slots.iconOn" #iconOn>
        <slot name="iconOn"></slot>
      </template>

      <template v-if="slots.iconOff" #iconOff>
        <slot name="iconOff"></slot>
      </template>
    </ToggleSwitchCore>
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, LabelWeight } from "~/types/forms/types.forms";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  labelWeight: {
    type: String as PropType<LabelWeight>,
    default: "normal",
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
    type: String as PropType<FormTheme>,
    default: "primary",
  },
  round: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<FormSize>,
    default: "default",
  },
});

const slots = useSlots();
const id = useId();

const labelWeightClass = computed(() => {
  switch (props.labelWeight) {
    case "bold":
      return "body-normal-bold";
    case "semi-bold":
      return "body-normal-semibold";
    case "normal":
      return "body-normal";
    default:
      return "body-normal-semibold";
  }
});

const modelValue = defineModel();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.toggle-switch-with-label-inline {
  --_transition-duration: 0.4s;
  display: flex;
  align-items: center;
  gap: 12px;

  .toggle-switch-label {
    display: block;
    white-space: nowrap;
  }
}
</style>
