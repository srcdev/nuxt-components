<template>
  <div
    class="tabbed-content"
    :class="[`axis-${axis}`, `overflow-${overflowMode}`, { 'tracks-active': trackActive }, elementClasses]"
  >
    <div ref="tabsNavRef" class="tabbed-content-bar" @mouseleave="resetHoverToActivePosition()">
      <div
        ref="tablistRef"
        role="tablist"
        :aria-label="ariaLabel"
        :aria-orientation="axis === 'y' ? 'vertical' : 'horizontal'"
        class="tabbed-content-list"
      >
        <button
          v-for="index in tabIndexes"
          :id="triggerId(index)"
          :key="index"
          :data-tab-index="index"
          data-nav-item
          type="button"
          role="tab"
          aria-selected="false"
          :aria-controls="panelId(index)"
          :hidden="overflowedIndexes.includes(index)"
          class="tabbed-content-trigger"
          @click.prevent="navItemClicked($event)"
          @mouseenter="navItemHovered($event)"
          @keydown="navItemKeydown($event)"
        >
          <slot :name="`tab-${index}-trigger`"></slot>
        </button>
      </div>

      <div
        v-if="usesOverflowMenu"
        class="tabbed-content-more"
        :class="{ 'is-idle': !overflowedIndexes.length }"
        :style="`--_anchor-name: ${anchorName}`"
      >
        <button
          ref="moreTriggerRef"
          :popovertarget="menuId"
          popovertargetaction="toggle"
          type="button"
          class="tabbed-content-more-trigger"
          :class="{ 'is-active': activeIsOverflowed }"
          data-more-trigger
          aria-haspopup="menu"
          :aria-expanded="isMoreOpen"
          :tabindex="overflowedIndexes.length ? undefined : -1"
          @click="handleMoreTriggerClick"
          @mouseenter="navItemHovered($event)"
        >
          <template v-if="activeIsOverflowed && activeIndex !== null">
            <span class="tabbed-content-more-label"><slot :name="`tab-${activeIndex}-trigger`"></slot></span>
            <span class="tabbed-content-visually-hidden">, {{ moreLabel }}</span>
            <Icon :name="moreActiveIcon" class="tabbed-content-more-chevron" aria-hidden="true" />
          </template>
          <template v-else>
            <span class="tabbed-content-visually-hidden">{{ moreLabel }}</span>
            <Icon :name="moreIcon" class="tabbed-content-more-icon" aria-hidden="true" />
          </template>
        </button>

        <div
          :id="menuId"
          ref="morePopoverRef"
          popover
          class="tabbed-content-more-popover"
          :class="{ 'tabbed-content-more-popover-open': usesFallbackPopover && isMoreOpen }"
          :style="positionStyle"
          :data-placement="popoverPlacement"
          @beforetoggle="handleBeforeToggle"
          @toggle="handleToggle"
          @keydown="handleMoreKeydown"
        >
          <ul class="tabbed-content-more-list" role="menu" :aria-label="moreLabel">
            <li v-for="index in overflowedIndexes" :key="index" role="none">
              <button
                type="button"
                role="menuitemradio"
                tabindex="-1"
                :aria-checked="index === activeIndex"
                class="tabbed-content-more-item"
                @click="selectOverflowedTab(index)"
              >
                <slot :name="`tab-${index}-trigger`"></slot>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <span
        v-if="trackIndicator && trackHover"
        class="tabbed-content-indicator-underline-hover"
        aria-hidden="true"
      ></span>
      <span v-if="trackIndicator" class="tabbed-content-indicator-underline" aria-hidden="true"></span>
      <span v-if="trackActive" class="tabbed-content-indicator-active" data-active-indicator aria-hidden="true"></span>
      <span v-if="trackHover" class="tabbed-content-indicator-hover" aria-hidden="true"></span>
    </div>
    <div class="tabbed-content-panels">
      <div
        v-for="index in tabIndexes"
        :id="panelId(index)"
        :key="index"
        ref="tabsContentRefs"
        :data-tab-index="index"
        class="tabbed-content-panel"
        :aria-labelledby="triggerId(index)"
        role="tabpanel"
        tabindex="0"
        :hidden="index !== 0"
      >
        <slot :name="`tab-${index}-content`"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core";

