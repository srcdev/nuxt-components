<template>
  <div class="action-menu" :class="[elementClasses]" :style="`--_anchor-name: ${anchorName}`">
    <button
      ref="triggerRef"
      :popovertarget="menuId"
      popovertargetaction="toggle"
      type="button"
      class="action-menu-trigger"
      :aria-label="label"
      aria-haspopup="menu"
    >
      <Icon name="lucide:ellipsis" class="action-menu-trigger-icon" aria-hidden="true" />
    </button>

    <div
      :id="menuId"
      ref="popoverRef"
      popover
      class="action-menu-popover"
      @toggle="handleToggle"
      @keydown="handleKeydown"
    >
      <ul class="action-menu-list" role="menu" :aria-label="label">
        <li
          v-for="n in itemCount"
          :key="n - 1"
          class="action-menu-list-item"
          role="none"
          @click="closeMenu"
        >
          <slot :name="`item-${n - 1}`"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  itemCount?: number;
  label?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  itemCount: 0,
  label: "Open actions menu",
  styleClassPassthrough: () => [],
});

const id = useId();
const menuId = `action-menu-${id}`;
const anchorName = `--action-menu-anchor-${id}`;

const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);

/** Returns all focusable menuitems in DOM order. */
const getMenuItems = (): HTMLElement[] =>
  Array.from(popoverRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

/**
 * Close the menu and return focus to the trigger.
 * Called on item click — Escape is handled natively by the Popover API
 * (which also restores focus to the trigger automatically).
 */
const closeMenu = () => {
  popoverRef.value?.hidePopover();
  triggerRef.value?.focus();
};

const handleToggle = (event: Event) => {
  const toggleEvent = event as ToggleEvent;
  if (toggleEvent.newState === "open") {
    getMenuItems()[0]?.focus();
  }
};

/**
 * Keyboard navigation following the WAI-ARIA menu pattern.
 *
 * ArrowDown / ArrowUp  — move between items (wraps around).
 * Home / End           — jump to first / last item.
 * Tab                  — close the menu; let the browser Tab naturally
 *                        (do NOT focus the trigger — Tab should advance
 *                        to the next element in the page).
 * Escape               — handled natively by the Popover API.
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
      popoverRef.value?.hidePopover();
      break;
  }
};

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .action-menu {
    --_block-distance: var(--action-menu-block-distance, 0.4rem);
    --_trigger-size: var(--action-menu-trigger-size, 3.2rem);
    --_trigger-border-radius: var(--action-menu-trigger-border-radius, var(--button-border-radius-icon-only, 50%));
    --_trigger-surface: var(--action-menu-trigger-surface, transparent);
    --_trigger-surface-hover: var(--action-menu-trigger-surface-hover, light-dark(var(--slate-01), var(--slate-09)));
    --_trigger-icon-size: var(--action-menu-trigger-icon-size, 2rem);
    --_trigger-icon-color: var(--action-menu-trigger-icon-color, light-dark(var(--slate-07), var(--slate-03)));

    --_popover-background: var(--action-menu-popover-background, light-dark(var(--slate-00), var(--slate-10)));
    --_popover-border: var(--action-menu-popover-border, 0.1rem solid light-dark(var(--slate-03), var(--slate-07)));
    --_popover-border-radius: var(--action-menu-popover-border-radius, 0.8rem);
    --_popover-min-width: var(--action-menu-popover-min-width, 20rem);
    --_popover-shadow: var(--action-menu-popover-shadow, 0 0.4rem 1.6rem light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)));
    --_popover-transition-duration: var(--action-menu-popover-transition-duration, 200ms);
    --_item-divider: var(--action-menu-item-divider, 0.1rem solid light-dark(var(--slate-02), var(--slate-08)));

    position: relative;
    display: inline-block;

    .action-menu-trigger {
      all: unset;
      cursor: pointer;
      display: grid;
      place-items: center;
      width: var(--_trigger-size);
      height: var(--_trigger-size);
      border-radius: var(--_trigger-border-radius);
      background-color: var(--_trigger-surface);
      color: var(--_trigger-icon-color);
      anchor-name: var(--_anchor-name);
      transition: background-color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease);

      &:hover,
      &:focus-visible {
        background-color: var(--_trigger-surface-hover);
      }

      &:focus-visible {
        outline: var(--button-outline-width, 0.2rem) solid var(--theme-button-primary-outline, currentcolor);
        outline-offset: 0.2rem;
      }

      .action-menu-trigger-icon {
        display: block;
        width: var(--_trigger-icon-size);
        height: var(--_trigger-icon-size);
      }
    }

    .action-menu-popover {
      border: var(--_popover-border);
      margin: 0;
      padding: 0;
      inset: auto;
      background-color: var(--_popover-background);
      border-radius: var(--_popover-border-radius);
      min-width: var(--_popover-min-width);
      box-shadow: var(--_popover-shadow);
      overflow: hidden;

      position-anchor: var(--_anchor-name);
      top: calc(anchor(bottom) + var(--_block-distance));
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

      .action-menu-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .action-menu-list-item {
          &:not(:last-child) {
            border-bottom: var(--_item-divider);
          }
        }
      }
    }
  }
}
</style>
