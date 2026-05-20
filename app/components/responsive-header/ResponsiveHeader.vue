<template>
  <div ref="navigationWrapper" class="navigation" :class="[elementClasses, { loaded: navLoaded }]" role="banner">
    <nav ref="mainNav" class="main-navigation" :class="{ 'is-animated': isAnimated }" aria-label="Main navigation" @mouseleave="hoveredItemKey = null">
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
            <div class="main-navigation-sub-nav" role="menu">
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
        :class="[{ 'visually-hidden': !navLoaded || !showOverflowDetails }]"
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
import type { ResponsiveHeaderProp, ResponsiveHeaderState, IFlooredRect, ResponsiveHeaderNavItem } from "../../types/components";
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

  // Close all other open navigation details first
  const summaryElement = event.currentTarget as HTMLElement;
  const parentDetailsElement = summaryElement.closest("details");

  navigationDetailsRefs.value?.forEach((element) => {
    if (element !== parentDetailsElement) {
      element?.removeAttribute("open");
    }
  });
  overflowDetailsRef.value?.removeAttribute("open");

  // Then toggle the current one
  toggleDetailsElement(event);
};

const handleNavigationItemHover = (key: string) => {
  hoveredItemKey.value = key;
  if (!props.allowExpandOnGesture) {
    return;
  }
  closeAllNavigationDetails();
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

onMounted(async () => {
  // If navigation is already initialized and loaded, skip the template refs setup
  if (navigationInitialized.value && navLoaded.value) {
    // But still set up click outside listeners as DOM elements may have changed
    await nextTick();
    setupClickOutsideListeners();
    return;
  }

  await initTemplateRefs().then(() => {
    navLoaded.value = true;
    navigationInitialized.value = true;
  });

  setupClickOutsideListeners();
});

useResizeObserver(navigationWrapperRef, async () => {
  await updateNavigationConfig("useResizeObserver").then(() => {
    initMainNavigationState();
  });
});

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

       --responsive-nav-decorator-indicator-color  (default: currentColor)
       --responsive-nav-decorator-hovered-bg       (default: oklch(100% 0 0 / 8%))
    ──────────────────────────────────────────────────────────────────────── */

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
          transition:
            opacity 0.2s ease-in-out,
            visibility 0.2s ease-in-out;
          padding-block: var(--_link-focus-visible-outline-width);
          padding-inline: var(--_link-focus-visible-outline-width);

          .main-navigation-link {
            display: flex;
            gap: 6px;
            text-wrap-mode: nowrap;
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

              .icon {
                display: block;
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

      .main-navigation-link {
        .icon {
          height: 1.35em;
          width: 1.35em;
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

  .main-navigation .nav-indicator-hovered {
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

  .main-navigation:not(.is-animated) .nav-indicator-hovered {
    transition: none;
  }

  .main-navigation:has(li.is-hovered) .nav-indicator-hovered {
    opacity: 1;
  }

  .main-navigation .nav-indicator-active {
    display: block;
    position: absolute;
    position-anchor: --responsive-main-nav-indicator;
    left: anchor(left);
    right: anchor(right);
    bottom: 0;
    height: 2px;
    background: var(--responsive-nav-decorator-indicator-color, currentColor);
    z-index: 3;
    transition:
      left 200ms ease,
      right 200ms ease;
  }

  .main-navigation:not(.is-animated) .nav-indicator-active {
    transition: none;
  }
}
</style>
