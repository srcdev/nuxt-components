<template>
  <div
    class="input-text-wrapper"
    data-testid="input-text-wrapper"
    :data-theme="formTheme"
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
    <span v-if="slots.left" class="slot left-slot">
      <slot name="left"></slot>
    </span>

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

    <span v-if="slots.right" class="slot right-slot">
      <slot name="right"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, InputVariant, InputTypesText, InputMode } from "~/types/forms/types.forms";

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
  theme?: FormTheme;
  ariaDescribedby?: string;
  size?: FormSize;
  inputVariant?: InputVariant;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  inputmode: "text",
  maxlength: 255,
  required: false,
  placeholder: "",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  theme: "primary",
  ariaDescribedby: "",
  size: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const formTheme = computed(() => {
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
  gap: 12px;
  background-color: var(--theme-input-surface);

  &:hover {
    background-color: var(--theme-input-surface-hover);
  }

  &:focus-within {
    background-color: var(--theme-input-surface-hover);
    outline: var(--theme-focus-visible-outline);
    box-shadow: var(--theme-focus-visible-shadow);
  }

  &.normal {
    outline: var(--form-element-outline-width) solid var(--theme-input-outline);

    border-top-left-radius: var(--form-input-border-radius);
    border-top-right-radius: var(--form-input-border-radius);
    border-bottom-left-radius: var(--form-input-border-radius);
    border-bottom-right-radius: var(--form-input-border-radius);

    border-top: var(--form-element-border-width) solid var(--theme-input-border);
    border-right: var(--form-element-border-width) solid var(--theme-input-border);
    border-bottom: var(--form-element-border-width) solid var(--theme-input-border);
    border-left: var(--form-element-border-width) solid var(--theme-input-border);

    padding-inline: 1rem;

    &.error {
      border-color: var(--theme-error-surface);
    }

    .slot {
      display: flex;
      place-items: center;
      background-clip: padding-box;

      &.left-slot:not([data-theme="input-action"]) {
        .icon {
          width: 2.2rem;
          height: 2.2rem;
        }

        [data-theme="input-action"] {
          width: initial;
          height: initial;
          padding: 0.5rem;

          .icon {
            width: 1.8rem;
            height: 1.8rem;
          }
        }
      }
      &.right-slot:not([data-theme="input-action"]) {
        .icon {
          width: 2.2rem;
          height: 2.2rem;
        }

        [data-theme="input-action"] {
          width: initial;
          height: initial;
          padding: 0.5rem;

          .icon {
            width: 1.8rem;
            height: 1.8rem;
          }
        }
      }
    }

    &[data-inputmode="numeric"] {
      padding-block: 0rem;
      padding-inline: 0.75rem;

      .slot {
        [data-theme="input-action"] {
          width: initial;
          height: initial;
          padding: 0.5rem;

          .icon {
            width: 1.8rem;
            height: 1.8rem;
          }
        }
      }
    }
  }

  &.underlined {
    margin-block-start: 0;
    padding-block: 0;
    padding-inline: 1rem;

    border-radius: 0;

    border-top: none;
    border-right: none;
    border-bottom: var(--form-element-border-width-underlined) solid var(--theme-input-border);
    border-left: none;

    overflow: hidden;

    &.error {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;

      border-top: var(--form-element-border-width) solid var(--theme-error-surface);
      border-right: var(--form-element-border-width) solid var(--theme-error-surface);
      border-bottom: var(--form-element-border-width) solid var(--theme-error-surface);
      border-left: var(--form-element-border-width) solid var(--theme-error-surface);
    }

    .slot {
      display: flex;
      place-items: center;
      background-clip: padding-box;

      &.left-slot:not([data-theme="input-action-underlined"]) {
        .icon {
          width: 2.2rem;
          height: 2.2rem;
        }

        [data-theme="input-action-underlined"] {
          width: initial;
          height: initial;
          padding: 0.5rem;

          .icon {
            width: 1.8rem;
            height: 1.8rem;
          }
        }
      }
      &.right-slot:not([data-theme="input-action-underlined"]) {
        .icon {
          width: 2.2rem;
          height: 2.2rem;
        }

        [data-theme="input-action-underlined"] {
          width: initial;
          height: initial;
          padding: 0.5rem;

          .icon {
            width: 1.8rem;
            height: 1.8rem;
          }
        }
      }
    }
  }

  .input-text-core {
    all: unset;
    touch-action: manipulation;
    flex-grow: 1;

    font-family: var(--font-family);
    font-size: var(--form-element-font-size);
    line-height: var(--form-element-line-height);
    padding-block: var(--input-element-padding-block);
    padding-inline: 1rem;

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
