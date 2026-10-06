<template>
  <nav v-if="visibleItems.length" class="breadcrumb" :class="[elementClasses]" :aria-label="ariaLabel">
    <ol class="breadcrumb__list">
      <li v-for="(item, index) in visibleItems" :key="`${item.label}-${index}`" class="breadcrumb__item">
        <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb__link">{{ item.label }}</NuxtLink>
        <span v-else class="breadcrumb__label" :aria-current="index === visibleItems.length - 1 ? 'page' : undefined">{{
          item.label
        }}</span>
        <span v-if="separator && index < visibleItems.length - 1" class="breadcrumb__separator" aria-hidden="true">{{ separator }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "~/types/components/breadcrumb";

interface Props {
  items: BreadcrumbItem[];
  separator?: string;
  /** aria-label on the nav landmark — override for localisation. */
  ariaLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  separator: "/",
  ariaLabel: "Breadcrumb",
  styleClassPassthrough: () => [],
});

// Blank labels would render an empty crumb with a dangling separator.
const visibleItems = computed(() => props.items.filter((item) => item.label?.trim()));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .breadcrumb {
    --_gap: var(--breadcrumb-gap, 0.8rem);
    --_colour: var(--breadcrumb-colour, currentColor);

    font-size: var(--breadcrumb-font-size, 1.3rem);
    text-transform: var(--breadcrumb-text-transform, uppercase);
    letter-spacing: var(--breadcrumb-letter-spacing, 0.05em);

    .breadcrumb__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--_gap);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: var(--_gap);
      min-inline-size: 0;
    }

    .breadcrumb__link,
    .breadcrumb__label {
      color: var(--_colour);
      min-inline-size: 0;
      overflow-wrap: anywhere;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: var(--breadcrumb-item-line-clamp, none);
      line-clamp: var(--breadcrumb-item-line-clamp, none);
    }

    .breadcrumb__label[aria-current="page"] {
      color: var(--breadcrumb-colour-current, var(--breadcrumb-colour, currentColor));
    }

    .breadcrumb__link {
      text-decoration: none;

      &:hover,
      &:focus-visible {
        text-decoration: var(--breadcrumb-link-decoration-hover, underline);
      }
    }

    .breadcrumb__separator {
      flex-shrink: 0;
      color: var(--_colour);
      opacity: 0.6;
    }
  }
}
</style>
