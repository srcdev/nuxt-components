<template>
  <div class="input-range-wrapper" :data-theme="formTheme">
    <div v-if="slots.left" class="slot left">
      <slot name="left"></slot>
    </div>

    <div class="input-range-container">
      <slot v-if="slots.markers" name="markers"></slot>

      <input
        type="range"
        :id
        :name
        :required
        :min
        :max
        :step
        :list="slots.datalist ? name + '-datalist' : ''"
        :class="[
          'input-range-core',
          `input-range--${size}`,
          `input-range--${weight}`,
          styleClassPassthrough,
          { 'has-markers': slots.markers },
        ]"
        v-model="modelValue"
        ref="inputRange"
      />

      <slot v-if="slots.datalist" name="datalist"></slot>
    </div>
    <div v-if="slots.right" class="slot right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, FormWeight } from "~/types/forms/types.forms";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<FormTheme>,
    default: "primary",
  },
  size: {
    type: String as PropType<FormSize>,
    default: "default",
  },
  weight: {
    type: String as PropType<FormWeight>,
    default: "normal",
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});

const slots = useSlots();

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<number | readonly number[]>();

// @input="changeBackgroundColor"
const changeBackgroundColor = () => {
  console.log("changeBackgroundColor()");
  const inputRange = ref<HTMLInputElement | null>(null);
  if (inputRange.value !== null) {
    inputRange.value.style.accentColor = "hsl(" + modelValue.value + ", 100%, 50%)";
  }
};
</script>

<style lang="css">
.input-range-wrapper {
  --_gutter: 1.2rem;
  --_border-width: var(--form-element-border-width);
  --_outline-width: var(--form-element-outline-width);

  --_input-range-height: 2.4rem;
  --_slot-translate-y: calc(var(--_input-range-height) / 4);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .slot {
    align-self: flex-start;
    transform: translateY(-4px);
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
        background-color: black;
        padding: 0.5rem;
        border-radius: 50%;
        overflow: hidden;
        outline: 1px solid gray;

        &:hover {
          cursor: pointer;
        }

        .marker-icon {
          font-size: 2rem;
          display: block;
          color: var(--theme-form-range-accent-color);
        }
      }
    }

    .input-range-core {
      grid-area: element-stack;

      accent-color: var(--theme-form-range-accent-color);
      height: var(--_input-range-height);
      margin: 0;
      width: 100%;

      /*
      &:hover {
        cursor: -webkit-grab;
        outline-color: red;
      }
      &:active {
        cursor: -webkit-grabbing;
        outline-color: blue;
      }
      &:focus-visible {
        outline-offset: 0.25rem;
        outline-color: transparent;
      }
      */

      &::-webkit-slider-thumb {
        /* appearance: none; */
        /* -webkit-appearance: none; */
        accent-color: blue;
        color: blue;
        background-color: 0.1rem solid green;
        outline: 0.1rem solid blue;
        border-radius: 50%;
      }

      &::-webkit-slider-runnable-track {
        appearance: none;
        -webkit-appearance: none;
        /* background: hsl(10 80% 50% / 0.5); */
        /* box-shadow: 0.1rem 0.1rem 0.1rem #fff, 0rem 0rem 0.1rem #fff; */
      }

      /* For Chrome, Safari, Opera, and Edge */
      /* &::-webkit-slider-runnable-track {
        background: var(--theme-form-range-accent-color);
        height: var(--_input-range-height);
      } */

      /* For Firefox */
      /* &::-moz-range-track {
        background: var(--theme-form-range-accent-color);
        height: var(--_input-range-height);
      } */

      /* Stling the thumb */
      /* &::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: #5cd5eb;
        height: 2rem;
        width: 1rem;
        border-radius: 1rem;
      } */

      /* For Firefox */
      /* &::-moz-range-thumb {
        background: #5cd5eb;
        height: 2rem;
        width: 1rem;
        border-radius: 1rem;
        border: none;
      } */

      &:focus-visible {
        box-shadow: var(--form-focus-box-shadow);
      }

      &.has-markers {
        accent-color: var(--theme-form-range-accent-color);
        height: 2px;
        z-index: 2;
        translate: 0 13px;

        &::-webkit-slider-thumb {
          /* display: none; */
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
      font-size: 1.4rem;
      font-weight: 500;
      justify-content: space-between;
      writing-mode: vertical-lr;
      width: 100%;
      option {
        padding: 0;
      }
    }
  }
}
</style>
