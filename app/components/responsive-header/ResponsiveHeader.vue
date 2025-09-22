<template>
  <div class="navigation" :class="[elementClasses, { loaded: navLoaded }]" ref="navigationWrapper" role="banner">
    <nav class="main-navigation" ref="mainNav" aria-label="Main navigation">
      <ul
        v-for="(navGroup, groupKey) in responsiveNavLinks"
        :key="groupKey"
        class="main-navigation-list"
        :ref="el => setNavRef(String(groupKey), el as HTMLUListElement | null)"
      >
        <template v-for="(link, localIndex) in navGroup" :key="localIndex">
          <li
            v-if="link.path"
            class="main-navigation-item"
            :class="{
              'visually-hidden': !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible,
            }"
            :style="{
              '--_main-navigation-item-width':
                mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px',
            }"
            ref="mainNavigationItems"
            :data-group-key="groupKey"
            :data-local-index="localIndex"
            @mouseenter="handleNavigationItemHover"
            @focusin="handleNavigationItemHover"
          >
            <NuxtLink class="main-navigation-link" :class="{ 'has-icon': link.iconName }" :to="link.path">
              <Icon v-if="link.iconName" :name="link.iconName" class="decorator-icon" aria-hidden="true" />
              {{ link.name }}
            </NuxtLink>
          </li>
          <li
            v-else
            class="main-navigation-item"
            :class="{
              'visually-hidden': !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible,
            }"
            :style="{
              '--_main-navigation-item-width':
                mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px',
            }"
            ref="mainNavigationItems"
            :data-group-key="groupKey"
            :data-local-index="localIndex"
          >
            <details class="main-navigation-details" name="navigation-group" ref="navigationDetails">
              <summary
                @mouseenter="handleSummaryHover($event)"
                @focusin="handleSummaryHover($event)"
                @click.prevent="handleSummaryAction($event)"
                @keypup.prevent.stop="handleSummaryAction($event)"
                class="main-navigation-details-summary has-toggle-icon"
                :aria-label="`${link.childLinksTitle} submenu`"
              >
                <Icon name="mdi:chevron-down" class="icon" :aria-hidden="true" />
                <Icon v-if="link.iconName" :name="link.iconName" class="decorator-icon" aria-hidden="true" />

                {{ link.childLinksTitle }}
              </summary>
              <div class="main-navigation-sub-nav" role="menu">
                <ul class="main-navigation-sub-nav-list">
                  <li class="main-navigation-sub-nav-item" v-for="childLink in link.childLinks" :key="childLink.name">
                    <NuxtLink :to="childLink.path" class="main-navigation-sub-nav-link" role="menuitem">
                      {{ childLink.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </details>
          </li>
        </template>
      </ul>
    </nav>
    <nav class="secondary-navigation" ref="secondaryNav" aria-label="Secondary navigation">
      <details
        class="overflow-details"
        :class="[{ 'visually-hidden': !navLoaded || !showOverflowDetails }]"
        ref="overflowDetails"
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
    <LayoutRow tag="div" variant="full" :style-class-passthrough="['mb-20', 'debug-grid']">
      <ClientOnly>
        <div>
          <h2 class="page-heading-4">navigationWrapperRects</h2>
          <pre>{{ navigationWrapperRects }}</pre>
          <hr />
          <h2 class="page-heading-4">secondaryNavRects</h2>
          <pre>{{ secondaryNavRects }}</pre>
        </div>
        <div>
          <h2 class="page-heading-4">mainNavigationState</h2>
          <pre>{{ mainNavigationState }}</pre>
        </div>
      </ClientOnly>
    </LayoutRow>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver, onClickOutside } from "@vueuse/core"
import type { ResponsiveHeaderProp, ResponsiveHeaderState, IFlooredRect } from "@/types/responsiveHeader"

const props = defineProps({
  responsiveNavLinks: {
    type: Object as PropType<ResponsiveHeaderProp>,
    default: () => [],
  },
  gapBetweenFirstAndSecondNav: {
    type: Number,
    default: 12, // px
  },
  overflowDetailsSummaryIcons: {
    type: Object as PropType<Record<string, string>>,
    default: {
      more: "gravity-ui:ellipsis",
      burger: "gravity-ui:bars",
    },
  },
  collapseBreakpoint: {
    type: Number,
    default: null, // px
  },
  collapseAtMainNavIntersection: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  allowExpandOnGesture: {
    type: Boolean,
    default: true,
  },
})

const collapseNavigationBelowWidth = computed(
  () => props.collapseBreakpoint !== null || props.collapseAtMainNavIntersection
)
const collapseBreakpoint = ref(props.collapseBreakpoint)

// Use global navigation state for caching between route changes
const {
  navLoaded,
  navigationInitialized,
  navigationWrapperRects: cachedNavigationWrapperRects,
  secondaryNavRects: cachedSecondaryNavRects,
  clearNavigationCache,
} = useNavigationState()

const slots = useSlots()

const navigationWrapperRef = useTemplateRef("navigationWrapper")

const closeAllNavigationDetails = () => {
  navigationDetailsRefs.value?.forEach((element) => {
    element?.removeAttribute("open")
  })
  overflowDetailsRef.value?.removeAttribute("open")
}

const toggleDetailsElement = (event: Event) => {
  const summaryElement = event.currentTarget as HTMLElement
  const parentDetailsElement = summaryElement.closest("details")
  if (!parentDetailsElement) return

  if (parentDetailsElement.hasAttribute("open")) {
    parentDetailsElement.removeAttribute("open")
  } else {
    parentDetailsElement.setAttribute("open", "")
  }
  overflowDetailsRef.value?.removeAttribute("open")
}

const handleSummaryHover = (event: MouseEvent | FocusEvent) => {
  if (!props.allowExpandOnGesture) {
    return
  }

  // Close all other open navigation details first
  const summaryElement = event.currentTarget as HTMLElement
  const parentDetailsElement = summaryElement.closest("details")

  navigationDetailsRefs.value?.forEach((element) => {
    if (element !== parentDetailsElement) {
      element?.removeAttribute("open")
    }
  })
  overflowDetailsRef.value?.removeAttribute("open")

  // Then toggle the current one
  toggleDetailsElement(event)
}

const handleNavigationItemHover = () => {
  if (!props.allowExpandOnGesture) {
    return
  }

  // Close all open navigation details when hovering over regular nav items
  closeAllNavigationDetails()
}

const handleSummaryAction = (event: MouseEvent | KeyboardEvent) => {
  toggleDetailsElement(event)
}

// Initialize main navigation state
const mainNavigationState = ref<ResponsiveHeaderState>({
  navListVisibility: {
    firstNav: false,
    secondNav: false,
  },
  clonedNavLinks: props.responsiveNavLinks,
  hasSecondNav: Object.keys(props.responsiveNavLinks).length > 1,
})

const navRefs = ref<Record<string, HTMLUListElement | null>>({})

const setNavRef = (key: string, el: HTMLUListElement | null) => {
  navRefs.value[key] = el
}

const navigationWrapperRects = computed({
  get: () => cachedNavigationWrapperRects.value,
  set: (value: IFlooredRect | null) => {
    cachedNavigationWrapperRects.value = value
  },
})

const firstNavRef = ref<HTMLUListElement | null>(null)
const firstNavRects = ref<IFlooredRect | null>(null)

const secondNavRef = ref<HTMLUListElement | null>(null)
const secondNavRects = ref<IFlooredRect | null>(null)

const secondaryNavRef = useTemplateRef("secondaryNav")
const secondaryNavRects = computed({
  get: () => cachedSecondaryNavRects.value,
  set: (value: IFlooredRect | null) => {
    cachedSecondaryNavRects.value = value
  },
})

const mainNavigationItemsRefs = useTemplateRef<HTMLLIElement[]>("mainNavigationItems")

const navigationDetailsRefs = useTemplateRef<HTMLElement[]>("navigationDetails")

const overflowDetailsRef = useTemplateRef("overflowDetails")

const showOverflowDetails = computed(() => {
  const hasHiddenNav =
    !mainNavigationState.value.navListVisibility["firstNav"] ||
    (!mainNavigationState.value.navListVisibility["secondNav"] && mainNavigationState.value.hasSecondNav)
  return hasHiddenNav
})

const mainNavigationMarginBlockEnd = computed(() => {
  return secondaryNavRects.value ? secondaryNavRects.value.width + props.gapBetweenFirstAndSecondNav : 0
})

const mainNavigationMarginBlockEndStr = computed(() => {
  return mainNavigationMarginBlockEnd.value + "px"
})

const initTemplateRefs = async () => {
  firstNavRef.value = navRefs.value["firstNav"] as HTMLUListElement | null
  secondNavRef.value = navRefs.value["secondNav"] as HTMLUListElement | null
  return
}

const getFlooredRect = (rect: DOMRect | null) => {
  if (!rect) return null
  return {
    left: Math.floor(rect.left),
    right: Math.floor(rect.right),
    top: Math.floor(rect.top),
    bottom: Math.floor(rect.bottom),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height),
  }
}

