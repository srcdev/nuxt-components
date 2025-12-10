<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Display Qr Code</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Display Qr Code</h2>
          <div class="demo-panel">
            <div class="qr-code-col">
              <DisplayQrCode
                :qr-value
                :variant
                :radius
                :black-color
                :white-color
                :size
                :style-class-passthrough="['mbe-20']"
              />
            </div>
            <form>
              <div class="form-group mbe-12">
                <label for="qr-value-input">QR Code Value:</label>
                <input id="qr-value-input" v-model="qrValue" type="text" class="form-control" />
              </div>

              <div class="form-group mbe-12">
                <label for="inner-variant-select">Inner Variant:</label>
                <select id="inner-variant-select" v-model="variant.inner" class="form-control">
                  <option value="default">Default</option>
                  <option value="circle">Circle</option>
                  <option value="pixelated">Pixelated</option>
                  <option value="rounded">Rounded</option>
                  <option value="dots">Dots</option>
                </select>
              </div>

              <div class="form-group mbe-12">
                <label for="marker-variant-select">Marker Variant:</label>
                <select id="marker-variant-select" v-model="variant.marker" class="form-control">
                  <option value="default">Default</option>
                  <option value="circle">Circle</option>
                  <option value="pixelated">Pixelated</option>
                  <option value="rounded">Rounded</option>
                  <option value="dots">Dots</option>
                </select>
              </div>

              <div class="form-group mbe-12">
                <label for="pixel-variant-select">Pixel Variant:</label>
                <select id="pixel-variant-select" v-model="variant.pixel" class="form-control">
                  <option value="default">Default</option>
                  <option value="circle">Circle</option>
                  <option value="pixelated">Pixelated</option>
                  <option value="rounded">Rounded</option>
                  <option value="dots">Dots</option>
                </select>
              </div>

              <div class="form-group mbe-12">
                <label for="radius-input">Radius:</label>
                <input id="radius-input" v-model.number="radius" type="number" class="form-control" min="0" max="10" />
              </div>

              <div class="form-group mbe-12">
                <label for="black-color-input">Black Color:</label>
                <input id="black-color-input" v-model="blackColor" type="color" class="form-control" />
              </div>

              <div class="form-group mbe-12">
                <label for="white-color-input">White Color:</label>
                <input id="white-color-input" v-model="whiteColor" type="color" class="form-control" />
              </div>

              <div class="form-group mbe-12">
                <label for="size-slider">Size: {{ sizeValue }}px</label>
                <input
                  id="size-slider"
                  v-model.number="sizeValue"
                  type="range"
                  class="form-control"
                  min="150"
                  max="600"
                  step="25"
                />
              </div>
            </form>
          </div>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// import { type QrCodeVariant } from "../../../app/types"
definePageMeta({
  layout: false,
})

useHead({
  title: "Display Qr Code",
  meta: [
    {
      name: "description",
      content: "Display Qr Code Meta description content",
    },
  ],
  bodyAttrs: {
    class: "display-qr-code-page",
  },
})

const qrValue = ref("P|7450952822|144392")
const variant = ref({
  inner: "circle",
  marker: "rounded",
  pixel: "dots",
})
const radius = ref(2)
const blackColor = ref("#000000")
const whiteColor = ref("#ffffff")
const sizeValue = ref(300)
const size = computed(() => `${sizeValue.value}px`)
</script>

<style lang="css">
.display-qr-code-page {
  /* CSS styles */

  .demo-panel {
    display: flex;
    flex-direction: row-reverse;
    gap: 16px;
    align-items: start;

    .qr-code-col {
      flex-grow: 1;
    }

    form {
      .form-group {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 20px;
      }
    }
  }
}
</style>
