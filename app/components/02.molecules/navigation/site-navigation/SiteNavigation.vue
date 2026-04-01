<template>
  <nav
    ref="navRef"
    class="site-navigation"
    :class="[
      elementClasses,
      `site-navigation--${navAlign}`,
      { 'is-collapsed': isCollapsed, 'is-loaded': isLoaded, 'menu-open': isMenuOpen },
    ]"
    aria-label="Site navigation"
  >
    <ul
      v-if="!isCollapsed || !isLoaded"
      ref="navListRef"
      class="site-nav-list"
      @click="handleNavLinkClick"
      @mouseleave="resetHoverNavToActive"
      @mouseover="handleNavHover"
    >
      <li v-for="item in navItemData.main" :key="item.href" :class="item.cssName">
        <NuxtLink :href="item.href" :external="item.isExternal || undefined" class="site-nav-link" data-nav-item>
          <Icon v-if="item.iconName" :name="item.iconName" aria-hidden="true" />
          {{ item.text }}
        </NuxtLink>
      </li>
    </ul>

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

    <Teleport to="body">
      <div
        v-if="isCollapsed && isLoaded"
        class="site-nav-backdrop"
        :class="{ 'is-open': isMenuOpen }"
        aria-hidden="true"
        @click="closeMenu"
      />
    </Teleport>

    <div
      v-if="isCollapsed && isLoaded"
      id="site-nav-panel"
      class="site-nav-panel"
      :class="{ 'is-open': isMenuOpen }"
      :inert="!isMenuOpen ? true : undefined"
    >
      <div class="site-nav-panel-inner">
        <ul
          ref="panelListRef"
          class="site-nav-panel-list"
          @click="handlePanelLinkClick"
          @mouseover="handlePanelHover"
          @mouseleave="resetHoverPanelToActive"
        >
          <li v-for="item in navItemData.main" :key="item.href" :class="item.cssName">
            <NuxtLink
              :href="item.href"
              :external="item.isExternal || undefined"
              class="site-nav-panel-link"
              data-panel-nav-item
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
import { useResizeObserver, onClickOutside } from "@vueuse/core"
import type { NavItemData } from "srcdev-nuxt-components"

interface Props {
  navItemData: NavItemData
  navAlign?: "left" | "center" | "right"
  styleClassPassthrough?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  navAlign: "left",
  styleClassPassthrough: () => [],
})

const navRef = ref<HTMLElement | null>(null)
const navListRef = ref<HTMLUListElement | null>(null)

const isCollapsed = ref(false)
const isLoaded = useState("site-nav-loaded", () => false)
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

// ─── Nav decorators (active / hover indicators) ─────────────────────────────

const NAV_DECORATOR_DURATION = 200

// Single pending snap timer — cancel the previous one when a new move starts
let navSnapTimer: ReturnType<typeof setTimeout> | null = null
let panelSnapTimer: ReturnType<typeof setTimeout> | null = null

const currentActiveNavLink = ref<HTMLElement | null>(null)
const currentHoveredNavLink = ref<HTMLElement | null>(null)
const previousHoveredNavLink = ref<HTMLElement | null>(null)

const getNavLinks = () =>
  navListRef.value ? Array.from(navListRef.value.querySelectorAll<HTMLElement>("[data-nav-item]")) : []

const setFinalNavActivePositions = (instant = false) => {
  if (!navListRef.value || !currentActiveNavLink.value) return
  const list = navListRef.value
  const el = currentActiveNavLink.value
  list.style.setProperty("--_transition-duration", instant ? "0ms" : NAV_DECORATOR_DURATION + "ms")
  list.style.setProperty("--_x-active", el.offsetLeft + "px")
  list.style.setProperty("--_width-active", String(el.offsetWidth / list.offsetWidth))
}

const setFinalNavHoveredPositions = (instant = false) => {
  if (!navListRef.value || !currentHoveredNavLink.value) return
  const list = navListRef.value
  const el = currentHoveredNavLink.value
  list.style.setProperty("--_transition-duration", instant ? "0ms" : NAV_DECORATOR_DURATION + "ms")
  list.style.setProperty("--_x-hovered", el.offsetLeft + "px")
  list.style.setProperty("--_width-hovered", String(el.offsetWidth / list.offsetWidth))
}

