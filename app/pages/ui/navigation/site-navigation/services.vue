<template>
  <div class="snav-demo-page">
    <h1>Services</h1>
    <p>This is the Services page. The active indicator in the navigation above should be sitting under "Services".</p>

    <NuxtImg
      src="/images/banners/banner-light-brunette.webp"
      alt="Services banner"
      width="1200"
      height="500"
      loading="eager"
      class="snav-demo-hero"
    />

    <h2>What We Offer</h2>
    <div class="snav-demo-services">
      <div v-for="(service, i) in services" :key="i" class="snav-demo-service-card">
        <NuxtImg :src="service.img" :alt="service.title" width="600" height="400" loading="lazy" class="snav-demo-img" />
        <div class="snav-demo-service-card__body">
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
        </div>
      </div>
    </div>

    <h2>Our Work</h2>
    <div class="snav-demo-grid">
      <NuxtImg v-for="n in [4, 5, 6, 7, 8, 9]" :key="n" :src="`/images/rotating-carousel/image-${n}.webp`" :alt="`Work sample ${n}`" width="600" height="400" loading="lazy" class="snav-demo-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "site-navigation-demo" });
useHead({ title: "SiteNavigation Demo — Services" });

const services = [
  { title: "Colour", img: "/images/rotating-carousel/image-1.webp", description: "From subtle highlights to bold transformations. Our colour specialists use only the finest products for vibrant, lasting results." },
  { title: "Cut & Style", img: "/images/rotating-carousel/image-2.webp", description: "Precision cuts tailored to your face shape and lifestyle. Walk out feeling confident every single time." },
  { title: "Treatment", img: "/images/rotating-carousel/image-3.webp", description: "Restore shine and health with our premium treatment range. Ideal for damaged, dry, or colour-treated hair." },
];
</script>
