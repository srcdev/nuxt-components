/**
 * Composable for managing tooltip guides with automatic sequential popover display
 *
 * @param containerRef - Template ref to the container element containing the popovers
 * @param options - Configuration options
 * @returns Object with guide controls and state
 */
export const useTooltipsGuide = (
  containerRef: Ref<HTMLElement | null>,
  options: {
    autoStart?: boolean
    startDelay?: number
  } = {}
) => {
  const { autoStart = true, startDelay = 2000 } = options

  // State management
  const isGuideRunning = ref(false)
  const currentTooltipIndex = ref(0)
  const autoRunGuide = ref(autoStart)

  // Internal popover collection
  const popovers: HTMLElement[] = []

  /**
   * Initialize popovers array from the container
   */
  const initializePopovers = () => {
    popovers.length = 0 // Clear existing
    containerRef.value?.querySelectorAll<HTMLElement>("[popover]").forEach((popover) => {
      popovers.push(popover)
    })
  }

  const findTrigger = (popover: HTMLElement) =>
    document.querySelector<HTMLElement>(`[popovertarget="${popover.id}"][popovertargetaction="toggle"]`)

  // Without the Popover API (Safari 16) there's no togglePopover() and :popover-open throws, so
  // tooltips are driven through their trigger, whose aria-expanded tracks the open state everywhere.
  const closePopover = (popover: HTMLElement) => {
    const trigger = findTrigger(popover)
    if (trigger?.getAttribute("aria-expanded") === "true") {
      trigger.click()
      return
    }
    if (typeof popover.hidePopover !== "function") return
    try {
      if (popover.matches(":popover-open")) popover.hidePopover()
    } catch {
      // :popover-open unsupported
    }
  }

  /**
   * Show a tooltip and wait for user dismissal
   */
  const showTooltipAndWaitForDismiss = (popover: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      const triggerButton = findTrigger(popover)

      // Use the trigger button to show the popover to maintain proper anchor relationship
      if (triggerButton) {
        triggerButton.click()
      } else if (typeof popover.togglePopover === "function") {
        popover.togglePopover(true)
      } else {
        resolve()
        return
      }

      // Find the close button within this popover
      const closeButton = popover.querySelector<HTMLElement>('[popovertargetaction="hide"]')

      if (closeButton) {
        // Listen for click on the close button
        const handleClose = () => {
          closeButton.removeEventListener("click", handleClose)
          resolve()
        }

        closeButton.addEventListener("click", handleClose)
      } else if (triggerButton) {
        // No close button: resolve once the trigger reports the tooltip closed
        const observer = new MutationObserver(() => {
          if (triggerButton.getAttribute("aria-expanded") === "false") {
            observer.disconnect()
            resolve()
          }
        })
        observer.observe(triggerButton, { attributes: true, attributeFilter: ["aria-expanded"] })
      } else {
        const handleToggle = (event: Event) => {
          if ((event as Event & { newState?: string }).newState === "closed") {
            popover.removeEventListener("toggle", handleToggle)
            resolve()
          }
        }

        popover.addEventListener("toggle", handleToggle)
      }
    })
  }

  /**
   * Start the automatic tooltip guide
   */
  const startGuide = async () => {
    if (isGuideRunning.value || popovers.length === 0) return

    isGuideRunning.value = true
    currentTooltipIndex.value = 0

    for (let i = 0; i < popovers.length; i++) {
      const popover = popovers[i]
      if (popover) {
        currentTooltipIndex.value = i
        await showTooltipAndWaitForDismiss(popover)
      }
    }

    // Guide completed
    autoRunGuide.value = false
    isGuideRunning.value = false
  }

  /**
   * Restart the tooltip guide
   */
  const restartGuide = async () => {
    if (isGuideRunning.value) return

    // Close any currently open popovers
    popovers.forEach(closePopover)

    // Reset state and start the guide
    autoRunGuide.value = true
    await startGuide()
  }

  /**
   * Stop the current guide
   */
  const stopGuide = () => {
    if (!isGuideRunning.value) return

    // Close any currently open popovers
    popovers.forEach(closePopover)

    isGuideRunning.value = false
    autoRunGuide.value = false
  }

  /**
   * Initialize and auto-start if enabled
   */
  const initialize = async () => {
    if (startDelay > 0) {
      await useSleep(startDelay)
    }

    initializePopovers()

    if (autoRunGuide.value && popovers.length > 0) {
      await startGuide()
    }
  }

  // Auto-initialize on mount
  onMounted(initialize)

  return {
    // State
    isGuideRunning: readonly(isGuideRunning),
    currentTooltipIndex: readonly(currentTooltipIndex),
    autoRunGuide: readonly(autoRunGuide),

    // Methods
    startGuide,
    restartGuide,
    stopGuide,
    initializePopovers,

    // Computed
    hasPopovers: computed(() => popovers.length > 0),
    totalPopovers: computed(() => popovers.length),
  }
}

export type TooltipsGuide = ReturnType<typeof useTooltipsGuide>

export default useTooltipsGuide
