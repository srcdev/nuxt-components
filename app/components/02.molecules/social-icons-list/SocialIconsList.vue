<template>
  <ul class="social-icons-list" :class="[elementClasses]" :aria-label="label">
    <li v-for="item in items" :key="item.networkName" class="social-icon-item">
      <a
        :href="`${item.baseHref}${item.profileId}`"
        class="social-icon-link"
        :aria-label="`${item.networkName} profile`"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icon
          :name="item.iconName"
          class="social-icon"
          :style="{ width: 'var(--_icon-size)', height: 'var(--_icon-size)' }"
        />
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ISocialIcon } from "~/types/components/social-icons-list.d";

interface Props {
  items: ISocialIcon[];
  label?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  label: "Social media profiles",
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
  .social-icons-list {
    --_icon-size: var(--theme-social-icon-size, 2.4rem);
    --_gap: var(--theme-social-icon-gap, 1.2rem);

    display: flex;
    flex-wrap: wrap;
    gap: var(--_gap);
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
          transform: scale(1.15);
          opacity: 0.85;
        }

        &:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 3px;
          border-radius: 2px;
        }

        .social-icon {
          /* width: var(--_icon-size); */
          /* height: var(--_icon-size); */
        }
      }
    }
  }
}
</style>
