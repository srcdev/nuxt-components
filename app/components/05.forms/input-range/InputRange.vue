<template>
  <div
    class="input-range-wrapper"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : undefined"
    :data-has-markers="slots.markers ? '' : undefined"
  >
    <div v-if="slots.left" class="input-range-slot input-range-slot-left">
      <slot name="left"></slot>
    </div>

    <div class="input-range-container">
      <slot v-if="slots.markers" name="markers"></slot>

      <input
        :id
        v-model="modelValue"
        type="range"
        :name
        :required
        :min
        :max
        :step
        :list="slots.datalist ? datalistId : undefined"
        :class="['input-range', `input-range--${weight}`, elementClasses]"
        :aria-describedby
        :aria-invalid="fieldHasError ? 'true' : undefined"
      />

      <slot v-if="slots.datalist" name="datalist" :datalist-id="datalistId"></slot>
    </div>
    <div v-if="slots.right" class="input-range-slot input-range-slot-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, FormWeight } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  theme?: FormUiTheme;
  weight?: FormWeight;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  required: false,
  theme: "default",
  weight: "normal",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  ariaDescribedby: "",
});

const slots = useSlots();

const modelValue = defineModel<number>({
  required: true,
});

const datalistId = useId();

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
  .input-range-wrapper {
    --_input-range-marker-size: calc(
      var(--input-range-marker-icon-size, 2rem) + 2 * var(--input-range-marker-padding, 0.5rem)
    );

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .input-range-slot {
      align-self: flex-start;
      flex-shrink: 0;

      .input-button {
        border-radius: var(--form-input-border-radius);
        width: var(--input-range-button-size);
        height: var(--input-range-button-size);

        .btn-icon {
          margin: initial;
        }
      }
    }

    .input-range-container {
      flex-grow: 1;
      min-inline-size: 0;

      display: grid;
      grid-template-areas: "element-stack";

      .input-range-markers {
        grid-area: element-stack;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .input-range-marker {
          box-sizing: border-box;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          inline-size: var(--_input-range-marker-size);
          block-size: var(--_input-range-marker-size);
          background-color: var(--input-range-marker-background-colour, var(--theme-input-surface));
          border-radius: var(--input-range-marker-border-radius, 50%);
          overflow: hidden;
          outline: var(--input-range-marker-outline-width, 0.1rem) solid
            var(--input-range-marker-outline-colour, var(--theme-border));

          .input-range-marker-icon {
            font-size: var(--input-range-marker-icon-size, 2rem);
            line-height: 1;
            display: block;
            color: var(--input-range-marker-icon-colour, var(--input-range-accent-colour, var(--theme-accent)));
          }
        }
      }

      .input-range {
        grid-area: element-stack;

        accent-color: var(--input-range-accent-colour, var(--theme-accent));
        height: var(--input-range-button-size);
        margin: 0;
        width: 100%;

        &:focus-visible {
          box-shadow: var(--form-focus-box-shadow);
        }
      }

      .input-range-datalist {
        display: flex;
        flex-direction: column;
        font-family: var(--font-family);
        font-size: var(--input-range-datalist-font-size, 1.4rem);
        font-weight: var(--input-range-datalist-font-weight, 500);
        justify-content: space-between;
        writing-mode: vertical-lr;
        width: 100%;

        option {
          padding: 0;
        }
      }
    }

    &[data-has-markers] {
      .input-range-container::before {
        content: "";
        grid-area: element-stack;
        align-self: center;
        z-index: 1;
        height: var(--input-range-marker-track-width, 0.2rem);
        margin-inline: calc(var(--_input-range-marker-size) / 2);
        background-color: var(--input-range-marker-track-colour, var(--theme-border));
      }

      .input-range-markers {
        z-index: 2;
      }

      .input-range {
        -webkit-appearance: none;
        appearance: none;
        align-self: center;
        z-index: 3;
        height: var(--_input-range-marker-size);
        background: transparent;
        cursor: pointer;

        &:focus-visible {
          box-shadow: none;

          &::-webkit-slider-thumb {
            box-shadow: var(--form-focus-box-shadow);
          }

          &::-moz-range-thumb {
            box-shadow: var(--form-focus-box-shadow);
          }
        }

        &::-webkit-slider-runnable-track {
          height: var(--_input-range-marker-size);
          background: transparent;
        }

        &::-moz-range-track {
          background: transparent;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          box-sizing: border-box;
          width: var(--_input-range-marker-size);
          height: var(--_input-range-marker-size);
          border: var(--input-range-marker-selected-width, 0.3rem) solid
            var(--input-range-marker-selected-colour, var(--input-range-accent-colour, var(--theme-accent)));
          border-radius: var(--input-range-marker-border-radius, 50%);
          background: transparent;
        }

        &::-moz-range-thumb {
          box-sizing: border-box;
          width: var(--_input-range-marker-size);
          height: var(--_input-range-marker-size);
          border: var(--input-range-marker-selected-width, 0.3rem) solid
            var(--input-range-marker-selected-colour, var(--input-range-accent-colour, var(--theme-accent)));
          border-radius: var(--input-range-marker-border-radius, 50%);
          background: transparent;
        }
      }
    }
  }
}
</style>
