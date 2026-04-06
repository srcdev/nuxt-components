<template>
  <div class="snav-demo-page">
    <h1>About</h1>
    <p>This is the About page. The active indicator in the navigation above should be sitting under "About". Lots of images below to simulate a content-heavy page.</p>

    <div class="snav-demo-split">
      <div class="snav-demo-split__text">
        <h2>Our Story</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h2>Our Team</h2>
        <p>We are a team of dedicated professionals committed to delivering the best experience. Our combined expertise spans design, development, and user experience research.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
      </div>
      <NuxtImg src="/images/rotating-carousel/image-1.webp" alt="About hero" width="600" height="800" loading="eager" class="snav-demo-split__img" />
    </div>

    <h2>Gallery</h2>
    <div class="snav-demo-grid">
      <NuxtImg v-for="n in 9" :key="n" :src="`/images/rotating-carousel/image-${n}.webp`" :alt="`About gallery ${n}`" width="600" height="400" loading="lazy" class="snav-demo-img" />
    </div>

    <h2>Behind the scenes</h2>
    <div class="snav-demo-grid snav-demo-grid--wide">
      <NuxtImg src="/images/banners/banner-ginger.jpeg" alt="Behind the scenes 1" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/banners/banner-mid-brown.webp" alt="Behind the scenes 2" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/page/hero/hero-dark.jpg" alt="Behind the scenes 3" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/page/hero/hero-red.jpg" alt="Behind the scenes 4" width="800" height="500" loading="lazy" class="snav-demo-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "site-navigation-demo" });
useHead({ title: "SiteNavigation Demo — About" });
</script>
