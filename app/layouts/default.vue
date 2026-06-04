<template>
  <div class="page-layout">
    <PageRow tag="div" variant="full" :style-class-passthrough="['header']">
      <template #default>
        <header class="responsive-header">
          <nav class="home-navigation" aria-label="Home Navigation">
            <SkipLinks>
              <template #homeLink>
                <NuxtLink to="/" class="home-link">
                  SRCDEV
                  <span>components</span>
                </NuxtLink>
              </template>
            </SkipLinks>
          </nav>
          <ResponsiveHeader
            :responsive-nav-links
            :gap-between-first-and-second-nav="12"
            :style-class-passthrough="['site-header-nav']"
            :overflow-details-summary-icons="{
              more: 'gravity-ui:ellipsis',
              burger: 'gravity-ui:bars',
            }"
            :collapse-at-main-nav-intersection="false"
            :allow-expand-on-gesture="false"
          >
            <template #secondaryNavigation>
              <ul class="secondary-navigation-list">
                <li class="secondary-navigation-item">
                  <NuxtLink class="secondary-navigation-link" to="/">
                    <Icon name="material-symbols:settings-outline-rounded" class="icon" aria-hidden="true" />
                    <span class="sr-only">Settings</span>
                  </NuxtLink>
                </li>
              </ul>
            </template>
          </ResponsiveHeader>
        </header>
      </template>
    </PageRow>
    <PageRow id="main-content" class="main-content" tag="main" variant="full" :is-landmark="true">
      <template #default>
        <slot name="layout-content">Page content goes here</slot>
      </template>
    </PageRow>
    <PageRow id="footer-content" tag="footer" variant="full" :is-landmark="true">
      <template #default>
        <p>Footer content here</p>
      </template>
    </PageRow>
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveHeaderProp } from "~/types/components";

const responsiveNavLinks = {
  firstNav: [
    {
      name: "Components",
      iconName: "material-symbols:widgets",
      childLinksTitle: "UI Components",
      childLinks: [
        { name: "Wipe Away Vertical", path: "/ui/wipe-away-vertical" },
        { name: "Scroll Reveal Image", path: "/ui/scroll-reveal-image" },
        { name: "Tooltips", path: "/ui/tooltips" },
        { name: "Marquee Scroller", path: "/ui/marquee-scroller" },
        { name: "Banner", path: "/ui/display-banner" },
        { name: "Banner Video", path: "/banner-video" },
        { name: "Section Parallax", path: "/ui/section-parallax" },
        { name: "Animated SVG Text", path: "/ui/animated-svg-text" },
        { name: "Carousel (Basic)", path: "/ui/carousel-basic" },
        { name: "Carousel (Infinite)", path: "/ui/carousel-infinite" },
        { name: "Carousel (Flip)", path: "/ui/carousel-flip" },
        { name: "Slider Gallery", path: "/ui/slider-gallery" },
        { name: "Container Glow", path: "/ui/container-glow" },
        { name: "Accordian", path: "/ui/accordian" },
        { name: "Display Details", path: "/ui/display-details" },
        { name: "Card Core", path: "/ui/card-core" },
        { name: "Glowing Border", path: "/ui/glowing-border" },
        { name: "Display Toast", path: "/ui/display-toast" },
        { name: "Masked Alert", path: "/ui/mask-element" },
        { name: "Expanding Panel", path: "/ui/expanding-panel" },
        { name: "Dialogs", path: "/ui/display-dialog" },
        { name: "Tabs X", path: "/ui/tabs" },
        { name: "Tabs Y", path: "/ui/tabs-y" },
        { name: "Prompts", path: "/ui/display-prompt" },
        { name: "Rotating Carousel", path: "/ui/rotating-carousel" },
        { name: "Clipped Panels", path: "/ui/clipped-panels" },
        { name: "Display Chip", path: "/ui/display-chip" },
        { name: "Display Avatar", path: "/ui/display-avatar" },
        { name: "Display Pill", path: "/ui/display-pill" },
        { name: "Qr Codes", path: "/ui/qr-code/display" },
        { name: "Anchor Scroll", path: "/ui/anchor-scroll" },
        { name: "Anchor Scroll (TabNavigation)", path: "/ui/anchor-scroll-tab-navigation" },
      ],
    },
    {
      name: "Layouts",
      iconName: "material-symbols:responsive-layout",
      childLinksTitle: "UI Layouts",
      childLinks: [
        { name: "Block Decorators", path: "/ui/block-decorators" },
        { name: "Navigation Horizontal", path: "/ui/navigation/navigation-horizontal" },
        { name: "Site Navigation", path: "/ui/navigation/site-navigation" },
        { name: "Tab Navigation", path: "/ui/navigation/tab-navigation" },
        { name: "Deep Expanding Menu", path: "/ui/deep-expanding-menu" },
        { name: "Magnetic Navigation", path: "/ui/magnetic-navigation" },
        { name: "Page Row", path: "/ui/page-row" },
        { name: "Layout Grid A", path: "/ui/layout-grid-a" },
        { name: "Layout Grid B", path: "/ui/layout-grid-b" },
        { name: "Simple Grid", path: "/ui/simple-grid" },
        { name: "Masonry Grid Simple", path: "/ui/masonry-grid" },
        { name: "Masonry Grid Sorted", path: "/ui/masonry-grid-sorted" },
        { name: "Masonry Grid Ordered", path: "/ui/masonry-grid-ordered" },
        { name: "Masonry Columns", path: "/ui/masonry-columns" },
        { name: "Page Hero Highlights", path: "/page-hero-highlights" },
      ],
    },
    {
      name: "Forms",
      iconName: "material-symbols:custom-typography",
      childLinksTitle: "Forms & Inputs",
      childLinks: [
        { name: "Buttons", path: "/forms/examples/buttons" },
        { name: "Example Form", path: "/forms/examples/material/text-fields" },
        { name: "Example Form", path: "/forms/examples/material/text-fields" },
      ],
    },
    {
      name: "Typography",
      iconName: "material-symbols:custom-typography",
      childLinksTitle: "Typography",
      childLinks: [
        { name: "Hero Text", path: "/typography/hero-text" },
        { name: "Page Headings", path: "/typography/page-heading" },
        { name: "Page Body", path: "/typography/page-body" },
        { name: "Page Links", path: "/typography/page-link" },
      ],
    },
  ],
  secondNav: [
    { name: "Some other link", iconName: "material-symbols:widgets", path: "#link-description" },
    {
      name: "Help",
      childLinksTitle: "Find Help",
      childLinks: [
        { name: "FAQs", path: "#" },
        { name: "Contact Us", path: "#" },
        { name: "Logout", path: "#" },
      ],
    },
    {
      name: "Account",
      childLinksTitle: "Manage Your Account",
      childLinks: [
        { name: "Your Profile", path: "#" },
        { name: "Settings", path: "/ui/settings" },
        { name: "Logout", path: "#" },
      ],
    },
  ],
} as ResponsiveHeaderProp;

