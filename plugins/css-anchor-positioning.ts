import polyfill from '@oddbird/css-anchor-positioning/fn';

export default defineNuxtPlugin(() => {
  if (import.meta.client && !('anchorName' in document.documentElement.style)) {
    polyfill({
      elements: undefined,
      excludeInlineStyles: false,
      useAnimationFrame: false,
    });
  }
});
