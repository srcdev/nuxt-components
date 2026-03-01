<template>
  <component :is="tag" class="indicator-list" :class="[elementClasses]">
    <li v-for="index in itemCount" :key="index" :class="{ 'has-indicator': $slots[`indicator-${index - 1}`] }">
      <div v-if="$slots[`indicator-${index - 1}`]" class="indicator-list__indicator">
        <slot :name="`indicator-${index - 1}`"></slot>
      </div>
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
.indicator-list {
  list-style: none;
  counter-reset: indicator-list;
  padding: 0;

  li {
    counter-increment: indicator-list;
    position: relative;
    padding-inline-start: 4rem;
    padding-block: 1.2rem;

    &::before {
      content: counter(indicator-list);
      position: absolute;
      left: 0;

      /* Decorate freely from here */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--indicator-list-counter-background);
      color: var(--indicator-list-counter-text);
      width: 3rem;
      height: 3rem;
      border-radius: 100vw;
      font-size: 1.4rem;
      font-weight: 600;
    }

    &.has-indicator::before {
      display: none;
    }

    .indicator-list__indicator {
      position: absolute;
      left: 0;
      top: 1.2rem;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      .indicator-icon {
        color: var(--indicator-list-icon);
        width: 2.2rem;
        height: 2.2rem;
      }
    }
  }
}
</style>
