<template>
  <component :is="tag" class="tests" :class="[elementClasses]">
    <StepperList tag="ul" :connected="false" indicator-alignment="top" :item-count="3">
      <template #indicator-0>
        <slot name="indicator-0"></slot>
      </template>
      <template #item-0>
        <slot name="item-0">
          <p class="page-body-normal">Default slot content for item 1</p>
        </slot>
      </template>

      <template #indicator-1>
        <slot name="indicator-1"></slot>
      </template>
      <template #item-1>
        <slot name="item-1">
          <p class="page-body-normal">Default slot content for item 2</p>
        </slot>
      </template>

      <template #indicator-2>
        <slot name="indicator-2"></slot>
      </template>
      <template #item-2>
        <slot name="item-2">
          <p class="page-body-normal">Default slot content for item 3</p>
        </slot>
      </template>
    </StepperList>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main" | "header" | "footer";
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

// const slots = useSlots();
// const hasDefaultSlot = computed(() => Boolean(slots.default));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.tests {
  /* Component styles */
}
</style>
