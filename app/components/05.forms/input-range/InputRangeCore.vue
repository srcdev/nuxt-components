<template>
  <div class="input-range-wrapper" :data-theme="theme">
    <div v-if="slots.left" class="slot left">
      <slot name="left"></slot>
    </div>

    <div class="input-range-container">
      <slot v-if="slots.markers" name="markers"></slot>

      <input
        :id
        ref="inputRange"
        v-model="modelValue"
        type="range"
        :name
        :required
        :min
        :max
        :step
        :list="slots.datalist ? name + '-datalist' : ''"
        :class="['input-range-core', `input-range--${weight}`, styleClassPassthrough, { 'has-markers': slots.markers }]"
        :aria-describedby
      />

      <slot v-if="slots.datalist" name="datalist"></slot>
    </div>
    <div v-if="slots.right" class="slot right">
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

withDefaults(defineProps<Props>(), {
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
</script>

<style lang="css">
@layer components {
  .input-range-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .slot {
      align-self: flex-start;

      .input-button-core {
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

      display: grid;
      grid-template-areas: "element-stack";

      .input-range-markers {
        grid-area: element-stack;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        z-index: 2;

        .marker {
          background-color: var(--input-range-marker-background-colour, hsl(0, 29%, 3%));
          padding: var(--input-range-marker-padding, 0.5rem);
          border-radius: var(--input-range-marker-border-radius, 50%);
          overflow: hidden;
          outline: var(--input-range-marker-outline-width, 0.1rem) solid
            var(--input-range-marker-outline-colour, var(--slate-04));

          &:hover {
            cursor: pointer;
          }

          .marker-icon {
            font-size: var(--input-range-marker-icon-size, 2rem);
            display: block;
            color: var(--input-range-marker-icon-colour, var(--input-range-accent-colour, var(--theme-accent)));
          }
        }
      }

      .input-range-core {
        grid-area: element-stack;

        accent-color: var(--input-range-accent-colour, var(--theme-accent));
        height: var(--input-range-button-size);
        margin: 0;
        width: 100%;

        &:focus-visible {
          box-shadow: var(--form-focus-box-shadow);
        }

        &.has-markers {
          accent-color: var(--input-range-accent-colour, var(--theme-accent));
          height: 0.2rem;
          z-index: 2;
          translate: 0 1.3rem;

          &::-webkit-slider-thumb {
            opacity: 0;
            &:hover {
              cursor: pointer;
            }
          }
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
  }
}
</style>
