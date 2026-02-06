<template>
  <div class="toggle-switch-with-label-inline" :class="[elementClasses]" :data-theme="theme">
    <InputLabel
      :id
      :for="toggleSwitchId"
      :theme
      :name
      input-variant="normal"
      :style-class-passthrough="['input-switch-label', 'input-text-label', labelWeightClass]"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <ToggleSwitchCore :id v-model="modelValue" :name :true-value :false-value :theme :round :size>
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

interface Props {
  name: string;
  label: string;
  labelWeight?: LabelWeight;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
  round?: boolean;
  size?: FormSize;
}

const props = withDefaults(defineProps<Props>(), {
  labelWeight: "normal",
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "primary",
  round: true,
  size: "default",
});

const slots = useSlots();
const id = useId();

// Performance-optimized computed property to avoid template string interpolation
const toggleSwitchId = computed(() => `toggle-switch-${id}`);

// Optimized labelWeight mapping using object lookup for better performance
const labelWeightClassMap: Record<LabelWeight, string> = {
  bold: "body-normal-bold",
  "semi-bold": "body-normal-semibold",
  normal: "body-normal",
};

const labelWeightClass = computed(() => {
  return labelWeightClassMap[props.labelWeight] || "body-normal-semibold";
});

const modelValue = defineModel<string | number | boolean>();
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
