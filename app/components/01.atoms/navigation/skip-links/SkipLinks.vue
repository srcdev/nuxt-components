<template>
  <div class="skip-links" :class="[elementClasses]">
    <div v-if="$slots.homeLink" class="skip-links__home">
      <slot name="homeLink"></slot>
    </div>
    <nav class="skip-links__nav" :aria-label="ariaLabel">
      <a v-for="link in links" :key="link.href" :href="link.href" class="skip-links__link">{{ link.label }}</a>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import type { SkipLink } from "~/types/components"

interface Props {
  links?: SkipLink[]
  /** aria-label on the nav landmark — override for localisation. */
  ariaLabel?: string
  styleClassPassthrough?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#footer-content", label: "Skip to footer" },
  ],
  ariaLabel: "Skip navigation",
  styleClassPassthrough: () => [],
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
@layer components {
  .skip-links {
    position: relative;

    .skip-links__nav {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: var(--skip-links-z-index, 1000);

      display: flex;
      flex-direction: column;
      gap: var(--skip-links-gap, 0.2rem);
      background-color: var(--skip-links-background-colour, black);
      border: var(--skip-links-border-width, 1px) solid var(--skip-links-border-colour, white);
      padding: var(--skip-links-padding, 0.2rem);
      margin: 0;

      /* Hidden off-screen via transform — does NOT break keyboard focusability */
      opacity: 0;
      transform: translateY(-100%);
      transition:
        transform var(--skip-links-transition-duration, 0.3s) ease-in-out,
        opacity var(--skip-links-transition-duration, 0.3s) ease-in-out;

      &:focus-within {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .skip-links__link {
      display: block;
      color: var(--skip-links-text-colour, white);
      text-decoration: none;
      padding: var(--skip-links-link-padding-block, 0.8rem) var(--skip-links-link-padding-inline, 1.2rem);
      text-wrap: nowrap;

      &:focus-visible {
        outline: var(--skip-links-focus-outline-width, 2px) solid var(--skip-links-focus-outline-colour, white);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skip-links .skip-links__nav {
      transition: none;
    }
  }
}
</style>
