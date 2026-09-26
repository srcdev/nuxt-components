<template>
  <div class="form-wrapper" :class="elementClasses" :data-width="width">
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: "narrow" | "medium" | "wide";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  width: "narrow",
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
  .form-wrapper {
    --_max-width: var(--form-wrapper-max-width-narrow, 400px);

    container: form-wrapper / var(--form-wrapper-container-type, inline-size);
    max-width: var(--_max-width);
    margin-block: var(--form-wrapper-margin-block, 0);
    margin-inline: var(--form-wrapper-margin-inline, 0);
    padding-block: var(--form-wrapper-padding-block, 0 2rem);
    padding-inline: var(--form-wrapper-padding-inline, 0);
    border: var(--form-wrapper-border, 0);
    border-radius: var(--form-wrapper-border-radius, 0);
    outline: var(--form-wrapper-outline, 0);
    outline-offset: var(--form-wrapper-outline-offset, 0);
    margin-trim: block;

    &[data-width="medium"] {
      --_max-width: var(--form-wrapper-max-width-medium, 800px);
    }

    &[data-width="wide"] {
      --_max-width: var(--form-wrapper-max-width-wide, 1200px);
    }
  }
}
</style>
