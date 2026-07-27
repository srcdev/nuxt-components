import type { Ref } from "vue";
import { useElementSize } from "@vueuse/core";

export const containerBreakpointsDefault = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "4k": 2560,
} as const;

export type ContainerBreakpointName = keyof typeof containerBreakpointsDefault;

/**
 * useContainerBreakpoints composable
 * Container-query equivalent of VueUse's useBreakpoints — tracks an element's
 * own width via ResizeObserver instead of the viewport, for layouts where
 * page decoration (nav, sidebars) means viewport width != available width.
 * @param breakpoints - map of breakpoint name to min-width in px (default: containerBreakpointsDefault)
 * @param target - optional existing element ref to observe; creates its own if omitted
 * @returns { el, width, active, greater, greaterOrEqual, smaller, smallerOrEqual, between }
 */
export function useContainerBreakpoints<K extends string = ContainerBreakpointName>(
  breakpoints: Record<K, number> = containerBreakpointsDefault as unknown as Record<K, number>,
  target?: Ref<HTMLElement | null>
) {
  const el = target ?? ref<HTMLElement | null>(null);
  const { width } = useElementSize(el);

  const sortedEntries = (Object.entries(breakpoints) as [K, number][]).sort((a, b) => a[1] - b[1]);

  function greaterOrEqual(name: K) {
    return computed(() => width.value >= breakpoints[name]);
  }

  function greater(name: K) {
    return computed(() => width.value > breakpoints[name]);
  }

  function smaller(name: K) {
    return computed(() => width.value < breakpoints[name]);
  }

  function smallerOrEqual(name: K) {
    return computed(() => width.value <= breakpoints[name]);
  }

  function between(min: K, max: K) {
    return computed(() => width.value >= breakpoints[min] && width.value < breakpoints[max]);
  }

  const active = computed<K | "base">(() => {
    let current: K | "base" = "base";
    for (const [name, minWidth] of sortedEntries) {
      if (width.value >= minWidth) current = name;
    }
    return current;
  });

  return {
    el,
    width,
    active,
    greater,
    greaterOrEqual,
    smaller,
    smallerOrEqual,
    between,
  };
}
