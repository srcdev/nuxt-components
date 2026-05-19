<template>
  <div class="overflow-navigation-wrapper" :class="elementClasses" role="menu" aria-label="Overflow navigation menu" @mouseleave="hoveredItemKey = null">
    <ul
      v-for="(navGroup, groupKey) in mainNavigationState.clonedNavLinks"
      :key="groupKey"
      class="overflow-navigation-list"
      :class="[{ visible: !mainNavigationState.navListVisibility[groupKey] }]"
      :style="{ '--_overflow-navigation-list-min-width': widestNavLinkWidthInMainNavigationState + 'px' }"
      role="none"
    >
      <template v-for="(link, localIndex) in navGroup" :key="localIndex">
        <li
          v-if="link.path"
          class="overflow-navigation-item"
          :class="{
            visible: !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible,
            'is-hovered': hoveredItemKey === `${String(groupKey)}-${localIndex}`,
            'is-active': isActiveNavItem(link),
          }"
          :style="{
            '--_main-navigation-item-width':
              mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px',
          }"
          :data-group-key="groupKey"
          :data-local-index="localIndex"
          role="none"
          @mouseenter="hoveredItemKey = `${String(groupKey)}-${localIndex}`"
        >
          <NuxtLink class="overflow-navigation-link" :to="link.path" role="menuitem">
            <span class="overflow-navigation-text">{{ link.name }}</span>
          </NuxtLink>
        </li>
        <li
          v-else
          class="overflow-navigation-item"
          :class="{
            visible: !mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.visible,
            'is-hovered': hoveredItemKey === `${String(groupKey)}-${localIndex}`,
            'is-active': isActiveNavItem(link),
          }"
          :style="{
            '--_main-navigation-item-width':
              mainNavigationState.clonedNavLinks?.[groupKey]?.[localIndex]?.config?.width + 'px',
          }"
          :data-group-key="groupKey"
          :data-local-index="localIndex"
          role="none"
          @mouseenter="hoveredItemKey = `${String(groupKey)}-${localIndex}`"
        >
          <ExpandingPanel
            name="overflow-navigation-group"
            :animation-duration="DETAILS_ANIMATION_DURATION"
            icon-size="medium"
            :style-class-passthrough="['overflow-navigation-details']"
          >
            <template #summary>
              <span
                class="overflow-navigation-text"
                :aria-label="`${link.childLinksTitle} submenu`"
                role="menuitem"
                :aria-haspopup="true"
              >
                {{ link.childLinksTitle }}
              </span>
            </template>
            <template #icon>
              <Icon name="mdi:chevron-down" class="icon" :aria-hidden="true" />
            </template>
            <template #content>
              <div class="overflow-navigation-sub-nav-inner">
                <ul class="overflow-navigation-sub-nav-list">
                  <li
                    v-for="childLink in link.childLinks"
                    :key="childLink.name"
                    class="overflow-navigation-sub-nav-item"
                  >
                    <NuxtLink :to="childLink.path" class="overflow-navigation-sub-nav-link" role="menuitem">
                      <span class="overflow-navigation-sub-nav-text">{{ childLink.name }}</span>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </template>
          </ExpandingPanel>
        </li>
      </template>
    </ul>
    <div aria-hidden="true" class="overflow-nav-indicator-hovered"></div>
    <div aria-hidden="true" class="overflow-nav-indicator-active"></div>
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveHeaderState, ResponsiveHeaderNavItem } from "../../types/components";

interface Props {
  mainNavigationState?: ResponsiveHeaderState;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  mainNavigationState: () => ({ clonedNavLinks: {}, navListVisibility: {}, hasSecondNav: false }),
  styleClassPassthrough: () => [],
});

const hoveredItemKey = ref<string | null>(null);

const route = useRoute();

const isActiveNavItem = (link: ResponsiveHeaderNavItem): boolean => {
  if (link.path) return route.path === link.path;
  if (link.childLinks) return link.childLinks.some((child) => child.path && route.path === child.path);
  return false;
};

// Performance: Use const assertion for static values
const DETAILS_ANIMATION_DURATION = 200 as const;
// const DETAILS_ANIMATION_DURATION_STRING = `${DETAILS_ANIMATION_DURATION}ms` as const;

