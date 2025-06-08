<template>
  <header class="responsive-header" :class="[elementClasses]">
    <h1><a href="/">Logo</a></h1>
    <div class="navigation" :class="[{ loaded: navLoaded }]" ref="navigationWrapper">
      <nav class="main-navigation" :class="[{ collapsed: mainNavigationState.isCollapsed }]" ref="mainNav">

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
              :class="{ 'visually-hidden': !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible }"
              :style="{ '--_main-navigation-item-width': mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px' }"
              ref="mainNavigationItems"
              :data-group-key="groupKey"
              :data-local-index="localIndex"
            >
              <NuxtLink class="main-navigation-link" :to="link.path">{{ link.name }}</NuxtLink>
            </li>
            <li
              v-else
              class="main-navigation-item"
              :class="{ 'visually-hidden': !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible }"
              :style="{ '--_main-navigation-item-width': mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px' }"
              ref="mainNavigationItems"
              :data-group-key="groupKey"
              :data-local-index="localIndex"
            >
              <details
                class="main-navigation-details"
                name="navigation-group"
                ref="navigationDetails"
              >
                <summary class="main-navigation-link has-toggle-icon">
                  <Icon name="mdi:chevron-down" class="icon" />
                  {{ link.childLinksTitle }}
                </summary>
                <div class="main-navigation-sub-nav">
                  <ul class="main-navigation-sub-nav-list">
                    <li class="main-navigation-sub-nav-item" v-for="childLink in link.childLinks" :key="childLink.name">
                      <NuxtLink :to="childLink.path" class="main-navigation-sub-nav-link">{{ childLink.name }}</NuxtLink>
                    </li>
                  </ul>
                </div>
              </details>
            </li>
          </template>
        </ul>

      </nav>
      <nav class="secondary-navigation" ref="secondaryNav">
        <details class="overflow-details" :class="[{ 'visually-hidden': !mainNavigationState.atMinWidth }]" ref="overflowDetails" name="overflow-group">
          <summary class="overflow-details-summary has-toggle-icon">
            <Icon name="gravity-ui:ellipsis" class="icon" />
          </summary>
          <div class="overflow-details-nav">
            <NavigationItems
              :main-navigation-state="mainNavigationState"
            />
          </div>
        </details>
      </nav>
    </div>
  </header>
  <LayoutRow
    tag="div"
    variant="full"
    :style-class-passthrough="['mb-20', 'debug-grid']"
  >
    <ClientOnly>
      <div>
        <h2 class="heading-4">navigationWrapperRects</h2>
        <pre>{{ navigationWrapperRects }}</pre>
      </div>
      <div>
        <h2 class="heading-4">mainNavigationState</h2>
        <pre>{{ mainNavigationState }}</pre>
      </div>
    </ClientOnly>

  </LayoutRow>
</template>

<script lang="ts">

  interface INavLink {
    name: string;
    path?: string;
    isExternal?: boolean;
    childLinksTitle?: string;
    childLinks?: INavLink[];
    config?: NavLinkConfig;
  }

  interface IResponsiveNavLinks {
    [key: string]: INavLink[];
  }

  interface MainNavigationItem {
    left: number;
    right: number;
    width?: number;
    visible: boolean;
  }

  interface IFlooredRect {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  }

  interface NavLinkConfig {
    left: number;
    right: number;
    width?: number;
    visible: boolean;
  }

  interface INavigationRefTrackState {
    isInitialized: boolean;
    navRefsMinWidthCurrent: number;
    navRefsMinWidthPrevious: number;
    atMinWidth: boolean;
    isCollapsed: boolean;
    navRefsMaxWidth: number;
    navListVisibility: Record<string, boolean>;
    clonedNavLinks?: IResponsiveNavLinks;
  }


</script>

<script setup lang="ts">
import { useResizeObserver, onClickOutside } from '@vueuse/core';

