<template>
  <div class="snav-demo-page">
    <h1>Home</h1>
    <p>Welcome to the SiteNavigation component demo. Resize the window to see the burger menu collapse, and navigate between pages to see the active indicator update. This page is intentionally heavy with images to stress-test nav behaviour during loading.</p>

    <NuxtImg
      src="/images/banners/banner-ginger.jpeg"
      alt="Hero banner"
      width="1200"
      height="600"
      loading="eager"
      class="snav-demo-hero"
    />

    <h2>Featured Gallery</h2>
    <div class="snav-demo-grid">
      <NuxtImg v-for="n in 9" :key="n" :src="`/images/rotating-carousel/image-${n}.webp`" :alt="`Gallery image ${n}`" width="600" height="400" loading="lazy" class="snav-demo-img" />
    </div>

    <h2>More Images</h2>
    <div class="snav-demo-grid snav-demo-grid--wide">
      <NuxtImg src="/images/banners/banner-light-brunette.webp" alt="Banner light brunette" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/banners/banner-mid-brown.webp" alt="Banner mid brown" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/rotating-carousel/35-light-brown-highlights.webp" alt="Light brown highlights" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/rotating-carousel/55-woman-garden-backdrop.webp" alt="Woman garden backdrop" width="800" height="500" loading="lazy" class="snav-demo-img" />
    </div>

    <h2>Hero Images</h2>
    <div class="snav-demo-grid">
      <NuxtImg v-for="hero in ['hero-blonde', 'hero-dark', 'hero-hair', 'hero-red']" :key="hero" :src="`/images/page/hero/${hero}.jpg`" :alt="hero" width="600" height="400" loading="lazy" class="snav-demo-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "site-navigation-demo" });
useHead({ title: "SiteNavigation Demo — Home" });
</script>
