<template>
  <fieldset
    :id="id"
    :role="groupRole === 'radiogroup' ? 'radiogroup' : undefined"
    :aria-required="groupRole === 'radiogroup' && required ? 'true' : undefined"
    :aria-invalid="fieldHasError"
    :name="name"
    class="form-fieldset"
    :class="elementClasses"
    :data-testid="dataTestid"
  >
    <legend v-if="legend || slots.legend" class="form-fieldset-legend">
      <slot name="legend">{{ legend }}</slot>
    </legend>

    <div class="form-fieldset-content">
      <slot name="content"></slot>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  name: string;
  legend?: string;
  groupRole?: "group" | "radiogroup";
  required?: boolean;
  fieldHasError?: boolean;
  dataTestid?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  legend: "",
  groupRole: "group",
  required: false,
  fieldHasError: false,
  dataTestid: "",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
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
  .form-fieldset {
    margin-block: var(--form-fieldset-margin-block, 0);
    margin-inline: var(--form-fieldset-margin-inline, 0);
    padding-block: var(--form-fieldset-padding-block, 0);
    padding-inline: var(--form-fieldset-padding-inline, 0);
    border: var(--form-fieldset-border, 0);
    border-radius: var(--form-fieldset-border-radius, 0);
    outline: var(--form-fieldset-outline, 0);
    outline-offset: var(--form-fieldset-outline-offset, 0);

    .form-fieldset-legend {
      color: var(--form-fieldset-legend-color, inherit);
      margin-block: var(--form-fieldset-legend-margin-block, 0.8rem);
      margin-inline: var(--form-fieldset-legend-margin-inline, 0);
      font-size: var(--form-fieldset-legend-font-size, var(--step-5));
      font-weight: var(--form-fieldset-legend-font-weight, normal);
      line-height: var(--form-fieldset-legend-line-height, 1.5);
    }

    .form-fieldset-content {
      margin-block: var(--form-fieldset-content-margin-block, 0);
      margin-inline: var(--form-fieldset-content-margin-inline, 0);
    }
  }
}
</style>
