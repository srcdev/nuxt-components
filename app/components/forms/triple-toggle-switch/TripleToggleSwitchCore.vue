<template>
  <div class="triple-toggle-switch" :class="[elementClasses]" :data-size="size" :data-theme="theme">
    <div class="triple-toggle-switch-wrapper">
      <div class="selected-option-marker-wrapper">
        <div class="selected-option-marker" :class="[{ show: showMarker }]"></div>
      </div>
      <div class="option-group-wrapper">
        <label
          v-for="option in fieldData.data"
          :key="option.id"
          ref="optionGroup"
          :for="option.id"
          class="option-group"
        >
          <span class="sr-only">{{ option.label }}</span>
          <Icon
            v-if="option.icon"
            ref="optionIcons"
            :name="option.icon"
            class="option-icon"
            :class="[option.id, { active: modelValue === option.value }]"
          />
          <input
            :id="option.id"
            v-model="modelValue"
            type="radio"
            :name="props.name"
            class="option-input"
            :value="option.value"
            :aria-selected="modelValue === option.value"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, IFormMultipleOptions } from "~/types/forms/types.forms";

const props = defineProps({
  name: {
    type: String,
    default: "triple-toggle-switch",
  },
  size: {
    type: String as PropType<FormSize>,
    default: "medium",
  },
  theme: {
    type: String as PropType<FormTheme>,
    default: "primary",
  },
  stepAnimationDuration: {
    type: String as PropType<string>,
    default: "250ms",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});

const modelValue = defineModel();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>;

const optionGroupRefs = useTemplateRef<HTMLDivElement>("optionGroup");

const iconWidth = ref("0px");
const showMarker = ref(false);

const selectedOptionIndex = computed(() => {
  return fieldData.value.data.findIndex((option) => option.value === modelValue.value);
});

const setupDefaults = async () => {
  if (Array.isArray(optionGroupRefs.value) && optionGroupRefs.value[0]) {
    iconWidth.value = optionGroupRefs.value[0].getBoundingClientRect().width + "px";
  }

  await useSleep(250);
  showMarker.value = true;
};

onMounted(() => {
  setupDefaults();
});
</script>

<style lang="css">
.triple-toggle-switch {
  --_form-border-colour: var(--theme-form-radio-border);

  --_form-outline-colour: var(--theme-form-radio-outline);

  --_form-border-radius: calc(
    (var(--_scheme-icon-font-size) / 2) + var(--form-element-border-width) + var(--form-element-outline-width) +
      var(--_form-padding) + var(--_select-scheme-group-padding) + var(--form-element-border-width) +
      var(--form-element-outline-width)
  );

  --_form-items-gap: 1rem;
  --_form-padding: 0.6rem;

  --_select-scheme-group-background-color: var(--theme-form-checkbox-bg);
  --_select-scheme-group-background-image: none;
  --_select-scheme-group-padding: 0.5rem;
  --_scheme-icon-font-size: 2rem;
  /* --_scheme-icon-colour: black; */

  &:has(input[value="auto"]:checked) {
    --_select-scheme-group-background-color: transparent;
    --_select-scheme-group-background-image: radial-gradient(
      circle,
      rgb(66, 180, 58) 0%,
      rgb(17, 199, 0) 27%,
      rgb(8, 117, 3) 100%
    );
  }

  &:has(input[value="light"]:checked) {
    --_select-scheme-group-background-color: transparent;
    --_select-scheme-group-background-image: radial-gradient(
      circle,
      rgba(180, 58, 91, 1) 0%,
      rgba(253, 29, 29, 1) 27%,
      rgba(252, 176, 69, 1) 100%
    );
  }

  &:has(input[value="dark"]:checked) {
    --_select-scheme-group-background-color: transparent;
    --_select-scheme-group-background-image: radial-gradient(
      circle,
      rgb(50, 20, 25) 0%,
      rgb(0, 0, 0) 27%,
      rgb(100, 100, 100) 100%
    );
  }

  .triple-toggle-switch-wrapper {
    display: inline-grid;
    grid-template-areas: "select-stack";
    width: fit-content;

    background-color: var(--theme-input-surface);
    border: var(--form-element-border-width) solid var(--theme-input-border);
    outline: var(--form-element-outline-width) solid var(--theme-input-outline);
    border-radius: var(--_form-border-radius);
    padding: var(--_form-padding);

    transition: all var(--theme-form-transition-duration) ease-in-out;

    &:has(input:focus-visible) {
      outline: var(--form-element-outline-width) solid var(--theme-input-outline-hover);
      outline-offset: 0.2rem;
    }

    .selected-option-marker-wrapper {
      grid-area: select-stack;
      z-index: 1;
      display: flex;
      align-items: center;
      position: relative;

      .selected-option-marker {
        aspect-ratio: 1;
        width: v-bind(iconWidth);
        transition: all v-bind(stepAnimationDuration) ease-in-out;
        background-color: var(--_select-scheme-group-background-color);
        background-image: var(--_select-scheme-group-background-image);
        border: var(--form-element-border-width) solid light-dark(var(--gray-12), var(--gray-0));

        border-radius: 50%;

        position: absolute;
        left: calc(
          v-bind(selectedOptionIndex) * v-bind(iconWidth) + (var(--_form-items-gap) * v-bind(selectedOptionIndex))
        );

        opacity: 0;

        &.show {
          opacity: 1;
        }
      }
    }

    .option-group-wrapper {
      display: grid;
      grid-area: select-stack;
      grid-template-columns: repeat(3, 1fr);
      align-items: center;
      width: fit-content;
      z-index: 2;
      gap: var(--_form-items-gap);
      position: relative;

      .option-group {
        aspect-ratio: 1;
        display: grid;
        grid-template-areas: "icon-stack";
        place-content: center;
        background: transparent;
        border: var(--form-element-border-width) solid light-dark(#00000025, #ffffff50);
        outline: var(--form-element-outline-width) solid transparent;
        border-radius: 50%;
        padding: var(--_select-scheme-group-padding);
        overflow: hidden;

        transition: all calc(var(--theme-form-transition-duration) / 3);

        &:has(.option-icon:hover) {
          outline: var(--form-element-outline-width) solid light-dark(var(--gray-12), var(--gray-0));
        }
        &:has(input:focus-visible) {
          outline: var(--form-element-outline-width) solid var(--theme-input-outline-hover);
          outline-offset: 0.2rem;
        }

        .option-icon {
          grid-area: icon-stack;
          display: block;
          font-size: var(--_scheme-icon-font-size);

          &.auto {
            color: light-dark(var(--gray-12), var(--gray-3));

            &.active {
              color: var(--gray-0);
            }
          }

          &.light {
            color: light-dark(var(--gray-12), var(--gray-3));

            &.active {
              color: var(--gray-0);
            }
          }

          &.dark {
            color: light-dark(var(--gray-12), var(--gray-3));

            &.active {
              color: var(--gray-0);
            }
          }

          &:hover {
            cursor: pointer;
          }
        }

        .option-input {
          grid-area: icon-stack;
          opacity: 0;
          aspect-ratio: 1;
          width: var(--_scheme-icon-font-size);
          &:hover {
            cursor: pointer;
          }
        }

        /* &:has(input[value="auto"]:checked) {
          --_scheme-icon-colour: white;
        }

        &:has(input[value="light"]:checked) {
          --_scheme-icon-colour: white;
        }

        &:has(input[value="dark"]:checked) {
          --_scheme-icon-colour: white;
        } */
      }
    }
  }
}
</style>
