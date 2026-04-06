<template>
  <div class="snav-demo-page">
    <h1>Contact</h1>
    <p>This is the Contact page. The active indicator in the navigation above should be sitting under "Contact".</p>

    <div class="snav-demo-split">
      <div class="snav-demo-split__text">
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you. Whether you have a question about our services, want to book an appointment, or just want to say hello — our door is always open.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <h3>Opening Hours</h3>
        <ul>
          <li>Monday – Friday: 9am – 7pm</li>
          <li>Saturday: 9am – 5pm</li>
          <li>Sunday: Closed</li>
        </ul>
        <h3>Address</h3>
        <p>123 Example Street<br />London, UK<br />EC1A 1BB</p>
      </div>
      <NuxtImg src="/images/rotating-carousel/55-woman-garden-backdrop.webp" alt="Contact hero" width="600" height="800" loading="eager" class="snav-demo-split__img" />
    </div>

    <h2>Find Us</h2>
    <div class="snav-demo-grid snav-demo-grid--wide">
      <NuxtImg src="/images/rotating-carousel/image-5.webp" alt="Location 1" width="800" height="500" loading="lazy" class="snav-demo-img" />
      <NuxtImg src="/images/rotating-carousel/image-6.webp" alt="Location 2" width="800" height="500" loading="lazy" class="snav-demo-img" />
    </div>

    <h2>Instagram</h2>
    <div class="snav-demo-grid">
      <NuxtImg v-for="n in [1, 2, 3, 7, 8, 9]" :key="n" :src="`/images/rotating-carousel/image-${n}.webp`" :alt="`Instagram post ${n}`" width="600" height="600" loading="lazy" class="snav-demo-img snav-demo-img--square" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "site-navigation-demo" });
useHead({ title: "SiteNavigation Demo — Contact" });
</script>
