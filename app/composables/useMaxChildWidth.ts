import type { Ref } from "vue";

/**
 * useMaxChildWidth composable
 * Measures the widest child element matching a selector inside a container and returns a reactive pixel width.
 * @param selector - CSS selector for child elements to measure
 * @param fallback - fallback width if no children found (default: "100px")
 * @returns { maxChildWidth, itemsContainer, updateMaxChildWidth }
 */
export function useMaxChildWidth(selector: string, fallback = "100px") {
  const maxChildWidth = ref<string>(fallback);
  const itemsContainer = ref<HTMLElement | null>(null);

  function updateMaxChildWidth() {
    if (!itemsContainer.value) return;
    const labels = itemsContainer.value.querySelectorAll(selector);
    let maxWidth = 0;
    labels.forEach((label) => {
      const width = (label as HTMLElement).offsetWidth;
      if (width > maxWidth) maxWidth = width;
    });
    maxChildWidth.value = maxWidth > 0 ? `${maxWidth}px` : fallback;
  }

  return {
    maxChildWidth,
    itemsContainer,
    updateMaxChildWidth,
  };
}
