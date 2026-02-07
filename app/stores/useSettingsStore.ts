// const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useSettingsStore = defineStore(
  "useSettingsStore",
  () => {
    // State
    const colourScheme = ref<"system" | "dark" | "light">("system");

    // Getters
    const currentColourScheme = computed(() => colourScheme.value);

    // Actions
    const setColourScheme = (newVal: "system" | "dark" | "light") => {
      colourScheme.value = newVal;

      if (import.meta.client && newVal !== null) {
        // Remove existing color scheme classes
        document.documentElement.classList.remove("system", "dark", "light");
        // Add the new color scheme class
        document.documentElement.classList.add(newVal);
      }
    };

    return {
      colourScheme,
      currentColourScheme,
      setColourScheme,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
