<template>
  <div
    class="input-text-field"
    :class="elementClasses"
    :data-theme="theme"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : null"
    :data-dirty="isDirty ? '' : null"
    :data-active="isActive ? '' : null"
    :data-filled="isFilled ? '' : null"
  >
    <InputLabel
      :id
      :required
      :input-variant
      :field-has-error
      :style-class-passthrough="['input-text-label']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
      v-if="inputVariant !== 'outlined'"
      :description-id
      :input-variant
      :field-has-error="fieldHasError"
      :style-class-passthrough="['input-text-description']"
    >
      <template v-if="slots.descriptionHtml" #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template v-if="slots.descriptionText" #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>

    <InputText
      :id
      v-model="modelValue"
      v-model:is-dirty="isDirty"
      v-model:is-active="isActive"
      :type
      :inputmode
      :maxlength
      :min
      :max
      :name
      :placeholder
      :field-has-error
      :required
      :readonly
      :autocomplete
      :theme
      :aria-describedby="ariaDescribedby() ?? undefined"
      :input-variant
    >
      <template v-if="slots.left" #left>
        <slot name="left"></slot>
      </template>
      <template v-if="slots.right" #right>
        <slot name="right"></slot>
      </template>
    </InputText>

    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="false" :input-variant />

    <InputDescription
      v-if="inputVariant === 'outlined'"
      :description-id
      :input-variant
      :field-has-error="fieldHasError"
      :style-class-passthrough="['input-text-description']"
    >
      <template v-if="slots.descriptionHtml" #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template v-if="slots.descriptionText" #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>
  </div>
</template>

<script setup lang="ts">
import type { InputTypesText, FormUiTheme, InputUiVariant, InputMode } from "~/types/forms/types.forms";

interface Props {
  maxlength?: number;
  min?: string | number;
  max?: string | number;
  type: InputTypesText;
  inputmode?: InputMode;
  name: string;
  placeholder?: string;
  label: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  maxlength: 255,
  min: undefined,
  max: undefined,
  inputmode: "text",
  placeholder: "",
  fieldHasError: false,
  required: false,
  readonly: false,
  autocomplete: undefined,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<string>({ required: true });
const isActive = ref<boolean>(false);
const isDirty = ref<boolean>(false);
const isFilled = computed(() => (modelValue.value ?? "") !== "");

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const testDirty = () => {
  const watchValue = modelValue.value ?? "";

  if (!isDirty.value && typeof watchValue === "string" && watchValue.length > 0) {
    isDirty.value = true;
  }
};

onMounted(() => {
  testDirty();
});

watch(
  () => modelValue.value,
  () => {
    testDirty();
  }
);
</script>

<style lang="css">
@layer components {
  .input-text-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;

    &[data-input-variant="outlined"] {
      --_outlined-label-space: var(--input-text-outlined-label-space, 2rem);
      --_outlined-label-font-size: var(--input-text-outlined-label-font-size, var(--step-5));

      display: grid;
      grid-template-columns: minmax(0, 1fr);

      > .input-text-label,
      > .input-text-wrapper {
        grid-area: 1 / 1;
      }

      > .input-text-wrapper {
        padding-block-start: var(--_outlined-label-space);
      }

      > .input-text-label {
        align-self: start;
        z-index: 3;
        min-inline-size: 0;
        margin-block: 0;
        margin-inline: calc(var(--form-element-border-width) + var(--input-padding-inline))
          calc(var(--form-element-border-width) + var(--input-padding-inline));
        color: var(--input-text-outlined-label-color, inherit);
        font-size: var(--_outlined-label-font-size);
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transform-origin: left top;
        translate: var(--input-text-outlined-label-rest-indent, var(--input-padding-inline))
          var(
            --input-text-outlined-label-rest-offset,
            calc((var(--_outlined-label-space) + var(--input-min-height) - 1.5 * var(--_outlined-label-font-size)) / 2)
          );
        transition:
          translate var(--theme-form-transition-duration) ease-in-out,
          scale var(--theme-form-transition-duration) ease-in-out;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }

      &:has(.input-text-wrapper[data-has-right-slot]) > .input-text-label {
        margin-inline-end: calc(var(--form-element-border-width) + var(--input-min-height));
      }

      .input-text {
        opacity: 0;
        transition: opacity var(--theme-form-transition-duration) ease-in-out;
      }

      &:is([data-active], [data-filled], [data-invalid]),
      &:has(.input-text-wrapper[data-has-left-slot], :is(.input-text:autofill)) {
        > .input-text-label {
          color: var(--input-text-outlined-label-color-floated, var(--input-text-outlined-label-color, inherit));
          font-weight: var(--input-text-outlined-label-font-weight-floated, bold);
          translate: 0 var(--input-text-outlined-label-inset-block, 0.4rem);
          scale: var(--input-text-outlined-label-scale, 0.85);
        }

        .input-text {
          opacity: 1;
        }
      }
    }
  }
}
</style>
