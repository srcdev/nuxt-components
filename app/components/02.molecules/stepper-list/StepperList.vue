<template>
  <component :is="tag" ref="listEl" class="stepper-list" :class="[elementClasses, { 'has-connectors': props.connected }]">
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
          $slots[`indicator-${index - 1}`] ? 'stepper-list__indicator-custom' : 'stepper-list__indicator-counter'
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
  connected?: boolean;
  itemCount: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "ul",
  indicatorAlignment: "top",
  indicatorVariant: "disc",
  connected: true,
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const listEl = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

function updateConnectors() {
  if (!listEl.value || !props.connected) return;
  const lis = Array.from(listEl.value.querySelectorAll<HTMLLIElement>(":scope > li"));

  lis.forEach((li, i) => {
    if (i >= lis.length - 1) return;

    const indicator = li.querySelector<HTMLElement>(
      ".stepper-list__indicator-counter, .stepper-list__indicator-custom",
    );
    const nextIndicator = lis[i + 1]?.querySelector<HTMLElement>(
      ".stepper-list__indicator-counter, .stepper-list__indicator-custom",
    );

    if (!indicator || !nextIndicator) return;

    const liRect = li.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    const nextIndicatorRect = nextIndicator.getBoundingClientRect();

    li.style.setProperty("--_connector-top", `${indicatorRect.bottom - liRect.top}px`);
    li.style.setProperty("--_connector-height", `${Math.max(0, nextIndicatorRect.top - indicatorRect.bottom)}px`);
  });
}

onMounted(() => {
  updateConnectors();
  if (typeof ResizeObserver !== "undefined" && listEl.value) {
    resizeObserver = new ResizeObserver(updateConnectors);
    resizeObserver.observe(listEl.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(
  () => [props.itemCount, props.connected, props.indicatorAlignment],
  async () => {
    await nextTick();
    updateConnectors();
  },
);
</script>

<style lang="css">
@layer components {
.stepper-list {
  --_list-padding-block: 1.2rem;
  --_counter-size: 3rem;
  --_stepper-list-connector-width: 0.2rem;

  list-style: none;
  counter-reset: stepper-list;
  padding: 0;

  li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2.2rem;
    counter-increment: stepper-list;
    padding-inline-start: 0rem;
    padding-block: var(--_list-padding-block);
    position: relative;

    &.indicator-top {
      align-items: start;
    }

    &.indicator-center {
      align-items: center;
    }

    .stepper-list__indicator-counter::before {
      content: counter(stepper-list);

      display: grid;
      place-content: center;
      width: var(--_counter-size);
      height: var(--_counter-size);
      font-size: 1.4rem;
      font-weight: 600;
    }

    &.indicator-circle .stepper-list__indicator-counter::before {
      background-color: var(--stepper-list-counter-circle-background);
      color: var(--stepper-list-counter-circle-text);
      border: 2px solid var(--stepper-list-counter-circle-border);
      border-radius: 100vw;
    }

    &.indicator-disc .stepper-list__indicator-counter::before {
      background-color: var(--stepper-list-counter-disc-background);
      color: var(--stepper-list-counter-disc-text);
      border: 2px solid var(--stepper-list-counter-disc-border);
      border-radius: 100vw;
    }

    &.indicator-square .stepper-list__indicator-counter::before {
      background-color: var(--stepper-list-counter-square-background);
      color: var(--stepper-list-counter-square-text);
      border: 2px solid var(--stepper-list-counter-square-border);
      border-radius: 0.25rem;
    }

    &.has-indicator::before {
      display: none;
    }

    .stepper-list__indicator-custom,
    .stepper-list__indicator-counter {
      anchor-name: --indicator-bubble;
    }

    .stepper-list__indicator-custom {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      .indicator-icon {
        color: var(--stepper-list-icon);
        width: var(--_counter-size);
        height: var(--_counter-size);
      }
    }
  }
}

.stepper-list.has-connectors li:not(:last-child)::after {
  content: "";
  position: absolute;
  left: calc(var(--_counter-size) / 2);
  transform: translateX(-50%);
  /* JS sets --_connector-top and --_connector-height from measured indicator positions.
     The fallback values handle the indicator-top case before JS runs. */
  top: var(--_connector-top, calc(var(--_list-padding-block) + var(--_counter-size)));
  height: var(--_connector-height, auto);
  bottom: calc(-1 * var(--_list-padding-block));
  width: var(--_stepper-list-connector-width);
  background-color: var(--stepper-list-connector-color, currentColor);
}
}
</style>
