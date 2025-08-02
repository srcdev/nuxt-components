<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <h1 class="heading-2">Details element - Unlinked</h1>
          <p class="mbe-12">Following 2 details block behave independantly.</p>

          <ExpandingPanel :animation-duration="300" icon-size="medium" :style-class-passthrough="['custom-style-1']">
            <template #summary>
              <h3 class="heading-3 mb-2">Expander Panel 1 (Fast)</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>

          <ExpandingPanel :animation-duration="2000" icon-size="medium" :style-class-passthrough="['custom-style-2']">
            <template #summary>
              <h3 class="heading-3 mb-2">Expander Panel 2 (Slow)</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20', 'hidden']">
          <h2 class="heading-2">Details element - Linked</h2>
          <p class="mbe-12">Details panels are linked, only 1 can be open at a time.</p>

          <ExpandingPanel name="details-linked" icon-size="medium" :style-class-passthrough="['linked']">
            <template #summary>
              <h3 class="heading-3 mb-2">Details header 1</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>

          <ExpandingPanel name="details-linked" icon-size="medium" :style-class-passthrough="['linked']">
            <template #summary>
              <h3 class="heading-3 mb-2">Details header 2</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>
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
  title: 'Browser title tag',
  meta: [
    {
      name: 'description',
      content: 'Meta description content',
    },
  ],
});
</script>

<style lang="css">
.expanding-panel-section {
  .expanding-panel {
    + .expanding-panel {
      margin-block-start: 1rem;
    }
    &.custom-style-1 {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }

    &.custom-style-2 {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }
    &.linked {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row;
      }
    }
  }
}
</style>