const props = defineProps({
  responsiveNavLinks: {
    type: Object as PropType<IResponsiveNavLinks>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const flatNavItems = computed(() => {
  const items = []
  for (const groupKey in props.responsiveNavLinks) {
    for (const link of props.responsiveNavLinks[groupKey]) {
      items.push(link)
    }
  }
  return items
})


const navLoaded = ref(false);
const navigationWrapperRef = useTemplateRef('navigationWrapper');
const mainNavRef = useTemplateRef('mainNav');
const gapBetweenMainNavAndSecondaryNav = 12; // px

const mainNavigationState = ref<INavigationRefTrackState>({
  isInitialized: false,
  navRefsMinWidthCurrent: 0,
  navRefsMinWidthPrevious: 0,
  atMinWidth: false,
  isCollapsed: false,
  navRefsMaxWidth: 0,
  navListVisibility: {
    firstNav: false,
    secondNav: false,
  },
  clonedNavLinks: props.responsiveNavLinks,
});

// const navListVisibility = ref<Record<string, boolean>>({
//   firstNav: true,
//   secondNav: true,
// });

const navRefs = ref<Record<string, HTMLUListElement | null>>({});

const setNavRef = (key: string, el: HTMLUListElement | null) => {
  navRefs.value[key] = el
}

const navigationWrapperRects = ref<IFlooredRect | null>(null);
const firstNavRef = ref<HTMLUListElement | null>(null);
const firstNavRects = ref<IFlooredRect | null>(null);

const secondNavRef = ref<HTMLUListElement | null>(null);
const secondNavRects = ref<IFlooredRect | null>(null);

const secondaryNavRef = useTemplateRef('secondaryNav');
const secondaryNavRects = ref<IFlooredRect | null>(null);

const mainNavigationItemsRefs = useTemplateRef<HTMLLIElement[]>('mainNavigationItems');

const navigationDetailsRefs = useTemplateRef<HTMLElement[]>('navigationDetails');

const overflowDetailsRef = useTemplateRef('overflowDetails');

const mainNavigationMarginBlockEnd = computed(() => {
  return mainNavigationState.value.atMinWidth && secondaryNavRects.value
    ? secondaryNavRects.value.width
    : 0;
});

const initTemplateRefs = async () => {
  firstNavRef.value = navRefs.value['firstNav'] as HTMLUListElement | null;
  secondNavRef.value = navRefs.value['secondNav'] as HTMLUListElement | null;
  return;
}

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
}

const updateNavigationConfig = async (source: string) => {
  navigationWrapperRects.value = getFlooredRect((navigationWrapperRef.value && navigationWrapperRef.value.getBoundingClientRect()) ?? null) || null;
  secondaryNavRects.value = getFlooredRect((secondaryNavRef.value && secondaryNavRef.value.getBoundingClientRect()) ?? null) || null;
  firstNavRects.value = getFlooredRect((firstNavRef.value && firstNavRef.value.getBoundingClientRect()) ?? null) || null;
  secondNavRects.value = getFlooredRect((secondNavRef.value && secondNavRef.value.getBoundingClientRect()) ?? null) || null;

  if (!mainNavigationState.value.isInitialized) {
    mainNavigationState.value.navRefsMinWidthPrevious = secondNavRects.value ? secondNavRects.value.right : 0;
  }

  mainNavigationState.value.navRefsMinWidthCurrent = secondNavRects.value ? secondNavRects.value.right : 0;

  if (mainNavigationState.value.isInitialized) {
    mainNavigationState.value.atMinWidth = (mainNavigationState.value.navRefsMinWidthCurrent === mainNavigationState.value.navRefsMinWidthPrevious);
    if (mainNavigationState.value.atMinWidth) {
      mainNavigationState.value.isCollapsed = navigationWrapperRects.value !== null
        && secondaryNavRects.value !== null
        && (navigationWrapperRects.value.right < secondaryNavRects.value.right);
    }
  }
  mainNavigationState.value.navRefsMinWidthPrevious = secondNavRects.value ? secondNavRects.value.right : 0;
  mainNavigationState.value.isInitialized = true;
}

const initMainNavigationState = () => {
  if (!mainNavigationItemsRefs.value) return;

  mainNavigationItemsRefs.value.forEach((item, index) => {

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
          visible: navigationWrapperRects.value ? Math.floor(rect.right + mainNavigationMarginBlockEnd.value + gapBetweenMainNavAndSecondaryNav) < navigationWrapperRects.value.right : true,
        },
      };
    }

    // Check if a single item has visible set to false and set the visibility of the group accordingly
    if (
      typeof groupKey === 'string' &&
      mainNavigationState.value.clonedNavLinks &&
      mainNavigationState.value.clonedNavLinks[groupKey] &&
      mainNavigationState.value.clonedNavLinks[groupKey][localIndex].config?.visible === false
    ) {
      mainNavigationState.value.navListVisibility[groupKey] = false;
    } else if (typeof groupKey === 'string') {
      mainNavigationState.value.navListVisibility[groupKey] = true;
    }
  })

}

