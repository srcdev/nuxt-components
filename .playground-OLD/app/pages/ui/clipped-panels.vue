<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Clipped Panels</h1>
        </LayoutRow>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Rectangle</h2>
          <ClippedPanel variant="rectangle">
            <template #default>
              <p>Clipped Panels Rectangle</p>
            </template>
          </ClippedPanel>
        </LayoutRow>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Square</h2>
          <ClippedPanel variant="square">
            <template #default>
              <p>Clipped Panels Square</p>
            </template>
          </ClippedPanel>
        </LayoutRow>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Circle</h2>
          <div class="counter-panel">
            <div class="counter-panel__counter">1</div>
            <div class="counter-panel__title">Title</div>
            <div class="counter-panel__content">This will be the content</div>
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
  title: "Browser title tag",
  meta: [
    {
      name: "description",
      content: "Meta description content",
    },
  ],
})
</script>

<style scoped lang="css">
.counter-panel {
  display: inline-grid;
  grid-template-areas: "select-stack";

  aspect-ratio: 1;
  width: 200px;

  &:before {
    content: "";
    grid-area: select-stack;
    background-color: red;

    aspect-ratio: 1;
    width: 200px;
    /* clip-path: path(
      'M 10, 40 L 30, 40 A 10, 10, 0, 0, 0 40, 30 L 40, 10 A 10, 10, 0, 0, 1 50, 0 L 190, 0 A 10, 10, 0, 0, 1 200, 10 L 200, 190 A 10, 10, 0, 0, 1 190, 200 L 10, 200 A 10, 10, 0, 0, 1 0, 190 L 0, 50 A 10, 10, 0, 0, 1 10, 40 Z'
    ); */
    clip-path: path(
      "M 10, 40 L 20, 40 A 20, 20, 0, 0, 0 40, 20 L 40, 10 A 10, 10, 0, 0, 1 50, 0 L 190, 0 A 10, 10, 0, 0, 1 200, 10 L 200, 190 A 10, 10, 0, 0, 1 190, 200 L 10, 200 A 10, 10, 0, 0, 1 0, 190 L 0, 50 A 10, 10, 0, 0, 1 10, 40 Z"
    );
  }

  .counter-panel__counter {
    grid-area: select-stack;
    display: flex;
    justify-self: start;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: black;
    border-radius: 50%;
    border: 5px solid red;
    aspect-ratio: 1;
    width: 30px;
  }

  .counter-panel__title {
    grid-area: select-stack;
    display: flex;
    justify-self: center;
  }

  .counter-panel__content {
    grid-area: select-stack;
    align-content: center;
  }
}
</style>
