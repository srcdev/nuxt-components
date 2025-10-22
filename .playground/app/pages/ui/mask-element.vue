<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Mask Element</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :style-class-passthrough="['test-mask-element', 'mbe-20']">
          <!-- SVG Mask Approach -->
          <div class="mask-element-wrapper svg-approach">
            <svg class="mask-svg" viewBox="0 0 250 70" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="borderMask">
                  <!-- White area will be visible -->
                  <rect width="250" height="70" fill="white" rx="8" ry="8" />
                  <!-- Black area will be transparent (cut out) -->
                  <rect x="8" y="1" width="241" height="68" fill="black" rx="7" ry="7" />
                </mask>
              </defs>
              <!-- The orange border -->
              <rect width="250" height="70" fill="var(--orange-8)" mask="url(#borderMask)" rx="8" ry="8" />
              <!-- Semi-transparent overlay in the cutout area -->
              <rect x="8" y="1" width="241" height="68" fill="rgba(0,0,0,0.2)" rx="7" ry="7" />
            </svg>
          </div>

          <!-- Multi-Element Approach -->
          <div class="mask-element-wrapper multi-element-approach">
            <!-- Left thick border -->
            <div class="border-left"></div>
            <!-- Top border -->
            <div class="border-top"></div>
            <!-- Right border -->
            <div class="border-right"></div>
            <!-- Bottom border -->
            <div class="border-bottom"></div>
            <!-- Semi-transparent content area -->
            <div class="content-area"></div>
          </div>

          <!-- Original CSS Approach for comparison -->
          <div class="mask-element-wrapper css-approach">
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

      /* Position multiple approaches vertically */
      &.svg-approach {
        top: 0;
      }

      &.multi-element-approach {
        top: 100px;
      }

      &.css-approach {
        top: 200px;
      }

      /* SVG approach styles */
      &.svg-approach {
        .mask-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      /* Multi-element approach styles */
      &.multi-element-approach {
        .border-left,
        .border-top,
        .border-right,
        .border-bottom,
        .content-area {
          position: absolute;
          background-color: var(--orange-8);
        }

        .border-left {
          left: 0;
          top: 0;
          width: var(--_thick-border-width);
          height: 100%;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        .border-top {
          left: var(--_thick-border-width);
          top: 0;
          width: calc(100% - var(--_thick-border-width));
          height: 1px;
          border-top-right-radius: 4px;
        }

        .border-right {
          right: 0;
          top: 1px;
          width: 1px;
          height: calc(100% - 2px);
        }

        .border-bottom {
          left: var(--_thick-border-width);
          bottom: 0;
          width: calc(100% - var(--_thick-border-width));
          height: 1px;
          border-bottom-right-radius: 4px;
        }

        .content-area {
          left: var(--_thick-border-width);
          top: 1px;
          width: calc(100% - var(--_thick-border-width) - 1px);
          height: calc(100% - 2px);
          background-color: rgba(0, 0, 0, 0.2);
          border-top-right-radius: calc(4px - 1px);
          border-bottom-right-radius: calc(4px - 1px);
          border-top-left-radius: calc(8px - 1px);
          border-bottom-left-radius: calc(8px - 1px);
        }
      }

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

        position: relative;
        isolation: isolate;
        z-index: 0;

        /* Use ::before to create the inner content area */
        &::before {
          content: "";
          position: absolute;
          inset-block: 1px;
          inset-inline: var(--_thick-border-width) 1px;

          border-start-start-radius: calc(8px - 1px);
          border-end-start-radius: calc(8px - 1px);
          border-start-end-radius: calc(4px - 1px);
          border-end-end-radius: calc(4px - 1px);

          z-index: 1;

          /* Semi-transparent overlay - this is as close as we can get with pure CSS */
          background-color: rgba(0, 0, 0, 0.75);

          /* Note: This will blend with the orange background beneath,
             not show the page background. True transparency through
             to page content isn't possible while maintaining the solid border. */
        }
      }
    }
  }
}
</style>