const updateNavigationConfig = async (source: string) => {
  navigationWrapperRects.value =
    getFlooredRect((navigationWrapperRef.value && navigationWrapperRef.value.getBoundingClientRect()) ?? null) || null
  secondaryNavRects.value =
    getFlooredRect((secondaryNavRef.value && secondaryNavRef.value.getBoundingClientRect()) ?? null) || null
  firstNavRects.value = getFlooredRect((firstNavRef.value && firstNavRef.value.getBoundingClientRect()) ?? null) || null
  secondNavRects.value =
    getFlooredRect((secondNavRef.value && secondNavRef.value.getBoundingClientRect()) ?? null) || null

  if (collapseNavigationBelowWidth.value && firstNavRects.value) {
    collapseBreakpoint.value = firstNavRects.value?.right
  }
}

const allowNavigationCollapse = computed(() => {
  return (
    collapseNavigationBelowWidth.value &&
    navigationWrapperRects.value &&
    secondaryNavRects.value !== null &&
    Math.floor(secondaryNavRects.value.left - props.gapBetweenFirstAndSecondNav) <= collapseBreakpoint.value
  )
})

const determineNavigationItemVisibility = (rect: DOMRect) => {
  // Check if navigation should be collapsed based on width breakpoint
  if (allowNavigationCollapse.value) {
    return false
  }

  // Use default responsive visibility logic if wrapper exists
  if (navigationWrapperRects.value) {
    return (
      Math.floor(rect.right + mainNavigationMarginBlockEnd.value + props.gapBetweenFirstAndSecondNav) <
      navigationWrapperRects.value.right
    )
  }

  // Default to visible
  return true
}

