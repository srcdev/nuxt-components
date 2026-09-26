<template>
  <div
    class="form-field"
    :class="elementClasses"
    :data-width="width"
    :data-has-gutter="hasGutter ? '' : null"
    :data-invalid="fieldHasError ? '' : null"
  >
    <div class="form-field-inner">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: "narrow" | "medium" | "wide";
  fieldHasError?: boolean;
  hasGutter?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  width: "narrow",
  fieldHasError: false,
  hasGutter: true,
  styleClassPassthrough: () => [],
});

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
  .form-field {
    --_max-width: var(--form-field-max-width-narrow, 400px);
    --_gutter-width: 0rem;

    background-color: var(--form-field-background-color, transparent);
    border-radius: var(--form-field-border-radius, 0.4rem);
    margin-inline: auto;
    margin-block: var(--form-field-margin-block, var(--field-margin-block));
    width: min(100% - calc(2 * var(--_gutter-width)), var(--_max-width));

    &[data-width="medium"] {
      --_max-width: var(--form-field-max-width-medium, 800px);
    }

    &[data-width="wide"] {
      --_max-width: var(--form-field-max-width-wide, 1200px);
    }

    &[data-has-gutter] {
      --_gutter-width: var(--form-field-gutter-width, 1.6rem);
    }
  }
}
</style>
