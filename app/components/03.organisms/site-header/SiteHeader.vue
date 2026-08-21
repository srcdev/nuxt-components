<template>
  <PageRow tag="div" :variant="pageRowVariant" :style-class-passthrough="styleClassPassthrough">
    <template #default>
      <header class="site-header">
        <nav class="home-navigation" aria-label="Home Navigation">
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
import type { ResponsiveHeaderProp } from "../../../types/components";
import PageRow from "../../01.atoms/page-row/PageRow.vue";
import SkipLinks from "../../skip-links/SkipLinks.vue";
import ResponsiveHeader from "../../responsive-header/ResponsiveHeader.vue";

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
});

const slots = useSlots();
</script>

<style lang="css">
@layer components {
  /* ─── Public CSS tokens ─────────────────────────────────────────────────
     Override on the consumer's scope class (via styleClassPassthrough).
     Nested --responsive-header-* / --overflow-nav-* tokens still apply —
     forward a scope class via navStyleClassPassthrough to reach them.

     --site-header-gap             (default: 2.4rem)
     --site-header-padding-inline  (default: 2.4rem)
     --site-header-padding-block   (default: 0px)
     --site-header-bg              (default: transparent)
     --site-header-position        (default: static)
     --site-header-sticky-offset   (default: 0px)
     --site-header-z-index         (default: 9)
  ──────────────────────────────────────────────────────────────────────── */

  .site-header {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: var(--site-header-gap, 2.4rem);
    padding-block: var(--site-header-padding-block, 0px);
    padding-inline: var(--site-header-padding-inline, 2.4rem);
    background-color: var(--site-header-bg, transparent);
    position: var(--site-header-position, static);
    top: var(--site-header-sticky-offset, 0px);
    z-index: var(--site-header-z-index, 9);
    width: 100%;
  }
}
</style>
