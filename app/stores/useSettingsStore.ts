// const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useSettingsStore = defineStore(
  "useSettingsStore",
  () => {
    // State
    const colourScheme = ref<"auto" | "dark" | "light">("auto")

    // Getters
    const currentColourScheme = computed(() => colourScheme.value)

    // Actions
    const setColourScheme = (newVal: "auto" | "dark" | "light") => {
      colourScheme.value = newVal

      if (import.meta.client && newVal !== null) {
        document.documentElement.dataset.colorScheme = newVal
      }
    }

    return {
      colourScheme,
      currentColourScheme,
      setColourScheme,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
)
