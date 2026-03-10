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
export interface NavItem {
  text: string;
  href?: string;
  isExternal?: boolean;
  iconName?: string;
  cssName?: string;
}

export interface NavItemData {
  [key: string]: NavItem[];
}

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
    --_border-block-start-size: 0;
    --_border-block-end-size: 3px;

    --_active-link-colour: lime;

    anchor-name: --active-nav;

    background-color: var(--page-bg);

    &::after {
      content: "";
      border-block-start: var(--_border-block-start-size) solid transparent;
      border-block-end: var(--_border-block-end-size) solid transparent;

      background:
        radial-gradient(var(--page-bg)) padding-box,
        radial-gradient(var(--_active-link-colour), transparent) border-box;

      /* background:
        radial-gradient(ellipse at 50% 100%, transparent 10%, var(--page-bg) 75%) padding-box,
        radial-gradient(ellipse at 50% 100%, var(--_active-link-colour) 10%, transparent 75%) border-box; */

      position: absolute;
      position-anchor: --active-nav;

      left: calc(anchor(left) - 40px);
      right: calc(anchor(right) - 40px);
      top: anchor(top --nav-ul);
      bottom: anchor(bottom --nav-ul);

      pointer-events: none;
      z-index: -1;

      opacity: 0;
      transition:
        inset 300ms,
        opacity 700ms;
      transition-delay: 700ms, 0ms;
    }

    .navigation-horizontal-list {
      anchor-name: --nav-ul;

      border-block-start: var(--_border-block-start-size) solid hsl(0 0% 100% / 0.2);
      border-block-end: var(--_border-block-end-size) solid hsl(0 0% 100% / 0.2);

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
        padding: 2rem;
        gap: 3rem;

        display: flex;
        justify-content: center;
      }

      a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;

        border-radius: 0.2rem;
        /* border: 2px solid hsl(0 0 100% / 0.25); */
        border-bottom: 2px solid transparent;
        background: hsl(0 0 20%);
        transition: background-color 300ms;
      }

      a:is(:hover, :focus) {
        /* background: var(--_active-link-colour); */
        border-color: var(--_active-link-colour);
        box-shadow: 0 0 32px oklch(from var(--_active-link-colour) l c h / 0.5);
      }
    }
  }
}
</style>
