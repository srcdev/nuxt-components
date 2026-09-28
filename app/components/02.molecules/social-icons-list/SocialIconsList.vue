<template>
  <ul class="social-icons-list" :class="[elementClasses]" :aria-label="label">
    <li v-for="item in items" :key="item.networkName" class="social-icon-item">
      <a
        :href="`${item.baseHref}${item.profileId}`"
        class="social-icon-link"
        :aria-label="linkLabel(item)"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icon :name="item.iconName" class="social-icon" aria-hidden="true" />
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ISocialIcon } from "~/types/components/social-icons-list.d";

interface Props {
  items: ISocialIcon[];
  label?: string;
  linkLabelTemplate?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  label: "Social media profiles",
  linkLabelTemplate: "{network} profile (opens in a new tab)",
  styleClassPassthrough: () => [],
});

const linkLabel = (item: ISocialIcon) => item.label ?? props.linkLabelTemplate.replace("{network}", item.networkName);

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
  .social-icons-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--social-icons-list-gap, 1.2rem);
    list-style: none;
    padding: 0;
    margin: 0;

    .social-icon-item {
      display: flex;

      .social-icon-link {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition:
          transform 200ms ease,
          opacity 200ms ease;

        &:hover,
        &:focus-visible {
          transform: scale(var(--social-icons-list-hover-scale, 1.15));
          opacity: var(--social-icons-list-hover-opacity, 0.85);

          @media (prefers-reduced-motion: reduce) {
            transform: none;
          }
        }

        &:focus-visible {
          outline: 2px solid var(--theme-ring, currentColor);
          outline-offset: 3px;
          border-radius: 2px;
        }

        .social-icon {
          font-size: var(--social-icons-list-icon-size, 2.4rem);
        }
      }
    }
  }
}
</style>
