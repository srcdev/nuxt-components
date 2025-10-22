<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Mask Element</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :style-class-passthrough="['test-mask-element', 'mbe-20']">
          <div class="mask-element-wrapper">
            <div class="mask-element-outer">
              <!-- Content will go here -->
            </div>
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
  title: "Mask Element",
  meta: [
    {
      name: "description",
      content: "Mask Element Meta description content",
    },
  ],
  bodyAttrs: {
    class: "mask-element-page",
  },
})
</script>

<style lang="css">
.mask-element-page {
  /* CSS styles */
  --_background-image: url("/images/rotating-carousel/image-2.webp");
  --_background-position: 0 0;

  background-image: var(--_background-image);
  background-size: cover;
  background-position: var(--_background-position);
  background-attachment: fixed;

  .test-mask-element {
    position: relative;
    margin-top: 200px;

    .mask-element-wrapper {
      --_thick-border-width: 8px;
      --_thick-border-radius: 8px;

      width: 250px;
      height: 70px;
      position: absolute;
      inset-inline-start: 50%;
      transform: translateX(-50%);

      .mask-element-outer {
        width: 100%;
        height: 100%;

        border: 0.1 solid var(--orange-8);

        border-start-start-radius: 8px;
        border-end-start-radius: 8px;
        border-start-end-radius: 4px;
        border-end-end-radius: 4px;

        background-color: var(--orange-8);

        padding-inline-start: var(--_thick-border-width);
        /* background-color: transparent; */

        /* position: relative; */
        isolation: isolate;
        z-index: 1;

        &::before {
          content: "";
          position: absolute;
          inset-block: 1px;
          inset-inline: var(--_thick-border-width) 1px;
          border-start-start-radius: 8px;
          border-end-start-radius: 8px;
          border-start-end-radius: 4px;
          border-end-end-radius: 4px;

          z-index: -2;
          overflow: hidden;
          background-color: black;
          /* background-color: rgba(0, 0, 0, 0.75); */
          /* background-color: transparent; */
          /* background-color: var(--orange-8); */
          /* clip-path: inset(0 0 0 8px); */
          /* display: none; */

          /* mask-image: linear-gradient(
            to right,
            black 6px,
            transparent 7px
          ); */
        }

        &::after {
          content: "";
          position: absolute;
          inset-block: 1px;
          inset-inline: var(--_thick-border-width) 1px;
          border-start-start-radius: 8px;
          border-end-start-radius: 8px;
          border-start-end-radius: 4px;
          border-end-end-radius: 4px;

          z-index: 2;
          overflow: hidden;
          background-color: black;
          /* background-color: rgba(0, 0, 0, 0.75); */
          /* background-color: transparent; */
          /* background-color: var(--orange-8); */
          /* clip-path: inset(0 0 0 8px); */
          display: none;

          /* mask-image: linear-gradient(
            to right,
            black 6px,
            transparent 7px
          ); */
        }
      }
    }
  }
}
</style>
