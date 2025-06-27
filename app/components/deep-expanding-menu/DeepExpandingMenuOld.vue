<template>
  <component :is="tag" class="deep-expanding-menu-old" :class="[elementClasses]">
    <div class="inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="navigation-link">{{ link.name }}</NuxtLink>
        <details v-else class="navigation-group" name="navigation-group" ref="navigationGroupRef">
          <summary class="navigation-group-toggle">
            <span>{{ link.name }}</span>
            <Icon name="bi:caret-down-fill" class="icon" />
          </summary>
          <div class="navigation-group-panel" :id="`popovertarget-nav-1-${key}`">
            <h4 class="heading-4 mb-6">{{ link.childLinksTitle }}</h4>
            <ul class="navigation-group-list">
              <li class="navigation-group-item" v-for="childLink in link.childLinks" :key="childLink.name">
                <NuxtLink :to="childLink.path" class="navigation-group-link">{{ childLink.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </details>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  tag: {
    type: String,
    default: 'nav',
    validator(value: string) {
      return TAGS_ALLOWED.includes(value);
    },
  },
  navLinks: {
    type: Array as PropType<ResponsiveHeaderNavItem[]>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const navigationGroupRef = useTemplateRef<HTMLElement[]>('navigationGroupRef');

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

onMounted(() => {
  navigationGroupRef.value?.forEach((element, index) => {
    onClickOutside(element, () => {
      navigationGroupRef.value?.[index]?.removeAttribute('open');
    });
  });
});
</script>

<script lang="ts">
const TAGS_ALLOWED = <string[]>['div', 'section', 'nav', 'ul', 'ol'];

interface ResponsiveHeaderNavItem {
  name: string;
  path?: string;
  isExternal?: boolean;
  childLinksTitle?: string;
  childLinks?: ResponsiveHeaderNavItem[];
}
</script>

<style lang="css">
@layer popover-setup {
  .deep-expanding-menu-old {
    container-type: inline-size;
    display: grid;
    grid-template-areas: 'element-stack';
    align-items: center;
    gap: 12px;

    .inner {
      grid-area: element-stack;
      display: flex;
      gap: 24px;
      align-items: center;
      z-index: 1;

      .navigation-link,
      .navigation-group-toggle {
        all: unset;
        border-bottom: 2px solid transparent;
        padding-block: 8px;

        transition: border-color 200ms;

        &:hover {
          cursor: pointer;
          border-color: light-dark(var(--blue-12), var(--gray-0));
        }

        &:focus {
          border-color: light-dark(var(--blue-12), var(--gray-0));
        }

        &:focus-visible {
          border-color: light-dark(var(--blue-12), var(--gray-0));
        }
      }

      .navigation-group {
        --_icon-transform: scaleY(1);

        display: grid;
        grid-template-areas: 'details-stack';
        z-index: 1;
        position: relative;

        summary::-webkit-details-marker,
        summary::marker {
          display: none;
        }

        &[open] {
          --_icon-transform: scaleY(-1);
        }

        .navigation-group-toggle {
          grid-area: details-stack;

          display: flex !important;
          align-items: center;
          gap: 12px;
          list-style: none;

          .icon {
            display: block;
            font-size: 1.2rem;

            transform: var(--_icon-transform);
            transition: transform 200ms;
          }
        }

        .navigation-group-panel {
          background-color: black;
          display: grid;
          grid-area: details-stack;
          z-index: 2;
          position: absolute;
          inset: auto;
          top: 40px;
          left: 0px;
          gap: 12px;

          width: 200px;

          @media screen and (min-width: 768px) {
            width: 400px;
          }

          @media screen and (min-width: 1024px) {
            width: 600px;
          }

          background-color: white;
          border: 1px solid black;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 12px;
          overflow: clip;

          h4 {
            color: var(--gray-12);
          }

          .navigation-group-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            padding-inline-start: 0;
            margin-block-end: 8px;

            .navigation-group-item {
              display: block;

              a.navigation-group-link {
                display: inline-block;
                color: var(--gray-12);
                text-decoration: none;
                padding-block: 8px;

                border-bottom: 2px solid transparent;

                transition: border-color 200ms;

                &:hover {
                  cursor: pointer;
                  border-color: var(--gray-12);
                }

                &:focus-visible {
                  border-color: var(--gray-12);
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
