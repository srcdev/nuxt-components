<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Profile Section</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ProfileSection
            :profile-picture="{
              src: '/images/services/service-balayage.jpg',
              alt: 'Profile picture of Natasha, the mobile hairdresser in Bath',
            }"
            :profile-info-count="3"
          >
            <template #eyebrowText>
              <EyebrowText tag="p" font-size="large" text-content="About Natasha" :style-class-passthrough="['mb-0']" />
            </template>
            <template #heroText="{ headingId }">
              <HeroText
                :id="headingId"
                tag="h2"
                axis="vertical"
                font-size="display"
                :text-content="[
                  { text: 'Your', styleClass: 'normal' },
                  { text: 'mobile hairdresser', styleClass: 'accent' },
                  { text: 'in Bath', styleClass: 'normal' },
                ]"
                :style-class-passthrough="['mb-20']"
              />
            </template>

            <template #profile-info-1>
              <p class="page-body-medium experience">
                With over 10 years' experience, I offer a range of professional and luxurious, one-to-one hairdressing
                services - from beautiful blow-drys to classy colours and cuts.
              </p>
            </template>

            <template #profile-info-2>
              <p class="page-body-normal location">
                Welcome to your trusted mobile hairdresser in Bath, offering expert hair services in the comfort of your
                own home. Whether you're based in the heart of Bath or in nearby areas like
                <span class="highlight">Lansdown</span>
                ,
                <span class="highlight">Widcombe</span>
                , or
                <span class="highlight">Oldfield Park</span>
                , I bring high-quality, salon-style hairdressing directly to you.
              </p>
            </template>

            <template #profile-info-3>
              <p class="page-body-normal services">
                From
                <NuxtLink to="/ui/services/services-section/balayage" class="highlight">balayage</NuxtLink>
                ,
                <NuxtLink to="/ui/services/services-section/highlights" class="highlight">highlights</NuxtLink>
                , and
                <NuxtLink to="/ui/services/services-section/lowlights" class="highlight">lowlights</NuxtLink>
                to precision cuts and stylish blow-dries, I provide a full range of personalised hair services without
                the need to step outside. Perfect for busy schedules, home comfort, or anyone who prefers a one-on-one
                hair experience - wherever you are in Bath.
              </p>
            </template>

            <template #profileLinks>
              <InputButtonCore
                variant="secondary"
                button-text="View all services"
                href="/ui/services/services-card"
                :style-class-passthrough="['mbs-0']"
              >
                <template #right>
                  <Icon name="mdi:arrow-right" class="icon" />
                </template>
              </InputButtonCore>
            </template>
          </ProfileSection>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "ColourFinder",
  meta: [
    {
      name: "description",
      content: "ColourFinder Meta description content",
    },
  ],
  bodyAttrs: {
    class: "profile-section-page",
  },
});
</script>

<style lang="css">
.profile-section-page {
  .profile-section {
    max-inline-size: 800px;
    margin-inline: auto;
  }
}
</style>
