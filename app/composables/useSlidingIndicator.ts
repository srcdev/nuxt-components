import type { MaybeRefOrGetter } from "vue";

interface SlidingIndicatorOptions {
  axis?: MaybeRefOrGetter<"x" | "y">;
  duration: MaybeRefOrGetter<number>;
}

/**
 * Positions sliding indicators inside a container by writing `--_{name}-start`, `-end`, `-duration`,
 * `-start-delay` and `-end-delay` on it: the edges as insets from the container's start and end along
 * the axis. On a move, the edge in the direction of travel goes first and the trailing edge follows
 * one duration later, so the indicator stretches across and then catches up. Under
 * `prefers-reduced-motion`, or with `animate: false` (mount, resize), both edges snap.
 */
const useSlidingIndicator = (containerRef: Ref<HTMLElement | null>, options: SlidingIndicatorOptions) => {
  // Leading edge each indicator was last sent to, to tell the direction of the next move.
  const lastStart = new Map<string, number>();

  const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

  /** Returns the transition length in ms, or `null` when there was nothing to place. */
  const place = (name: string, target: HTMLElement | null | undefined, animate: boolean): number | null => {
    const container = containerRef.value;
    if (!container || !target) return null;

    const vertical = toValue(options.axis) === "y";
    const start = vertical ? target.offsetTop : target.offsetLeft;
    const size = vertical ? target.offsetHeight : target.offsetWidth;
    const end = (vertical ? container.clientHeight : container.clientWidth) - start - size;

    const previous = lastStart.get(name);
    const duration = Math.max(0, Number(toValue(options.duration)) || 0);
    const ms = animate && previous !== undefined && !prefersReducedMotion() ? duration : 0;
    const forward = previous !== undefined && start > previous;
    const backward = previous !== undefined && start < previous;
    lastStart.set(name, start);

    container.style.setProperty(`--_${name}-duration`, ms + "ms");
    container.style.setProperty(`--_${name}-start-delay`, forward ? ms + "ms" : "0ms");
    container.style.setProperty(`--_${name}-end-delay`, backward ? ms + "ms" : "0ms");
    container.style.setProperty(`--_${name}-start`, start + "px");
    container.style.setProperty(`--_${name}-end`, end + "px");

    return ms;
  };

  /** Forgets where an indicator was, so its next placement snaps instead of sliding in from there. */
  const reset = (name: string) => {
    lastStart.delete(name);
  };

  return { place, reset };
};

export default useSlidingIndicator;
