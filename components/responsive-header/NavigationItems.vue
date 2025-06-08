<template>
  <div class="overflow-navigation-wrapper" :class="elementClasses">
    <ul
      v-for="(navGroup, groupKey) in mainNavigationState.clonedNavLinks"
      :key="groupKey"
      class="overflow-navigation-list"
      :class="[{visible: !mainNavigationState.navListVisibility[groupKey]}]"
      :style="{ '--_overflow-navigation-list-min-width': widestNavLinkWidthInMainNavigationState + 'px' }"
    >
      <template v-for="(link, localIndex) in navGroup" :key="localIndex">
        <li
          v-if="link.path"
          class="overflow-navigation-item"
          :class="{ 'visible': !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible }"
          :style="{ '--_main-navigation-item-width': mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px' }"
          :data-group-key="groupKey"
          :data-local-index="localIndex"
        >
          <NuxtLink class="overflow-navigation-link" :to="link.path"><span class="overflow-navigation-text">{{ link.name }}</span></NuxtLink>
        </li>
        <li
          v-else
          class="overflow-navigation-item"
          :class="{ 'visible': !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible }"
          :style="{ '--_main-navigation-item-width': mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px' }"
          :data-group-key="groupKey"
          :data-local-index="localIndex"
        >
          <details
            class="overflow-navigation-details"
            name="overflow-navigation-group"
          >
            <summary class="overflow-navigation-summary has-toggle-icon">
              <Icon name="mdi:chevron-down" class="icon" />
              <span class="overflow-navigation-text">{{ link.childLinksTitle }}</span>
            </summary>
            <div class="overflow-navigation-sub-nav">
              <ul class="overflow-navigation-sub-nav-list">
                <li v-for="childLink in link.childLinks" :key="childLink.name" class="overflow-navigation-sub-nav-item">
                  <NuxtLink :to="childLink.path" class="overflow-navigation-sub-nav-link"><span class="overflow-navigation-sub-nav-text">{{ childLink.name }}</span></NuxtLink>
                </li>
              </ul>
            </div>
          </details>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
  interface NavLinkConfig {
    left: number;
    right: number;
    width?: number;
    visible: boolean;
  }

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
const props = defineProps({
  mainNavigationState: {
    type: Object as PropType<INavigationRefTrackState>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const widestNavLinkWidthInMainNavigationState = computed(() => {
  return Object.values(props.mainNavigationState.clonedNavLinks || {}).reduce((maxWidth, group) => {
    return Math.max(
      maxWidth,
      ...group.map(link => link.config?.width || 0)
    );
  }, 0);
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

.overflow-navigation-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .overflow-navigation-list {

    display: none;

    &.visible {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: var(--_overflow-navigation-list-min-width, auto);
    }


    .overflow-navigation-item {

      display: none;

      &.visible {
        display: block;
      }

      /* Shared text between link and summary tags */
      .overflow-navigation-text {

      }

      .overflow-navigation-link {
        text-decoration: none;
        color: inherit;
      }

      .overflow-navigation-details {
        .overflow-navigation-summary {
          flex-direction: row-reverse;
          justify-content: space-between;
        }

        .overflow-navigation-sub-nav {

          .overflow-navigation-sub-nav-list {

            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-block-start: 12px;

            .overflow-navigation-sub-nav-item {

              .overflow-navigation-sub-nav-link {
                text-decoration: none;
                color: inherit;

                .overflow-navigation-sub-nav-text {

                }
              }
            }
          }
        }
      }
    }
  }
}


</style>
