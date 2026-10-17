<template>
  <div
    class="segmented-control"
    :class="elementClasses"
    :data-theme="theme"
    :data-has-selection="hasSelection ? '' : undefined"
  >
    <div class="segmented-control-wrapper">
      <div class="segmented-control-marker-layer" aria-hidden="true">
        <div class="segmented-control-marker"></div>
      </div>
      <div class="segmented-control-options" role="radiogroup" :aria-label="ariaLabel || undefined">
        <label
          v-for="(option, index) in options"
          :key="option.id ?? index"
          :for="`${uid}-${index}`"
          class="segmented-control-option"
          :data-value="option.value"
          :data-checked="modelValue === option.value ? '' : undefined"
        >
          <span class="sr-only">{{ option.label }}</span>
          <Icon v-if="option.icon" :name="option.icon" class="segmented-control-option-icon" aria-hidden="true" />
          <input
            :id="`${uid}-${index}`"
            v-model="modelValue"
            type="radio"
            :name="groupName"
            class="segmented-control-option-input"
            :value="option.value"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, IFormMultipleOptions } from "~/types/forms/types.forms";

interface Props {
  name?: string;
  ariaLabel?: string;
  theme?: FormUiTheme;
  stepAnimationDuration?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  ariaLabel: "",
  theme: "default",
  stepAnimationDuration: "250ms",
  styleClassPassthrough: () => [],
});

const modelValue = defineModel<string | number | boolean>({ required: true });
const fieldData = defineModel<IFormMultipleOptions>("fieldData", { required: true });

const uid = useId();
const groupName = computed(() => props.name || `segmented-control-${uid}`);

const options = computed(() => fieldData.value?.data ?? []);
const optionCount = computed(() => Math.max(1, options.value.length));
const selectedOptionIndex = computed(() => options.value.findIndex((option) => option.value === modelValue.value));
const hasSelection = computed(() => selectedOptionIndex.value >= 0);
const markerIndex = computed(() => Math.max(0, selectedOptionIndex.value));

const { stepAnimationDuration } = toRefs(props);

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
  .segmented-control {
    --_form-items-gap: var(--segmented-control-gap, 1rem);
    --_select-scheme-group-background-color: var(--segmented-control-marker-surface, var(--theme-surface));
    --_select-scheme-group-background-image: none;
    --_scheme-icon-font-size: var(--segmented-control-icon-size, 2rem);

    &:has(input[value="system"]:checked) {
      --_select-scheme-group-background-color: transparent;
      --_select-scheme-group-background-image: var(
        --segmented-control-marker-gradient-system,
        radial-gradient(circle, rgb(66, 180, 58) 0%, rgb(17, 199, 0) 27%, rgb(8, 117, 3) 100%)
      );
    }

    &:has(input[value="light"]:checked) {
      --_select-scheme-group-background-color: transparent;
      --_select-scheme-group-background-image: var(
        --segmented-control-marker-gradient-light,
        radial-gradient(circle, rgba(180, 58, 91, 1) 0%, rgba(253, 29, 29, 1) 27%, rgba(252, 176, 69, 1) 100%)
      );
    }

    &:has(input[value="dark"]:checked) {
      --_select-scheme-group-background-color: transparent;
      --_select-scheme-group-background-image: var(
        --segmented-control-marker-gradient-dark,
        radial-gradient(circle, rgb(50, 20, 25) 0%, rgb(0, 0, 0) 27%, rgb(100, 100, 100) 100%)
      );
    }

    .segmented-control-wrapper {
      display: inline-grid;
      grid-template-areas: "select-stack";
      width: fit-content;
      max-inline-size: 100%;

      background-color: var(--segmented-control-surface, var(--theme-input-surface));
      border: var(--form-element-border-width) solid var(--segmented-control-border, var(--theme-border));
      outline: var(--form-element-outline-width) solid transparent;
      box-shadow: 0 0 0 var(--form-element-shadow-width)
        var(--segmented-control-shadow, var(--form-element-shadow-colour, var(--colour-theme-2)));
      border-radius: 100vw;
      padding: var(--segmented-control-padding, 0.6rem);

      transition: all var(--theme-form-transition-duration) ease-in-out;

      &:hover {
        outline-color: var(--segmented-control-border-hover, var(--segmented-control-border, var(--theme-border)));
      }

      &:has(input:focus-visible) {
        outline: var(--form-element-outline-width) solid var(--segmented-control-ring-focus, var(--theme-ring));
        outline-offset: 0.2rem;
      }

      & .segmented-control-marker-layer,
      & .segmented-control-options {
        grid-area: select-stack;
        display: grid;
        grid-template-columns: repeat(v-bind(optionCount), minmax(0, 1fr));
        gap: var(--_form-items-gap);
      }

      & .segmented-control-marker-layer {
        z-index: 1;

        .segmented-control-marker {
          grid-column: 1;
          position: relative;
          inset-inline-start: calc(v-bind(markerIndex) * (100% + var(--_form-items-gap)));
          transition: inset-inline-start v-bind(stepAnimationDuration) ease-in-out;
          background-color: var(--_select-scheme-group-background-color);
          background-image: var(--_select-scheme-group-background-image);
          border: var(--form-element-border-width) solid var(--segmented-control-marker-border, var(--theme-text));
          border-radius: 50%;
          opacity: 0;

          @media (prefers-reduced-motion: reduce) {
            transition: none;
          }
        }
      }

      & .segmented-control-options {
        z-index: 2;
        align-items: center;

        .segmented-control-option {
          display: grid;
          grid-template-areas: "icon-stack";
          place-items: center;
          min-inline-size: 0;
          background: transparent;
          border: var(--form-element-border-width) solid var(--segmented-control-option-border, #00000025);
          outline: var(--form-element-outline-width) solid transparent;
          border-radius: 50%;
          padding: var(--segmented-control-option-padding, 0.5rem);
          overflow: hidden;
          cursor: pointer;

          transition: all calc(var(--theme-form-transition-duration) / 3);

          &:hover {
            outline-color: var(--segmented-control-option-border-hover, var(--theme-text));
          }

          &:has(input:focus-visible) {
            outline: var(--form-element-outline-width) solid
              var(--segmented-control-option-ring-focus, var(--theme-ring));
            outline-offset: 0.2rem;
          }

          .segmented-control-option-icon {
            grid-area: icon-stack;
            display: block;
            font-size: var(--_scheme-icon-font-size);
            width: 1em;
            height: 1em;
            color: var(--segmented-control-option-icon-color, var(--theme-text));
            transition: color calc(v-bind(stepAnimationDuration) / 2) ease-in-out;

            @media (prefers-reduced-motion: reduce) {
              transition: none;
            }
          }

          &[data-checked] .segmented-control-option-icon {
            color: var(--segmented-control-option-icon-color-active, var(--theme-on-surface));
            transition-delay: calc(v-bind(stepAnimationDuration) / 2);
          }

          .segmented-control-option-input {
            grid-area: icon-stack;
            appearance: none;
            margin: 0;
            opacity: 0;
            width: var(--_scheme-icon-font-size);
            height: var(--_scheme-icon-font-size);
            cursor: pointer;
          }
        }
      }
    }

    &[data-has-selection] .segmented-control-wrapper .segmented-control-marker {
      opacity: 1;
    }
  }
}
</style>
