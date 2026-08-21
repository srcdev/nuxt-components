<template>
  <div
    ref="navigationWrapper"
    class="navigation"
    :class="[elementClasses, { loaded: navLoaded, 'geometry-ready': isGeometryReady }]"
    role="banner"
  >
    <nav
      ref="mainNav"
      class="main-navigation"
      :class="{ 'is-animated': isAnimated }"
      aria-label="Main navigation"
      @mouseleave="hoveredItemKey = null"
      @focusout="handleNavFocusout"
    >
      <ul
        v-for="(navGroup, groupKey) in responsiveNavLinks"
        :key="groupKey"
        :ref="
          (el: Element | ComponentPublicInstance | null) => setNavRef(String(groupKey), el as HTMLUListElement | null)
        "
        class="main-navigation-list"
      >
        <li
          v-for="(link, localIndex) in navGroup"
          :key="localIndex"
          ref="mainNavigationItems"
          class="main-navigation-item"
          :class="{
            'visually-hidden': !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible,
            'is-hovered': hoveredItemKey === `${String(groupKey)}-${localIndex}`,
            'is-active': isActiveNavItem(link),
          }"
          :style="{
            '--_main-navigation-item-width':
              mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px',
          }"
          :data-group-key="groupKey"
          :data-local-index="localIndex"
          @mouseenter="handleNavigationItemHover(`${String(groupKey)}-${localIndex}`)"
          @focusin="handleNavigationItemHover(`${String(groupKey)}-${localIndex}`)"
        >
          <NuxtLink
            v-if="link.path"
            class="main-navigation-link"
            :class="{ 'has-icon': link.iconName }"
            :to="link.path"
          >
            <Icon v-if="link.iconName" :name="link.iconName" class="decorator-icon" aria-hidden="true" />
            {{ link.name }}
          </NuxtLink>
          <details v-else ref="navigationDetails" class="main-navigation-details" name="navigation-group">
            <summary
              class="main-navigation-details-summary has-toggle-icon"
              :aria-label="`${link.childLinksTitle} submenu`"
              @mouseenter="handleSummaryHover($event)"
              @focusin="handleSummaryHover($event)"
              @click.prevent="handleSummaryAction($event)"
              @keyup.prevent.stop="handleSummaryAction($event)"
            >
              <Icon name="mdi:chevron-down" class="icon" :aria-hidden="true" />
              <Icon v-if="link.iconName" :name="link.iconName" class="decorator-icon" aria-hidden="true" />

              {{ link.childLinksTitle }}
            </summary>
            <div class="main-navigation-sub-nav" role="menu" @mouseenter="handleSubNavHover">
              <ul class="main-navigation-sub-nav-list">
                <li v-for="childLink in link.childLinks" :key="childLink.name" class="main-navigation-sub-nav-item">
                  <NuxtLink :to="childLink.path" class="main-navigation-sub-nav-link" role="menuitem">
                    {{ childLink.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </details>
        </li>
      </ul>
      <div aria-hidden="true" class="nav-indicator-hovered"></div>
      <div aria-hidden="true" class="nav-indicator-active"></div>
    </nav>
    <nav ref="secondaryNav" class="secondary-navigation" aria-label="Secondary navigation">
      <details
        ref="overflowDetails"
        class="overflow-details"
        :class="overflowDetailsClass ? [overflowDetailsClass] : []"
        name="overflow-group"
      >
        <summary class="overflow-details-summary has-toggle-icon">
          <Icon
            :name="overflowDetailsSummaryIcons.more ?? 'gravity-ui:ellipsis'"
            class="icon"
            :class="[{ show: !allowNavigationCollapse }]"
            :aria-hidden="true"
          />
          <Icon
            :name="overflowDetailsSummaryIcons.burger ?? 'gravity-ui:bars'"
            class="icon"
            :class="[{ show: allowNavigationCollapse }]"
            :aria-hidden="true"
          />
        </summary>
        <div class="overflow-details-nav" role="menu">
          <NavigationItems :main-navigation-state="mainNavigationState" />
        </div>
      </details>
      <slot v-if="slots.secondaryNavigation" name="secondaryNavigation"></slot>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type {
  ResponsiveHeaderProp,
  ResponsiveHeaderState,
  IFlooredRect,
  ResponsiveHeaderNavItem,
} from "../../../types/components";
import { useResizeObserver, onClickOutside } from "@vueuse/core";

interface Props {
  responsiveNavLinks?: ResponsiveHeaderProp;
  gapBetweenFirstAndSecondNav?: number;
  overflowDetailsSummaryIcons?: Record<string, string>;
  collapseBreakpoint?: number | null;
  collapseAtMainNavIntersection?: boolean;
  styleClassPassthrough?: string | string[];
  allowExpandOnGesture?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  responsiveNavLinks: () => ({}),
  gapBetweenFirstAndSecondNav: 12,
  overflowDetailsSummaryIcons: () => ({
    more: "gravity-ui:ellipsis",
    burger: "gravity-ui:bars",
  }),
  collapseBreakpoint: null,
  collapseAtMainNavIntersection: false,
  styleClassPassthrough: () => [],
  allowExpandOnGesture: true,
});

const collapseNavigationBelowWidth = computed(
  () => props.collapseBreakpoint !== null || props.collapseAtMainNavIntersection
);
const collapseBreakpoint = ref(props.collapseBreakpoint);

// Use global navigation state for caching between route changes
const {
  navLoaded,
  navigationInitialized,
  navigationWrapperRects: cachedNavigationWrapperRects,
  secondaryNavRects: cachedSecondaryNavRects,
} = useNavigationState();

const slots = useSlots();

const navigationWrapperRef = useTemplateRef<HTMLDivElement>("navigationWrapper");

const closeAllNavigationDetails = () => {
  navigationDetailsRefs.value?.forEach((element) => {
    element?.removeAttribute("open");
  });
  overflowDetailsRef.value?.removeAttribute("open");
};

// ─── Hover-intent delay for the "safe triangle" problem ───────────────────
// handleNavigationItemHover() used to call closeAllNavigationDetails() the
// instant the mouse entered ANY .main-navigation-item — including a sibling
// crossed only in transit while moving diagonally from an open dropdown's
// summary down into its own .main-navigation-sub-nav panel, closing it
// before the user got there.
//
// A pure-CSS "safe triangle" bridge was tried first and reverted: for the
// bridge to escape .main-navigation-item's overflow:hidden the same way
// .main-navigation-sub-nav does, its containing block must resolve to
// .navigation (the only positioned ancestor above the clipping box) — but
// any element it's attached to that's already positioned (the summary)
// terminates that search at itself, landing the bridge back inside the
// clipped box; anything not already positioned falls back to the CSS
// static-position algorithm, which doesn't reliably land a generated
// pseudo-element where the visible content is. Neither is fixable without
// restructuring the panel's positioning, which the collapse-measurement
// pipeline depends on (see the measurement-pipeline note above).
//
// This delay sidesteps that entirely: closing is scheduled, not immediate,
// and cancelled if the cursor reaches the summary or the sub-nav panel
// before it fires — so a brief diagonal dip through a sibling's hit area
// survives, while genuinely moving elsewhere still closes promptly.
const HOVER_CLOSE_DELAY = 200;
let closeAllTimer: ReturnType<typeof setTimeout> | null = null;

const cancelScheduledClose = () => {
  if (closeAllTimer) {
    clearTimeout(closeAllTimer);
    closeAllTimer = null;
  }
};

const scheduleCloseAllNavigationDetails = () => {
  cancelScheduledClose();
  closeAllTimer = setTimeout(() => {
    closeAllNavigationDetails();
    closeAllTimer = null;
  }, HOVER_CLOSE_DELAY);
};

onUnmounted(() => {
  cancelScheduledClose();
});

const toggleDetailsElement = (event: Event) => {
  const summaryElement = event.currentTarget as HTMLElement;
  const parentDetailsElement = summaryElement.closest("details");
  if (!parentDetailsElement) return;

  if (parentDetailsElement.hasAttribute("open")) {
    parentDetailsElement.removeAttribute("open");
  } else {
    parentDetailsElement.setAttribute("open", "");
  }
  overflowDetailsRef.value?.removeAttribute("open");
};

const handleSummaryHover = (event: MouseEvent | FocusEvent) => {
  if (!props.allowExpandOnGesture) {
    return;
  }

  // The cursor reached a summary — any close scheduled while it was in
  // transit (see handleNavigationItemHover) no longer applies.
  cancelScheduledClose();

  // Close all other open navigation details first
  const summaryElement = event.currentTarget as HTMLElement;
  const parentDetailsElement = summaryElement.closest("details");

  navigationDetailsRefs.value?.forEach((element) => {
    if (element !== parentDetailsElement) {
      element?.removeAttribute("open");
    }
  });
  overflowDetailsRef.value?.removeAttribute("open");

  // Ensure THIS one is open — never toggle it closed here. A real mouse click
  // moves focus to the summary before the click event fires, so a single
  // click on an already-(hover-)open item fires focusin (this handler) AND
  // click (handleSummaryAction, which does its own toggle) in quick
  // succession. If this handler also toggled, an already-open item would
  // flip closed here and then flip back open in handleSummaryAction — a
  // visible open→closed→open (or the reverse) flicker on every click.
  // Hover/focus only ever guarantees "this one is open"; only an explicit
  // click is allowed to close it.
  parentDetailsElement?.setAttribute("open", "");
};

const handleNavigationItemHover = (key: string) => {
  hoveredItemKey.value = key;
  if (!props.allowExpandOnGesture) {
    return;
  }
  scheduleCloseAllNavigationDetails();
};

// Reaching the actual destination panel cancels the scheduled close from
// handleNavigationItemHover — same reasoning as handleSummaryHover above.
const handleSubNavHover = () => {
  cancelScheduledClose();
};

const handleNavFocusout = (event: FocusEvent) => {
  // Only clear when focus moves outside the nav entirely, not between nav items.
  const nav = event.currentTarget as HTMLElement;
  if (!event.relatedTarget || !nav.contains(event.relatedTarget as Node)) {
    hoveredItemKey.value = null;
  }
};

const handleSummaryAction = (event: MouseEvent | KeyboardEvent) => {
  toggleDetailsElement(event);
};

const hoveredItemKey = ref<string | null>(null);

const route = useRoute();

const isActiveNavItem = (link: ResponsiveHeaderNavItem): boolean => {
  if (link.path) return route.path === link.path;
  if (link.childLinks) return link.childLinks.some((child) => child.path && route.path === child.path);
  return false;
};

const isAnimated = ref(true);

// Local (non-useState) flag — resets to false on every mount.
// Gates two things:
// 1. The `.geometry-ready` wrapper class that enables nav-item visibility transitions,
//    preventing items from animating in on every route change.
// 2. Whether the overflow button is shown (via overflowDetailsHidden below).
const isGeometryReady = ref(false);

// Set to true only during Phase 2 of the initial geometry pass (see useResizeObserver).
// Allows the overflow button to be temporarily revealed at its natural size so that
// secondaryNavRects can be measured accurately before the final visibility pass runs.
const isOverflowVisibleForMeasurement = ref(false);

// Single source of truth for the overflow button's CSS class:
//
//   'visually-hidden'  → width: 0 — removed from layout entirely (early boot, between
//                        the first and second measurement phases)
//   'is-measuring'     → opacity:0 / visibility:hidden, but NATURAL width — button is
//                        present in layout so secondaryNavRects captures its real width,
//                        but invisible to the user (phase 2 of the geometry pass)
//   null               → fully visible (isGeometryReady + showOverflowDetails)
//
// Note: we never conditionally skip phase 2 with a peek check. A peek using
// determineNavigationItemVisibility() after phase 1 gives the wrong answer at the
// breakpoint because the CSS v-bind(mainNavigationMarginBlockEndStr) hasn't been
// flushed to the DOM yet — positions lag the reactive update by one tick.
const overflowDetailsClass = computed<string | null>(() => {
  if (!navLoaded.value) return "visually-hidden";
  if (!isGeometryReady.value) {
    return isOverflowVisibleForMeasurement.value ? "is-measuring" : "visually-hidden";
  }
  return showOverflowDetails.value ? null : "visually-hidden";
});

watch(
  () => route.path,
  () => {
    isAnimated.value = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isAnimated.value = true;
      });
    });
  },
  { flush: "pre" }
);

