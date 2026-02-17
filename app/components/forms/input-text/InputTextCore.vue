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

  &:hover {
    background-color: var(--theme-input-surface-hover);
  }

  &:focus-within {
    background-color: var(--theme-input-surface-hover);
    /* outline: var(--theme-focus-visible-outline); */
    /* box-shadow: var(--theme-focus-visible-shadow); */
  }

  &.normal {
    border: var(--form-element-border-width) solid var(--theme-input-border);
    border-radius: var(--form-input-border-radius);
    outline: var(--form-element-outline-width) solid var(--theme-input-outline);

    padding-inline: 1rem;

    /*
    .slot {
      display: grid;
      place-items: center;
      background-clip: padding-box;
      aspect-ratio: 1;
      width: 46px;

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
      */
  }

  &.underlined {
    border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--theme-input-border);

    /* .slot {
      display: grid;
      place-items: center;
      background-clip: padding-box;
      aspect-ratio: 1;
      width: 46px;

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
    } */
  }

  &[data-inputmode="numeric"] {
    padding-inline: 0;
  }

  .slot {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;

    &.left-slot,
    &.right-slot {
      .icon {
        width: 2.2rem;
        height: 2.2rem;
        margin: 1.3rem;
      }

      .input-button-core {
        &.icon-only {
          .btn-icon {
            margin: 0;
          }
        }
      }
    }

    /*
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
      */
  }

  .input-text-core {
    all: unset;
    touch-action: manipulation;
    flex-grow: 1;

    color: var(--theme-input-text-color-normal);
    font-family: var(--font-family);
    font-size: var(--form-element-font-size);
    line-height: var(--form-element-line-height);
    /* padding-block: var(--form-text-padding-block); */
    padding-inline: 1rem;
    height: stretch;

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
