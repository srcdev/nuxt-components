<template>
  <div class="page-hero-highlights-header" :class="elementClasses">
    <div class="phh-start">
      <slot name="start"></slot>
    </div>
    <div v-if="hasEndSlot" class="phh-end">
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
const hasEndSlot = computed(() => Boolean(slots.end));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.page-hero-highlights-header {
  /* User themable tokens */
  --phh-padding-block-mobile: 1.6rem 3.2rem;
  --phh-padding-block-tablet: 2.4rem 4.8rem;
  --phh-padding-block-desktop: 3.2rem 6.4rem;
  --phh-gap: 1.6rem;
  --phh-end-gap: 0.8rem;

  display: flex;
  flex-direction: column;
  gap: var(--phh-gap);

  padding-block: var(--phh-padding-block-mobile);

  @container (width >= 768px) {
    padding-block: var(--phh-padding-block-tablet);
  }
  @container (width >= 1024px) {
    padding-block: var(--phh-padding-block-desktop);
  }

  &:has(.phh-end) {
    @container (width >= 768px) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  .phh-start {
    /* flex: 1; */
  }

  .phh-end {
    display: flex;
    align-items: center;
    gap: var(--phh-end-gap);
    /* flex-shrink: 0; */
  }
}
</style>
