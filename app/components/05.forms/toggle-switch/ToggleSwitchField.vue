<template>
  <div
    class="toggle-switch-field"
    :class="elementClasses"
    :data-theme="formUiTheme"
    :data-layout="layout"
    :data-invalid="fieldHasError ? '' : null"
  >
    <InputLabel
      :id="toggleSwitchId"
      indicator="none"
      input-variant="normal"
      :field-has-error
      :style-class-passthrough="['toggle-switch-label', 'input-text-label', labelWeightClass]"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
      :description-id
      :field-has-error
      :style-class-passthrough="['toggle-switch-description']"
    >
      <template v-if="slots.descriptionHtml" #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template v-if="slots.descriptionText" #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>

    <ToggleSwitch
      :id
      v-model="modelValue"
      :name
      :required
      :field-has-error
      :true-value
      :false-value
      :theme
      :round
      :aria-describedby="ariaDescribedby()"
    >
      <template v-if="slots.iconOn" #iconOn>
        <slot name="iconOn"></slot>
      </template>

      <template v-if="slots.iconOff" #iconOff>
        <slot name="iconOff"></slot>
      </template>
    </ToggleSwitch>

    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" />
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, LabelWeight } from "~/types/forms/types.forms";

interface Props {
  name: string;
  label: string;
  layout?: "stacked" | "inline";
  labelWeight?: LabelWeight;
  required?: boolean;
  errorMessage?: object | string;
  fieldHasError?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  round?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  layout: "stacked",
  labelWeight: undefined,
  required: false,
  errorMessage: "",
  fieldHasError: false,
  trueValue: true,
  falseValue: false,
  styleClassPassthrough: () => [],
  theme: "default",
  round: true,
});

const slots = useSlots();

const formUiTheme = computed(() => (props.fieldHasError ? "error" : props.theme));

const labelWeightClassMap: Record<LabelWeight, string> = {
  bold: "body-normal-bold",
  "semi-bold": "body-normal-semibold",
  normal: "body-normal",
};

const labelWeightClass = computed(
  () => labelWeightClassMap[props.labelWeight ?? (props.layout === "inline" ? "normal" : "bold")]
);

const id = useId();
const toggleSwitchId = computed(() => `toggle-switch-${id}`);
const descriptionId = computed(() => `${id}-description`);
const errorId = computed(() => `${id}-error-message`);

// A plain function, not a computed: slots aren't reactive (CLAUDE.md pitfall #25).
const ariaDescribedby = () => {
  const ids: string[] = [];
  if (slots.descriptionText || slots.descriptionHtml) ids.push(descriptionId.value);
  if (props.fieldHasError) ids.push(errorId.value);
  return ids.join(" ");
};

const modelValue = defineModel<string | number | boolean>({ required: true });

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .toggle-switch-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;

    .toggle-switch-label {
      display: block;
    }

    &[data-layout="inline"] {
      display: grid;
      grid-template-columns: minmax(0, max-content) auto;
      align-items: center;
      justify-content: start;
      column-gap: var(--toggle-switch-field-inline-gap, 1.2rem);

      > * {
        grid-column: 1 / -1;
      }

      > .toggle-switch-label {
        grid-area: 1 / 1;
      }

      > .toggle-switch {
        grid-area: 1 / 2;
      }
    }
  }
}
</style>
