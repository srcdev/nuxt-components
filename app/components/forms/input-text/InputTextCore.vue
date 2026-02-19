<template>
  <div
    class="input-text-wrapper"
    data-testid="input-text-wrapper"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :data-size="size"
    :data-inputmode="inputmode"
    :class="[
      inputVariant,
      { dirty: isDirty },
      { active: isActive },
      { error: fieldHasError },
      { 'has-left-slot': slots.left },
      { 'has-right-slot': slots.right },
    ]"
  >
    <div v-if="slots.left" class="slot left-slot">
      <slot name="left"></slot>
    </div>

    <input
      :id
      ref="inputField"
      v-model="modelValue"
      :type
      :placeholder
      :name
      :required
      :maxlength
      :class="['input-text-core', elementClasses, { dirty: isDirty }, { active: isActive }]"
      :aria-invalid="fieldHasError"
      :aria-describedby
      :pattern="inputPattern"
      :inputmode
      @focusin="updateFocus(true)"
      @focusout="updateFocus(false)"
    />

    <div v-if="slots.right" class="slot right-slot">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSize, InputTypesText, FormUiTheme, InputUiVariant, InputMode } from "~/types/forms/types.forms";

interface Props {
  type?: InputTypesText;
  inputmode?: InputMode;
  maxlength?: number;
  id: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  ariaDescribedby?: string;
  size?: FormSize;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  inputmode: "text",
  maxlength: 255,
  required: false,
  placeholder: "",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  theme: "default",
  ariaDescribedby: "",
  size: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const FormUiTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<string>();
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");

const inputPattern = computed(() => {
  return props.inputmode === "numeric" ? "[0-9]+" : undefined;
});

const updateFocus = (isFocused: boolean) => {
  isActive.value = isFocused;
};

const inputField = ref<HTMLInputElement | null>(null);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

// TODO: Move this to a utility function to allow removeEventListener on unmounted
// Leaving like this could lead to memory leaks
const validateInput = () => {
  if (inputField.value !== null) {
    inputField.value.addEventListener("beforeinput", (event: InputEvent) => {
      const beforeValue = modelValue.value;
      if (event.data === null) {
        // Handle deletion case
        return;
      } else if (event.target) {
        event.target.addEventListener(
          "input",
          () => {
            if (inputField.value !== null && inputField.value.validity.patternMismatch) {
              inputField.value.value = beforeValue as string;
            }
          },
          { once: true }
        );
      }
    });
  }
};

onMounted(() => {
  if (props.inputmode === "numeric") validateInput();
});
</script>

<style lang="css">
.input-text-wrapper {
  display: flex;
  align-items: center;
  gap: var(--input-icon-slot-gap);
  background-color: var(--theme-input-surface);
  overflow: hidden;
  transition: all var(--theme-form-transition-duration) ease-in-out;

  &:has(.input-text-core:is(:hover, :focus-visible)) {
    background-color: var(--theme-input-surface-hover);
  }

  &.normal {
    border: var(--form-element-border-width) solid var(--theme-input-border);
    border-radius: var(--form-input-border-radius);
    outline: var(--form-element-outline-width) solid var(--theme-input-outline);

    padding-inline: var(--input-padding-inline);
  }

  &.underlined {
    border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--theme-input-border);
    padding-inline: var(--input-padding-inline);
  }

  &.has-right-slot:has(.input-button-core) {
    padding-inline-end: 0;
  }

  .slot {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;

    .input-button-core {
      background-color: var(--theme-input-surface);
      aspect-ratio: 1;
      border-radius: 0;
      width: var(--input-min-height);

      &:hover {
        background-color: var(--theme-input-surface-hover);
      }

      &.icon-only {
        .btn-icon {
          margin: 0;
        }
      }
    }
  }

  .input-text-core {
    all: unset;
    touch-action: manipulation;
    flex-grow: 1;

    color: var(--theme-input-text-color-normal);
    font-family: var(--font-family);
    font-size: var(--form-element-font-size);

    /* line-height: var(--input-element-line-height); */

    padding-block: var(--input-padding-block);
    padding-inline: var(--input-padding-inline);
    /* height: stretch; */
    min-height: var(--input-min-height);

    &::placeholder {
      color: var(--theme-input-placeholder);
      font-size: var(--theme-input-placeholder-font-size);
      font-style: italic;
      line-height: 1;
      font-weight: normal;
    }
  }
}
</style>
