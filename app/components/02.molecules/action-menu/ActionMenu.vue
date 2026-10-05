<template>
  <div ref="rootRef" class="action-menu" :class="[elementClasses]" :style="`--_anchor-name: ${anchorName}`">
    <button
      ref="triggerRef"
      :popovertarget="menuId"
      popovertargetaction="toggle"
      type="button"
      class="action-menu-trigger"
      :aria-label="label"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="handleTriggerClick"
    >
      <Icon :name="triggerIcon" class="action-menu-trigger-icon" aria-hidden="true" />
    </button>

    <div
      :id="menuId"
      ref="popoverRef"
      popover
      class="action-menu-popover"
      :class="{ 'action-menu-popover-open': usesFallbackPopover && isOpen }"
      :style="positionStyle"
      :data-placement="popoverPlacement"
      @beforetoggle="handleBeforeToggle"
      @toggle="handleToggle"
      @keydown="handleKeydown"
    >
      <ul class="action-menu-list" role="menu" :aria-label="label">
        <li v-for="n in itemCount()" :key="n - 1" class="action-menu-list-item" role="none" @click="closeMenu">
          <slot :name="`item-${n - 1}`"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  triggerIcon?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  label: "Open actions menu",
  triggerIcon: "lucide:ellipsis",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const itemCount = () => Object.keys(slots).filter((name) => /^item-\d+$/.test(name)).length;

const id = useId();
const menuId = `action-menu-${id}`;
const anchorName = `--action-menu-anchor-${id}`;

const rootRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);

/** Returns all focusable menuitems in DOM order. */
const getMenuItems = (): HTMLElement[] =>
  Array.from(popoverRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

const {
  isOpen,
  usesFallbackPopover,
  positionStyle,
  popoverPlacement,
  hide,
  handleTriggerClick,
  handleBeforeToggle,
  handleToggle,
} = useAnchoredPopover({ rootRef, triggerRef, popoverRef, align: "end", onOpen: () => getMenuItems()[0]?.focus() });

/** Close the menu and return focus to the trigger. Called on item click. */
const closeMenu = () => {
  hide();
  triggerRef.value?.focus();
};

/**
 * Keyboard navigation following the WAI-ARIA menu pattern.
 *
 * ArrowDown / ArrowUp  — move between items (wraps around).
 * Home / End           — jump to first / last item.
 * Tab                  — close the menu; let the browser Tab naturally
 *                        (do NOT focus the trigger — Tab should advance
 *                        to the next element in the page).
 * Escape               — native light dismiss, or the fallback listener without the Popover API.
 */
const handleKeydown = (event: KeyboardEvent) => {
  const items = getMenuItems();
  if (!items.length) return;

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      items[currentIndex === -1 ? 0 : (currentIndex + 1) % items.length]?.focus();
      break;
    case "ArrowUp":
      event.preventDefault();
      items[currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length]?.focus();
      break;
    case "Home":
      event.preventDefault();
      items[0]?.focus();
      break;
    case "End":
      event.preventDefault();
      items[items.length - 1]?.focus();
      break;
    case "Tab":
      // Close without stealing focus — Tab exits to the next DOM element naturally.
      hide();
      break;
  }
};

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .action-menu {
    --_trigger-size: var(--action-menu-trigger-size, 3.2rem);
    --_popover-transition-duration: var(--action-menu-popover-transition-duration, 200ms);

    position: relative;
    display: inline-block;

    .action-menu-trigger {
      all: unset;
      cursor: pointer;
      display: grid;
      place-items: center;
      width: var(--_trigger-size);
      height: var(--_trigger-size);
      border-radius: var(--action-menu-trigger-border-radius, var(--button-border-radius-icon-only, 50%));
      background-color: var(--action-menu-trigger-surface, transparent);
      color: var(--action-menu-trigger-icon-color, var(--slate-07));
      anchor-name: var(--_anchor-name);
      transition: background-color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease);

      &:hover,
      &:focus-visible {
        background-color: var(--action-menu-trigger-surface-hover, var(--slate-01));
      }

      &:focus-visible {
        outline: var(--button-outline-width, 0.2rem) solid var(--theme-ring, currentcolor);
        outline-offset: 0.2rem;
      }

      .action-menu-trigger-icon {
        display: block;
        font-size: var(--action-menu-trigger-icon-size, 2rem);
      }
    }

    .action-menu-popover {
      border: var(--action-menu-popover-border, 0.1rem solid var(--slate-03));
      margin: 0;
      padding: 0;
      inset: auto;
      background-color: var(--action-menu-popover-background, var(--slate-00));
      border-radius: var(--action-menu-popover-border-radius, 0.8rem);
      min-width: var(--action-menu-popover-min-width, 20rem);
      box-shadow: var(--action-menu-popover-shadow, 0 0.4rem 1.6rem rgba(0, 0, 0, 0.1));
      overflow: hidden;

      position-anchor: var(--_anchor-name);
      top: calc(anchor(bottom) + var(--action-menu-block-distance, 0.4rem));
      right: anchor(right);
      left: auto;
      position-try-fallbacks: flip-block;

      opacity: 0;
      display: none;
      transition:
        opacity var(--_popover-transition-duration),
        display var(--_popover-transition-duration),
        overlay var(--_popover-transition-duration);
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
      &.action-menu-popover-open {
        display: block;
        opacity: 1;
      }

      @supports not (anchor-name: --a) {
        position: fixed;
        top: calc(var(--_popover-top, 0px) + var(--action-menu-block-distance, 0.4rem));
        right: var(--_popover-right, 0px);
        z-index: var(--action-menu-popover-z-index, 999999);

        &[data-placement="above"] {
          top: auto;
          bottom: calc(var(--_popover-bottom, 0px) + var(--action-menu-block-distance, 0.4rem));
        }
      }

      .action-menu-list {
        display: grid;
        grid-template-columns: auto 1fr auto;

        list-style: none;
        padding: 0;
        margin: 0;

        .action-menu-list-item {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: subgrid;

          &:not(:last-child) {
            border-bottom: var(--action-menu-item-divider, 0.1rem solid var(--slate-02));
          }

          > .action-menu-item {
            grid-column: 1 / -1;
            grid-template-columns: subgrid;
          }
        }
      }
    }
  }
}
</style>
