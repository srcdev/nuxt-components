<template>
  <component :is="tag" ref="rootRef" class="deep-expanding-menu" :class="[elementClasses]" :aria-label="ariaLabel">
    <div class="deep-expanding-menu-inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="deep-expanding-menu-link">{{ link.name }}</NuxtLink>

        <div v-else class="deep-expanding-menu-group" :style="`--_anchor-name: --anchor-${uid}-${key};`">
          <button
            :ref="(el) => setElement(triggerEls, key, el)"
            type="button"
            :popovertarget="`popovertarget-${uid}-${key}`"
            class="deep-expanding-menu-group-toggle"
            :aria-expanded="isOpen && activeKey === key"
            @click="handleGroupClick(key)"
          >
            <span class="deep-expanding-menu-group-label">{{ link.name }}</span>
            <Icon name="bi:caret-down-fill" class="deep-expanding-menu-group-icon" aria-hidden="true" />
          </button>

          <div
            :id="`popovertarget-${uid}-${key}`"
            :ref="(el) => setElement(panelEls, key, el)"
            class="deep-expanding-menu-group-panel"
            :class="{ 'deep-expanding-menu-panel-open': usesFallbackPopover && isOpen && activeKey === key }"
            :style="activeKey === key ? positionStyle : undefined"
            :data-placement="activeKey === key ? popoverPlacement : undefined"
            popover
            @beforetoggle="handlePanelBeforeToggle(key, $event)"
            @toggle="handlePanelToggle(key, $event)"
          >
            <h4 v-if="link.childLinksTitle" class="deep-expanding-menu-group-heading page-heading-4 mb-6">
              {{ link.childLinksTitle }}
            </h4>
            <ul v-if="link.childLinks?.length" class="deep-expanding-menu-group-list" role="list">
              <li
                v-for="(childLink, childIndex) in link.childLinks"
                :key="`${childIndex}-${childLink.name}`"
                class="deep-expanding-menu-group-item"
              >
                <NuxtLink :to="childLink.path" class="deep-expanding-menu-group-link">{{ childLink.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </component>
</template>


<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
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

// Scopes anchor-name/popovertarget ids so multiple instances on one page don't collide.
const uid = useId();

// One panel is open at a time, so a single popover controller follows the active group.
const rootRef = ref<HTMLElement | null>(null);
const activeKey = ref<number | null>(null);
const triggerEls = new Map<number, HTMLElement>();
const panelEls = new Map<number, HTMLElement>();

const setElement = (map: Map<number, HTMLElement>, key: number, el: Element | ComponentPublicInstance | null) => {
  if (el instanceof HTMLElement) map.set(key, el);
  else map.delete(key);
};

const triggerRef = computed(() => (activeKey.value === null ? null : (triggerEls.get(activeKey.value) ?? null)));
const popoverRef = computed(() => (activeKey.value === null ? null : (panelEls.get(activeKey.value) ?? null)));

const {
  isOpen,
  usesFallbackPopover,
  positionStyle,
  popoverPlacement,
  show,
  hide,
  handleBeforeToggle,
  handleToggle,
} = useAnchoredPopover({ rootRef, triggerRef, popoverRef });

const handleGroupClick = (key: number) => {
  if (!usesFallbackPopover.value) return;
  const wasActive = isOpen.value && activeKey.value === key;
  hide();
  if (wasActive) return;
  activeKey.value = key;
  show();
};

const handlePanelBeforeToggle = (key: number, event: Event) => {
  if ((event as ToggleEvent).newState !== "open") return;
  activeKey.value = key;
  handleBeforeToggle(event);
};

// Opening one auto popover closes the other, and those toggle events can arrive in either order.
const handlePanelToggle = (key: number, event: Event) => {
  const opening = (event as ToggleEvent).newState === "open";
  if (opening) activeKey.value = key;
  else if (activeKey.value !== key) return;
  handleToggle(event);
};

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
    .deep-expanding-menu {
      container-type: inline-size;
      display: grid;
      grid-template-areas: "element-stack";

      .deep-expanding-menu-inner {
        grid-area: element-stack;
        display: flex;
        flex-wrap: wrap;
        gap: var(--deep-expanding-menu-gap, 2.4rem);
        align-items: center;
        min-inline-size: 0;

        .deep-expanding-menu-link,
        .deep-expanding-menu-group-toggle {
          all: unset;
          min-inline-size: 0;
          overflow-wrap: anywhere;
          border-bottom: var(--deep-expanding-menu-link-border-width, 0.2rem) solid transparent;
          padding-block: var(--deep-expanding-menu-link-padding-block, 0.8rem);

          transition: border-color 200ms;

          &:hover,
          &:focus,
          &:focus-visible {
            cursor: pointer;
            border-color: var(--deep-expanding-menu-link-border-colour-hover, var(--theme-border));
          }

          &:focus-visible {
            outline: var(--deep-expanding-menu-focus-outline-width, 0.2rem) solid
              var(--deep-expanding-menu-focus-outline-colour, var(--theme-ring, currentcolor));
            outline-offset: 0.2rem;
          }
        }

        .deep-expanding-menu-group {
          --_icon-transform: scaleY(1);
          position: relative;
          min-inline-size: 0;

          .deep-expanding-menu-group-toggle {
            anchor-name: var(--_anchor-name);

            display: flex;
            align-items: center;
            gap: 1.2rem;

            .deep-expanding-menu-group-label {
              min-inline-size: 0;
            }

            .deep-expanding-menu-group-icon {
              display: block;
              flex-shrink: 0;
              font-size: var(--deep-expanding-menu-icon-size, 1.2rem);

              transform: var(--_icon-transform);
              transition: transform 200ms;
            }
          }

          .deep-expanding-menu-group-panel {
            display: none;
            position: absolute;
            position-anchor: var(--_anchor-name);
            position-try-fallbacks: flip-inline;
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
            max-block-size: var(--deep-expanding-menu-panel-max-height, 70dvh);

            color: var(--deep-expanding-menu-panel-text-colour, var(--theme-text));
            background-color: var(--deep-expanding-menu-panel-background-colour, var(--theme-surface-subtle));
            border: var(--deep-expanding-menu-panel-border-width, 0.1rem) solid
              var(--deep-expanding-menu-panel-border-colour, var(--theme-border));
            border-radius: var(--deep-expanding-menu-panel-border-radius, 1.2rem);
            box-shadow: var(--deep-expanding-menu-panel-shadow, 0 0 1rem rgba(0, 0, 0, 0.1));
            padding: var(--deep-expanding-menu-panel-padding, 1.2rem);
            overflow-x: clip;
            overflow-y: auto;

            &:popover-open {
              display: block;
              opacity: 1;

              @starting-style {
                display: block;
                opacity: 0;
              }
            }

            /* Kept apart from :popover-open, which would invalidate a shared selector list where unsupported. */
            &.deep-expanding-menu-panel-open {
              display: block;
              opacity: 1;
            }

            @supports not (anchor-name: --a) {
              position: fixed;
              top: calc(var(--_anchor-bottom, 0px) + 1rem);
              left: var(--_anchor-left, 0px);
              z-index: var(--deep-expanding-menu-panel-z-index, 999999);

              &[data-placement="top"] {
                top: auto;
                bottom: calc(var(--_anchor-top-inverse, 0px) + 1rem);
              }
            }

            .deep-expanding-menu-group-heading {
              color: var(--deep-expanding-menu-panel-heading-colour, var(--theme-text));
              overflow-wrap: anywhere;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              -webkit-line-clamp: var(--deep-expanding-menu-panel-heading-line-clamp, none);
              line-clamp: var(--deep-expanding-menu-panel-heading-line-clamp, none);
            }

            .deep-expanding-menu-group-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
              gap: var(--deep-expanding-menu-panel-list-gap, 1.2rem);
              list-style: none;
              padding-inline-start: 0;
              margin-block: 0 0.8rem;

              .deep-expanding-menu-group-item {
                display: block;
                min-inline-size: 0;

                a.deep-expanding-menu-group-link {
                  display: inline-block;
                  max-inline-size: 100%;
                  overflow-wrap: anywhere;
                  color: var(--deep-expanding-menu-group-link-colour, var(--theme-text));
                  text-decoration: none;
                  padding-block: 0.8rem;

                  border-bottom: var(--deep-expanding-menu-link-border-width, 0.2rem) solid transparent;

                  transition: border-color 200ms;

                  &:hover,
                  &:focus-visible {
                    cursor: pointer;
                    border-color: var(--deep-expanding-menu-group-link-border-colour-hover, var(--theme-text));
                  }
                }
              }
            }
          }

          &:has(> .deep-expanding-menu-group-toggle[aria-expanded="true"]) {
            --_icon-transform: scaleY(-1);
          }
        }
      }
    }
  }
}
</style>