// *** COLOR SCHEME INITIALIZATION ***
onMounted(() => {
  const getSystemPreference = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyColorScheme = (scheme: string) => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("system", "dark", "light");

    // If scheme is "system", use the actual system preference
    const actualScheme = scheme === "system" ? getSystemPreference() : scheme;
    htmlElement.classList.add(actualScheme);
  };

  // Listen for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    const storedValue = localStorage.getItem("useSettingsStore");
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      // Only update if user has "system" selected
      if (parsed.colourScheme === "system") {
        applyColorScheme("system");
      }
    }
  };

  mediaQuery.addEventListener("change", handleSystemChange);

  try {
    const storedValue = localStorage.getItem("useSettingsStore");

    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      applyColorScheme(parsed.colourScheme || "system");
    } else {
      // For new users, detect and apply system preference
      const systemPreference = getSystemPreference();
      applyColorScheme(systemPreference);
    }
  } catch {
    // Fallback to system preference
    const systemPreference = getSystemPreference();
    applyColorScheme(systemPreference);
  }
});
</script>
<style lang="css">
.page-layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  align-items: start;

  .main-content {
    container-type: inline-size;
  }
}

/* ─── Header row layout ─────────────────────────────────────────────────── */
.header {
  .debug-grid {
    display: none !important;
  }

  width: 100%;

  .responsive-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
    align-items: center;
    padding-block: 0;
    padding-inline: 24px;
    background-color: #000;

    position: relative;
    z-index: 9;

    width: 100%;

    .home-link {
      display: flex;
      flex-direction: column;
      text-wrap-mode: nowrap;
      font-size: var(--step-5);
      letter-spacing: 0.2em;
      color: var(--slate-00);
      text-decoration: none;

      span {
        font-size: var(--step-3);
        letter-spacing: initial;
      }

      &:hover {
        border-radius: 0.4rem;
        outline: 2px solid var(--green-08);
        outline-offset: 0.4rem;
      }
    }
  }
}

/* ─── ResponsiveHeader token overrides for this layout ──────────────────── */
.site-header-nav {
  --responsive-header-margin: 1.2rem;
  --responsive-header-bg: #efefef05;
  --responsive-header-border: 1px solid transparent;
  --responsive-header-border-radius: 0.8rem;
  --responsive-header-padding-block: 1rem;
  --responsive-header-padding-inline: 1.2rem;
  --responsive-header-max-height: 6.4rem;
  --responsive-header-inline-size: 100%;

  --responsive-header-color: var(--slate-00);
  --responsive-header-link-color: var(--slate-00);

  --responsive-header-sub-nav-bg: #000;
  --responsive-header-sub-nav-border: 1px solid #efefef75;

  --responsive-header-overflow-btn-bg: var(--slate-08);
  --responsive-header-overflow-btn-size: 3rem;
  --responsive-header-overflow-btn-border: 1px solid #ffffff90;
  --responsive-header-overflow-btn-outline: 1px solid #ffffff10;
  --responsive-header-overflow-btn-icon-color: var(--slate-00);
  --responsive-header-overflow-btn-hover-outline: 2px solid var(--green-08);

  --responsive-header-overflow-nav-bg: #000;
  --responsive-header-overflow-nav-border: 0.1rem solid #ffffff90;
  --responsive-header-overflow-nav-padding-block: 0;

  --overflow-nav-link-color: var(--slate-00);
  --overflow-nav-link-border-color: #efefef75;
  --overflow-nav-sub-item-color: var(--slate-00);
  --overflow-nav-sub-item-font-size: var(--step-4);

  --responsive-nav-decorator-indicator-color: var(--slate-00);
  --responsive-nav-decorator-hovered-indicator-color: var(--green-08);
  --responsive-nav-decorator-hovered-bg: oklch(100% 0 0 / 8%);
  --overflow-nav-decorator-indicator-color: var(--slate-00);
  --overflow-nav-decorator-hovered-indicator-color: var(--green-08);
  --overflow-nav-decorator-hovered-bg: oklch(100% 0 0 / 6%);
}
</style>
