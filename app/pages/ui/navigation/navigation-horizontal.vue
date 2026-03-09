<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Navigation Horizontal</h2>
          <p class="page-body-medium">This navigation has a reflective glow effect</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <NavigationHorizontal :nav-item-data="navItemData" />
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { NavItemData } from "~/components/02.molecules/navigation/navigation-horizontal/NavigationHorizontal.vue";
definePageMeta({
  layout: false,
});

useHead({
  title: "Navigation Horizontal",
  meta: [
    {
      name: "description",
      content: "Navigation Horizontal Meta description content",
    },
  ],
  bodyAttrs: {
    class: "navigation-horizontal-page",
  },
});

const navItemData: NavItemData = {
  main: [
    { text: "Home", href: "#", isExternal: true, iconName: "home", cssName: "home-link" },
    { text: "About", href: "#", isExternal: true, iconName: "info", cssName: "about-link" },
    { text: "Services", href: "#", isExternal: true, iconName: "services", cssName: "services-link" },
    { text: "Contact", href: "#", isExternal: true, iconName: "contact", cssName: "contact-link" },
  ],
};
</script>

<style lang="css">
.navigation-horizontal-page {
  /* CSS styles */
}
</style>
