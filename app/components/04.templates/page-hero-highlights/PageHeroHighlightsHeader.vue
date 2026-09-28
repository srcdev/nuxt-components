<template>
  <div class="page-hero-highlights-header" :class="elementClasses">
    <div class="page-hero-highlights-header-start">
      <slot name="start"></slot>
    </div>
    <div v-if="hasEndSlot()" class="page-hero-highlights-header-end">
      <slot name="end"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const hasEndSlot = () => Boolean(slots.end);

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
  .page-hero-highlights-header {
    display: flex;
    flex-direction: column;
    gap: var(--page-hero-highlights-header-gap, 1.6rem);
    padding-block: var(--page-hero-highlights-header-padding-block-mobile, 1.6rem 3.2rem);

    @container (width >= 768px) {
      padding-block: var(--page-hero-highlights-header-padding-block-tablet, 2.4rem 4.8rem);
    }

    @container (width >= 1024px) {
      padding-block: var(--page-hero-highlights-header-padding-block-desktop, 3.2rem 6.4rem);
    }

    &:has(.page-hero-highlights-header-end) {
      @container (width >= 768px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: flex-end;
        justify-content: space-between;
      }
    }

    .page-hero-highlights-header-end {
      display: flex;
      align-items: center;
      gap: var(--page-hero-highlights-header-end-gap, 0.8rem);
    }
  }
}
</style>
