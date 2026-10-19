import { useResizeObserver } from "@vueuse/core";
import type { MaybeRefOrGetter } from "vue";

const useTabs = (
  axis: MaybeRefOrGetter<"x" | "y">,
  tabsNavRef: Ref<HTMLElement | null>,
  tabsContentRefs: Ref<HTMLElement[] | null>,
  duration: MaybeRefOrGetter<number>,
  trackHover: MaybeRefOrGetter<boolean> = true
) => {
  // All triggers, and the ones not collapsed into an overflow menu (keyboard and roving tabindex use these).
  const allItems = ref<HTMLElement[]>([]);
  const navItems = ref<HTMLElement[]>([]);
  // Plain refs, not useState: per-instance UI state that must not be shared between instances.
  const currentActiveTab = ref<HTMLElement>();
  const currentHoveredTab = ref<HTMLElement>();

  type IndicatorKind = "active" | "hovered";
  let coverageFrameId: number | null = null;
  let coverageUntil = 0;

  const { place: placeEdges } = useSlidingIndicator(tabsNavRef, { axis, duration });

  const activeIndex = computed(() => {
    const index = currentActiveTab.value?.dataset.tabIndex;
    return index === undefined ? null : Number(index);
  });

  // A collapsed tab has no box of its own, so the indicators sit on the overflow menu's trigger instead.
  const indicatorTarget = (element?: HTMLElement | null) =>
    element?.hidden ? (tabsNavRef.value?.querySelector<HTMLElement>("[data-more-trigger]") ?? element) : element;

  /**
   * Re-reads the tabs from the DOM (after mount, or when the tab count/axis/indicators/overflow change),
   * keeping the active tab when it still exists. `animate` retargets indicators that are mid-move
   * instead of snapping them.
   */
  const refreshTabs = (animate = false) => {
    allItems.value = tabsNavRef.value
      ? Array.from(tabsNavRef.value.querySelectorAll<HTMLElement>("[data-nav-item]"))
      : [];
    navItems.value = allItems.value.filter((tab) => !tab.hidden);

    const items = allItems.value;
    const activeTab =
      currentActiveTab.value && items.includes(currentActiveTab.value) ? currentActiveTab.value : items[0];

    currentActiveTab.value = activeTab;
    currentHoveredTab.value = activeTab;

    items.forEach((tab) => {
      tab.setAttribute("aria-selected", tab === activeTab ? "true" : "false");
    });

    setRovingTabindex();
    syncIndicators(animate);
    setActiveTabContent();
  };

  // When the active tab is collapsed, the first visible tab keeps the tablist reachable with Tab.
  const setRovingTabindex = () => {
    const focusTarget = navItems.value.includes(currentActiveTab.value as HTMLElement)
      ? currentActiveTab.value
      : navItems.value[0];
    allItems.value.forEach((tab) => {
      tab.setAttribute("tabindex", tab === focusTarget ? "0" : "-1");
    });
  };

  const navItemHovered = (event: Event) => {
    if (!toValue(trackHover)) return;

    const target = event.currentTarget as HTMLElement;
    const newTabPosition = currentHoveredTab.value ? currentHoveredTab.value.compareDocumentPosition(target) : 0;

    if (newTabPosition !== 0) {
      currentHoveredTab.value = target;
      placeIndicator("hovered", true);
    }
  };

  const resetHoverToActivePosition = () => {
    if (!toValue(trackHover)) return;

    currentHoveredTab.value = currentActiveTab.value;
    placeIndicator("hovered", true);
  };

  const activateTab = (target: HTMLElement) => {
    if (target === currentActiveTab.value) return;

    currentActiveTab.value = target;

    allItems.value.forEach((tab) => {
      tab.setAttribute("aria-selected", currentActiveTab.value === tab ? "true" : "false");
    });

    setRovingTabindex();
    placeIndicator("active", true);
    setActiveTabContent();
  };

  const activateTabByIndex = (index: number) => {
    const target = allItems.value.find((tab) => Number(tab.dataset.tabIndex) === index);
    if (target) activateTab(target);
  };

  const navItemClicked = (event: Event) => {
    activateTab(event.currentTarget as HTMLElement);
  };

  // WAI-ARIA Tabs pattern: arrow keys move focus and activate (automatic activation);
  // Home/End jump to the first/last tab.
  const navItemKeydown = (event: KeyboardEvent) => {
    const items = navItems.value;
    if (items.length === 0) return;

    const isVertical = toValue(axis) === "y";
    const previousKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

    let targetIndex: number | null = null;
    const currentIndex = currentActiveTab.value ? items.indexOf(currentActiveTab.value) : 0;

    if (event.key === nextKey) {
      targetIndex = (currentIndex + 1) % items.length;
    } else if (event.key === previousKey) {
      targetIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = items.length - 1;
    }

    if (targetIndex === null) return;

    event.preventDefault();
    const targetTab = items[targetIndex];
    if (!targetTab) return;

    targetTab.focus();
    activateTab(targetTab);
  };

  // Edge motion lives in useSlidingIndicator; the CSS reads --_active-* and --_hovered-* off the bar.
  const placeIndicator = (kind: IndicatorKind, animate: boolean) => {
    const target = indicatorTarget(kind === "active" ? currentActiveTab.value : currentHoveredTab.value);
    const ms = placeEdges(kind, target, animate);
    if (ms !== null && kind === "active") trackCoverage(ms * 2);
  };

  // Marks each visible tab (and the overflow trigger) that the active indicator covers by at least half,
  // so its text can take the active text colour while the indicator slides under it.
  const updateCoverage = () => {
    const nav = tabsNavRef.value;
    if (!nav) return;
    const targets = [...navItems.value];
    const more = nav.querySelector<HTMLElement>("[data-more-trigger]");
    if (more) targets.push(more);

    const indicator = nav.querySelector<HTMLElement>("[data-active-indicator]");
    if (!indicator) {
      targets.forEach((target) => target.removeAttribute("data-under-active"));
      return;
    }

    const vertical = toValue(axis) === "y";
    const box = indicator.getBoundingClientRect();
    const [boxStart, boxEnd] = vertical ? [box.top, box.bottom] : [box.left, box.right];

    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const [start, end] = vertical ? [rect.top, rect.bottom] : [rect.left, rect.right];
      const overlap = Math.min(boxEnd, end) - Math.max(boxStart, start);
      target.toggleAttribute("data-under-active", end > start && overlap >= (end - start) / 2);
    });
  };

  // Re-checks coverage every frame while the indicator's transition runs. A new request only ever
  // extends the window: a snap (e.g. a refresh) mid-move mustn't stop the checks before it lands.
  const trackCoverage = (animationMs: number) => {
    coverageUntil = Math.max(coverageUntil, performance.now() + animationMs + 50);
    updateCoverage();
    if (coverageFrameId !== null) return;
    const step = () => {
      updateCoverage();
      coverageFrameId = performance.now() < coverageUntil ? requestAnimationFrame(step) : null;
    };
    coverageFrameId = requestAnimationFrame(step);
  };

  // Matched by data-tab-index, since a v-for ref array isn't guaranteed to stay in source order.
  const setActiveTabContent = () => {
    const activeIndex = currentActiveTab.value?.dataset.tabIndex;
    tabsContentRefs.value?.forEach((tabContent: HTMLElement) => {
      tabContent.hidden = tabContent.dataset.tabIndex !== activeIndex;
    });
  };

  /** Re-places both indicators onto their current targets, e.g. after the overflow trigger changes size. */
  const syncIndicators = (animate = false) => {
    placeIndicator("active", animate);
    placeIndicator("hovered", animate);
  };

  useResizeObserver(tabsNavRef, () => syncIndicators(false));

  onUnmounted(() => {
    if (coverageFrameId !== null) cancelAnimationFrame(coverageFrameId);
  });

  return {
    refreshTabs,
    syncIndicators,
    activeIndex,
    activateTabByIndex,
    navItemClicked,
    navItemHovered,
    navItemKeydown,
    resetHoverToActivePosition,
  };
};

export default useTabs;
