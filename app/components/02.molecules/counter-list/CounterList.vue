<template>
  <component :is="tag" class="counter-list" :class="[elementClasses]">
    <li v-for="index in itemCount" :key="index">
      <slot :name="`item-${index - 1}`"></slot>
    </li>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "ul" | "ol";
  itemCount: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "ul",
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.counter-list {
  list-style: none;
  counter-reset: counter-list;
  padding: 0;

  li {
    counter-increment: counter-list;
    position: relative;
    padding-inline-start: 3rem;
    padding-block: 1.2rem;

    &::before {
      content: counter(counter-list);
      position: absolute;
      left: 0;

      /* Decorate freely from here */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 100vw;
      font-size: 1.2rem;
      font-weight: 600;
    }
  }
}
</style>