const moveNavHoveredIndicator = () => {
  if (!navListRef.value || !currentHoveredNavLink.value || !previousHoveredNavLink.value) return
  const list = navListRef.value
  const curr = currentHoveredNavLink.value
  const prev = previousHoveredNavLink.value
  list.style.setProperty("--_transition-duration", NAV_DECORATOR_DURATION + "ms")
  const isMovingRight = prev.compareDocumentPosition(curr) === 4
  let transitionWidth: number
  if (isMovingRight) {
    transitionWidth = curr.offsetLeft + curr.offsetWidth - prev.offsetLeft
  } else {
    transitionWidth = prev.offsetLeft + prev.offsetWidth - curr.offsetLeft
    list.style.setProperty("--_x-hovered", curr.offsetLeft + "px")
  }
  list.style.setProperty("--_width-hovered", String(transitionWidth / list.offsetWidth))
  if (navSnapTimer !== null) clearTimeout(navSnapTimer)
  navSnapTimer = setTimeout(() => {
    navSnapTimer = null
    setFinalNavHoveredPositions()
  }, NAV_DECORATOR_DURATION + 20)
}

const handleNavLinkClick = (event: MouseEvent) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-nav-item]")
  if (!target) return
  currentActiveNavLink.value = target
  currentHoveredNavLink.value = target
  previousHoveredNavLink.value = target
}

const handleNavHover = (event: MouseEvent) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-nav-item]")
  if (!target || target === currentHoveredNavLink.value) return
  previousHoveredNavLink.value = currentHoveredNavLink.value
  currentHoveredNavLink.value = target
  moveNavHoveredIndicator()
}

const resetHoverNavToActive = () => {
  if (!currentActiveNavLink.value || currentHoveredNavLink.value === currentActiveNavLink.value) return
  previousHoveredNavLink.value = currentHoveredNavLink.value
  currentHoveredNavLink.value = currentActiveNavLink.value
  moveNavHoveredIndicator()
}

const initNavDecorators = () => {
  if (!navListRef.value) return
  const links = getNavLinks()
  if (!links.length) return

  // Cancel any in-flight snap timer before resetting positions
  if (navSnapTimer !== null) {
    clearTimeout(navSnapTimer)
    navSnapTimer = null
  }

  navListRef.value.querySelectorAll(".nav-indicator-li").forEach((el) => el.remove())

  const activeLink = links.find((el) => el.classList.contains("router-link-active")) ?? links[0]
  if (!activeLink) return

  currentActiveNavLink.value = activeLink
  currentHoveredNavLink.value = activeLink
  previousHoveredNavLink.value = activeLink

  setFinalNavActivePositions(true)
  setFinalNavHoveredPositions(true)

  // Wrap each indicator in a <li> so the <ul> contains only valid children
  ;["nav__active-indicator", "nav__active", "nav__hovered"].forEach((cls) => {
    const li = document.createElement("li")
    li.classList.add("nav-indicator-li")
    li.setAttribute("aria-hidden", "true")
    li.setAttribute("role", "none")
    const div = document.createElement("div")
    div.classList.add(cls)
    li.appendChild(div)
    navListRef.value!.appendChild(li)
  })
}

// ─── Panel decorators (y-axis active / hover indicators) ─────────────────────

const panelListRef = ref<HTMLUListElement | null>(null)

const currentActivePanelLink = ref<HTMLElement | null>(null)
const currentHoveredPanelLink = ref<HTMLElement | null>(null)
const previousHoveredPanelLink = ref<HTMLElement | null>(null)

const getPanelLinks = () =>
  panelListRef.value ? Array.from(panelListRef.value.querySelectorAll<HTMLElement>("[data-panel-nav-item]")) : []

const setFinalPanelActivePositions = (instant = false) => {
  if (!panelListRef.value || !currentActivePanelLink.value) return
  const list = panelListRef.value
  const el = currentActivePanelLink.value
  list.style.setProperty("--_panel-transition-duration", instant ? "0ms" : NAV_DECORATOR_DURATION + "ms")
  list.style.setProperty("--_panel-y-active", el.offsetTop + "px")
  list.style.setProperty("--_panel-height-active", String(el.offsetHeight / list.offsetHeight))
}

const setFinalPanelHoveredPositions = (instant = false) => {
  if (!panelListRef.value || !currentHoveredPanelLink.value) return
  const list = panelListRef.value
  const el = currentHoveredPanelLink.value
  list.style.setProperty("--_panel-transition-duration", instant ? "0ms" : NAV_DECORATOR_DURATION + "ms")
  list.style.setProperty("--_panel-y-hovered", el.offsetTop + "px")
  list.style.setProperty("--_panel-height-hovered", String(el.offsetHeight / list.offsetHeight))
}

