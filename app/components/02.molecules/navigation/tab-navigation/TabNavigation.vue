<template>
  <nav
    v-if="visibleItems.length"
    ref="navRef"
    class="tab-navigation"
    :class="[
      elementClasses,
      `tab-navigation--${navAlign}`,
      { 'is-collapsed': isCollapsed, 'is-loaded': isLoaded, 'menu-open': isMenuOpen, 'is-animated': isAnimated },
    ]"
    :aria-label="ariaLabel"
  >
    <ul v-if="!isCollapsed || !isLoaded" ref="navListRef" class="tab-nav-list" @mouseleave="hoveredItemHref = null">
      <li
        v-for="(item, index) in visibleItems"
        :key="`${index}-${item.href}`"
        :data-href="item.href"
        :class="[
          item.cssName,
          {
            'is-active': item.href?.startsWith('#') ? item.href === activeHash : isActiveItem(item.href),
            'is-hovered': hoveredItemHref === item.href,
          },
        ]"
        @mouseenter="hoveredItemHref = item.href ?? null"
      >
        <!-- Plain <a> for hash links — keeps Vue Router out of the smooth-scroll path -->
        <a
          v-if="item.href?.startsWith('#')"
          :href="item.href"
          class="tab-nav-link"
          data-nav-item
          @click="(e) => item.href && handleNavClick(e, item.href)"
        >
          <Icon v-if="item.iconName" :name="item.iconName" aria-hidden="true" />
          {{ item.text }}
        </a>
        <NuxtLink
          v-else
          :href="item.href"
          :external="item.isExternal || undefined"
          class="tab-nav-link"
          data-nav-item
          @click="(e) => item.href && handleNavClick(e, item.href)"
        >
          <Icon v-if="item.iconName" :name="item.iconName" aria-hidden="true" />
          {{ item.text }}
        </NuxtLink>
      </li>
      <li aria-hidden="true" role="none" class="nav-indicator-li"><div class="nav__hovered"></div></li>
      <li aria-hidden="true" role="none" class="nav-indicator-li"><div class="nav__active-indicator"></div></li>
    </ul>

    <InputButton
      v-if="showCollapsed"
      class="tab-nav-burger"
      :class="{ 'is-open': isMenuOpen }"
      variant="tertiary"
      :button-text="isMenuOpen ? closeMenuLabel : openMenuLabel"
      :aria-expanded="String(isMenuOpen)"
      :aria-controls="panelId"
      @click="toggleMenu"
    >
      <template #iconOnly>
        <span class="burger-bar" aria-hidden="true"></span>
        <span class="burger-bar" aria-hidden="true"></span>
        <span class="burger-bar" aria-hidden="true"></span>
      </template>
    </InputButton>

    <Teleport to="body">
      <div
        v-if="showCollapsed"
        class="tab-nav-backdrop"
        :class="{ 'is-open': isMenuOpen }"
        aria-hidden="true"
        @click="closeMenu"
      ></div>
    </Teleport>

    <div
      v-if="showCollapsed"
      :id="panelId"
      class="tab-nav-panel"
      :class="{ 'is-open': isMenuOpen }"
      :inert="!isMenuOpen ? true : undefined"
    >
      <div class="tab-nav-panel-inner">
        <ul class="tab-nav-panel-list">
          <li v-for="(item, index) in visibleItems" :key="`${index}-${item.href}`" :class="item.cssName">
            <a
              v-if="item.href?.startsWith('#')"
              :href="item.href"
              class="tab-nav-panel-link"
              @click="
                (e) => {
                  item.href && handleNavClick(e, item.href);
                  closeMenu();
                }
              "
            >
              <Icon v-if="item.iconName" :name="item.iconName" aria-hidden="true" />
              {{ item.text }}
            </a>
            <NuxtLink
              v-else
              :href="item.href"
              :external="item.isExternal || undefined"
              class="tab-nav-panel-link"
              @click="
                (e) => {
                  item.href && handleNavClick(e, item.href);
                  closeMenu();
                }
              "
            >
              <Icon v-if="item.iconName" :name="item.iconName" aria-hidden="true" />
              {{ item.text }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavItemData } from "~/types/components";

