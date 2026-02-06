<template>
  <div class="toggle-switch-with-label" :class="[elementClasses]" :data-theme="formTheme">
    <InputLabel
      :id
      :for="toggleSwitchId"
      :theme
      :name
      input-variant="normal"
      :field-has-error
      :style-class-passthrough="['input-switch-label', 'input-text-label', 'body-normal-bold']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <div v-if="slots.description" :id="descriptionId">
      <slot name="description"></slot>
    </div>
    <ToggleSwitchCore
      :id
      v-model="modelValue"
      :name
      :required
      :field-has-error
      :true-value
      :false-value
      :theme
      :round
      :size
      :aria-describedby
    >
      <template v-if="slots.iconOn" #iconOn>
        <slot name="iconOn"></slot>
      </template>

      <template v-if="slots.iconOff" #iconOff>
        <slot name="iconOff"></slot>
      </template>
    </ToggleSwitchCore>
    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" />
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize } from "~/types/forms/types.forms";

interface Props {
  name: string;
  label: string;
  required?: boolean;
  errorMessage?: object | string;
  fieldHasError?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
  round?: boolean;
  size?: FormSize;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  errorMessage: "",
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "primary",
  round: true,
  size: "default",
});

const slots = useSlots();

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const id = useId();

// Performance-optimized computed properties to avoid template string interpolation
const toggleSwitchId = computed(() => `toggle-switch-${id}`);
const descriptionId = computed(() => `${id}-description`);
const errorId = computed(() => `${id}-error-message`);

const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? descriptionId.value : undefined;
  return props.fieldHasError ? errorId.value : ariaDescribedbyId;
});

const modelValue = defineModel<string | number | boolean>();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.toggle-switch-with-label {
  --_transition-duration: 0.4s;

  .toggle-switch-label {
    display: block;
  }
}
</style>
