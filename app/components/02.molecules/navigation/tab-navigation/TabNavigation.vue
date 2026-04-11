<template>
  <nav
    ref="navRef"
    class="tab-navigation"
    :class="[
      elementClasses,
      `tab-navigation--${navAlign}`,
      { 'is-collapsed': isCollapsed, 'is-loaded': isLoaded, 'menu-open': isMenuOpen, 'is-animated': isAnimated },
    ]"
    aria-label="Site navigation"
  >
    <ul
      v-if="!isCollapsed || !isLoaded"
      ref="navListRef"
      class="tab-nav-list"
      @mouseleave="hoveredItemHref = null"
    >
      <li
        v-for="item in navItemData.main"
        :key="item.href"
        :data-href="item.href"
        :class="[item.cssName, { 'is-active': isActiveItem(item.href), 'is-hovered': hoveredItemHref === item.href }]"
        @mouseenter="hoveredItemHref = item.href ?? null"
      >
        <NuxtLink
          :href="item.href"
          :external="item.isExternal || undefined"
          class="tab-nav-link"
          data-nav-item
        >
          <Icon v-if="item.iconName" :name="item.iconName" aria-hidden="true" />
          {{ item.text }}
        </NuxtLink>
      </li>
      <li aria-hidden="true" role="none" class="nav-indicator-li"><div class="nav__hovered"></div></li>
      <li aria-hidden="true" role="none" class="nav-indicator-li"><div class="nav__active-indicator"></div></li>
    </ul>

    <InputButtonCore
      v-if="showCollapsed"
      class="tab-nav-burger"
      :class="{ 'is-open': isMenuOpen }"
      variant="tertiary"
      :button-text="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
      :aria-expanded="String(isMenuOpen)"
      aria-controls="tab-nav-panel"
      @click="toggleMenu"
    >
      <template #iconOnly>
        <span class="burger-bar" aria-hidden="true"></span>
        <span class="burger-bar" aria-hidden="true"></span>
        <span class="burger-bar" aria-hidden="true"></span>
      </template>
    </InputButtonCore>

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
      id="tab-nav-panel"
      class="tab-nav-panel"
      :class="{ 'is-open': isMenuOpen }"
      :inert="!isMenuOpen ? true : undefined"
    >
      <div class="tab-nav-panel-inner">
        <ul class="tab-nav-panel-list">
          <li v-for="item in navItemData.main" :key="item.href" :class="item.cssName">
            <NuxtLink
              :href="item.href"
              :external="item.isExternal || undefined"
              class="tab-nav-panel-link"
              @click="closeMenu"
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
}

const props = withDefaults(defineProps<Props>(), {
  navAlign: "left",
  styleClassPassthrough: () => [],
});

const { navRef, navListRef, isCollapsed, isLoaded, isMenuOpen, isActiveItem, toggleMenu, closeMenu } =
  useNavCollapse("tab-nav-loaded");

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
    --_backdrop-bg: var(--tab-nav-backdrop-bg, oklch(0% 0 0 / 55%));
    --_backdrop-blur: var(--tab-nav-backdrop-blur, 3px);
    --_backdrop-duration: var(--tab-nav-backdrop-duration, 350ms);

    position: fixed;
    inset: 0;
    z-index: 10;
    background: var(--_backdrop-bg);
    backdrop-filter: blur(var(--_backdrop-blur));
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--_backdrop-duration) ease;

    &.is-open {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .tab-navigation {
    /* ─── Public token API ────────────────────────────────────────────── */

    /* Decorators — horizontal nav */
    --_decorator-hovered-bg: var(--tab-nav-decorator-hovered-bg, transparent);
    --_decorator-indicator-color: var(--tab-nav-decorator-indicator-color, var(--slate-01, currentColor));

    /* Horizontal nav */
    --_link-color: var(--tab-nav-link-color, var(--slate-01, currentColor));
    --_link-hover-color: var(--tab-nav-link-hover-color, var(--slate-04, var(--_link-color)));
    --_link-active-color: var(--tab-nav-link-active-color, var(--slate-01, var(--_link-color)));
    --_link-size: var(--tab-nav-link-size, 1.6rem);
    --_link-tracking: var(--tab-nav-link-tracking, 0.06em);
    --_link-weight: var(--tab-nav-link-weight, 400);
    --_nav-gap: var(--tab-nav-gap, 2.2rem);
    --_nav-transition: var(--tab-nav-transition, 250ms ease);

    /* Panel */
    --_panel-bg: var(--tab-nav-panel-bg, var(--page-bg, #1a1614));
    --_panel-border-color: var(
      --tab-nav-panel-border-color,
      color-mix(in oklch, var(--slate-01, #c0847a) 35%, transparent)
    );
    --_panel-item-border: var(--tab-nav-panel-item-border, color-mix(in oklch, var(--slate-01, white) 8%, transparent));
    --_panel-link-color: var(--tab-nav-panel-link-color, var(--slate-01, currentColor));
    --_panel-link-hover-color: var(--tab-nav-panel-link-hover-color, var(--slate-04, var(--_panel-link-color)));
    --_panel-link-active-color: var(--tab-nav-panel-link-active-color, var(--slate-01, var(--_panel-link-color)));
    --_panel-padding-block: var(--tab-nav-panel-padding-block, 1.4rem);
    --_panel-padding-inline: var(--tab-nav-panel-padding-inline, 1.5rem);
    --_panel-slide-duration: var(--tab-nav-panel-slide-duration, 350ms);
    --_panel-slide-easing: var(--tab-nav-panel-slide-easing, cubic-bezier(0.4, 0, 0.2, 1));

    /* Burger */
    --_burger-bar-width: var(--tab-nav-burger-width, 22px);
    --_burger-bar-height: var(--tab-nav-burger-height, 1.5px);
    --_burger-bar-gap: var(--tab-nav-burger-gap, 5px);
    --_burger-color: var(--tab-nav-burger-color, var(--slate-01, currentColor));
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
      gap: var(--_nav-gap);
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
        text-wrap: nowrap;
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

        &.router-link-exact-active {
          color: var(--_link-active-color);
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

    /* ─── Burger button (InputButtonCore) ──────────────────────────── */

    .tab-nav-burger.input-button-core.icon-only {
      margin-inline-start: auto;
      color: var(--_burger-color);

      /* Strip all InputButtonCore visual styling */
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
      width: var(--_burger-bar-width);
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
        border-block-start-color: var(--_panel-border-color);
      }

      .tab-nav-panel-inner {
        overflow: hidden;
        background-color: var(--_panel-bg);
      }

      .tab-nav-panel-list {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          border-block-end: 1px solid var(--_panel-item-border);

          &:last-child {
            border-block-end: none;
          }

          &:hover {
            background-color: color-mix(in oklch, var(--slate-01, white) 5%, transparent);
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
          padding-block: var(--_panel-padding-block);
          padding-inline: var(--_panel-padding-inline);
          position: relative;
          z-index: 1;
          transition: color var(--_nav-transition);

          &:hover,
          &:focus-visible {
            color: var(--_panel-link-hover-color);
            outline: none;
          }

          &.router-link-exact-active {
            color: var(--_panel-link-active-color);
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
    background-color: var(--tab-nav-decorator-indicator-color, var(--slate-01, currentColor));
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
