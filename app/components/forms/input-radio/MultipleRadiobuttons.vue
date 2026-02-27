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

      <div ref="itemsContainer" class="multiple-radiobuttons-items" :class="[optionsLayout]">
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
import type { FormUiTheme, OptionsLayout, IFormMultipleOptions } from "~/types/forms/types.forms";

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
  optionsLayout?: OptionsLayout;
  equalCols?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
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
  optionsLayout: "equal-widths",
  equalCols: true,
  styleClassPassthrough: () => [],
  theme: "default",
  direction: "row",
  displayAsLozenge: false,
});

const slots = useSlots();

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();
const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>;

const { maxChildWidth, itemsContainer, updateMaxChildWidth } = useMaxChildWidth(
  ".input-checkbox-radio-label, .input-checkbox-radio-with-label-label",
  "100px"
);

onMounted(() => {
  updateMaxChildWidth();
});

watch(
  () => fieldData.value.data,
  () => {
    nextTick(updateMaxChildWidth);
  }
);
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
    grid-template-columns: repeat(
      auto-fit,
      minmax(
        calc(var(--input-checked-icon-gap) + (2 * var(--input-checkbox-label-padding-inline)) + v-bind(maxChildWidth)),
        1fr
      )
    );
  }
}
</style>
