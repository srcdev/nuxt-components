<template>
  <div
    class="form-field"
    :class="[width, styleClassPassthrough, { 'has-gutter': hasGutter }]"
    :data-invalid="fieldHasError ? true : undefined"
  >
    <div class="form-field-inner">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String as PropType<string>,
    default: "narrow",
    validator: (val: string) => ["narrow", "medium", "wide"].includes(val),
  },
  fieldHasError: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  hasGutter: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  styleClassPassthrough: {
    type: String,
    default: "",
  },
});
</script>

<style lang="css">
@layer components {
  .form-field {
    --_gutter-width: 0rem;
    --_max-width: 400px;
    --_background-color: transparent;
    --_border-radius: 0.4rem;

    background-color: var(--_background-color);
    border-radius: var(--_border-radius);
    margin-inline: auto;
    margin-block: var(--field-margin-block);

    width: min(100% - calc(2 * var(--_gutter-width)), var(--_max-width));
    outline: 0rem solid var(--slate-05);
    /* overflow-block: hidden; */

    &:has(.underline) {
      --_background-color: var(--theme-form-input-bg-underlined);
    }

    .form-field-inner {
      background-color: var(--_background-color);
      border-radius: var(--_border-radius);
      margin-inline-start: 0rem;
      padding-inline-start: 0rem;
      outline: 0 solid var(--slate-05);
    }

    &.has-gutter {
      --_gutter-width: 1.6rem;
    }

    &.narrow {
      max-width: 400px;
    }

    &.medium {
      --_max-width: 800px;
    }

    &.wide {
      --_max-width: 1200px;
    }
  }
}
</style>
