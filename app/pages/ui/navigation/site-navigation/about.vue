<template>
  <div>
    <h1>About</h1>
    <p>This is the About page. The active indicator in the navigation above should be sitting under "About".</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "site-navigation-demo" });
useHead({ title: "SiteNavigation Demo — About" });
</script>
