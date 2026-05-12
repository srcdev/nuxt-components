<template>
  <div class="form-wrapper" :class="width">
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: "narrow" | "medium" | "wide";
}

const props = withDefaults(defineProps<Props>(), {
  width: "narrow",
});
</script>

<style lang="css">
@layer components {
.form-wrapper {
  outline: 0rem solid var(--slate-10);
  padding-bottom: 2rem;
  margin-trim: block;

  &.narrow {
    max-width: 400px;
  }

  &.medium {
    max-width: 800px;
  }

  &.wide {
    max-width: 1200px;
  }
}
}
</style>
