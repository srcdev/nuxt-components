<template>
  <div class="triple-toggle-switch" :class="[elementClasses]" :data-theme="theme">
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
  theme?: FormUiTheme;
  stepAnimationDuration?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: "triple-toggle-switch",
  theme: "default",
  stepAnimationDuration: "250ms",
  styleClassPassthrough: () => [],
});

const modelValue = defineModel<string | number | boolean>();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>;

// Performance optimization: provide reactive access to props for template
const { name, theme, stepAnimationDuration } = toRefs(props);

const optionGroupRefs = useTemplateRef<HTMLDivElement>("optionGroup");

const iconWidth = ref("0px");
const showMarker = ref(false);

// Performance-optimized computed for selected option index
const selectedOptionIndex = computed(() => {
  if (!fieldData.value?.data) return 0;
  const index = fieldData.value.data.findIndex((option) => option.value === modelValue.value);
  return Math.max(0, index); // Ensure non-negative index
});

// Optimized setup with better error handling
const setupDefaults = async () => {
  await nextTick(); // Ensure DOM is ready

  if (Array.isArray(optionGroupRefs.value) && optionGroupRefs.value[0]) {
    const rect = optionGroupRefs.value[0].getBoundingClientRect();
    iconWidth.value = `${rect.width}px`;
  }

  // Use requestAnimationFrame for better performance than setTimeout
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
  /* Public --triple-toggle-switch-* tokens, inline-fallback to the shared --theme-* tokens (see
     theming-component-token-pattern.md). --_form-border-colour/--_form-outline-colour used to
     sit here referencing --theme-form-radio-border/-outline — dead tokens, declared nowhere in
     this layer at all (confirmed by grep), and --_form-border-colour/--_form-outline-colour
     themselves were never read by any property below either, so removed outright rather than
     migrated. --_marker-surface replaces the one dead reference that WAS actually read:
     --_select-scheme-group-background-color used to default from --theme-form-checkbox-bg,
     equally undeclared anywhere — real (if narrow) bug, since it only rendered visibly when
     none of the auto/light/dark :has() overrides below matched. */
  --_marker-surface: var(--triple-toggle-switch-marker-surface, var(--theme-input-surface));

  --_form-border-radius: calc(
    (var(--_scheme-icon-font-size) / 2) + var(--form-element-border-width) + var(--form-element-outline-width) +
      var(--_form-padding) + var(--_select-scheme-group-padding) + var(--form-element-border-width) +
      var(--form-element-outline-width)
  );

  --_form-items-gap: 1rem;
  --_form-padding: 0.6rem;

  --_select-scheme-group-background-color: var(--_marker-surface);
  --_select-scheme-group-background-image: none;
  --_select-scheme-group-padding: 0.5rem;
  --_scheme-icon-font-size: 2rem;
  /* --_scheme-icon-colour: black; */

  /* "system" not "auto" — matches useSettingsStore's actual colourScheme value/CSS class
     ("system" | "dark" | "light"), which DisplayThemeSwitch's real option data uses. Was
     "auto" here, a name that never matched any real consumer's data, so this gradient never
     fired in practice (confirmed by grep across the whole layer — nothing anywhere emits value
     "auto"). Presentational-only rename; the store's own type/class-name contract is untouched. */
  &:has(input[value="system"]:checked) {
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

    background-color: var(--triple-toggle-switch-surface, var(--theme-input-surface));
    border: var(--form-element-border-width) solid var(--triple-toggle-switch-border, var(--theme-border));
    outline: var(--form-element-outline-width) solid transparent;
    border-radius: 100vw;
    padding: var(--_form-padding);

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
        border: var(--form-element-border-width) solid
          var(--triple-toggle-switch-marker-border, light-dark(var(--slate-10), var(--slate-00)));

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
        border: var(--form-element-border-width) solid
          var(--triple-toggle-switch-option-border, light-dark(#00000025, #ffffff50));
        outline: var(--form-element-outline-width) solid transparent;
        border-radius: 50%;
        padding: var(--_select-scheme-group-padding);
        overflow: hidden;

        transition: all calc(var(--theme-form-transition-duration) / 3);

        &:has(.option-icon:hover) {
          outline: var(--form-element-outline-width) solid
            var(--triple-toggle-switch-option-border-hover, light-dark(var(--slate-10), var(--slate-00)));
        }
        &:has(input:focus-visible) {
          outline: var(--form-element-outline-width) solid var(--triple-toggle-switch-option-ring-focus, var(--theme-ring));
          outline-offset: 0.2rem;
        }

        /* .system/.light/.dark all share the exact same colour values today — kept as three
           selectors (rather than collapsed to one) since DisplayThemeSwitch and any other
           consumer may already target these class names directly; only the repeated literal
           values became tokens. This class is bound to each option's `id` in the template
           (:class="[option.id, ...]"), not a hardcoded literal — "auto" here never matched
           anything real for the same reason the :has(input[value="auto"]) selector above didn't:
           the only known consumer's data uses id "system". */
        .option-icon {
          grid-area: icon-stack;
          display: block;
          font-size: var(--_scheme-icon-font-size);

          &.system {
            color: var(--triple-toggle-switch-option-icon-color, light-dark(var(--slate-10), var(--slate-03)));

            &.active {
              color: var(--triple-toggle-switch-option-icon-color-active, var(--slate-00));
            }
          }

          &.light {
            color: var(--triple-toggle-switch-option-icon-color, light-dark(var(--slate-10), var(--slate-03)));

            &.active {
              color: var(--triple-toggle-switch-option-icon-color-active, var(--slate-00));
            }
          }

          &.dark {
            color: var(--triple-toggle-switch-option-icon-color, light-dark(var(--slate-10), var(--slate-03)));

            &.active {
              color: var(--triple-toggle-switch-option-icon-color-active, var(--slate-00));
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

        /* &:has(input[value="system"]:checked) {
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
}
</style>
