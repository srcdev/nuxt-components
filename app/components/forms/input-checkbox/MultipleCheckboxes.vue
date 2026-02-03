<template>
  <FormFieldset
    :id
    :name
    :legend
    :fieldHasError
    :required
    :data-testid
    :styleClassPassthrough="['multiple-checkboxes-fieldset', elementClasses]"
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
            type="checkbox"
            :id="`${name}-${item.value}`"
            :name
            :required
            :label="item.label"
            :field-has-error
            v-model="modelValue"
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
            type="checkbox"
            :id="`${name}-${item.value}`"
            :name
            :required
            :label="item.label"
            :field-has-error
            v-model="modelValue"
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
      <InputError :errorMessage="errorMessage" :showError="fieldHasError" :id="errorId" :isDetached="true" />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators";
import type { IOptionsConfig, IFormMultipleOptions } from "../../../types/forms/types.forms";

const props = defineProps({
  dataTestid: {
    type: String,
    default: "multiple-checkboxes",
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
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  isButton: {
    type: Boolean,
    default: false,
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
  direction: {
    type: String as PropType<"row" | "row-reverse">,
    default: "row",
    validator(value: string) {
      return ["row", "row-reverse"].includes(value);
    },
  },
  displayAsDisc: {
    type: Boolean,
    default: false,
  },
  displayAsLozenge: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();

const modelValue = defineModel();
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