// Initialize main navigation state
const mainNavigationState = ref<ResponsiveHeaderState>({
  navListVisibility: {
    firstNav: false,
    secondNav: false,
  },
  clonedNavLinks: props.responsiveNavLinks,
  hasSecondNav: Object.keys(props.responsiveNavLinks).length > 1,
});

const navRefs = ref<Record<string, HTMLUListElement | null>>({});

const setNavRef = (key: string, el: Element | ComponentPublicInstance | null) => {
  navRefs.value[key] = el as HTMLUListElement | null;
};

const navigationWrapperRects = computed({
  get: () => cachedNavigationWrapperRects.value,
  set: (value: IFlooredRect | null) => {
    cachedNavigationWrapperRects.value = value;
  },
});

const firstNavRef = ref<HTMLUListElement | null>(null);
const firstNavRects = ref<IFlooredRect | null>(null);

const secondNavRef = ref<HTMLUListElement | null>(null);
const secondNavRects = ref<IFlooredRect | null>(null);

const secondaryNavRef = useTemplateRef<HTMLElement>("secondaryNav");
const secondaryNavRects = computed({
  get: () => cachedSecondaryNavRects.value,
  set: (value: IFlooredRect | null) => {
    cachedSecondaryNavRects.value = value;
  },
});

const mainNavigationItemsRefs = useTemplateRef<HTMLLIElement[]>("mainNavigationItems");

