<template>
  <nav class="navigation-horizontal" :class="[elementClasses]">
    <component :is="tag" class="navigation-horizontal-list">
      <li v-for="(item, index) in navItemData.main" :key="index" :class="item.cssName">
        <NuxtLink :href="item.href" :external="item.isExternal ? true : undefined">
          <Icon v-if="item.iconName" :name="`icon-${item.iconName}`" />
          {{ item.text }}
        </NuxtLink>
      </li>
    </component>
  </nav>
</template>

<script setup lang="ts">
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

interface Props {
  tag?: "ol" | "ul" | "div";
  navItemData: NavItemData;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "ul",
  styleClassPassthrough: () => [],
});

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    updateElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .navigation-horizontal {
    /* ─── Public token API ─────────────────────────────────────────── */

    /* Colours */
    --_nav-canvas-colour: var(--page-bg);
    --_active-link-colour: var(--nav-active-colour, lime);
    --_link-colour: var(--nav-link-colour, light-dark(hsl(0 0% 10%), hsl(0 0% 100%)));
    --_link-bg: var(--nav-link-bg, light-dark(hsl(0 0% 88%), hsl(0 0% 20%)));
    --_border-colour: var(--nav-border-colour, light-dark(hsl(0 0% 0% / 0.15), hsl(0 0% 100% / 0.2)));

    /* Borders */
    --_border-block-start-size: var(--nav-border-start, 0);
    --_border-block-end-size: var(--nav-border-end, 3px);

    /* Layout */
    --_list-padding: var(--nav-list-padding, 2rem);
    --_list-gap: var(--nav-list-gap, 1rem);
    --_link-padding-block: var(--nav-link-padding-block, 0.5rem);
    --_link-padding-inline: var(--nav-link-padding-inline, 1rem);
    --_link-border-radius: var(--nav-link-border-radius, 0.2rem);

    /* Glow effect */
    --_glow-pos-x: var(--nav-glow-pos-x, 50%);
    --_glow-pos-y: var(--nav-glow-pos-y, 100%);
    --_glow-inner-stop: var(--nav-glow-inner-stop, 10%);
    --_glow-outer-stop: var(--nav-glow-outer-stop, 75%);
    --_glow-size: var(--nav-glow-size, 32px);
    --_glow-opacity: var(--nav-glow-opacity, 0.5);
    --_anchor-offset: var(--nav-anchor-offset, 40px);

    /* Animation */
    --_transition-duration: var(--nav-transition-duration, 300ms);

    /* ─────────────────────────────────────────────────────────────── */

    anchor-name: --active-nav;

    background-color: var(--_nav-canvas-colour);

    &::after {
      content: "";
      border-block-start: var(--_border-block-start-size) solid transparent;
      border-block-end: var(--_border-block-end-size) solid transparent;

      background:
        radial-gradient(
            ellipse at var(--_glow-pos-x) var(--_glow-pos-y),
            transparent var(--_glow-inner-stop),
            var(--page-bg) var(--_glow-outer-stop)
          )
          padding-box,
        radial-gradient(
            ellipse at var(--_glow-pos-x) var(--_glow-pos-y),
            var(--_active-link-colour) var(--_glow-inner-stop),
            transparent var(--_glow-outer-stop)
          )
          border-box;

      position: absolute;
      position-anchor: --active-nav;

      left: calc(anchor(left) - var(--_anchor-offset));
      right: calc(anchor(right) - var(--_anchor-offset));
      top: anchor(top --nav-ul);
      bottom: anchor(bottom --nav-ul);

      pointer-events: none;
      z-index: -1;

      opacity: 0;
      transition:
        inset var(--_transition-duration),
        opacity 700ms;
      transition-delay: 700ms, 0ms;
    }

    .navigation-horizontal-list {
      anchor-name: --nav-ul;

      border-block-start: var(--_border-block-start-size) solid var(--_border-colour);
      border-block-end: var(--_border-block-end-size) solid var(--_border-colour);

      a:is(:hover, :focus) {
        anchor-name: --active-nav;
      }
    }

    &:has(a:hover, a:focus)::after {
      opacity: 1;
      transition-delay: 0ms, 0ms;
    }
  }

  @layer general-styling {
    .navigation-horizontal {
      .navigation-horizontal-list {
        list-style: none;
        margin: 0rem;
        padding: var(--_list-padding);
        gap: var(--_list-gap);

        display: flex;
        justify-content: center;
      }

      a {
        color: var(--_link-colour);
        text-decoration: none;
        padding: var(--_link-padding-block) var(--_link-padding-inline);

        border-radius: var(--_link-border-radius);
        border-bottom: 2px solid transparent;
        background: var(--_link-bg);
        transition: background-color var(--_transition-duration);
      }

      a:is(:hover, :focus) {
        border-color: var(--_active-link-colour);
        box-shadow: 0 0 var(--_glow-size) oklch(from var(--_active-link-colour) l c h / var(--_glow-opacity));
      }
    }
  }
}
</style>
