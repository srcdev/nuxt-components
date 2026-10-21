<template>
  <component
    :is="tag"
    ref="rootRef"
    class="deep-expanding-menu-classic"
    :class="[elementClasses]"
    :aria-label="ariaLabel"
    @click="closeOtherGroups"
    @keydown.esc="closeOnEscape"
  >
    <div class="deep-expanding-menu-classic-inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="deep-expanding-menu-classic-link">{{ link.name }}</NuxtLink>
        <details v-else class="deep-expanding-menu-classic-group" :name="groupName">
          <summary class="deep-expanding-menu-classic-group-toggle">
            <span class="deep-expanding-menu-classic-group-label">{{ link.name }}</span>
            <Icon name="bi:caret-down-fill" class="deep-expanding-menu-classic-group-icon" aria-hidden="true" />
          </summary>
          <div class="deep-expanding-menu-classic-group-panel">
            <h4 v-if="link.childLinksTitle" class="deep-expanding-menu-classic-group-heading page-heading-4 mb-6">
              {{ link.childLinksTitle }}
            </h4>
            <ul v-if="link.childLinks?.length" class="deep-expanding-menu-classic-group-list" role="list">
              <li
                v-for="(childLink, childIndex) in link.childLinks"
                :key="`${childIndex}-${childLink.name}`"
                class="deep-expanding-menu-classic-group-item"
              >
                <NuxtLink :to="childLink.path" class="deep-expanding-menu-classic-group-link">
                  {{ childLink.name }}
                </NuxtLink>
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
  tag?: "div" | "section" | "nav";
  navLinks?: ResponsiveHeaderNavItem[];
  ariaLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "nav",
  navLinks: () => [],
  ariaLabel: undefined,
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

// Per-instance so groups are exclusive within one menu but not across menus.
const groupName = `deep-expanding-menu-classic-${useId()}`;

const rootRef = ref<HTMLElement | null>(null);

const openGroups = () =>
  Array.from(rootRef.value?.querySelectorAll<HTMLDetailsElement>("details[open]") ?? []);

const closeOtherGroups = (event: Event) => {
  const target = event.target as Element | null;
  const followedLink = !!target?.closest?.("a");
  openGroups().forEach((group) => {
    if (followedLink || !target || !group.contains(target)) group.open = false;
  });
};

const closeOnEscape = (event: KeyboardEvent) => {
  const target = event.target as Node | null;
  const group = openGroups().find((details) => target && details.contains(target));
  if (!group) return;
  group.open = false;
  group.querySelector<HTMLElement>("summary")?.focus();
};