onMounted(async() => {
  await initTemplateRefs().then(() => {
    setTimeout(() => {
      navLoaded.value = true;
    }, 100);
  });

  navigationDetailsRefs.value?.forEach((element, index) => {
    onClickOutside(element, () => {
      navigationDetailsRefs.value?.[index]?.removeAttribute('open');
    });
  });
  // Add onClickOutside to overflowDetailsRef
  overflowDetailsRef.value && onClickOutside(overflowDetailsRef.value, () => {
    overflowDetailsRef.value?.removeAttribute('open');
  });
});

useResizeObserver(navigationWrapperRef, async () => {
  await updateNavigationConfig("useResizeObserver").then(() => {
    initMainNavigationState()
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
  .responsive-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
    align-items: center;
    padding-block: 12px;
    padding-inline: 24px;

    h1 {
      text-wrap-mode: nowrap;
    }

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

    details {
      --_icon-transform: scaleY(1);

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
    }

    .navigation {
      --_link-visibility-transition: none;

      &.loaded {
        --_link-visibility-transition: all 0.2s ease-in-out;
      }


      display: grid;
      grid-template-areas: 'navStack';

      margin: 12px;
      border-radius: 8px;
      background-color: #efefef05;
      border: 1px solid #efefef75;
      padding: 12px;

      /* background: yellow; */

      /*
      * .main-navigation-link & .main-navigation-details placed here they can also exist within
      */
      .main-navigation-link {
        display: flex;
        text-wrap-mode: nowrap;
        color: inherit;
        text-decoration: none;
      }

      .main-navigation-details {
        .main-navigation-link {
          list-style: none;
        }

        summary::-webkit-details-marker,
        summary::marker {
          display: none;
        }

        summary:hover {
          cursor: pointer;
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

            display: flex;
            flex-direction: column;
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

      .main-navigation {
        grid-area: navStack;
        display: flex;
        flex-wrap: nowrap;
        flex-grow: 1;
        justify-content: space-between;
        gap: 60px;

        &.collapsed {
          justify-content: flex-start;
        }

        /* margin-inline-end: calc(var(--_secondary-nav-width) + var(--_gap-for-overflow-details)); */
        /* margin-inline-end: v-bind(`${mainNavigationMarginBlockEnd}px`); */
        overflow-x: hidden;

        outline: 0px solid green;

        .main-navigation-list {
          display: flex;
          flex-wrap: nowrap;
          /* gap: 24px; */

          &:nth-of-type(1) {
            gap: 30px;
          }

          &:nth-of-type(2) {
            gap: 30px;
          }


          /* .main-navigation-item {
            transition:
              opacity 0.2s ease-in-out,
              visibility 0.2s ease-in-out;

            &.visually-hidden {
              visibility: hidden;
              opacity: 0;
            }
          } */


          .main-navigation-item {
            width: var(--_main-navigation-item-width);
            overflow: hidden;
            transition:
              opacity 0.2s ease-in-out,
              visibility 0.2s ease-in-out;

            .main-navigation-details,
            .main-navigation-link {
              margin-inline-start: 0;
              transition: var(--_link-visibility-transition);
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

        .overflow-details {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
          cursor: pointer;

          transition: all 0.2s ease-in-out;

          &.visually-hidden {
            opacity: 0;
            visibility: hidden;
            /* width: 0; */
          }

          .overflow-details-summary {
            --_icon-zoom: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-inline: 5px;
            text-wrap: nowrap;

            aspect-ratio: 1;
            border-radius: 4px;
            border: 1px solid #ffffff90;
            outline: 1px solid #ffffff10;
            background-color: Canvas;

            width: 28px;
            overflow: hidden;


            &::-webkit-details-marker,
            &::marker {
              display: none;
            }

            &:hover {
              --_icon-zoom: 1.2;
              outline: 1px solid #ffffff;
            }

            .icon {
              scale: var(--_icon-zoom);
              transition: scale 0.2s ease-in-out;
            }
          }


          .overflow-details-nav {
            position: absolute;
            top: 135%;
            right: 0;
            background-color: #000;
            border: 1px solid #ffffff90;
            border-radius: 8px;
            padding: 12px;
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
  }

  .debug-grid {
    /* display: none; */

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