interface Props {
  navItemData: NavItemData;
  navAlign?: "left" | "center" | "right";
  styleClassPassthrough?: string | string[];
  anchorScrollOffset?: number | (() => number);
  /** aria-label on the nav landmark — override for localisation. */
  ariaLabel?: string;
  /** Burger button label while the menu is closed — override for localisation. */
  openMenuLabel?: string;
  /** Burger button label while the menu is open — override for localisation. */
  closeMenuLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  navAlign: "left",
  styleClassPassthrough: () => [],
  anchorScrollOffset: undefined,
  ariaLabel: "Site navigation",
  openMenuLabel: "Open navigation menu",
  closeMenuLabel: "Close navigation menu",
});

if (import.meta.dev) {
  console.warn(
    "TabNavigation is deprecated: use ResponsiveHeader, which also handles #anchor links " +
      "(anchorScrollOffset) and collapses item by item. See \"Migrating from TabNavigation\" in " +
      ".claude/skills/components/responsive-header.md."
  );
}

// Items with no text would render links with no accessible name.
const visibleItems = computed(() => (props.navItemData.main ?? []).filter((item) => item.text?.trim()));
const panelId = useId();

const { navRef, navListRef, isCollapsed, isLoaded, isMenuOpen, isActiveItem, toggleMenu, closeMenu } =
  useNavCollapse("tab-nav-loaded");

const { handleNavClick, activeHash } = useAnchorScroll({ offset: props.anchorScrollOffset });

onMounted(() => {
  if (!activeHash.value) {
    const firstHashItem = visibleItems.value.find((item) => item.href?.startsWith("#"));
    if (firstHashItem?.href) activeHash.value = firstHashItem.href;
  }
});

// ─── Animation gate — disables indicator transitions during route changes ────
// Starts true: CSS anchor positioning resolves before first paint so there is
// no previous position to animate from on initial render.
// Uses flush:"pre" so isAnimated = false lands in the same DOM update as the
// is-active class moving — the browser never sees the anchor shift with
// transitions active.
const isAnimated = ref(true);
const route = useRoute();

watch(
  () => route.path,
  () => {
    isAnimated.value = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isAnimated.value = true;
      });
    });
  },
  { flush: "pre" }
);