const initMainNavigationState = () => {
  if (!mainNavigationItemsRefs.value) return

  mainNavigationItemsRefs.value.forEach(async (item, index) => {
    // await nextTick()
    const rect = item.getBoundingClientRect()

    const groupKey = item.dataset.groupKey
    const localIndex = item.dataset.localIndex ? parseInt(item.dataset.localIndex, 10) : 0
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
      }
    }

    // Check if a single item has visible set to false and set the visibility of the group accordingly
    if (
      typeof groupKey === "string" &&
      mainNavigationState.value.clonedNavLinks &&
      mainNavigationState.value.clonedNavLinks[groupKey] &&
      mainNavigationState.value.clonedNavLinks[groupKey][localIndex] &&
      mainNavigationState.value.clonedNavLinks[groupKey][localIndex].config?.visible === false
    ) {
      mainNavigationState.value.navListVisibility[groupKey] = false
    } else if (typeof groupKey === "string") {
      mainNavigationState.value.navListVisibility[groupKey] = true
    }
  })
}

// Function to set up click outside listeners
const setupClickOutsideListeners = () => {
  navigationDetailsRefs.value?.forEach((element, index) => {
    onClickOutside(element, () => {
      navigationDetailsRefs.value?.[index]?.removeAttribute("open")
    })
  })
  // Add onClickOutside to overflowDetailsRef
  overflowDetailsRef.value &&
    onClickOutside(overflowDetailsRef.value, () => {
      overflowDetailsRef.value?.removeAttribute("open")
    })
}

