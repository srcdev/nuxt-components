// const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useSettingsStore = defineStore(
  "useSettingsStore",
  () => {
    // State
    const colourScheme = ref<"system" | "dark" | "light">("system");

    // Getters - removed unnecessary computed wrapper

    // Actions
    const setColourScheme = (newVal: "system" | "dark" | "light") => {
      // Early return if value hasn't changed
      if (colourScheme.value === newVal) return;

      colourScheme.value = newVal;

      if (import.meta.client && newVal !== null) {
        // Cache DOM element reference - use body instead of html for iOS 18 compatibility
        const bodyElement = document.body;
        // Remove existing color scheme classes
        bodyElement.classList.remove("system", "dark", "light");
        // Add the new color scheme class
        bodyElement.classList.add(newVal);
      }
    };

    return {
      colourScheme,
      setColourScheme,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
);
