<template>
  <div class="home-link-navigation">
    <div v-if="slots.homeLink" class="home-link">
      <slot name="homeLink"></slot>
    </div>
    <nav class="skip-links-nav" aria-label="Skip navigation">
      <a ref="skipLink" href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#footer-content" class="skip-link">Skip to footer</a>
    </nav>
  </div>
</template>

<script lang="ts" setup>
const slots = useSlots();
</script>

<style lang="css">
@layer components {
  .home-link-navigation {
    position: relative;

    .skip-links-nav {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;

      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      background-color: black;
      border: 1px solid white;
      padding: 0.2rem;
      margin: 0;

      /* Hidden off-screen via transform — does NOT break keyboard focusability */
      opacity: 0;
      transform: translateY(-100%);
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;

      &:focus-within {
        opacity: 1;
        transform: translateY(0);
      }

      .skip-link {
        display: block;
        color: white;
        text-decoration: none;
        padding: 0.8rem 1.2rem;
        text-wrap: nowrap;

        &:focus-visible {
          outline: 2px solid white;
        }
      }
    }
  }
}
</style>
