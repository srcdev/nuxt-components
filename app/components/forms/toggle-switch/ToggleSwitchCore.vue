<template>
  <div class="toggle-switch-core" :class="elementClasses" :data-size="size" :data-theme="theme">
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
      <div class="symbol-wrapper">
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
import type { FormUiTheme, FormSize } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  required?: boolean;
  fieldHasError?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  size?: FormSize;
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "default",
  size: "default",
  ariaDescribedby: "",
});

const slots = useSlots();
const useDefaultIcons = computed(() => !slots.iconOn && !slots.iconOff);

const FormUiTheme = computed(() => {
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
  "use-default-icons": useDefaultIcons.value,
}));

const symbolClasses = computed(() => ({
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
    --_icon-on-opacity: 0;
    --_icon-off-opacity: 1;
    --_icon-font-size: 2.4rem;
    --_symbol-background-color: var(--blue-12);
    --_symbol-margin-inline-start: 0;
    --_symbol-checked-offset: calc(var(--input-toggle-symbol-size) * 0.75);

    /* New vars */
    --_switch-padding: 0.2rem;
    --_toggle-symbol-border-width: 0.1rem;

    display: flex;
    flex-direction: column;

    input {
      height: 0;
      width: 0;
      visibility: hidden;
    }

    .symbol-wrapper {
      /* Geometry */
      display: inline-flex;
      align-items: center;
      justify-content: start;
      position: relative;
      transition: background-color var(--theme-form-transition-duration);

      /* UI */
      background-color: white;
      border: var(--form-element-border-width) solid var(--theme-input-border);
      outline: var(--form-element-outline-width) solid var(--theme-input-outline);
      border-radius: 100vw;
      /* width: calc(var(--input-toggle-symbol-size) * 2); */
      width: 72px;
      /* height: calc(
        var(--input-toggle-symbol-size) + calc(var(--_toggle-symbol-border-width) * 5) + calc(var(--_switch-padding) * 2)
      ); */
      padding: calc(var(--input-toggle-wrapper-padding) + var(--input-toggle-symbol-outline-width));

      &:hover {
        background-color: var(--theme-toggle-wrapper-surface-color-hover);
        cursor: pointer;
      }

      /* &.active {
        justify-content: end;
      } */

      .symbol {
        /* Geometry */

        display: inline-grid;
        grid-template-areas: "icon";
        place-content: center;
        /* position: absolute; */
        overflow: hidden;
        translate: 0 0;

        aspect-ratio: 1/1;

        /* UI */
        /* padding: calc(calc(var(--input-toggle-symbol-size) - var(--_icon-font-size)) / 2); */
        border: var(--input-toggle-symbol-border-width) solid var(--theme-checkbox-symbol-color);
        outline: var(--input-toggle-symbol-outline-width) solid var(--theme-input-outline, red);
        border-radius: 100vw;
        background-color: lightskyblue;
        transition: translate 0.4s ease;

        &.checked {
          /* left: calc(
            100% - var(--input-toggle-symbol-size) - var(--_switch-padding) - (2 * var(--_toggle-symbol-border-width))
          ); */
          /* translate: calc(var(--input-toggle-symbol-size) / 2) 0; */
          /* translate: 1.6rem 0; */
          translate: calc(
              var(--input-toggle-symbol-size) + var(--input-toggle-symbol-border-width) +
                var(--input-toggle-symbol-outline-width)
            )
            0;
        }

        .symbol-icon {
          /* Geometry */

          display: grid;
          grid-area: icon;
          place-content: center;
          opacity: 0;

          /* UI */
          color: var(--theme-toggle-symbol-icon-color);
          width: var(--input-toggle-symbol-size);
          height: var(--input-toggle-symbol-size);
          margin: var(--input-toggle-symbol-margin);
          transition: opacity var(--theme-form-transition-duration);

          &.active {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