interface Props {
  axis?: "x" | "y";
  /** Duration (ms) of the moving indicators' transition. */
  transitionDuration?: number;
  /** Number of tabs to render — drives both the trigger and content indexed slots. */
  itemCount: number;
  /** Shows a moving highlight behind the hovered tab. */
  trackHover?: boolean;
  /** Shows a moving highlight behind the active tab. */
  trackActive?: boolean;
  /** Shows a moving underline/sideline indicator beneath the active tab. */
  trackIndicator?: boolean;
  /** What happens on `axis="x"` when the tabs don't fit: `menu` moves the ones that don't fit into a "More" menu, `scroll` lets the tab row scroll sideways. */
  overflowMode?: "menu" | "scroll";
  /** aria-label on the tablist — override for localisation. */
  ariaLabel?: string;
  /** Accessible name of the "More" button and its menu — override for localisation. */
  moreLabel?: string;
  /** Icon on the "More" button. */
  moreIcon?: string;
  /** Icon after the active tab's label on the "More" button, shown while the active tab is one of the collapsed ones. */
  moreActiveIcon?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  axis: "x",
  transitionDuration: 200,
  trackHover: true,
  trackActive: true,
  trackIndicator: true,
  overflowMode: "menu",
  ariaLabel: "Tabs",
  moreLabel: "More tabs",
  moreIcon: "lucide:ellipsis",
  moreActiveIcon: "lucide:chevron-down",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const id = useId();
const triggerId = (index: number) => `${id}-tab-${index}-trigger`;
const panelId = (index: number) => `${id}-tab-${index}-panel`;
const menuId = `${id}-more-menu`;
const anchorName = `--tabbed-content-more-${id}`;

const tabCount = computed(() => {
  const count = Math.floor(Number(props.itemCount));
  return Number.isFinite(count) && count > 0 ? count : 0;
});
const tabIndexes = computed(() => Array.from({ length: tabCount.value }, (_, index) => index));
const usesOverflowMenu = computed(() => props.axis === "x" && props.overflowMode === "menu");

const tabsNavRef = ref<HTMLElement | null>(null);
const tablistRef = ref<HTMLElement | null>(null);
const tabsContentRefs = ref<HTMLElement[] | null>(null);
const moreTriggerRef = ref<HTMLElement | null>(null);
const morePopoverRef = ref<HTMLElement | null>(null);

const overflowedIndexes = ref<number[]>([]);

const { refreshTabs, activeIndex, activateTabByIndex, navItemClicked, navItemHovered, navItemKeydown, resetHoverToActivePosition } =
  useTabs(() => props.axis, tabsNavRef, tabsContentRefs, () => props.transitionDuration, () => props.trackHover);

const activeIsOverflowed = computed(() => activeIndex.value !== null && overflowedIndexes.value.includes(activeIndex.value));

const getMoreItems = (): HTMLElement[] =>
  Array.from(morePopoverRef.value?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);

const {
  isOpen: isMoreOpen,
  usesFallbackPopover,
  positionStyle,
  popoverPlacement,
  hide: hideMore,
  handleTriggerClick: handleMoreTriggerClick,
  handleBeforeToggle,
  handleToggle,
} = useAnchoredPopover({
  rootRef: tabsNavRef,
  triggerRef: moreTriggerRef,
  popoverRef: morePopoverRef,
  onOpen: () => {
    const items = getMoreItems();
    (items.find((item) => item.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
  },
});

const selectOverflowedTab = (index: number) => {
  activateTabByIndex(index);
  hideMore();
  moreTriggerRef.value?.focus();
};

// Menu keyboard: arrows move (wrapping), Home/End jump, Tab closes. Escape is the popover's light dismiss.
const handleMoreKeydown = (event: KeyboardEvent) => {
  const items = getMoreItems();
  if (!items.length) return;
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  const focusAt = (index: number) => items[(index + items.length) % items.length]?.focus();

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      focusAt(currentIndex + 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      focusAt(currentIndex === -1 ? items.length - 1 : currentIndex - 1);
      break;
    case "Home":
      event.preventDefault();
      focusAt(0);
      break;
    case "End":
      event.preventDefault();
      focusAt(items.length - 1);
      break;
    case "Tab":
      hideMore();
      break;
  }
};

// Natural trigger widths, cached while each one is visible so hidden ones can be re-placed.
const triggerWidths = new Map<number, number>();

const measureOverflow = () => {
  if (!usesOverflowMenu.value) {
    overflowedIndexes.value = [];
    return;
  }
  const bar = tabsNavRef.value;
  const tablist = tablistRef.value;
  if (!bar || !tablist) return;

  tablist.querySelectorAll<HTMLElement>("[data-nav-item]").forEach((trigger) => {
    if (!trigger.hidden) triggerWidths.set(Number(trigger.dataset.tabIndex), trigger.offsetWidth);
  });

  const available = bar.clientWidth;
  const widths = tabIndexes.value.map((index) => triggerWidths.get(index) ?? 0);
  const total = widths.reduce((sum, width) => sum + width, 0);

  let next: number[] = [];
  if (total > available) {
    let used = moreTriggerRef.value?.offsetWidth ?? 0;
    const firstHidden = widths.findIndex((width) => (used += width) > available);
    next = firstHidden === -1 ? [] : tabIndexes.value.slice(firstHidden);
  }

  if (next.join() !== overflowedIndexes.value.join()) overflowedIndexes.value = next;
};

// A changed overflow re-renders the triggers, and the overflowedIndexes watcher refreshes again after that.
const recalculate = () => {
  measureOverflow();
  refreshTabs();
};

useResizeObserver(tabsNavRef, measureOverflow);
useResizeObserver(tablistRef, measureOverflow);
// The More button widens to show a collapsed active tab's label, which can push another tab into the menu.
useResizeObserver(moreTriggerRef, measureOverflow);

onMounted(recalculate);

watch(overflowedIndexes, () => nextTick(refreshTabs));

watch(
  [
    tabCount,
    () => props.axis,
    () => props.overflowMode,
    () => props.trackActive,
    () => props.trackIndicator,
    () => props.trackHover,
  ],
  () => nextTick(recalculate)
);
</script>

<style lang="css">
@layer components {
  .tabbed-content {
    --_focus-ring: var(--tabs-focus-ring-width, 0.2rem) solid var(--tabs-focus-ring-colour, var(--theme-border-focus));

    .tabbed-content-bar {
      position: relative;
      display: flex;
      max-inline-size: 100%;
      z-index: 1;

      border-bottom: var(
        --tabs-nav-border,
        0.1rem solid color-mix(in oklch, var(--theme-text) 20%, transparent)
      );

      .tabbed-content-list {
        display: flex;
        min-inline-size: 0;
      }

      /* Each indicator's edges are insets from the bar's start/end, set by useTabs. The edge moving in
         the direction of travel goes first; the trailing edge's delay makes it catch up afterwards. */
      .tabbed-content-indicator-hover,
      .tabbed-content-indicator-underline-hover {
        --_start: var(--_hovered-start, 0px);
        --_end: var(--_hovered-end, 100%);
        --_duration: var(--_hovered-duration, 0ms);
        --_start-delay: var(--_hovered-start-delay, 0ms);
        --_end-delay: var(--_hovered-end-delay, 0ms);
      }

      .tabbed-content-indicator-active,
      .tabbed-content-indicator-underline {
        --_start: var(--_active-start, 0px);
        --_end: var(--_active-end, 100%);
        --_duration: var(--_active-duration, 0ms);
        --_start-delay: var(--_active-start-delay, 0ms);
        --_end-delay: var(--_active-end-delay, 0ms);
      }

      .tabbed-content-indicator-hover,
      .tabbed-content-indicator-active,
      .tabbed-content-indicator-underline,
      .tabbed-content-indicator-underline-hover {
        position: absolute;
        top: 0;
        bottom: 0;
        left: var(--_start);
        right: var(--_end);
        transition:
          left var(--_duration) ease var(--_start-delay),
          right var(--_duration) ease var(--_end-delay);
        pointer-events: none;
      }

      .tabbed-content-indicator-hover {
        z-index: 1;
        background: var(--tabs-hover-indicator-colour, var(--theme-surface-subtle));
      }

      .tabbed-content-indicator-active {
        z-index: 2;
        background: var(--tabs-active-indicator-colour, var(--theme-surface));
      }

      .tabbed-content-indicator-underline {
        top: auto;
        z-index: 3;
        background: var(--tabs-underline-indicator-colour, var(--theme-accent));
        height: var(--tabs-underline-indicator-height, 0.4rem);
      }

      .tabbed-content-indicator-underline-hover {
        top: auto;
        z-index: 3;
        background: var(
          --tabs-hover-underline-indicator-colour,
          var(--tabs-underline-indicator-colour, var(--theme-accent))
        );
        height: var(--tabs-hover-underline-indicator-height, 0.1rem);
      }

      .tabbed-content-trigger {
        flex-shrink: 0;
        max-inline-size: var(--tabs-list-item-max-inline-size, 24rem);
        overflow-wrap: anywhere;
        opacity: var(--tabs-list-item-opacity, 0.7);
        position: relative;
        transition: color var(--tabs-list-item-colour-transition-duration, 100ms);
        z-index: 4;
        background: transparent;
        border: 0;
        color: var(--tabs-list-item-colour, var(--theme-text));
        cursor: pointer;
        font: inherit;
        text-transform: var(--tabs-list-item-text-transform, uppercase);
        font-weight: var(--tabs-list-item-font-weight, 500);
        margin: 0;
        padding: var(--tabs-list-item-padding-block, 1em) var(--tabs-list-item-padding-inline, 2em);

        /* Text colour tracks the indicator actually behind it — hover and active can differ. */
        &:hover {
          opacity: 1;
          color: var(--tabs-hover-indicator-text-colour, var(--theme-text));
        }

        &[aria-selected="true"] {
          opacity: 1;
          color: var(
            --tabs-list-item-colour-selected,
            var(--tabs-active-indicator-text-colour, var(--theme-on-surface))
          );
        }

        &:focus-visible {
          outline: var(--_focus-ring);
          outline-offset: var(--tabs-list-item-focus-outline-offset, -0.2rem);
        }

        &[hidden] {
          display: none;
        }
      }

      .tabbed-content-more {
        display: flex;
        flex-shrink: 0;
        margin-inline-start: var(--tabs-more-margin-inline-start, auto);

        /* Kept measurable but out of sight when nothing has overflowed. */
        &.is-idle {
          position: absolute;
          visibility: hidden;
          pointer-events: none;
        }

        .tabbed-content-more-trigger {
          display: flex;
          align-items: center;
          gap: 0.4em;
          max-inline-size: var(--tabs-list-item-max-inline-size, 24rem);
          overflow-wrap: anywhere;
          font: inherit;
          text-transform: var(--tabs-list-item-text-transform, uppercase);
          font-weight: var(--tabs-list-item-font-weight, 500);
          text-align: start;
          position: relative;
          z-index: 4;
          margin: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          color: var(--tabs-list-item-colour, var(--theme-text));
          opacity: var(--tabs-list-item-opacity, 0.7);
          padding: var(--tabs-list-item-padding-block, 1em) var(--tabs-more-trigger-padding-inline, 1.2em);
          anchor-name: var(--_anchor-name);
          transition: color var(--tabs-list-item-colour-transition-duration, 100ms);

          &:hover,
          &[aria-expanded="true"] {
            opacity: 1;
            color: var(--tabs-hover-indicator-text-colour, var(--theme-text));
          }

          &.is-active {
            padding-inline: var(--tabs-list-item-padding-inline, 2em);
            opacity: 1;
            color: var(
              --tabs-list-item-colour-selected,
              var(--tabs-active-indicator-text-colour, var(--theme-on-surface))
            );
          }

          &:focus-visible {
            outline: var(--_focus-ring);
            outline-offset: var(--tabs-list-item-focus-outline-offset, -0.2rem);
          }

          .tabbed-content-more-icon {
            display: block;
            font-size: var(--tabs-more-icon-size, 1.25em);
          }

          .tabbed-content-more-label {
            min-inline-size: 0;
          }

          .tabbed-content-more-chevron {
            display: block;
            flex-shrink: 0;
            font-size: var(--tabs-more-chevron-size, 1em);
            transition: transform var(--tabs-more-popover-transition-duration, 200ms) ease;
          }

          &[aria-expanded="true"] .tabbed-content-more-chevron {
            transform: scaleY(-1);
          }
        }

        .tabbed-content-more-popover {
          margin: 0;
          padding: 0;
          inset: auto;
          border: var(
            --tabs-more-popover-border,
            0.1rem solid color-mix(in oklch, var(--theme-text) 20%, transparent)
          );
          border-radius: var(--tabs-more-popover-border-radius, 0.6rem);
          background-color: var(--tabs-more-popover-surface, var(--page-bg, var(--theme-surface-subtle)));
          color: var(--tabs-more-popover-text-colour, var(--theme-text));
          box-shadow: var(--tabs-more-popover-shadow, 0 0.4rem 1.6rem rgb(0 0 0 / 12%));
          min-inline-size: var(--tabs-more-popover-min-inline-size, 16rem);
          max-inline-size: min(var(--tabs-list-item-max-inline-size, 24rem), calc(100vw - 3.2rem));
          max-block-size: var(--tabs-more-popover-max-block-size, 70vh);
          overflow-y: auto;

          position-anchor: var(--_anchor-name);
          top: calc(anchor(bottom) + var(--tabs-more-popover-distance, 0.4rem));
          right: anchor(right);
          left: auto;
          position-try-fallbacks: flip-block, flip-inline;

          opacity: 0;
          display: none;
          transition:
            opacity var(--tabs-more-popover-transition-duration, 200ms),
            display var(--tabs-more-popover-transition-duration, 200ms),
            overlay var(--tabs-more-popover-transition-duration, 200ms);
          transition-behavior: allow-discrete;

          &:popover-open {
            display: block;
            opacity: 1;

            @starting-style {
              display: block;
              opacity: 0;
            }
          }

          /* Kept apart from :popover-open, which would invalidate a shared selector list where unsupported. */
          &.tabbed-content-more-popover-open {
            display: block;
            opacity: 1;
          }

          @supports not (anchor-name: --a) {
            position: fixed;
            top: calc(var(--_anchor-bottom, 0px) + var(--tabs-more-popover-distance, 0.4rem));
            right: var(--_anchor-right-inverse, 0px);
            z-index: var(--tabs-more-popover-z-index, 999999);

            &[data-placement="top"] {
              top: auto;
              bottom: calc(var(--_anchor-top-inverse, 0px) + var(--tabs-more-popover-distance, 0.4rem));
            }
          }

          .tabbed-content-more-list {
            list-style: none;
            margin: 0;
            padding: 0;

            .tabbed-content-more-item {
              display: block;
              inline-size: 100%;
              margin: 0;
              border: 0;
              background: transparent;
              color: inherit;
              cursor: pointer;
              font: inherit;
              text-align: start;
              text-transform: var(--tabs-list-item-text-transform, uppercase);
              font-weight: var(--tabs-list-item-font-weight, 500);
              overflow-wrap: anywhere;
              padding: var(--tabs-more-item-padding-block, 0.8em) var(--tabs-more-item-padding-inline, 1.2em);

              &:hover,
              &:focus-visible {
                background-color: var(
                  --tabs-more-item-surface-hover,
                  color-mix(in oklch, var(--theme-text) 8%, transparent)
                );
              }

              &[aria-checked="true"] {
                color: var(--tabs-more-item-colour-selected, var(--theme-accent));
              }

              &:focus-visible {
                outline: var(--_focus-ring);
                outline-offset: calc(-1 * var(--tabs-focus-ring-width, 0.2rem));
              }
            }
          }
        }
      }
    }

    /* With a moving active highlight, text colour follows what's actually behind it: a tab the highlight
       covers takes the active text colour, the selected tab keeps its resting colour until it arrives. */
    &.tracks-active {
      .tabbed-content-trigger[aria-selected="true"]:not([data-under-active]),
      .tabbed-content-more-trigger.is-active:not([data-under-active]) {
        color: var(--tabs-list-item-colour, var(--theme-text));
      }

      .tabbed-content-trigger[data-under-active],
      .tabbed-content-more .tabbed-content-more-trigger[data-under-active] {
        opacity: 1;
        color: var(
          --tabs-list-item-colour-selected,
          var(--tabs-active-indicator-text-colour, var(--theme-on-surface))
        );
      }
    }

    .tabbed-content-visually-hidden {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    &.overflow-scroll .tabbed-content-bar {
      overflow-x: auto;
    }

    &.overflow-menu .tabbed-content-bar {
      overflow: hidden;
    }

    .tabbed-content-panels {
      display: grid;
      grid-template-areas: "element-stack";
      min-inline-size: 0;

      background-color: var(--tabs-content-background-colour, var(--theme-surface-subtle));
      color: var(--tabs-content-text-colour, var(--theme-text));
      border: var(--tabs-content-border-width, 0.1rem) solid
        var(--tabs-content-border-colour, color-mix(in oklch, var(--theme-text) 20%, transparent));
      border-radius: var(--tabs-content-border-radius, 0);

      .tabbed-content-panel {
        grid-area: element-stack;
        min-inline-size: 0;
        overflow-wrap: anywhere;

        &[hidden] {
          display: none;
        }

        &:focus-visible {
          outline: var(--_focus-ring);
          outline-offset: calc(-1 * var(--tabs-focus-ring-width, 0.2rem));
        }
      }
    }

    &.axis-y {
      display: flex;
      flex-direction: row;
      gap: var(--tabs-axis-y-gap, 2em);

      .tabbed-content-bar {
        flex-direction: column;
        flex-shrink: 0;
        max-inline-size: var(--tabs-axis-y-list-max-inline-size, 50%);
        overflow: visible;

        border-bottom: initial;
        border-left: var(
          --tabs-nav-border,
          0.1rem solid color-mix(in oklch, var(--theme-text) 20%, transparent)
        );

        .tabbed-content-list {
          flex-direction: column;
        }

        .tabbed-content-trigger {
          text-align: start;
          width: 100%;
          max-inline-size: none;
        }

        .tabbed-content-indicator-hover,
        .tabbed-content-indicator-active,
        .tabbed-content-indicator-underline,
        .tabbed-content-indicator-underline-hover {
          left: 0;
          right: 0;
          top: var(--_start);
          bottom: var(--_end);
          height: auto;
          transition:
            top var(--_duration) ease var(--_start-delay),
            bottom var(--_duration) ease var(--_end-delay);
        }

        .tabbed-content-indicator-underline {
          right: auto;
          width: var(--tabs-underline-indicator-height, 0.4rem);
        }

        .tabbed-content-indicator-underline-hover {
          right: auto;
          width: var(--tabs-hover-underline-indicator-height, 0.1rem);
        }
      }

      .tabbed-content-panels {
        flex-grow: 1;
      }
    }
  }
}
</style>
