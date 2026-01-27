import type { IFlooredRect } from "../types/components"

export const useNavigationState = () => {
  // Simple reactive refs that persist across route changes using useState
  const navLoaded = useState<boolean>("nav-loaded", () => false)
  const navigationInitialized = useState<boolean>("nav-initialized", () => false)

  // Navigation rects cache
  const navigationWrapperRects = useState<IFlooredRect | null>("nav-wrapper-rects", () => null)
  const secondaryNavRects = useState<IFlooredRect | null>("secondary-nav-rects", () => null)

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
