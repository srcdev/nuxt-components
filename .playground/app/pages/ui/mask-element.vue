<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Mask Element</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :style-class-passthrough="['test-mask-element', 'mbe-20']">
          <!-- SVG Mask Approach -->
          <div class="mask-element-wrapper">
            <svg class="mask-svg" viewBox="0 0 450 120" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="borderMask">
                  <!-- White area will be visible (outer shape with different corner radii) -->
                  <path
                    d="M 8 0
                           L 442 0
                           Q 450 0 450 4
                           L 450 116
                           Q 450 120 446 120
                           L 8 120
                           Q 0 120 0 112
                           L 0 8
                           Q 0 0 8 0 Z"
                    fill="white"
                  />
                  <!-- Black area will be transparent (inner cutout with matching corner radii) -->
                  <path
                    d="M 15 1
                           L 442 1
                           Q 449 1 449 4
                           L 449 116
                           Q 449 119 446 119
                           L 15 119
                           Q 8 119 8 112
                           L 8 8
                           Q 8 1 15 1 Z"
                    fill="black"
                  />
                </mask>
              </defs>
              <!-- The orange border -->
              <path
                d="M 8 0
                       L 442 0
                       Q 450 0 450 4
                       L 450 116
                       Q 450 120 446 120
                       L 8 120
                       Q 0 120 0 112
                       L 0 8
                       Q 0 0 8 0 Z"
                fill="var(--orange-8)"
                mask="url(#borderMask)"
              />
              <!-- Semi-transparent overlay in the cutout area -->
              <path
                d="M 15 1
                       L 442 1
                       Q 449 1 449 4
                       L 449 116
                       Q 449 119 446 119
                       L 15 119
                       Q 8 119 8 112
                       L 8 8
                       Q 8 1 15 1 Z"
                fill="rgba(0,0,0,0.8)"
              />
            </svg>

            <!-- Content area positioned over the SVG -->
            <div class="svg-content">
              <p>This is the content area with text that appears over the semi-transparent background.</p>
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

      width: 450px;
      height: 120px;
      position: absolute;
      inset-inline-start: 50%;
      transform: translateX(-50%);

      .mask-svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      .svg-content {
        position: absolute;
        /* Position to match the inner content area */
        left: var(--_thick-border-width);
        top: 1px;
        right: 1px;
        bottom: 1px;

        /* Styling for the content */
        padding: 8px 12px;

        /* Text styling */
        color: white;
        font-size: 14px;
        line-height: 1.3;

        /* Center content vertically and horizontally */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        /* Ensure content appears above the SVG */
        z-index: 10;

        p {
          margin: 0;

          & + p {
            margin-top: 12px;
          }
        }
      }
    }
  }
}
</style>
