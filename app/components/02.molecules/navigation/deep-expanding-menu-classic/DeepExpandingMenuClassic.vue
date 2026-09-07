<template>
  <component :is="tag" class="deep-expanding-menu-classic" :class="[elementClasses]">
    <div class="inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="navigation-link">{{ link.name }}</NuxtLink>
        <details v-else ref="navigationGroupRef" class="navigation-group" name="navigation-group">
          <summary class="navigation-group-toggle">
            <span>{{ link.name }}</span>
            <Icon name="bi:caret-down-fill" class="icon" />
          </summary>
          <div class="navigation-group-panel">
            <h4 class="page-heading-4 mb-6">{{ link.childLinksTitle }}</h4>
            <ul class="navigation-group-list">
              <li v-for="childLink in link.childLinks" :key="childLink.name" class="navigation-group-item">
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
import { onClickOutside } from "@vueuse/core";
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

const navigationGroupRef = useTemplateRef<HTMLElement[]>("navigationGroupRef");

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

onMounted(() => {
  navigationGroupRef.value?.forEach((element, index) => {
    onClickOutside(element, () => {
      navigationGroupRef.value?.[index]?.removeAttribute("open");
    });
  });
});
</script>

<style lang="css">
@layer components {
  @layer popover-setup {
    .deep-expanding-menu-classic {
      container-type: inline-size;
      display: grid;
      grid-template-areas: "element-stack";
      align-items: center;
      gap: var(--deep-expanding-menu-classic-gap, 1.2rem);

      .inner {
        grid-area: element-stack;
        display: flex;
        gap: var(--deep-expanding-menu-classic-item-gap, 2.4rem);
        align-items: center;
        z-index: 1;

        .navigation-link,
        .navigation-group-toggle {
          all: unset;
          border-bottom: var(--deep-expanding-menu-classic-link-border-width, 0.2rem) solid transparent;
          padding-block: var(--deep-expanding-menu-classic-link-padding-block, 0.8rem);

          transition: border-color 200ms;

          &:hover,
          &:focus,
          &:focus-visible {
            cursor: pointer;
            border-color: var(
              --deep-expanding-menu-classic-link-border-colour-hover,
              light-dark(var(--blue-10), var(--slate-00))
            );
          }
        }

        .navigation-group {
          --_icon-transform: scaleY(1);

          display: grid;
          grid-template-areas: "details-stack";
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
            gap: 1.2rem;
            list-style: none;

            .icon {
              display: block;
              font-size: var(--deep-expanding-menu-classic-icon-size, 1.2rem);

              transform: var(--_icon-transform);
              transition: transform 200ms;
            }
          }

          .navigation-group-panel {
            display: grid;
            grid-area: details-stack;
            z-index: 2;
            position: absolute;
            inset: auto;
            top: var(--deep-expanding-menu-classic-panel-offset-top, 4rem);
            left: 0rem;
            gap: var(--deep-expanding-menu-classic-panel-list-gap, 1.2rem);

            width: var(--deep-expanding-menu-classic-panel-width, 20rem);

            @media screen and (min-width: 768px) {
              width: var(--deep-expanding-menu-classic-panel-width-tablet, 40rem);
            }

            @media screen and (min-width: 1024px) {
              width: var(--deep-expanding-menu-classic-panel-width-desktop, 60rem);
            }

            background-color: var(--deep-expanding-menu-classic-panel-background-colour, white);
            border: var(--deep-expanding-menu-classic-panel-border-width, 0.1rem) solid
              var(--deep-expanding-menu-classic-panel-border-colour, black);
            border-radius: var(--deep-expanding-menu-classic-panel-border-radius, 1.2rem);
            box-shadow: var(--deep-expanding-menu-classic-panel-shadow, 0 0 1rem rgba(0, 0, 0, 0.1));
            padding: var(--deep-expanding-menu-classic-panel-padding, 1.2rem);
            overflow: clip;

            h4 {
              color: var(--deep-expanding-menu-classic-panel-heading-colour, var(--slate-10));
            }

            .navigation-group-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
              gap: var(--deep-expanding-menu-classic-panel-list-gap, 1.2rem);
              padding-inline-start: 0;
              margin-block-end: 0.8rem;

              .navigation-group-item {
                display: block;

                a.navigation-group-link {
                  display: inline-block;
                  color: var(--deep-expanding-menu-classic-group-link-colour, var(--slate-10));
                  text-decoration: none;
                  padding-block: 0.8rem;

                  border-bottom: var(--deep-expanding-menu-classic-link-border-width, 0.2rem) solid transparent;

                  transition: border-color 200ms;

                  &:hover,
                  &:focus-visible {
                    cursor: pointer;
                    border-color: var(
                      --deep-expanding-menu-classic-group-link-border-colour-hover,
                      var(--slate-10)
                    );
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
