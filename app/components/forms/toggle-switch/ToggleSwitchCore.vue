<template>
  <div class="toggle-switch-core" :class="elementClasses" :data-size="size" :data-theme="formTheme">
    <div class="toggle-switch-wrapper" :class="wrapperClasses" :for="inputId" @click="toggleSwitchValue">
      <input
        :id="inputId"
        v-model="modelValue"
        type="checkbox"
        :true-value
        :false-value
        :aria-invalid="fieldHasError"
        :aria-describedby="ariaDescribedbyId"
        :name
        :required
        :checked="isChecked"
      />
      <div class="symbol-wrapper" :class="{ round }">
        <div class="symbol" :class="symbolClasses">
          <div class="symbol-icon icon-on" :class="{ active: isChecked }">
            <slot name="iconOn">
              <Icon name="material-symbols:circle-outline" class="icon" />
            </slot>
          </div>

          <div class="symbol-icon icon-off" :class="{ active: !isChecked }">
            <slot name="iconOff">
              <Icon name="material-symbols:circle-outline" class="icon" />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  required?: boolean;
  fieldHasError?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
  round?: boolean;
  size?: FormSize;
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "primary",
  round: true,
  size: "default",
  ariaDescribedby: "",
});

const slots = useSlots();
const useDefaultIcons = computed(() => !slots.iconOn && !slots.iconOff);

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<string | number | boolean>();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const inputId = computed(() => `toggle-switch-${props.id}`);
const ariaDescribedbyId = computed(() => `${props.id}-description`);

const isChecked = computed(() => {
  return modelValue.value === props.trueValue;
});

// Optimized class computeds to reduce template reactivity
const wrapperClasses = computed(() => ({
  round: props.round,
  "use-default-icons": useDefaultIcons.value,
}));

const symbolClasses = computed(() => ({
  round: props.round,
  checked: isChecked.value,
}));

const toggleSwitchValue = () => {
  modelValue.value = modelValue.value === props.trueValue ? props.falseValue : props.trueValue;
};
</script>

<style lang="css">
.toggle-switch-core {
  .toggle-switch-label {
    display: block;
  }

  .toggle-switch-wrapper {
    display: flex;
    flex-direction: column;

    input {
      height: 0;
      width: 0;
      visibility: hidden;
    }

    .symbol-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: start;
      position: relative;
      transition: background-color var(--theme-form-transition-duration);

      &:hover {
        cursor: pointer;
      }

      .symbol {
        display: inline-grid;
        grid-template-areas: "icon";
        place-content: center;
        position: absolute;
        overflow: hidden;
        left: var(--_switch-padding);

        aspect-ratio: 1/1;

        &.checked {
          left: calc(100% - var(--_symbol-size) - var(--_switch-padding) - (2 * var(--_toggle-symbol-border-width)));
        }

        .symbol-icon {
          display: grid;
          grid-area: icon;
          place-content: center;
          opacity: 0;

          &.active {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
