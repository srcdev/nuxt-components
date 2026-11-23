<template>
  <div
    class="input-textarea-field"
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
      :style-class-passthrough="['input-textarea-label']"
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

    <InputTextarea
      :id
      v-model="modelValue"
      v-model:is-dirty="isDirty"
      v-model:is-active="isActive"
      :maxlength
      :name
      :placeholder
      :field-has-error
      :required
      :readonly
      :autocomplete
      :theme
      :input-variant
      :aria-describedby="ariaDescribedby() ?? undefined"
    >
      <template v-if="slots.left" #left>
        <slot name="left"></slot>
      </template>
      <template v-if="slots.right" #right>
        <slot name="right"></slot>
      </template>
    </InputTextarea>

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
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  maxlength?: number;
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

const modelValue = defineModel<string | number | readonly string[] | null | undefined>({
  required: true,
});
const isActive = ref<boolean>(false);
const isDirty = ref<boolean>(false);
const isFilled = computed(() => (modelValue.value ?? "").toString() !== "");

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
  .input-textarea-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;

    &[data-input-variant="outlined"] {
      --_outlined-label-space: var(--input-textarea-outlined-label-space, 2rem);

      display: grid;
      grid-template-columns: minmax(0, 1fr);

      > .input-textarea-label,
      > .input-textarea-wrapper {
        grid-area: 1 / 1;
      }

      > .input-textarea-wrapper {
        padding-block-start: var(--_outlined-label-space);
      }

      > .input-textarea-label {
        align-self: start;
        z-index: 3;
        min-inline-size: 0;
        margin-block: 0;
        margin-inline: calc(
            var(--form-element-border-width) + var(--input-padding-inline) + var(--form-textarea-padding-inline)
          )
          calc(var(--form-element-border-width) + var(--input-padding-inline));
        color: var(--input-textarea-outlined-label-color, inherit);
        font-size: var(--input-textarea-outlined-label-font-size, var(--step-5));
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transform-origin: left top;
        translate: 0
          var(
            --input-textarea-outlined-label-rest-offset,
            calc(var(--_outlined-label-space) + var(--form-textarea-padding-block))
          );
        transition:
          translate var(--theme-form-transition-duration) ease-in-out,
          scale var(--theme-form-transition-duration) ease-in-out;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }

      .input-textarea {
        opacity: 0;
        transition: opacity var(--theme-form-transition-duration) ease-in-out;
      }

      &:is([data-active], [data-filled], [data-invalid]),
      &:has(.input-textarea-wrapper[data-has-left-slot]) {
        > .input-textarea-label {
          color: var(--input-textarea-outlined-label-color-floated, var(--input-textarea-outlined-label-color, inherit));
          font-weight: var(--input-textarea-outlined-label-font-weight-floated, bold);
          translate: 0 var(--input-textarea-outlined-label-inset-block, 0.4rem);
          scale: var(--input-textarea-outlined-label-scale, 0.85);
        }

        .input-textarea {
          opacity: 1;
        }
      }
    }
  }
}
</style>
