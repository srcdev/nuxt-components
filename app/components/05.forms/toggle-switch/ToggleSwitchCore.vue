<template>
  <div class="toggle-switch-core" :class="elementClasses" :data-theme="theme">
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
import type { FormUiTheme } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  required?: boolean;
  fieldHasError?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "default",
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
@layer components {
.toggle-switch-core {
  .toggle-switch-label {
    display: block;
  }

  .toggle-switch-wrapper {
    /* --_icon-font-size, --_switch-padding, --_toggle-symbol-border-width are the only locals
       actually read anywhere below — --_icon-on-opacity, --_icon-off-opacity,
       --_symbol-background-color, --_symbol-margin-inline-start, --_symbol-checked-offset were
       declared here but never referenced by any property in this file; removed as dead code
       rather than migrated, since migrating an unread token would just create a new unread
       public one. */
    --_icon-font-size: 2.4rem;
    --_switch-padding: 0.2rem;
    --_toggle-symbol-border-width: 0.1rem;

    /* Public --toggle-switch-* tokens, inline-fallback to the shared --theme-* tokens (see
       theming-component-token-pattern.md) — overriding one here doesn't touch every other
       themed input/control that also reads --theme-checkbox-symbol-surface/--theme-border. */
    --_surface: var(--toggle-switch-surface, var(--theme-checkbox-symbol-surface));
    --_surface-hover: var(--toggle-switch-surface-hover, var(--theme-surface-subtle));
    --_border: var(--toggle-switch-border, var(--theme-border));
    --_border-focus: var(--toggle-switch-border-focus, var(--theme-border-focus));

    display: flex;
    flex-direction: column;

    input {
      height: 0;
      width: 0;
      opacity: 0;

      &:focus-visible {
        + .symbol-wrapper {
          outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
          outline-offset: var(--form-element-outline-offset-focus);
        }
      }
    }

    .symbol-wrapper {
      /* Geometry */

      /* Track width has no direct public token — it's derived from the same geometry tokens
         that size the thumb, so the track always scales with --input-toggle-symbol-size instead
         of clipping/floating it. Breakdown at the default 0.1rem tokens (= 72px total):
         2×symbol-size (6rem) + 2×form-element-border-width (0.2rem, wrapper border) +
         2×wrapper-padding (0.2rem) + 3×symbol-outline-width (0.3rem) +
         3×symbol-border-width (0.3rem) + 2×symbol-margin (0.2rem). Override
         --toggle-switch-track-width directly if you need a value the formula doesn't produce. */
      --_track-width: var(
        --toggle-switch-track-width,
        calc(
          (2 * var(--input-toggle-symbol-size)) + (2 * var(--form-element-border-width)) +
            (2 * var(--input-toggle-wrapper-padding)) + (3 * var(--input-toggle-symbol-outline-width)) +
            (3 * var(--input-toggle-symbol-border-width)) + (2 * var(--input-toggle-symbol-margin))
        )
      );

      display: inline-flex;
      align-items: center;
      justify-content: start;
      position: relative;
      transition:
        background-color var(--theme-form-transition-duration) linear,
        border-color var(--theme-form-transition-duration) linear,
        outline var(--theme-form-transition-duration) linear,
        outline-offset var(--theme-form-transition-duration) linear,
        outline var(--theme-form-transition-duration) linear;

      /* UI */
      background-color: var(--_surface);
      border: var(--form-element-border-width) solid var(--_border);
      outline: var(--form-element-outline-width) solid transparent;
      border-radius: 100vw;
      width: var(--_track-width);
      padding: calc(var(--input-toggle-wrapper-padding) + var(--input-toggle-symbol-outline-width));

      &:hover {
        background-color: var(--_surface-hover);
        cursor: pointer;
      }

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
        border: var(--input-toggle-symbol-border-width) solid var(--toggle-switch-symbol-border, var(--theme-text));
        outline: var(--input-toggle-symbol-outline-width) solid transparent;
        border-radius: 100vw;
        background-color: var(--toggle-switch-symbol-surface-off, var(--theme-on-surface));
        transition:
          translate 0.4s ease,
          background-color 0.4s linear;

        &.checked {
          background-color: var(--toggle-switch-symbol-surface-on, var(--theme-surface));
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
          width: var(--input-toggle-symbol-size);
          height: var(--input-toggle-symbol-size);
          margin: var(--input-toggle-symbol-margin);
          transition:
            opacity var(--theme-form-transition-duration),
            color var(--theme-form-transition-duration);

          &.icon-on {
            color: var(--toggle-switch-icon-on-color, var(--theme-on-surface));
          }

          &.icon-off {
            color: var(--toggle-switch-icon-off-color, var(--theme-surface));
          }

          &.active {
            opacity: 1;
          }
        }
      }
    }
  }
}
}
</style>
