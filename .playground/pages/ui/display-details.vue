<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :styleClassPassthrough="['display-details-section', 'mbe-20']">
          <h2 class="heading-2"></h2>

          <DisplayDetailsCore name="details-1" id="details-1" iconSize="medium" :styleClassPassthrough="['mbe-20']">
            <template #summary>
              <h3 class="heading-3 m-8">Details header</h3>
            </template>
            <template #summaryIcon>
              <Icon name="bi:caret-down-fill" class="icon mi-12" />
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
          </DisplayDetailsCore>
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
.display-details-section {
  .display-details {
    border: var(--accordian-panel-border);
    border-radius: var(--accordian-panel-border-radius);
    margin-block-end: var(--accordian-panel-mbe);

    .display-details-summary {
      gap: 0;
      flex-direction: row-reverse;
    }

    .display-details-content {
      padding: 12px;
    }
  }
}
</style>
