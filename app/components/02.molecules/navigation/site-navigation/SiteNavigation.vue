<template>
  <nav
    ref="navRef"
    class="site-navigation"
    :class="[
      elementClasses,
      `site-navigation--${align}`,
      { 'is-collapsed': isCollapsed, 'is-loaded': isLoaded, 'menu-open': isMenuOpen },
    ]"
    aria-label="Site navigation"
  >
    <!--
      List stays in the DOM while not collapsed (or before first measurement)
      so we can measure its natural width. Once collapsed it's removed entirely —
      no hidden element occupying layout space.
    -->
    <ul
      v-if="!isCollapsed || !isLoaded"
      ref="navListRef"
      class="site-nav-list"
    >
      <li v-for="item in navItemData.main" :key="item.href" :class="item.cssName">
        <NuxtLink :href="item.href" :external="item.isExternal || undefined" class="site-nav-link">
          {{ item.text }}
        </NuxtLink>
      </li>
    </ul>

    <!-- Burger toggle — three lines animate to ✕ -->
    <InputButtonCore
      v-if="isCollapsed && isLoaded"
      class="site-nav-burger"
      :class="{ 'is-open': isMenuOpen }"
      variant="tertiary"
      :button-text="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
      :aria-expanded="String(isMenuOpen)"
      aria-controls="site-nav-panel"
      @click="toggleMenu"
    >
      <template #iconOnly>
        <span class="burger-bar" aria-hidden="true"></span>
        <span class="burger-bar" aria-hidden="true"></span>
        <span class="burger-bar" aria-hidden="true"></span>
      </template>
    </InputButtonCore>

    <!--
      Mobile drop panel.
      NOTE: position: absolute here is relative to the nearest positioned ancestor
      (e.g. .responsive-header), not .site-navigation, giving full header width.
      If this component is used inside a layout where the nearest positioned ancestor
      is not the header, a <Teleport> may be needed.
    -->
    <div
      v-if="isCollapsed && isLoaded"
      id="site-nav-panel"
      class="site-nav-panel"
      :class="{ 'is-open': isMenuOpen }"
      :inert="!isMenuOpen ? true : undefined"
    >
      <div class="site-nav-panel-inner">
        <ul class="site-nav-panel-list">
          <li v-for="item in navItemData.main" :key="item.href" :class="item.cssName">
            <NuxtLink
              :href="item.href"
              :external="item.isExternal || undefined"
              class="site-nav-panel-link"
              @click="closeMenu"
            >
              {{ item.text }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useResizeObserver, onClickOutside } from "@vueuse/core"
import type { NavItemData } from "~/types/components/navigation-horizontal.d"

interface Props {
  navItemData: NavItemData
  align?: "left" | "center" | "right"
  styleClassPassthrough?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  align: "left",
  styleClassPassthrough: () => [],
})

const navRef = ref<HTMLElement | null>(null)
const navListRef = ref<HTMLUListElement | null>(null)

const isCollapsed = ref(false)
const isLoaded = ref(false)
const isMenuOpen = ref(false)

// Stored natural width of the list — used when the list is not in the DOM
const navListNaturalWidth = ref(0)

