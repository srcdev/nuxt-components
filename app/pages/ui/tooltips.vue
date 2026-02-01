<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :styleClassPassthrough="['tooltips-page-row', 'mbe-20']">
          <h1 class="page-heading-2">Tooltips</h1>
          <button @click.prevent="restartGuide" :disabled="isGuideRunning">
            {{ isGuideRunning ? "Guide running..." : "Run guide again?" }}
          </button>
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Full Track (1fr)</h2>

          <div ref="tooltipGuide">
            <DisplayTooltipDefined
              :contentText="{
                tooltipTitle: {
                  tag: 'h3',
                  text: 'Defined Tooltip Title',
                },
                tooltipContent: {
                  tag: 'p',
                  text: 'This is the content for the defined tooltip component.',
                },
                tooltipAction: {
                  tag: 'p',
                  text: 'Step 1 of 5',
                },
              }"
              :style-class-passthrough="['mbe-20']"
            >
              <template #triggerContent>Trigger From Tooltip Defined</template>
            </DisplayTooltipDefined>

            <DisplayTooltip tooltip-id="profile-setup-tooltip" :style-class-passthrough="['mbe-20']">
              <template #triggerContent>Complete your profile setup for personalized recommendations.</template>
              <template #tooltipContent>
                <div class="custom-tooltip-slot-content">
                  <div class="title subtitle-sm">
                    Adding your personal information, preferences, and interests helps us provide better recommendations
                    and tailor your experience to your specific needs and goals.
                  </div>
                  <div class="body popover-action">
                    <button
                      popovertarget="profile-setup-tooltip"
                      popovertargetaction="hide"
                      class="display-tooltip-close-button"
                      aria-label="Close tool tip"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </template>
            </DisplayTooltip>
          </div>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: "UI Tooltips - Nuxt Components",
  meta: [{ name: "description", content: "Examples of Tooltips in Nuxt Components" }],
  // bodyAttrs: {
  //   class: "home",
  // },
})

const hideTooltipTrigger = ref(false)
const tooltipGuide = useTemplateRef<HTMLElement | null>("tooltipGuide")

// Use the tooltip guide composable
const { isGuideRunning, restartGuide } = useTooltipsGuide(tooltipGuide, {
  autoStart: true,
  startDelay: 2000,
})
</script>

<style lang="css">
.tooltips-page-row {
  .custom-tooltip-slot-content {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .title {
      color: var(--nuxt-text-primary);
    }

    .body {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
