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
          <DisplayDetailsCore :id="useId()" name="overflow-navigation-group" :animation-duration="detailsAanimationDuration" icon-size="medium" :style-class-passthrough="['overflow-navigation-details']">
            <template #summary>
              <span class="overflow-navigation-text">{{ link.childLinksTitle }}</span>
            </template>
            <template #summaryIcon>
              <Icon name="mdi:chevron-down" class="icon" />
            </template>
            <template #content>
              <div class="overflow-navigation-sub-nav-inner">
                <ul class="overflow-navigation-sub-nav-list">
                  <li v-for="childLink in link.childLinks" :key="childLink.name" class="overflow-navigation-sub-nav-item">
                    <NuxtLink :to="childLink.path" class="overflow-navigation-sub-nav-link"><span class="overflow-navigation-sub-nav-text">{{ childLink.name }}</span></NuxtLink>
                  </li>
                </ul>
              </div>
            </template>
          </DisplayDetailsCore>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveHeaderState } from '@/types/responsiveHeader';

const props = defineProps({
  mainNavigationState: {
    type: Object as PropType<ResponsiveHeaderState>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const detailsAanimationDuration = 200;
const detailsAanimationDurationString = `${detailsAanimationDuration}ms`;

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

      .overflow-navigation-link {
        text-decoration: none;
        color: inherit;
      }

      .overflow-navigation-details {
        --_overflow-navigation-sub-nav-list-margin-block-start: 0;

        &[open] {
          --_overflow-navigation-sub-nav-list-margin-block-start: 12px;
        }

        &.display-details {
          margin-block-end: 0;

          .display-details-summary {
            .label {
              .overflow-navigation-text {
                text-wrap: nowrap;
              }
            }
            /* .icon {} */
          }
          .display-details-content {
            .overflow-navigation-sub-nav-inner {
              .overflow-navigation-sub-nav-list {

                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-block-start: var(--_overflow-navigation-sub-nav-list-margin-block-start);
                transition: margin-block-start v-bind(detailsAanimationDurationString) ease;

                .overflow-navigation-sub-nav-item {

                  .overflow-navigation-sub-nav-link {
                    text-decoration: none;
                    color: inherit;

                    /* .overflow-navigation-sub-nav-text {} */
                  }
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
