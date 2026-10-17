<template>
  <div
    class="input-text-wrapper"
    data-testid="input-text-wrapper"
    :data-theme="theme"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : null"
    :data-dirty="isDirty ? '' : null"
    :data-active="isActive ? '' : null"
    :data-readonly="readonly ? '' : null"
    :data-inputmode="inputmode"
    :data-has-left-slot="slots.left ? '' : null"
    :data-has-right-slot="slots.right ? '' : null"
  >
    <div v-if="slots.left" class="input-text-slot input-text-slot-left">
      <slot name="left"></slot>
    </div>

    <input
      :id
      v-model="modelValue"
      :type
      :placeholder
      :name
      :required
      :readonly
      :autocomplete
      :maxlength
      :min
      :max
      :class="['input-text', elementClasses]"
      :aria-invalid="fieldHasError ? 'true' : undefined"
      :aria-describedby="ariaDescribedby || undefined"
      :pattern="inputPattern"
      :inputmode
      @beforeinput="filterInput"
      @focusin="isActive = true"
      @focusout="isActive = false"
    />

    <div v-if="slots.right" class="input-text-slot input-text-slot-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InputTypesText, FormUiTheme, InputUiVariant, InputMode } from "~/types/forms/types.forms";

interface Props {
  type?: InputTypesText;
  inputmode?: InputMode;
  maxlength?: number;
  min?: string | number;
  max?: string | number;
  id: string;
  name: string;
  required?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  placeholder?: string;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  ariaDescribedby?: string;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  inputmode: "text",
  maxlength: 255,
  min: undefined,
  max: undefined,
  required: false,
  readonly: false,
  autocomplete: undefined,
  placeholder: "",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  theme: "default",
  ariaDescribedby: "",
  inputVariant: "normal",
});

const slots = useSlots();

const modelValue = defineModel<string>({ required: true });
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");

const inputPattern = computed(() => (props.inputmode === "numeric" ? "[0-9]+" : undefined));

const filterInput = (event: Event) => {
  const data = (event as InputEvent).data;
  if (props.inputmode === "numeric" && data !== null && !/^[0-9]*$/.test(data)) {
    event.preventDefault();
  }
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
  .input-text-wrapper {
    --_surface: var(--input-text-surface, var(--theme-input-surface));
    --_border: var(--input-text-border, var(--theme-border));
    --_border-focus: var(--input-text-border-focus, var(--theme-border-focus));

    display: flex;
    align-items: center;
    gap: var(--input-icon-slot-gap);
    min-inline-size: 0;
    max-inline-size: 100%;
    background-color: var(--_surface);
    overflow: hidden;
    transition: all var(--theme-form-transition-duration) ease-in-out;

    z-index: 2;
    position: relative;

    &[data-input-variant="normal"] {
      border: var(--form-element-border-width) solid var(--_border);
      border-radius: var(--form-input-border-radius);
      outline: var(--form-element-outline-width) solid transparent;

      padding-inline: var(--input-padding-inline);

      &:has(input:is(:hover), button:is(:hover)) {
        outline: var(--form-element-outline-width-focus) solid var(--input-text-border-hover, var(--theme-border-focus));
        outline-offset: var(--form-element-outline-offset-focus);
      }

      &:has(input:focus-visible, button:focus-visible) {
        outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
        outline-offset: var(--form-element-outline-offset-focus);
      }
    }

    &[data-input-variant="underlined"] {
      border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--_border);
      padding-inline: var(--input-padding-inline);
    }

    &[data-has-right-slot]:has(.input-text-slot-right .input-button) {
      padding-inline-end: 0;
    }

    .input-text-slot {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-sizing: content-box;

      /* variant="inline" InputButton ships unstyled; the slot supplies its border, colour and outline. */
      .input-button {
        background-color: var(--_surface);
        color: var(--input-text-color, var(--theme-input-text-color-normal));
        border: none;
        outline: none;
        aspect-ratio: 1;
        border-radius: 0;
        width: var(--input-min-height);

        &:hover {
          background-color: var(--input-text-surface-hover, var(--theme-input-surface-hover));
        }

        &:is(:focus-visible) {
          outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
          outline-offset: -4px;
        }

        &[data-icon-only] {
          & .input-button-icon {
            margin: 0;
          }
        }
      }
    }

    .input-text {
      all: unset;
      touch-action: manipulation;
      flex-grow: 1;
      min-inline-size: 0;

      color: var(--input-text-color, var(--theme-input-text-color-normal));
      font-family: var(--font-family);
      font-size: var(--input-font-size);

      padding-block: var(--input-padding-block);
      padding-inline: var(--input-padding-inline);
      min-height: var(--input-min-height);

      &::placeholder {
        color: var(--input-text-placeholder-color, var(--theme-input-placeholder));
        font-size: var(--theme-input-placeholder-font-size);
        font-style: italic;
        line-height: 1;
        font-weight: normal;
      }
    }
  }
}
</style>
