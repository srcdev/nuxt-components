<template>
  <div class="colour-scheme-select" :data-size="size" :data-theme="theme">
    <p>Color Scheme select</p>

    <form class="colour-scheme-select-form mbe-20">
      <div class="input-range-markers">
        <div class="marker">
          <LazyIcon name="material-symbols:night-sight-auto-sharp" class="marker-icon" />
        </div>
        <div class="marker">
          <LazyIcon name="radix-icons:sun" class="marker-icon" />
        </div>
        <div class="marker" v>
          <LazyIcon name="radix-icons:moon" class="marker-icon" />
        </div>
      </div>

      <div class="scheme-marker-wrapper">
        <div class="scheme-marker-indicator"></div>
      </div>

      <div class="form-elements">
        <div class="form-input">
          <input type="radio" id="auto" name="colour-scheme" v-model="colourScheme" value="auto" />
          <label for="auto" class="sr-only">Auto</label>
        </div>
        <div class="form-input">
          <input type="radio" id="light" name="colour-scheme" v-model="colourScheme" value="light" />
          <label for="light" class="sr-only">Light</label>
        </div>
        <div class="form-input">
          <input type="radio" id="dark" name="colour-scheme" v-model="colourScheme" value="dark" />
          <label for="dark" class="sr-only">Dark</label>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import propValidators from "../../forms/c12/prop-validators"

defineProps({
  name: {
    type: String,
    defaul: useId(),
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const colourScheme = ref<"auto" | "dark" | "light">("auto")

useColourScheme(colourScheme)
</script>

<style lang="css">
.colour-scheme-select {
  --_outline-width: 0.1rem;
  --_border-width: 0.1rem;
  --_border-radius: 50%;
  --_background-color: var(--theme-form-checkbox-bg);
  --_box-shadow: none;

  --_icon-size: var(--form-input-checkbox-radio-button-size);

  --_background-color: var(--theme-form-radio-bg);
  --_border-color: var(--theme-form-radio-border);
  --_border-radius: 50%;
  --_outline-color: var(--theme-form-radio-outline);

  --_form-padding: 0.5rem;
  --_form-input-outline-width: 0.2rem;

  --_scheme-marker-position: start;

  .colour-scheme-select-form {
    display: grid;
    grid-template-areas: "element-stack";
    align-items: center;

    background-color: var(--theme-form-radio-bg);
    border: var(--_border-width) solid var(--_border-color);

    border-radius: calc(
      (var(--_icon-size) / 2) + var(--_form-padding) + var(--_border-width) + var(--_outline-width) +
        var(--_form-input-outline-width)
    );

    outline: var(--_outline-width) solid var(--_outline-color);
    box-shadow: var(--_box-shadow);

    /* height: calc(var(--_icon-size) + 4px); */
    width: calc((var(--_icon-size) * 3) + (var(--_form-padding) * 17));

    transition: all 0.2s ease-in-out;

    .input-range-markers {
      grid-area: element-stack;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: var(--_form-padding);

      .marker {
        background-color: black;
        padding: var(--_form-padding);
        border-radius: 50%;
        overflow: hidden;
        /* outline: 1px solid gray; */

        &:hover {
          cursor: pointer;
        }

        .marker-icon {
          /* font-size: 2rem; */
          display: block;
          color: white;
          height: var(--_icon-size);
          width: var(--_icon-size);
        }
      }
    }

    .scheme-marker-wrapper {
      grid-area: element-stack;
      display: grid;
      gap: 1rem;

      grid-template-columns: repeat(3, 1fr);
      /* transition: grid-template-columns 0.2s; */
      /* text-align: var(--_scheme-marker-position); */
      padding: var(--_form-padding);
      /* z-index: 9; */

      .scheme-marker-indicator {
        grid-column: 3;
        aspect-ratio: 1;
        background-color: var(--theme-form-radio-bg);
        background-color: red;
        border-radius: 50%;
        height: calc(var(--_icon-size) + var(--_form-padding));
        /* width: calc(var(--_icon-size) + var(--_form-padding)); */
        padding: var(--_form-padding);
        transition: grid-columns 0.2s;
      }
    }

    .form-elements {
      grid-area: element-stack;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: var(--_form-padding);

      .form-input {
        border-radius: 50%;
        display: flex;
        place-content: center;
        padding: var(--_form-padding);
        outline: var(--_form-input-outline-width) solid gray;
        opacity: 0.75;

        &:has(input[value="auto"]) {
          background-color: green;

          &:has(input[value="auto"]:checked) {
            --_scheme-marker-position: start;
            outline: var(--_form-input-outline-width) solid var(--_border-color);
            opacity: 1;
          }
        }

        &:has(input[value="light"]) {
          background-color: orange;

          &:has(input[value="light"]:checked) {
            --_scheme-marker-position: center;
            outline: var(--_form-input-outline-width) solid var(--_border-color);
            opacity: 1;
          }
        }

        &:has(input[value="dark"]) {
          background-color: black;

          &:has(input[value="dark"]:checked) {
            --_scheme-marker-position: end;
            outline: var(--_form-input-outline-width) solid var(--_border-color);
            opacity: 1;
          }
        }

        input[type="radio"] {
          opacity: 0;
          height: var(--_icon-size);
          width: var(--_icon-size);
          margin: 0;
          padding: 0;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
