/**
 * useMaxChildWidth composable
 * Measures the widest child element matching a selector inside a container and returns a reactive pixel width.
 * @param selector - CSS selector for child elements to measure
 * @param fallback - fallback width if no children found (default: "100px")
 * @param refKey - template ref name of the container element (default: "itemsContainer", i.e. `ref="itemsContainer"`)
 * @returns { maxChildWidth, updateMaxChildWidth }
 */
export function useMaxChildWidth(selector: string, fallback = "100px", refKey = "itemsContainer") {
  const maxChildWidth = ref<string>(fallback);
  const itemsContainer = useTemplateRef<HTMLElement>(refKey);

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
    updateMaxChildWidth,
  };
}
