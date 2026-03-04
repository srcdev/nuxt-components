<template>
  <component :is="tag" class="indicator-list" :class="[elementClasses, { 'has-connectors': props.showConnectors }]">
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
  showConnectors?: boolean;
  itemCount: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "ul",
  indicatorAlignment: "top",
  indicatorVariant: "disc",
  showConnectors: true,
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.indicator-list {
  --_list-padding-block: 1.2rem;
  --_counter-size: 3rem;
  --_indicator-list-connector-width: 0.2rem;

  list-style: none;
  counter-reset: indicator-list;
  padding: 0;

  li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2.2rem;
    counter-increment: indicator-list;
    padding-inline-start: 0rem;
    padding-block: var(--_list-padding-block);
    position: relative;

    &.indicator-top {
      align-items: start;
    }

    &.indicator-center {
      align-items: center;
    }

    .indicator-list__indicator-counter::before {
      content: counter(indicator-list);

      display: grid;
      place-content: center;
      width: var(--_counter-size);
      height: var(--_counter-size);
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

    .indicator-list__indicator-custom,
    .indicator-list__indicator-counter {
      anchor-name: --indicator-bubble;
    }

    .indicator-list__indicator-custom {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      .indicator-icon {
        color: var(--indicator-list-icon);
        width: var(--_counter-size);
        height: var(--_counter-size);
      }
    }
  }
}

/* Fallback: per-li connectors for browsers without anchor positioning */
/* @supports not (anchor-name: --x) { */
.indicator-list.has-connectors li:not(:last-child)::after {
  content: "";
  position: absolute;
  left: calc(var(--_counter-size) / 2);
  transform: translateX(-50%);
  top: calc(1.2rem + 3rem);
  bottom: calc(-1 * var(--_list-padding-block));
  width: var(--_indicator-list-connector-width);
  background-color: var(--indicator-list-connector-color, currentColor);
}
/* } */

/* Enhanced: anchor-based connector positioning */
/* @supports (anchor-name: --x) {
  .indicator-list.has-connectors li:not(:last-child)::after {
    content: "";
    position: absolute;
    left: anchor(--indicator-bubble, center);
    transform: translateX(-50%);
    top: anchor(--indicator-bubble, bottom);
    bottom: calc(-1 * var(--indicator-list-item-gap, 2.4rem));
    width: var(--indicator-list-connector-width, 2px);
    background-color: var(--indicator-list-connector-color, currentColor);
  }
} */
</style>
