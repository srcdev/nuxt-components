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
    type: String as PropType<FormSize>,
    default: "medium",
  },
  optionsLayout: {
    type: String as PropType<OptionsLayout>,
    default: "equal-widths",
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
    type: String as PropType<FormTheme>,
    default: "primary",
  },
  direction: {
    type: String as PropType<"row" | "row-reverse">,
    default: "row",
    validator(value: string) {
      return ["row", "row-reverse"].includes(value);
    },
  },
  displayAsLozenge: {
    type: Boolean,
    default: false,
  },
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
