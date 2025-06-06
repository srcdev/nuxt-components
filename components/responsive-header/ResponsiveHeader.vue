<template>
  <header class="responsive-header" :class="[elementClasses]">
    <h1><a href="/">Logo</a></h1>
    <div class="navigation" :class="[{ loaded: navLoaded }]" ref="navigationWrapper">
      <nav class="main-navigation" :class="[{ collapsed: navRefTrackState.isCollapsed }]" ref="mainNav">

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
              :class="{ 'visually-hidden': !checkMainNavigationItemsVisibility(flatNavItems.findIndex(item => item === link)) }"
              :style="{ '--_main-navigation-item-width': getMainNavigationItemStyle(flatNavItems.findIndex(item => item === link)) }"
              ref="mainNavigationItems"
              :data-index="flatNavItems.findIndex(item => item === link)"
            >
              <NuxtLink class="main-navigation-link" :to="link.path">{{ link.name }}</NuxtLink>
            </li>
            <li
              v-else
              class="main-navigation-item"
              :class="{ 'visually-hidden': !checkMainNavigationItemsVisibility(flatNavItems.findIndex(item => item === link)) }"
              :style="{ '--_main-navigation-item-width': getMainNavigationItemStyle(flatNavItems.findIndex(item => item === link)) }"
              ref="mainNavigationItems"
              :data-index="flatNavItems.findIndex(item => item === link)"
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
                <div class="main-navigation-details-sub-nav">
                  <ul>
                    <li v-for="childLink in link.childLinks" :key="childLink.name">
                      <NuxtLink :to="childLink.path">{{ childLink.name }}</NuxtLink>
                    </li>
                  </ul>
                </div>
              </details>
            </li>
          </template>
        </ul>

      </nav>
      <nav class="secondary-navigation" ref="secondaryNav">
        <details class="overflow-details" :class="[{ 'visually-hidden': !navRefTrackState.atMinWidth }]" ref="overflowDetails" name="overflow-group">
          <summary class="has-toggle-icon">
            <Icon name="gravity-ui:ellipsis" class="icon" />
          </summary>
          <div class="overflow-details-nav" id="overflowList"></div>
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
        <h2 class="heading-4">navRefTrackState</h2>
        <pre>{{ navRefTrackState }}</pre>
      </div>
      <div>
        <h2 class="heading-4">firstNavRef</h2>
        <pre>{{ firstNavRects }}</pre>
      </div>
      <div>
        <h2 class="heading-4">secondNavRects</h2>
        <pre>{{ secondNavRects }}</pre>
      </div>
      <div>
        <h2 class="heading-4">secondaryNavRects</h2>
        <pre>{{ secondaryNavRects }}</pre>
      </div>
      <div>
        <h2 class="heading-4">mainNavigationItemsState</h2>
        <pre>{{ mainNavigationItemsState }}</pre>
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
  }

  interface IResponsiveNavLinks {
    [key: string]: INavLink[];
  }

  interface DetailsConfigItem {
    left: number;
    right: number;
    visible: boolean;
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

const navRefs = ref<Record<string, HTMLUListElement | null>>({});
const navRefTrackState = ref({
  isInitialized: false,
  navRefsMinWidthCurrent: 0,
  navRefsMinWidthPrevious: 0,
  atMinWidth: false,
  isCollapsed: false,
  navRefsMaxWidth: 0,
})

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
const mainNavigationItemsState = ref<MainNavigationItem[]>([]);

const navigationDetailsRefs = useTemplateRef<HTMLElement[]>('navigationDetails');

const mainNavigationMarginBlockEnd = computed(() => {
  return navRefTrackState.value.atMinWidth && secondaryNavRects.value
    ? secondaryNavRects.value.width
    : 0;
});

const checkMainNavigationItemsVisibility = (index: number) => {
  if (!navigationWrapperRects.value || !mainNavigationItemsState.value[index]) return false;
  const item = mainNavigationItemsState.value[index];
  return item.visible;
}

const initTemplateRefs = async () => {
  // console.log("initTemplateRefs called");

  firstNavRef.value = navRefs.value['firstNav'] as HTMLUListElement | null;
  secondNavRef.value = navRefs.value['secondNav'] as HTMLUListElement | null;

  return;
}

const getMainNavigationItemWidth = (index: number): number | string => {
  const item = mainNavigationItemsState.value[index];
  return item?.width ?? 'auto';
};

const getMainNavigationItemStyle = (index: number): string => {
  const width = getMainNavigationItemWidth(index);
  return typeof width === 'number' ? `${width}px` : width;
};

// Helper function to return Math.floor values from getBoundingClientRect()
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

const setNavigationConfig = async (source: string) => {
  // console.clear();
  // console.log("setNavigationConfig called", source);
  // Get the bounding rectangle of the main navigation
  navigationWrapperRects.value = getFlooredRect((navigationWrapperRef.value && navigationWrapperRef.value.getBoundingClientRect()) ?? null) || null;
  secondaryNavRects.value = getFlooredRect((secondaryNavRef.value && secondaryNavRef.value.getBoundingClientRect()) ?? null) || null;
  firstNavRects.value = getFlooredRect((firstNavRef.value && firstNavRef.value.getBoundingClientRect()) ?? null) || null;
  secondNavRects.value = getFlooredRect((secondNavRef.value && secondNavRef.value.getBoundingClientRect()) ?? null) || null;

  // If navRefTrackState is not initialized, set the previous min width for correct calculations
  if (!navRefTrackState.value.isInitialized) {
    navRefTrackState.value.navRefsMinWidthPrevious = secondNavRects.value ? secondNavRects.value.right : 0;
  }

  navRefTrackState.value.navRefsMinWidthCurrent = secondNavRects.value ? secondNavRects.value.right : 0;

  if (navRefTrackState.value.isInitialized) {
    navRefTrackState.value.atMinWidth = (navRefTrackState.value.navRefsMinWidthCurrent === navRefTrackState.value.navRefsMinWidthPrevious);

    if (navRefTrackState.value.atMinWidth) {
      // console.log("atMinWidth is true");
      navRefTrackState.value.isCollapsed = navigationWrapperRects.value !== null
        && secondaryNavRects.value !== null
        && (navigationWrapperRects.value.right < secondaryNavRects.value.right);

    }

  }
  navRefTrackState.value.navRefsMinWidthPrevious = secondNavRects.value ? secondNavRects.value.right : 0;
  navRefTrackState.value.isInitialized = true;

}

const setMainNavigationItemsState = () => {
  if (!mainNavigationItemsRefs.value) return;

  mainNavigationItemsState.value = Array.from(mainNavigationItemsRefs.value).map((item, index) => {
    const rect = item.getBoundingClientRect();

    const width = navLoaded.value
      ? mainNavigationItemsState.value[index]?.width
      : Math.ceil(rect.width);

    // console.log(`setMainNavigationItemsState: navLoaded ${navLoaded.value} item ${index}, width: ${width}`);

    return {
      left: Math.floor(rect.left),
      right: Math.floor(rect.right),
      width: Math.ceil(rect.width),
      visible: navigationWrapperRects.value ? Math.floor(rect.right + mainNavigationMarginBlockEnd.value + gapBetweenMainNavAndSecondaryNav) < navigationWrapperRects.value.right : true,
    };
  });
}

onMounted(async() => {
  await initTemplateRefs();
  setTimeout(() => {
    navLoaded.value = true;
  }, 100);

  navigationDetailsRefs.value?.forEach((element, index) => {
    onClickOutside(element, () => {
      navigationDetailsRefs.value?.[index]?.removeAttribute('open');
    });
  });
});

useResizeObserver(navigationWrapperRef, async () => {
  await setNavigationConfig("useResizeObserver").then(() => {
    setMainNavigationItemsState();
  });
});



/*
* Handle css props
*/
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
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
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

        .main-navigation-details-sub-nav {
          position: absolute;
          padding: 12px;
          border: 1px solid #efefef75;
          border-radius: 8px;
          background-color: #000;
          translate: 0 12px;

          min-width: var(--_main-navigation-item-width);

          > ul {
            li {
              margin-bottom: 8px;

              &:last-child {
                margin-bottom: 0;
              }

              a {
                display: block;
                text-wrap-mode: nowrap;
              }
            }
          }
        }

        &.cloned {
          .main-navigation-details-sub-nav {
            position: initial;
            border: none;
            padding: 0 0 12px 0;
          }
        }
      }

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

        summary {
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

          &:hover {
            --_icon-zoom: 1.2;
            outline: 1px solid #ffffff;
          }

          .icon {
            scale: var(--_icon-zoom);
            transition: scale 0.2s ease-in-out;
          }
        }

        summary::-webkit-details-marker,
        summary::marker {
          display: none;
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
          min-width: var(--_overflow-drop-down-width, 120px);

          display: grid;
          grid-auto-flow: row;
          gap: 8px;

          ul[class^='overflow-'] {
            .main-navigation-item {
              margin-bottom: 8px;
            }

            /* + ul[class^='overflow-'] {
              margin-top: 12px;
            } */
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
        /* display: flex;
        flex-wrap: nowrap;
        gap: 12px;
        justify-content: space-between; */
      }
    }
  }

  .debug-grid {

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
