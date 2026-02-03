<template>
  <div
    class="input-textarea-wrapper"
    :data-theme="formTheme"
    :data-size="size"
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

    <textarea
      :maxlength
      :placeholder
      :id
      :name
      :required
      :class="['input-textarea-core', elementClasses, { dirty: isDirty }, { active: isActive }]"
      v-model="modelValue"
      ref="inputField"
      :aria-invalid="fieldHasError"
      :aria-describedby
      @focusin="updateFocus(true)"
      @focusout="updateFocus(false)"
    ></textarea>

    <span v-if="slots.right" class="slot right-slot">
      <slot name="right"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"
const props = defineProps({
  maxlength: {
    type: Number,
    default: 255,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  ariaDescribedby: {
    type: String,
    default: "",
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  size: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  inputVariant: {
    type: String as PropType<string>,
    default: "normal",
    validator(value: string) {
      return propValidators.inputVariant.includes(value)
    },
  },
})

const slots = useSlots()

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme
})

const modelValue = defineModel<string | number | readonly string[] | null | undefined>()
const isDirty = defineModel("isDirty")
const isActive = defineModel("isActive")

const updateFocus = (isFocused: boolean) => {
  isActive.value = isFocused
}

const inputField = ref<HTMLInputElement | null>(null)

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.input-textarea-wrapper {
  background-color: var(--theme-input-surface);
  outline: var(--form-element-outline-width) solid var(--theme-input-outline);

  border-top-left-radius: var(--element-decorator-border-top-left-radius);
  border-top-right-radius: var(--element-decorator-border-top-right-radius);
  border-bottom-left-radius: var(--element-decorator-border-bottom-left-radius);
  border-bottom-right-radius: var(--element-decorator-border-bottom-right-radius);

  border-top: var(--element-decorator-border-top-default);
  border-right: var(--element-decorator-border-right-default);
  border-bottom: var(--element-decorator-border-bottom-default);
  border-left: var(--element-decorator-border-left-default);

  padding-inline: var(--element-decorator-padding-inline);

  &:hover {
    /* background-color: lab(89.6502 -0.829279 -2.45323 / 0.1); */
    background-color: var(--theme-input-surface-hover);
  }

  &:focus-within {
    outline: var(--element-decorator-outline-focus);
  }

  display: flex;
  align-items: center;
  gap: 12px;

  .slot {
    display: flex;
    place-items: center;
    background-clip: padding-box;

    &.left-slot {
      /* background-color: green; */
    }
    &.right-slot {
      /* background-color: orange; */
    }
  }

  .input-textarea-core {
    all: unset;
    touch-action: manipulation;
    flex-grow: 1;
    field-sizing: content;

    font-family: var(--font-family);
    font-size: var(--form-element-font-size);
    line-height: var(--form-element-line-height);
    padding-block: var(--input-element-padding-block);
    padding-inline: var(--input-element-padding-inline);

    min-height: 4rem;

    &::placeholder {
      color: var(--input-placeholder-color);
      font-size: var(--input-placeholder-font-size);
      font-style: var(--input-placeholder-font-style);
      line-height: var(--input-placeholder-line-height);
      font-weight: var(--input-placeholder-font-weight);
    }
  }
}
</style>
