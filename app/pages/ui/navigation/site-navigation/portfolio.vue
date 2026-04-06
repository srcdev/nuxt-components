<template>
  <div class="snav-demo-page">
    <h1>Portfolio</h1>
    <p>This is the Portfolio page. The active indicator in the navigation above should be sitting under "Portfolio". Maximum image load to stress-test navigation behaviour.</p>

    <h2>Spotlight Work</h2>
    <div class="snav-demo-grid snav-demo-grid--dense">
      <NuxtImg v-for="n in 9" :key="n" :src="`/images/rotating-carousel/image-${n}.webp`" :alt="`Portfolio piece ${n}`" width="600" height="600" loading="lazy" class="snav-demo-img snav-demo-img--square" />
    </div>

    <h2>Featured Looks</h2>
    <div class="snav-demo-grid snav-demo-grid--wide">
      <NuxtImg src="/images/banners/banner-ginger.jpeg" alt="Ginger look" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/banners/banner-light-brunette.webp" alt="Light brunette look" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/banners/banner-mid-brown.webp" alt="Mid brown look" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/rotating-carousel/35-light-brown-highlights.webp" alt="Light brown highlights" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/rotating-carousel/55-woman-garden-backdrop.webp" alt="Garden backdrop" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/rotating-carousel/indian-pink-stripe.webp" alt="Pink stripe" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/rotating-carousel/spanish-green-stripe.webp" alt="Green stripe" width="800" height="500" loading="lazy" class="snav-demo-img" />
    </div>

    <h2>Hero Series</h2>
    <div class="snav-demo-grid">
      <NuxtImg v-for="hero in ['hero-blonde', 'hero-dark', 'hero-hair', 'hero-red']" :key="hero" :src="`/images/page/hero/${hero}.jpg`" :alt="hero" width="600" height="400" loading="lazy" class="snav-demo-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "site-navigation-demo" });
useHead({ title: "SiteNavigation Demo — Portfolio" });
</script>

<style lang="css">
.snav-demo-img--square {
  aspect-ratio: 1 / 1;
}

.snav-demo-grid--dense {
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
}
</style>
