<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['display-details-section', 'mbe-20']">
          <h1 class="heading-2">Details element - Unlinked</h1>
          <p class="mbe-12">Following 2 details block behave independantly.</p>

          <DisplayDetailsCore id="details-1" name="details-1" :animation-duration="200" icon-size="medium" :style-class-passthrough="['custom-style-1']">
            <template #summary>
              <h3 class="heading-3 m-8">Details header 1 (Fast)</h3>
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

          <DisplayDetailsCore id="details-2" name="details-2" :animation-duration="2000" icon-size="medium" :style-class-passthrough="['custom-style-2']">
            <template #summary>
              <h3 class="heading-3 m-8">Details header 2 (Slow)</h3>
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

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['display-details-section', 'mbe-20', 'hidden']">
          <h2 class="heading-2">Details element - Linked</h2>
          <p class="mbe-12">Details panels are linked, only 1 can be open at a time.</p>

          <DisplayDetailsCore :id="useId()" name="details-linked" icon-size="medium" :style-class-passthrough="['linked']">
            <template #summary>
              <h3 class="heading-3 m-8">Details header 1</h3>
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

          <DisplayDetailsCore :id="useId()" name="details-linked" icon-size="medium" :style-class-passthrough="['linked']">
            <template #summary>
              <h3 class="heading-3 m-8">Details header 2</h3>
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
    &.custom-style-1 {
      border: 1px solid blue;
      outline: 1px solid green;
      box-shadow: 2px 2px 2px light-dark(#000, #fff);
      border-radius: 10px;
      --_display-details-mbe: 1em;

      .display-details-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }

    &.custom-style-2 {
      border: 1px solid pink;
      outline: 1px solid yellow;
      box-shadow: 2px 2px 2px light-dark(#000, #fff);
      border-radius: 10px;
      --_display-details-mbe: 1em;

      .display-details-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }
    &.linked {
      border: 1px solid blue;
      outline: 1px solid grey;
      box-shadow: 2px 2px 2px light-dark(#000, #fff);
      border-radius: 10px;
      --_display-details-mbe: 1em;

      .display-details-summary {
        gap: 0;
        flex-direction: row;
      }
    }
  }
}
</style>
