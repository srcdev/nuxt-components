<template>
  <FormFieldset
    :id
    :name
    :legend
    :field-has-error
    :required
    :data-testid
    :style-class-passthrough="['multiple-radiobuttons-fieldset', elementClasses]"
  >
    <template #description>
      <slot name="description"></slot>
    </template>

    <template #content>
      <div class="multiple-radiobuttons-items" :class="[optionsLayout]">
        <template v-for="item in fieldData.data" :key="item.id">
          <InputCheckboxRadioButton
            v-if="isButton"
            :id="`${name}-${item.value}`"
            v-model="modelValue"
            type="radio"
            :name="`${name}-${item.name}`"
            :required
            :label="item.label"
            :field-has-error
            :true-value="item.value"
            :size
            :options-layout
            :theme
            :direction
            :aria-describedby
            :display-as-lozenge
          >
            <template #checkedIcon>
              <slot name="checkedIcon"></slot>
            </template>
            <template #itemIcon>
              <slot name="itemIcon">
                <Icon name="material-symbols:add-2" class="icon" />
              </slot>
            </template>
          </InputCheckboxRadioButton>
          <InputCheckboxRadioWithLabel
            v-else
            :id="`${name}-${item.value}`"
            v-model="modelValue"
            type="radio"
            :name="`${name}-${item.name}`"
            :required
            :label="item.label"
            :field-has-error
            :true-value="item.value"
            :size
            :options-layout
            :theme
            :aria-describedby
          >
            <template #checkedIcon>
              <slot name="checkedIcon"></slot>
            </template>
          </InputCheckboxRadioWithLabel>
        </template>
      </div>
      <InputError :id="errorId" :error-message="errorMessage" :show-error="fieldHasError" :is-detached="true" />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, OptionsLayout, IFormMultipleOptions } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  name: string;
  legend: string;
  label: string;
  placeholder?: string;
  isButton?: boolean;
  errorMessage: object | string;
  required?: boolean;
  fieldHasError?: boolean;
  multipleOptions?: boolean;
  size?: FormSize;
  optionsLayout?: OptionsLayout;
  equalCols?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
  direction?: "row" | "row-reverse";
  displayAsLozenge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "multiple-radio-buttons",
  placeholder: "",
  isButton: false,
  required: false,
  fieldHasError: false,
  multipleOptions: false,
  size: "medium",
  optionsLayout: "equal-widths",
  equalCols: true,
  styleClassPassthrough: () => [],
  theme: "primary",
  direction: "row",
  displayAsLozenge: false,
});

const slots = useSlots();

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const id = `${props.name}-input-${useId()}`;
const errorId = `${name}-error-message`;
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? `${id}-description` : undefined;
  return props.fieldHasError ? errorId : ariaDescribedbyId;
});

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();
const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>;
</script>

<style lang="css">
.multiple-radiobuttons-items {
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
