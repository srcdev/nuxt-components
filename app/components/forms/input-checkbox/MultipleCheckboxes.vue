<template>
  <FormFieldset
    :id
    :name
    :legend
    :field-has-error
    :required
    :data-testid
    :style-class-passthrough="['multiple-checkboxes-fieldset', elementClasses]"
  >
    <InputDescription :id :name :field-has-error="fieldHasError" :style-class-passthrough="['input-text-description']">
      <template v-if="slots.descriptionHtml" #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template v-if="slots.descriptionText" #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>

    <template #content>
      <div class="multiple-checkboxes-items" :class="[optionsLayout]">
        <template v-for="item in fieldData.data" :key="item.id">
          <InputCheckboxRadioButton
            v-if="isButton"
            :id="`${name}-${item.value}`"
            v-model="modelValue"
            type="checkbox"
            :name
            :required
            :label="item.label"
            :field-has-error
            :true-value="item.value"
            :size
            :options-layout
            :theme
            :direction
            :aria-describedby
            :display-as-disc
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
            type="checkbox"
            :name
            :required
            :label="item.label"
            :field-has-error
            :true-value="item.value"
            :size
            :options-layout
            :theme
            :aria-describedby
            :display-as-disc
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
  errorMessage: string | object;
  required?: boolean;
  fieldHasError?: boolean;
  multipleOptions?: boolean;
  size?: FormSize;
  optionsLayout?: OptionsLayout;
  equalCols?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
  direction?: "row" | "row-reverse";
  displayAsDisc?: boolean;
  displayAsLozenge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "multiple-checkboxes",
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
  displayAsDisc: false,
  displayAsLozenge: false,
});

const slots = useSlots();

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();
const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>;

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const id = `${props.name}-${useId()}`;
const errorId = `${id}-error-message`;
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.descriptionText || slots.descriptionHtml ? `${id}-description` : undefined;
  return props.fieldHasError ? errorId : ariaDescribedbyId;
});
</script>

<style lang="css">
.multiple-checkboxes-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
