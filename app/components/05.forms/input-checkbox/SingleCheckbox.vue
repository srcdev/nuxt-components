<template>
  <FormFieldset
    :id
    :name
    :legend
    :field-has-error
    :required
    :data-testid
    :style-class-passthrough="['single-checkbox-fieldset', elementClasses]"
  >
    <template #content>
      <InputDescription
        :id
        :description-id
        :name
        :field-has-error="fieldHasError"
        :style-class-passthrough="['input-text-description']"
      >
        <template #descriptionHtml>
          <slot name="descriptionHtml"></slot>
        </template>
        <template #descriptionText>
          <slot name="descriptionText"></slot>
        </template>
      </InputDescription>

      <div class="single-checkbox-items" :class="[optionsLayout]">
        <InputCheckboxRadioWithLabel
          v-model="modelValue"
          type="checkbox"
          :name
          :required
          :label
          :field-has-error
          :true-value
          :false-value
          :theme
          :input-variant
          :aria-describedby
        >
          <template #checkedIcon>
            <slot name="checkedIcon"></slot>
          </template>
          <template v-if="slots.labelContent" #labelContent>
            <slot name="labelContent"></slot>
          </template>
        </InputCheckboxRadioWithLabel>
      </div>
      <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" :input-variant />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import type { FormUiTheme, OptionsLayout, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  name: string;
  legend: string;
  label?: string;
  errorMessage: string | object;
  required?: boolean;
  fieldHasError?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  optionsLayout?: OptionsLayout;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "single-checkbox",
  label: "",
  required: false,
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  optionsLayout: "equal-widths",
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();
const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>({ required: true });
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);
</script>

<style lang="css">
@layer components {
.single-checkbox-items {
  display: flex;
  gap: var(--single-checkbox-gap, 1.2rem);
  margin-block-start: var(--single-checkbox-margin-block-start, 1.2rem);

  &.inline {
    flex-direction: row;
    flex-wrap: wrap;
  }

  &.block {
    flex-direction: column;
  }

  &.equal-widths {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--single-checkbox-column-min-width, 100px), 1fr));
  }
}
}
</style>
