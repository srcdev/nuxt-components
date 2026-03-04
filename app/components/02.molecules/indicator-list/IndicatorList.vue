<template>
  <component :is="tag" class="indicator-list" :class="[elementClasses]">
    <li
      v-for="index in itemCount"
      :key="index"
      :class="[
        { 'has-indicator': $slots[`indicator-${index - 1}`] },
        `indicator-${props.indicatorAlignment}`,
        `indicator-${props.indicatorVariant}`,
      ]"
    >
      <div
        :class="
          $slots[`indicator-${index - 1}`] ? 'indicator-list__indicator-custom' : 'indicator-list__indicator-counter'
        "
      >
        <slot :name="`indicator-${index - 1}`"></slot>
      </div>
      <div>
        <slot :name="`item-${index - 1}`"></slot>
      </div>
    </li>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "ul" | "ol";
  indicatorAlignment?: "top" | "center";
  indicatorVariant?: "disc" | "square" | "circle";
  itemCount: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "ul",
  indicatorAlignment: "top",
  indicatorVariant: "disc",
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
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2.2rem;
    counter-increment: indicator-list;
    padding-inline-start: 0rem;
    padding-block: 1.2rem;

    &.indicator-top {
      align-items: start;
    }

    &.indicator-center {
      align-items: center;
    }

    .indicator-list__indicator-counter::before {
      content: counter(indicator-list);

      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      font-size: 1.4rem;
      font-weight: 600;
    }

    &.indicator-circle .indicator-list__indicator-counter::before {
      background-color: var(--indicator-list-counter-circle-background);
      color: var(--indicator-list-counter-circle-text);
      border: 2px solid var(--indicator-list-counter-circle-border);
      border-radius: 100vw;
    }

    &.indicator-disc .indicator-list__indicator-counter::before {
      background-color: var(--indicator-list-counter-disc-background);
      color: var(--indicator-list-counter-disc-text);
      border: 2px solid var(--indicator-list-counter-disc-border);
      border-radius: 100vw;
    }

    &.indicator-square .indicator-list__indicator-counter::before {
      background-color: var(--indicator-list-counter-square-background);
      color: var(--indicator-list-counter-square-text);
      border: 2px solid var(--indicator-list-counter-square-border);
      border-radius: 0.25rem;
    }

    &.has-indicator::before {
      display: none;
    }

    .indicator-list__indicator-custom {
      /* position: absolute; */
      /* left: 0; */
      /* top: 1.2rem; */

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
