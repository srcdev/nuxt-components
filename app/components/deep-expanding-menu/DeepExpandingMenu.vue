<template>
  <component :is="tag" class="deep-expanding-menu" :class="[elementClasses]">
    <div class="inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="navigation-link">{{ link.name }}</NuxtLink>

        <div v-else class="navigation-group" :style="`--_anchor-name: --anchor-nav-1-${key};`" ref="detailsRef">
          <button :popovertarget="`popovertarget-nav-1-${key}`" class="navigation-group-toggle">
            <span>{{ link.name }}</span>
            <Icon name="bi:caret-down-fill" class="icon" />
          </button>

          <div class="navigation-group-panel" popover role="menu" :id="`popovertarget-nav-1-${key}`">
            <h4 class="page-heading-4 mb-6">{{ link.childLinksTitle }}</h4>
            <ul class="navigation-group-list">
              <li class="navigation-group-item" v-for="childLink in link.childLinks" :key="childLink.name">
                <NuxtLink :to="childLink.path" class="navigation-group-link">{{ childLink.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </component>
</template>

<script lang="ts">
interface ResponsiveHeaderNavItem {
  name: string
  path?: string
  isExternal?: boolean
  childLinks?: ResponsiveHeaderNavItem[]
  childLinksTitle?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: "nav",
    validator(value: string) {
      return ["div", "section", "nav", "ul", "ol"].includes(value)
    },
  },
  navLinks: {
    type: Array as PropType<ResponsiveHeaderNavItem[]>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
// const detailsRef = useTemplateRef('detailsRef');

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
@layer deep-expanding-menu-setup {
  @position-try --anchor-left {
    inset: auto;
    top: calc(anchor(bottom) + 10px);
    left: calc(anchor(left) + 10px);
  }

  @position-try-fallbacks --anchor-right {
    inset: auto;
    top: calc(anchor(bottom) + 10px);
    right: calc(anchor(right) + 10px);
  }

  .deep-expanding-menu {
    --_gap-between-top-level-items: 24px;

    container-type: inline-size;
    display: grid;
    grid-template-areas: "element-stack";

    .inner {
      grid-area: element-stack;
      display: flex;
      gap: var(--_gap-between-top-level-items);
      align-items: center;

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
        position: relative;

        .navigation-group-toggle {
          anchor-name: var(--_anchor-name);

          display: flex;
          align-items: center;
          gap: 12px;

          .icon {
            display: block;
            font-size: 1.2rem;

            transform: var(--_icon-transform);
            transition: transform 200ms;
          }
        }

        .navigation-group-panel {
          display: none;
          position: absolute;
          position-anchor: var(--_anchor-name);
          margin: 0;
          /* inset: auto; */
          top: calc(anchor(bottom) + 10px);
          left: calc(anchor(left) + 0px);

          opacity: 0;
          transition: opacity 200ms, display 200ms, overlay 200ms;
          transition-behavior: allow-discrete;

          width: min(100%, 50vw);

          background-color: white;
          border: 1px solid black;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 12px;
          overflow: clip;

          &:popover-open {
            display: block;
            opacity: 1;

            @starting-style {
              display: block;
              opacity: 0;
            }
          }

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

        &:has(.navigation-group-panel:popover-open) {
          --_icon-transform: scaleY(-1);
        }
      }
    }
  }
}
</style>
