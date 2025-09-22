<template>
  <div class="layout-grid-a-wrapper" :class="[elementClasses]">
    <div class="layout-grid-a">
      <div class="slot1">
        <slot name="slot1"></slot>
      </div>
      <div class="slot2">
        <slot name="slot2"></slot>
      </div>
      <div class="slot3">
        <slot name="slot3"></slot>
      </div>
      <div class="slot4">
        <slot name="slot4"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
.layout-grid-a-wrapper {
  container-type: inline-size;

  .layout-grid-a {
    display: grid;
    gap: 20px;

    & > div {
      padding: 20px;
      outline: 1px solid light-dark(black, white);
      border-radius: 5px;
    }

    @container (min-width: 768px) {
      grid-template-columns: repeat(2, auto);
      grid-template-rows: repeat(3, auto);

      .slot1 {
        grid-column: 1 / span 2;
        grid-row: 1;
      }

      .slot2 {
        grid-column: 1 / span 2;
        grid-row: 2;
      }

      .slot3 {
        grid-column: 1;
        grid-row: 3;
      }

      .slot4 {
        grid-column: 2;
        grid-row: 3;
      }
    }

    @container (min-width: 1060px) {
      grid-template-columns: repeat(3, auto);
      grid-template-rows: repeat(2, auto);

      .slot1 {
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      .slot2 {
        grid-column: 2 / span 2;
        grid-row: 1;
      }

      .slot3 {
        grid-column: 2;
        grid-row: 2;
      }

      .slot4 {
        grid-column: 3;
        grid-row: 2;
      }
    }
  }
}
</style>
