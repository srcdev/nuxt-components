import type { IFlooredRect } from "../types/components"

export const useNavigationState = () => {
  // Per call, not useState. App-wide keys made two headers share one measurement.
  const navLoaded = ref(false)
  const navigationInitialized = ref(false)
  const navigationWrapperRects = ref<IFlooredRect | null>(null)
  const secondaryNavRects = ref<IFlooredRect | null>(null)

  const clearNavigationCache = () => {
    navLoaded.value = false
    navigationInitialized.value = false
    navigationWrapperRects.value = null
    secondaryNavRects.value = null
  }

  return {
    navLoaded,
    navigationInitialized,
    navigationWrapperRects,
    secondaryNavRects,
    clearNavigationCache,
  }
}
