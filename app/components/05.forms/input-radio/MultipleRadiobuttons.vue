<template>
  <FormFieldset
    :id
    :name
    :legend
    group-role="radiogroup"
    :field-has-error
    :required
    :data-testid
    :style-class-passthrough="['multiple-radiobuttons-fieldset', elementClasses]"
  >
    <template #content>
      <InputDescription
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

      <div ref="itemsContainer" class="multiple-radiobuttons-items" :data-options-layout="optionsLayout">
        <template v-for="item in fieldData.data" :key="item.id">
          <InputCheckboxRadioButton
            v-if="isButton"
            :id="`${name}-${item.value}`"
            v-model="modelValue"
            type="radio"
            :name
            :required
            :label="item.label"
            :field-has-error
            :true-value="item.value"
            :options-layout
            :theme
            :input-variant
            :direction
            :aria-describedby="ariaDescribedby()"
            :is-pill="isPill"
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
          <InputCheckboxRadioField
            v-else
            v-model="modelValue"
            type="radio"
            :name
            :required
            :label="item.label"
            :field-has-error
            :true-value="item.value"
            :theme
            :input-variant
            :aria-describedby="ariaDescribedby()"
          >
            <template #checkedIcon>
              <slot name="checkedIcon"></slot>
            </template>
          </InputCheckboxRadioField>
        </template>
      </div>
      <InputError :id="errorId" :error-message="errorMessage" :show-error="fieldHasError" :is-detached="true" :input-variant />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import type { FormUiTheme, OptionsLayout, IFormMultipleOptions, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  name: string;
  legend: string;
  isButton?: boolean;
  isPill?: boolean;
  errorMessage: string | object;
  required?: boolean;
  fieldHasError?: boolean;
  optionsLayout?: OptionsLayout;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
  direction?: "row" | "row-reverse";
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "multiple-radio-buttons",
  isButton: false,
  isPill: false,
  required: false,
  fieldHasError: false,
  optionsLayout: "equal-widths",
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
  direction: "row",
});

const slots = useSlots();

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>({ required: true });
const fieldData = defineModel<IFormMultipleOptions>("fieldData", { required: true });

const { maxChildWidth, updateMaxChildWidth } = useMaxChildWidth(
  ".input-checkbox-radio-field-label",
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
@layer components {
.multiple-radiobuttons-items {
  display: flex;
  gap: var(--multiple-radiobuttons-gap, 1.2rem);
  margin-block-start: var(--multiple-radiobuttons-margin-block-start, 1.2rem);

  &[data-options-layout="inline"] {
    flex-direction: row;
    flex-wrap: wrap;
  }

  &[data-options-layout="block"] {
    flex-direction: column;
  }

  &[data-options-layout="equal-widths"] {
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
}
</style>
