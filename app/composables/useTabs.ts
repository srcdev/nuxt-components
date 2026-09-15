import { useResizeObserver } from "@vueuse/core"

interface UseTabsOptions {
  trackHover: boolean
  trackActive: boolean
  trackIndicator: boolean
}

const useTabs = (
  axis: string,
  tabsNavRef: Ref<HTMLElement | null>,
  tabsContentRefs: Ref<HTMLElement[] | null>,
  duration: number,
  options: UseTabsOptions = { trackHover: true, trackActive: true, trackIndicator: true }
) => {
  const navItems = ref<HTMLElement[] | null>(null)
  const previousActiveTab = useState<HTMLElement | null>("previousActiveTab", () => null)
  const currentActiveTab = ref<HTMLElement>()

  const previousHoveredTab = ref<HTMLElement>()
  const currentHoveredTab = ref<HTMLElement>()
  const tagName = ref<string>()

  const initNavDecorators = () => {
    navItems.value = tabsNavRef.value
      ? (Array.from(tabsNavRef.value.querySelectorAll("[data-nav-item]")) as HTMLElement[])
      : []

    if (!navItems.value || navItems.value.length === 0) {
      return
    }

    const firstNavItem = navItems.value[0]
    if (!firstNavItem) return

    tagName.value = firstNavItem.tagName.toLowerCase()

    const activeIndex = ref(0)

    // Temporarily set the first nav item as active
    firstNavItem.setAttribute("aria-selected", "true")

    // Test if navItems are hyperlinks
    if (firstNavItem.tagName.toLowerCase() === "a") {
      // Find index of element with class "router-link-active"
      activeIndex.value = navItems.value.findIndex((el) => el.classList.contains("router-link-active"))
    }
    // else {
    //  Set actve tab
    // }

    const activeElement = navItems.value[activeIndex.value]
    if (!activeElement) return

    currentActiveTab.value = activeElement
    currentHoveredTab.value = activeElement

    previousActiveTab.value = activeElement
    previousHoveredTab.value = activeElement

    setRovingTabindex()
    addNavDecorators()
    setActiveTabContent()
  }

  const addNavDecorators = () => {
    if (!tabsNavRef.value) return

    if (options.trackIndicator) {
      tabsNavRef.value.appendChild(Object.assign(document.createElement("div"), { className: "nav__active-indicator" }))
    }
    if (options.trackActive) {
      tabsNavRef.value.appendChild(Object.assign(document.createElement("div"), { className: "nav__active" }))
    }
    if (options.trackHover) {
      tabsNavRef.value.appendChild(Object.assign(document.createElement("div"), { className: "nav__hovered" }))
    }
  }

  const setRovingTabindex = () => {
    navItems.value?.forEach((tab) => {
      tab.setAttribute("tabindex", tab === currentActiveTab.value ? "0" : "-1")
    })
  }

  const navItemHovered = (event: Event) => {
    if (!options.trackHover) return

    const target = event.target as HTMLElement
    const newTabPosition = currentHoveredTab.value ? currentHoveredTab.value.compareDocumentPosition(target) : 0

    if (newTabPosition !== 0) {
      previousHoveredTab.value = currentHoveredTab.value
      currentHoveredTab.value = target
      moveHoveredIndicator()
    }
  }

  const resetHoverToActivePosition = () => {
    if (!options.trackHover) return

    previousHoveredTab.value = currentHoveredTab.value
    currentHoveredTab.value = currentActiveTab.value
    moveHoveredIndicator()
  }

  const activateTab = (target: HTMLElement) => {
    if (target === currentActiveTab.value) return

    previousActiveTab.value = currentActiveTab.value || null
    currentActiveTab.value = target

    navItems.value?.forEach((tab) => {
      tab.setAttribute("aria-selected", currentActiveTab.value === tab ? "true" : "false")
    })

    setRovingTabindex()
    moveActiveIndicator()
    setActiveTabContent()
  }

  const navItemClicked = (event: Event) => {
    activateTab(event.target as HTMLElement)
  }

  // WAI-ARIA Tabs pattern: arrow keys move focus and activate (automatic activation);
  // Home/End jump to the first/last tab.
  const navItemKeydown = (event: KeyboardEvent) => {
    if (!navItems.value || navItems.value.length === 0) return

    const previousKey = axis === "y" ? "ArrowUp" : "ArrowLeft"
    const nextKey = axis === "y" ? "ArrowDown" : "ArrowRight"

    let targetIndex: number | null = null
    const currentIndex = currentActiveTab.value ? navItems.value.indexOf(currentActiveTab.value) : 0

    if (event.key === nextKey) {
      targetIndex = (currentIndex + 1) % navItems.value.length
    } else if (event.key === previousKey) {
      targetIndex = (currentIndex - 1 + navItems.value.length) % navItems.value.length
    } else if (event.key === "Home") {
      targetIndex = 0
    } else if (event.key === "End") {
      targetIndex = navItems.value.length - 1
    }

    if (targetIndex === null) return

    event.preventDefault()
    const targetTab = navItems.value[targetIndex]
    if (!targetTab) return

    targetTab.focus()
    activateTab(targetTab)
  }

  const handleTransitioningClass = () => {
    if (previousHoveredTab.value && currentHoveredTab.value && navItems.value) {
      const newTabPosition = previousHoveredTab.value.compareDocumentPosition(currentHoveredTab.value)
      const navItemsArray = navItems.value

      if (newTabPosition === 4) {
        for (
          let i = navItemsArray.indexOf(previousHoveredTab.value);
          i < navItemsArray.indexOf(currentHoveredTab.value);
          i++
        ) {
          const element = navItemsArray[i]
          if (element) {
            element.classList.add("transitioning")
            if (
              i >= navItemsArray.indexOf(previousHoveredTab.value) &&
              i < navItemsArray.indexOf(currentHoveredTab.value)
            ) {
              setTimeout(() => {
                if (element) {
                  element.classList.remove("transitioning")
                }
                // }, timeout * (i - navItemsArray.indexOf(previousHoveredTab.value) - 1));
              }, duration * 1.5)
            }
          }
        }
      } else {
        for (
          let i = navItemsArray.indexOf(previousHoveredTab.value);
          i > navItemsArray.indexOf(currentHoveredTab.value);
          i--
        ) {
          const element = navItemsArray[i]
          if (element) {
            element.classList.add("transitioning")
            if (
              i <= navItemsArray.indexOf(previousHoveredTab.value) &&
              i > navItemsArray.indexOf(currentHoveredTab.value)
            ) {
              setTimeout(() => {
                if (element) {
                  element.classList.remove("transitioning")
                }
                // }, timeout * (i - navItemsArray.indexOf(previousHoveredTab.value) - 1));
              }, duration * 1.5)
            }
          }
        }
      }
    }
  }

  const setFinalHoveredPositions = (resized: boolean = false) => {
    const setDuration = resized ? 0 : duration
    // const tabsNavRefYPosition = tabsNavRef.value?.getBoundingClientRect().top || 0;
    const newTabWidth =
      currentHoveredTab.value && tabsNavRef.value
        ? currentHoveredTab.value.offsetWidth / tabsNavRef.value.offsetWidth
        : 0
    tabsNavRef.value?.style.setProperty("--_transition-duration", setDuration + "ms")
    tabsNavRef.value?.style.setProperty("--_x-hovered", currentHoveredTab.value?.offsetLeft + "px")

    tabsNavRef.value?.style.setProperty("--_width-hovered", newTabWidth?.toString())
    tabsNavRef.value?.style.setProperty("--_y-hovered", currentHoveredTab.value?.offsetTop + "px")
    tabsNavRef.value?.style.setProperty("--_y-height", currentHoveredTab.value?.offsetHeight + "px")
    tabsNavRef.value?.style.setProperty("--_y-width", currentHoveredTab.value?.offsetWidth + "px")
  }

  const setFinalActivePositions = (resized: boolean = false) => {
    const setDuration = resized ? 0 : duration
    const newTabWidth =
      currentActiveTab.value && tabsNavRef.value ? currentActiveTab.value.offsetWidth / tabsNavRef.value.offsetWidth : 0
    tabsNavRef.value?.style.setProperty("--_transition-duration", setDuration + "ms")
    tabsNavRef.value?.style.setProperty("--_x-active", currentActiveTab.value?.offsetLeft + "px")
    tabsNavRef.value?.style.setProperty("--_width-active", newTabWidth?.toString())
    tabsNavRef.value?.style.setProperty("--_y-active", currentActiveTab.value?.offsetTop + "px")
    tabsNavRef.value?.style.setProperty("--_y-height", currentActiveTab.value?.offsetHeight + "px")
    tabsNavRef.value?.style.setProperty("--_y-width", currentActiveTab.value?.offsetWidth + "px")
  }

  const moveActiveIndicator = () => {
    if (!tabsNavRef.value || !currentActiveTab.value) return
    if (!options.trackActive && !options.trackIndicator) return

    tabsNavRef.value.style.setProperty("--_transition-duration", duration + "ms")

    const newTabPosition =
      previousActiveTab.value && currentActiveTab.value
        ? previousActiveTab.value.compareDocumentPosition(currentActiveTab.value)
        : 0
    let transitionWidth

    if (newTabPosition === 4) {
      transitionWidth =
        currentActiveTab.value && previousActiveTab.value
          ? currentActiveTab.value.offsetLeft + currentActiveTab.value.offsetWidth - previousActiveTab.value.offsetLeft
          : 0
    } else {
      transitionWidth =
        previousActiveTab.value && currentActiveTab.value
          ? previousActiveTab.value.offsetLeft + previousActiveTab.value.offsetWidth - currentActiveTab.value.offsetLeft
          : 0
      tabsNavRef.value.style.setProperty(
        "--_x-active",
        currentActiveTab.value ? currentActiveTab.value.offsetLeft + "px" : "0"
      )
    }

    tabsNavRef.value.style.setProperty("--_width-active", String(transitionWidth / tabsNavRef.value.offsetWidth))

    handleTransitioningClass()

    setTimeout(
      () => {
        setFinalActivePositions()
      },
      Math.floor(duration + 20)
    )
  }

  const moveHoveredIndicator = () => {
    if (!tabsNavRef.value || !currentHoveredTab.value) return

    tabsNavRef.value.style.setProperty("--_transition-duration", duration + "ms")

    const newTabPosition =
      previousHoveredTab.value && currentHoveredTab.value
        ? previousHoveredTab.value.compareDocumentPosition(currentHoveredTab.value)
        : 0
    let transitionWidth

    if (newTabPosition === 4) {
      transitionWidth =
        currentHoveredTab.value && previousHoveredTab.value
          ? currentHoveredTab.value.offsetLeft +
            currentHoveredTab.value.offsetWidth -
            previousHoveredTab.value.offsetLeft
          : 0
    } else {
      transitionWidth =
        previousHoveredTab.value && currentHoveredTab.value
          ? previousHoveredTab.value.offsetLeft +
            previousHoveredTab.value.offsetWidth -
            currentHoveredTab.value.offsetLeft
          : 0
      tabsNavRef.value.style.setProperty(
        "--_x-hovered",
        currentHoveredTab.value ? currentHoveredTab.value.offsetLeft + "px" : "0"
      )
    }

    tabsNavRef.value.style.setProperty("--_width-hovered", String(transitionWidth / tabsNavRef.value.offsetWidth))

    handleTransitioningClass()

    setTimeout(
      () => {
        setFinalHoveredPositions()
      },
      Math.floor(duration + 20)
    )
  }

  const setActiveTabContent = () => {
    const activeIndex = navItems.value?.findIndex((el) => el === currentActiveTab.value)
    tabsContentRefs.value?.forEach((tabContent: HTMLElement, index: number) => {
      const isActive = activeIndex === index
      tabContent.style.display = isActive ? "block" : "none"
      tabContent.setAttribute("aria-hidden", isActive ? "false" : "true")
    })
  }

  useResizeObserver(tabsNavRef, () => {
    setFinalActivePositions(true)
    setFinalHoveredPositions(true)
  })

  return {
    initNavDecorators,
    navItemClicked,
    navItemHovered,
    navItemKeydown,
    resetHoverToActivePosition,
  }
}

export default useTabs
