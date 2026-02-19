export default defineNuxtPlugin(async () => {
  if (!("anchorName" in document.documentElement.style)) {
    await import("@oddbird/css-anchor-positioning");
  }
});
