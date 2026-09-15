import { useResizeObserver } from "@vueuse/core";

interface UseTabsOptions {
  trackHover: boolean;
  trackActive: boolean;
  trackIndicator: boolean;
}

const useTabs = (
  axis: string,
  tabsNavRef: Ref<HTMLElement | null>,
  tabsContentRefs: Ref<HTMLElement[] | null>,
  duration: number,
  options: UseTabsOptions = { trackHover: true, trackActive: true, trackIndicator: true }
) => {
  const navItems = ref<HTMLElement[] | null>(null);
  // Plain ref, not useState: this is ephemeral per-instance UI state, not something that
  // needs to survive SSR hydration or be shared by key — useState's fixed key here previously
  // meant every TabsCore instance on the page silently shared the same "previous active tab".
  const previousActiveTab = ref<HTMLElement | null>(null);
  const currentActiveTab = ref<HTMLElement>();

  const previousHoveredTab = ref<HTMLElement>();
  const currentHoveredTab = ref<HTMLElement>();
  const tagName = ref<string>();

  let activeSettleTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let hoveredSettleTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const initNavDecorators = () => {
    navItems.value = tabsNavRef.value
      ? (Array.from(tabsNavRef.value.querySelectorAll("[data-nav-item]")) as HTMLElement[])
      : [];

    if (!navItems.value || navItems.value.length === 0) {
      return;
    }

    const firstNavItem = navItems.value[0];
    if (!firstNavItem) return;

    tagName.value = firstNavItem.tagName.toLowerCase();

    const activeIndex = ref(0);

    // Temporarily set the first nav item as active
    firstNavItem.setAttribute("aria-selected", "true");

    // Test if navItems are hyperlinks
    if (firstNavItem.tagName.toLowerCase() === "a") {
      // Find index of element with class "router-link-active"
      activeIndex.value = navItems.value.findIndex((el) => el.classList.contains("router-link-active"));
    }

    const activeElement = navItems.value[activeIndex.value];
    if (!activeElement) return;

    currentActiveTab.value = activeElement;
    currentHoveredTab.value = activeElement;

    previousActiveTab.value = activeElement;
    previousHoveredTab.value = activeElement;

    setRovingTabindex();
    addNavDecorators();
    setActiveTabContent();
  };

  const addNavDecorators = () => {
    if (!tabsNavRef.value) return;

    if (options.trackIndicator) {
      tabsNavRef.value.appendChild(
        Object.assign(document.createElement("div"), { className: "nav__active-indicator" })
      );
    }
    if (options.trackActive) {
      tabsNavRef.value.appendChild(Object.assign(document.createElement("div"), { className: "nav__active" }));
    }
    if (options.trackHover) {
      tabsNavRef.value.appendChild(Object.assign(document.createElement("div"), { className: "nav__hovered" }));
    }
  };

  const setRovingTabindex = () => {
    navItems.value?.forEach((tab) => {
      tab.setAttribute("tabindex", tab === currentActiveTab.value ? "0" : "-1");
    });
  };

  const navItemHovered = (event: Event) => {
    if (!options.trackHover) return;

    const target = event.target as HTMLElement;
    const newTabPosition = currentHoveredTab.value ? currentHoveredTab.value.compareDocumentPosition(target) : 0;

    if (newTabPosition !== 0) {
      previousHoveredTab.value = currentHoveredTab.value;
      currentHoveredTab.value = target;
      moveHoveredIndicator();
    }
  };

  const resetHoverToActivePosition = () => {
    if (!options.trackHover) return;

    previousHoveredTab.value = currentHoveredTab.value;
    currentHoveredTab.value = currentActiveTab.value;
    moveHoveredIndicator();
  };

  const activateTab = (target: HTMLElement) => {
    if (target === currentActiveTab.value) return;

    previousActiveTab.value = currentActiveTab.value || null;
    currentActiveTab.value = target;

    navItems.value?.forEach((tab) => {
      tab.setAttribute("aria-selected", currentActiveTab.value === tab ? "true" : "false");
    });

    setRovingTabindex();
    moveActiveIndicator();
    setActiveTabContent();
  };

  const navItemClicked = (event: Event) => {
    activateTab(event.target as HTMLElement);
  };

  // WAI-ARIA Tabs pattern: arrow keys move focus and activate (automatic activation);
  // Home/End jump to the first/last tab.
  const navItemKeydown = (event: KeyboardEvent) => {
    if (!navItems.value || navItems.value.length === 0) return;

    const previousKey = axis === "y" ? "ArrowUp" : "ArrowLeft";
    const nextKey = axis === "y" ? "ArrowDown" : "ArrowRight";

    let targetIndex: number | null = null;
    const currentIndex = currentActiveTab.value ? navItems.value.indexOf(currentActiveTab.value) : 0;

    if (event.key === nextKey) {
      targetIndex = (currentIndex + 1) % navItems.value.length;
    } else if (event.key === previousKey) {
      targetIndex = (currentIndex - 1 + navItems.value.length) % navItems.value.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = navItems.value.length - 1;
    }

    if (targetIndex === null) return;

    event.preventDefault();
    const targetTab = navItems.value[targetIndex];
    if (!targetTab) return;

    targetTab.focus();
    activateTab(targetTab);
  };

  const setFinalHoveredPositions = (resized: boolean = false) => {
    if (!tabsNavRef.value || !currentHoveredTab.value) return;

    // Batch every layout read before any style write below, so the browser doesn't need to
    // perform a forced synchronous reflow between each read/write pair.
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = currentHoveredTab.value;
    const { offsetWidth: navWidth } = tabsNavRef.value;
    const setDuration = resized ? 0 : duration;
    const newTabWidth = navWidth ? offsetWidth / navWidth : 0;

    const nav = tabsNavRef.value;
    nav.style.setProperty("--_transition-duration", setDuration + "ms");
    nav.style.setProperty("--_x-hovered", offsetLeft + "px");
    nav.style.setProperty("--_width-hovered", newTabWidth.toString());
    nav.style.setProperty("--_y-hovered", offsetTop + "px");
    nav.style.setProperty("--_y-height", offsetHeight + "px");
    nav.style.setProperty("--_y-width", offsetWidth + "px");
  };

  const setFinalActivePositions = (resized: boolean = false) => {
    if (!tabsNavRef.value || !currentActiveTab.value) return;

    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = currentActiveTab.value;
    const { offsetWidth: navWidth } = tabsNavRef.value;
    const setDuration = resized ? 0 : duration;
    const newTabWidth = navWidth ? offsetWidth / navWidth : 0;

    const nav = tabsNavRef.value;
    nav.style.setProperty("--_transition-duration", setDuration + "ms");
    nav.style.setProperty("--_x-active", offsetLeft + "px");
    nav.style.setProperty("--_width-active", newTabWidth.toString());
    nav.style.setProperty("--_y-active", offsetTop + "px");
    nav.style.setProperty("--_y-height", offsetHeight + "px");
    nav.style.setProperty("--_y-width", offsetWidth + "px");
  };

  const moveActiveIndicator = () => {
    if (!tabsNavRef.value || !currentActiveTab.value) return;
    if (!options.trackActive && !options.trackIndicator) return;

    const nav = tabsNavRef.value;
    const current = currentActiveTab.value;
    const previous = previousActiveTab.value;

    // Batch reads first.
    const newTabPosition = previous ? previous.compareDocumentPosition(current) : 0;
    const currentLeft = current.offsetLeft;
    const currentWidth = current.offsetWidth;
    const previousLeft = previous?.offsetLeft ?? 0;
    const previousWidth = previous?.offsetWidth ?? 0;
    const navWidth = nav.offsetWidth;

    let transitionWidth: number;
    let xActive: string | null = null;

    if (newTabPosition === 4) {
      transitionWidth = previous ? currentLeft + currentWidth - previousLeft : 0;
    } else {
      transitionWidth = previous ? previousLeft + previousWidth - currentLeft : 0;
      xActive = currentLeft + "px";
    }

    // Then batch writes.
    nav.style.setProperty("--_transition-duration", duration + "ms");
    if (xActive !== null) {
      nav.style.setProperty("--_x-active", xActive);
    }
    nav.style.setProperty("--_width-active", String(transitionWidth / navWidth));

    if (activeSettleTimeoutId) clearTimeout(activeSettleTimeoutId);
    activeSettleTimeoutId = setTimeout(
      () => {
        setFinalActivePositions();
      },
      Math.floor(duration + 20)
    );
  };

  const moveHoveredIndicator = () => {
    if (!tabsNavRef.value || !currentHoveredTab.value) return;

    const nav = tabsNavRef.value;
    const current = currentHoveredTab.value;
    const previous = previousHoveredTab.value;

    // Batch reads first.
    const newTabPosition = previous ? previous.compareDocumentPosition(current) : 0;
    const currentLeft = current.offsetLeft;
    const currentWidth = current.offsetWidth;
    const previousLeft = previous?.offsetLeft ?? 0;
    const previousWidth = previous?.offsetWidth ?? 0;
    const navWidth = nav.offsetWidth;

    let transitionWidth: number;
    let xHovered: string | null = null;

    if (newTabPosition === 4) {
      transitionWidth = previous ? currentLeft + currentWidth - previousLeft : 0;
    } else {
      transitionWidth = previous ? previousLeft + previousWidth - currentLeft : 0;
      xHovered = currentLeft + "px";
    }

    // Then batch writes.
    nav.style.setProperty("--_transition-duration", duration + "ms");
    if (xHovered !== null) {
      nav.style.setProperty("--_x-hovered", xHovered);
    }
    nav.style.setProperty("--_width-hovered", String(transitionWidth / navWidth));

    if (hoveredSettleTimeoutId) clearTimeout(hoveredSettleTimeoutId);
    hoveredSettleTimeoutId = setTimeout(
      () => {
        setFinalHoveredPositions();
      },
      Math.floor(duration + 20)
    );
  };

  const setActiveTabContent = () => {
    const activeIndex = navItems.value?.findIndex((el) => el === currentActiveTab.value);
    tabsContentRefs.value?.forEach((tabContent: HTMLElement, index: number) => {
      const isActive = activeIndex === index;
      tabContent.style.display = isActive ? "block" : "none";
      tabContent.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  };

  useResizeObserver(tabsNavRef, () => {
    setFinalActivePositions(true);
    setFinalHoveredPositions(true);
  });

  onUnmounted(() => {
    if (activeSettleTimeoutId) clearTimeout(activeSettleTimeoutId);
    if (hoveredSettleTimeoutId) clearTimeout(hoveredSettleTimeoutId);
  });

  return {
    initNavDecorators,
    navItemClicked,
    navItemHovered,
    navItemKeydown,
    resetHoverToActivePosition,
  };
};

export default useTabs;