const navigationDetailsRefs = useTemplateRef<HTMLElement[]>("navigationDetails");

const overflowDetailsRef = useTemplateRef<HTMLDetailsElement>("overflowDetails");

const showOverflowDetails = computed(() => {
  const hasHiddenNav =
    !mainNavigationState.value.navListVisibility["firstNav"] ||
    (!mainNavigationState.value.navListVisibility["secondNav"] && mainNavigationState.value.hasSecondNav);
  return hasHiddenNav;
});

const mainNavigationMarginBlockEnd = computed(() => {
  return secondaryNavRects.value ? secondaryNavRects.value.width + props.gapBetweenFirstAndSecondNav : 0;
});

const mainNavigationMarginBlockEndStr = computed(() => {
  return mainNavigationMarginBlockEnd.value + "px";
});

const initTemplateRefs = async () => {
  firstNavRef.value = navRefs.value["firstNav"] as HTMLUListElement | null;
  secondNavRef.value = navRefs.value["secondNav"] as HTMLUListElement | null;
  return;
};

const getFlooredRect = (rect: DOMRect | null) => {
  if (!rect) return null;
  return {
    left: Math.floor(rect.left),
    right: Math.floor(rect.right),
    top: Math.floor(rect.top),
    bottom: Math.floor(rect.bottom),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height),
  };
};

