<template>
  <div class="triple-toggle-switch" :class="[elementClasses]" :data-theme="theme">
    <div class="triple-toggle-switch-wrapper">
      <div class="selected-option-marker-wrapper">
        <div class="selected-option-marker" :class="[{ show: showMarker }]"></div>
      </div>
      <div class="option-group-wrapper" role="radiogroup" :aria-label="ariaLabel || undefined">
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
            :name="option.icon"
            class="option-icon"
            :class="[option.id, { active: modelValue === option.value }]"
          />
          <input
            :id="option.id"
            v-model="modelValue"
            type="radio"
            :name="name"
            class="option-input"
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
  name: "triple-toggle-switch",
  ariaLabel: "",
  theme: "default",
  stepAnimationDuration: "250ms",
  styleClassPassthrough: () => [],
});

const modelValue = defineModel<string | number | boolean>({ required: true });
const fieldData = defineModel<IFormMultipleOptions>("fieldData", { required: true });

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const { stepAnimationDuration } = toRefs(props);

const optionGroupRefs = useTemplateRef<HTMLLabelElement[]>("optionGroup");

const iconWidth = ref("0px");
const showMarker = ref(false);

const selectedOptionIndex = computed(() => {
  if (!fieldData.value?.data) return 0;
  const index = fieldData.value.data.findIndex((option) => option.value === modelValue.value);
  return Math.max(0, index);
});

const setupDefaults = async () => {
  await nextTick();

  const firstOption = optionGroupRefs.value?.[0];
  if (firstOption) {
    iconWidth.value = `${firstOption.getBoundingClientRect().width}px`;
  }

  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 250);
    });
  });

  showMarker.value = true;
};

onMounted(() => {
  setupDefaults();
});
</script>

<style lang="css">
@layer components {
  .triple-toggle-switch {
    --_form-items-gap: var(--triple-toggle-switch-gap, 1rem);
    --_select-scheme-group-background-color: var(--triple-toggle-switch-marker-surface, var(--theme-input-surface));
    --_select-scheme-group-background-image: none;
    --_scheme-icon-font-size: var(--triple-toggle-switch-icon-size, 2rem);

    &:has(input[value="system"]:checked) {
      --_select-scheme-group-background-color: transparent;
      --_select-scheme-group-background-image: var(
        --triple-toggle-switch-marker-gradient-system,
        radial-gradient(circle, rgb(66, 180, 58) 0%, rgb(17, 199, 0) 27%, rgb(8, 117, 3) 100%)
      );
    }

    &:has(input[value="light"]:checked) {
      --_select-scheme-group-background-color: transparent;
      --_select-scheme-group-background-image: var(
        --triple-toggle-switch-marker-gradient-light,
        radial-gradient(circle, rgba(180, 58, 91, 1) 0%, rgba(253, 29, 29, 1) 27%, rgba(252, 176, 69, 1) 100%)
      );
    }

    &:has(input[value="dark"]:checked) {
      --_select-scheme-group-background-color: transparent;
      --_select-scheme-group-background-image: var(
        --triple-toggle-switch-marker-gradient-dark,
        radial-gradient(circle, rgb(50, 20, 25) 0%, rgb(0, 0, 0) 27%, rgb(100, 100, 100) 100%)
      );
    }

    .triple-toggle-switch-wrapper {
      display: inline-grid;
      grid-template-areas: "select-stack";
      width: fit-content;

      background-color: var(--triple-toggle-switch-surface, var(--theme-input-surface));
      border: var(--form-element-border-width) solid var(--triple-toggle-switch-border, var(--theme-border));
      outline: var(--form-element-outline-width) solid transparent;
      border-radius: 100vw;
      padding: var(--triple-toggle-switch-padding, 0.6rem);

      transition: all var(--theme-form-transition-duration) ease-in-out;

      &:has(input:focus-visible) {
        outline: var(--form-element-outline-width) solid var(--triple-toggle-switch-ring-focus, var(--theme-ring));
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
          border: var(--form-element-border-width) solid var(--triple-toggle-switch-marker-border, var(--slate-10));
          border-radius: 50%;

          position: absolute;
          left: calc(
            v-bind(selectedOptionIndex) * v-bind(iconWidth) + (var(--_form-items-gap) * v-bind(selectedOptionIndex))
          );

          opacity: 0;

          &.show {
            opacity: 1;
          }

          @media (prefers-reduced-motion: reduce) {
            transition: none;
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
          border: var(--form-element-border-width) solid var(--triple-toggle-switch-option-border, #00000025);
          outline: var(--form-element-outline-width) solid transparent;
          border-radius: 50%;
          padding: var(--triple-toggle-switch-option-padding, 0.5rem);
          overflow: hidden;

          transition: all calc(var(--theme-form-transition-duration) / 3);

          &:has(.option-icon:hover) {
            outline: var(--form-element-outline-width) solid
              var(--triple-toggle-switch-option-border-hover, var(--slate-10));
          }

          &:has(input:focus-visible) {
            outline: var(--form-element-outline-width) solid
              var(--triple-toggle-switch-option-ring-focus, var(--theme-ring));
            outline-offset: 0.2rem;
          }

          .option-icon {
            grid-area: icon-stack;
            display: block;
            font-size: var(--_scheme-icon-font-size);
            color: var(--triple-toggle-switch-option-icon-color, var(--slate-10));

            &.active {
              color: var(--triple-toggle-switch-option-icon-color-active, var(--slate-00));
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
        }
      }
    }
  }
}
</style>
