<template>
  <component :is="tag" class="display-card" :class="[variant, elementClasses]">
    <div v-if="slots.header" class="display-card-header">
      <slot name="header"></slot>
    </div>
    <div v-if="slots.default" class="display-card-content">
      <slot name="default"></slot>
    </div>
    <div v-if="slots.footer" class="display-card-footer">
      <slot name="footer"></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: "div",
    validator(value: string) {
      return ["div", "section", "article", "aside", "main", "nav"].includes(value)
    },
  },
  variant: {
    type: String,
    default: "subtle",
    validator(value: string) {
      return ["solid", "subtle", "soft", "outline"].includes(value)
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const slots = useSlots()

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
.display-card {
  --_inner-padding: 1rem;

  display: grid;
  grid-auto-flow: row;
  /* gap: 1rem; */
  border-radius: 0.5rem;
  overflow: hidden;

  &.solid {
    background-color: light-dark(var(--gray-0), var(--gray-12));
    border: 0.2rem solid light-dark(var(--gray-4), var(--gray-8));
  }

  &.subtle {
    background-color: color-mix(in oklab, light-dark(var(--gray-1), var(--gray-8)) 50%, transparent);
    border: 0.2rem solid light-dark(var(--gray-3), var(--gray-9));
  }

  &.soft {
    background-color: color-mix(in oklab, light-dark(var(--gray-1), var(--gray-8)) 20%, transparent);
    box-shadow: 0px 0px 4px 2px color-mix(in oklab, light-dark(var(--gray-2), var(--gray-8)) 80%, transparent);
  }

  &.outline {
    background-color: transparent;
    border: 0.2rem solid light-dark(var(--gray-4), var(--gray-8));
  }

  .display-card-header {
    /* background-color: darkblue; */
    padding: var(--_inner-padding);
    border-bottom: 0.2rem solid light-dark(var(--gray-1), var(--gray-8));
  }

  .display-card-content {
    /* background-color: darkgreen; */
    padding: var(--_inner-padding);
    border-bottom: 0.2rem solid light-dark(var(--gray-1), var(--gray-8));
  }

  .display-card-footer {
    /* background-color: darkslateblue; */
    padding: var(--_inner-padding);
  }
}
</style>