const updateNavigationConfig = async (_source?: string) => {
  navigationWrapperRects.value =
    getFlooredRect((navigationWrapperRef.value && navigationWrapperRef.value.getBoundingClientRect()) ?? null) || null;
  secondaryNavRects.value =
    getFlooredRect((secondaryNavRef.value && secondaryNavRef.value.getBoundingClientRect()) ?? null) || null;
  firstNavRects.value =
    getFlooredRect((firstNavRef.value && firstNavRef.value.getBoundingClientRect()) ?? null) || null;
  secondNavRects.value =
    getFlooredRect((secondNavRef.value && secondNavRef.value.getBoundingClientRect()) ?? null) || null;

  if (collapseNavigationBelowWidth.value && firstNavRects.value) {
    collapseBreakpoint.value = firstNavRects.value?.right;
  }
};

const allowNavigationCollapse = computed(() => {
  return (
    collapseNavigationBelowWidth.value &&
    navigationWrapperRects.value &&
    secondaryNavRects.value !== null &&
    collapseBreakpoint.value !== null &&
    Math.floor(secondaryNavRects.value.left - props.gapBetweenFirstAndSecondNav) <= collapseBreakpoint.value
  );
});

const determineNavigationItemVisibility = (rect: DOMRect) => {
  // Check if navigation should be collapsed based on width breakpoint
  if (allowNavigationCollapse.value) {
    return false;
  }

  // Use default responsive visibility logic if wrapper exists
  if (navigationWrapperRects.value) {
    return (
      Math.floor(rect.right + mainNavigationMarginBlockEnd.value + props.gapBetweenFirstAndSecondNav) <
      navigationWrapperRects.value.right
    );
  }

  // Default to visible
  return true;
};

const initMainNavigationState = () => {
  if (!mainNavigationItemsRefs.value) return;

  mainNavigationItemsRefs.value.forEach(async (item) => {
    // await nextTick()
    const rect = item.getBoundingClientRect();

    const groupKey = item.dataset.groupKey;
    const localIndex = item.dataset.localIndex ? parseInt(item.dataset.localIndex, 10) : 0;
    if (
      groupKey !== undefined &&
      groupKey !== null &&
      mainNavigationState.value.clonedNavLinks &&
      mainNavigationState.value.clonedNavLinks[groupKey] &&
      mainNavigationState.value.clonedNavLinks[groupKey][localIndex]
    ) {
      mainNavigationState.value.clonedNavLinks[groupKey][localIndex] = {
        ...mainNavigationState.value.clonedNavLinks[groupKey][localIndex],
        config: {
          left: item.offsetLeft,
          right: item.offsetLeft + item.offsetWidth,
          width: item.offsetWidth,
          visible: determineNavigationItemVisibility(rect),
        },
      };
    }

    // Check if a single item has visible set to false and set the visibility of the group accordingly
    if (
      typeof groupKey === "string" &&
      mainNavigationState.value.clonedNavLinks &&
      mainNavigationState.value.clonedNavLinks[groupKey] &&
      mainNavigationState.value.clonedNavLinks[groupKey][localIndex] &&
      mainNavigationState.value.clonedNavLinks[groupKey][localIndex].config?.visible === false
    ) {
      mainNavigationState.value.navListVisibility[groupKey] = false;
    } else if (typeof groupKey === "string") {
      mainNavigationState.value.navListVisibility[groupKey] = true;
    }
  });

  // Geometry pass is complete. The overflow button can now appear (if needed)
  // and nav-item transitions can play from this point forward.
  isGeometryReady.value = true;
};

// Function to set up click outside listeners
const setupClickOutsideListeners = () => {
  navigationDetailsRefs.value?.forEach((element, index) => {
    onClickOutside(element, () => {
      navigationDetailsRefs.value?.[index]?.removeAttribute("open");
    });
  });
  // Add onClickOutside to overflowDetailsRef
  if (overflowDetailsRef.value) {
    onClickOutside(overflowDetailsRef.value, () => {
      overflowDetailsRef.value?.removeAttribute("open");
    });
  }
};

