<template>
  <div class="toggle-switch-with-label" :class="[elementClasses]" :data-theme="formUiTheme">
    <InputLabel
      :id="toggleSwitchId"
      indicator="none"
      input-variant="normal"
      :field-has-error
      :style-class-passthrough="['input-switch-label', 'input-text-label', 'body-normal-bold']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
      :description-id
      :field-has-error
      :style-class-passthrough="['toggle-switch-description']"
    >
      <template v-if="slots.descriptionHtml" #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template v-if="slots.descriptionText" #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>
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
      :aria-describedby="ariaDescribedby()"
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
import type { FormUiTheme } from "~/types/forms/types.forms";

interface Props {
  name: string;
  label: string;
  required?: boolean;
  errorMessage?: object | string;
  fieldHasError?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  round?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  errorMessage: "",
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "default",
  round: true,
});

const slots = useSlots();

const formUiTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const id = useId();

// Performance-optimized computed properties to avoid template string interpolation
const toggleSwitchId = computed(() => `toggle-switch-${id}`);
const descriptionId = computed(() => `${id}-description`);
const errorId = computed(() => `${id}-error-message`);

// A plain function rather than useAriaDescribedById's computed: slots aren't reactive, so a
// computed would keep its first answer if a description slot is added or removed after mount
// (Claude.md pitfall #25). Lists both ids when there's a description and an error, so the
// description is still announced while the field is invalid.
const ariaDescribedby = () => {
  const ids: string[] = [];
  if (slots.descriptionText || slots.descriptionHtml) ids.push(descriptionId.value);
  if (props.fieldHasError) ids.push(errorId.value);
  return ids.join(" ");
};

const modelValue = defineModel<string | number | boolean>({ required: true });
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
.toggle-switch-with-label {
  .toggle-switch-label {
    display: block;
  }
}
}
</style>