onClickOutside(rootRef, () => {
  openGroups().forEach((group) => (group.open = false));
});

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  @layer popover-setup {
    .deep-expanding-menu-classic {
      container: deep-expanding-menu-classic / inline-size;
      display: grid;
      grid-template-areas: "element-stack";
      align-items: center;

      .deep-expanding-menu-classic-inner {
        grid-area: element-stack;
        display: flex;
        flex-wrap: wrap;
        gap: var(--deep-expanding-menu-classic-item-gap, 2.4rem);
        align-items: center;
        min-inline-size: 0;
        z-index: 1;

        .deep-expanding-menu-classic-link,
        .deep-expanding-menu-classic-group-toggle {
          all: unset;
          min-inline-size: 0;
          overflow-wrap: anywhere;
          border-bottom: var(--deep-expanding-menu-classic-link-border-width, 0.2rem) solid transparent;
          padding-block: var(--deep-expanding-menu-classic-link-padding-block, 0.8rem);

          transition: border-color 200ms;

          &:hover,
          &:focus,
          &:focus-visible {
            cursor: pointer;
            border-color: var(--deep-expanding-menu-classic-link-border-colour-hover, var(--theme-border));
          }

          &:focus-visible {
            outline: var(--deep-expanding-menu-classic-focus-outline-width, 0.2rem) solid
              var(--deep-expanding-menu-classic-focus-outline-colour, var(--theme-ring, currentcolor));
            outline-offset: 0.2rem;
          }
        }

        .deep-expanding-menu-classic-group {
          --_icon-transform: scaleY(1);

          display: grid;
          grid-template-areas: "details-stack";
          min-inline-size: 0;
          z-index: 1;
          position: relative;

          summary::-webkit-details-marker,
          summary::marker {
            display: none;
          }

          &[open] {
            --_icon-transform: scaleY(-1);
          }

          .deep-expanding-menu-classic-group-toggle {
            grid-area: details-stack;

            display: flex;
            align-items: center;
            gap: 1.2rem;
            list-style: none;

            .deep-expanding-menu-classic-group-label {
              min-inline-size: 0;
            }

            .deep-expanding-menu-classic-group-icon {
              display: block;
              flex-shrink: 0;
              font-size: var(--deep-expanding-menu-classic-icon-size, 1.2rem);

              transform: var(--_icon-transform);
              transition: transform 200ms;
            }
          }

          .deep-expanding-menu-classic-group-panel {
            display: grid;
            grid-area: details-stack;
            z-index: 2;
            position: absolute;
            inset: auto;
            top: var(--deep-expanding-menu-classic-panel-offset-top, calc(100% + 1rem));
            left: 0;
            gap: var(--deep-expanding-menu-classic-panel-list-gap, 1.2rem);

            width: min(var(--deep-expanding-menu-classic-panel-width, 20rem), 100cqi);

            @container deep-expanding-menu-classic (min-width: 768px) {
              width: min(var(--deep-expanding-menu-classic-panel-width-tablet, 40rem), 100cqi);
            }

            @container deep-expanding-menu-classic (min-width: 1024px) {
              width: min(var(--deep-expanding-menu-classic-panel-width-desktop, 60rem), 100cqi);
            }

            color: var(--deep-expanding-menu-classic-panel-text-colour, var(--theme-text));
            background-color: var(--deep-expanding-menu-classic-panel-background-colour, var(--theme-surface-subtle));
            border: var(--deep-expanding-menu-classic-panel-border-width, 0.1rem) solid
              var(--deep-expanding-menu-classic-panel-border-colour, var(--theme-border));
            border-radius: var(--deep-expanding-menu-classic-panel-border-radius, 1.2rem);
            box-shadow: var(--deep-expanding-menu-classic-panel-shadow, 0 0 1rem rgba(0, 0, 0, 0.1));
            padding: var(--deep-expanding-menu-classic-panel-padding, 1.2rem);
            overflow: clip;

            .deep-expanding-menu-classic-group-heading {
              color: var(--deep-expanding-menu-classic-panel-heading-colour, var(--theme-text));
              overflow-wrap: anywhere;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              -webkit-line-clamp: var(--deep-expanding-menu-classic-panel-heading-line-clamp, none);
              line-clamp: var(--deep-expanding-menu-classic-panel-heading-line-clamp, none);
            }

            .deep-expanding-menu-classic-group-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
              gap: var(--deep-expanding-menu-classic-panel-list-gap, 1.2rem);
              list-style: none;
              padding-inline-start: 0;
              margin-block: 0 0.8rem;

              .deep-expanding-menu-classic-group-item {
                display: block;
                min-inline-size: 0;

                a.deep-expanding-menu-classic-group-link {
                  display: inline-block;
                  max-inline-size: 100%;
                  overflow-wrap: anywhere;
                  color: var(--deep-expanding-menu-classic-group-link-colour, var(--theme-text));
                  text-decoration: none;
                  padding-block: 0.8rem;

                  border-bottom: var(--deep-expanding-menu-classic-link-border-width, 0.2rem) solid transparent;

                  transition: border-color 200ms;

                  &:hover,
                  &:focus-visible {
                    cursor: pointer;
                    border-color: var(--deep-expanding-menu-classic-group-link-border-colour-hover, var(--theme-text));
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
