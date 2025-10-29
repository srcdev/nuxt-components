<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Mask Element</h2>

          <div class="test-mask-element">
            <AlertMaskCore
              :config="{
                color: 'var(--orange-8)',
                radiusLeft: 12,
                radiusRight: 4,
                borderLeft: 12,
                borderTop: 1,
                borderRight: 1,
                borderBottom: 1,
              }"
              :style-class-passthrough="['test-alert']"
            >
              <div class="some-local-class">
                <p>Constant-radius masked border demo, and some more text</p>
              </div>
            </AlertMaskCore>
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
  --_background-image: url("/images/rotating-carousel/image-2.webp");
  --_background-position: 0 0;

  background-image: var(--_background-image);
  background-size: cover;
  background-position: var(--_background-position);
  background-attachment: fixed;

  .test-mask-element {
    position: relative;
    margin-top: 100px;
    display: grid;
    justify-self: center;

    .alert-mask-core {
      &.test-alert {
        width: 600px;

        .alert-mask-content-slot {
          .some-local-class {
            color: white;
            padding: 1.2rem;
          }
        }
      }
    }
  }
}
</style>
