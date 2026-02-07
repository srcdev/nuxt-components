// Initialize color scheme on app load
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const settingsStore = useSettingsStore();

    // Initialize the color scheme on page load
    nextTick(() => {
      settingsStore.setColourScheme(settingsStore.colourScheme);
    });
  }
});
