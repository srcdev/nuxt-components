<template>
  <PageRow tag="div" class="site-header-row" :variant="pageRowVariant" :style-class-passthrough="styleClassPassthrough">
    <template #default>
      <header class="site-header">
        <nav class="site-header-home-nav" :aria-label="homeNavAriaLabel">
          <SkipLinks>
            <template #homeLink>
              <slot name="branding"></slot>
            </template>
          </SkipLinks>
        </nav>
        <ResponsiveHeader
          :responsive-nav-links="responsiveNavLinks"
          :gap-between-first-and-second-nav="gapBetweenFirstAndSecondNav"
          :overflow-details-summary-icons="overflowDetailsSummaryIcons"
          :collapse-breakpoint="collapseBreakpoint"
          :collapse-at-main-nav-intersection="collapseAtMainNavIntersection"
          :allow-expand-on-gesture="allowExpandOnGesture"
          :style-class-passthrough="navStyleClassPassthrough"
          :main-nav-aria-label="mainNavAriaLabel"
          :secondary-nav-aria-label="secondaryNavAriaLabel"
          :overflow-menu-aria-label="overflowMenuAriaLabel"
          :overflow-button-label="overflowButtonLabel"
          :submenu-aria-label="submenuAriaLabel"
        >
          <template v-if="slots.secondaryNavigation" #secondaryNavigation>
            <slot name="secondaryNavigation"></slot>
          </template>
        </ResponsiveHeader>
      </header>
    </template>
  </PageRow>
</template>

<script setup lang="ts">
import type { ResponsiveHeaderProp } from "~/types/components";
import PageRow from "../../01.atoms/page-row/PageRow.vue";
import SkipLinks from "../../01.atoms/navigation/skip-links/SkipLinks.vue";
import ResponsiveHeader from "../responsive-header/ResponsiveHeader.vue";

interface Props {
  responsiveNavLinks?: ResponsiveHeaderProp;
  gapBetweenFirstAndSecondNav?: number;
  overflowDetailsSummaryIcons?: Record<string, string>;
  collapseBreakpoint?: number | null;
  collapseAtMainNavIntersection?: boolean;
  allowExpandOnGesture?: boolean;
  pageRowVariant?: "full" | "popout" | "content" | "inset-content";
  styleClassPassthrough?: string | string[];
  navStyleClassPassthrough?: string | string[];
  /** aria-label on the home/branding nav landmark — override for localisation. */
  homeNavAriaLabel?: string;
  /** Forwarded to ResponsiveHeader's mainNavAriaLabel — override for localisation. */
  mainNavAriaLabel?: string;
  /** Forwarded to ResponsiveHeader's secondaryNavAriaLabel — override for localisation. */
  secondaryNavAriaLabel?: string;
  /** Forwarded to ResponsiveHeader's overflowMenuAriaLabel — override for localisation. */
  overflowMenuAriaLabel?: string;
  /** Forwarded to ResponsiveHeader's overflowButtonLabel, the burger button's accessible name. */
  overflowButtonLabel?: string;
  /** Forwarded to ResponsiveHeader's submenuAriaLabel; {title} is replaced with the item's title. */
  submenuAriaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  responsiveNavLinks: () => ({}),
  gapBetweenFirstAndSecondNav: 12,
  overflowDetailsSummaryIcons: () => ({
    more: "gravity-ui:ellipsis",
    burger: "gravity-ui:bars",
  }),
  collapseBreakpoint: null,
  collapseAtMainNavIntersection: false,
  allowExpandOnGesture: true,
  pageRowVariant: "content",
  styleClassPassthrough: () => [],
  navStyleClassPassthrough: () => [],
  homeNavAriaLabel: "Home navigation",
  mainNavAriaLabel: "Main navigation",
  secondaryNavAriaLabel: "Secondary navigation",
  overflowMenuAriaLabel: "Overflow navigation menu",
  overflowButtonLabel: "More navigation",
  submenuAriaLabel: "{title} submenu",
});

const slots = useSlots();
</script>

<style lang="css">
@layer components {
  .site-header-row {
    position: var(--site-header-position, static);
    top: var(--site-header-sticky-offset, 0px);
    z-index: var(--site-header-z-index, 9);
  }

  .site-header {
    display: grid;
    grid-template-columns: fit-content(var(--site-header-branding-max-width, 50%)) minmax(0, 1fr);
    align-items: center;
    gap: var(--site-header-gap, 2.4rem);
    padding-block: var(--site-header-padding-block, 0px);
    padding-inline: var(--site-header-padding-inline, 2.4rem);
    background-color: var(--site-header-bg, transparent);
    width: 100%;
    min-inline-size: 0;

    .site-header-home-nav {
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }
  }
}
</style>