// ─── Re-entrancy guard for the geometry pass ──────────────────────────────
// The pass is async and awaits multiple ticks while toggling layout-affecting
// state. If it's triggered again (resize, or the post-fonts-ready recheck
// below) while a pass is still in flight, two concurrent passes would race on
// isOverflowVisibleForMeasurement and mainNavigationState.
//
// Pattern: "run-latest" queue.
//   • isMeasuring gates entry — any new trigger while a pass is running
//     sets pendingMeasure = true and returns immediately.
//   • The do/while re-runs once after the pass completes if a new trigger
//     arrived, so we never silently drop the final geometry update.
let isMeasuring = false;
let pendingMeasure = false;

const runGeometryPass = async () => {
  if (isMeasuring) {
    pendingMeasure = true;
    return;
  }

  isMeasuring = true;
  try {
    do {
      pendingMeasure = false;

      if (!isGeometryReady.value) {
        // ─── Two-pass measurement on initial mount / route change ──────────────
        //
        // We never use a "peek" check to decide whether phase 2 is needed.
        // A peek after phase 1 gives the wrong answer at the breakpoint because:
        //   • updateNavigationConfig() sets secondaryNavRects reactively, but
        //     v-bind(mainNavigationMarginBlockEndStr) isn't flushed to the DOM until
        //     the next Vue render tick — so item rects are still measured against the
        //     OLD margin, producing a stale DOM/computed mismatch.
        //   • Even with correct timing, checking without the button reserved will
        //     always pass marginal items (those that fit only when button is absent).
        //
        // Phase 1: button is 'visually-hidden' (width:0).
        // Measure the wrapper and secondary-nav rects without the button.
        await updateNavigationConfig("phase1");

        // Phase 2: switch button to 'is-measuring' — opacity:0 / visibility:hidden
        // but natural width — so secondaryNavRects captures the button's real width.
        // The button is invisible to the user; nav items are still visually-hidden.
        isOverflowVisibleForMeasurement.value = true;
        await nextTick(); // let Vue render the 'is-measuring' class (button at natural width)
        await updateNavigationConfig("phase2"); // secondaryNavRects now includes button width

        // Wait for Vue to flush the updated mainNavigationMarginBlockEndStr via v-bind
        // before reading item positions — without this tick, getBoundingClientRect()
        // in initMainNavigationState would see the pre-phase-2 margin-inline-end.
        await nextTick();

        // Final visibility pass — reads item rects against the correct margin.
        // Also sets isGeometryReady = true.
        initMainNavigationState();
        // Hand control back to showOverflowDetails; measurement flag no longer needed.
        isOverflowVisibleForMeasurement.value = false;
      } else {
        // ─── Normal resize after geometry is settled ───────────────────────────
        // The button's state is already correct (driven by showOverflowDetails),
        // so a single-pass measurement gives accurate secondaryNavRects.
        await updateNavigationConfig("resize-or-fonts-ready");
        initMainNavigationState();
      }
    } while (pendingMeasure);
  } finally {
    isMeasuring = false;
  }
};

onMounted(async () => {
  // Always reset on every mount — this is a local ref so it naturally resets,
  // but being explicit here makes the intent clear: geometry must be re-verified
  // on every route change before the overflow button appears or transitions play.
  isGeometryReady.value = false;

  // Always (re-)populate the local nav refs — firstNavRef / secondNavRef are local
  // refs that reset on unmount, so they must be re-assigned on every mount even
  // when the useState flags say we're already initialized.
  await initTemplateRefs();

  if (!navigationInitialized.value || !navLoaded.value) {
    navLoaded.value = true;
    navigationInitialized.value = true;
  }

  // Geometry recalculation is handled by useResizeObserver which fires when the
  // element first becomes observed. isGeometryReady is set there after the pass.
  setupClickOutsideListeners();

  // ─── Re-verify geometry once webfonts have settled ────────────────────────
  // The initial ResizeObserver-driven pass can run before self-hosted fonts
  // (see nuxt.config.ts `fonts.families`) have swapped in, measuring nav-item
  // widths against fallback-font metrics. That undercounts item width, letting
  // one extra item fit that shouldn't — the wrapper's own size hasn't changed,
  // so the ResizeObserver never refires on its own to correct it. document.fonts
  // isn't available in SSR/non-browser test environments, so this is a no-op there.
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.ready.then(() => {
      if (isGeometryReady.value) runGeometryPass();
    });
  }
});

