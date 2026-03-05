<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Profile Section</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ContactSection tag="section" :style-class-passthrough="['mbe-20']">
            <template #indicator-0>
              <Icon name="lucide-map-pin" class="indicator-icon" />
            </template>
            <template #item-0>
              <div>
                <HeroHeading
                  tag="h2"
                  axis="horizontal"
                  font-size="smaller"
                  :text-content="[{ text: 'Location', styleClass: 'normal' }]"
                  :style-class-passthrough="['mbe-20']"
                />

                <p class="page-body-normal">
                  Mobile service across Bath — Weston, Lansdown, Larkhall, Oldfield Park &amp; surrounding areas.
                </p>
              </div>
            </template>

            <template #indicator-1>
              <Icon name="lucide-phone" class="indicator-icon" />
            </template>
            <template #item-1>
              <div>
                <HeroHeading
                  tag="h2"
                  axis="horizontal"
                  font-size="smaller"
                  :text-content="[{ text: 'Contact', styleClass: 'normal' }]"
                  :style-class-passthrough="['mbe-20']"
                />
                <p class="page-body-normal">
                  Call or text to arrange your home appointment. Evening and weekend slots available.
                </p>
              </div>
            </template>

            <template #indicator-2>
              <Icon name="lucide-clock" class="indicator-icon" />
            </template>
            <template #item-2>
              <div>
                <HeroHeading
                  tag="h2"
                  axis="horizontal"
                  font-size="smaller"
                  :text-content="[{ text: 'Hours', styleClass: 'normal' }]"
                  :style-class-passthrough="['mbe-20']"
                />
                <p class="page-body-normal">
                  Monday
                  <em>to</em>
                  Sunday
                  <br />
                  <em>between</em>
                  9:00 AM
                  <em>and</em>
                  7:00 PM
                  <br />
                  Flexible by arrangement
                  <br />
                  Sunday appointments available on request and a premium.
                </p>
              </div>
            </template>
          </ContactSection>
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
  title: "Contact Section",
  meta: [
    {
      name: "description",
      content: "Contact Section Meta description content",
    },
  ],
  bodyAttrs: {
    class: "contact-section-page",
  },
});
</script>

<style lang="css">
.contact-section-page {
  .contact-section {
    max-inline-size: 800px;
    margin-inline: auto;
  }
}
</style>