// Performance: Memoize expensive computed with proper dependencies
const widestNavLinkWidthInMainNavigationState = computed(() => {
  const clonedNavLinks = props.mainNavigationState?.clonedNavLinks;
  if (!clonedNavLinks || Object.keys(clonedNavLinks).length === 0) {
    return 0;
  }

  return Object.values(clonedNavLinks).reduce((maxWidth, group) => {
    if (!Array.isArray(group)) return maxWidth;
    return Math.max(maxWidth, ...group.map((link) => link.config?.width || 0));
  }, 0);
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

// Performance: Use immediate flag and more efficient watching
watch(
  () => props.styleClassPassthrough,
  (newValue) => {
    resetElementClasses(newValue);
  },
  { immediate: false, flush: "post" }
);
</script>

<style lang="css">
@layer components {
.overflow-navigation-wrapper {
  --overflow-nav-padding-inline: 0.8rem;
  --overflow-nav-items-gap: 0px;
  --overflow-nav-items-padding-block: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: var(--overflow-nav-items-gap);
  position: relative;

  .overflow-navigation-list {
    display: none;

    &.visible {
      display: flex;
      flex-direction: column;
      gap: var(--overflow-nav-items-gap);
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
        padding-block: var(--overflow-nav-items-padding-block);
        padding-inline: var(--overflow-nav-padding-inline);
        display: flex;
        /* background-color: red; */
        border-bottom: 0.1rem solid #efefef75;
      }

      .overflow-navigation-details {
        &.expanding-panel {
          margin-block-end: 0;

          .expanding-panel-details {
            .expanding-panel-summary {
              padding-block: var(--overflow-nav-items-padding-block);
              padding-inline: var(--overflow-nav-padding-inline);
              gap: 1rem;
              /* background-color: red; */
              border-bottom: 0.1rem solid #efefef75;

              .label-wrapper {
                .overflow-navigation-text {
                  text-wrap: nowrap;
                }
              }
              .icon-wrapper {
                padding: 0;
              }
            }

            &[open] {
              .expanding-panel-summary {
                border-bottom: 0.1rem solid transparent;
              }
              + .expanding-panel-content {
                border-bottom: 0.1rem solid #efefef75;
                .inner {
                  .overflow-navigation-sub-nav-inner {
                    margin-top: var(--overflow-nav-items-gap);
                  }
                }
              }
            }
          }

          .expanding-panel-content {
            border-bottom: 0.1rem solid transparent;

            .inner {
              margin-top: 0;

              .overflow-navigation-sub-nav-inner {
                margin-top: 0;

                .overflow-navigation-sub-nav-list {
                  display: flex;
                  flex-direction: column;
                  gap: 2px;

                  .overflow-navigation-sub-nav-item {
                    padding-block: var(--overflow-nav-items-padding-block);
                    padding-inline: var(--overflow-nav-padding-inline);

                    .overflow-navigation-sub-nav-link {
                      display: block;
                      text-decoration: none;
                      color: inherit;
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
}

  /* ─── Anchor positioning for overflow-nav indicators ─────────────────────
     Single --overflow-nav-indicator: sits on is-hovered, falls back to
     is-active. Vertical list so indicators slide up/down rather than left/right.
  ──────────────────────────────────────────────────────────────────────── */

  .overflow-navigation-wrapper .overflow-navigation-item.is-hovered {
    anchor-name: --overflow-nav-indicator;
  }

  .overflow-navigation-wrapper:not(:has(.overflow-navigation-item.is-hovered)) .overflow-navigation-item.is-active {
    anchor-name: --overflow-nav-indicator;
  }

  .overflow-navigation-wrapper .overflow-nav-indicator-hovered,
  .overflow-navigation-wrapper .overflow-nav-indicator-active {
    display: none;
    pointer-events: none;
  }

  .overflow-navigation-wrapper .overflow-nav-indicator-hovered {
    display: block;
    position: absolute;
    position-anchor: --overflow-nav-indicator;
    left: 0;
    right: 0;
    top: anchor(top);
    bottom: anchor(bottom);
    background: var(--overflow-nav-decorator-hovered-bg, oklch(100% 0 0 / 6%));
    z-index: 1;
    opacity: 0;
    transition:
      top 200ms ease,
      bottom 200ms ease,
      opacity 150ms ease;
  }

  .overflow-navigation-wrapper:has(.overflow-navigation-item.is-hovered) .overflow-nav-indicator-hovered {
    opacity: 1;
  }

  .overflow-navigation-wrapper .overflow-nav-indicator-active {
    display: block;
    position: absolute;
    position-anchor: --overflow-nav-indicator;
    left: 0;
    width: 2px;
    top: anchor(top);
    bottom: anchor(bottom);
    background: var(--overflow-nav-decorator-indicator-color, currentColor);
    z-index: 3;
    transition:
      top 200ms ease,
      bottom 200ms ease;
  }
}
</style>
