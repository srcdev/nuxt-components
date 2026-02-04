<template>
  <fieldset
    :id
    :aria-required="required"
    :aria-invalid="fieldHasError"
    role="radiogroup"
    :name
    class="form-fieldset"
    :class="[elementClasses, { error: fieldHasError }]"
    :data-testid="dataTestid"
  >
    <legend v-if="legend" class="form-fieldset-legend" :class="[{ 'has-description': slots.description }]">
      <slot name="legend">{{ legend }}</slot>
    </legend>

    <div v-if="slots.description" :id="`${id}-description`" class="form-fieldset-description">
      <slot name="description"></slot>
    </div>

    <div class="form-fieldset-content">
      <slot name="content"></slot>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  legend: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  dataTestid: {
    type: String,
    default: "",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});

const slots = useSlots();
// const hasDescriptionSlot = computed(() => slots.description !== undefined);
const hasDescription = computed(() => slots.description !== undefined);
const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.form-fieldset {
  margin: 0;
  padding: 0;
  border: 0;

  &.single-checkbox-fieldset {
  }

  &.multiple-checkboxes-fieldset {
  }

  &.multiple-radiobuttons-fieldset {
  }

  .form-fieldset-legend {
    color: var(--form-fieldset-legend-color);
    margin-block: 0.8rem;
    font-size: var(--step-5);
    font-weight: normal;
    line-height: 1.5;

    &.has-description {
      margin-bottom: 0;
    }
  }

  .form-fieldset-description {
    font-size: 1.6rem;
    margin-top: 1.2rem;
  }

  .form-fieldset-content {
    margin-block-start: 0;
    margin-block-end: 0;
  }
}
</style>
