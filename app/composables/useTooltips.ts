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

  /**
   * Show a tooltip and wait for user dismissal
   */
  const showTooltipAndWaitForDismiss = (popover: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      // Find the trigger button that corresponds to this popover
      const popoverId = popover.id
      const triggerButton = document.querySelector<HTMLElement>(
        `[popovertarget="${popoverId}"][popovertargetaction="toggle"]`
      )

      // Use the trigger button to show the popover to maintain proper anchor relationship
      if (triggerButton) {
        triggerButton.click()
      } else {
        // Fallback if no trigger button found
        popover.togglePopover(true)
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
      } else {
        // Fallback: listen for the popover to be hidden
        const handleToggle = () => {
          if (!popover.matches(":popover-open")) {
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
    popovers.forEach((popover) => {
      if (popover.matches(":popover-open")) {
        popover.togglePopover(false)
      }
    })

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
    popovers.forEach((popover) => {
      if (popover.matches(":popover-open")) {
        popover.togglePopover(false)
      }
    })

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
