<template>
  <div
    class="toggle-switch"
    :class="elementClasses"
    :data-theme="formUiTheme"
    :data-checked="isChecked ? '' : null"
    :data-invalid="fieldHasError ? '' : null"
  >
    <div class="toggle-switch-wrapper" @click="toggleFromTrack">
      <input
        :id="inputId"
        v-model="modelValue"
        class="toggle-switch-input"
        type="checkbox"
        role="switch"
        :true-value
        :false-value
        :aria-invalid="fieldHasError ? 'true' : undefined"
        :aria-describedby="ariaDescribedby || undefined"
        :name
        :required
      />
      <div class="toggle-switch-track" aria-hidden="true">
        <div class="toggle-switch-thumb">
          <div class="toggle-switch-icon toggle-switch-icon-on">
            <slot name="iconOn">
              <Icon name="material-symbols:circle-outline" />
            </slot>
          </div>

          <div class="toggle-switch-icon toggle-switch-icon-off">
            <slot name="iconOff">
              <Icon name="material-symbols:circle-outline" />
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
  round?: boolean;
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "default",
  round: true,
  ariaDescribedby: "",
});

const modelValue = defineModel<string | number | boolean>({ required: true });

const formUiTheme = computed(() => (props.fieldHasError ? "error" : props.theme));
const roundedRadiusDefault = computed(() => (props.round ? "100vw" : "0.4rem"));
const inputId = computed(() => `toggle-switch-${props.id}`);
const isChecked = computed(() => modelValue.value === props.trueValue);

// Clicks on the input itself (including a label click or Space) are handled by v-model.
const toggleFromTrack = (event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName === "INPUT") return;
  modelValue.value = isChecked.value ? props.falseValue : props.trueValue;
};

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .toggle-switch {
    .toggle-switch-wrapper {
      --_border-radius: var(--toggle-switch-border-radius, v-bind(roundedRadiusDefault));

      display: flex;
      flex-direction: column;

      .toggle-switch-input {
        height: 0;
        width: 0;
        opacity: 0;

        &:focus-visible + .toggle-switch-track {
          outline: var(--form-element-outline-width-focus) solid var(--toggle-switch-border-focus, var(--theme-border-focus));
          outline-offset: var(--form-element-outline-offset-focus);
        }
      }

      .toggle-switch-track {
        /* Track width scales with the thumb: 2 thumbs plus every border, outline, padding and margin around them. */
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
          outline-offset var(--theme-form-transition-duration) linear;

        background-color: var(--toggle-switch-surface, var(--theme-checkbox-symbol-surface));
        border: var(--form-element-border-width) solid var(--toggle-switch-border, var(--theme-border));
        outline: var(--form-element-outline-width) solid transparent;
        box-shadow: 0 0 0 var(--form-element-shadow-width) var(--toggle-switch-shadow, var(--form-element-shadow-colour, var(--colour-theme-2)));
        border-radius: var(--_border-radius);
        width: var(--_track-width);
        padding: calc(var(--input-toggle-wrapper-padding) + var(--input-toggle-symbol-outline-width));

        &:hover {
          background-color: var(--toggle-switch-surface-hover, var(--theme-surface-subtle));
          outline-color: var(--toggle-switch-border-hover, var(--toggle-switch-border, var(--theme-border)));
          cursor: pointer;
        }

        .toggle-switch-thumb {
          display: inline-grid;
          grid-template-areas: "icon";
          place-content: center;
          overflow: hidden;
          translate: 0 0;
          aspect-ratio: 1/1;

          border: var(--input-toggle-symbol-border-width) solid var(--toggle-switch-symbol-border, var(--theme-text));
          outline: var(--input-toggle-symbol-outline-width) solid transparent;
          border-radius: var(--_border-radius);
          background-color: var(--toggle-switch-symbol-surface-off, var(--theme-on-surface));
          transition:
            translate 0.4s ease,
            background-color 0.4s linear;

          @media (prefers-reduced-motion: reduce) {
            transition: none;
          }

          .toggle-switch[data-checked] & {
            background-color: var(--toggle-switch-symbol-surface-on, var(--theme-surface));
            translate: calc(
                var(--input-toggle-symbol-size) + var(--input-toggle-symbol-border-width) +
                  var(--input-toggle-symbol-outline-width)
              )
              0;
          }

          .toggle-switch-icon {
            display: grid;
            grid-area: icon;
            place-content: center;
            /* Removes line-box leading so slotted icon content sizes to its own intrinsic height. */
            line-height: 0;
            opacity: 0;

            width: var(--input-toggle-symbol-size);
            height: var(--input-toggle-symbol-size);
            margin: var(--input-toggle-symbol-margin);
            transition:
              opacity var(--theme-form-transition-duration),
              color var(--theme-form-transition-duration);

            &.toggle-switch-icon-on {
              color: var(--toggle-switch-icon-on-color, var(--theme-on-surface));

              .toggle-switch[data-checked] & {
                opacity: 1;
              }
            }

            &.toggle-switch-icon-off {
              color: var(--toggle-switch-icon-off-color, var(--theme-surface));
              opacity: 1;

              .toggle-switch[data-checked] & {
                opacity: 0;
              }
            }
          }
        }
      }
    }

  }
}
</style>
