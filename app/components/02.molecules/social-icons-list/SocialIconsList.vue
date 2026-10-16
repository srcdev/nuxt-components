<template>
  <ul class="social-icons-list" :class="[elementClasses]" role="list" :aria-label="label">
    <li v-for="entry in entries" :key="entry.key" class="social-icons-list-item" :style="brandStyle(entry.item)">
      <a
        :href="entry.href"
        class="social-icons-list-link"
        :aria-label="linkLabel(entry.item)"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="social-icons-list-icon-wrapper" aria-hidden="true">
          <slot name="icon" :item="entry.item">
            <Icon :name="entry.item.iconName" class="social-icons-list-icon" />
          </slot>
        </span>
        <span v-if="hasLabel()" class="social-icons-list-label">
          <slot name="label" :item="entry.item">{{ entry.item.networkName }}</slot>
        </span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ISocialIcon, SocialIconsListSlots } from "~/types/components/social-icons-list.d";

interface Props {
  items: ISocialIcon[];
  label?: string;
  linkLabelTemplate?: string;
  showLabel?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  label: "Social media profiles",
  linkLabelTemplate: "{network} profile (opens in a new tab)",
  showLabel: false,
  styleClassPassthrough: () => [],
});

const slots = defineSlots<SocialIconsListSlots>();

const SAFE_HREF = /^(https?:|mailto:|tel:|\/(?!\/))/i;

const entries = computed(() =>
  props.items.flatMap((item, index) => {
    const href = `${item.baseHref}${item.profileId}`.trim();
    if (!SAFE_HREF.test(href)) {
      if (import.meta.dev) console.warn(`[SocialIconsList] Skipped "${item.networkName}": unsafe href "${href}".`);
      return [];
    }
    return [{ item, href, key: `${index}-${item.networkName}` }];
  })
);

const hasLabel = () => props.showLabel || !!slots.label;

const brandStyle = (item: ISocialIcon) =>
  item.brandColour ? { "--social-icons-list-brand-colour": item.brandColour } : undefined;

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

    .social-icons-list-item {
      display: flex;
      min-inline-size: 0;

      .social-icons-list-link {
        display: flex;
        align-items: center;
        gap: var(--social-icons-list-link-gap, 0.8rem);
        min-inline-size: 0;
        padding: var(--social-icons-list-link-padding, 0);
        border: var(--social-icons-list-link-border, none);
        border-radius: var(--social-icons-list-link-radius, 0);
        background: var(--social-icons-list-link-background, transparent);
        box-shadow: var(--social-icons-list-link-shadow, none);
        color: var(--social-icons-list-label-colour, currentColor);
        text-decoration: none;
        transition:
          transform 200ms ease,
          opacity 200ms ease,
          background-color 200ms ease,
          box-shadow 200ms ease;

        &:hover,
        &:focus-visible {
          transform: scale(var(--social-icons-list-hover-scale, 1.15));
          opacity: var(--social-icons-list-hover-opacity, 0.85);
          background: var(--social-icons-list-link-background-hover, var(--social-icons-list-link-background, transparent));
          box-shadow: var(--social-icons-list-link-shadow-hover, var(--social-icons-list-link-shadow, none));

          @media (prefers-reduced-motion: reduce) {
            transform: none;
          }

          .social-icons-list-icon {
            color: var(--social-icons-list-icon-colour-hover, var(--social-icons-list-icon-colour, currentColor));
          }
        }

        &:focus-visible {
          outline: 2px solid var(--social-icons-list-focus-ring-colour, var(--theme-ring, currentColor));
          outline-offset: 3px;
        }

        .social-icons-list-icon-wrapper {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          box-sizing: content-box;
          inline-size: 1em;
          block-size: 1em;
          padding: var(--social-icons-list-icon-wrapper-padding, 0);
          border: var(--social-icons-list-icon-wrapper-border, none);
          border-radius: var(--social-icons-list-icon-wrapper-radius, 0);
          background: var(--social-icons-list-icon-wrapper-background, transparent);
          font-size: var(--social-icons-list-icon-size, 2.4rem);
        }

        .social-icons-list-icon {
          color: var(--social-icons-list-icon-colour, currentColor);
          transition: color 200ms ease;
        }

        .social-icons-list-label {
          min-inline-size: 0;
          overflow-wrap: anywhere;
          font-size: var(--social-icons-list-label-font-size, var(--step-4, 1.6rem));
          font-weight: var(--social-icons-list-label-font-weight, 600);
        }
      }
    }
  }
}
</style>