const checkOverflow = () => {
  if (!navRef.value) return

  // Measure and store the list width whenever it's in the DOM
  if (navListRef.value) {
    navListNaturalWidth.value = navListRef.value.scrollWidth
  }

  isCollapsed.value = navListNaturalWidth.value > navRef.value.clientWidth
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Close panel on navigation
const route = useRoute()
watch(() => route.path, closeMenu)

useResizeObserver(navRef, () => {
  checkOverflow()
  if (!isCollapsed.value) closeMenu()
})

onClickOutside(navRef, closeMenu)

onMounted(async () => {
  await nextTick()
  checkOverflow()
  isLoaded.value = true
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
)
</script>

<style lang="css">
@layer components {
  .site-navigation {
    /* ─── Public token API ────────────────────────────────────────────── */

    /* Horizontal nav */
    --_link-color: var(--site-nav-link-color, var(--warm-01, currentColor));
    --_link-hover-color: var(--site-nav-link-hover-color, var(--rose-04, var(--_link-color)));
    --_link-active-color: var(--site-nav-link-active-color, var(--rose-05, var(--_link-color)));
    --_link-size: var(--site-nav-link-size, 1.6rem);
    --_link-tracking: var(--site-nav-link-tracking, 0.06em);
    --_link-weight: var(--site-nav-link-weight, 400);
    --_link-accent: var(--site-nav-link-accent, var(--rose-05, currentColor));
    --_nav-gap: var(--site-nav-gap, 2.5rem);
    --_nav-transition: var(--site-nav-transition, 250ms ease);

    /* Panel */
    --_panel-bg: var(--site-nav-panel-bg, var(--page-bg, #1a1614));
    --_panel-border-color: var(
      --site-nav-panel-border-color,
      color-mix(in oklch, var(--rose-05, #c0847a) 35%, transparent)
    );
    --_panel-item-border: var(--site-nav-panel-item-border, color-mix(in oklch, var(--warm-01, white) 8%, transparent));
    --_panel-link-color: var(--site-nav-panel-link-color, var(--warm-01, currentColor));
    --_panel-link-hover-color: var(--site-nav-panel-link-hover-color, var(--rose-04, var(--_panel-link-color)));
    --_panel-link-active-color: var(--site-nav-panel-link-active-color, var(--rose-05, var(--_panel-link-color)));
    --_panel-padding-block: var(--site-nav-panel-padding-block, 1.4rem);
    --_panel-padding-inline: var(--site-nav-panel-padding-inline, 1.5rem);
    --_panel-slide-duration: var(--site-nav-panel-slide-duration, 350ms);
    --_panel-slide-easing: var(--site-nav-panel-slide-easing, cubic-bezier(0.4, 0, 0.2, 1));

    /* Burger */
    --_burger-bar-width: var(--site-nav-burger-width, 22px);
    --_burger-bar-height: var(--site-nav-burger-height, 1.5px);
    --_burger-bar-gap: var(--site-nav-burger-gap, 5px);
    --_burger-color: var(--site-nav-burger-color, var(--warm-01, currentColor));
    --_burger-transition: var(--site-nav-burger-transition, 300ms ease);

    /* ─────────────────────────────────────────────────────────────────── */

    display: flex;
    align-items: center;
    min-width: 0;

    /* Hide everything until first measurement to prevent wrong-state flash */
    &:not(.is-loaded) {
      opacity: 0;
    }

    /* ─── Horizontal list ───────────────────────────────────────────── */

    .site-nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: var(--_nav-gap);
      align-items: center;

      .site-nav-link {
        display: block;
        color: var(--_link-color);
        font-size: var(--_link-size);
        font-weight: var(--_link-weight);
        letter-spacing: var(--_link-tracking);
        text-decoration: none;
        text-wrap: nowrap;
        padding-block: 0.4rem;
        border-block-end: 1px solid transparent;
        transition:
          color var(--_nav-transition),
          border-color var(--_nav-transition);

        &:hover,
        &:focus-visible {
          color: var(--_link-hover-color);
          outline: none;
          border-block-end-color: color-mix(in oklch, var(--_link-accent) 60%, transparent);
        }

        &.router-link-exact-active {
          color: var(--_link-active-color);
          border-block-end-color: var(--_link-accent);
        }
      }
    }

    /* ─── Alignment variants ────────────────────────────────────────── */

    &.site-navigation--center .site-nav-list {
      margin-inline: auto;
    }

    &.site-navigation--right .site-nav-list {
      margin-inline-start: auto;
    }

    &.is-collapsed {
      justify-content: end;
    }

    /* ─── Burger button (InputButtonCore) ──────────────────────────── */

    .site-nav-burger.input-button-core.icon-only {
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

      /* Override icon-only aspect-ratio and inner icon margin */
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

    .site-nav-burger.is-open {
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

    .site-nav-panel {
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

      .site-nav-panel-inner {
        overflow: hidden;
        background-color: var(--_panel-bg);
      }

      .site-nav-panel-list {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          border-block-end: 1px solid var(--_panel-item-border);

          &:last-child {
            border-block-end: none;
          }
        }

        .site-nav-panel-link {
          display: block;
          color: var(--_panel-link-color);
          font-size: var(--_link-size);
          font-weight: var(--_link-weight);
          letter-spacing: var(--_link-tracking);
          text-decoration: none;
          padding-block: var(--_panel-padding-block);
          padding-inline: var(--_panel-padding-inline);
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
}
</style>
