<template>
  <nav class="breadcrumb" :class="[elementClasses]" aria-label="Breadcrumb">
    <ol class="breadcrumb__list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="breadcrumb__item">
        <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb__link">{{ item.label }}</NuxtLink>
        <span v-else class="breadcrumb__label" :aria-current="index === items.length - 1 ? 'page' : undefined">{{
          item.label
        }}</span>
        <span v-if="index < items.length - 1" class="breadcrumb__separator" aria-hidden="true">{{ separator }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "~/types/components/breadcrumb";

interface Props {
  items: BreadcrumbItem[];
  separator?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  separator: "/",
  styleClassPassthrough: () => [],
});

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
    --_font-size: var(--breadcrumb-font-size, 1.3rem);
    --_gap: var(--breadcrumb-gap, 0.8rem);
    --_text-transform: var(--breadcrumb-text-transform, uppercase);
    --_letter-spacing: var(--breadcrumb-letter-spacing, 0.05em);
    --_colour: var(--breadcrumb-colour, currentColor);
    --_colour-current: var(--breadcrumb-colour-current, var(--breadcrumb-colour, currentColor));
    --_link-decoration-hover: var(--breadcrumb-link-decoration-hover, underline);

    font-size: var(--_font-size);
    text-transform: var(--_text-transform);
    letter-spacing: var(--_letter-spacing);

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
    }

    .breadcrumb__link,
    .breadcrumb__label {
      color: var(--_colour);
    }

    .breadcrumb__label[aria-current="page"] {
      color: var(--_colour-current);
    }

    .breadcrumb__link {
      text-decoration: none;

      &:hover,
      &:focus-visible {
        text-decoration: var(--_link-decoration-hover);
      }
    }

    .breadcrumb__separator {
      color: var(--_colour);
      opacity: 0.6;
    }
  }
}
</style>