const hoveredItemHref = ref<string | null>(null);
const showCollapsed = computed(() => isCollapsed.value && isLoaded.value);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .tab-nav-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10;
    background: var(--tab-nav-backdrop-bg, oklch(0% 0 0 / 55%));
    backdrop-filter: blur(var(--tab-nav-backdrop-blur, 3px));
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--tab-nav-backdrop-duration, 350ms) ease;

    &.is-open {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .tab-navigation {
    /* ─── Public token API ────────────────────────────────────────────── */

    /* Horizontal nav */
    --_link-color: var(--tab-nav-link-color, var(--theme-text));
    --_link-hover-color: var(--tab-nav-link-hover-color, var(--theme-accent));
    --_link-size: var(--tab-nav-link-size, 1.6rem);
    --_link-tracking: var(--tab-nav-link-tracking, 0.06em);
    --_link-weight: var(--tab-nav-link-weight, 400);
    --_nav-transition: var(--tab-nav-transition, 250ms ease);

    /* Panel */
    --_panel-link-color: var(--tab-nav-panel-link-color, var(--_link-color));
    --_panel-slide-duration: var(--tab-nav-panel-slide-duration, 350ms);
    --_panel-slide-easing: var(--tab-nav-panel-slide-easing, cubic-bezier(0.4, 0, 0.2, 1));

    /* Burger */
    --_burger-bar-height: var(--tab-nav-burger-height, 1.5px);
    --_burger-bar-gap: var(--tab-nav-burger-gap, 5px);
    --_burger-color: var(--tab-nav-burger-color, var(--_link-color));
    --_burger-transition: var(--tab-nav-burger-transition, 300ms ease);

    /* ─────────────────────────────────────────────────────────────────── */

    display: flex;
    align-items: center;
    min-width: 0;

    /* Hide everything until first measurement to prevent wrong-state flash */
    &:not(.is-loaded) {
      opacity: 0;
    }

    /* ─── Horizontal list ───────────────────────────────────────────── */

    .tab-nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: var(--tab-nav-gap, 2.2rem);
      align-items: center;
      position: relative;

      .nav-indicator-li {
        /* display: contents removes the li's box entirely — children become
           direct participants in the flex container, so position: absolute
           on .nav__hovered / .nav__active-indicator resolves against
           .tab-nav-list (same containing block as the anchor li elements).
           Without this, .nav-indicator-li is the containing block, which is
           a different scope and Chrome's anchor positioning rejects it. */
        display: contents;
      }

      /* Indicators hidden by default — shown only with anchor positioning support */
      .nav__hovered,
      .nav__active-indicator {
        display: none;
        pointer-events: none;
      }

      .tab-nav-link {
        display: flex;
        align-items: center;
        gap: 0.4em;
        color: var(--_link-color);
        font-size: var(--_link-size);
        font-weight: var(--_link-weight);
        letter-spacing: var(--_link-tracking);
        text-decoration: none;
        white-space: nowrap;
        padding-block: 0.8rem;
        padding-inline: 0.4rem;
        position: relative;
        z-index: 4;
        transition: color var(--_nav-transition);

        &:hover,
        &:focus-visible {
          color: var(--_link-hover-color);
          outline: none;
        }

        &:focus-visible {
          outline: var(--tab-nav-focus-ring-width, 2px) solid var(--tab-nav-focus-ring-colour, currentColor);
          outline-offset: var(--tab-nav-focus-ring-offset, 2px);
        }

        &.router-link-exact-active {
          color: var(--tab-nav-link-active-color, var(--_link-color));
        }
      }
    }

    /* ─── Alignment variants ────────────────────────────────────────── */

    &.tab-navigation--center .tab-nav-list {
      margin-inline: auto;
    }

    &.tab-navigation--right .tab-nav-list {
      margin-inline-start: auto;
    }

    &.is-collapsed {
      justify-content: end;
    }

    /* ─── Burger button (InputButton) ──────────────────────────── */

    .tab-nav-burger.input-button.icon-only {
      margin-inline-start: auto;
      color: var(--_burger-color);

      /* Strip all InputButton visual styling */
      background: none;
      border: none;
      outline: none;
      text-decoration: none;
      padding: 8px;
      border-radius: 4px;
      transition: outline-color var(--_nav-transition);

      &.icon-only {
        aspect-ratio: unset;
        border-radius: 4px;

        .btn-icon {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--_burger-bar-gap);
        }
      }

      &:focus-visible {
        outline: 2px solid var(--_burger-color);
        outline-offset: 4px;
      }
    }

    .burger-bar {
      display: block;
      width: var(--tab-nav-burger-width, 22px);
      height: var(--_burger-bar-height);
      background: currentColor;
      border-radius: 1px;
      transform-origin: center;
      transition:
        transform var(--_burger-transition),
        opacity var(--_burger-transition);
    }

    .tab-nav-burger.is-open {
      .burger-bar:nth-child(1) {
        transform: translateY(calc(var(--_burger-bar-height) + var(--_burger-bar-gap))) rotate(45deg);
      }

      .burger-bar:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }

      .burger-bar:nth-child(3) {
        transform: translateY(calc(-1 * (var(--_burger-bar-height) + var(--_burger-bar-gap)))) rotate(-45deg);
      }
    }

    /* ─── Mobile drop panel ─────────────────────────────────────────── */

    .tab-nav-panel {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;

      display: grid;
      grid-template-rows: 0fr;
      border-block-start: 1px solid transparent;
      transition:
        grid-template-rows var(--_panel-slide-duration) var(--_panel-slide-easing),
        border-color var(--_panel-slide-duration) var(--_panel-slide-easing);

      z-index: 1;

      &.is-open {
        grid-template-rows: 1fr;
        border-block-start-color: var(--tab-nav-panel-border-color, color-mix(in oklch, var(--_link-color) 20%, transparent));
      }

      .tab-nav-panel-inner {
        overflow: hidden;
        background-color: var(--tab-nav-panel-bg, var(--page-bg, var(--theme-surface-subtle)));
      }

      .tab-nav-panel-list {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          border-block-end: 1px solid
            var(--tab-nav-panel-item-border, color-mix(in oklch, var(--_panel-link-color) 12%, transparent));

          &:last-child {
            border-block-end: none;
          }

          &:hover {
            background-color: var(
              --tab-nav-panel-item-hover-bg,
              color-mix(in oklch, var(--_panel-link-color) 5%, transparent)
            );
          }
        }

        .tab-nav-panel-link {
          display: flex;
          align-items: center;
          gap: 0.5em;
          color: var(--_panel-link-color);
          font-size: var(--_link-size);
          font-weight: var(--_link-weight);
          letter-spacing: var(--_link-tracking);
          text-decoration: none;
          padding-block: var(--tab-nav-panel-padding-block, 1.4rem);
          padding-inline: var(--tab-nav-panel-padding-inline, 1.5rem);
          overflow-wrap: anywhere;
          min-inline-size: 0;
          position: relative;
          z-index: 1;
          transition: color var(--_nav-transition);

          &:hover,
          &:focus-visible {
            color: var(--tab-nav-panel-link-hover-color, var(--_link-hover-color));
            outline: none;
          }

          &:focus-visible {
            outline: var(--tab-nav-focus-ring-width, 2px) solid var(--tab-nav-focus-ring-colour, currentColor);
            outline-offset: calc(-1 * var(--tab-nav-focus-ring-width, 2px));
          }

          &.router-link-exact-active {
            color: var(--tab-nav-panel-link-active-color, var(--_panel-link-color));
          }
        }
      }
    }
  }

  /* ─── Anchor positioning for nav indicators ──────────────────────────────
     anchor-name is declared unconditionally so the @oddbird polyfill can
     read it on browsers without native support (the polyfill checks for
     anchor-name in raw CSS text, but skips rules inside a failing @supports).
     The display guard stays inside @supports so indicators are hidden on
     truly old browsers where neither native CSS nor the polyfill will work.
     Requires Chrome 125+, Edge 125+, Firefox 131+, or the polyfill.
  ──────────────────────────────────────────────────────────────────────── */

  /* Single anchor --tab-nav-indicator tracks the hovered item, or falls back
     to the active item when nothing is hovered. No dual anchor-names needed. */

  /* Nothing hovered: anchor sits on the active item */
  .tab-navigation .tab-nav-list:not(:has(.is-hovered)) li.is-active {
    anchor-name: --tab-nav-indicator;
  }

  /* Something hovered: anchor sits on the hovered item */
  .tab-navigation .tab-nav-list li.is-hovered {
    anchor-name: --tab-nav-indicator;
  }

  /* @supports (anchor-name: --x) { */
  /* Hover highlight: background pill that follows the pointer */
  .tab-navigation .tab-nav-list .nav__hovered {
    display: block;
    position: absolute;
    position-anchor: --tab-nav-indicator;
    left: anchor(left);
    right: anchor(right);
    top: 0;
    bottom: 0;
    opacity: 0;
    pointer-events: none;
    background: var(--tab-nav-decorator-hovered-bg, transparent);
    border-radius: 4px;
    z-index: 1;
  }

  .tab-navigation.is-animated .tab-nav-list .nav__hovered {
    transition:
      left 200ms ease,
      right 200ms ease,
      opacity 150ms ease;
  }

  .tab-navigation .tab-nav-list:has(.is-hovered) .nav__hovered {
    opacity: 1;
  }

  /* Active indicator bar: always follows --tab-nav-indicator */
  .tab-navigation .tab-nav-list .nav__active-indicator {
    display: block;
    position: absolute;
    position-anchor: --tab-nav-indicator;
    left: anchor(left);
    right: anchor(right);
    bottom: 0;
    height: 2px;
    pointer-events: none;
    background-color: var(--tab-nav-decorator-indicator-color, var(--theme-accent));
    z-index: 3;
  }

  .tab-navigation.is-animated .tab-nav-list .nav__active-indicator {
    transition:
      left 200ms ease,
      right 200ms ease;
  }
  /* } */
}
</style>
