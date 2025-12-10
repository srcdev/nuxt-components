<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Index</h2>
          <p class="page-body-normal">This is the index page for the QR Code component: {{ componentName }}</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <ul class="qr-code-index-links-list">
            <li><NuxtLink to="/ui/qr-code/display">Display QR Code</NuxtLink></li>
            <li><NuxtLink to="/ui/qr-code/capture">Capture QR Code</NuxtLink></li>
            <li><NuxtLink to="/ui/qr-code/decode">Decode QR Code</NuxtLink></li>
          </ul>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2 pbe-20">Display QR Code</h2>
          <div class="demo-panel">
            <div class="qr-code-col">
              <component :is="activeComponent" :key="componentName" v-bind="activeProps" />
            </div>
            <form v-if="componentName === 'display'">
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
import type { QrCodeVariant } from "~/types/components/qr-code" // Adjust the import path as needed

definePageMeta({
  layout: false,
})

useHead({
  title: "Index",
  meta: [
    {
      name: "description",
      content: "Index Meta description content",
    },
  ],
  bodyAttrs: {
    class: "qr-codes-index-page",
  },
})

const route = useRoute()

type QrComponentName = "decode" | "capture" | "display"
const componentName = computed<QrComponentName>(() => route.params.componentName as QrComponentName)

// Component set up
const DecodeQrCode = defineAsyncComponent(() => import("../../../../../app/components/qr-code/DecodeQrCode.vue"))
const CaptureQrCode = defineAsyncComponent(() => import("../../../../../app/components/qr-code/CaptureQrCode.vue"))
const DisplayQrCode = defineAsyncComponent(() => import("../../../../../app/components/qr-code/DisplayQrCode.vue"))

const components: Record<
  QrComponentName,
  {
    component: ReturnType<typeof defineAsyncComponent>
    props: () => Record<string, unknown>
  }
> = {
  decode: {
    component: DecodeQrCode,
    props: () => ({
      /* none needed */
    }),
  },
  capture: {
    component: CaptureQrCode,
    props: () => ({ facingMode: "environment" }),
  },
  display: {
    component: DisplayQrCode,
    props: () => ({
      qrValue: qrValue.value,
      variant: variant.value,
      radius: radius.value,
      blackColor: blackColor.value,
      whiteColor: whiteColor.value,
      size: size.value,
    }),
  },
}

// Config for display qr code
const qrValue = ref("P|7450952822|144392")
const variant = ref<QrCodeVariant>({
  inner: "circle",
  marker: "rounded",
  pixel: "dots",
})
const radius = ref(2)
const blackColor = ref("#000000")
const whiteColor = ref("#ffffff")
const sizeValue = ref(300)
const size = computed(() => `${sizeValue.value}px`)

const activeComponent = computed(() => components[componentName.value]?.component)
const activeProps = computed(() => components[componentName.value]?.props?.() ?? {})
</script>

<style lang="css">
.qr-codes-index-page {
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

  .qr-code-index-links-list {
    display: flex;
    gap: 12px;

    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}
</style>