useResizeObserver(navigationWrapperRef, runGeometryPass);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .navigation {
    ul,
    ol {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        /* text-box-trim: trim-both; */
        /* text-box-edge: cap alphabetic; */
        display: flex;
        align-items: center;
      }
    }

    /* ─── Public CSS tokens ─────────────────────────────────────────────────
       Override these on the consumer's scope class to theme the nav.
       Tokens are read via var(--token, default) — defaults are NOT declared
       on this element to avoid source-order cascade conflicts with consumers.

       --responsive-header-margin               (default: 0)
       --responsive-header-bg                   (default: transparent)
       --responsive-header-border               (default: none)
       --responsive-header-border-radius        (default: 0)
       --responsive-header-padding-block        (default: 0)
       --responsive-header-padding-inline       (default: 0)
       --responsive-header-max-height           (default: none)
       --responsive-header-inline-size          (default: 100%)

       --responsive-header-color                (default: inherit)
       --responsive-header-link-color           (default: inherit)

       --responsive-header-sub-nav-bg           (default: Canvas)
       --responsive-header-sub-nav-border       (default: 1px solid #efefef75)
       --responsive-header-sub-nav-border-radius (default: 8px)
       --responsive-header-sub-nav-padding      (default: 12px)

       --responsive-header-overflow-btn-bg              (default: Canvas)
       --responsive-header-overflow-btn-size            (default: 20px)
       --responsive-header-overflow-btn-border          (default: 1px solid #ffffff90)
       --responsive-header-overflow-btn-outline         (default: 1px solid #ffffff10)
       --responsive-header-overflow-btn-icon-color      (default: inherit)
       --responsive-header-overflow-btn-hover-outline   (default: 1px solid #ffffff)

       --responsive-header-overflow-nav-bg              (default: Canvas)
       --responsive-header-overflow-nav-border          (default: 1px solid #ffffff90)
       --responsive-header-overflow-nav-border-radius   (default: 8px)
       --responsive-header-overflow-nav-padding-block   (default: 12px)

       --responsive-nav-decorator-indicator-color         (default: currentColor)
       --responsive-nav-decorator-hovered-indicator-color (default: inherits --responsive-nav-decorator-indicator-color)
       --responsive-nav-decorator-hovered-bg              (default: oklch(100% 0 0 / 8%))

       --responsive-header-link-font-size       (default: inherit)
    ──────────────────────────────────────────────────────────────────────── */

    /* `inherit` means a viewport-relative (vw/clamp) ancestor font-size silently
       flows into the overflow-collapse width measurement — the ResizeObserver
       only watches this element's own box size, so a scrollbar-driven vw shift
       can change nav-item text width without ever re-triggering a re-measurement.
       Set this token to a fixed value (or a small set of breakpoint-based values)
       to avoid it. */

    --_link-visibility-transition: none;
    position: relative;
    color: var(--responsive-header-color, inherit);

    margin: var(--responsive-header-margin, 0);
    background-color: var(--responsive-header-bg, transparent);
    border: var(--responsive-header-border, none);
    border-radius: var(--responsive-header-border-radius, 0);
    padding-block: var(--responsive-header-padding-block, 0);
    padding-inline: var(--responsive-header-padding-inline, 0);
    max-height: var(--responsive-header-max-height, none);
    inline-size: var(--responsive-header-inline-size, 100%);

    &.loaded {
      --_link-visibility-transition: all 0.2s ease-in-out;
    }

    /* flex-grow: 1; */
    display: grid;
    grid-template-areas: "navStack";

    .main-navigation {
      /* Set up some global vars */
      --_link-padding-block: 0.8rem;
      --_link-padding-inline: 0.2rem;
      --_link-margin-block: 0.1rem;
      --_link-margin-inline: 0.1rem;
      --_link-focus-visible-outline-width: 0.2rem;
      --_link-border-default: 2px solid transparent;
      --_link-border-bottom-hover: var(--green-08);

      grid-area: navStack;
      display: flex;
      flex-wrap: nowrap;
      flex-grow: 1;
      justify-content: space-between;
      gap: 60px;
      overflow-x: hidden;
      margin-inline-end: v-bind(mainNavigationMarginBlockEndStr);

      &.collapsed {
        justify-content: flex-start;
      }

      .main-navigation-list {
        display: flex;
        flex-wrap: nowrap;

        &:nth-of-type(1) {
          gap: 30px;
        }

        &:nth-of-type(2) {
          gap: 30px;
        }

        .main-navigation-item {
          /* width: var(--_main-navigation-item-width); */
          overflow: hidden;
          /* Transition is intentionally absent here — it is only enabled after
             the first geometry pass via .navigation.geometry-ready below, so
             items don't animate in on every route change. */
          padding-block: var(--_link-focus-visible-outline-width);
          padding-inline: var(--_link-focus-visible-outline-width);

          .main-navigation-link {
            display: flex;
            gap: 6px;
            text-wrap-mode: nowrap;
            font-size: var(--responsive-header-link-font-size, inherit);
            color: var(--responsive-header-link-color, inherit);
            text-decoration: none;
            cursor: pointer;
            margin-inline-start: 0;
            position: relative;
            z-index: 4;

            padding-block: var(--_link-padding-block);
            padding-inline: var(--_link-padding-inline);
            margin-block: var(--_link-margin-block);
            margin-inline: var(--_link-margin-inline);
            border-bottom: var(--_link-border-default);
          }

          /* Reserved so the icon's async-loaded SVG (Icon component) can't widen
             the item after the initial geometry-measurement pass has already run —
             an unsized icon measures at ~0 width until its content arrives, which
             the overflow-collapse ResizeObserver has no way to detect afterwards
             (the wrapper's own box doesn't necessarily change size when it happens). */
          .decorator-icon {
            flex-shrink: 0;
            width: 1.35em;
            height: 1.35em;
          }

          .main-navigation-details {
            --_icon-transform: scaleY(1);

            margin-inline-start: 0;
            /* transition: var(--_link-visibility-transition); */

            &[open] {
              --_icon-transform: scaleY(-1);
            }

            .has-toggle-icon {
              display: flex;
              gap: 6px;
              text-wrap-mode: nowrap;

              /* Reserved for the same reason as .decorator-icon above — an
                 unsized chevron would widen the summary once its SVG loads. */
              .icon {
                display: block;
                flex-shrink: 0;
                width: 1.35em;
                height: 1.35em;
                transform: var(--_icon-transform);
                transition: transform 0.2s ease-in-out;
              }
            }

            .main-navigation-details-summary {
              padding-block: var(--_link-padding-block);
              padding-inline: var(--_link-padding-inline);
              margin-block: var(--_link-margin-block);
              margin-inline: var(--_link-margin-inline);
              border-bottom: var(--_link-border-default);
              white-space: nowrap;
              cursor: pointer;
              position: relative;
              z-index: 4;
              font-size: var(--responsive-header-link-font-size, inherit);
              color: var(--responsive-header-link-color, inherit);

              &::-webkit-details-marker,
              &::marker {
                display: none;
              }

              .decorator-icon {
                margin-inline-start: 8px;
              }
            }

            .main-navigation-sub-nav {
              position: absolute;

              padding: var(--responsive-header-sub-nav-padding, 12px);
              border: var(--responsive-header-sub-nav-border, 1px solid #efefef75);
              border-radius: var(--responsive-header-sub-nav-border-radius, 8px);
              background-color: var(--responsive-header-sub-nav-bg, Canvas);
              translate: 0 12px;

              min-width: var(--_main-navigation-item-width);

              .main-navigation-sub-nav-list {
                display: grid;
                grid-template-columns: repeat(2, auto);
                gap: 12px;

                .main-navigation-sub-nav-item {
                  margin-bottom: 8px;

                  &:last-child {
                    margin-bottom: 0;
                  }

                  .main-navigation-sub-nav-link {
                    display: block;
                    text-wrap-mode: nowrap;
                    text-decoration: none;
                    color: var(--responsive-header-link-color, inherit);
                  }
                }
              }
            }
          }

          &.visually-hidden {
            visibility: hidden;
            opacity: 0;
            /* Pin the outer <li> to its originally-measured width so re-measurements
               while hidden don't pick up an inflated value from the shifted inner
               content. Without this, each hide→measure cycle compounds the width
               (feedback loop → 7995px → items never recover). */
            inline-size: var(--_main-navigation-item-width);
            overflow: hidden;

            .main-navigation-details,
            .main-navigation-link {
              margin-inline-start: var(--_main-navigation-item-width);
            }
          }
        }

        &:last-child {
          .main-navigation-item {
            /* border: 2px solid red; */

            .main-navigation-details {
              /* border: 2px solid blue; */
              /* position: relative; */
              /* isolation: isolate; */

              .main-navigation-sub-nav {
                /* border: 2px solid yellow; */
                /* left: initial; */
                /* right: 0; */
                translate: calc(-1 * var(--_main-navigation-item-width)) 12px;
              }
            }
          }
        }
      }
    }

    .secondary-navigation {
      grid-area: navStack;
      justify-self: end;

      display: flex;
      gap: 12px;
      align-items: center;

      .secondary-navigation-list {
        .secondary-navigation-item {
          .secondary-navigation-link {
            display: flex;
            align-items: center;
            font: inherit;
            color: var(--responsive-header-link-color, inherit);

            .icon {
              height: 1.35em;
              width: 1.35em;
            }
          }
        }
      }

      .overflow-details {
        list-style: none;
        padding: 0;
        margin: 0;
        position: relative;
        cursor: pointer;
        width: fit-content;

        transition: all 0.2s ease-in-out;

        &.visually-hidden {
          opacity: 0;
          visibility: hidden;
          width: 0;
        }

        /* Applied during phase 2 of the geometry pass only.
           Button is invisible but at natural width so secondaryNavRects
           captures its real footprint for margin-inline-end calculation.
           transition:none prevents a width animation from 0→natural that
           would make the mid-animation measurement inaccurate. */
        &.is-measuring {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: none;
        }

        .overflow-details-summary {
          --_icon-zoom: 1;
          --_icon-size: var(--responsive-header-overflow-btn-size, 20px);
          --_border-width: 1px;
          --_outline-width: 1px;
          --_transition-duration: 0.2s;

          display: grid;
          grid-template-areas: "icon";
          align-items: center;
          justify-content: center;
          padding-inline: 5px;
          text-wrap: nowrap;

          aspect-ratio: 1;
          border-radius: 4px;
          border: var(--responsive-header-overflow-btn-border, 1px solid #ffffff90);
          outline: var(--responsive-header-overflow-btn-outline, 1px solid #ffffff10);
          background-color: var(--responsive-header-overflow-btn-bg, Canvas);

          width: var(--_icon-size);
          overflow: hidden;
          transition-property: all;
          transition-timing-function: linear;
          transition-duration: var(--_transition-duration);

          &::-webkit-details-marker,
          &::marker {
            display: none;
          }

          &:hover,
          &:focus-visible {
            --_icon-zoom: 1.2;
            outline: var(--responsive-header-overflow-btn-hover-outline, 1px solid #ffffff);
          }

          .icon {
            grid-area: icon;
            scale: var(--_icon-zoom);
            color: var(--responsive-header-overflow-btn-icon-color, inherit);
            transition: scale 0.2s ease-in-out;
            width: calc(var(--_icon-size) - var(--_border-width) * 2 - var(--_outline-width) * 2);
            height: calc(var(--_icon-size) - var(--_border-width) * 2 - var(--_outline-width) * 2);

            opacity: 0;
            transition-property: opacity, transform; /* For reference */
            transition-timing-function: linear; /* For reference */
            transition-duration: var(--_transition-duration); /* For reference */

            &.show {
              opacity: 1;
            }
          }
        }

        .overflow-details-nav {
          position: absolute;
          top: 135%;
          right: 0;
          background-color: var(--responsive-header-overflow-nav-bg, Canvas);
          border: var(--responsive-header-overflow-nav-border, 1px solid #ffffff90);
          border-radius: var(--responsive-header-overflow-nav-border-radius, 8px);
          padding-block: var(--responsive-header-overflow-nav-padding-block, 12px);
          margin: 0;
          z-index: 999;
          min-width: var(--_overflow-drop-down-width, fit-content);

          display: grid;
          grid-auto-flow: row;
          gap: 8px;
        }
      }
    }

    /* Once geometry has been calculated for this mount, enable item transitions.
       This prevents nav items from animating in on every route change while still
       providing smooth hide/show transitions when the viewport is resized. */
    &.geometry-ready {
      .main-navigation-item {
        transition:
          opacity 0.2s ease-in-out,
          visibility 0.2s ease-in-out;
      }
    }
  }

  /* ─── Anchor positioning for main-nav indicators ─────────────────────────
     Single --responsive-main-nav-indicator anchor: sits on is-hovered when
     something is hovered, falls back to is-active when nothing is hovered.
  ──────────────────────────────────────────────────────────────────────── */

  .main-navigation li.is-hovered {
    anchor-name: --responsive-main-nav-indicator;
  }

  .main-navigation:not(:has(li.is-hovered)) li.is-active {
    anchor-name: --responsive-main-nav-indicator;
  }

  .main-navigation .nav-indicator-hovered,
  .main-navigation .nav-indicator-active {
    display: none;
    pointer-events: none;
  }

  .main-navigation {
    .nav-indicator-hovered {
      display: block;
      position: absolute;
      position-anchor: --responsive-main-nav-indicator;
      left: anchor(left);
      right: anchor(right);
      top: anchor(top);
      bottom: anchor(bottom);
      background: var(--responsive-nav-decorator-hovered-bg, oklch(100% 0 0 / 8%));
      border-radius: 4px;
      z-index: 1;
      opacity: 0;
      transition:
        left 200ms ease,
        right 200ms ease,
        opacity 150ms ease;
    }

    &:not(.is-animated) .nav-indicator-hovered {
      transition: none;
    }

    &:has(li.is-hovered) .nav-indicator-hovered {
      opacity: 1;
    }

    .nav-indicator-active {
      display: block;
      position: absolute;
      position-anchor: --responsive-main-nav-indicator;
      left: anchor(left);
      right: anchor(right);
      bottom: calc(anchor(bottom) - 2px);
      height: 2px;
      background: var(--responsive-nav-decorator-indicator-color, currentColor);
      z-index: 3;
      transition:
        left 200ms ease,
        right 200ms ease;
    }

    &:not(.is-animated) .nav-indicator-active {
      transition: none;
    }

    &:has(li.is-hovered) .nav-indicator-active {
      background: var(
        --responsive-nav-decorator-hovered-indicator-color,
        var(--responsive-nav-decorator-indicator-color, currentColor)
      );
    }
  }
}
</style>
