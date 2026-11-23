<template>
  <div
    class="input-text-field"
    :class="elementClasses"
    :data-theme="theme"
    :data-input-variant="resolvedInputVariant"
    :data-invalid="fieldHasError ? '' : null"
    :data-dirty="isDirty ? '' : null"
    :data-active="isActive ? '' : null"
    :data-filled="isFilled ? '' : null"
  >
    <InputLabel
      :id
      :required
      :input-variant="resolvedInputVariant"
      :field-has-error
      :style-class-passthrough="['input-text-label']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
      v-if="resolvedInputVariant !== 'outlined'"
      :description-id
      :input-variant="resolvedInputVariant"
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
      :input-variant="resolvedInputVariant"
    >
      <template v-if="slots.left" #left>
        <slot name="left"></slot>
      </template>
      <template v-if="slots.right" #right>
        <slot name="right"></slot>
      </template>
    </InputText>

    <InputError
      :id="errorId"
      :error-message
      :show-error="fieldHasError"
      :is-detached="false"
      :input-variant="resolvedInputVariant"
    />

    <InputDescription
      v-if="resolvedInputVariant === 'outlined'"
      :description-id
      :input-variant="resolvedInputVariant"
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
  inputVariant: undefined,
});

const resolvedInputVariant = useInputVariant(() => props.inputVariant);

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
      --_outlined-label-font-size: var(--input-text-outlined-label-font-size, var(--input-font-size));
      --_outlined-label-scale: var(--input-text-outlined-label-scale, 0.85);
      --_outlined-label-padding-inline: var(--input-text-outlined-label-padding-inline, 0.9rem);
      --_outlined-label-inset-inline: var(
        --input-text-outlined-label-inset-inline,
        calc(var(--form-input-border-radius) + 0.2rem)
      );
      --_outlined-label-line-height: var(--input-text-outlined-label-line-height, 1.25);
      --_outlined-label-padding-block: var(--input-text-outlined-label-padding-block, 0.2rem);
      --_outlined-label-border-width: calc(var(--form-element-border-width) / var(--_outlined-label-scale));
      --_outlined-label-outline-width: calc(
        var(--input-text-outlined-outline-width, 0.1rem) / var(--_outlined-label-scale)
      );
      --_outlined-label-block-size: calc(
        var(--_outlined-label-line-height) * var(--_outlined-label-font-size) + 2 *
          (var(--_outlined-label-padding-block) + var(--_outlined-label-border-width))
      );

      display: grid;
      grid-template-columns: minmax(0, 1fr);
      padding-block-start: calc(
        (var(--_outlined-label-scale) * var(--_outlined-label-block-size) - var(--form-element-border-width)) / 2
      );

      > .input-text-label,
      > .input-text-wrapper {
        grid-area: 1 / 1;
      }

      > .input-text-label {
        align-self: start;
        justify-self: start;
        z-index: 3;
        min-inline-size: 0;
        max-inline-size: calc(100% - 2 * (var(--form-element-border-width) + var(--input-padding-inline)));
        margin: 0;
        margin-inline-start: var(--_outlined-label-inset-inline);
        padding-block: var(--_outlined-label-padding-block);
        padding-inline: var(--_outlined-label-padding-inline);
        border: var(--_outlined-label-border-width) solid transparent;
        outline: var(--_outlined-label-outline-width) solid transparent;
        outline-offset: 0;
        border-radius: var(--input-text-outlined-label-border-radius, 999px);
        background-color: transparent;
        color: var(--input-text-outlined-label-color, inherit);
        font-size: var(--_outlined-label-font-size);
        line-height: var(--_outlined-label-line-height);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transform-origin: left top;
        translate: calc(
            var(--form-element-border-width) + var(--input-padding-inline) - var(--_outlined-label-inset-inline) -
              var(--_outlined-label-border-width) - var(--_outlined-label-padding-inline)
          )
          calc((var(--input-min-height) + 2 * var(--form-element-border-width) - var(--_outlined-label-block-size)) / 2);
        --_outlined-label-fade: calc(var(--theme-form-transition-duration) * 0.4);

        transition-property: translate, scale, background-color, border-color, outline-color;
        transition-duration:
          var(--theme-form-transition-duration), var(--theme-form-transition-duration), var(--_outlined-label-fade),
          var(--_outlined-label-fade), var(--_outlined-label-fade);
        transition-delay: 0s, 0s, calc(var(--theme-form-transition-duration) * 0.6), 0s, 0s;
        transition-timing-function: ease-in-out;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }

      &:has(.input-text-wrapper[data-has-right-slot]) > .input-text-label {
        max-inline-size: calc(100% - var(--input-padding-inline) - var(--input-min-height));
      }

      .input-text {
        --_outlined-pill-overlap: calc(var(--_outlined-label-scale) * var(--_outlined-label-block-size) / 2);

        padding-block-start: var(--_outlined-pill-overlap);
        min-height: calc(var(--input-min-height) - var(--_outlined-pill-overlap));
        opacity: 0;
        transition: opacity var(--theme-form-transition-duration) ease-in-out;
      }

      &:is([data-active], [data-filled], [data-invalid]),
      &:has(.input-text-wrapper[data-has-left-slot], :is(.input-text:autofill)) {
        > .input-text-label {
          translate: 0
            calc(
              (var(--form-element-border-width) - var(--_outlined-label-scale) * var(--_outlined-label-block-size)) / 2
            );
          scale: var(--_outlined-label-scale);
          border-color: var(--input-text-outlined-label-border, var(--input-text-border, var(--theme-border)));
          background-color: var(
            --input-text-outlined-label-surface,
            var(--input-text-surface, var(--theme-input-surface))
          );
          color: var(--input-text-outlined-label-color-floated, var(--input-text-outlined-label-color, inherit));
          font-weight: var(--input-text-outlined-label-font-weight-floated, normal);
          transition-delay:
            0s, 0s, 0s, calc(var(--theme-form-transition-duration) * 0.6),
            calc(var(--theme-form-transition-duration) * 0.6);
          outline-color: var(
            --input-text-outlined-outline,
            var(--input-text-shadow, var(--form-element-shadow-colour, var(--colour-theme-2)))
          );
        }

        &:has(.input-text:hover, .input-text-wrapper button:hover) > .input-text-label {
          outline-color: var(--input-text-border-hover, var(--input-text-border, var(--theme-border)));
        }

        &:has(.input-text:focus-visible, .input-text-wrapper button:focus-visible) > .input-text-label {
          outline-color: var(--input-text-border-focus, var(--theme-border-focus));
        }

        .input-text {
          opacity: 1;
        }
      }
    }
  }
}
</style>
