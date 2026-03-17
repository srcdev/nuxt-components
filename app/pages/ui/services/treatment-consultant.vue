<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mb-20']">
          <EyebrowText font-size="large" text-content="Interactive tool" />
          <HeroText
            :tag="'h1'"
            font-size="display"
            axis="horizontal"
            :text-content="[
              { text: 'Find Your' },
              { text: 'Perfect Colour', styleClass: 'accent' },
              { text: ' & treatment' },
            ]"
            :style-class-passthrough="['mbe-20']"
          />
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <TreatmentConsultant :auto-advance="true" :allow-multiple-treatments="true" />
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
  title: "Treatment Consultant - ColourFinder",
  meta: [
    {
      name: "description",
      content: "Treatment Consultant Meta description content",
    },
  ],
  bodyAttrs: {
    class: "treatment-consultant-page",
  },
});
</script>

<style lang="css">
.treatment-consultant-page {
  .treatment-consultant {
    --_primary-color: var(--treatment-consultant-primary-colour);
    --_primary-foreground: var(--treatment-consultant-primary-foreground);
    --_background: var(--treatment-consultant-background);
    --_foreground: var(--treatment-consultant-foreground);
    --_muted: var(--treatment-consultant-muted-colour);
    --_muted-foreground: var(--treatment-consultant-muted-foreground);
    --_emerald: var(--emerald);
    --_amber: hsl(43 96% 56%);
    --_orange: hsl(25 95% 53%);
    --_red: hsl(0 84% 60%);
    --_transition-duration: 300ms;
    --_border-radius: 0.5rem;
    --_spacing-xs: 0.25rem;
    --_spacing-sm: 0.5rem;
    --_spacing-md: 1rem;
    --_spacing-lg: 1.5rem;
    --_spacing-xl: 2rem;
    --_spacing-2xl: 3rem;
    --_spacing-3xl: 4rem;
    --_font-display: var(--font-display);

    /* Page styles */
    margin-block-start: var(--_spacing-3xl);


    .treatment-consultant__container {
    }
  }
}
</style>