onMounted(async () => {
  // If navigation is already initialized and loaded, skip the template refs setup
  if (navigationInitialized.value && navLoaded.value) {
    // But still set up click outside listeners as DOM elements may have changed
    await nextTick()
    setupClickOutsideListeners()
    return
  }

  await initTemplateRefs().then(() => {
    navLoaded.value = true
    navigationInitialized.value = true
  })

  setupClickOutsideListeners()
})

useResizeObserver(navigationWrapperRef, async () => {
  await updateNavigationConfig("useResizeObserver").then(() => {
    initMainNavigationState()
  })
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
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

  --_link-visibility-transition: none;

  &.loaded {
    --_link-visibility-transition: all 0.2s ease-in-out;
  }

  /* flex-grow: 1; */
  display: grid;
  grid-template-areas: "navStack";

  margin: 12px;
  border-radius: 8px;
  background-color: #efefef05;
  border: 1px solid #efefef75;
  padding: 12px;

  .main-navigation {
    /* Set up some global vars */
    --_link-padding-block: 0.8rem;
    --_link-padding-inline: 0.2rem;
    --_link-margin-block: 0.1rem;
    --_link-margin-inline: 0.1rem;
    --_link-focus-visible-outline-width: 0.2rem;
    --_link-border-default: 2px solid transparent;
    --_link-border-bottom-hover: var(--green-8);

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
        transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
        padding-block: var(--_link-focus-visible-outline-width);
        padding-inline: var(--_link-focus-visible-outline-width);

        .main-navigation-link {
          display: flex;
          gap: 6px;
          text-wrap-mode: nowrap;
          color: inherit;
          text-decoration: none;
          margin-inline-start: 0;
          /* transition: var(--_link-visibility-transition); */

          padding-block: var(--_link-padding-block);
          padding-inline: var(--_link-padding-inline);
          margin-block: var(--_link-margin-block);
          margin-inline: var(--_link-margin-inline);
          border-bottom: var(--_link-border-default);

          &:hover {
            cursor: pointer;
            border-bottom-color: var(--_link-border-bottom-hover);
          }
        }

        .main-navigation-details {
          --_icon-transform: scaleY(1);

          margin-inline-start: 0;
          /* transition: var(--_link-visibility-transition); */

          &[open] {
            --_icon-transform: scaleY(-1);

            .main-navigation-details-summary {
              border-bottom-color: var(--_link-border-bottom-hover);
            }
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

            &::-webkit-details-marker,
            &::marker {
              display: none;
            }

            &:hover {
              cursor: pointer;
              border-bottom-color: var(--_link-border-bottom-hover);
            }

            .decorator-icon {
              margin-inline-start: 8px;
            }
          }

          .main-navigation-sub-nav {
            position: absolute;
            padding: 12px;
            border: 1px solid #efefef75;
            border-radius: 8px;
            background-color: #000;
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
                  color: inherit;
                }
              }
            }
          }
        }

        &.visually-hidden {
          visibility: hidden;
          opacity: 0;

          .main-navigation-details,
          .main-navigation-link {
            margin-inline-start: var(--_main-navigation-item-width);
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
          color: inherit;

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
        --_icon-size: 20px;
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
        border: var(--_border-width) solid #ffffff90;
        outline: var(--_outline-width) solid #ffffff10;
        background-color: Canvas;

        width: var(--_icon-size);
        height: var(--_icon-size);
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
          outline: var(--_outline-width) solid #ffffff;
        }

        .icon {
          grid-area: icon;
          scale: var(--_icon-zoom);
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
        background-color: #000;
        border: 1px solid #ffffff90;
        border-radius: 8px;
        padding-block: 12px;
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

.debug-grid {
  display: none;

  .layout-row-inner > div {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    margin-inline: 12px;

    > div {
      outline: 1px solid gray;
      padding: 12px;
    }
  }
}
</style>