const movePanelHoveredIndicator = () => {
  if (!panelListRef.value || !currentHoveredPanelLink.value || !previousHoveredPanelLink.value) return
  const list = panelListRef.value
  const curr = currentHoveredPanelLink.value
  const prev = previousHoveredPanelLink.value
  list.style.setProperty("--_panel-transition-duration", NAV_DECORATOR_DURATION + "ms")
  const isMovingDown = prev.compareDocumentPosition(curr) === 4
  let transitionHeight: number
  if (isMovingDown) {
    transitionHeight = curr.offsetTop + curr.offsetHeight - prev.offsetTop
  } else {
    transitionHeight = prev.offsetTop + prev.offsetHeight - curr.offsetTop
    list.style.setProperty("--_panel-y-hovered", curr.offsetTop + "px")
  }
  list.style.setProperty("--_panel-height-hovered", String(transitionHeight / list.offsetHeight))
  if (panelSnapTimer !== null) clearTimeout(panelSnapTimer)
  panelSnapTimer = setTimeout(() => {
    panelSnapTimer = null
    setFinalPanelHoveredPositions()
  }, NAV_DECORATOR_DURATION + 20)
}

const handlePanelLinkClick = (event: MouseEvent) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-panel-nav-item]")
  if (!target) return
  currentActivePanelLink.value = target
  currentHoveredPanelLink.value = target
  previousHoveredPanelLink.value = target
}

const handlePanelHover = (event: MouseEvent) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-panel-nav-item]")
  if (!target || target === currentHoveredPanelLink.value) return
  previousHoveredPanelLink.value = currentHoveredPanelLink.value
  currentHoveredPanelLink.value = target
  movePanelHoveredIndicator()
}

const resetHoverPanelToActive = () => {
  if (!currentActivePanelLink.value || currentHoveredPanelLink.value === currentActivePanelLink.value) return
  previousHoveredPanelLink.value = currentHoveredPanelLink.value
  currentHoveredPanelLink.value = currentActivePanelLink.value
  movePanelHoveredIndicator()
}

const initPanelDecorators = () => {
  if (!panelListRef.value) return
  const links = getPanelLinks()
  if (!links.length) return

  if (panelSnapTimer !== null) {
    clearTimeout(panelSnapTimer)
    panelSnapTimer = null
  }

  panelListRef.value.querySelectorAll(".nav-indicator-li").forEach((el) => el.remove())

  const activeLink = links.find((el) => el.classList.contains("router-link-active")) ?? links[0]
  if (!activeLink) return

  currentActivePanelLink.value = activeLink
  currentHoveredPanelLink.value = activeLink
  previousHoveredPanelLink.value = activeLink

  setFinalPanelActivePositions(true)
  setFinalPanelHoveredPositions(true)
  ;["nav__active-indicator", "nav__active", "nav__hovered"].forEach((cls) => {
    const li = document.createElement("li")
    li.classList.add("nav-indicator-li")
    li.setAttribute("aria-hidden", "true")
    li.setAttribute("role", "none")
    const div = document.createElement("div")
    div.classList.add(cls)
    li.appendChild(div)
    panelListRef.value!.appendChild(li)
  })
}

// ─────────────────────────────────────────────────────────────────────────────

// Close panel on navigation and re-init decorators.
// flush: 'post' ensures router-link-active classes are applied.
// requestAnimationFrame defers the measurement until after browser layout,
// preventing stale offsetLeft reads and racing with hover setTimeouts.
const route = useRoute()
watch(
  () => route.path,
  () => {
    closeMenu()
    requestAnimationFrame(() => {
      initNavDecorators()
    })
  },
  { flush: "post" }
)

useResizeObserver(navRef, () => {
  checkOverflow()
  if (!isCollapsed.value) closeMenu()
  setFinalNavActivePositions(true)
  setFinalNavHoveredPositions(true)
  setFinalPanelActivePositions(true)
  setFinalPanelHoveredPositions(true)
})

onClickOutside(navRef, closeMenu)

onMounted(async () => {
  await nextTick()
  checkOverflow()
  isLoaded.value = true
  await nextTick()
  initNavDecorators()
})

watch(isCollapsed, async (collapsed) => {
  if (!collapsed) {
    await nextTick()
    initNavDecorators()
  }
})

