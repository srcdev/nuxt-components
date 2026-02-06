<template>
  <FormFieldset
    :id
    :name
    :legend
    :field-has-error
    :required
    :data-testid
    :style-class-passthrough="['single-checkbox-fieldset']"
  >
    <template #description>
      <slot name="description"></slot>
    </template>

    <template #content>
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
          :size
          :theme
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
      <InputError
        :id="errorId"
        :error-message
        :show-error="fieldHasError"
        :is-detached="true"
        :style-class-passthrough="elementClasses"
      />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, OptionsLayout } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  name: string;
  legend: string;
  label?: string;
  errorMessage: string | object;
  required?: boolean;
  fieldHasError?: boolean;
  multipleOptions?: boolean;
  size?: FormSize;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  optionsLayout?: OptionsLayout;
  equalCols?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "multiple-radio-buttons",
  label: "",
  required: false,
  fieldHasError: false,
  multipleOptions: false,
  size: "medium",
  trueValue: true,
  falseValue: false,
  optionsLayout: "equal-widths",
  equalCols: true,
  styleClassPassthrough: () => [],
  theme: "primary",
});

const slots = useSlots();
const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();
const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const id = `${props.name}-input-${useId()}`;
const errorId = `${props.name}-error-message`;
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? `${props.name}-description` : undefined;
  return props.fieldHasError ? errorId : ariaDescribedbyId;
});

watchEffect(() => {
  if (!slots.description && props.fieldHasError) {
    updateElementClasses(["mbs-12"]);
  }
});
</script>

<style lang="css">
.single-checkbox-items {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.2rem;

  &.inline {
    flex-direction: row;
    flex-wrap: wrap;
  }

  &.block {
    flex-direction: column;
  }

  &.equal-widths {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style>
