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
import propValidators from "../c12/prop-validators";

const props = defineProps({
  dataTestid: {
    type: String,
    default: "multiple-radio-buttons",
  },
  name: {
    type: String,
    required: true,
  },
  legend: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  errorMessage: {
    type: [Object, String],
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  multipleOptions: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value);
    },
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  optionsLayout: {
    type: String as PropType<string>,
    default: "equal-widths",
    validator(value: string) {
      return propValidators.optionsLayout.includes(value);
    },
  },
  equalCols: {
    type: Boolean,
    default: true,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value);
    },
  },
});

const slots = useSlots();
const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();
const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const id = `${props.name}-input-${useId()}`;
const errorId = `${name}-error-message`;
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? `${name}-description` : undefined;
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