watch(isMenuOpen, async (open) => {
  if (open) {
    await nextTick()
    initPanelDecorators()
  }
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
)
</script>

<style lang="css">
@layer components {
  .site-nav-backdrop {
    --_backdrop-bg: var(--site-nav-backdrop-bg, oklch(0% 0 0 / 55%));
    --_backdrop-blur: var(--site-nav-backdrop-blur, 3px);
    --_backdrop-duration: var(--site-nav-backdrop-duration, 350ms);

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

  .site-navigation {
    /* ─── Public token API ────────────────────────────────────────────── */

    /* Decorators — horizontal nav */
    --_decorator-hovered-bg: transparent;
    --_decorator-active-bg: transparent;
    --_decorator-indicator-color: var(--site-nav-decorator-indicator-color, var(--rose-05, currentColor));

    /* Decorators — panel */
    --_panel-decorator-hovered-bg: var(--site-nav-panel-decorator-hovered-bg, transparent);
    --_panel-decorator-active-bg: var(--site-nav-panel-decorator-active-bg, transparent);
    --_panel-decorator-indicator-color: var(--site-nav-panel-decorator-indicator-color, var(--rose-05, currentColor));
    --_panel-indicator-left: var(--site-nav-panel-indicator-left, 0);
    --_panel-indicator-right: var(--site-nav-panel-indicator-right, auto);

    /* Horizontal nav */
    --_link-color: var(--site-nav-link-color, var(--warm-01, currentColor));
    --_link-hover-color: var(--site-nav-link-hover-color, var(--rose-04, var(--_link-color)));
    --_link-active-color: var(--site-nav-link-active-color, var(--rose-05, var(--_link-color)));
    --_link-size: var(--site-nav-link-size, 1.6rem);
    --_link-tracking: var(--site-nav-link-tracking, 0.06em);
    --_link-weight: var(--site-nav-link-weight, 400);
    --_link-accent: var(--site-nav-link-accent, var(--rose-05, currentColor));
    --_nav-gap: var(--site-nav-gap, 2.2rem);
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
      position: relative;

      .nav-indicator-li {
        position: absolute;
        inset: 0;
        pointer-events: none;
        list-style: none;
      }

      .nav__hovered,
      .nav__active,
      .nav__active-indicator {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        scale: var(--_width-hovered, 0.001) 1;
        translate: var(--_x-hovered, 0) 0;
        transform-origin: left;
        transition:
          scale var(--_transition-duration, 200ms),
          translate var(--_transition-duration, 200ms);
        pointer-events: none;
      }

      .nav__active {
        scale: var(--_width-active, 0.001) 1;
        translate: var(--_x-active, 0) 0;
      }

      .nav__active-indicator {
        scale: var(--_width-hovered, 0.001) 1;
        translate: var(--_x-hovered, 0) 0;
      }

      .nav__hovered {
        background: var(--_decorator-hovered-bg);
        border-radius: 4px;
        z-index: 1;
      }

      .nav__active {
        background: var(--_decorator-active-bg);
        border-radius: 4px;
        z-index: 2;
      }

      .nav__active-indicator {
        top: auto;
        height: 2px;
        background-color: var(--_decorator-indicator-color);
        z-index: 3;
      }

      .site-nav-link {
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

        &.router-link-active {
          color: var(--_link-active-color);
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
        position: relative;

        .nav-indicator-li {
          position: absolute;
          inset: 0;
          pointer-events: none;
          list-style: none;
        }

        .nav__hovered,
        .nav__active,
        .nav__active-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          scale: 1 var(--_panel-height-hovered, 0.001);
          translate: 0 var(--_panel-y-hovered, 0);
          transform-origin: top;
          transition:
            scale var(--_panel-transition-duration, 200ms),
            translate var(--_panel-transition-duration, 200ms);
          pointer-events: none;
        }

        .nav__active {
          scale: 1 var(--_panel-height-active, 0.001);
          translate: 0 var(--_panel-y-active, 0);
        }

        .nav__active-indicator {
          left: var(--_panel-indicator-left, 0);
          right: var(--_panel-indicator-right, auto);
          width: 2px;
        }

        .nav__hovered {
          background: var(--_panel-decorator-hovered-bg);
          z-index: 1;
        }

        .nav__active {
          background: var(--_panel-decorator-active-bg);
          z-index: 2;
        }

        .nav__active-indicator {
          background: var(--_panel-decorator-indicator-color);
          z-index: 3;
        }

        li {
          border-block-end: 1px solid var(--_panel-item-border);

          &:last-child {
            border-block-end: none;
          }
        }

        .site-nav-panel-link {
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
          z-index: 4;
          transition: color var(--_nav-transition);

          &:hover,
          &:focus-visible {
            color: var(--_panel-link-hover-color);
            outline: none;
          }

          &.router-link-active {
            color: var(--_panel-link-active-color);
          }
        }
      }
    }
  }
}
</style>
