<template>
  <component
    :is="props.tag"
    class="two-column-layout-container"
    :class="[elementClasses]"
    :data-testid="props.dataTestid"
  >
    <div class="two-column-layout">
      <div v-if="slots.col1" class="col-1">
        <slot name="col1"></slot>
      </div>
      <div v-if="slots.col2" class="col-2">
        <slot name="col2"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  dataTestid: {
    type: String,
    default: "two-column-layout",
  },
  tag: {
    type: String,
    default: "div",
    validator(value: string) {
      return ["div", "section", "article", "aside", "header", "footer", "main", "nav"].includes(value);
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});
const slots = useSlots();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.two-column-layout-container {
  container-type: inline-size;
  container-name: two-column-layout;

  .two-column-layout {
    display: grid;
    justify-content: start;
    grid-auto-flow: row;
    gap: 32px;

    @container two-column-layout (width >= 1064px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
