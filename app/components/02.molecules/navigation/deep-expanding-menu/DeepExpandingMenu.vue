<template>
  <component :is="tag" class="deep-expanding-menu" :class="[elementClasses]">
    <div class="inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="navigation-link">{{ link.name }}</NuxtLink>

        <div v-else class="navigation-group" :style="`--_anchor-name: --anchor-${uid}-${key};`">
          <button :popovertarget="`popovertarget-${uid}-${key}`" class="navigation-group-toggle">
            <span>{{ link.name }}</span>
            <Icon name="bi:caret-down-fill" class="icon" />
          </button>

          <div :id="`popovertarget-${uid}-${key}`" class="navigation-group-panel" popover role="menu">
            <h4 class="page-heading-4 mb-6">{{ link.childLinksTitle }}</h4>
            <ul class="navigation-group-list">
              <li v-for="childLink in link.childLinks" :key="childLink.name" class="navigation-group-item">
                <NuxtLink :to="childLink.path" class="navigation-group-link">{{ childLink.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { ResponsiveHeaderNavItem } from "~/types/components";

interface Props {
  tag?: "div" | "section" | "nav" | "ul" | "ol";
  navLinks?: ResponsiveHeaderNavItem[];
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "nav",
  navLinks: () => [],
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

// Scopes anchor-name/popovertarget ids so multiple instances on one page don't collide.
const uid = useId();

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  @layer deep-expanding-menu-setup {
    @position-try --anchor-left {
      inset: auto;
      top: calc(anchor(bottom) + 1rem);
      left: calc(anchor(left) + 1rem);
    }

    @position-try-fallbacks --anchor-right {
      inset: auto;
      top: calc(anchor(bottom) + 1rem);
      right: calc(anchor(right) + 1rem);
    }

    .deep-expanding-menu {
      container-type: inline-size;
      display: grid;
      grid-template-areas: "element-stack";

      .inner {
        grid-area: element-stack;
        display: flex;
        gap: var(--deep-expanding-menu-gap, 2.4rem);
        align-items: center;

        .navigation-link,
        .navigation-group-toggle {
          all: unset;
          border-bottom: var(--deep-expanding-menu-link-border-width, 0.2rem) solid transparent;
          padding-block: var(--deep-expanding-menu-link-padding-block, 0.8rem);

          transition: border-color 200ms;

          &:hover,
          &:focus,
          &:focus-visible {
            cursor: pointer;
            border-color: var(
              --deep-expanding-menu-link-border-colour-hover,
              light-dark(var(--blue-10), var(--slate-00))
            );
          }
        }

        .navigation-group {
          --_icon-transform: scaleY(1);
          position: relative;

          .navigation-group-toggle {
            anchor-name: var(--_anchor-name);

            display: flex;
            align-items: center;
            gap: 1.2rem;

            .icon {
              display: block;
              font-size: var(--deep-expanding-menu-icon-size, 1.2rem);

              transform: var(--_icon-transform);
              transition: transform 200ms;
            }
          }

          .navigation-group-panel {
            display: none;
            position: absolute;
            position-anchor: var(--_anchor-name);
            margin: 0;
            top: calc(anchor(bottom) + 1rem);
            left: calc(anchor(left) + 0rem);

            opacity: 0;
            transition:
              opacity 200ms,
              display 200ms,
              overlay 200ms;
            transition-behavior: allow-discrete;

            width: var(--deep-expanding-menu-panel-width, min(100%, 50vw));

            background-color: var(--deep-expanding-menu-panel-background-colour, white);
            border: var(--deep-expanding-menu-panel-border-width, 0.1rem) solid
              var(--deep-expanding-menu-panel-border-colour, black);
            border-radius: var(--deep-expanding-menu-panel-border-radius, 1.2rem);
            box-shadow: var(--deep-expanding-menu-panel-shadow, 0 0 1rem rgba(0, 0, 0, 0.1));
            padding: var(--deep-expanding-menu-panel-padding, 1.2rem);
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
              color: var(--deep-expanding-menu-panel-heading-colour, var(--slate-10));
            }

            .navigation-group-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
              gap: var(--deep-expanding-menu-panel-list-gap, 1.2rem);
              padding-inline-start: 0;
              margin-block-end: 0.8rem;

              .navigation-group-item {
                display: block;

                a.navigation-group-link {
                  display: inline-block;
                  color: var(--deep-expanding-menu-group-link-colour, var(--slate-10));
                  text-decoration: none;
                  padding-block: 0.8rem;

                  border-bottom: var(--deep-expanding-menu-link-border-width, 0.2rem) solid transparent;

                  transition: border-color 200ms;

                  &:hover,
                  &:focus-visible {
                    cursor: pointer;
                    border-color: var(--deep-expanding-menu-group-link-border-colour-hover, var(--slate-10));
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
}
</style>
